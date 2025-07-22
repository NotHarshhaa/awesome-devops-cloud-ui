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
}

interface UseCollectionsOptions {
  storageKey?: string;
}

interface UseCollectionsReturn {
  collections: Collection[];
  addCollection: (name: string, description: string) => string;
  removeCollection: (collectionId: string) => void;
  updateCollection: (collection: Collection) => void;
  getCollection: (collectionId: string) => Collection | undefined;
  addToCollection: (collectionId: string, resourceId: number) => void;
  removeFromCollection: (collectionId: string, resourceId: number) => void;
  isInCollection: (collectionId: string, resourceId: number) => boolean;
  makeCollectionPublic: (collectionId: string) => string;
  makeCollectionPrivate: (collectionId: string) => void;
  getShareableLink: (collectionId: string) => string | null;
}

export function useCollections({
  storageKey = "devops-resource-collections",
}: UseCollectionsOptions = {}): UseCollectionsReturn {
  const { trackEvent } = useAnalytics();
  const [collections, setCollections] = useState<Collection[]>(() => {
    if (typeof window === "undefined") return [];

    try {
      const storedCollections = localStorage.getItem(storageKey);
      return storedCollections ? JSON.parse(storedCollections) : [];
    } catch (error) {
      console.warn(`Error loading collections from localStorage:`, error);
      return [];
    }
  });

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

  // Add a new collection
  const addCollection = useCallback(
    (name: string, description: string): string => {
      const id = generateId();
      const newCollection: Collection = {
        id,
        name,
        description,
        items: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      setCollections((prev) => [...prev, newCollection]);

      trackEvent({
        category: "collection",
        action: "create",
        label: name,
      });

      toast.success(`Collection "${name}" created!`);
      return id;
    },
    [generateId, trackEvent]
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
    [trackEvent]
  );

  // Update a collection
  const updateCollection = useCallback(
    (updatedCollection: Collection) => {
      setCollections((prev) =>
        prev.map((c) =>
          c.id === updatedCollection.id
            ? { ...updatedCollection, updatedAt: Date.now() }
            : c
        )
      );

      trackEvent({
        category: "collection",
        action: "update",
        label: updatedCollection.name,
      });
    },
    [trackEvent]
  );

  // Get a collection by ID
  const getCollection = useCallback(
    (collectionId: string) => {
      return collections.find((c) => c.id === collectionId);
    },
    [collections]
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
        })
      );
    },
    [trackEvent]
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
        })
      );
    },
    [trackEvent]
  );

  // Check if a resource is in a collection
  const isInCollection = useCallback(
    (collectionId: string, resourceId: number) => {
      const collection = collections.find((c) => c.id === collectionId);
      return collection ? collection.items.includes(resourceId) : false;
    },
    [collections]
  );

  // Make a collection public with a shareable ID
  const makeCollectionPublic = useCallback(
    (collectionId: string): string => {
      const shareId = generateId();

      setCollections((prev) =>
        prev.map((c) => {
          if (c.id === collectionId) {
            trackEvent({
              category: "collection",
              action: "make_public",
              label: c.name,
            });

            return {
              ...c,
              isPublic: true,
              shareId,
              updatedAt: Date.now(),
            };
          }
          return c;
        })
      );

      toast.success("Collection is now shareable");
      return shareId;
    },
    [generateId, trackEvent]
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
        })
      );

      toast.success("Collection is now private");
    },
    [trackEvent]
  );

  // Get a shareable link for a collection
  const getShareableLink = useCallback(
    (collectionId: string): string | null => {
      const collection = collections.find((c) => c.id === collectionId);
      if (collection && collection.isPublic && collection.shareId) {
        const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
        return `${baseUrl}/collection/${collection.shareId}`;
      }
      return null;
    },
    [collections]
  );

  return {
    collections,
    addCollection,
    removeCollection,
    updateCollection,
    getCollection,
    addToCollection,
    removeFromCollection,
    isInCollection,
    makeCollectionPublic,
    makeCollectionPrivate,
    getShareableLink,
  };
}
