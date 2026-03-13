"use client";

import { motion } from "framer-motion";
import { ThemeName } from "@/types";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

interface AddToMenuBarProps {
  onAdd: () => void;
  theme: ThemeName;
}

export default function AddToMenuBar({ onAdd, theme }: AddToMenuBarProps) {
  const getButtonStyles = () => {
    switch (theme) {
      case "couple":
        return "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-300/50 hover:shadow-pink-300/80 rounded-full";
      case "cute":
        return "bg-yellow-400 text-orange-900 border-b-4 border-orange-600 active:border-b-0 active:translate-y-1 rounded-2xl shadow-md";
      case "night":
        return "bg-gray-900 border border-purple-500 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.5)] hover:shadow-[0_0_25px_rgba(168,85,247,0.8)] hover:bg-gray-800 rounded-lg";
      case "minimal":
      default:
        return "bg-black text-white hover:bg-gray-800 rounded-md shadow-sm";
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white/90 to-transparent z-50 pointer-events-none max-w-[480px] mx-auto">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onAdd}
        className={cn(
          "w-full py-3.5 px-6 flex items-center justify-center gap-2 font-semibold text-lg transition-all pointer-events-auto",
          getButtonStyles()
        )}
      >
        <Plus className="w-5 h-5" />
        <span>加入菜单</span>
      </motion.button>
    </div>
  );
}
