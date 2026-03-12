"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CartItem, Dish } from "../types";

const storageKey = "lovemenu-cart";

const loadItems = () => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(storageKey);
  return stored ? (JSON.parse(stored) as CartItem[]) : [];
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
      const existing = prev.find((item) => item.dishId === dish.id);
      if (existing) {
        return prev.map((item) =>
          item.dishId === dish.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [
        ...prev,
        {
          id: `${dish.id}-${Date.now()}`,
          dishId: dish.id,
          name: dish.name,
          kissPrice: dish.kissPrice,
          hugPrice: dish.hugPrice,
          quantity: 1,
        },
      ];
    });
  }, []);

  const updateQuantity = useCallback((dishId: string, quantity: number) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.dishId === dishId ? { ...item, quantity } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }, []);

  const removeItem = useCallback((dishId: string) => {
    setItems((prev) => prev.filter((item) => item.dishId !== dishId));
  }, []);

  const totals = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        acc.kiss += item.kissPrice * item.quantity;
        acc.hug += item.hugPrice * item.quantity;
        return acc;
      },
      { kiss: 0, hug: 0 },
    );
  }, [items]);

  return {
    items,
    totals,
    addItem,
    updateQuantity,
    removeItem,
  };
};
