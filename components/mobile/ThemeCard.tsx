"use client";

import React from "react";
import { motion } from "framer-motion";
import { ThemeName } from "@/types";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface ThemeCardProps {
  theme: ThemeName;
  activeTheme: ThemeName;
  name: string;
  description: string;
  isActive: boolean;
  onSelect: (theme: ThemeName) => void;
}

const themeConfigs: Record<
  ThemeName,
  {
    previewClass: string;
    icon: string;
    activeBorder: string;
    activeBg: string;
    checkBg: string;
    checkText: string;
    textClass: string;
    descClass: string;
  }
> = {
  couple: {
    previewClass: "bg-gradient-to-br from-pink-100 to-white border-pink-200",
    icon: "💗",
    activeBorder: "border-pink-500 ring-pink-500/20",
    activeBg: "bg-pink-50",
    checkBg: "bg-pink-500",
    checkText: "text-white",
    textClass: "text-pink-900",
    descClass: "text-pink-400",
  },
  cute: {
    previewClass: "bg-orange-50 border-orange-200",
    icon: "🍭",
    activeBorder: "border-orange-500 ring-orange-500/20",
    activeBg: "bg-orange-50",
    checkBg: "bg-orange-500",
    checkText: "text-white",
    textClass: "text-orange-900",
    descClass: "text-orange-400",
  },
  minimal: {
    previewClass: "bg-white border-gray-200",
    icon: "⬛",
    activeBorder: "border-gray-900 ring-gray-900/20",
    activeBg: "bg-gray-50",
    checkBg: "bg-gray-900",
    checkText: "text-white",
    textClass: "text-gray-900",
    descClass: "text-gray-500",
  },
  night: {
    previewClass: "bg-slate-900 border-slate-700",
    icon: "🌙",
    activeBorder: "border-blue-500 ring-blue-500/20",
    activeBg: "bg-slate-800",
    checkBg: "bg-blue-600",
    checkText: "text-white",
    textClass: "text-blue-100",
    descClass: "text-slate-400",
  },
};

// Styles for the card background when NOT active (based on current active theme)
const inactiveStyles: Record<
  ThemeName,
  {
    bg: string;
    hover: string;
    text: string;
    desc: string;
  }
> = {
  couple: {
    bg: "bg-pink-50",
    hover: "hover:bg-pink-100",
    text: "text-pink-900",
    desc: "text-pink-400",
  },
  cute: {
    bg: "bg-orange-50",
    hover: "hover:bg-orange-100",
    text: "text-orange-900",
    desc: "text-orange-400",
  },
  minimal: {
    bg: "bg-gray-50",
    hover: "hover:bg-gray-100",
    text: "text-gray-900",
    desc: "text-gray-500",
  },
  night: {
    bg: "bg-slate-800",
    hover: "hover:bg-slate-700",
    text: "text-blue-100",
    desc: "text-slate-400",
  },
};

export default function ThemeCard({
  theme,
  activeTheme,
  name,
  description,
  isActive,
  onSelect,
}: ThemeCardProps) {
  const config = themeConfigs[theme];
  const currentInactiveStyle =
    inactiveStyles[activeTheme] || inactiveStyles.couple;

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(theme)}
      className={cn(
        "relative flex flex-col items-start p-4 rounded-xl border-2 transition-all w-full text-left overflow-hidden",
        isActive
          ? cn(config.activeBorder, config.activeBg, "ring-2")
          : cn(
              "border-transparent",
              currentInactiveStyle.bg,
              currentInactiveStyle.hover
            )
      )}
    >
      {/* Preview Area */}
      <div
        className={cn(
          "w-full h-24 rounded-lg mb-3 flex items-center justify-center text-3xl border shadow-sm",
          config.previewClass
        )}
      >
        {config.icon}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 w-full">
        <div className="flex items-center justify-between w-full">
          <span
            className={cn(
              "font-bold text-sm",
              isActive ? config.textClass : currentInactiveStyle.text
            )}
          >
            {name}
          </span>
          {isActive && (
            <div
              className={cn(
                "p-1 rounded-full",
                config.checkBg,
                config.checkText
              )}
            >
              <Check className="w-3 h-3" />
            </div>
          )}
        </div>
        <span
          className={cn(
            "text-xs line-clamp-1",
            isActive ? config.descClass : currentInactiveStyle.desc
          )}
        >
          {description}
        </span>
      </div>
    </motion.button>
  );
}
