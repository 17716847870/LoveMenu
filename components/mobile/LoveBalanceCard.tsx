"use client";

import React, { useEffect } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { Heart, Smile, Zap, Sparkles, ArrowRight } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@/context/UserContext";
import { cn } from "@/lib/utils";
import { ThemeName } from "@/types";

export interface LoveBalance {
  kissBalance: number;
  hugBalance: number;
  todayKissGain: number;
  todayHugGain: number;
}

const themeStyles: Record<
  ThemeName,
  {
    container: string;
    header: string;
    cardKiss: string;
    cardHug: string;
    textKiss: string;
    textHug: string;
    label: string;
    todayText: string;
    iconKiss: React.ElementType;
    iconHug: React.ElementType;
  }
> = {
  couple: {
    container: "bg-white border-pink-100 shadow-sm",
    header: "text-pink-900",
    cardKiss: "bg-pink-50 border-pink-100 hover:bg-pink-100",
    cardHug: "bg-orange-50 border-orange-100 hover:bg-orange-100",
    textKiss: "text-pink-500",
    textHug: "text-orange-500",
    label: "text-gray-500",
    todayText: "text-gray-400",
    iconKiss: Heart,
    iconHug: Smile, // Use Smile instead of User for Hug
  },
  cute: {
    container:
      "bg-white border-orange-200 shadow-[4px_4px_0px_0px_rgba(251,146,60,0.2)]",
    header: "text-orange-900",
    cardKiss: "bg-pink-50 border-2 border-pink-200 shadow-sm",
    cardHug: "bg-orange-50 border-2 border-orange-200 shadow-sm",
    textKiss: "text-pink-500",
    textHug: "text-orange-500",
    label: "text-orange-900/60",
    todayText: "text-orange-900/40",
    iconKiss: Sparkles,
    iconHug: Smile,
  },
  minimal: {
    container: "bg-white border-gray-200",
    header: "text-gray-900",
    cardKiss: "bg-gray-50 border-gray-200",
    cardHug: "bg-gray-50 border-gray-200",
    textKiss: "text-gray-900",
    textHug: "text-gray-900",
    label: "text-gray-500",
    todayText: "text-gray-400",
    iconKiss: Heart,
    iconHug: Smile,
  },
  night: {
    container:
      "bg-slate-900 border-slate-800 shadow-[0_0_20px_rgba(236,72,153,0.15)]",
    header: "text-pink-100",
    cardKiss:
      "bg-slate-800 border-pink-500/30 hover:border-pink-500/50 shadow-[0_0_10px_rgba(236,72,153,0.1)]",
    cardHug:
      "bg-slate-800 border-orange-500/30 hover:border-orange-500/50 shadow-[0_0_10px_rgba(249,115,22,0.1)]",
    textKiss: "text-pink-400",
    textHug: "text-orange-400",
    label: "text-slate-400",
    todayText: "text-slate-500",
    iconKiss: Zap,
    iconHug: Zap,
  },
};

const Counter = ({
  value,
  className,
}: {
  value: number;
  className?: string;
}) => {
  const spring = useSpring(0, { bounce: 0, duration: 1000 });
  const display = useTransform(spring, (current) => Math.round(current));

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span className={className}>{display}</motion.span>;
};

export default function LoveBalanceCard() {
  const { theme } = useTheme();
  const { user } = useUser();
  const currentTheme = themeStyles[theme] || themeStyles.couple;
  const IconKiss = currentTheme.iconKiss;
  const IconHug = currentTheme.iconHug;

  // 用真实用户数据，如果没有则用默认值
  const displayBalance = {
    kissBalance: user?.kissBalance ?? 0,
    hugBalance: user?.hugBalance ?? 0,
    todayKissGain: 0, // 可以从 API 获取今日获得数据
    todayHugGain: 0,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className={cn(
        "rounded-[24px] p-5 flex flex-col gap-4 overflow-hidden relative transition-colors duration-300 border",
        currentTheme.container
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2
          className={cn(
            "text-lg font-bold flex items-center gap-2",
            currentTheme.header
          )}
        >
          我的余额
        </h2>
        <div
          className={cn(
            "text-xs font-medium flex items-center gap-2",
            currentTheme.todayText
          )}
        >
          <span>今日获得</span>
          <span className="flex items-center gap-0.5">
            <Heart className="w-3 h-3" /> {displayBalance.todayKissGain}
          </span>
          <span className="flex items-center gap-0.5">
            <Smile className="w-3 h-3" /> {displayBalance.todayHugGain}
          </span>
        </div>
      </div>

      {/* Balance Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Kiss Balance */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "rounded-2xl p-4 flex flex-col gap-3 transition-all cursor-pointer border",
            currentTheme.cardKiss
          )}
        >
          <div className="flex items-center justify-between">
            <IconKiss className={cn("w-6 h-6", currentTheme.textKiss)} />
            <ArrowRight
              className={cn("w-4 h-4 opacity-50", currentTheme.label)}
            />
          </div>
          <div>
            <div className={cn("text-xs font-medium mb-1", currentTheme.label)}>
              亲亲余额
            </div>
            <div className={cn("text-3xl font-bold", currentTheme.textKiss)}>
              <Counter value={displayBalance.kissBalance} />
            </div>
          </div>
        </motion.div>

        {/* Hug Balance */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "rounded-2xl p-4 flex flex-col gap-3 transition-all cursor-pointer border",
            currentTheme.cardHug
          )}
        >
          <div className="flex items-center justify-between">
            <IconHug className={cn("w-6 h-6", currentTheme.textHug)} />
            <ArrowRight
              className={cn("w-4 h-4 opacity-50", currentTheme.label)}
            />
          </div>
          <div>
            <div className={cn("text-xs font-medium mb-1", currentTheme.label)}>
              贴贴余额
            </div>
            <div className={cn("text-3xl font-bold", currentTheme.textHug)}>
              <Counter value={displayBalance.hugBalance} />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
