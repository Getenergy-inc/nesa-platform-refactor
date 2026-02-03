import { useState, useEffect, useCallback } from "react";

const WATCHLIST_KEY = "nesa-watchlist";
const MAX_WATCHLIST_SIZE = 50;

export interface WatchlistItem {
  id: string;
  slug: string;
  name: string;
  type: "nominee" | "award" | "category";
  addedAt: string;
  imageUrl?: string;
  subtitle?: string;
}

/**
 * useWatchlist - localStorage-based follow/watchlist system
 * 
 * Allows users to follow nominees, awards, or categories
 * to create a personalized return experience.
 */
export function useWatchlist() {
  const [items, setItems] = useState<WatchlistItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(WATCHLIST_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load watchlist:", e);
    }
  }, []);

  // Save to localStorage whenever items change
  const saveToStorage = useCallback((newItems: WatchlistItem[]) => {
    try {
      localStorage.setItem(WATCHLIST_KEY, JSON.stringify(newItems));
    } catch (e) {
      console.error("Failed to save watchlist:", e);
    }
  }, []);

  const addToWatchlist = useCallback((item: Omit<WatchlistItem, "addedAt">) => {
    setItems((prev) => {
      // Check if already in watchlist
      if (prev.some((i) => i.id === item.id && i.type === item.type)) {
        return prev;
      }

      const newItem: WatchlistItem = {
        ...item,
        addedAt: new Date().toISOString(),
      };

      // Add to beginning, trim if needed
      const newItems = [newItem, ...prev].slice(0, MAX_WATCHLIST_SIZE);
      saveToStorage(newItems);
      return newItems;
    });
  }, [saveToStorage]);

  const removeFromWatchlist = useCallback((id: string, type: WatchlistItem["type"]) => {
    setItems((prev) => {
      const newItems = prev.filter((i) => !(i.id === id && i.type === type));
      saveToStorage(newItems);
      return newItems;
    });
  }, [saveToStorage]);

  const isInWatchlist = useCallback((id: string, type: WatchlistItem["type"]) => {
    return items.some((i) => i.id === id && i.type === type);
  }, [items]);

  const toggleWatchlist = useCallback((item: Omit<WatchlistItem, "addedAt">) => {
    if (isInWatchlist(item.id, item.type)) {
      removeFromWatchlist(item.id, item.type);
      return false;
    } else {
      addToWatchlist(item);
      return true;
    }
  }, [isInWatchlist, addToWatchlist, removeFromWatchlist]);

  const clearWatchlist = useCallback(() => {
    setItems([]);
    saveToStorage([]);
  }, [saveToStorage]);

  const getByType = useCallback((type: WatchlistItem["type"]) => {
    return items.filter((i) => i.type === type);
  }, [items]);

  return {
    items,
    nominees: getByType("nominee"),
    awards: getByType("award"),
    categories: getByType("category"),
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    toggleWatchlist,
    clearWatchlist,
    count: items.length,
  };
}

export default useWatchlist;
