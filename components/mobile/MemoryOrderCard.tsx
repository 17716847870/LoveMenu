"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Heart, 
  Smile, 
  Quote,
  Sparkles,
  Zap
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { ThemeName } from "@/types";
import { Order } from "./OrderItemCard";

interface MemoryOrderCardProps {
  order: Order;
  index: number;
}

const themeStyles: Record<ThemeName, {
  container: string;
  time: string;
  dish: string;
  price: string;
  note: string;
  noteIcon: string;
  dot: string;
  line: string;
}> = {
  couple: {
    container: "bg-white border-pink-100 hover:border-pink-300 shadow-sm hover:shadow-md",
    time: "text-pink-300",
    dish: "text-pink-900",
    price: "text-pink-500",
    note: "bg-pink-50 text-pink-600 border-pink-100",
    noteIcon: "text-pink-300",
    dot: "bg-pink-400 border-pink-100",
    line: "bg-pink-100",
  },
  cute: {
    container: "bg-white border-orange-200 shadow-[4px_4px_0px_0px_rgba(251,146,60,0.2)]",
    time: "text-orange-300",
    dish: "text-orange-900",
    price: "text-orange-500",
    note: "bg-orange-50 text-orange-600 border-orange-200",
    noteIcon: "text-orange-300",
    dot: "bg-orange-400 border-orange-100",
    line: "bg-orange-100",
  },
  minimal: {
    container: "bg-white border-gray-200",
    time: "text-gray-400",
    dish: "text-gray-900",
    price: "text-gray-900",
    note: "bg-gray-50 text-gray-600 border-gray-200 italic",
    noteIcon: "text-gray-400",
    dot: "bg-black border-white",
    line: "bg-gray-200",
  },
  night: {
    container: "bg-slate-800 border-slate-700 shadow-[0_0_15px_rgba(96,165,250,0.15)]",
    time: "text-slate-500",
    dish: "text-blue-100",
    price: "text-blue-400",
    note: "bg-slate-900/50 text-blue-300 border-slate-700",
    noteIcon: "text-blue-500/50",
    dot: "bg-blue-500 border-slate-900 shadow-[0_0_10px_rgba(59,130,246,0.5)]",
    line: "bg-slate-800",
  },
};

export default function MemoryOrderCard({ order, index }: MemoryOrderCardProps) {
  const { theme } = useTheme();
  const currentTheme = themeStyles[theme] || themeStyles.couple;

  return (
    <div className="relative pl-8 pb-8 last:pb-0">
      {/* Timeline Line */}
      <div className={cn(
        "absolute left-[11px] top-2 bottom-0 w-[2px]",
        currentTheme.line
      )} />
      
      {/* Timeline Dot */}
      <div className={cn(
        "absolute left-[6px] top-2 w-3 h-3 rounded-full border-2 box-content z-10",
        currentTheme.dot
      )} />

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
        className={cn(
          "rounded-2xl p-5 border flex flex-col gap-3 transition-all",
          currentTheme.container
        )}
      >
        {/* Header */}
        <div className="flex justify-between items-start">
          <h3 className={cn("text-lg font-bold line-clamp-1", currentTheme.dish)}>
            {order.dishes.join(" + ")}
          </h3>
          <span className={cn("text-xs font-medium", currentTheme.time)}>
            {order.createdAt.split(' ')[1]}
          </span>
        </div>

        {/* Price */}
        <div className={cn("flex items-center gap-3 font-medium", currentTheme.price)}>
          {order.kissPrice > 0 && (
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4" /> {order.kissPrice}
            </span>
          )}
          {order.hugPrice > 0 && (
            <span className="flex items-center gap-1">
              <Smile className="w-4 h-4" /> {order.hugPrice}
            </span>
          )}
        </div>

        {/* Memory Note */}
        {order.memoryNote && (
          <div className={cn(
            "mt-1 p-3 rounded-xl text-sm relative border",
            currentTheme.note
          )}>
            <Quote className={cn(
              "absolute -top-2 -left-1 w-4 h-4 rotate-180 bg-white rounded-full p-[2px]",
              currentTheme.noteIcon
            )} />
            {order.memoryNote}
          </div>
        )}
      </motion.div>
    </div>
  );
}
