"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Heart, Sparkles, Target, Zap, ArrowRight } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useCart } from "@/hooks/useCart";
import { cn } from "@/lib/utils";
import { ThemeName, Dish } from "@/types";
import FoodRecommendationItem from "./FoodRecommendationItem";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface DailyRecommendationProps {
  compact?: boolean;
}

interface RecommendationItem extends Dish {
  reason: string;
  isFavorite: boolean;
}

const themeStyles: Record<ThemeName, {
  container: string;
  header: string;
  refreshButton: string;
  viewAll: string;
  icon: React.ElementType;
}> = {
  couple: {
    container: "bg-gradient-to-br from-pink-50 to-white border-pink-100 shadow-sm",
    header: "text-pink-600",
    refreshButton: "text-pink-400 hover:text-pink-600 hover:bg-pink-100",
    viewAll: "text-pink-500 hover:text-pink-600 bg-pink-50/50 hover:bg-pink-100",
    icon: Heart,
  },
  cute: {
    container: "bg-orange-50 border-orange-100 shadow-[4px_4px_0px_0px_rgba(251,146,60,0.2)]",
    header: "text-orange-500",
    refreshButton: "text-orange-400 hover:text-orange-600 hover:bg-orange-100",
    viewAll: "text-orange-500 hover:text-orange-600 bg-orange-100/50 hover:bg-orange-200/50",
    icon: Sparkles,
  },
  minimal: {
    container: "bg-white border-gray-200",
    header: "text-gray-900",
    refreshButton: "text-gray-400 hover:text-gray-900 hover:bg-gray-100",
    viewAll: "text-gray-600 hover:text-black bg-gray-50 hover:bg-gray-100",
    icon: Target,
  },
  night: {
    container: "bg-slate-900 border-slate-800 shadow-[0_0_15px_rgba(59,130,246,0.15)]",
    header: "text-blue-400",
    refreshButton: "text-blue-500 hover:text-blue-300 hover:bg-blue-900/50",
    viewAll: "text-blue-400 hover:text-blue-300 bg-blue-900/20 hover:bg-blue-900/40",
    icon: Zap,
  },
};

const REASONS = [
  "你上次点过这个",
  "基于你喜欢的口味",
  "今天适合吃这个",
  "大家都说好吃",
  "尝尝新口味吧",
  "热量低，适合晚上吃",
  "周末犒劳一下自己"
];

export default function DailyRecommendation({ compact = false }: DailyRecommendationProps) {
  const { theme } = useTheme();
  const { addItem } = useCart();
  const router = useRouter();
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentTheme = themeStyles[theme] || themeStyles.couple;
  const Icon = currentTheme.icon;

  const generateRecommendations = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const res = await fetch('/api/dishes');
      const data = await res.json();
      const allDishes = data.data || [];
      
      const count = compact ? 3 : 6;
      const shuffled = [...allDishes].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, count);
      
      const newRecommendations = selected.map(dish => ({
        ...dish,
        reason: REASONS[Math.floor(Math.random() * REASONS.length)],
        isFavorite: Math.random() > 0.8 
      }));
      
      setRecommendations(newRecommendations);
    } catch (error) {
      console.error('Failed to fetch recommendations', error);
    } finally {
      setIsLoading(false);
    }
  }, [compact]);

  useEffect(() => {
    const timer = setTimeout(() => {
      generateRecommendations();
    }, 0);
    return () => clearTimeout(timer);
  }, [generateRecommendations]);

  const handleRefresh = () => {
    generateRecommendations();
  };

  const handleFavorite = (dishId: string) => {
    setRecommendations(prev => prev.map(item => 
      item.id === dishId ? { ...item, isFavorite: !item.isFavorite } : item
    ));
  };

  const handleAddToCart = (dish: Dish) => {
    addItem(dish);
  };
  
  const handleItemClick = (dish: Dish) => {
    router.push(`/menu/${dish.id}`);
  };

  const getTitle = () => {
    switch (theme) {
      case 'cute': return "🍱 今日推荐";
      case 'minimal': return "Today Recommend";
      case 'night': return "⚡ Today Recommend";
      default: return "❤️ 今日推荐";
    }
  };

  return (
    <div className={cn(
      "rounded-4xl p-5 shadow-sm border flex flex-col gap-4 overflow-hidden relative transition-colors duration-300",
      currentTheme.container
    )}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-lg">
          <Icon className={cn("w-5 h-5", currentTheme.header)} />
          <span className={currentTheme.header}>{getTitle()}</span>
        </div>
        
        <button 
          onClick={handleRefresh}
          className={cn("p-2 rounded-full transition-all", currentTheme.refreshButton)}
          disabled={isLoading}
          aria-label="Refresh recommendations"
        >
          <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 min-h-[200px]">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex items-center justify-center text-sm text-gray-400 py-10"
            >
              正在为你挑选美食...
            </motion.div>
          ) : (
            <motion.div 
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-3"
            >
              {recommendations.map((item, index) => (
                <FoodRecommendationItem 
                  key={`${item.id}-${index}`}
                  dish={item}
                  reason={item.reason}
                  isFavorite={item.isFavorite}
                  onAdd={handleAddToCart}
                  onFavorite={handleFavorite}
                  onItemClick={handleItemClick}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer / View All */}
      {compact && !isLoading && (
        <Link href="/recommendation" className="block mt-1">
          <div className={cn(
            "w-full py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-1 transition-colors",
            currentTheme.viewAll
          )}>
            查看全部推荐
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>
      )}
    </div>
  );
}
