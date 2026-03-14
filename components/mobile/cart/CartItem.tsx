"use client";

import React from "react";
import { motion, PanInfo, useMotionValue, useTransform } from "framer-motion";
import { CartItem as CartItemType, ThemeName } from "@/types";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import QuantitySelector from "./QuantitySelector";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}

const themeStyles: Record<ThemeName, {
  card: string;
  title: string;
  desc: string;
  price: string;
}> = {
  couple: {
    card: "bg-white border border-pink-100 shadow-sm rounded-2xl",
    title: "text-pink-900",
    desc: "text-pink-400",
    price: "text-pink-500",
  },
  cute: {
    card: "bg-white border-2 border-orange-100 shadow-[4px_4px_0px_0px_rgba(255,237,213,1)] rounded-2xl",
    title: "text-orange-900",
    desc: "text-orange-400",
    price: "text-orange-500",
  },
  minimal: {
    card: "bg-white border border-gray-200 rounded-lg",
    title: "text-gray-900",
    desc: "text-gray-500",
    price: "text-gray-900",
  },
  night: {
    card: "bg-slate-800 border border-slate-700 rounded-2xl shadow-lg",
    title: "text-white",
    desc: "text-slate-400",
    price: "text-purple-400",
  },
};

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const { theme } = useTheme();
  const styles = themeStyles[theme];
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-100, 0], [0, 1]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < -100) {
      onRemove(item.id);
    } else {
      x.set(0);
    }
  };

  return (
    <motion.div
      style={{ x, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.1}
      onDragEnd={handleDragEnd}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="relative mb-3 touch-pan-y"
    >
      {/* Delete Background */}
      <div className="absolute inset-y-0 right-0 w-full bg-red-500 rounded-2xl flex items-center justify-end px-6 -z-10">
        <Trash2 className="text-white" />
      </div>

      <div className={cn("p-3 flex gap-3 relative z-0", styles.card)}>
        {/* Image */}
        <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-gray-100">
          {item.dish.image ? (
            <Image
              src={item.dish.image}
              alt={item.dish.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl">
              🥘
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col justify-between py-0.5">
          <div>
            <div className="flex justify-between items-start">
              <h3 className={cn("font-bold text-sm", styles.title)}>
                {item.dish.name}
              </h3>
              <button 
                onClick={() => onRemove(item.id)}
                className="text-gray-400 p-1 -mt-1 -mr-1"
              >
                <Trash2 size={14} />
              </button>
            </div>
            {item.dish.description && (
              <p className={cn("text-xs line-clamp-1 mt-0.5", styles.desc)}>
                {item.dish.description}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className={cn("text-xs font-medium flex gap-2", styles.price)}>
              {item.dish.kissPrice > 0 && <span>❤️ {item.dish.kissPrice}</span>}
              {item.dish.hugPrice > 0 && <span>🤗 {item.dish.hugPrice}</span>}
            </div>

            <QuantitySelector
              quantity={item.quantity}
              onIncrease={() => onUpdateQuantity(item.id, item.quantity + 1)}
              onDecrease={() => onUpdateQuantity(item.id, item.quantity - 1)}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
