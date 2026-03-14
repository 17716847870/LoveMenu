"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Zap, 
  Flame, 
  AlertCircle, 
  ArrowRight
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { ThemeName } from "@/types";
import Link from "next/link";

interface Craving {
  dishName: string;
}

interface UrgentCravingCardProps {
  data?: Craving;
}

const defaultData: Craving = {
  dishName: "炸鸡"
};

const themeStyles: Record<ThemeName, {
  container: string;
  header: string;
  dish: string;
  button: string;
  icon: React.ElementType;
}> = {
  couple: {
    container: "bg-red-50 border-red-100 shadow-sm",
    header: "text-red-600",
    dish: "text-red-700 bg-red-100/50",
    button: "bg-red-500 text-white hover:bg-red-600 shadow-red-200",
    icon: Flame,
  },
  cute: {
    container: "bg-red-50 border-red-100 shadow-[4px_4px_0px_0px_rgba(239,68,68,0.2)]",
    header: "text-red-500",
    dish: "text-red-700 bg-white border-2 border-red-200 shadow-sm",
    button: "bg-red-400 text-white hover:bg-red-500 shadow-red-200",
    icon: Zap,
  },
  minimal: {
    container: "bg-white border-gray-200",
    header: "text-gray-900",
    dish: "text-gray-900 bg-gray-50 border border-gray-200",
    button: "bg-black text-white hover:bg-gray-800",
    icon: AlertCircle,
  },
  night: {
    container: "bg-slate-900 border-red-900/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]",
    header: "text-red-500",
    dish: "text-red-400 bg-red-900/10 border border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.1)]",
    button: "bg-red-600 text-white hover:bg-red-500 shadow-red-900/50",
    icon: Zap,
  },
};

export default function UrgentCravingCard({ data = defaultData }: UrgentCravingCardProps) {
  const { theme } = useTheme();
  const currentTheme = themeStyles[theme] || themeStyles.couple;
  const Icon = currentTheme.icon;

  const getTitle = () => {
    switch (theme) {
      case 'cute': return "⚡ 紧急想吃";
      case 'minimal': return "Urgent Craving";
      case 'night': return "⚡ Urgent";
      default: return "⚡ 紧急想吃";
    }
  };

  return (
    <div className={cn(
      "rounded-[2rem] p-6 shadow-sm border flex flex-col gap-4 overflow-hidden relative transition-colors duration-300",
      currentTheme.container
    )}>
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

        <Link href="/emergency" className="w-full block">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "w-full py-3 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all",
              currentTheme.button
            )}
          >
            立即下单
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </Link>
      </div>
    </div>
  );
}
