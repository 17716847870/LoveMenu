"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Dish, ThemeName } from "@/types";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Zap, Heart, Sparkles, Loader2 } from "lucide-react";

interface EmergencyFoodItemProps {
  dish: Dish;
  onQuickOrder: (dish: Dish) => void;
}

const themeStyles: Record<
  ThemeName,
  {
    card: string;
    title: string;
    price: string;
    btn: string;
    icon: React.ElementType;
  }
> = {
  couple: {
    card: "bg-white border border-pink-100 shadow-sm rounded-2xl",
    title: "text-pink-900",
    price: "text-pink-500",
    btn: "bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-pink-200",
    icon: Heart,
  },
  cute: {
    card: "bg-white border-2 border-orange-100 shadow-[4px_4px_0px_0px_rgba(255,237,213,1)] rounded-2xl",
    title: "text-orange-900",
    price: "text-orange-500",
    btn: "bg-orange-400 text-white shadow-orange-200 border-b-4 border-orange-600 active:border-b-0 active:translate-y-1",
    icon: Sparkles,
  },
  minimal: {
    card: "bg-white border border-gray-200 rounded-lg",
    title: "text-gray-900",
    price: "text-gray-900",
    btn: "bg-black text-white hover:bg-gray-800",
    icon: Zap,
  },
  night: {
    card: "bg-slate-800 border border-slate-700 rounded-2xl shadow-lg",
    title: "text-white",
    price: "text-purple-400",
    btn: "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-purple-900/50",
    icon: Zap,
  },
};

export default function EmergencyFoodItem({
  dish,
  onQuickOrder,
}: EmergencyFoodItemProps) {
  const { theme } = useTheme();
  const styles = themeStyles[theme];
  const Icon = styles.icon;
  const [isOrdering, setIsOrdering] = useState(false);

  const handleOrder = async () => {
    setIsOrdering(true);
    await new Promise((resolve) => setTimeout(resolve, 600)); // Simulate slight delay for effect
    onQuickOrder(dish);
    // Don't reset isOrdering here, page will navigate away
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={cn("p-3 flex items-center gap-4 relative z-0", styles.card)}
    >
      {/* Image */}
      <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-gray-100">
        {dish.image ? (
          <Image
            src={dish.image}
            alt={dish.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl">
            🥘
          </div>
        )}
      </div>

      {/* Info & Action */}
      <div className="flex-1 flex flex-col justify-between py-1 h-20">
        <div>
          <h3 className={cn("font-bold text-base line-clamp-1", styles.title)}>
            {dish.name}
          </h3>
          <div
            className={cn("text-sm font-medium mt-1 flex gap-2", styles.price)}
          >
            {dish.kissPrice > 0 && <span>❤️ {dish.kissPrice}</span>}
            {dish.hugPrice > 0 && <span>🤗 {dish.hugPrice}</span>}
          </div>
        </div>

        <div className="flex justify-end mt-auto">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleOrder}
            disabled={isOrdering}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1.5 transition-all",
              styles.btn,
              isOrdering && "opacity-80"
            )}
          >
            {isOrdering ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Icon
                size={16}
                className={theme === "couple" ? "fill-current" : ""}
              />
            )}
            <span>立即点</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
