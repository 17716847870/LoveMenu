"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  Search, 
  History,
  Sparkles,
  Zap,
  Clock,
  Heart
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { ThemeName } from "@/types";
import MemoryOrderCard from "@/components/mobile/MemoryOrderCard";
import { Order } from "@/components/mobile/OrderItemCard";

// 使用相同的 mock 数据，但添加 memory 属性
const mockOrders: (Order & { memory?: { text: string; image?: string | string[] } })[] = [
  {
    id: "5",
    dishes: ["韩式炸鸡", "啤酒"],
    kissPrice: 3,
    hugPrice: 2,
    status: "completed",
    createdAt: "2024-03-13 22:00",
    reason: "夜宵",
    isEmergency: true,
    memory: {
      text: "今晚看球配炸鸡啤酒太爽啦！宝贝选的这家真不错，炸鸡外酥里嫩的😋",
      image: [
        "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1575037614876-c385cb80ca8c?w=500&auto=format&fit=crop&q=60"
      ]
    }
  },
  {
    id: "1",
    dishes: ["可乐鸡翅", "炒饭"],
    kissPrice: 2,
    hugPrice: 1,
    status: "completed",
    createdAt: "2024-03-12 18:30",
    reason: "今天宝贝想吃",
    memory: {
      text: "宝贝亲手做的可乐鸡翅，甜度刚刚好！把骨头都嘬干净了嘿嘿～"
    }
  },
  {
    id: "2",
    dishes: ["豚骨拉面"],
    kissPrice: 1,
    hugPrice: 0,
    status: "completed",
    createdAt: "2024-03-11 19:00",
    reason: "随便吃点"
  },
  {
    id: "3",
    dishes: ["草莓松饼", "奶茶"],
    kissPrice: 2,
    hugPrice: 1,
    status: "completed",
    createdAt: "2024-03-10 14:20",
    reason: "今天想吃点甜的",
    memory: {
      text: "下午茶时间！松饼软软糯糯的，和宝贝一起吃更甜了🍰",
      image: "https://images.unsplash.com/photo-1579306194872-64d3b7bac4c2?w=500&auto=format&fit=crop&q=60"
    }
  }
];

// Group orders by date label (Today, Yesterday, Date)
const groupOrders = (orders: any[]) => {
  const groups: Record<string, any[]> = {};
  
  orders.forEach(order => {
    const date = new Date(order.createdAt.replace(/-/g, '/')); // Handle Safari date parsing
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    let label = order.createdAt.split(' ')[0];
    
    if (date.toDateString() === today.toDateString()) {
      label = "今天";
    } else if (date.toDateString() === yesterday.toDateString()) {
      label = "昨天";
    }
    
    if (!groups[label]) groups[label] = [];
    groups[label].push(order);
  });
  
  return groups;
};

const themeStyles: Record<ThemeName, {
  bg: string;
  headerBg: string;
  text: string;
  subText: string;
  icon: React.ElementType;
  iconColor: string;
  backBtn: string;
  searchBg: string;
  timelineLabel: string;
}> = {
  couple: {
    bg: "bg-pink-50/30",
    headerBg: "bg-white/80 border-pink-100",
    text: "text-gray-900",
    subText: "text-gray-500",
    icon: History,
    iconColor: "text-pink-500",
    backBtn: "bg-pink-50 text-pink-600 hover:bg-pink-100",
    searchBg: "bg-pink-50/50 focus-within:bg-pink-50",
    timelineLabel: "text-pink-500 bg-pink-50 border-pink-100",
  },
  cute: {
    bg: "bg-orange-50/30",
    headerBg: "bg-[#fff4fb]/90 border-orange-100",
    text: "text-orange-900",
    subText: "text-orange-600/60",
    icon: Sparkles,
    iconColor: "text-orange-500",
    backBtn: "bg-orange-100 text-orange-600 hover:bg-orange-200",
    searchBg: "bg-orange-50 focus-within:bg-white border-2 border-transparent focus-within:border-orange-200",
    timelineLabel: "text-orange-500 bg-orange-50 border-orange-100",
  },
  minimal: {
    bg: "bg-gray-50",
    headerBg: "bg-white/90 border-gray-200",
    text: "text-gray-900",
    subText: "text-gray-500",
    icon: Clock,
    iconColor: "text-gray-900",
    backBtn: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    searchBg: "bg-gray-100 focus-within:bg-white border border-transparent focus-within:border-gray-300",
    timelineLabel: "text-gray-900 bg-gray-50 border-gray-200",
  },
  night: {
    bg: "bg-slate-950",
    headerBg: "bg-slate-900/90 border-slate-800",
    text: "text-slate-100",
    subText: "text-slate-400",
    icon: Zap,
    iconColor: "text-blue-400",
    backBtn: "bg-slate-800 text-slate-300 hover:bg-slate-700",
    searchBg: "bg-slate-800/50 focus-within:bg-slate-800 border border-transparent focus-within:border-slate-700",
    timelineLabel: "text-blue-400 bg-slate-800 border-slate-700",
  },
};

export default function MemoriesPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  
  const currentTheme = themeStyles[theme] || themeStyles.couple;

  const filteredOrders = mockOrders.filter(order => {
    if (!searchQuery) return true;
    return (
      order.dishes.some(d => d.includes(searchQuery)) ||
      order.reason?.includes(searchQuery) ||
      order.memory?.text.includes(searchQuery)
    );
  });

  const groupedOrders = groupOrders(filteredOrders);

  return (
    <div className={cn("min-h-screen pb-safe", currentTheme.bg)}>
      {/* Header */}
      <header className={cn(
        "sticky top-0 z-40 backdrop-blur-md border-b",
        currentTheme.headerBg
      )}>
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => router.back()}
            className={cn("w-10 h-10 rounded-full flex items-center justify-center transition-colors", currentTheme.backBtn)}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2">
            <Heart className={cn("w-5 h-5", currentTheme.iconColor)} />
            <h1 className={cn("text-lg font-bold", currentTheme.text)}>回忆相册</h1>
          </div>
          
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-4">
          <div className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all",
            currentTheme.searchBg
          )}>
            <Search className={cn("w-4 h-4", currentTheme.subText)} />
            <input
              type="text"
              placeholder="搜索吃过的美食、回忆..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "flex-1 bg-transparent border-none outline-none text-sm placeholder:opacity-50",
                currentTheme.text
              )}
            />
          </div>
        </div>
      </header>

      {/* Timeline List */}
      <div className="p-4 flex flex-col gap-4">
        <AnimatePresence mode="popLayout">
          {filteredOrders.length > 0 ? (
            <div className="flex flex-col gap-8 pl-2">
              {Object.entries(groupedOrders).map(([label, groupOrders], groupIndex) => (
                <motion.div 
                  key={label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: groupIndex * 0.1 }}
                >
                  {/* Date Label */}
                  <div className={cn(
                    "inline-block px-3 py-1 rounded-full text-sm font-bold mb-6 border",
                    currentTheme.timelineLabel
                  )}>
                    {label}
                  </div>

                  {/* Orders */}
                  <div className="border-l-2 border-transparent ml-2 pl-4 flex flex-col gap-0 relative">
                    {groupOrders.map((order, index) => (
                      <MemoryOrderCard 
                        key={order.id} 
                        order={order} 
                        index={index} 
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="py-20 flex flex-col items-center justify-center gap-3"
            >
              <div className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center opacity-50",
                currentTheme.searchBg
              )}>
                <Search className={cn("w-8 h-8", currentTheme.subText)} />
              </div>
              <p className={currentTheme.subText}>没有找到相关回忆哦</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
