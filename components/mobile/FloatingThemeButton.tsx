"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette } from "lucide-react";
import ThemeDrawer from "./ThemeDrawer";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { ThemeName } from "@/types";
import { usePathname } from "next/navigation";

const themeStyles: Record<ThemeName, {
  button: string;
  icon: string;
}> = {
  couple: {
    button: "bg-white border-pink-200 shadow-lg shadow-pink-100 hover:border-pink-300",
    icon: "text-pink-500",
  },
  cute: {
    button: "bg-white border-orange-200 shadow-[4px_4px_0px_0px_rgba(251,146,60,0.2)] hover:border-orange-300",
    icon: "text-orange-500",
  },
  minimal: {
    button: "bg-white border-gray-200 shadow-lg hover:border-gray-900",
    icon: "text-gray-900",
  },
  night: {
    button: "bg-slate-800 border-slate-700 shadow-[0_0_15px_rgba(124,58,237,0.3)] hover:border-violet-500/50",
    icon: "text-violet-400",
  },
};

export default function FloatingThemeButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();
  const currentTheme = themeStyles[theme] || themeStyles.couple;
  const pathname = usePathname();

  // Define paths where the FloatingThemeButton should be hidden
  const hiddenPaths = ["/chat", "/admin"];

  // Check if current path starts with any of the hidden paths
  const shouldHide = hiddenPaths.some((path) => pathname.startsWith(path));

  if (shouldHide) {
    return null;
  }

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 90 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className={cn(
              "fixed right-4 bottom-24 z-50 w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300",
              currentTheme.button
            )}
          >
            <Palette className={cn("w-6 h-6", currentTheme.icon)} />
          </motion.button>
        )}
      </AnimatePresence>

      <ThemeDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
