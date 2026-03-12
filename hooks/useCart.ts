"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CartItem, Dish } from "@/types";

const storageKey = "lovemenu-cart";

const loadItems = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to load cart", e);
    return [];
  }
};

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>(() => loadItems());

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, JSON.stringify(items));
    }
  }, [items]);

  const addItem = useCallback((dish: Dish) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.dish.id === dish.id);
      if (existing) {
        return prev.map((item) =>
          item.dish.id === dish.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          id: `${dish.id}-${Date.now()}`,
          dish: dish,
          quantity: 1,
          note: "",
        },
      ];
    });
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const updateNote = useCallback((itemId: string, note: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, note } : item
      )
    );
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totals = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        acc.kiss += item.dish.kissPrice * item.quantity;
        acc.hug += item.dish.hugPrice * item.quantity;
        return acc;
      },
      { kiss: 0, hug: 0 }
    );
  }, [items]);

  return {
    items,
    totals,
    addItem,
    updateQuantity,
    updateNote,
    removeItem,
    clearCart,
  };
};
