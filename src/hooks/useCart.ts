import { useCallback, useEffect, useState } from "react";
import {
  CART_UPDATED_EVENT,
  addToLocalCart,
  clearLocalCart,
  getLocalCart,
  removeFromLocalCart,
  updateLocalCartItem,
  type LocalCartItem,
} from "@/api/shop";

function readCount(items: LocalCartItem[]) {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}

/**
 * Reactive cart hook — subscribes to in-tab and cross-tab cart updates so any
 * component (Shop, ProductDetail, header badge, MerchandiseShowcase) stays in sync.
 */
export function useCart() {
  const [items, setItems] = useState<LocalCartItem[]>(() => getLocalCart());

  const refresh = useCallback(() => {
    setItems(getLocalCart());
  }, []);

  useEffect(() => {
    refresh();
    const onUpdate = () => refresh();
    const onStorage = (e: StorageEvent) => {
      if (e.key === "nesa_cart") refresh();
    };
    window.addEventListener(CART_UPDATED_EVENT, onUpdate);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, onUpdate);
      window.removeEventListener("storage", onStorage);
    };
  }, [refresh]);

  return {
    items,
    count: readCount(items),
    add: (productId: string, quantity = 1) => addToLocalCart(productId, quantity),
    update: (productId: string, quantity: number) => updateLocalCartItem(productId, quantity),
    remove: (productId: string) => removeFromLocalCart(productId),
    clear: () => clearLocalCart(),
    refresh,
  };
}
