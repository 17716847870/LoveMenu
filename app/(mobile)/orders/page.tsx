"use client";

import { motion } from "framer-motion";
import MemoryOrderCard from "@/components/mobile/MemoryOrderCard";
import { Order } from "@/components/mobile/OrderItemCard";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { ThemeName } from "@/types";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const orders: Order[] = [
  {
    id: "5",
    dishes: ["韩式炸鸡", "啤酒"],
    kissPrice: 3,
    hugPrice: 2,
    status: "completed",
    createdAt: "2024-03-13 22:00",
    memoryNote: "来自星星的炸鸡啤酒 🍗🍺"
  },
  {
    id: "1",
    dishes: ["可乐鸡翅", "炒饭"],
    kissPrice: 2,
    hugPrice: 1,
    status: "completed",
    createdAt: "2024-03-12 18:30",
    memoryNote: "一起追剧的时候吃的，鸡翅有点焦但是很香"
  },
  {
    id: "2",
    dishes: ["豚骨拉面"],
    kissPrice: 1,
    hugPrice: 0,
    status: "completed",
    createdAt: "2024-03-11 19:00",
    memoryNote: "下雨天的晚饭，暖暖的"
  },
  {
    id: "3",
    dishes: ["草莓松饼"],
    kissPrice: 2,
    hugPrice: 0,
    status: "completed",
    createdAt: "2024-03-10 14:20",
    memoryNote: "第一次做甜点，卖相不错！"
  },
  {
    id: "4",
    dishes: ["火锅"],
    kissPrice: 5,
    hugPrice: 5,
    status: "completed",
    createdAt: "2024-03-08 20:00",
    memoryNote: "纪念日大餐 🎉"
  }
];

// Group orders by date label (Today, Yesterday, Date)
const groupOrders = (orders: Order[]) => {
  const groups: Record<string, Order[]> = {};
  
  orders.forEach(order => {
    const date = new Date(order.createdAt);
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
  header: string;
  subHeader: string;
  timelineLabel: string;
}> = {
  couple: {
    header: "text-pink-900",
    subHeader: "text-pink-400",
    timelineLabel: "text-pink-500 bg-pink-50 border-pink-100",
  },
  cute: {
    header: "text-orange-900",
    subHeader: "text-orange-400",
    timelineLabel: "text-orange-500 bg-orange-50 border-orange-100",
  },
  minimal: {
    header: "text-gray-900",
    subHeader: "text-gray-500",
    timelineLabel: "text-gray-900 bg-gray-50 border-gray-200",
  },
  night: {
    header: "text-blue-100",
    subHeader: "text-slate-400",
    timelineLabel: "text-blue-400 bg-slate-800 border-slate-700",
  },
};

export default function OrdersPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const currentTheme = themeStyles[theme] || themeStyles.couple;
  const groupedOrders = groupOrders(orders);

  return (
    <div className="min-h-screen bg-background pb-20 p-4">
      {/* Page Header */}
      <div className="flex items-center gap-3 py-4 mb-6">
        <button 
          onClick={() => router.back()}
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className={cn("w-6 h-6", currentTheme.header)} />
        </button>
        <div>
          <h1 className={cn("text-xl font-bold", currentTheme.header)}>
            回忆相册
          </h1>
          <p className={cn("text-xs", currentTheme.subHeader)}>
            记录我们的一日三餐 ❤️
          </p>
        </div>
      </div>

      {/* Timeline */}
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
    </div>
  );
}
