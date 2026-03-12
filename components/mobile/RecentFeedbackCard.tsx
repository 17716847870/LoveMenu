"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  MessageSquare, 
  Heart, 
  Sparkles, 
  Zap, 
  Quote
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { ThemeName } from "@/types";
import Image from "next/image";

interface Feedback {
  dishName: string;
  content: string;
  image?: string;
}

interface RecentFeedbackCardProps {
  data?: Feedback;
}

const defaultData: Feedback = {
  dishName: "豚骨拉面",
  content: "很好吃！！",
  // image: "/feedback/1.jpg" // Uncomment when real image is available
};

const themeStyles: Record<ThemeName, {
  container: string;
  header: string;
  dish: string;
  content: string;
  quote: string;
  icon: React.ElementType;
}> = {
  couple: {
    container: "bg-blue-50 border-blue-100 shadow-sm",
    header: "text-blue-600",
    dish: "text-blue-700 font-bold",
    content: "text-blue-600 bg-white/60 p-3 rounded-xl border border-blue-100",
    quote: "text-blue-300",
    icon: Heart,
  },
  cute: {
    container: "bg-green-50 border-green-100 shadow-[4px_4px_0px_0px_rgba(34,197,94,0.2)]",
    header: "text-green-600",
    dish: "text-green-700 font-bold",
    content: "text-green-600 bg-white p-3 rounded-xl border-2 border-green-200 shadow-sm",
    quote: "text-green-300",
    icon: Sparkles,
  },
  minimal: {
    container: "bg-white border-gray-200",
    header: "text-gray-900",
    dish: "text-gray-900 font-bold",
    content: "text-gray-600 italic bg-gray-50 p-3 border-l-2 border-gray-300",
    quote: "text-gray-300",
    icon: MessageSquare,
  },
  night: {
    container: "bg-slate-900 border-slate-800 shadow-[0_0_15px_rgba(34,197,94,0.15)]",
    header: "text-green-400",
    dish: "text-green-300 font-bold",
    content: "text-green-400 bg-slate-800/50 p-3 rounded-xl border border-green-500/30",
    quote: "text-green-500/30",
    icon: Zap,
  },
};

export default function RecentFeedbackCard({ data = defaultData }: RecentFeedbackCardProps) {
  const { theme } = useTheme();
  const currentTheme = themeStyles[theme] || themeStyles.couple;
  const Icon = currentTheme.icon;

  const getTitle = () => {
    switch (theme) {
      case 'cute': return "🍓 最近反馈";
      case 'minimal': return "Recent Feedback";
      case 'night': return "⚡ Feedback";
      default: return "❤️ 最近反馈";
    }
  };

  return (
    <div className={cn(
      "rounded-[2rem] p-6 shadow-sm border flex flex-col gap-4 overflow-hidden relative transition-colors duration-300",
      currentTheme.container
    )}>
      {/* Header */}
      <div className="flex items-center gap-2 font-bold text-lg">
        <Icon className={cn("w-5 h-5", currentTheme.header)} />
        <span className={currentTheme.header}>{getTitle()}</span>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3">
        <div className={cn("text-lg", currentTheme.dish)}>
          {data.dishName}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <Quote className={cn("absolute -top-2 -left-1 w-4 h-4 rotate-180", currentTheme.quote)} />
          <div className={cn("text-sm leading-relaxed pl-4", currentTheme.content)}>
            {data.content}
          </div>
        </motion.div>

        {data.image && (
          <div className="relative w-full h-32 rounded-xl overflow-hidden mt-2">
            <Image 
              src={data.image} 
              alt="Feedback" 
              fill
              className="object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
}
