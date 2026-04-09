"use client";

import React, { useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { Dice5, Zap, Sparkles, Heart } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { ThemeName, Dish } from "@/types";
import { useDishes } from "@/apis/dishes";

interface FoodRouletteCardProps {
  dishes?: Dish[];
}

const themeStyles: Record<
  ThemeName,
  {
    container: string;
    title: string;
    wheel: string;
    wheelBorder: string;
    wheelText: string;
    button: string;
    result: string;
    icon: React.ElementType;
  }
> = {
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

export default function FoodRouletteCard({
  dishes: propDishes,
}: FoodRouletteCardProps) {
  const { theme } = useTheme();
  const { data: apiDishes = [] } = useDishes();
  const currentTheme = themeStyles[theme] || themeStyles.couple;
  const Icon = currentTheme.icon;

  const controls = useAnimation();
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const dishes = propDishes?.length ? propDishes : apiDishes;
  const displayDishes =
    dishes.length > 0 ? dishes : [{ id: "1", name: "暂无菜品" }];

  const spinWheel = async () => {
    if (isSpinning || displayDishes.length <= 1) return;

    setIsSpinning(true);
    setResult(null);

    const segmentAngle = 360 / displayDishes.length;
    const randomSegment = Math.floor(Math.random() * displayDishes.length);

    const extraRotation = -90 - (randomSegment + 0.5) * segmentAngle;
    const totalRotation = 1800 + extraRotation;

    await controls.start({
      rotate: [0, totalRotation],
      transition: {
        duration: 3,
        ease: [0.1, 0.05, 0.2, 1],
      },
    });

    setResult(displayDishes[randomSegment].name);
    setIsSpinning(false);
    controls.set({ rotate: extraRotation });
  };

  return (
    <div
      className={cn(
        "rounded-4xl p-6 shadow-sm border flex flex-col items-center gap-6 overflow-hidden relative",
        currentTheme.container
      )}
    >
      <div className="flex items-center gap-2 font-bold text-lg self-start">
        <Icon className={cn("w-5 h-5", currentTheme.title)} />
        <span className={currentTheme.title}>
          {theme === "minimal" ? "随机选择" : "今天吃什么？"}
        </span>
      </div>

      <div className="relative w-48 h-48">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <div
            className={cn(
              "w-4 h-6",
              theme === "minimal" ? "bg-black" : "bg-red-500"
            )}
            style={{ clipPath: "polygon(50% 100%, 0 0, 100% 0)" }}
          />
        </div>

        <motion.div
          animate={controls}
          className={cn(
            "w-full h-full rounded-full border-4 flex items-center justify-center relative overflow-hidden",
            currentTheme.wheel,
            currentTheme.wheelBorder
          )}
        >
          <div className="absolute inset-0">
            {displayDishes.map((_, index) => (
              <div
                key={index}
                className="absolute top-1/2 left-1/2 w-1/2 h-px bg-gray-200/50 origin-left"
                style={{
                  transform: `rotate(${index * (360 / displayDishes.length)}deg)`,
                }}
              />
            ))}
          </div>

          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <span className="text-xs font-bold opacity-50 bg-white/80 rounded-full px-1">
              {theme === "cute"
                ? "🍭"
                : theme === "couple"
                  ? "❤️"
                  : theme === "night"
                    ? "⚡"
                    : "Start"}
            </span>
          </div>

          {displayDishes.map((dish, i) => {
            const segmentAngle = 360 / displayDishes.length;
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

      <div className="flex flex-col items-center gap-4 w-full">
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <p className="text-sm text-gray-500">决定好了！</p>
            <p className={cn("text-xl font-bold", currentTheme.result)}>
              {result}
            </p>
          </motion.div>
        )}

        <button
          onClick={spinWheel}
          disabled={isSpinning || displayDishes.length <= 1}
          className={cn(
            "px-6 py-2.5 rounded-full font-medium shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
            currentTheme.button
          )}
        >
          {isSpinning ? "转转转..." : "开始选择"}
        </button>
      </div>
    </div>
  );
}
