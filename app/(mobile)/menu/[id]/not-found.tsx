"use client";

import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { ThemeName } from "@/types";
import { motion } from "framer-motion";
import { Heart, Sparkles, Frown, SearchX } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

// Theme Configurations
const themeStyles: Record<
  ThemeName,
  {
    container: string;
    iconColor: string;
    textColor: string;
    button: string;
    icon: React.ElementType;
    message: string;
    subMessage: string;
  }
> = {
  couple: {
    container: "bg-pink-50",
    iconColor: "text-pink-400",
    textColor: "text-pink-600",
    button: "bg-pink-500 text-white shadow-pink-200 hover:bg-pink-600",
    icon: Heart,
    message: "未找到商品",
    subMessage: "去看看其他美食吧 ❤️",
  },
  cute: {
    container: "bg-purple-50",
    iconColor: "text-purple-400",
    textColor: "text-purple-600",
    button:
      "bg-purple-400 text-white shadow-purple-200 hover:bg-purple-500 rounded-full",
    icon: Sparkles,
    message: "找不到这道菜啦～",
    subMessage: "要不要试试别的？🍭",
  },
  minimal: {
    container: "bg-white",
    iconColor: "text-gray-400",
    textColor: "text-gray-900",
    button: "bg-black text-white hover:bg-gray-800 rounded-lg",
    icon: SearchX,
    message: "没有找到商品",
    subMessage: "返回上一页",
  },
  night: {
    container: "bg-slate-900",
    iconColor: "text-blue-500",
    textColor: "text-blue-100",
    button:
      "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)] hover:bg-blue-500",
    icon: Frown,
    message: "无法找到此商品",
    subMessage: "尝试其他选择吧 ⚡",
  },
};

export default function NotFound() {
  const { theme } = useTheme();
  const router = useRouter();
  const currentTheme = themeStyles[theme] || themeStyles.couple;
  const Icon = currentTheme.icon;

  return (
    <div
      className={cn(
        "min-h-screen flex flex-col items-center justify-center p-6 transition-colors duration-300",
        currentTheme.container
      )}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="flex flex-col items-center gap-6 text-center"
      >
        <div
          className={cn(
            "p-6 rounded-full bg-white/50 backdrop-blur-sm shadow-sm",
            theme === "night" && "bg-slate-800/50"
          )}
        >
          <Icon
            className={cn("w-16 h-16", currentTheme.iconColor)}
            strokeWidth={1.5}
          />
        </div>

        <div className="flex flex-col gap-2">
          <h2 className={cn("text-xl font-bold", currentTheme.textColor)}>
            {currentTheme.message}
          </h2>
          <p className={cn("text-sm opacity-80", currentTheme.textColor)}>
            {currentTheme.subMessage}
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.back()}
          className={cn(
            "px-8 py-3 rounded-xl font-medium shadow-lg transition-all mt-4",
            currentTheme.button
          )}
        >
          返回上一页
        </motion.button>
      </motion.div>
    </div>
  );
}
