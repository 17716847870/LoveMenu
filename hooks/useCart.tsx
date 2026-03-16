"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
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

interface CartContextType {
  items: CartItem[];
  totals: { kiss: number; hug: number };
  addItem: (dish: Dish) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateNote: (itemId: string, note: string) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [items, setItems] = useState<CartItem[]>(() => loadItems());
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
      setItems(loadItems());
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem(storageKey, JSON.stringify(items));
    }
  }, [items, isMounted]);

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

  return (
    <CartContext.Provider
      value={{
        items,
        totals,
        addItem,
        updateQuantity,
        updateNote,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
