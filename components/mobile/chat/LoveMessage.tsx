"use client";

import { motion } from "framer-motion";
import { Heart, Smile } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { ThemeName } from "@/types";

interface LoveMessageProps {
  type: "kiss" | "hug";
  count?: number;
}

const themeStyles: Record<
  ThemeName,
  {
    container: string;
    icon: string;
    text: string;
  }
> = {
  couple: {
    container: "bg-pink-50 border-pink-100",
    icon: "text-pink-500",
    text: "text-pink-600",
  },
  cute: {
    container: "bg-orange-50 border-orange-100",
    icon: "text-orange-500",
    text: "text-orange-600",
  },
  minimal: {
    container: "bg-gray-50 border-gray-100",
    icon: "text-gray-900",
    text: "text-gray-600",
  },
  night: {
    container: "bg-slate-800 border-slate-700",
    icon: "text-pink-400",
    text: "text-blue-100",
  },
};

export default function LoveMessage({ type, count = 1 }: LoveMessageProps) {
  const { theme } = useTheme();
  const currentTheme = themeStyles[theme] || themeStyles.couple;

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-xl border shadow-sm",
        currentTheme.container
      )}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-slate-900 shadow-sm",
          currentTheme.icon
        )}
      >
        {type === "kiss" ? (
          <Heart className="w-6 h-6 fill-current" />
        ) : (
          <Smile className="w-6 h-6" />
        )}
      </motion.div>

      <div className="flex flex-col">
        <span className={cn("font-bold text-sm", currentTheme.text)}>
          发送了一个{type === "kiss" ? "亲亲" : "贴贴"}
        </span>
        <span className={cn("text-xs opacity-70", currentTheme.text)}>
          {type === "kiss" ? "❤️" : "🤗"} +{count}
        </span>
      </div>
    </div>
  );
}
