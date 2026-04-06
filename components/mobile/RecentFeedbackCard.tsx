"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  MessageSquare, 
  Heart, 
  Sparkles, 
  Zap, 
  ChevronRight
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { ThemeName } from "@/types";
import { useFeedbacks } from "@/apis/feedback";

const themeStyles: Record<ThemeName, {
  container: string;
  header: string;
  item: string;
  viewAll: string;
  icon: React.ElementType;
}> = {
  couple: {
    container: "bg-white border-pink-100 shadow-sm hover:shadow-md",
    header: "text-pink-900",
    item: "bg-pink-50 text-pink-700",
    viewAll: "text-pink-400 hover:text-pink-600",
    icon: Heart,
  },
  cute: {
    container: "bg-white border-2 border-orange-100 shadow-[4px_4px_0px_0px_rgba(255,237,213,1)]",
    header: "text-orange-900",
    item: "bg-orange-50 text-orange-700 border border-orange-100",
    viewAll: "text-orange-400 hover:text-orange-600",
    icon: Sparkles,
  },
  minimal: {
    container: "bg-white border border-gray-200",
    header: "text-gray-900",
    item: "bg-gray-50 text-gray-700 border border-gray-100",
    viewAll: "text-gray-400 hover:text-gray-600",
    icon: MessageSquare,
  },
  night: {
    container: "bg-slate-800 border-slate-700 shadow-lg",
    header: "text-white",
    item: "bg-slate-700/50 text-slate-300 border border-slate-600",
    viewAll: "text-slate-500 hover:text-slate-300",
    icon: Zap,
  },
};

export default function RecentFeedbackCard() {
  const { theme } = useTheme();
  const { data: feedbacksData = [] } = useFeedbacks();
  const currentTheme = themeStyles[theme] || themeStyles.couple;
  const Icon = currentTheme.icon;

  const feedbacks = useMemo(() => {
    return feedbacksData
      .slice(0, 3)
      .map((feedback) => ({
        id: feedback.id,
        title: feedback.title,
      }));
  }, [feedbacksData]);

  const getTitle = () => {
    switch (theme) {
      case 'cute': return "🍓 最近反馈";
      case 'minimal': return "Recent Feedback";
      case 'night': return "⚡ Feedback";
      default: return "❤️ 宝贝的反馈";
    }
  };

  return (
    <div className={cn(
      "rounded-[2rem] p-6 flex flex-col gap-4 overflow-hidden relative transition-all duration-300",
      currentTheme.container
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-lg">
          <Icon className={cn("w-5 h-5", currentTheme.header)} />
          <span className={currentTheme.header}>{getTitle()}</span>
        </div>
        <Link 
          href="/feedback" 
          className={cn(
            "text-xs font-medium flex items-center gap-1 transition-colors",
            currentTheme.viewAll
          )}
        >
          查看全部
          <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        {feedbacks.length > 0 ? (
          feedbacks.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn(
                "p-3 text-sm font-medium transition-all flex items-center justify-between rounded-xl",
                currentTheme.item
              )}
            >
              <span>{item.title}</span>
            </motion.div>
          ))
        ) : (
          <div className={cn("text-center py-8 text-sm opacity-60", currentTheme.header)}>
            还没有反馈哦 ~
          </div>
        )}
      </div>
      
      <Link href="/feedback" className="mt-1">
        <motion.div
            whileTap={{ scale: 0.98 }}
            className={cn(
              "p-3 text-sm font-medium transition-all flex items-center justify-center gap-2 cursor-pointer rounded-xl opacity-80 hover:opacity-100",
              theme === 'couple' ? "bg-pink-100 text-pink-600" : "",
              theme === 'cute' ? "bg-orange-100 text-orange-600" : "",
              theme === 'minimal' ? "bg-gray-100 text-gray-900" : "",
              theme === 'night' ? "bg-purple-900/30 text-purple-300 border border-purple-500/30" : ""
            )}
        >
            <span>＋ 提交反馈</span>
        </motion.div>
      </Link>
    </div>
  );
}
