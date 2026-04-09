"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { ThemeName } from "@/types";
import { ShoppingCart } from "lucide-react";

const themeStyles: Record<
  ThemeName,
  {
    container: string;
    icon: string;
    title: string;
    desc: string;
    button: string;
  }
> = {
  couple: {
    container: "bg-pink-50",
    icon: "bg-pink-100 text-pink-500",
    title: "text-pink-900",
    desc: "text-pink-400",
    button: "bg-pink-500 text-white shadow-pink-200",
  },
  cute: {
    container: "bg-orange-50",
    icon: "bg-orange-100 text-orange-500",
    title: "text-orange-900",
    desc: "text-orange-400",
    button: "bg-orange-400 text-white shadow-orange-200",
  },
  minimal: {
    container: "bg-gray-50",
    icon: "bg-gray-200 text-gray-500",
    title: "text-gray-900",
    desc: "text-gray-500",
    button: "bg-black text-white",
  },
  night: {
    container: "bg-slate-900",
    icon: "bg-slate-800 text-purple-400",
    title: "text-white",
    desc: "text-slate-400",
    button: "bg-purple-600 text-white shadow-purple-900/50",
  },
};

export default function EmptyCart() {
  const { theme } = useTheme();
  const styles = themeStyles[theme];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={cn(
          "w-24 h-24 rounded-full flex items-center justify-center mb-6",
          styles.icon
        )}
      >
        <ShoppingCart size={40} />
      </motion.div>

      <h2 className={cn("text-xl font-bold mb-2", styles.title)}>
        购物车还是空的
      </h2>
      <p className={cn("text-sm mb-8", styles.desc)}>
        快去选点好吃的吧，宝贝都饿坏啦
      </p>

      <Link href="/menu" className="w-full max-w-[200px]">
        <motion.button
          whileTap={{ scale: 0.95 }}
          className={cn(
            "w-full py-3 rounded-full font-semibold shadow-lg transition-all",
            styles.button
          )}
        >
          去菜单看看
        </motion.button>
      </Link>
    </div>
  );
}
