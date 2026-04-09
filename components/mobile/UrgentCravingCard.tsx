"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Zap, Flame, AlertCircle } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { ThemeName } from "@/types";
import Link from "next/link";
import { useDishes } from "@/apis/dishes";

const themeStyles: Record<
  ThemeName,
  {
    container: string;
    header: string;
    list: string;
    item: string;
    button: string;
    icon: React.ElementType;
  }
> = {
  couple: {
    container: "bg-red-50 border-red-100 shadow-sm",
    header: "text-red-600",
    list: "bg-white/60 backdrop-blur-sm border border-red-100",
    item: "text-gray-700",
    button: "bg-red-500 text-white hover:bg-red-600 shadow-red-200",
    icon: Flame,
  },
  cute: {
    container:
      "bg-pink-50 border-pink-100 shadow-[4px_4px_0px_0px_rgba(236,72,153,0.2)]",
    header: "text-pink-500",
    list: "bg-white border-2 border-pink-100",
    item: "text-gray-600",
    button: "bg-pink-400 text-white hover:bg-pink-500 shadow-pink-200",
    icon: Zap,
  },
  minimal: {
    container: "bg-white border-gray-200",
    header: "text-gray-900",
    list: "bg-gray-50 border border-gray-100",
    item: "text-gray-800",
    button: "bg-black text-white hover:bg-gray-800",
    icon: AlertCircle,
  },
  night: {
    container:
      "bg-slate-900 border-red-900/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]",
    header: "text-red-500",
    list: "bg-white/5 border border-white/10",
    item: "text-gray-300",
    button: "bg-red-600 text-white hover:bg-red-500 shadow-red-900/50",
    icon: Zap,
  },
};

const EMOJI_MAP: Record<string, string> = {
  面: "🍜",
  粉: "🍜",
  饭: "🍚",
  肉: "🥩",
  鸡: "🍗",
  鱼: "🐟",
  虾: "🦐",
  牛: "🥩",
  猪: "🥓",
  羊: "🍖",
  蔬: "🥬",
  沙拉: "🥗",
  汤: "🍲",
  甜: "🍰",
  蛋糕: "🎂",
  饼: "🥞",
  包: "🥖",
  串: "🍢",
  烤: "🍖",
  炸: "🍟",
  炒: "🍳",
  蒸: "♨️",
  煮: "🍲",
  default: "🍽️",
};

function getDishEmoji(name: string): string {
  for (const [key, emoji] of Object.entries(EMOJI_MAP)) {
    if (name.includes(key)) {
      return emoji;
    }
  }
  return EMOJI_MAP["default"];
}

export default function UrgentCravingCard() {
  const { theme } = useTheme();
  const { data: dishes = [] } = useDishes();
  const currentTheme = themeStyles[theme] || themeStyles.couple;
  const Icon = currentTheme.icon;

  const hotItems = useMemo(() => {
    return dishes
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, 3)
      .map((dish) => ({
        name: dish.name,
        emoji: getDishEmoji(dish.name),
        id: dish.id,
      }));
  }, [dishes]);

  const getTitle = () => {
    switch (theme) {
      case "cute":
        return "紧急想吃";
      case "minimal":
        return "Urgent Craving";
      case "night":
        return "Urgent";
      default:
        return "紧急想吃";
    }
  };

  return (
    <div
      className={cn(
        "rounded-3xl p-5 shadow-sm border flex flex-col gap-4 overflow-hidden relative transition-colors duration-300",
        currentTheme.container
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-lg">
          <Icon className={cn("w-5 h-5", currentTheme.header)} />
          <span className={currentTheme.header}>{getTitle()}</span>
        </div>
      </div>

      <div
        className={cn("rounded-xl p-3 flex flex-col gap-2", currentTheme.list)}
      >
        {hotItems.length > 0 ? (
          hotItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "flex items-center gap-3 font-medium text-base py-1 px-2",
                currentTheme.item
              )}
            >
              <span className="text-xl">{item.emoji}</span>
              <span>{item.name}</span>
            </motion.div>
          ))
        ) : (
          <div
            className={cn(
              "text-center py-4 text-sm opacity-60",
              currentTheme.item
            )}
          >
            暂无热门菜品
          </div>
        )}
      </div>

      <Link href="/emergency" className="w-full block">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "w-full py-3 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all",
            currentTheme.button
          )}
        >
          <Zap className="w-4 h-4 fill-current" />
          立即点单
        </motion.button>
      </Link>
    </div>
  );
}
