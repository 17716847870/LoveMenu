"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Heart, Smile } from "lucide-react";
import { ThemeName } from "@/types";
import { cn } from "@/lib/utils";

interface DishHeaderProps {
  onBack: () => void;
  onFavorite: () => void;
  isFavorite: boolean;
  theme: ThemeName;
}

export default function DishHeader({
  onBack,
  onFavorite,
  isFavorite,
  theme,
}: DishHeaderProps) {
  const getFavoriteButton = () => {
    switch (theme) {
      case "couple":
        return (
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={onFavorite}
            className={cn(
              "p-2 rounded-full bg-white/50 backdrop-blur-md shadow-sm transition-colors",
              isFavorite
                ? "text-red-500 bg-pink-100"
                : "text-gray-600 hover:bg-white/80"
            )}
          >
            <Heart className={cn("w-6 h-6", isFavorite && "fill-current")} />
          </motion.button>
        );
      case "cute":
        return (
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.9 }}
            onClick={onFavorite}
            className={cn(
              "p-2 rounded-full bg-yellow-100 shadow-md border-2 border-orange-200",
              isFavorite ? "bg-yellow-200" : ""
            )}
          >
            {isFavorite ? (
              <span className="text-xl">😍</span>
            ) : (
              <Smile className="w-6 h-6 text-orange-500" />
            )}
          </motion.button>
        );
      case "night":
        return (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onFavorite}
            className={cn(
              "p-2 rounded-full bg-gray-800 border border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]",
              isFavorite
                ? "shadow-[0_0_15px_rgba(236,72,153,0.8)] border-pink-500"
                : ""
            )}
          >
            <Heart
              className={cn(
                "w-6 h-6 text-purple-400",
                isFavorite && "text-pink-500 fill-current"
              )}
            />
          </motion.button>
        );
      case "minimal":
      default:
        return (
          <button
            onClick={onFavorite}
            className={cn(
              "p-2 rounded-full bg-white border border-gray-200 shadow-sm transition-colors",
              isFavorite
                ? "bg-black text-white"
                : "text-black hover:bg-gray-100"
            )}
          >
            <Heart className={cn("w-6 h-6", isFavorite && "fill-current")} />
          </button>
        );
    }
  };

  const getBackButton = () => {
    switch (theme) {
      case "night":
        return (
          <button
            onClick={onBack}
            className="p-2 rounded-full bg-gray-800 border border-purple-500 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.3)] hover:bg-gray-700"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        );
      case "cute":
        return (
          <button
            onClick={onBack}
            className="p-2 rounded-full bg-white border-2 border-orange-200 text-orange-500 shadow-sm hover:bg-orange-50"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        );
      case "minimal":
        return (
          <button
            onClick={onBack}
            className="p-2 rounded-full bg-white border border-gray-200 text-black shadow-sm hover:bg-gray-100"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        );
      case "couple":
      default:
        return (
          <button
            onClick={onBack}
            className="p-2 rounded-full bg-white/50 backdrop-blur-md shadow-sm text-gray-700 hover:bg-white/80"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        );
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-4 max-w-[480px] mx-auto flex items-center justify-between pointer-events-none">
      <div className="pointer-events-auto">{getBackButton()}</div>
      <div className="pointer-events-auto">{getFavoriteButton()}</div>
    </div>
  );
}
