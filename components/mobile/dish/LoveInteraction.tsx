"use client";

import { motion } from "framer-motion";
import { ThemeName } from "@/types";
import { cn } from "@/lib/utils";
import { Heart, Send } from "lucide-react";

interface LoveInteractionProps {
  popularity?: number;
  theme: ThemeName;
}

export default function LoveInteraction({
  popularity = 0,
  theme,
}: LoveInteractionProps) {
  const shareCount = Math.floor(popularity / 2);

  const containerStyles = cn(
    "mx-4 p-4 rounded-xl flex justify-between items-center",
    theme === "couple" && "bg-pink-50 border border-pink-100",
    theme === "cute" && "bg-orange-50 border-2 border-dashed border-orange-200",
    theme === "minimal" && "border border-gray-100 bg-gray-50",
    theme === "night" && "bg-gray-900 border border-gray-700"
  );

  return (
    <div className={containerStyles}>
      <div className="flex flex-col gap-1">
        <span
          className={cn(
            "text-xs font-medium uppercase tracking-wider",
            theme === "couple" && "text-pink-400",
            theme === "cute" && "text-orange-400",
            theme === "night" && "text-purple-400",
            theme === "minimal" && "text-gray-400"
          )}
        >
          情侣互动
        </span>
        <h3
          className={cn(
            "font-semibold text-lg flex items-center gap-2",
            theme === "night" ? "text-white" : "text-gray-800"
          )}
        >
          今天TA想吃 {theme === "cute" ? "😋" : "❤️"}
        </h3>
      </div>

      <div className="flex gap-4">
        <div className="flex flex-col items-center">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center mb-1",
              theme === "couple" && "bg-pink-100 text-pink-500",
              theme === "cute" && "bg-yellow-100 text-yellow-600",
              theme === "minimal" && "bg-gray-100 text-gray-800",
              theme === "night" &&
                "bg-gray-800 text-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.3)]"
            )}
          >
            <Heart className="w-5 h-5 fill-current" />
          </motion.div>
          <span
            className={cn(
              "text-xs",
              theme === "night" ? "text-gray-400" : "text-gray-500"
            )}
          >
            {popularity}
          </span>
        </div>

        <div className="flex flex-col items-center">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center mb-1",
              theme === "couple" && "bg-blue-50 text-blue-500",
              theme === "cute" && "bg-blue-100 text-blue-600",
              theme === "minimal" && "bg-gray-100 text-gray-800",
              theme === "night" &&
                "bg-gray-800 text-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.3)]"
            )}
          >
            <Send className="w-5 h-5" />
          </motion.div>
          <span
            className={cn(
              "text-xs",
              theme === "night" ? "text-gray-400" : "text-gray-500"
            )}
          >
            {shareCount}
          </span>
        </div>
      </div>
    </div>
  );
}
