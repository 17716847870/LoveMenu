"use client";

import { motion } from "framer-motion";
import { ThemeName } from "@/types";
import { cn } from "@/lib/utils";
import { Heart, Share2 } from "lucide-react";

interface DishMainCardProps {
  description?: string;
  popularity?: number;
  theme: ThemeName;
}

export default function DishMainCard({
  description,
  popularity = 0,
  theme,
}: DishMainCardProps) {
  const shareCount = Math.floor(popularity / 2); // Mock share count

  const getCardStyles = () => {
    switch (theme) {
      case "couple":
        return "bg-white rounded-3xl shadow-lg shadow-pink-200/50 p-6 -mt-8 mx-4 relative z-10 border border-pink-50";
      case "cute":
        return "bg-yellow-50 rounded-[2rem] border-4 border-white shadow-md p-6 -mt-8 mx-4 relative z-10";
      case "minimal":
        return "bg-white border border-gray-200 p-6 -mt-8 mx-4 relative z-10 shadow-sm";
      case "night":
        return "bg-gray-800 border border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.2)] p-6 -mt-8 mx-4 relative z-10 rounded-xl text-gray-100";
      default:
        return "bg-white rounded-xl shadow-md p-6 -mt-8 mx-4 relative z-10";
    }
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className={getCardStyles()}
    >
      <p
        className={cn(
          "text-lg mb-4 leading-relaxed",
          theme === "night" ? "text-gray-300" : "text-gray-700",
          theme === "cute" && "font-medium text-orange-800"
        )}
      >
        {description || "暂无介绍"}
      </p>

      <div className="flex items-center gap-6 text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <Heart
            className={cn(
              "w-4 h-4",
              theme === "couple" && "text-pink-500 fill-pink-500",
              theme === "cute" && "text-red-500",
              theme === "night" && "text-purple-400"
            )}
          />
          <span className={theme === "night" ? "text-gray-400" : ""}>
            {popularity} 次
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Share2
            className={cn(
              "w-4 h-4",
              theme === "couple" && "text-blue-400",
              theme === "cute" && "text-blue-500",
              theme === "night" && "text-blue-400"
            )}
          />
          <span className={theme === "night" ? "text-gray-400" : ""}>
            {shareCount} 分享
          </span>
        </div>
      </div>
    </motion.div>
  );
}
