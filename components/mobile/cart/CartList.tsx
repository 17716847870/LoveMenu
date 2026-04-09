"use client";

import React from "react";
import { AnimatePresence } from "framer-motion";
import CartItem from "./CartItem";
import { CartItem as CartItemType } from "@/types";

interface CartListProps {
  items: CartItemType[];
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}

export default function CartList({
  items,
  onUpdateQuantity,
  onRemove,
}: CartListProps) {
  return (
    <div className="flex flex-col gap-3 px-4 py-4">
      <AnimatePresence>
        {items.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onUpdateQuantity={onUpdateQuantity}
            onRemove={onRemove}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
