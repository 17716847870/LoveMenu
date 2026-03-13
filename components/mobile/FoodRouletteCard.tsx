"use client";

import React, { useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { Dice5, Zap, Sparkles, Heart } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { ThemeName, Dish } from "@/types";

interface FoodRouletteCardProps {
  dishes?: Dish[];
}

// Default Dishes
const defaultDishes: Partial<Dish>[] = [
  { id: "1", name: "拉面" },
  { id: "2", name: "炒饭" },
  { id: "3", name: "炸鸡" },
  { id: "4", name: "汉堡" },
  { id: "5", name: "寿司" },
];

// Theme Configurations
const themeStyles: Record<ThemeName, {
  container: string;
  title: string;
  wheel: string;
  wheelBorder: string;
  wheelText: string;
  button: string;
  result: string;
  icon: React.ElementType;
}> = {
  couple: {
    container: "bg-pink-50 border-pink-100",
    title: "text-pink-600",
    wheel: "bg-white",
    wheelBorder: "border-pink-300",
    wheelText: "text-pink-500",
    button: "bg-pink-500 hover:bg-pink-600 text-white shadow-pink-200",
    result: "text-pink-600",
    icon: Heart,
  },
  cute: {
    container: "bg-orange-50 border-orange-100",
    title: "text-orange-500",
    wheel: "bg-white",
    wheelBorder: "border-orange-300",
    wheelText: "text-orange-500",
    button: "bg-orange-400 hover:bg-orange-500 text-white shadow-orange-200",
    result: "text-orange-600",
    icon: Sparkles,
  },
  minimal: {
    container: "bg-white border-gray-200",
    title: "text-gray-900",
    wheel: "bg-white",
    wheelBorder: "border-gray-900",
    wheelText: "text-gray-900",
    button: "bg-black hover:bg-gray-800 text-white",
    result: "text-black",
    icon: Dice5,
  },
  night: {
    container: "bg-slate-900 border-slate-800",
    title: "text-blue-400",
    wheel: "bg-slate-800",
    wheelBorder: "border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]",
    wheelText: "text-blue-300",
    button: "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/50",
    result: "text-blue-400",
    icon: Zap,
  },
};

export default function FoodRouletteCard({ dishes = defaultDishes as Dish[] }: FoodRouletteCardProps) {
  const { theme } = useTheme();
  const currentTheme = themeStyles[theme] || themeStyles.couple;
  const Icon = currentTheme.icon;

  const controls = useAnimation();
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const spinWheel = async () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setResult(null);

    // Random rotation: at least 5 full spins (1800deg) + random segment
    const segmentAngle = 360 / dishes.length;
    const randomSegment = Math.floor(Math.random() * dishes.length);
    
    // Calculate current rotation to ensure smooth spinning
    // We need to rotate enough to land on the target segment
    // The pointer is at the top (270 degrees in our coordinate system where 0 is right)
    // But since we rotate the wheel container, we need the target segment to be at -90deg (or 270deg)
    
    // Target calculation:
    // Segment i center is at: i * segmentAngle + segmentAngle / 2 (relative to start)
    // We want this center to align with -90deg (Top)
    // So Rotation + SegmentCenter = -90
    // Rotation = -90 - SegmentCenter
    // Rotation = -90 - (i + 0.5) * segmentAngle
    
    // Add extra spins (5 full spins = 1800deg)
    const extraRotation = -90 - (randomSegment + 0.5) * segmentAngle;
    const totalRotation = 1800 + extraRotation;

    await controls.start({
      rotate: [0, totalRotation],
      transition: {
        duration: 3,
        ease: [0.1, 0.05, 0.2, 1], // Custom ease out
      },
    });

    setResult(dishes[randomSegment].name);
    setIsSpinning(false);
    
    // Reset rotation for next spin (visual only)
    controls.set({ rotate: extraRotation });
  };

  return (
    <div className={cn(
      "rounded-4xl p-6 shadow-sm border flex flex-col items-center gap-6 overflow-hidden relative",
      currentTheme.container
    )}>
      {/* Header */}
      <div className="flex items-center gap-2 font-bold text-lg self-start">
        <Icon className={cn("w-5 h-5", currentTheme.title)} />
        <span className={currentTheme.title}>
          {theme === 'minimal' ? "随机选择" : "今天吃什么？"}
        </span>
      </div>

      {/* Wheel Container */}
      <div className="relative w-48 h-48">
        {/* Pointer */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <div className={cn(
            "w-4 h-6 clip-path-triangle",
            theme === 'minimal' ? "bg-black" : "bg-red-500"
          )} style={{ clipPath: "polygon(50% 100%, 0 0, 100% 0)" }} />
        </div>

        {/* Wheel */}
        <motion.div
          animate={controls}
          className={cn(
            "w-full h-full rounded-full border-4 flex items-center justify-center relative overflow-hidden",
            currentTheme.wheel,
            currentTheme.wheelBorder
          )}
        >
          {/* Wheel Segments (Visual Only) */}
          <div className="absolute inset-0">
             {dishes.map((_, index) => (
                <div 
                    key={index}
                    className="absolute top-1/2 left-1/2 w-1/2 h-px bg-gray-200/50 origin-left"
                    style={{ transform: `rotate(${index * (360 / dishes.length)}deg)` }}
                />
             ))}
          </div>

          {/* Center Text/Decor */}
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
             <span className="text-xs font-bold opacity-50 bg-white/80 rounded-full px-1">
               {theme === 'cute' ? "🍭" : theme === 'couple' ? "❤️" : theme === 'night' ? "⚡" : "Start"}
             </span>
          </div>

          {/* Items around the wheel */}
          {dishes.map((dish, i) => {
            const segmentAngle = 360 / dishes.length;
            const angle = i * segmentAngle + segmentAngle / 2;
            return (
              <div
                key={dish.id}
                className={cn(
                  "absolute top-0 left-0 w-full h-full text-[10px] font-medium text-center pt-3 origin-center",
                  currentTheme.wheelText
                )}
                style={{ 
                  transform: `rotate(${angle + 90}deg)`,
                }}
              >
                {dish.name}
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Result & Action */}
      <div className="flex flex-col items-center gap-4 w-full">
        {result && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <p className="text-xs text-muted-foreground mb-1">今天推荐吃：</p>
            <h3 className={cn("text-2xl font-bold", currentTheme.result)}>
              {result}
            </h3>
          </motion.div>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={spinWheel}
          disabled={isSpinning}
          className={cn(
            "w-full py-3 rounded-xl font-bold text-sm shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed",
            currentTheme.button
          )}
        >
          {isSpinning ? "转动中..." : "开始转盘"}
        </motion.button>
      </div>
    </div>
  );
}
