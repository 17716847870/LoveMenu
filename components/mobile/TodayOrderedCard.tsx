"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Sparkles,
  Dice5,
  Zap,
  ChevronRight,
  Utensils,
  Home,
  Clock,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { ThemeName } from "@/types";
import Link from "next/link";
import { useOrders } from "@/apis/orders";

interface DisplayOrder {
  id: string;
  dishName: string;
  time: string;
  type: "home" | "restaurant";
  quantity?: number;
}

interface TodayOrderedCardProps {
  orders?: DisplayOrder[];
}

const themeStyles: Record<
  ThemeName,
  {
    container: string;
    header: string;
    viewAll: string;
    card: string;
    cardBorder: string;
    icon: React.ElementType;
    orderIcon: string;
    timeText: string;
    typeText: string;
  }
> = {
  couple: {
    container: "bg-pink-50 border-pink-100 shadow-sm",
    header: "text-pink-600",
    viewAll: "text-pink-400 hover:text-pink-600",
    card: "bg-white/60 hover:bg-white/80 border-pink-200",
    cardBorder: "border",
    icon: Heart,
    orderIcon: "text-pink-500",
    timeText: "text-pink-400",
    typeText: "text-pink-500",
  },
  cute: {
    container:
      "bg-orange-50 border-orange-100 shadow-[4px_4px_0px_0px_rgba(251,146,60,0.2)]",
    header: "text-orange-500",
    viewAll: "text-orange-400 hover:text-orange-600",
    card: "bg-white border-orange-200 shadow-sm",
    cardBorder: "border-2",
    icon: Sparkles,
    orderIcon: "text-orange-500",
    timeText: "text-orange-400",
    typeText: "text-orange-500",
  },
  minimal: {
    container: "bg-white border-gray-200",
    header: "text-gray-900",
    viewAll: "text-gray-500 hover:text-gray-900",
    card: "bg-gray-50 border-gray-200",
    cardBorder: "border",
    icon: Dice5,
    orderIcon: "text-gray-700",
    timeText: "text-gray-500",
    typeText: "text-gray-700",
  },
  night: {
    container:
      "bg-slate-900 border-slate-800 shadow-[0_0_15px_rgba(59,130,246,0.15)]",
    header: "text-blue-400",
    viewAll: "text-blue-500 hover:text-blue-300",
    card: "bg-slate-800/50 border-blue-500/30 hover:border-blue-400/50 shadow-[0_0_10px_rgba(59,130,246,0.1)]",
    cardBorder: "border",
    icon: Zap,
    orderIcon: "text-blue-400",
    timeText: "text-blue-300",
    typeText: "text-blue-400",
  },
};

function getTimeOfDay(date: Date): string {
  const hour = date.getHours();
  if (hour < 11) return "早餐";
  if (hour < 14) return "午餐";
  if (hour < 18) return "下午茶";
  if (hour < 21) return "晚餐";
  return "夜宵";
}

function transformOrders(
  orders: ReturnType<typeof useOrders>["data"]
): DisplayOrder[] {
  if (!orders) return [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return orders
    .filter((order) => {
      const orderDate = new Date(order.createdAt);
      orderDate.setHours(0, 0, 0, 0);
      return orderDate.getTime() === today.getTime();
    })
    .slice(0, 5)
    .flatMap((order) => {
      const orderType: "home" | "restaurant" = order.reason?.includes("外面")
        ? "restaurant"
        : "home";
      const orderTime = getTimeOfDay(new Date(order.createdAt));

      return order.items.map((item, index) => ({
        id: `${order.id}-${item.id}`,
        dishName: item.dish?.name || `菜品${index + 1}`,
        time: orderTime,
        type: orderType,
        quantity: item.quantity,
      }));
    });
}

const OrderItem = ({
  order,
  theme,
  styles,
}: {
  order: DisplayOrder;
  theme: ThemeName;
  styles: typeof themeStyles.couple;
}) => {
  const isHome = order.type === "home";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, x: 2 }}
      className={cn(
        "flex flex-col gap-2 p-3 rounded-xl transition-all",
        styles.card,
        styles.cardBorder
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{theme === "cute" ? "🍗" : "🍽️"}</span>
          <span className={cn("font-bold text-base", styles.header)}>
            {order.dishName}
            {order.quantity && order.quantity > 1 && (
              <span className="text-sm ml-1 opacity-70">x{order.quantity}</span>
            )}
          </span>
        </div>
        <div
          className={cn(
            "text-xs font-medium px-2 py-1 rounded-full bg-white/50 flex items-center gap-1",
            styles.timeText
          )}
        >
          <Clock className="w-3 h-3" />
          {order.time}
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs opacity-80 pl-7">
        <span className={cn("flex items-center gap-1", styles.typeText)}>
          {isHome ? (
            <Home className="w-3 h-3" />
          ) : (
            <Utensils className="w-3 h-3" />
          )}
          {isHome ? "在家做" : "外面吃"}
        </span>
      </div>
    </motion.div>
  );
};

export default function TodayOrderedCard({
  orders: propOrders,
}: TodayOrderedCardProps) {
  const { theme } = useTheme();
  const { data: apiOrders } = useOrders();
  const currentTheme = themeStyles[theme] || themeStyles.couple;
  const Icon = currentTheme.icon;

  const transformedOrders = transformOrders(apiOrders);
  const orders = propOrders?.length ? propOrders : transformedOrders;

  const getTitle = () => {
    switch (theme) {
      case "cute":
        return "🍭 今日吃了啥";
      case "minimal":
        return "Today Ordered";
      case "night":
        return "⚡ 今日订单";
      default:
        return "❤️ 今日已点";
    }
  };

  return (
    <div
      className={cn(
        "rounded-4xl p-6 shadow-sm border flex flex-col gap-4 overflow-hidden relative transition-colors duration-300",
        currentTheme.container
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-lg">
          <Icon className={cn("w-5 h-5", currentTheme.header)} />
          <span className={currentTheme.header}>{getTitle()}</span>
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

      <div className="flex flex-col gap-3">
        {orders.length > 0 ? (
          orders.map((order) => (
            <OrderItem
              key={order.id}
              order={order}
              theme={theme}
              styles={currentTheme}
            />
          ))
        ) : (
          <div
            className={cn(
              "text-center py-8 text-sm opacity-60",
              currentTheme.header
            )}
          >
            今天还没有点餐哦 ~
          </div>
        )}
      </div>
    </div>
  );
}
