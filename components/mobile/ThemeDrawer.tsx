"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import ThemeCard from "./ThemeCard";
import { ThemeName } from "@/types";
import { cn } from "@/lib/utils";

interface ThemeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const themes: {
  id: ThemeName;
  name: string;
  description: string;
}[] = [
  { id: "couple", name: "情侣风", description: "浪漫恋爱主题，粉色温馨" },
  { id: "cute", name: "可爱风", description: "元气少女主题，糖果色彩" },
  { id: "minimal", name: "极简风", description: "纯净极简设计，回归本真" },
  { id: "night", name: "夜间模式", description: "深色护眼主题，科技霓虹" },
];

const themeStyles: Record<
  ThemeName,
  {
    drawer: string;
    closeButton: string;
    title: string;
    subtitle: string;
  }
> = {
  couple: {
    drawer: "bg-white",
    closeButton: "bg-pink-50 text-pink-500 hover:bg-pink-100",
    title: "text-pink-900",
    subtitle: "text-pink-400",
  },
  cute: {
    drawer: "bg-white",
    closeButton: "bg-orange-50 text-orange-500 hover:bg-orange-100",
    title: "text-orange-900",
    subtitle: "text-orange-400",
  },
  minimal: {
    drawer: "bg-white border-t border-gray-200",
    closeButton: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    title: "text-gray-900",
    subtitle: "text-gray-500",
  },
  night: {
    drawer: "bg-slate-900 border-t border-slate-800",
    closeButton: "bg-slate-800 text-slate-400 hover:bg-slate-700",
    title: "text-blue-100",
    subtitle: "text-slate-400",
  },
};

export default function ThemeDrawer({ isOpen, onClose }: ThemeDrawerProps) {
  const { theme, setTheme } = useTheme();
  const currentTheme = themeStyles[theme] || themeStyles.couple;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={cn(
              "fixed bottom-0 left-0 right-0 z-[70] rounded-t-[2rem] p-6 pb-10 max-w-[480px] mx-auto shadow-2xl transition-colors duration-300",
              currentTheme.drawer
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className={cn("text-xl font-bold", currentTheme.title)}>
                  个性化你的 LoveMenu
                </h2>
                <p className={cn("text-sm mt-1", currentTheme.subtitle)}>
                  选择你喜欢的主题风格 🎨
                </p>
              </div>
              <button
                onClick={onClose}
                className={cn(
                  "p-2 rounded-full transition-colors",
                  currentTheme.closeButton
                )}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Theme Grid */}
            <div className="grid grid-cols-2 gap-4">
              {themes.map((t) => (
                <ThemeCard
                  key={t.id}
                  theme={t.id}
                  activeTheme={theme}
                  name={t.name}
                  description={t.description}
                  isActive={theme === t.id}
                  onSelect={(newTheme) => {
                    setTheme(newTheme);
                    // Optional: Close drawer on select
                    // onClose();
                  }}
                />
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
