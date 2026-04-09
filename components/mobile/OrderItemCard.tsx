"use client";

import React from "react";
import { motion } from "framer-motion";
import { Heart, Smile, Clock, CheckCircle2, Sparkles, Zap } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { ThemeName } from "@/types";
import { formatDateTime } from "@/utils/format";

export interface Order {
  id: string;
  dishes: string[];
  kissPrice: number;
  hugPrice: number;
  status: string;
  createdAt: string;
  memoryNote?: string;
  reason?: string;
  isEmergency?: boolean;
  hasMemory?: boolean; // 是否已记录回忆
  memory?: {
    text: string;
    image?: string | string[];
  };
}

interface OrderItemCardProps {
  order: Order;
  index?: number;
  onRecordMemory?: (orderId: string) => void;
}

const themeStyles: Record<
  ThemeName,
  {
    container: string;
    icon: React.ElementType;
    timeText: string;
    priceText: string;
    statusBadge: string;
  }
> = {
  couple: {
    container: "bg-white border-pink-100 hover:border-pink-200 shadow-sm",
    icon: Heart,
    timeText: "text-pink-400",
    priceText: "text-pink-600",
    statusBadge: "bg-pink-100 text-pink-600",
  },
  cute: {
    container:
      "bg-white border-orange-200 shadow-[4px_4px_0px_0px_rgba(251,146,60,0.2)]",
    icon: Sparkles,
    timeText: "text-orange-400",
    priceText: "text-orange-600",
    statusBadge: "bg-orange-100 text-orange-600 border border-orange-200",
  },
  minimal: {
    container: "bg-white border-gray-200",
    icon: CheckCircle2,
    timeText: "text-gray-400",
    priceText: "text-gray-900",
    statusBadge: "bg-gray-100 text-gray-900",
  },
  night: {
    container: "bg-slate-800 border-slate-700 shadow-lg",
    icon: Zap,
    timeText: "text-slate-400",
    priceText: "text-blue-400",
    statusBadge: "bg-blue-500/10 text-blue-400 border border-blue-500/30",
  },
};

export default function OrderItemCard({
  order,
  index = 0,
  onRecordMemory,
}: OrderItemCardProps) {
  const { theme } = useTheme();
  const currentTheme = themeStyles[theme] || themeStyles.couple;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        "p-4 rounded-xl border flex flex-col gap-2 transition-all",
        currentTheme.container
      )}
    >
      <div className="flex justify-between items-start">
        <div className="font-medium line-clamp-1 flex-1 flex items-center gap-2">
          {order.dishes.join(" + ")}
          {order.isEmergency && (
            <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full border border-red-200 font-bold">
              ⚡ 紧急订单
            </span>
          )}
        </div>
        <div
          className={cn(
            "text-xs px-2 py-0.5 rounded-full font-medium ml-2",
            currentTheme.statusBadge
          )}
        >
          {order.status === "pending"
            ? "待接单"
            : order.status === "preparing"
              ? "制作中"
              : order.status === "completed"
                ? "已完成"
                : order.status === "cancelled"
                  ? "已取消"
                  : "进行中"}
        </div>
      </div>

      {order.reason && (
        <div className="text-xs opacity-70 mt-1">
          <span className="mr-1">原因:</span>
          {order.reason}
        </div>
      )}

      <div className="flex items-center justify-between text-sm mt-1">
        <div
          className={cn(
            "flex items-center gap-1 text-xs",
            currentTheme.timeText
          )}
        >
          <Clock className="w-3 h-3" />
          {formatDateTime(order.createdAt)}
        </div>

        <div className="flex items-center gap-3">
          {order.status === "completed" &&
            onRecordMemory &&
            !order.hasMemory && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRecordMemory(order.id);
                }}
                className={cn(
                  "text-[10px] px-2 py-1 rounded-full font-medium transition-colors border",
                  theme === "night"
                    ? "bg-slate-700/50 text-blue-300 border-slate-600 hover:bg-slate-700"
                    : theme === "minimal"
                      ? "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
                      : theme === "cute"
                        ? "bg-orange-50 text-orange-500 border-orange-100 hover:bg-orange-100"
                        : "bg-pink-50 text-pink-500 border-pink-100 hover:bg-pink-100"
                )}
              >
                ✍️ 记录回忆
              </button>
            )}
          {order.hasMemory && (
            <span
              className={cn(
                "text-[10px] flex items-center gap-1",
                theme === "night" ? "text-slate-400" : "text-gray-400"
              )}
            >
              <Heart className="w-3 h-3 fill-current" /> 已记录
            </span>
          )}
          <div
            className={cn(
              "flex items-center gap-2 font-medium",
              currentTheme.priceText
            )}
          >
            {order.kissPrice > 0 && (
              <span className="flex items-center gap-0.5">
                <Heart className="w-3 h-3" /> {order.kissPrice}
              </span>
            )}
            {order.hugPrice > 0 && (
              <span className="flex items-center gap-0.5">
                <Smile className="w-3 h-3" /> {order.hugPrice}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
