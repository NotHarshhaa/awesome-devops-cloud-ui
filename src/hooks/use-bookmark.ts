import { useCallback, useEffect, useState } from "react";

interface UseBookmarksOptions {
  storageKey?: string;
  initialItems?: number[];
}

interface UseBookmarksReturn {
  bookmarkedItems: number[];
  toggleBookmark: (id: number) => void;
  isBookmarked: (id: number) => boolean;
  clearBookmarks: () => void;
}

export function useBookmarks({
  storageKey = "bookmarkedItems",
  initialItems = [],
}: UseBookmarksOptions = {}): UseBookmarksReturn {
  const [bookmarkedItems, setBookmarkedItems] = useState<number[]>(() => {
    try {
      const storedBookmarks = localStorage.getItem(storageKey);
      return storedBookmarks ? JSON.parse(storedBookmarks) : initialItems;
    } catch (error) {
      console.warn(`Error loading bookmarks from localStorage:`, error);
      return initialItems;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(bookmarkedItems));
    } catch (error) {
      console.warn(`Error saving bookmarks to localStorage:`, error);
    }
  }, [bookmarkedItems, storageKey]);

  const toggleBookmark = useCallback((id: number) => {
    setBookmarkedItems((prevBookmarks) => {
      const newBookmarks = prevBookmarks.includes(id)
        ? prevBookmarks.filter((bookmarkId) => bookmarkId !== id)
        : [...prevBookmarks, id];
      return newBookmarks;
    });
  }, []);

  const isBookmarked = useCallback(
    (id: number) => bookmarkedItems.includes(id),
    [bookmarkedItems]
  );

  const clearBookmarks = useCallback(() => {
    setBookmarkedItems([]);
  }, []);

  return { bookmarkedItems, toggleBookmark, isBookmarked, clearBookmarks };
}
