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
  Heart,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { ThemeName } from "@/types";
import MemoryOrderCard from "@/components/mobile/MemoryOrderCard";
import { useOrders } from "@/apis/orders";
import { formatDateTime } from "@/utils/format";

interface MemoryOrder {
  id: string;
  dishes: string[];
  kissPrice: number;
  hugPrice: number;
  status: string;
  createdAt: string;
  reason?: string;
  isEmergency: boolean;
  memory?: {
    text: string;
    image?: string | string[];
  };
}

const groupOrders = (orders: MemoryOrder[]) => {
  const groups: Record<string, MemoryOrder[]> = {};

  orders.forEach((order) => {
    const date = new Date(order.createdAt.replace(/-/g, "/"));
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let label = formatDateTime(order.createdAt, "yyyy-MM-dd");

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

const themeStyles: Record<
  ThemeName,
  {
    bg: string;
    headerBg: string;
    text: string;
    subText: string;
    icon: React.ElementType;
    iconColor: string;
    backBtn: string;
    searchBg: string;
    timelineLabel: string;
  }
> = {
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
    searchBg:
      "bg-orange-50 focus-within:bg-white border-2 border-transparent focus-within:border-orange-200",
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
    searchBg:
      "bg-gray-100 focus-within:bg-white border border-transparent focus-within:border-gray-300",
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
    searchBg:
      "bg-slate-800/50 focus-within:bg-slate-800 border border-transparent focus-within:border-slate-700",
    timelineLabel: "text-blue-400 bg-slate-800 border-slate-700",
  },
};

export default function MemoriesPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  const currentTheme = themeStyles[theme] || themeStyles.couple;
  const { data: ordersResponse, isLoading } = useOrders({
    status: "completed",
  });

  const orders: MemoryOrder[] = (ordersResponse || [])
    .filter((order) => order.memory && order.memory.text)
    .map((order) => ({
      id: order.id,
      dishes: order.items.map((item) => item.dish?.name || "").filter(Boolean),
      kissPrice: order.totalKiss,
      hugPrice: order.totalHug,
      status: order.status,
      createdAt: order.createdAt,
      reason: order.reason,
      isEmergency: order.isEmergency,
      memory: order.memory,
    }));

  const filteredOrders = orders.filter((order) => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      order.dishes.some((d) => d.toLowerCase().includes(searchLower)) ||
      order.reason?.toLowerCase().includes(searchLower) ||
      order.memory?.text.toLowerCase().includes(searchLower)
    );
  });

  const groupedOrders = groupOrders(filteredOrders);

  return (
    <div className={cn("min-h-screen pb-safe", currentTheme.bg)}>
      <header
        className={cn(
          "sticky top-0 z-40 backdrop-blur-md border-b",
          currentTheme.headerBg
        )}
      >
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => router.back()}
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
              currentTheme.backBtn
            )}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <Heart className={cn("w-5 h-5", currentTheme.iconColor)} />
            <h1 className={cn("text-lg font-bold", currentTheme.text)}>
              回忆相册
            </h1>
          </div>

          <div className="w-10" />
        </div>

        <div className="px-4 pb-4">
          <div
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all",
              currentTheme.searchBg
            )}
          >
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

      <div className="p-4 flex flex-col gap-4">
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <div
                className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
                style={{
                  borderColor: "currentColor",
                  borderTopColor: "transparent",
                }}
              />
              <p className={currentTheme.subText}>加载中...</p>
            </div>
          ) : filteredOrders.length > 0 ? (
            <div className="flex flex-col gap-8 pl-2">
              {Object.entries(groupedOrders).map(
                ([label, groupOrders], groupIndex) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: groupIndex * 0.1 }}
                  >
                    <div
                      className={cn(
                        "inline-block px-3 py-1 rounded-full text-sm font-bold mb-6 border",
                        currentTheme.timelineLabel
                      )}
                    >
                      {label}
                    </div>

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
                )
              )}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="py-20 flex flex-col items-center justify-center gap-3"
            >
              <div
                className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center opacity-50",
                  currentTheme.searchBg
                )}
              >
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
