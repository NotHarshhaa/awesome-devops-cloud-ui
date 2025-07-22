import { useCallback, useEffect, useMemo, useState } from "react";
import { useAnalytics } from "./use-analytics";
import { toast } from "sonner";

export interface Resource {
  id: number;
  name: string;
  description: string;
  url: string;
  category: string;
  date: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  items: number[];
  createdAt: number;
  updatedAt: number;
  isPublic?: boolean;
  shareId?: string;
  shareExpiry?: number; // Optional expiration timestamp for shared collections
  sharePassword?: string; // Optional password for protected collections
  color?: string; // Optional color for visual organization
  pinned?: boolean; // Allow pinning collections to top
  tags?: string[]; // Optional tags for organizing collections
}

interface UseCollectionsOptions {
  storageKey?: string;
}

interface UseCollectionsReturn {
  collections: Collection[];
  pinnedCollections: Collection[];
  recentCollections: Collection[];
  addCollection: (
    name: string,
    description: string,
    options?: Partial<
      Omit<
        Collection,
        "id" | "name" | "description" | "items" | "createdAt" | "updatedAt"
      >
    >,
  ) => string;
  removeCollection: (collectionId: string) => void;
  updateCollection: (collection: Collection) => void;
  getCollection: (collectionId: string) => Collection | undefined;
  addToCollection: (collectionId: string, resourceId: number) => void;
  removeFromCollection: (collectionId: string, resourceId: number) => void;
  addMultipleToCollection: (
    collectionId: string,
    resourceIds: number[],
  ) => void;
  isInCollection: (collectionId: string, resourceId: number) => boolean;
  togglePinCollection: (collectionId: string) => void;
  duplicateCollection: (collectionId: string) => string;
  makeCollectionPublic: (
    collectionId: string,
    options?: { expiryDays?: number; password?: string },
  ) => string;
  makeCollectionPrivate: (collectionId: string) => void;
  getShareableLink: (collectionId: string) => string | null;
  sortCollections: (sortBy: "name" | "date" | "size") => void;
  searchCollections: (query: string) => Collection[];
  getCollectionStats: (collectionId: string) => {
    size: number;
    lastUpdated: Date;
    categories: Record<string, number>;
  };
}

