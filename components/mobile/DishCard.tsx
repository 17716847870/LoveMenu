"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Heart, 
  Sparkles, 
  Zap,  
  Plus
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useFlyToCart } from "@/context/FlyToCartContext";
import { cn } from "@/lib/utils";
import { ThemeName } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { Dish } from "@/types";

interface DishCardProps {
  dish: Dish;
  onAdd?: (dish: Dish) => void;
}

const themeStyles: Record<ThemeName, {
  card: string;
  imageContainer: string;
  title: string;
  desc: string;
  price: string;
  button: string;
  hotBadge: string;
  icon: React.ElementType;
}> = {
  couple: {
    card: "bg-white border-pink-100 shadow-sm hover:shadow-md border rounded-2xl",
    imageContainer: "bg-pink-50",
    title: "text-pink-900",
    desc: "text-pink-400",
    price: "text-pink-500",
    button: "bg-pink-500 text-white hover:bg-pink-600 shadow-pink-200",
    hotBadge: "bg-red-500 text-white shadow-red-200",
    icon: Heart,
  },
  cute: {
    card: "bg-white border-orange-200 shadow-[4px_4px_0px_0px_rgba(251,146,60,0.2)] hover:shadow-[6px_6px_0px_0px_rgba(251,146,60,0.2)] border-2 rounded-2xl",
    imageContainer: "bg-orange-50",
    title: "text-orange-900",
    desc: "text-orange-400",
    price: "text-orange-500",
    button: "bg-orange-400 text-white hover:bg-orange-500 shadow-orange-200",
    hotBadge: "bg-orange-500 text-white border-2 border-white shadow-sm",
    icon: Sparkles,
  },
  minimal: {
    card: "bg-white border-gray-200 hover:border-gray-400 border rounded-lg",
    imageContainer: "bg-gray-50 grayscale",
    title: "text-gray-900",
    desc: "text-gray-500",
    price: "text-gray-900",
    button: "bg-black text-white hover:bg-gray-800",
    hotBadge: "bg-black text-white",
    icon: Plus,
  },
  night: {
    card: "bg-slate-800 border-slate-700 shadow-lg hover:shadow-blue-500/20 border rounded-2xl",
    imageContainer: "bg-slate-900",
    title: "text-blue-100",
    desc: "text-slate-400",
    price: "text-blue-400",
    button: "bg-blue-600 text-white hover:bg-blue-500 shadow-blue-900/50",
    hotBadge: "bg-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]",
    icon: Zap,
  },
};

export default function DishCard({ dish, onAdd }: DishCardProps) {
  const { theme } = useTheme();
  const { addToCartWithAnimation } = useFlyToCart();
  const imageRef = React.useRef<HTMLDivElement>(null);
  const currentTheme = themeStyles[theme] || themeStyles.couple;
  const ButtonIcon = currentTheme.icon;

  const isHot = (dish.popularity || 0) > 50;
  const isSuperHot = (dish.popularity || 0) > 80;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        "flex flex-col overflow-hidden relative group transition-all duration-300",
        currentTheme.card
      )}
    >
      <Link href={`/menu/${dish.id}`} className="absolute inset-0 z-0" />
      
      {/* Hot Badge */}
      <div className="absolute top-2 right-2 flex flex-col gap-1 z-10">
        {dish.popularity && dish.popularity > 80 && (
          <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm backdrop-blur-md bg-opacity-90 flex items-center gap-1", currentTheme.hotBadge)}>
            🔥 热销
          </span>
        )}
      </div>

      {/* Image */}
      <div 
        ref={imageRef}
        className={cn(
        "aspect-4/3 relative w-full overflow-hidden",
        currentTheme.imageContainer
      )}>
        {dish.image ? (
           <Image 
             src={dish.image} 
             alt={dish.name}
             fill
             className="object-cover"
           />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            🥘
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1 gap-2 relative z-10 pointer-events-none">
        <div>
          <h3 className={cn("font-bold text-sm line-clamp-1", currentTheme.title)}>
            {dish.name}
          </h3>
          <p className={cn("text-xs line-clamp-1 mt-0.5", currentTheme.desc)}>
            {dish.description}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between">
          {/* Price */}
          <div className={cn("flex items-center gap-2 text-xs font-medium", currentTheme.price)}>
            {dish.kissPrice > 0 && (
              <span className="flex items-center gap-0.5">
                ❤️ {dish.kissPrice}
              </span>
            )}
            {dish.hugPrice > 0 && (
              <span className="flex items-center gap-0.5">
                🤗 {dish.hugPrice}
              </span>
            )}
          </div>

          {/* Add Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              
              if (imageRef.current) {
                const rect = imageRef.current.getBoundingClientRect();
                addToCartWithAnimation(rect, dish.image || "", () => {
                   onAdd?.(dish);
                });
              } else {
                 onAdd?.(dish);
              }
            }}
            className={cn(
              "w-7 h-7 rounded-full flex items-center justify-center pointer-events-auto",
              currentTheme.button
            )}
          >
            <ButtonIcon className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
