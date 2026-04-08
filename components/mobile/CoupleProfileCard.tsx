"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { 
  Heart, 
  Sparkles, 
  Smile, 
  Zap, 
  Calendar,
  Camera,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@/context/UserContext";
import { useUsers } from "@/apis/user";
import { cn } from "@/lib/utils";
import { ThemeName } from "@/types";
import Image from "next/image";
import { getRandomMood } from "@/lib/moods";

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
  moodText: "今天也要开心哦"
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
  uploadOverlay: string;
  roleBadge: string;
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
    uploadOverlay: "bg-pink-500/70",
    roleBadge: "bg-pink-100 text-pink-600",
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
    uploadOverlay: "bg-orange-500/70",
    roleBadge: "bg-orange-100 text-orange-600 border border-orange-200",
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
    uploadOverlay: "bg-black/50",
    roleBadge: "bg-gray-100 text-gray-600 border border-gray-200",
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
    uploadOverlay: "bg-violet-500/60",
    roleBadge: "bg-violet-500/10 text-violet-300 border border-violet-500/30",
  },
};

const getMoodText = (isCoupleView: boolean): string => {
  return getRandomMood(isCoupleView);
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
  const { user, setUser } = useUser();
  const { data: users = [], isLoading: usersLoading } = useUsers();
  const currentTheme = themeStyles[theme] || themeStyles.couple;
  
  const [loveStartDate, setLoveStartDate] = useState<string>(profile.loveStartDate);
  const days = calculateDays(loveStartDate);

  // 页面加载时从 API 获取配置的在一起日期
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch("/api/config");
        if (res.ok) {
          const data = await res.json();
          if (data.data?.loveStartDate) {
            setLoveStartDate(data.data.loveStartDate);
          }
        }
      } catch (error) {
        console.error("Failed to fetch config:", error);
      }
    };
    fetchConfig();
  }, []);

  // 从 localStorage 读取模式，默认情侣模式
  const [isCoupleView, setIsCoupleView] = useState<boolean>(true);
  const [modeReady, setModeReady] = useState(false);
  const [moodText, setMoodText] = useState<string>("");

  useEffect(() => {
    const saved = localStorage.getItem("lovemenu-profile-mode");
    if (saved !== null) {
      setIsCoupleView(saved === "couple");
    }
    setModeReady(true);
  }, []);

  // 每次模式改变或页面加载时生成新的心情文案
  useEffect(() => {
    setMoodText(getMoodText(isCoupleView));
  }, [isCoupleView, modeReady]);

  const emotion = useMemo(() => {
    if(isCoupleView){
      return '情侣模式'
    }
    else return '普通模式'
  }, [isCoupleView])

  const toggleMode = () => {
    const next = !isCoupleView;
    setIsCoupleView(next);
    localStorage.setItem("lovemenu-profile-mode", next ? "couple" : "solo");
  };

  // 找到另一个用户作为伴侣（系统只有两个用户）
  const partner = users.find((u) => u.id !== user?.id);

  const partnerName = partner?.name || profile.partnerName;
  const partnerAvatar = partner?.avatar || profile.avatarB;

  // 实际展示模式：模式已就绪 且 users加载完成 且 用户选择情侣模式 且 存在伴侣数据
  const isReady = modeReady && !usersLoading;
  const showCoupleMode = isReady && isCoupleView && !!partner;

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [localAvatar, setLocalAvatar] = useState<string | null>(null);

  const displayAvatar = localAvatar || user?.avatar || profile.avatarA;

  const handleAvatarClick = () => {
    avatarInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // 本地预览
    const localUrl = URL.createObjectURL(file);
    setLocalAvatar(localUrl);
    setIsUploading(true);

    try {
      // 上传图片
      const fd = new FormData();
      fd.append("file", file);
      fd.append("path", "avatars");
      const uploadRes = await fetch("/api/upload", { method: "POST", body: fd });
      const uploadJson = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadJson.message || "上传失败");
      const avatarUrl: string = uploadJson.data?.url || uploadJson.data;
      if (!avatarUrl || typeof avatarUrl !== "string") throw new Error("获取上传地址失败");

      // 统一转为 https
      const secureUrl = avatarUrl.replace(/^http:\/\//, "https://");

      // 更新用户头像
      const updateRes = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar: secureUrl }),
      });
      const updateJson = await updateRes.json();
      if (!updateRes.ok) throw new Error(updateJson.message || "更新失败");

      // 同步 context
      setUser({ ...user, avatar: secureUrl });
      setLocalAvatar(secureUrl);
    } catch (err) {
      console.error("头像上传失败", err);
      setLocalAvatar(null);
    } finally {
      setIsUploading(false);
      // 清空 input，允许重复选同一文件
      if (avatarInputRef.current) avatarInputRef.current.value = "";
    }
  };

  // ── 未就绪时显示骨架屏 ──────────────────────────────
  if (!isReady) {
    return (
      <div className={cn(
        "rounded-[24px] p-5 flex flex-col gap-6 overflow-hidden border animate-pulse",
        currentTheme.container
      )}>
        {/* 头像骨架 */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center justify-center relative h-16 w-32">
            <div className="w-16 h-16 rounded-full bg-gray-200 absolute left-0" />
            <div className="w-16 h-16 rounded-full bg-gray-200 absolute right-0" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="h-5 w-36 bg-gray-200 rounded-full" />
            <div className="h-4 w-24 bg-gray-200 rounded-full" />
          </div>
          <div className="h-6 w-20 bg-gray-200 rounded-full" />
        </div>
        {/* stats 骨架 */}
        <div className="grid grid-cols-3 gap-3">
          {[0,1,2].map((i) => (
            <div key={i} className="rounded-xl p-3 flex flex-col items-center gap-2 border border-gray-100">
              <div className="h-3 w-12 bg-gray-200 rounded-full" />
              <div className="h-5 w-10 bg-gray-200 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── 单人模式 ──────────────────────────────────────────
  if (!showCoupleMode) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "rounded-[24px] p-5 flex flex-col gap-6 overflow-hidden relative transition-colors duration-300 border",
          currentTheme.container
        )}
      >
        <div className="flex flex-col items-center gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className={cn(
              "w-20 h-20 rounded-full overflow-hidden border-2 bg-gray-100 ring-4 cursor-pointer group relative",
              currentTheme.avatarRing
            )}
            onClick={handleAvatarClick}
          >
            {displayAvatar ? (
              <Image src={displayAvatar} alt="User" fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl">👤</div>
            )}
            <div className={cn(
              "absolute inset-0 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity",
              currentTheme.uploadOverlay
            )}>
              {isUploading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Camera className="w-5 h-5 text-white" />
              )}
            </div>
          </motion.div>

          <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />

          <div className="text-center flex flex-col items-center gap-2">
            <h2 className={cn("text-lg font-bold", currentTheme.nameText)}>
              {user?.name || profile.userName}
            </h2>
            <span 
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium",
                currentTheme.moodBadge
              )}
              onClick={toggleMode}
            >
              {emotion} . 切换情侣
            </span>
          </div>

          <p className={cn("text-sm opacity-70", currentTheme.nameText)}>
            &quot;{moodText}&quot;
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className={cn("rounded-xl p-3 flex flex-col items-center gap-1 border", currentTheme.statBox)}>
            <span className={cn("text-xs font-medium", currentTheme.statLabel)}>亲亲余额</span>
            <span className={cn("text-lg font-bold", currentTheme.statValue)}>❤️ {user?.kissBalance ?? 0}</span>
          </div>
          <div className={cn("rounded-xl p-3 flex flex-col items-center gap-1 border", currentTheme.statBox)}>
            <span className={cn("text-xs font-medium", currentTheme.statLabel)}>贴贴余额</span>
            <span className={cn("text-lg font-bold", currentTheme.statValue)}>🤗 {user?.hugBalance ?? 0}</span>
          </div>
          <div className={cn("rounded-xl p-3 flex flex-col items-center gap-1 border", currentTheme.statBox)}>
            <span className={cn("text-xs font-medium", currentTheme.statLabel)}>今日互动</span>
            <span className={cn("text-lg font-bold", currentTheme.statValue)}>✨ {profile.todayInteraction}</span>
          </div>
        </div>
      </motion.div>
    );
  }

  // ── 情侣模式 ──────────────────────────────────────────
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
          {/* 我的头像（可点击上传） */}
          <motion.div 
            whileHover={{ scale: 1.05, zIndex: 10 }}
            className={cn(
              "w-16 h-16 rounded-full overflow-hidden border-2 bg-gray-100 absolute left-0 ring-4 transition-all cursor-pointer group",
              currentTheme.avatarRing
            )}
            onClick={handleAvatarClick}
          >
            {displayAvatar ? (
              <Image src={displayAvatar} alt="User" fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl">👦</div>
            )}
            {/* 上传遮罩 */}
            <div className={cn(
              "absolute inset-0 flex flex-col items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity",
              currentTheme.uploadOverlay
            )}>
              {isUploading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Camera className="w-5 h-5 text-white" />
              )}
            </div>
          </motion.div>

          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
          
          <div className={cn("z-10 relative -mt-1", currentTheme.heartIcon)}>
            <Heart className="w-6 h-6 animate-pulse" />
          </div>

          {/* 伴侣头像（展示用） */}
          <motion.div 
            whileHover={{ scale: 1.05, zIndex: 10 }}
            className={cn(
              "w-16 h-16 rounded-full overflow-hidden border-2 bg-gray-100 absolute right-0 ring-4 transition-all",
              currentTheme.avatarRing
            )}
          >
            {partnerAvatar ? (
              <Image src={partnerAvatar} alt="Partner" fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl">👧</div>
            )}
          </motion.div>
        </div>

        {/* Info */}
        <div className="text-center flex flex-col gap-1">
          <h2 className={cn("text-lg font-bold", currentTheme.nameText)}>
            {user?.name || profile.userName} & {partnerName}
          </h2>
          <div className={cn("text-sm font-medium flex items-center justify-center gap-1.5", currentTheme.daysText)}>
            <Calendar className="w-3.5 h-3.5" />
            <span>在一起 {days} 天</span>
          </div>
        </div>

        {/* Mood & Emotion */}
        <div className="flex flex-col items-center gap-2">
           <button
             onClick={toggleMode}
             className={cn(
               "px-3 py-1 rounded-full text-xs font-medium transition-opacity hover:opacity-70 active:scale-95",
               currentTheme.moodBadge
             )}
           >
             {emotion} · 切换单人
           </button>
           <p className={cn("text-sm opacity-80", currentTheme.nameText)}>
             &quot;{moodText}&quot;
           </p>
        </div>
      </div>
    </motion.div>
  );
}
