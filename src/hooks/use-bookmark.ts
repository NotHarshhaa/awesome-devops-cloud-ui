import { useCallback, useEffect, useMemo, useState } from "react";
import { useAnalytics } from "./use-analytics";

interface UseBookmarksOptions {
  storageKey?: string;
  initialItems?: number[];
  maxBookmarks?: number;
}

export interface BookmarkData {
  id: number;
  name?: string;
  category?: string;
  timestamp: number;
}

interface UseBookmarksReturn {
  bookmarkedItems: number[];
  toggleBookmark: (id: number, name?: string, category?: string) => void;
  isBookmarked: (id: number) => boolean;
  clearBookmarks: () => void;
  bookmarkCount: number;
  bookmarkData: BookmarkData[];
  removeBookmark: (id: number) => void;
}

export function useBookmarks({
  storageKey = "bookmarkedItems",
  initialItems = [],
  maxBookmarks = 500,
}: UseBookmarksOptions = {}): UseBookmarksReturn {
  const { trackBookmark } = useAnalytics();

  const [bookmarkData, setBookmarkData] = useState<BookmarkData[]>(() => {
    if (typeof window === "undefined") return [];

    try {
      const storedBookmarks = localStorage.getItem(storageKey);
      if (!storedBookmarks)
        return initialItems.map((id) => ({ id, timestamp: Date.now() }));

      // Handle different storage formats (backwards compatibility)
      const parsed = JSON.parse(storedBookmarks);

      // If the stored data is an array of numbers (old format)
      if (
        Array.isArray(parsed) &&
        parsed.every((item) => typeof item === "number")
      ) {
        return parsed.map((id) => ({ id, timestamp: Date.now() }));
      }

      // If it's already in the new format
      if (
        Array.isArray(parsed) &&
        parsed.every((item) => typeof item === "object" && "id" in item)
      ) {
        return parsed;
      }

      // Fallback
      return initialItems.map((id) => ({ id, timestamp: Date.now() }));
    } catch (error) {
      console.warn(`Error loading bookmarks from localStorage:`, error);
      return initialItems.map((id) => ({ id, timestamp: Date.now() }));
    }
  });

  // Derive the bookmarkedItems array from bookmarkData for backward compatibility
  const bookmarkedItems = useMemo(() => {
    return bookmarkData.map((item) => item.id);
  }, [bookmarkData]);

  // Compute the bookmark count once
  const bookmarkCount = useMemo(() => {
    return bookmarkData.length;
  }, [bookmarkData]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      // Persist the full bookmark data
      localStorage.setItem(storageKey, JSON.stringify(bookmarkData));
    } catch (error) {
      console.warn(`Error saving bookmarks to localStorage:`, error);

      // If the error is likely due to localStorage quota, try pruning old bookmarks
      if (
        error instanceof DOMException &&
        (error.name === "QuotaExceededError" ||
          error.name === "NS_ERROR_DOM_QUOTA_REACHED")
      ) {
        // Sort by timestamp and keep only the most recent items
        const prunedData = [...bookmarkData]
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, Math.floor(maxBookmarks * 0.8)); // Keep 80% of max

        setBookmarkData(prunedData);
        console.log(
          `Pruned bookmarks to ${prunedData.length} items due to storage limits`,
        );
      }
    }
  }, [bookmarkData, storageKey, maxBookmarks]);

  const toggleBookmark = useCallback(
    (id: number, name?: string, category?: string) => {
      setBookmarkData((prevData) => {
        const isCurrentlyBookmarked = prevData.some((item) => item.id === id);

        // Track the bookmark action with analytics
        trackBookmark(id, name || `Resource ${id}`, !isCurrentlyBookmarked);

        if (isCurrentlyBookmarked) {
          // Remove bookmark
          return prevData.filter((item) => item.id !== id);
        } else {
          // Add bookmark with metadata and timestamp
          const newBookmark: BookmarkData = {
            id,
            name,
            category,
            timestamp: Date.now(),
          };

          // If we're at max capacity, remove the oldest bookmark
          if (prevData.length >= maxBookmarks) {
            const sortedData = [...prevData].sort(
              (a, b) => a.timestamp - b.timestamp,
            );
            return [...sortedData.slice(1), newBookmark];
          }

          return [...prevData, newBookmark];
        }
      });
    },
    [maxBookmarks, trackBookmark],
  );

  const removeBookmark = useCallback((id: number) => {
    setBookmarkData((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const isBookmarked = useCallback(
    (id: number) => bookmarkData.some((item) => item.id === id),
    [bookmarkData],
  );

  const clearBookmarks = useCallback(() => {
    setBookmarkData([]);

    // Track clearing all bookmarks
    trackBookmark(0, "All Bookmarks", false);
  }, [trackBookmark]);

  return {
    bookmarkedItems,
    toggleBookmark,
    isBookmarked,
    clearBookmarks,
    bookmarkCount,
    bookmarkData,
    removeBookmark,
  };
}
