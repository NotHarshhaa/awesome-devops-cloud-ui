import { useCallback } from "react";
import { useLocalStorage } from "./use-local-storage";

interface UseViewCountOptions {
  storageKey?: string;
}

export function useViewCount(options: UseViewCountOptions = {}) {
  const { storageKey = "viewCounts" } = options;

  // Store view counts for each item ID
  const [viewCounts, setViewCounts] = useLocalStorage<Record<number, number>>(
    storageKey,
    {}
  );

  // Get view count for a specific item
  const getViewCount = useCallback(
    (id: number) => viewCounts[id] || 0,
    [viewCounts]
  );

  // Increment view count for an item
  const incrementViewCount = useCallback(
    (id: number) => {
      setViewCounts((prev) => ({
        ...prev,
        [id]: (prev[id] || 0) + 1,
      }));
    },
    [setViewCounts]
  );

  // Set a specific view count for an item
  const setViewCount = useCallback(
    (id: number, count: number) => {
      setViewCounts((prev) => ({
        ...prev,
        [id]: count,
      }));
    },
    [setViewCounts]
  );

  // Reset view count for an item
  const resetViewCount = useCallback(
    (id: number) => {
      setViewCounts((prev) => {
        const newCounts = { ...prev };
        delete newCounts[id];
        return newCounts;
      });
    },
    [setViewCounts]
  );

  // Reset all view counts
  const resetAllViewCounts = useCallback(() => {
    setViewCounts({});
  }, [setViewCounts]);

  // Get total views across all items
  const getTotalViews = useCallback(
    () => Object.values(viewCounts).reduce((sum, count) => sum + count, 0),
    [viewCounts]
  );

  // Get most viewed items (with optional limit)
  const getMostViewedItems = useCallback(
    (limit?: number) => {
      const entries = Object.entries(viewCounts).map(([id, count]) => ({
        id: Number(id),
        count,
      }));

      const sorted = entries.sort((a, b) => b.count - a.count);
      return limit ? sorted.slice(0, limit) : sorted;
    },
    [viewCounts]
  );

  return {
    viewCounts,
    getViewCount,
    incrementViewCount,
    setViewCount,
    resetViewCount,
    resetAllViewCounts,
    getTotalViews,
    getMostViewedItems,
  };
}
