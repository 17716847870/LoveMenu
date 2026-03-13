"use client";

import Link from "next/link";
import { motion, TargetAndTransition } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { ThemeName } from "@/types";
import { cn } from "@/lib/utils";

interface TabItemProps {
  path: string;
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  theme: ThemeName;
}

export default function TabItem({
  path,
  label,
  icon: Icon,
  isActive,
  theme,
}: TabItemProps) {
  const isChat = path === "/chat";
  const isProfile = path === "/profile";

  // Animation variants based on tab type and theme
  const getIconAnimation = (): TargetAndTransition => {
    // Chat Blink Animation (placeholder for unread logic, currently just on active)
    if (isChat && isActive) {
      return {
        opacity: [0.6, 1, 0.6],
        transition: {
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut",
        },
      };
    }

    // Profile Bounce Animation (on active)
    if (isProfile && isActive) {
      return {
        y: [0, -5, 0],
        transition: {
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut",
        },
      };
    }

    // Default Active Animation
    if (isActive) {
      if (theme === "cute") {
        return {
          y: -5,
          scale: 1.1,
          transition: { type: "spring", stiffness: 300 },
        };
      }
      return { y: -2 };
    }

    return {};
  };

  const getItemStyles = () => {
    const baseStyles = "flex flex-col items-center justify-center gap-1 w-full h-full relative p-2 transition-colors duration-300 rounded-xl";
    
    switch (theme) {
      case "couple":
        return cn(
          baseStyles,
          isActive ? "text-pink-500" : "text-pink-300 hover:text-pink-400"
        );
      case "cute":
        return cn(
          baseStyles,
          isActive ? "text-orange-500" : "text-orange-300 hover:text-orange-400"
        );
      case "night":
        return cn(
          baseStyles,
          isActive ? "text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" : "text-slate-500 hover:text-slate-400"
        );
      case "minimal":
      default:
        return cn(
          baseStyles,
          isActive ? "text-black font-medium" : "text-gray-400 hover:text-gray-600"
        );
    }
  };

  return (
    <Link href={path} className="flex-1 h-full flex items-center justify-center">
      <motion.div
        className={getItemStyles()}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div animate={getIconAnimation()}>
          <Icon
            size={24}
            className={cn(
              "transition-all duration-300",
              isActive && theme === "couple" && "fill-current",
              isActive && theme === "night" && "drop-shadow-[0_0_5px_currentColor]"
            )}
            strokeWidth={isActive ? 2.5 : 2}
          />
        </motion.div>
        
        <span className="text-[10px] font-medium tracking-wide">
          {label}
        </span>
        
        {/* Active Indicator for minimal theme */}
        {isActive && theme === "minimal" && (
          <motion.div
            layoutId="minimal-indicator"
            className="absolute bottom-1 w-1 h-1 bg-black rounded-full"
          />
        )}
      </motion.div>
    </Link>
  );
}
