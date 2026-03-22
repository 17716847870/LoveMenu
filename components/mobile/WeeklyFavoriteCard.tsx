"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Trophy, 
  Flame, 
  Star, 
  ChevronRight, 
  TrendingUp, 
  Award
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { ThemeName } from "@/types";
import Link from "next/link";
import { useDishes } from "@/apis/dishes";

export interface FavoriteDish {
  dishName: string;
  count: number;
  dishId?: string;
}

interface WeeklyFavoriteCardProps {
  list?: FavoriteDish[];
}

const themeStyles: Record<ThemeName, {
  container: string;
  header: string;
  viewAll: string;
  rankItem: string;
  rankItemBorder: string;
  rankBadge: (rank: number) => string;
  countText: string;
  icon: React.ElementType;
}> = {
  couple: {
    container: "bg-pink-50 border-pink-100 shadow-sm",
    header: "text-pink-600",
    viewAll: "text-pink-400 hover:text-pink-600",
    rankItem: "bg-white/60 hover:bg-white/80 border-pink-200",
    rankItemBorder: "border",
    rankBadge: (rank) => rank === 1 ? "bg-pink-500 text-white" : rank === 2 ? "bg-pink-400 text-white" : "bg-pink-300 text-white",
    countText: "text-pink-500",
    icon: Trophy,
  },
  cute: {
    container: "bg-yellow-50 border-yellow-100 shadow-[4px_4px_0px_0px_rgba(250,204,21,0.2)]",
    header: "text-yellow-600",
    viewAll: "text-yellow-500 hover:text-yellow-700",
    rankItem: "bg-white border-yellow-200 shadow-sm",
    rankItemBorder: "border-2 rounded-xl",
    rankBadge: (rank) => rank === 1 ? "bg-yellow-400 text-white" : rank === 2 ? "bg-yellow-300 text-white" : "bg-yellow-200 text-white",
    countText: "text-yellow-600",
    icon: Flame,
  },
  minimal: {
    container: "bg-white border-gray-200",
    header: "text-gray-900",
    viewAll: "text-gray-500 hover:text-gray-900",
    rankItem: "bg-transparent border-gray-100",
    rankItemBorder: "border-b last:border-0 rounded-none",
    rankBadge: () => "text-gray-900 font-mono",
    countText: "text-gray-500 font-mono",
    icon: TrendingUp,
  },
  night: {
    container: "bg-slate-900 border-slate-800 shadow-[0_0_15px_rgba(168,85,247,0.15)]",
    header: "text-purple-400",
    viewAll: "text-purple-500 hover:text-purple-300",
    rankItem: "bg-slate-800/50 border-purple-500/30 hover:border-purple-400/50 shadow-[0_0_10px_rgba(168,85,247,0.1)]",
    rankItemBorder: "border",
    rankBadge: (rank) => "text-purple-400 font-bold border border-purple-500/50 rounded-lg px-2 bg-purple-500/10",
    countText: "text-purple-300",
    icon: Award,
  },
};

const RankItem = ({ item, index, theme, styles }: { item: FavoriteDish; index: number; theme: ThemeName; styles: typeof themeStyles.couple }) => {
  const rank = index + 1;
  
  const getRankIcon = () => {
    if (theme === 'couple') return rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉';
    if (theme === 'cute') return rank === 1 ? '👑' : rank === 2 ? '🐰' : '🐻';
    if (theme === 'minimal') return rank;
    if (theme === 'night') return `#${rank}`;
    return rank;
  };

  const getCountDisplay = () => {
    if (theme === 'couple') return `${item.count}次 ❤️`;
    if (theme === 'cute') return Array(Math.min(item.count, 5)).fill('⭐').join('');
    if (theme === 'night') return `${item.count}x`;
    return `${item.count}次`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: rank === 1 ? 1.05 : 1.02 }}
      className={cn(
        "flex items-center justify-between p-3 transition-all",
        styles.rankItem,
        styles.rankItemBorder,
        theme !== 'minimal' && "rounded-xl"
      )}
    >
      <div className="flex items-center gap-3">
        <div className={cn(
          "w-8 h-8 flex items-center justify-center font-bold text-lg",
          theme !== 'minimal' && theme !== 'night' && "rounded-full shadow-sm",
          theme !== 'night' && styles.rankBadge(rank)
        )}>
          {getRankIcon()}
        </div>
        <span className={cn(
          "font-medium",
          rank === 1 && "text-lg font-bold"
        )}>
          {item.dishName}
        </span>
      </div>
      
      <div className={cn("text-sm font-medium", styles.countText)}>
        {getCountDisplay()}
      </div>
    </motion.div>
  );
};

export default function WeeklyFavoriteCard({ list: propList }: WeeklyFavoriteCardProps) {
  const { theme } = useTheme();
  const { data: dishes = [] } = useDishes();
  const currentTheme = themeStyles[theme] || themeStyles.couple;
  const Icon = currentTheme.icon;

  const favoriteList = useMemo(() => {
    if (propList?.length) {
      return propList;
    }
    
    return dishes
      .filter(d => d.popularity && d.popularity > 0)
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, 5)
      .map(dish => ({
        dishName: dish.name,
        count: dish.popularity || 0,
        dishId: dish.id,
      }));
  }, [dishes, propList]);

  const getTitle = () => {
    switch (theme) {
      case 'cute': return "🍭 本周人气菜";
      case 'minimal': return "Weekly Favorite";
      case 'night': return "⚡ Weekly Top";
      default: return "❤️ 本周最爱";
    }
  };

  return (
    <div className={cn(
      "rounded-[2rem] p-6 shadow-sm border flex flex-col gap-4 overflow-hidden relative transition-colors duration-300",
      currentTheme.container
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-lg">
          <Icon className={cn("w-5 h-5", currentTheme.header)} />
          <span className={currentTheme.header}>{getTitle()}</span>
        </div>
        
        <Link 
          href="/stats" 
          className={cn(
            "text-xs font-medium flex items-center gap-1 transition-colors",
            currentTheme.viewAll
          )}
        >
          查看全部
          <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      <div className={cn(
        "flex flex-col",
        theme === 'minimal' ? "gap-0" : "gap-3"
      )}>
        {favoriteList.length > 0 ? (
          favoriteList.map((item, index) => (
            <RankItem 
              key={item.dishId || item.dishName} 
              item={item} 
              index={index} 
              theme={theme} 
              styles={currentTheme} 
            />
          ))
        ) : (
          <div className={cn("text-center py-8 text-sm opacity-60", currentTheme.header)}>
            本周还没有数据哦 ~
          </div>
        )}
      </div>
    </div>
  );
}
