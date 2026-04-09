"use client";

import React from "react";
import { motion } from "framer-motion";
import { Heart, Plus, Sparkles, ShoppingBag } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { ThemeName, Dish } from "@/types";
import Image from "next/image";

interface FoodRecommendationItemProps {
  dish: Dish;
  reason: string;
  isFavorite?: boolean;
  onAdd: (dish: Dish) => void;
  onFavorite: (dishId: string) => void;
  onItemClick?: (dish: Dish) => void;
}

const themeStyles: Record<
  ThemeName,
  {
    container: string;
    imageBg: string;
    title: string;
    desc: string;
    reason: string;
    price: string;
    addButton: string;
    favButton: string;
    favButtonActive: string;
    icon: React.ElementType;
  }
> = {
  couple: {
    container: "bg-white/80 backdrop-blur-sm border-pink-100 shadow-sm",
    imageBg: "bg-pink-50",
    title: "text-gray-800",
    desc: "text-gray-500",
    reason: "text-pink-500 bg-pink-50",
    price: "text-pink-600",
    addButton: "bg-pink-500 text-white hover:bg-pink-600",
    favButton: "text-pink-300 hover:text-pink-500",
    favButtonActive: "text-pink-500 fill-current",
    icon: Heart,
  },
  cute: {
    container:
      "bg-white border-2 border-orange-100 shadow-[4px_4px_0px_0px_rgba(254,215,170,0.5)] rounded-3xl",
    imageBg: "bg-orange-50",
    title: "text-orange-900",
    desc: "text-orange-600/80",
    reason: "text-orange-600 bg-orange-100",
    price: "text-orange-600",
    addButton: "bg-orange-400 text-white hover:bg-orange-500 shadow-orange-200",
    favButton: "text-orange-300 hover:text-orange-500",
    favButtonActive: "text-orange-500 fill-current",
    icon: Sparkles,
  },
  minimal: {
    container: "bg-white border border-gray-100 shadow-sm rounded-none",
    imageBg: "bg-gray-50",
    title: "text-gray-900",
    desc: "text-gray-500",
    reason: "text-gray-600 bg-gray-100",
    price: "text-black",
    addButton: "bg-black text-white hover:bg-gray-800 rounded-none",
    favButton: "text-gray-300 hover:text-black",
    favButtonActive: "text-black fill-current",
    icon: ShoppingBag,
  },
  night: {
    container: "bg-white/5 border-white/10 shadow-lg backdrop-blur-md",
    imageBg: "bg-white/10",
    title: "text-white",
    desc: "text-gray-400",
    reason: "text-blue-400 bg-blue-500/10 border border-blue-500/20",
    price: "text-blue-400",
    addButton: "bg-blue-600 text-white hover:bg-blue-500 shadow-blue-900/50",
    favButton: "text-slate-600 hover:text-blue-500",
    favButtonActive: "text-blue-500 fill-current",
    icon: Sparkles,
  },
};

export default function FoodRecommendationItem({
  dish,
  reason,
  isFavorite = false,
  onAdd,
  onFavorite,
  onItemClick,
}: FoodRecommendationItemProps) {
  const { theme } = useTheme();
  const currentTheme = themeStyles[theme] || themeStyles.couple;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex gap-3 p-3 rounded-2xl border transition-all relative overflow-hidden",
        currentTheme.container
      )}
      onClick={() => onItemClick?.(dish)}
    >
      {/* Image */}
      <div
        className={cn(
          "w-24 h-24 rounded-xl shrink-0 relative overflow-hidden",
          currentTheme.imageBg
        )}
      >
        {dish.image ? (
          <Image
            src={dish.image}
            alt={dish.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl">
            🍽️
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
        <div>
          <div className="flex justify-between items-start">
            <h3
              className={cn(
                "font-bold text-base truncate pr-6",
                currentTheme.title
              )}
            >
              {dish.name}
            </h3>
            {/* Favorite Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFavorite(dish.id);
              }}
              className={cn(
                "transition-colors absolute right-3 top-3",
                isFavorite
                  ? currentTheme.favButtonActive
                  : currentTheme.favButton
              )}
            >
              <Heart className={cn("w-5 h-5", isFavorite && "fill-current")} />
            </button>
          </div>

          <p className={cn("text-xs line-clamp-1 mt-0.5", currentTheme.desc)}>
            {dish.description || "暂无描述"}
          </p>

          {/* Reason Badge */}
          <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium w-fit max-w-full truncate">
            <span
              className={cn("px-2 py-0.5 rounded-full", currentTheme.reason)}
            >
              {reason}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2">
          {/* Price */}
          <div
            className={cn(
              "text-xs font-bold flex items-center gap-2",
              currentTheme.price
            )}
          >
            {dish.kissPrice > 0 && <span>🍬 {dish.kissPrice}</span>}
            {dish.hugPrice > 0 && <span>🤗 {dish.hugPrice}</span>}
          </div>

          {/* Add Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAdd(dish);
            }}
            className={cn(
              "p-1.5 rounded-lg transition-transform active:scale-95",
              currentTheme.addButton
            )}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
