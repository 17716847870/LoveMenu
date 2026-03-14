"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { ThemeName } from "@/types";
import { Heart, Sparkles, Coffee, Moon } from "lucide-react";

const themeConfig: Record<ThemeName, { 
  bg: string; 
  text: string; 
  icon: React.ElementType; 
  tips: string[] 
}> = {
  couple: {
    bg: "bg-pink-50 border border-pink-100",
    text: "text-pink-600",
    icon: Heart,
    tips: ["今天一起吃点什么呢？", "给宝贝准备一顿好吃的 ❤️", "今天也要喂饱宝贝 ❤️"],
  },
  cute: {
    bg: "bg-orange-50 border border-orange-100",
    text: "text-orange-600",
    icon: Sparkles,
    tips: ["今天吃点甜甜的 🍓", "来点好吃的吧！", "肚子饿饿，饭饭香香"],
  },
  minimal: {
    bg: "bg-gray-50 border border-gray-100",
    text: "text-gray-600",
    icon: Coffee,
    tips: ["简单吃点就好", "今日菜单推荐", "享受美食时刻"],
  },
  night: {
    bg: "bg-slate-800 border border-slate-700",
    text: "text-purple-300",
    icon: Moon,
    tips: ["夜宵时间 🌙", "深夜食堂营业中", "来点特别的"],
  },
};

export default function CartLoveTip() {
  const { theme } = useTheme();
  const config = themeConfig[theme];
  const Icon = config.icon;
  
  // Randomly select a tip based on time or just random
  const tip = config.tips[Math.floor(Math.random() * config.tips.length)];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("mx-4 mt-4 p-3 rounded-xl flex items-center justify-center gap-2 text-sm font-medium", config.bg, config.text)}
    >
      <Icon size={16} className="animate-pulse" />
      <span>{tip}</span>
    </motion.div>
  );
}
