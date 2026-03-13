"use client";

import { motion } from "framer-motion";
import { ThemeName } from "@/types";
import { cn } from "@/lib/utils";
import { Lightbulb } from "lucide-react";

interface MemoryTipProps {
  theme: ThemeName;
}

export default function MemoryTip({ theme }: MemoryTipProps) {
  const containerStyles = cn(
    "mx-4 p-4 rounded-xl flex items-start gap-3 mb-20", // margin-bottom for fixed footer
    theme === "couple" && "bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-100",
    theme === "cute" && "bg-yellow-50 border-2 border-yellow-200 rounded-3xl",
    theme === "minimal" && "bg-gray-50 border-l-4 border-gray-800 rounded-r-lg",
    theme === "night" && "bg-gray-800/50 border border-gray-700"
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className={containerStyles}
    >
      <div
        className={cn(
          "p-2 rounded-full shrink-0",
          theme === "couple" && "bg-white text-yellow-500 shadow-sm",
          theme === "cute" && "bg-yellow-300 text-yellow-900",
          theme === "night" && "bg-gray-700 text-yellow-400",
          theme === "minimal" && "bg-black text-white"
        )}
      >
        <Lightbulb className="w-5 h-5" />
      </div>
      <div>
        <h4
          className={cn(
            "font-semibold mb-1",
            theme === "night" ? "text-gray-200" : "text-gray-900"
          )}
        >
          情侣小提示
        </h4>
        <p
          className={cn(
            "text-sm leading-relaxed",
            theme === "night" ? "text-gray-400" : "text-gray-600"
          )}
        >
          这道菜适合一起追剧的时候吃，或者周末一起做！
        </p>
      </div>
    </motion.div>
  );
}
