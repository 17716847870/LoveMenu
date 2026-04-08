"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Sparkles, Zap, Utensils } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { cn, asyncSetState } from "@/lib/utils";
import { ThemeName } from "@/types";
import { useHomeMood } from "@/apis/home";

// Helper to get greeting based on time
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 5) return "夜深了";
  if (hour < 11) return "早安";
  if (hour < 14) return "中午好";
  if (hour < 18) return "下午好";
  return "晚上好";
}

// Theme Styles Configuration
const cardThemes: Record<ThemeName, {
  container: string;
  title: string;
  greeting: string;
  sectionTitle: string;
  content: string;
  button: string;
  icon: React.ElementType;
  animation: any;
}> = {
  couple: {
    container: "bg-gradient-to-br from-pink-100 to-rose-50 border border-pink-200 shadow-pink-100",
    title: "text-pink-600",
    greeting: "text-rose-900",
    sectionTitle: "text-pink-400/80",
    content: "text-rose-800",
    button: "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-200 hover:shadow-pink-300",
    icon: Heart,
    animation: {
      y: [0, -5, 0],
      transition: { repeat: Infinity, duration: 2, ease: "easeInOut" }
    }
  },
  cute: {
    container: "bg-gradient-to-tr from-orange-50 to-yellow-50 border border-orange-100 shadow-orange-50",
    title: "text-orange-500",
    greeting: "text-orange-900",
    sectionTitle: "text-orange-400/80",
    content: "text-orange-800",
    button: "bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg shadow-orange-200 hover:shadow-orange-300 rounded-2xl",
    icon: Utensils,
    animation: {
      rotate: [0, 10, -10, 0],
      transition: { repeat: Infinity, duration: 2, ease: "easeInOut" }
    }
  },
  minimal: {
    container: "bg-white border border-gray-100 shadow-sm",
    title: "text-gray-900 font-bold",
    greeting: "text-gray-800",
    sectionTitle: "text-gray-400 uppercase tracking-wider text-[10px]",
    content: "text-gray-900 font-medium",
    button: "bg-black text-white hover:bg-gray-800",
    icon: Sparkles,
    animation: {}
  },
  night: {
    container: "bg-slate-900 border border-slate-800 shadow-lg shadow-blue-900/20",
    title: "text-blue-400",
    greeting: "text-slate-100",
    sectionTitle: "text-slate-500",
    content: "text-blue-100",
    button: "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)] hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.6)]",
    icon: Zap,
    animation: {
      opacity: [0.5, 1, 0.5],
      transition: { repeat: Infinity, duration: 2 }
    }
  }
};

export default function CoupleMoodCard() {
  const { theme } = useTheme();
  const { data } = useHomeMood();
  const [greeting, setGreeting] = useState("");
  const currentTheme = cardThemes[theme] || cardThemes.couple;
  const Icon = currentTheme.icon;
  const mood = data?.mood || "🌤️ 今天也很适合好好吃饭";
  const craving = data?.craving || "还没想好，去菜单里挑挑吧";

  useEffect(() => {
    asyncSetState(() => {
      setGreeting(getGreeting());
    })
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "relative overflow-hidden rounded-4xl p-6 shadow-xl w-full",
        currentTheme.container
      )}
    >
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 opacity-5">
        <Icon size={160} />
      </div>

      <div className="relative z-10 flex flex-col gap-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <span className={cn("text-xs font-bold tracking-wider", currentTheme.title)}>
              LoveMenu ♡
            </span>
            <h2 className={cn("text-2xl font-bold mt-1", currentTheme.greeting)}>
              {greeting} {theme === 'couple' && "❤️"}
            </h2>
            <p className={cn("text-sm opacity-80", currentTheme.greeting)}>
              今天想吃什么呀？
            </p>
          </div>
          
          <motion.div
            animate={currentTheme.animation}
            className={cn("p-2 rounded-full bg-white/50 backdrop-blur-sm", 
              theme === 'night' ? "bg-slate-800/50" : ""
            )}
          >
            <Icon className={cn("w-6 h-6", currentTheme.title)} />
          </motion.div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <span className={cn("text-xs font-medium", currentTheme.sectionTitle)}>
              今日心情
            </span>
            <span className={cn("text-lg font-medium", currentTheme.content)}>
              {mood}
            </span>
          </div>
          
          <div className="flex flex-col gap-2">
            <span className={cn("text-xs font-medium", currentTheme.sectionTitle)}>
              今天特别想吃
            </span>
            <span className={cn("text-lg font-medium", currentTheme.content)}>
              {craving}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <Link href="/menu" className="w-full">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "w-full py-4 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all",
              currentTheme.button
            )}
          >
            {theme === 'minimal' ? "查看菜单 →" : (
              <>
                <Icon size={16} fill="currentColor" className="opacity-80" />
                <span>去选好吃的</span>
                <Icon size={16} fill="currentColor" className="opacity-80" />
              </>
            )}
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
}
