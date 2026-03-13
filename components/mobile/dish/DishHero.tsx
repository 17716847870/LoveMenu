"use client";

import { motion } from "framer-motion";
import { ThemeName } from "@/types";
import { cn } from "@/lib/utils";

interface DishHeroProps {
  image: string;
  name: string;
  theme: ThemeName;
}

export default function DishHero({ image, name, theme }: DishHeroProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-full aspect-video overflow-hidden"
    >
      {/* Image */}
      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover"
      />

      {/* Gradient Overlay */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6",
          theme === "couple" && "from-pink-900/80",
          theme === "night" && "from-gray-900/90",
          theme === "cute" && "from-orange-900/60"
        )}
      >
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={cn(
            "text-3xl font-bold text-white mb-2",
            theme === "cute" && "font-rounded", // Assuming a rounded font class or just default
            theme === "minimal" && "font-light"
          )}
        >
          {name}
        </motion.h1>
      </div>
    </motion.div>
  );
}
