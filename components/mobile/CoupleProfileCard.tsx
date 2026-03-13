"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Heart, 
  Sparkles, 
  Smile, 
  Zap, 
  Calendar,
  MessageCircle,
  User
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { ThemeName } from "@/types";
import Image from "next/image";

export interface CoupleProfile {
  userName: string;
  partnerName: string;
  avatarA?: string;
  avatarB?: string;
  loveStartDate: string;
  todayKiss: number;
  todayHug: number;
  todayInteraction: number;
  moodText: string;
  emotion: string;
}

interface CoupleProfileCardProps {
  profile?: CoupleProfile;
}

const defaultProfile: CoupleProfile = {
  userName: "宝贝",
  partnerName: "小笨蛋",
  loveStartDate: "2023-10-01",
  todayKiss: 3,
  todayHug: 2,
  todayInteraction: 5,
  moodText: "今天也要开心哦",
  emotion: "情侣模式"
};

const themeStyles: Record<ThemeName, {
  container: string;
  avatarRing: string;
  heartIcon: string;
  nameText: string;
  daysText: string;
  moodBadge: string;
  statBox: string;
  statLabel: string;
  statValue: string;
  icon: React.ElementType;
}> = {
  couple: {
    container: "bg-gradient-to-br from-pink-50 to-white border-pink-100 shadow-sm",
    avatarRing: "ring-pink-200",
    heartIcon: "text-pink-500 fill-pink-500",
    nameText: "text-pink-900",
    daysText: "text-pink-500",
    moodBadge: "bg-pink-100 text-pink-600",
    statBox: "bg-pink-50/50 border-pink-100",
    statLabel: "text-pink-400",
    statValue: "text-pink-600",
    icon: Heart,
  },
  cute: {
    container: "bg-orange-50 border-orange-100 shadow-[4px_4px_0px_0px_rgba(251,146,60,0.2)]",
    avatarRing: "ring-orange-200",
    heartIcon: "text-orange-500 fill-orange-500",
    nameText: "text-orange-900",
    daysText: "text-orange-500",
    moodBadge: "bg-orange-100 text-orange-600 border border-orange-200",
    statBox: "bg-white border-orange-200 shadow-sm",
    statLabel: "text-orange-400",
    statValue: "text-orange-600",
    icon: Sparkles,
  },
  minimal: {
    container: "bg-white border-gray-200",
    avatarRing: "ring-gray-200",
    heartIcon: "text-gray-900",
    nameText: "text-gray-900",
    daysText: "text-gray-500",
    moodBadge: "bg-gray-50 text-gray-900 border border-gray-200",
    statBox: "bg-gray-50 border-gray-100",
    statLabel: "text-gray-500",
    statValue: "text-gray-900",
    icon: Smile,
  },
  night: {
    container: "bg-slate-900 border-slate-800 shadow-[0_0_20px_rgba(139,92,246,0.15)]",
    avatarRing: "ring-violet-500/50",
    heartIcon: "text-violet-500 fill-violet-500",
    nameText: "text-violet-100",
    daysText: "text-violet-400",
    moodBadge: "bg-violet-500/10 text-violet-300 border border-violet-500/30",
    statBox: "bg-slate-800 border-slate-700 shadow-inner",
    statLabel: "text-slate-400",
    statValue: "text-violet-400",
    icon: Zap,
  },
};

const calculateDays = (startDate: string) => {
  const start = new Date(startDate);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  return diffDays;
};

export default function CoupleProfileCard({ profile = defaultProfile }: CoupleProfileCardProps) {
  const { theme } = useTheme();
  const currentTheme = themeStyles[theme] || themeStyles.couple;
  const days = calculateDays(profile.loveStartDate);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-[24px] p-5 flex flex-col gap-6 overflow-hidden relative transition-colors duration-300 border",
        currentTheme.container
      )}
    >
      {/* Top Section: Avatars & Names */}
      <div className="flex flex-col items-center gap-4">
        {/* Double Avatar */}
        <div className="flex items-center justify-center relative h-16 w-32">
          <motion.div 
            whileHover={{ scale: 1.05, zIndex: 10 }}
            className={cn(
              "w-16 h-16 rounded-full overflow-hidden border-2 bg-gray-100 absolute left-0 ring-4 transition-all",
              currentTheme.avatarRing
            )}
          >
            {profile.avatarA ? (
              <Image src={profile.avatarA} alt="User" fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl">👦</div>
            )}
          </motion.div>
          
          <div className={cn("z-10 relative -mt-1", currentTheme.heartIcon)}>
            <Heart className="w-6 h-6 animate-pulse" />
          </div>

          <motion.div 
            whileHover={{ scale: 1.05, zIndex: 10 }}
            className={cn(
              "w-16 h-16 rounded-full overflow-hidden border-2 bg-gray-100 absolute right-0 ring-4 transition-all",
              currentTheme.avatarRing
            )}
          >
            {profile.avatarB ? (
              <Image src={profile.avatarB} alt="Partner" fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl">👧</div>
            )}
          </motion.div>
        </div>

        {/* Info */}
        <div className="text-center flex flex-col gap-1">
          <h2 className={cn("text-lg font-bold", currentTheme.nameText)}>
            {profile.userName} & {profile.partnerName}
          </h2>
          <div className={cn("text-sm font-medium flex items-center justify-center gap-1.5", currentTheme.daysText)}>
            <Calendar className="w-3.5 h-3.5" />
            <span>在一起 {days} 天</span>
          </div>
        </div>

        {/* Mood & Emotion */}
        <div className="flex flex-col items-center gap-2">
           <span className={cn(
             "px-3 py-1 rounded-full text-xs font-medium",
             currentTheme.moodBadge
           )}>
             {profile.emotion}
           </span>
           <p className={cn("text-sm opacity-80", currentTheme.nameText)}>
             &quot;{profile.moodText}&quot;
           </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-3 gap-3">
        <div className={cn("rounded-xl p-3 flex flex-col items-center gap-1 border", currentTheme.statBox)}>
          <span className={cn("text-xs font-medium", currentTheme.statLabel)}>今日亲亲</span>
          <span className={cn("text-lg font-bold", currentTheme.statValue)}>
            ❤️ {profile.todayKiss}
          </span>
        </div>
        <div className={cn("rounded-xl p-3 flex flex-col items-center gap-1 border", currentTheme.statBox)}>
          <span className={cn("text-xs font-medium", currentTheme.statLabel)}>今日抱抱</span>
          <span className={cn("text-lg font-bold", currentTheme.statValue)}>
            🤗 {profile.todayHug}
          </span>
        </div>
        <div className={cn("rounded-xl p-3 flex flex-col items-center gap-1 border", currentTheme.statBox)}>
          <span className={cn("text-xs font-medium", currentTheme.statLabel)}>今日互动</span>
          <span className={cn("text-lg font-bold", currentTheme.statValue)}>
            ✨ {profile.todayInteraction}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
