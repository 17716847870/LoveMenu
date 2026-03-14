"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  ChevronRight,
  History,
  Sparkles,
  Zap,
  Clock
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { ThemeName } from "@/types";
import Link from "next/link";
import OrderItemCard, { Order } from "./OrderItemCard";

interface OrderPreviewCardProps {
  orders?: Order[];
}

const defaultOrders: Order[] = [
  {
    id: "5",
    dishes: ["韩式炸鸡", "啤酒"],
    kissPrice: 3,
    hugPrice: 2,
    status: "completed",
    createdAt: "2024-03-13 22:00",
    reason: "夜宵"
  },
  {
    id: "1",
    dishes: ["可乐鸡翅", "炒饭"],
    kissPrice: 2,
    hugPrice: 1,
    status: "completed",
    createdAt: "2024-03-12 18:30",
    reason: "今天宝贝想吃"
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
    reason: "今天想吃点甜的"
  }
];

const themeStyles: Record<ThemeName, {
  container: string;
  header: string;
  viewAll: string;
  icon: React.ElementType;
}> = {
  couple: {
    container: "bg-white border-pink-100 shadow-sm",
    header: "text-pink-600",
    viewAll: "text-pink-400 hover:text-pink-600",
    icon: History,
  },
  cute: {
    container: "bg-white border-orange-200 shadow-[4px_4px_0px_0px_rgba(251,146,60,0.2)]",
    header: "text-orange-500",
    viewAll: "text-orange-400 hover:text-orange-600",
    icon: Sparkles,
  },
  minimal: {
    container: "bg-white border-gray-200",
    header: "text-gray-900",
    viewAll: "text-gray-500 hover:text-gray-900",
    icon: Clock,
  },
  night: {
    container: "bg-slate-900 border-slate-800 shadow-[0_0_15px_rgba(96,165,250,0.15)]",
    header: "text-blue-400",
    viewAll: "text-blue-500 hover:text-blue-300",
    icon: Zap,
  },
};

export default function OrderPreviewCard({ orders = defaultOrders }: OrderPreviewCardProps) {
  const { theme } = useTheme();
  const currentTheme = themeStyles[theme] || themeStyles.couple;
  const Icon = currentTheme.icon;

  return (
    <div className={cn(
      "rounded-[24px] p-5 flex flex-col gap-4 overflow-hidden relative transition-colors duration-300 border",
      currentTheme.container
    )}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-lg">
          <Icon className={cn("w-5 h-5", currentTheme.header)} />
          <span className={currentTheme.header}>历史订单</span>
        </div>
        
        <Link 
          href="/orders" 
          className={cn(
            "text-xs font-medium flex items-center gap-1 transition-colors",
            currentTheme.viewAll
          )}
        >
          查看全部
          <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Order List */}
      <div className="flex flex-col gap-3">
        {orders.length > 0 ? (
          orders.slice(0, 3).map((order, index) => (
            <OrderItemCard 
              key={order.id} 
              order={order} 
              index={index}
            />
          ))
        ) : (
          <div className={cn("text-center py-8 text-sm opacity-60", currentTheme.header)}>
            还没有订单记录哦 ~
          </div>
        )}
      </div>
    </div>
  );
}
