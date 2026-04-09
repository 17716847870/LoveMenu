"use client";

import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
} from "react";
import FlyToCart from "@/components/animation/FlyToCart";
import { AnimatePresence } from "framer-motion";

interface FlyItem {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  imageSrc: string;
  onComplete?: () => void;
}

interface FlyToCartContextType {
  flyToCart: (rect: DOMRect, imageSrc: string, onComplete?: () => void) => void;
  cartRef: React.RefObject<HTMLDivElement | null>;
  addToCartWithAnimation: (
    rect: DOMRect,
    imageSrc: string,
    onComplete?: () => void
  ) => void;
  isCartAnimating: boolean;
}

const FlyToCartContext = createContext<FlyToCartContextType | undefined>(
  undefined
);

export function FlyToCartProvider({ children }: { children: React.ReactNode }) {
  const [flyingItems, setFlyingItems] = useState<FlyItem[]>([]);
  const cartRef = useRef<HTMLDivElement>(null);
  const [isCartAnimating, setIsCartAnimating] = useState(false);
  const idCounter = useRef(0);

  const triggerCartHeartbeat = useCallback(() => {
    setIsCartAnimating(true);
    setTimeout(() => setIsCartAnimating(false), 400);
  }, []);

  const flyToCart = useCallback(
    (startRect: DOMRect, imageSrc: string, onComplete?: () => void) => {
      const cartRect = cartRef.current?.getBoundingClientRect();
      if (!cartRect) {
        // Fallback if cart not found
        onComplete?.();
        return;
      }

      const id = idCounter.current++;
      const endX = cartRect.left + cartRect.width / 2;
      const endY = cartRect.top + cartRect.height / 2;

      const newItem: FlyItem = {
        id,
        startX: startRect.left + startRect.width / 2,
        startY: startRect.top + startRect.height / 2,
        endX,
        endY,
        imageSrc,
        onComplete: () => {
          triggerCartHeartbeat();
          onComplete?.();
          setFlyingItems((prev) => prev.filter((item) => item.id !== id));
        },
      };

      setFlyingItems((prev) => [...prev, newItem]);
    },
    [triggerCartHeartbeat]
  );

  const addToCartWithAnimation = flyToCart;

  return (
    <FlyToCartContext.Provider
      value={{
        flyToCart,
        cartRef,
        addToCartWithAnimation,
        isCartAnimating,
      }}
    >
      {children}
      {/* Animation Layer */}
      <div className="fixed inset-0 pointer-events-none z-[100]">
        <AnimatePresence>
          {flyingItems.map((item) => (
            <FlyToCart
              key={item.id}
              startX={item.startX}
              startY={item.startY}
              endX={item.endX}
              endY={item.endY}
              imageSrc={item.imageSrc}
              onComplete={item.onComplete}
            />
          ))}
        </AnimatePresence>
      </div>
    </FlyToCartContext.Provider>
  );
}

export function useFlyToCart() {
  const context = useContext(FlyToCartContext);
  if (context === undefined) {
    throw new Error("useFlyToCart must be used within a FlyToCartProvider");
  }
  return context;
}
