"use client";

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect, useRef } from "react";
import { CartItem, Dish } from "@/types";
import { useUser } from "@/context/UserContext";

const LOCAL_CART_KEY = "lovemenu-local-cart";
const CART_VERSION = "v1";

interface LocalCartData {
  version: string;
  items: CartItem[];
  lastUpdated: number;
}

interface CartContextType {
  items: CartItem[];
  totals: { kiss: number; hug: number };
  addItem: (dish: Dish) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  updateNote: (itemId: string, note: string) => void;
  clearCart: () => void;
  isLoading: boolean;
  isSyncing: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function loadCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(LOCAL_CART_KEY);
    if (!stored) return [];
    const data: LocalCartData = JSON.parse(stored);
    if (data.version !== CART_VERSION) return [];
    return data.items || [];
  } catch {
    return [];
  }
}

function saveCartToStorage(items: CartItem[]) {
  if (typeof window === "undefined") return;
  const data: LocalCartData = {
    version: CART_VERSION,
    items,
    lastUpdated: Date.now(),
  };
  localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(data));
}

async function syncCartToServer(userId: string, items: CartItem[], onProgress?: (done: number, total: number) => void) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    await fetch(`${baseUrl}/api/cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        dishId: item.dish.id,
        quantity: item.quantity,
      }),
    });
    onProgress?.(i + 1, items.length);
  }
}

async function clearServerCart(userId: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  await fetch(`${baseUrl}/api/cart?userId=${userId}`, {
    method: "DELETE",
  });
}

export function CartProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const { user, isLoading: userLoading } = useUser();
  const userId = user?.id || "";

  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState({ done: 0, total: 0 });

  const hasLoggedIn = useRef(false);

  useEffect(() => {
    const loaded = loadCartFromStorage();
    setItems(loaded);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!userLoading && user && !hasLoggedIn.current) {
      hasLoggedIn.current = true;
    }
  }, [user, userLoading]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (userId && items.length > 0) {
        const data = JSON.stringify({
          version: CART_VERSION,
          items,
          lastUpdated: Date.now(),
        });
        localStorage.setItem(`${LOCAL_CART_KEY}_pending_sync`, data);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [userId, items]);

  const syncToServer = useCallback(async () => {
    if (!userId || items.length === 0) return;

    setIsSyncing(true);
    setSyncProgress({ done: 0, total: items.length });

    try {
      await syncCartToServer(userId, items, (done, total) => {
        setSyncProgress({ done, total });
      });
      localStorage.removeItem(`${LOCAL_CART_KEY}_pending_sync`);
    } catch (error) {
      console.error("Failed to sync cart to server:", error);
    } finally {
      setIsSyncing(false);
    }
  }, [userId, items]);

  const logout = useCallback(async () => {
    if (items.length > 0) {
      await syncToServer();
    }
    localStorage.removeItem(LOCAL_CART_KEY);
    setItems([]);
    hasLoggedIn.current = false;
  }, [items, syncToServer]);

  const addItem = useCallback((dish: Dish) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.dish.id === dish.id);
      let newItems: CartItem[];
      if (existing) {
        newItems = prev.map((item) =>
          item.dish.id === dish.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newItems = [
          ...prev,
          {
            id: `${dish.id}-${Date.now()}`,
            dish,
            quantity: 1,
            note: "",
          },
        ];
      }
      saveCartToStorage(newItems);
      return newItems;
    });
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems((prev) => {
      const newItems = prev.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      );
      saveCartToStorage(newItems);
      return newItems;
    });
  }, []);

  const updateNote = useCallback((itemId: string, note: string) => {
    setItems((prev) => {
      const newItems = prev.map((item) =>
        item.id === itemId ? { ...item, note } : item
      );
      saveCartToStorage(newItems);
      return newItems;
    });
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setItems((prev) => {
      const newItems = prev.filter((item) => item.id !== itemId);
      saveCartToStorage(newItems);
      return newItems;
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    saveCartToStorage([]);
    if (userId) {
      clearServerCart(userId).catch(console.error);
    }
  }, [userId]);

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
        isLoading,
        isSyncing,
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
