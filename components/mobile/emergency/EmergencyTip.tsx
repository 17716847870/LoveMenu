"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { ThemeName } from "@/types";
import { Zap, Heart, Sparkles, Flame } from "lucide-react";

const themeConfig: Record<
  ThemeName,
  {
    bg: string;
    text: string;
    icon: React.ElementType;
    tips: string[];
  }
> = {
  couple: {
    bg: "bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-100",
    text: "text-pink-600",
    icon: Heart,
    tips: ["宝贝是不是饿了 ❤️", "快速给宝贝准备吃的", "马上就安排！"],
  },
  cute: {
    bg: "bg-orange-50 border border-orange-100",
    text: "text-orange-600",
    icon: Sparkles,
    tips: ["肚子饿啦 🍓", "光速上菜！", "小馋猫饿了"],
  },
  minimal: {
    bg: "bg-gray-50 border border-gray-100",
    text: "text-gray-900",
    icon: Zap,
    tips: ["快速下单", "极速点单", "一键直达"],
  },
  night: {
    bg: "bg-slate-800 border border-slate-700",
    text: "text-purple-400",
    icon: Flame,
    tips: ["夜宵时间 🌙", "深夜特供", "饿了就点"],
  },
};

export default function EmergencyTip() {
  const { theme } = useTheme();
  const config = themeConfig[theme];
  const Icon = config.icon;

  const tip = config.tips[Math.floor(Math.random() * config.tips.length)];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "mx-4 mt-4 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold shadow-sm",
        config.bg,
        config.text
      )}
    >
      <div
        className={cn(
          "p-2 rounded-full bg-white/50",
          theme === "night" && "bg-black/20"
        )}
      >
        <Icon size={20} className={cn("animate-pulse")} />
      </div>
      <div className="flex flex-col">
        <span className="text-base">{tip}</span>
        <span className="text-xs opacity-70 font-normal mt-0.5">
          直接点击下方食物，最快速度下单
        </span>
      </div>
    </motion.div>
  );
}
