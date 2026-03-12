"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { ThemeName } from "@/types";
import Link from "next/link";

interface FloatingCartButtonProps {
  count: number;
}

const themeStyles: Record<ThemeName, {
  button: string;
  badge: string;
}> = {
  couple: {
    button: "bg-pink-500 text-white hover:bg-pink-600 shadow-lg shadow-pink-200",
    badge: "bg-white text-pink-600 border border-pink-100",
  },
  cute: {
    button: "bg-orange-500 text-white hover:bg-orange-600 shadow-[4px_4px_0px_0px_rgba(251,146,60,0.3)]",
    badge: "bg-white text-orange-600 border-2 border-orange-200",
  },
  minimal: {
    button: "bg-black text-white hover:bg-gray-800 shadow-xl",
    badge: "bg-white text-black border border-gray-200",
  },
  night: {
    button: "bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)] border border-blue-400/50",
    badge: "bg-slate-900 text-blue-400 border border-blue-500/50",
  },
};

export default function FloatingCartButton({ count }: FloatingCartButtonProps) {
  const { theme } = useTheme();
  const currentTheme = themeStyles[theme] || themeStyles.couple;

  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="fixed bottom-[100px] right-6 z-50"
        >
          <Link href="/cart">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={cn(
                "w-14 h-14 rounded-full flex items-center justify-center relative transition-colors",
                currentTheme.button
              )}
            >
              <ShoppingBag className="w-6 h-6" />
              
              <motion.div
                key={count}
                initial={{ scale: 1.5 }}
                animate={{ scale: 1 }}
                className={cn(
                  "absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                  currentTheme.badge
                )}
              >
                {count}
              </motion.div>
            </motion.button>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
