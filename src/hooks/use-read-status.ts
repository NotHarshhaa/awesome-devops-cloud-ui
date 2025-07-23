import { useCallback } from "react";
import { useLocalStorage } from "./use-local-storage";

interface UseReadStatusOptions {
  storageKey?: string;
}

export function useReadStatus(options: UseReadStatusOptions = {}) {
  const { storageKey = "readItems" } = options;

  // Store the IDs of unread items
  const [unreadItems, setUnreadItems] = useLocalStorage<number[]>(
    storageKey,
    []
  );

  // Check if an item is read (not in the unread list)
  const isRead = useCallback(
    (id: number) => !unreadItems.includes(id),
    [unreadItems]
  );

  // Mark an item as read (remove from unread list)
  const markAsRead = useCallback(
    (id: number) => {
      setUnreadItems((prev) => prev.filter((itemId) => itemId !== id));
    },
    [setUnreadItems]
  );

  // Mark an item as unread (add to unread list)
  const markAsUnread = useCallback(
    (id: number) => {
      if (!unreadItems.includes(id)) {
        setUnreadItems((prev) => [...prev, id]);
      }
    },
    [unreadItems, setUnreadItems]
  );

  // Toggle read status
  const toggleReadStatus = useCallback(
    (id: number) => {
      if (isRead(id)) {
        markAsUnread(id);
      } else {
        markAsRead(id);
      }
    },
    [isRead, markAsRead, markAsUnread]
  );

  // Mark multiple items as read
  const markMultipleAsRead = useCallback(
    (ids: number[]) => {
      setUnreadItems((prev) =>
        prev.filter((itemId) => !ids.includes(itemId))
      );
    },
    [setUnreadItems]
  );

  // Mark all items as read
  const markAllAsRead = useCallback(() => {
    setUnreadItems([]);
  }, [setUnreadItems]);

  // Get count of unread items
  const unreadCount = unreadItems.length;

  return {
    unreadItems,
    isRead,
    markAsRead,
    markAsUnread,
    toggleReadStatus,
    markMultipleAsRead,
    markAllAsRead,
    unreadCount,
  };
}
