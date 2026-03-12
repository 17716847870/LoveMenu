"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { ThemeName } from "@/types";

interface CategoryTabsProps {
  categories: string[];
  activeCategory: string;
  onSelect: (category: string) => void;
}

const themeStyles: Record<ThemeName, {
  container: string;
  item: string;
  activeItem: string;
  activeIndicator: string;
}> = {
  couple: {
    container: "bg-white/80 backdrop-blur-sm border-b border-pink-100",
    item: "text-pink-300 hover:text-pink-500",
    activeItem: "text-pink-600 font-bold",
    activeIndicator: "bg-pink-500 shadow-pink-200",
  },
  cute: {
    container: "bg-white/80 backdrop-blur-sm border-b border-orange-100",
    item: "text-orange-300 hover:text-orange-500",
    activeItem: "text-orange-600 font-bold",
    activeIndicator: "bg-orange-500 shadow-orange-200 rounded-full",
  },
  minimal: {
    container: "bg-white border-b border-gray-200",
    item: "text-gray-400 hover:text-gray-600",
    activeItem: "text-gray-900 font-medium",
    activeIndicator: "bg-black h-[2px] bottom-0 rounded-none",
  },
  night: {
    container: "bg-slate-900/90 backdrop-blur-sm border-b border-slate-800",
    item: "text-slate-500 hover:text-blue-400",
    activeItem: "text-blue-400 font-bold",
    activeIndicator: "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]",
  },
};

export default function CategoryTabs({ categories, activeCategory, onSelect }: CategoryTabsProps) {
  const { theme } = useTheme();
  const currentTheme = themeStyles[theme] || themeStyles.couple;

  return (
    <div className={cn(
      "sticky top-0 z-20 w-full overflow-x-auto no-scrollbar",
      currentTheme.container
    )}>
      <div className="flex items-center px-4 gap-6 h-14 min-w-max">
        {categories.map((category) => {
          const isActive = activeCategory === category;
          return (
            <button
              key={category}
              onClick={() => onSelect(category)}
              className={cn(
                "relative text-sm transition-colors py-2",
                isActive ? currentTheme.activeItem : currentTheme.item
              )}
            >
              {category}
              
              {isActive && (
                <motion.div
                  layoutId="activeCategory"
                  className={cn(
                    "absolute -bottom-1 left-0 right-0 h-1 rounded-full",
                    currentTheme.activeIndicator
                  )}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
