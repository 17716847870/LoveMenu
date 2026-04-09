"use client";

import { motion } from "framer-motion";
import { ThemeName } from "@/types";
import { cn } from "@/lib/utils";

interface CartBadgeProps {
  count: number;
  theme: ThemeName;
}

export default function CartBadge({ count, theme }: CartBadgeProps) {
  if (count <= 0) return null;

  const getBadgeStyles = () => {
    switch (theme) {
      case "couple":
        return "bg-red-500 text-white border-2 border-white shadow-sm";
      case "cute":
        return "bg-red-500 text-white border-2 border-white shadow-sm";
      case "night":
        return "bg-red-600 text-white border border-gray-900 shadow-[0_0_8px_rgba(220,38,38,0.6)]";
      case "minimal":
      default:
        return "bg-red-600 text-white border border-white";
    }
  };

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      className={cn(
        "min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] font-bold px-1 z-20",
        getBadgeStyles()
      )}
      style={{
        position: "absolute",
        top: "-4px",
        right: "-4px",
      }}
    >
      {count > 99 ? "99+" : count}
    </motion.div>
  );
}
