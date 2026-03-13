"use client";

import { motion } from "framer-motion";
import { ThemeName } from "@/types";
import { cn } from "@/lib/utils";
import { Heart, Smile } from "lucide-react";

interface IngredientCostProps {
  kissPrice: number;
  hugPrice: number;
  theme: ThemeName;
}

export default function IngredientCost({
  kissPrice,
  hugPrice,
  theme,
}: IngredientCostProps) {
  const containerStyles = cn(
    "mx-4 p-4 rounded-xl flex flex-col gap-3",
    theme === "couple" && "bg-white shadow-sm border border-pink-100",
    theme === "cute" && "bg-white border-2 border-orange-200 border-dashed relative",
    theme === "minimal" && "bg-white border border-gray-200",
    theme === "night" && "bg-gray-800 border border-purple-900/50"
  );

  const getBadgeStyles = (type: "kiss" | "hug") => {
    switch (theme) {
      case "couple":
        return type === "kiss"
          ? "bg-pink-100 text-pink-600 px-3 py-1 rounded-full flex items-center gap-2"
          : "bg-blue-100 text-blue-600 px-3 py-1 rounded-full flex items-center gap-2";
      case "cute":
        return type === "kiss"
          ? "bg-yellow-200 text-orange-800 px-4 py-2 rounded-lg rotate-[-2deg] shadow-sm flex items-center gap-2 font-bold"
          : "bg-green-200 text-green-800 px-4 py-2 rounded-lg rotate-[1deg] shadow-sm flex items-center gap-2 font-bold";
      case "night":
        return type === "kiss"
          ? "border border-pink-500 text-pink-400 px-3 py-1 rounded-md shadow-[0_0_5px_rgba(236,72,153,0.4)] flex items-center gap-2"
          : "border border-blue-500 text-blue-400 px-3 py-1 rounded-md shadow-[0_0_5px_rgba(59,130,246,0.4)] flex items-center gap-2";
      case "minimal":
      default:
        return "border border-gray-300 text-gray-700 px-3 py-1 rounded-md flex items-center gap-2";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className={containerStyles}
    >
      <h3
        className={cn(
          "font-medium text-sm uppercase tracking-wide",
          theme === "night" ? "text-gray-400" : "text-gray-500"
        )}
      >
        点菜消耗
      </h3>

      <div className="flex flex-wrap gap-3">
        {kissPrice > 0 && (
          <div className={getBadgeStyles("kiss")}>
            <Heart className="w-4 h-4 fill-current" />
            <span>{kissPrice} 个亲亲</span>
          </div>
        )}
        {hugPrice > 0 && (
          <div className={getBadgeStyles("hug")}>
            <Smile className="w-4 h-4" />
            <span>{hugPrice} 个抱抱</span>
          </div>
        )}
        {kissPrice === 0 && hugPrice === 0 && (
          <span className="text-gray-400 italic text-sm">免费 (Free Love)</span>
        )}
      </div>
    </motion.div>
  );
}