export function useCollections({
  storageKey = "devops-resource-collections",
}: UseCollectionsOptions = {}): UseCollectionsReturn {
  const { trackEvent } = useAnalytics();
  const [collections, setCollections] = useState<Collection[]>(() => {
    if (typeof window === "undefined") return [];

    try {
      const storedCollections = localStorage.getItem(storageKey);

      // Parse stored collections and handle schema migrations
      const parsed = storedCollections ? JSON.parse(storedCollections) : [];

      // Add validation and default values for all collections
      return parsed.map((collection: any) => ({
        id: collection.id || generateId(),
        name: collection.name || "Untitled Collection",
        description: collection.description || "",
        items: Array.isArray(collection.items) ? collection.items : [],
        createdAt: collection.createdAt || Date.now(),
        updatedAt: collection.updatedAt || Date.now(),
        isPublic: collection.isPublic || false,
        shareId: collection.shareId || undefined,
        shareExpiry: collection.shareExpiry || undefined,
        sharePassword: collection.sharePassword || undefined,
        color: collection.color || undefined,
        pinned: collection.pinned || false,
        tags: Array.isArray(collection.tags) ? collection.tags : [],
      }));
    } catch (error) {
      console.warn(`Error loading collections from localStorage:`, error);
      return [];
    }
  });

  // Derived state for pinned and recent collections using memoization
  const pinnedCollections = useMemo(
    () => collections.filter((c) => c.pinned),
    [collections],
  );

  const recentCollections = useMemo(
    () =>
      [...collections].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 5),
    [collections],
  );

  // Persist collections to localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(storageKey, JSON.stringify(collections));
    } catch (error) {
      console.warn(`Error saving collections to localStorage:`, error);
      toast.error("Failed to save your collections. Storage may be full.");
    }
  }, [collections, storageKey]);

  // Generate a unique ID for collections
  const generateId = useCallback(() => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
  }, []);

  // Add a new collection with additional options
  const addCollection = useCallback(
    (
      name: string,
      description: string,
      options?: Partial<
        Omit<
          Collection,
          "id" | "name" | "description" | "items" | "createdAt" | "updatedAt"
        >
      >,
    ): string => {
      // Validate input
      if (!name.trim()) {
        toast.error("Collection name cannot be empty");
        throw new Error("Collection name cannot be empty");
      }

      const id = generateId();
      const timestamp = Date.now();

      const newCollection: Collection = {
        id,
        name: name.trim(),
        description: description.trim(),
        items: [],
        createdAt: timestamp,
        updatedAt: timestamp,
        ...options,
      };

      setCollections((prev) => [...prev, newCollection]);

      trackEvent({
        category: "collection",
        action: "create",
        label: name,
        value: options?.pinned ? 1 : 0,
      });

      toast.success(`Collection "${name}" created!`);
      return id;
    },
    [generateId, trackEvent],
  );

  // Duplicate an existing collection
  const duplicateCollection = useCallback(
    (collectionId: string): string => {
      const collection = collections.find((c) => c.id === collectionId);

      if (!collection) {
        toast.error("Collection not found");
        return "";
      }

      const id = generateId();
      const timestamp = Date.now();

      const newCollection: Collection = {
        ...collection,
        id,
        name: `${collection.name} (Copy)`,
        createdAt: timestamp,
        updatedAt: timestamp,
        isPublic: false, // Reset sharing status for the duplicate
        shareId: undefined,
        shareExpiry: undefined,
        sharePassword: undefined,
      };

      setCollections((prev) => [...prev, newCollection]);

      trackEvent({
        category: "collection",
        action: "duplicate",
        label: collection.name,
        value: collection.items.length,
      });

      toast.success(`Collection duplicated: "${newCollection.name}"`);
      return id;
    },
    [collections, generateId, trackEvent],
  );

  // Remove a collection
  const removeCollection = useCallback(
    (collectionId: string) => {
      setCollections((prev) => {
        const collection = prev.find((c) => c.id === collectionId);
        if (collection) {
          trackEvent({
            category: "collection",
            action: "delete",
            label: collection.name,
          });
        }
        return prev.filter((c) => c.id !== collectionId);
      });
      toast.success("Collection removed");
    },
    [trackEvent],
  );

  // Update a collection
  const updateCollection = useCallback(
    (updatedCollection: Collection) => {
      setCollections((prev) =>
        prev.map((c) =>
          c.id === updatedCollection.id
            ? { ...updatedCollection, updatedAt: Date.now() }
            : c,
        ),
      );

      trackEvent({
        category: "collection",
        action: "update",
        label: updatedCollection.name,
      });
    },
    [trackEvent],
  );

  // Get a collection by ID
  const getCollection = useCallback(
    (collectionId: string) => {
      return collections.find((c) => c.id === collectionId);
    },
    [collections],
  );

  // Add a resource to a collection
  const addToCollection = useCallback(
    (collectionId: string, resourceId: number) => {
      setCollections((prev) =>
        prev.map((c) => {
          if (c.id === collectionId) {
            // Only add if not already in collection
            if (!c.items.includes(resourceId)) {
              trackEvent({
                category: "collection",
                action: "add_item",
                label: c.name,
                value: resourceId,
              });

              toast.success(`Added to "${c.name}" collection`);
              return {
                ...c,
                items: [...c.items, resourceId],
                updatedAt: Date.now(),
              };
            }
          }
          return c;
        }),
      );
    },
    [trackEvent],
  );

  // Add multiple resources to a collection at once
  const addMultipleToCollection = useCallback(
    (collectionId: string, resourceIds: number[]) => {
      if (!resourceIds.length) return;

      setCollections((prev) =>
        prev.map((c) => {
          if (c.id === collectionId) {
            // Filter out already existing items
            const newItems = resourceIds.filter((id) => !c.items.includes(id));

            if (newItems.length) {
              trackEvent({
                category: "collection",
                action: "add_multiple_items",
                label: c.name,
                value: newItems.length,
              });

              toast.success(
                `Added ${newItems.length} items to "${c.name}" collection`,
              );
              return {
                ...c,
                items: [...c.items, ...newItems],
                updatedAt: Date.now(),
              };
            }
          }
          return c;
        }),
      );
    },
    [trackEvent],
  );

  // Remove a resource from a collection
  const removeFromCollection = useCallback(
    (collectionId: string, resourceId: number) => {
      setCollections((prev) =>
        prev.map((c) => {
          if (c.id === collectionId) {
            trackEvent({
              category: "collection",
              action: "remove_item",
              label: c.name,
              value: resourceId,
            });

            return {
              ...c,
              items: c.items.filter((id) => id !== resourceId),
              updatedAt: Date.now(),
            };
          }
          return c;
        }),
      );
    },
    [trackEvent],
  );

  // Check if a resource is in a collection
  const isInCollection = useCallback(
    (collectionId: string, resourceId: number) => {
      const collection = collections.find((c) => c.id === collectionId);
      return collection ? collection.items.includes(resourceId) : false;
    },
    [collections],
  );

  // Toggle pin status for a collection
  const togglePinCollection = useCallback(
    (collectionId: string) => {
      setCollections((prev) =>
        prev.map((c) => {
          if (c.id === collectionId) {
            const newPinnedState = !c.pinned;

            trackEvent({
              category: "collection",
              action: newPinnedState ? "pin" : "unpin",
              label: c.name,
            });

            toast.success(
              newPinnedState
                ? `Collection "${c.name}" pinned to top`
                : `Collection "${c.name}" unpinned`,
            );

            return {
              ...c,
              pinned: newPinnedState,
              updatedAt: Date.now(),
            };
          }
          return c;
        }),
      );
    },
    [trackEvent],
  );

  // Make a collection public with a shareable ID and optional settings
  const makeCollectionPublic = useCallback(
    (
      collectionId: string,
      options?: { expiryDays?: number; password?: string },
    ): string => {
      const shareId = generateId();
      const now = Date.now();

      // Calculate expiry date if specified
      const shareExpiry = options?.expiryDays
        ? now + options.expiryDays * 24 * 60 * 60 * 1000
        : undefined;

      // Hash password if provided (in a real app, use proper hashing)
      const sharePassword = options?.password || undefined;

      setCollections((prev) =>
        prev.map((c) => {
          if (c.id === collectionId) {
            trackEvent({
              category: "collection",
              action: "make_public",
              label: c.name,
              value: shareExpiry ? 1 : 0,
            });

            return {
              ...c,
              isPublic: true,
              shareId,
              shareExpiry,
              sharePassword,
              updatedAt: now,
            };
          }
          return c;
        }),
      );

      toast.success(
        shareExpiry
          ? `Collection is now shareable (expires in ${options?.expiryDays} days)`
          : "Collection is now shareable",
      );
      return shareId;
    },
    [generateId, trackEvent],
  );

  // Make a collection private
  const makeCollectionPrivate = useCallback(
    (collectionId: string) => {
      setCollections((prev) =>
        prev.map((c) => {
          if (c.id === collectionId) {
            trackEvent({
              category: "collection",
              action: "make_private",
              label: c.name,
            });

            // Keep the shareId but mark as not public
            return {
              ...c,
              isPublic: false,
              updatedAt: Date.now(),
            };
          }
          return c;
        }),
      );

      toast.success("Collection is now private");
    },
    [trackEvent],
  );

  // Get a shareable link for a collection
  const getShareableLink = useCallback(
    (collectionId: string): string | null => {
      const collection = collections.find((c) => c.id === collectionId);

      // Check if collection exists, is public, and has a share ID
      if (!collection || !collection.isPublic || !collection.shareId) {
        return null;
      }

      // Check if the share link has expired
      if (collection.shareExpiry && collection.shareExpiry < Date.now()) {
        // Auto-update the collection to private since it's expired
        setCollections((prev) =>
          prev.map((c) => {
            if (c.id === collectionId) {
              return {
                ...c,
                isPublic: false,
              };
            }
            return c;
          }),
        );
        return null;
      }

      const baseUrl =
        typeof window !== "undefined" ? window.location.origin : "";
      const url = `${baseUrl}/collection/${collection.shareId}`;

      // If password protected, add a flag to the URL
      if (collection.sharePassword) {
        return `${url}?protected=true`;
      }

      return url;
    },
    [collections],
  );

  // Sort collections by different criteria
  const sortCollections = useCallback(
    (sortBy: "name" | "date" | "size") => {
      setCollections((prev) => {
        const sortedCollections = [...prev];

        switch (sortBy) {
          case "name":
            sortedCollections.sort((a, b) => a.name.localeCompare(b.name));
            break;

          case "date":
            sortedCollections.sort((a, b) => b.updatedAt - a.updatedAt);
            break;

          case "size":
            sortedCollections.sort((a, b) => b.items.length - a.items.length);
            break;

          default:
            return prev;
        }

        // Keep pinned collections at the top
        return [
          ...sortedCollections.filter((c) => c.pinned),
          ...sortedCollections.filter((c) => !c.pinned),
        ];
      });

      trackEvent({
        category: "collection",
        action: "sort",
        label: sortBy,
      });
    },
    [trackEvent],
  );

  // Search collections by name, description or tags
  const searchCollections = useCallback(
    (query: string): Collection[] => {
      if (!query.trim()) return collections;

      const lowerQuery = query.toLowerCase().trim();

      return collections.filter(
        (collection) =>
          collection.name.toLowerCase().includes(lowerQuery) ||
          (collection.description &&
            collection.description.toLowerCase().includes(lowerQuery)) ||
          (collection.tags &&
            collection.tags.some((tag) =>
              tag.toLowerCase().includes(lowerQuery),
            )),
      );
    },
    [collections],
  );

  // Get statistics for a collection
  const getCollectionStats = useCallback(
    (collectionId: string) => {
      const collection = collections.find((c) => c.id === collectionId);

      return {
        size: collection?.items.length || 0,
        lastUpdated: new Date(collection?.updatedAt || Date.now()),
        categories: {} as Record<string, number>, // In a real app, fetch category information from resources
      };
    },
    [collections],
  );

  return {
    collections,
    pinnedCollections,
    recentCollections,
    addCollection,
    removeCollection,
    updateCollection,
    getCollection,
    addToCollection,
    removeFromCollection,
    addMultipleToCollection,
    isInCollection,
    togglePinCollection,
    duplicateCollection,
    makeCollectionPublic,
    makeCollectionPrivate,
    getShareableLink,
    sortCollections,
    searchCollections,
    getCollectionStats,
  };
}
