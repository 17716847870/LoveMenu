"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { ThemeName } from "@/types";

interface QuickLoveActionsProps {
  onSend: (content: string, type: "text" | "love" | "image" | "emoji") => void;
}

const themeStyles: Record<
  ThemeName,
  {
    container: string;
    button: string;
    icon: string;
  }
> = {
  couple: {
    container: "bg-white/90 backdrop-blur-sm border-t border-pink-100",
    button: "bg-pink-50 hover:bg-pink-100 border-pink-100",
    icon: "text-pink-500",
  },
  cute: {
    container: "bg-white/90 backdrop-blur-sm border-t border-orange-100",
    button: "bg-orange-50 hover:bg-orange-100 border-orange-100",
    icon: "text-orange-500",
  },
  minimal: {
    container: "bg-white border-t border-gray-100",
    button: "bg-gray-50 hover:bg-gray-100 border-gray-100",
    icon: "text-gray-900",
  },
  night: {
    container: "bg-slate-900/90 backdrop-blur-sm border-t border-slate-800",
    button: "bg-slate-800 hover:bg-slate-700 border-slate-700",
    icon: "text-blue-400",
  },
};

const actions = [
  { emoji: "💋", label: "亲亲", value: "kiss", type: "love" as const },
  { emoji: "🤗", label: "贴贴", value: "hug", type: "love" as const },
  { emoji: "❤️", label: "爱你", value: "quick:爱你", type: "emoji" as const },
  { emoji: "🍜", label: "想吃", value: "quick:想吃", type: "emoji" as const },
  { emoji: "🥺", label: "想你", value: "quick:想你", type: "emoji" as const },
  { emoji: "😘", label: "么么", value: "quick:么么", type: "emoji" as const },
  { emoji: "🌙", label: "晚安", value: "quick:晚安", type: "emoji" as const },
  { emoji: "☀️", label: "早安", value: "quick:早安", type: "emoji" as const },
];

export default function QuickLoveActions({ onSend }: QuickLoveActionsProps) {
  const { theme } = useTheme();
  const currentTheme = themeStyles[theme] || themeStyles.couple;

  return (
    <div
      className={cn(
        "px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar",
        currentTheme.container
      )}
    >
      {actions.map((action) => (
        <motion.button
          key={action.label}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSend(action.value, action.type)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium whitespace-nowrap transition-colors shrink-0",
            currentTheme.button
          )}
        >
          <span className="text-base leading-none">{action.emoji}</span>
          <span className={currentTheme.icon}>{action.label}</span>
        </motion.button>
      ))}
    </div>
  );
}
