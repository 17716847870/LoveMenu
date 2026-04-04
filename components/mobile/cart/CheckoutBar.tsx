"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { ThemeName } from "@/types";

interface CheckoutBarProps {
  onCheckout: () => void;
  totals: { kiss: number; hug: number };
  isLoading?: boolean;
}

const themeStyles: Record<ThemeName, {
  container: string;
  button: string;
}> = {
  couple: {
    container: "bg-white/90 backdrop-blur-md border-t border-pink-100 shadow-[0_-4px_20px_rgba(255,192,203,0.3)]",
    button: "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-pink-200",
  },
  cute: {
    container: "bg-[#fff5fb]/90 backdrop-blur-md border-t border-orange-100 shadow-[0_-4px_20px_rgba(255,237,213,0.5)]",
    button: "bg-orange-400 text-white shadow-orange-200 border-b-4 border-orange-600 active:border-b-0 active:translate-y-1",
  },
  minimal: {
    container: "bg-white/90 backdrop-blur-md border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]",
    button: "bg-black text-white hover:bg-gray-800",
  },
  night: {
    container: "bg-[#1f1f1f]/90 backdrop-blur-md border-t border-gray-800 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]",
    button: "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-purple-900/50",
  },
};

export default function CheckoutBar({ onCheckout, totals, isLoading }: CheckoutBarProps) {
  const { theme } = useTheme();
  const styles = themeStyles[theme];

  return (
    <div className={cn("fixed bottom-0 left-0 right-0 p-4 z-50 max-w-[480px] mx-auto", styles.container)}>
      <motion.button
        whileTap={{ scale: isLoading ? 1 : 0.98 }}
        onClick={onCheckout}
        disabled={isLoading}
        className={cn(
          "w-full py-3.5 rounded-full font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg",
          styles.button,
          isLoading && "opacity-70 cursor-not-allowed"
        )}
      >
        <span>{isLoading ? "处理中..." : "立即下单"}</span>
        <span className="text-sm font-normal opacity-90">
          (❤️ {totals.kiss} + 🤗 {totals.hug})
        </span>
      </motion.button>
    </div>
  );
}
