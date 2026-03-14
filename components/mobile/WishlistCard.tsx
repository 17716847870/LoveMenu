"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Heart, 
  Sparkles, 
  List, 
  Zap, 
  ChevronRight, 
  Plus
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { ThemeName } from "@/types";
import Link from "next/link";

interface WishItem {
  dishName: string;
}

interface WishlistCardProps {
  items?: WishItem[];
}

const defaultItems: WishItem[] = [
  { dishName: "寿司" },
  { dishName: "蛋糕" },
  { dishName: "螺蛳粉" },
];

const themeStyles: Record<ThemeName, {
  container: string;
  header: string;
  viewAll: string;
  item: string;
  itemBorder: string;
  icon: React.ElementType;
}> = {
  couple: {
    container: "bg-pink-50 border-pink-100 shadow-sm",
    header: "text-pink-600",
    viewAll: "text-pink-400 hover:text-pink-600",
    item: "bg-white/60 hover:bg-white/80 border-pink-200 text-pink-700",
    itemBorder: "border",
    icon: Heart,
  },
  cute: {
    container: "bg-purple-50 border-purple-100 shadow-[4px_4px_0px_0px_rgba(168,85,247,0.2)]",
    header: "text-purple-600",
    viewAll: "text-purple-500 hover:text-purple-700",
    item: "bg-white border-purple-200 text-purple-700 shadow-sm",
    itemBorder: "border-2 rounded-xl",
    icon: Sparkles,
  },
  minimal: {
    container: "bg-white border-gray-200",
    header: "text-gray-900",
    viewAll: "text-gray-500 hover:text-gray-900",
    item: "bg-gray-50 border-gray-100 text-gray-900",
    itemBorder: "border-b last:border-0 rounded-none",
    icon: List,
  },
  night: {
    container: "bg-slate-900 border-slate-800 shadow-[0_0_15px_rgba(236,72,153,0.15)]",
    header: "text-pink-500",
    viewAll: "text-pink-400 hover:text-pink-300",
    item: "bg-slate-800/50 border-pink-500/30 text-pink-300 hover:border-pink-400/50 shadow-[0_0_5px_rgba(236,72,153,0.1)]",
    itemBorder: "border",
    icon: Zap,
  },
};

export default function WishlistCard({ items = defaultItems }: WishlistCardProps) {
  const { theme } = useTheme();
  const currentTheme = themeStyles[theme] || themeStyles.couple;
  const Icon = currentTheme.icon;

  const getTitle = () => {
    switch (theme) {
      case 'cute': return "🍩 想吃清单";
      case 'minimal': return "Wishlist";
      case 'night': return "⚡ Wishlist";
      default: return "❤️ 想吃清单";
    }
  };

  return (
    <div className={cn(
      "rounded-[2rem] p-6 shadow-sm border flex flex-col gap-4 overflow-hidden relative transition-colors duration-300",
      currentTheme.container
    )}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-lg">
          <Icon className={cn("w-5 h-5", currentTheme.header)} />
          <span className={currentTheme.header}>{getTitle()}</span>
        </div>
        
        <Link 
          href="/wishlist" 
          className={cn(
            "text-xs font-medium flex items-center gap-1 transition-colors",
            currentTheme.viewAll
          )}
        >
          查看全部
          <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Wish List */}
      <div className="flex flex-col gap-2">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "p-3 text-sm font-medium transition-all flex items-center justify-between",
              theme === 'minimal' ? "" : "rounded-lg",
              currentTheme.item,
              currentTheme.itemBorder
            )}
          >
            <span>{item.dishName}</span>
          </motion.div>
        ))}
        
        {/* Add Button Link */}
        <Link href="/wishlist">
          <motion.div
            whileTap={{ scale: 0.98 }}
            className={cn(
              "p-3 text-sm font-medium transition-all flex items-center justify-center gap-2 cursor-pointer mt-1 opacity-70 hover:opacity-100",
              theme === 'minimal' ? "bg-gray-100 rounded-lg text-gray-600" : "",
              theme === 'couple' ? "bg-pink-100/50 rounded-lg text-pink-600" : "",
              theme === 'cute' ? "bg-purple-100/50 rounded-xl text-purple-600" : "",
              theme === 'night' ? "bg-slate-800 rounded-lg text-pink-400 border border-pink-500/20" : ""
            )}
          >
            <Plus className="w-4 h-4" />
            <span>提议新食物</span>
          </motion.div>
        </Link>
        
        {items.length === 0 && (
          <div className={cn("text-center py-8 text-sm opacity-60", currentTheme.header)}>
            还没有添加想吃的菜哦 ~
          </div>
        )}
      </div>
    </div>
  );
}
