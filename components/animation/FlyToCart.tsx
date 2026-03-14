"use client";

import React, { useEffect } from "react";
import { motion, useAnimation, Transition } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { ThemeName } from "@/types";
import Image from "next/image";

interface FlyToCartProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  imageSrc: string;
  onComplete?: () => void;
}

export default function FlyToCart({
  startX,
  startY,
  endX,
  endY,
  imageSrc,
  onComplete,
}: FlyToCartProps) {
  const controls = useAnimation();
  const { theme } = useTheme();

  useEffect(() => {
    const xDist = endX - startX;
    const yDist = endY - startY;

    const sequence = async () => {
      await controls.start({
        x: xDist,
        y: yDist,
        scale: [1, 0.8, 0.2],
        opacity: [1, 1, 0.8, 0],
        rotate: [0, 45, 90, 180], // Add some rotation for fun
        transition: {
          duration: 0.6,
          // Custom bezier for "throw" feel
          ease: [0.25, 0.1, 0.25, 1.0], 
          // Separate axes for parabolic effect
          x: { duration: 0.6, ease: "linear" },
          y: { duration: 0.6, ease: "circIn" }, // Accelerate down (gravity)
        } as any, // Cast to any because TS might complain about separate axis configs in this context
      });
      onComplete?.();
    };
    sequence();
  }, [controls, endX, endY, startX, startY, onComplete]);

  // Theme-based styles
  const getThemeStyles = (theme: ThemeName) => {
    switch (theme) {
      case "couple":
        return "shadow-[0_0_15px_rgba(236,72,153,0.6)] border-pink-200 ring-2 ring-pink-100";
      case "cute":
        return "shadow-[0_0_15px_rgba(249,115,22,0.6)] border-orange-200 ring-2 ring-orange-100";
      case "night":
        return "shadow-[0_0_20px_rgba(139,92,246,0.8)] border-purple-500 ring-1 ring-purple-400 brightness-110";
      case "minimal":
      default:
        return "shadow-lg border-gray-200 grayscale ring-1 ring-gray-100";
    }
  };

  return (
    <motion.div
      initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
      animate={controls}
      style={{
        position: "fixed", // Changed to fixed to ensure it's relative to viewport
        left: startX,
        top: startY,
        width: 48, // Slightly larger
        height: 48,
        marginLeft: -24, // Center anchor
        marginTop: -24,
        zIndex: 9999,
        pointerEvents: "none",
      }}
      className={`rounded-full overflow-hidden border-2 bg-white ${getThemeStyles(theme)}`}
    >
        {imageSrc ? (
            <Image 
                src={imageSrc} 
                alt="flying-item" 
                fill
                className="object-cover"
            />
        ) : (
            <div className="w-full h-full bg-gray-200" />
        )}
    </motion.div>
  );
}
