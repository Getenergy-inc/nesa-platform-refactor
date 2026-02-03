import { useState, useEffect, useCallback } from "react";

const RECENTLY_VIEWED_KEY = "nesa-recently-viewed";
const MAX_RECENT_ITEMS = 10;

export interface RecentlyViewedItem {
  id: string;
  slug: string;
  name: string;
  type: "nominee" | "award" | "category";
  viewedAt: string;
  imageUrl?: string;
  subtitle?: string;
}

/**
 * useRecentlyViewed - localStorage-based view history tracking
 * 
 * Tracks recently viewed items to enable "Continue Where You Left Off"
 * functionality for returning visitors.
 */
export function useRecentlyViewed() {
  const [items, setItems] = useState<RecentlyViewedItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load recently viewed:", e);
    }
  }, []);

  // Save to localStorage whenever items change
  const saveToStorage = useCallback((newItems: RecentlyViewedItem[]) => {
    try {
      localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(newItems));
    } catch (e) {
      console.error("Failed to save recently viewed:", e);
    }
  }, []);

  const addToRecentlyViewed = useCallback((item: Omit<RecentlyViewedItem, "viewedAt">) => {
    setItems((prev) => {
      // Remove existing entry for same item
      const filtered = prev.filter((i) => !(i.id === item.id && i.type === item.type));

      const newItem: RecentlyViewedItem = {
        ...item,
        viewedAt: new Date().toISOString(),
      };

      // Add to beginning, trim to max size
      const newItems = [newItem, ...filtered].slice(0, MAX_RECENT_ITEMS);
      saveToStorage(newItems);
      return newItems;
    });
  }, [saveToStorage]);

  const clearRecentlyViewed = useCallback(() => {
    setItems([]);
    saveToStorage([]);
  }, [saveToStorage]);

  const getByType = useCallback((type: RecentlyViewedItem["type"]) => {
    return items.filter((i) => i.type === type);
  }, [items]);

  const getMostRecent = useCallback((count: number = 5) => {
    return items.slice(0, count);
  }, [items]);

  return {
    items,
    nominees: getByType("nominee"),
    awards: getByType("award"),
    categories: getByType("category"),
    addToRecentlyViewed,
    clearRecentlyViewed,
    getMostRecent,
    count: items.length,
    hasHistory: items.length > 0,
  };
}

export default useRecentlyViewed;
