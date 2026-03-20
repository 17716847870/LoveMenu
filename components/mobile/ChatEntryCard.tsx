"use client";

import React from "react";
import { motion } from "framer-motion";
import { MessageCircle, ChevronRight, Sparkles, Zap, Heart } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { ThemeName } from "@/types";
import Link from "next/link";

const themeStyles: Record<ThemeName, {
  container: string;
  iconBg: string;
  iconText: string;
  title: string;
  desc: string;
  arrow: string;
  badge: string;
}> = {
  couple: {
    container: "bg-gradient-to-r from-pink-50 to-rose-50 border-pink-100 shadow-sm hover:shadow-md",
    iconBg: "bg-pink-100",
    iconText: "text-pink-500",
    title: "text-pink-900",
    desc: "text-pink-600/70",
    arrow: "text-pink-300 group-hover:text-pink-500 group-hover:translate-x-1",
    badge: "bg-pink-500 text-white",
  },
  cute: {
    container: "bg-[#fffcf3] border-orange-200 shadow-[4px_4px_0px_0px_rgba(251,146,60,0.2)]",
    iconBg: "bg-orange-100",
    iconText: "text-orange-500",
    title: "text-orange-900",
    desc: "text-orange-600/70",
    arrow: "text-orange-300 group-hover:text-orange-500 group-hover:translate-x-1",
    badge: "bg-orange-500 text-white",
  },
  minimal: {
    container: "bg-white border-gray-200 hover:border-gray-300",
    iconBg: "bg-gray-100",
    iconText: "text-gray-900",
    title: "text-gray-900",
    desc: "text-gray-500",
    arrow: "text-gray-400 group-hover:text-gray-900 group-hover:translate-x-1",
    badge: "bg-gray-900 text-white",
  },
  night: {
    container: "bg-slate-800 border-slate-700 shadow-[0_0_15px_rgba(96,165,250,0.1)]",
    iconBg: "bg-slate-900",
    iconText: "text-blue-400",
    title: "text-slate-100",
    desc: "text-slate-400",
    arrow: "text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1",
    badge: "bg-blue-500 text-white",
  },
};

export default function ChatEntryCard() {
  const { theme } = useTheme();
  const currentTheme = themeStyles[theme] || themeStyles.couple;
  
  // 模拟未读消息数量
  const unreadCount = 2;

  return (
    <Link href="/chat">
      <motion.div
        whileTap={{ scale: 0.98 }}
        className={cn(
          "rounded-[24px] p-5 flex items-center gap-4 relative overflow-hidden transition-all duration-300 border group",
          currentTheme.container
        )}
      >
        <div className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors",
          currentTheme.iconBg,
          currentTheme.iconText
        )}>
          {theme === 'couple' ? <Heart className="w-6 h-6 fill-current" /> :
           theme === 'cute' ? <Sparkles className="w-6 h-6" /> :
           theme === 'night' ? <Zap className="w-6 h-6" /> :
           <MessageCircle className="w-6 h-6" />}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className={cn("font-bold text-lg", currentTheme.title)}>
              双人聊天室
            </h3>
            {unreadCount > 0 && (
              <span className={cn(
                "px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none",
                currentTheme.badge
              )}>
                {unreadCount}
              </span>
            )}
          </div>
          <p className={cn("text-sm mt-0.5 truncate", currentTheme.desc)}>
            "想吃什么快跟我说呀～"
          </p>
        </div>

        <ChevronRight className={cn("w-5 h-5 transition-all duration-300", currentTheme.arrow)} />
        
        {/* 背景装饰图案 */}
        {theme === 'couple' && (
          <Heart className="absolute -right-4 -bottom-4 w-24 h-24 text-pink-500/5 rotate-12" />
        )}
      </motion.div>
    </Link>
  );
}
