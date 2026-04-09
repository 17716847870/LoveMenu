"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Utensils,
  Sparkles,
  Target,
  Zap,
  ArrowRight,
  Heart,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { ThemeName } from "@/types";

interface Recommend {
  dishName: string;
  reason: string;
}

interface TodayRecommendCardProps {
  data?: Recommend;
}

const defaultData: Recommend = {
  dishName: "炸鸡",
  reason: "你最近很喜欢",
};

const themeStyles: Record<
  ThemeName,
  {
    container: string;
    header: string;
    dish: string;
    reason: string;
    button: string;
    icon: React.ElementType;
  }
> = {
  couple: {
    container:
      "bg-gradient-to-br from-pink-50 to-white border-pink-100 shadow-sm",
    header: "text-pink-600",
    dish: "text-pink-700 bg-pink-100/50",
    reason: "text-pink-400",
    button: "bg-pink-500 text-white hover:bg-pink-600 shadow-pink-200",
    icon: Heart,
  },
  cute: {
    container:
      "bg-orange-50 border-orange-100 shadow-[4px_4px_0px_0px_rgba(251,146,60,0.2)]",
    header: "text-orange-500",
    dish: "text-orange-700 bg-white border-2 border-orange-200 shadow-sm",
    reason: "text-orange-400",
    button: "bg-orange-400 text-white hover:bg-orange-500 shadow-orange-200",
    icon: Sparkles,
  },
  minimal: {
    container: "bg-white border-gray-200",
    header: "text-gray-900",
    dish: "text-gray-900 bg-gray-50 border border-gray-200",
    reason: "text-gray-500",
    button: "bg-black text-white hover:bg-gray-800",
    icon: Target,
  },
  night: {
    container:
      "bg-slate-900 border-slate-800 shadow-[0_0_15px_rgba(59,130,246,0.15)]",
    header: "text-blue-400",
    dish: "text-blue-300 bg-slate-800 border border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.1)]",
    reason: "text-blue-500",
    button: "bg-blue-600 text-white hover:bg-blue-500 shadow-blue-900/50",
    icon: Zap,
  },
};

export default function TodayRecommendCard({
  data = defaultData,
}: TodayRecommendCardProps) {
  const { theme } = useTheme();
  const currentTheme = themeStyles[theme] || themeStyles.couple;
  const Icon = currentTheme.icon;

  const getTitle = () => {
    switch (theme) {
      case "cute":
        return "🍱 今日推荐";
      case "minimal":
        return "Today Recommend";
      case "night":
        return "⚡ Today Recommend";
      default:
        return "❤️ 今日推荐";
    }
  };

  return (
    <div
      className={cn(
        "rounded-[2rem] p-6 shadow-sm border flex flex-col gap-4 overflow-hidden relative transition-colors duration-300",
        currentTheme.container
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 font-bold text-lg">
        <Icon className={cn("w-5 h-5", currentTheme.header)} />
        <span className={currentTheme.header}>{getTitle()}</span>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={cn(
            "p-4 rounded-xl text-center font-bold text-xl",
            currentTheme.dish
          )}
        >
          {data.dishName}
        </motion.div>

        <div
          className={cn("text-sm font-medium text-center", currentTheme.reason)}
        >
          推荐原因：{data.reason}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "w-full py-3 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all",
            currentTheme.button
          )}
        >
          加入购物车
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
}
