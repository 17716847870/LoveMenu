"use client";

import Link from "next/link";
import { motion, TargetAndTransition } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { ThemeName } from "@/types";
import { cn } from "@/lib/utils";
import CartBadge from "./CartBadge";

interface CartButtonProps {
  isActive: boolean;
  theme: ThemeName;
  cartCount: number;
}

export default function CartButton({ isActive, theme, cartCount }: CartButtonProps) {
  const getButtonStyles = () => {
    const baseStyles = "relative -top-5 w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-300";
    
    switch (theme) {
      case "couple":
        return cn(
          baseStyles,
          "bg-gradient-to-tr from-pink-400 to-rose-400 text-white shadow-pink-200 border-4 border-white",
          isActive && "ring-2 ring-pink-200"
        );
      case "cute":
        return cn(
          baseStyles,
          "bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-orange-200 border-[6px] border-[#fff4fb]",
          isActive && "scale-110"
        );
      case "night":
        return cn(
          baseStyles,
          "bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-blue-900/50 border-2 border-[#1f1f1f]",
          isActive && "shadow-[0_0_15px_rgba(147,51,234,0.6)]"
        );
      case "minimal":
      default:
        return cn(
          baseStyles,
          "bg-black text-white border-4 border-white shadow-gray-200",
          isActive && "scale-105"
        );
    }
  };

  const getAnimation = (): TargetAndTransition => {
    // Heartbeat animation
    return {
      scale: [1, 1.1, 1],
      transition: {
        repeat: Infinity,
        duration: 1.2,
        ease: "easeInOut",
      },
    };
  };

  return (
    <Link href="/cart" className="relative z-10">
      <motion.div
        className={getButtonStyles()}
        whileTap={{ scale: 0.9 }}
        animate={cartCount > 0 ? getAnimation() : {}}
      >
        <ShoppingCart 
          size={28} 
          className={cn(
            "transition-all",
            theme === "couple" && "fill-white/20",
            theme === "night" && "drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]"
          )}
        />
        
        {/* Custom Badge Positioning for Floating Button */}
        {cartCount > 0 && (
          <div className="absolute top-0 right-0">
             <CartBadge count={cartCount} theme={theme} />
          </div>
        )}
      </motion.div>
    </Link>
  );
}
