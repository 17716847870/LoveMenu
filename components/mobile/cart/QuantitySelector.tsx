"use client";

import React from "react";
import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { ThemeName } from "@/types";

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

const themeStyles: Record<ThemeName, { 
  btn: string; 
  text: string; 
  container: string;
}> = {
  couple: {
    btn: "bg-pink-100 text-pink-600 hover:bg-pink-200 active:bg-pink-300",
    text: "text-pink-900",
    container: "bg-pink-50/50",
  },
  cute: {
    btn: "bg-orange-100 text-orange-600 hover:bg-orange-200 active:bg-orange-300",
    text: "text-orange-900",
    container: "bg-orange-50/50",
  },
  minimal: {
    btn: "bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300",
    text: "text-gray-900",
    container: "bg-gray-50",
  },
  night: {
    btn: "bg-slate-700 text-purple-300 hover:bg-slate-600 active:bg-slate-500",
    text: "text-white",
    container: "bg-slate-800",
  },
};

export default function QuantitySelector({ quantity, onIncrease, onDecrease }: QuantitySelectorProps) {
  const { theme } = useTheme();
  const styles = themeStyles[theme];

  return (
    <div className={cn("flex items-center gap-3 rounded-full px-1 py-1", styles.container)}>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.stopPropagation();
          onDecrease();
        }}
        className={cn("w-6 h-6 rounded-full flex items-center justify-center", styles.btn)}
      >
        <Minus size={14} />
      </motion.button>
      
      <motion.span 
        key={quantity}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={cn("font-semibold min-w-[1ch] text-center text-sm", styles.text)}
      >
        {quantity}
      </motion.span>

      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.stopPropagation();
          onIncrease();
        }}
        className={cn("w-6 h-6 rounded-full flex items-center justify-center", styles.btn)}
      >
        <Plus size={14} />
      </motion.button>
    </div>
  );
}
