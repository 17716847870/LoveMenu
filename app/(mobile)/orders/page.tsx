"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  Search, 
  Receipt,
  Sparkles,
  Zap,
  Clock,
  Camera,
  X,
  Image as ImageIcon
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { ThemeName } from "@/types";
import OrderItemCard, { Order } from "@/components/mobile/OrderItemCard";

const initialOrders: Order[] = [
  {
    id: "6",
    dishes: ["小炒肉", "米饭"],
    kissPrice: 2,
    hugPrice: 1,
    status: "preparing",
    createdAt: "2024-03-14 12:00",
    reason: "午饭"
  },
  {
    id: "5",
    dishes: ["韩式炸鸡", "啤酒"],
    kissPrice: 3,
    hugPrice: 2,
    status: "completed",
    createdAt: "2024-03-13 22:00",
    reason: "夜宵",
    isEmergency: true,
    hasMemory: true
  },
  {
    id: "1",
    dishes: ["可乐鸡翅", "炒饭"],
    kissPrice: 2,
    hugPrice: 1,
    status: "completed",
    createdAt: "2024-03-12 18:30",
    reason: "今天宝贝想吃",
    hasMemory: true
  },
  {
    id: "2",
    dishes: ["豚骨拉面"],
    kissPrice: 1,
    hugPrice: 0,
    status: "completed",
    createdAt: "2024-03-11 19:00",
    reason: "随便吃点",
    hasMemory: false
  }
];

const themeStyles: Record<ThemeName, {
  bg: string;
  headerBg: string;
  text: string;
  subText: string;
  icon: React.ElementType;
  iconColor: string;
  backBtn: string;
  searchBg: string;
  modalBg: string;
  primaryBtn: string;
  textareaBg: string;
}> = {
  couple: {
    bg: "bg-pink-50/30",
    headerBg: "bg-white/80 border-pink-100",
    text: "text-gray-900",
    subText: "text-gray-500",
    icon: Receipt,
    iconColor: "text-pink-500",
    backBtn: "bg-pink-50 text-pink-600 hover:bg-pink-100",
    searchBg: "bg-pink-50/50 focus-within:bg-pink-50",
    modalBg: "bg-white border-pink-100",
    primaryBtn: "bg-pink-500 text-white hover:bg-pink-600 shadow-pink-200",
    textareaBg: "bg-pink-50/30 border-pink-100 focus:border-pink-300",
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
    modalBg: "bg-[#fff4fb] border-orange-200",
    primaryBtn: "bg-orange-400 text-white hover:bg-orange-500 shadow-orange-200",
    textareaBg: "bg-white border-orange-200 focus:border-orange-400",
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
    modalBg: "bg-white border-gray-200",
    primaryBtn: "bg-gray-900 text-white hover:bg-gray-800 shadow-gray-200",
    textareaBg: "bg-gray-50 border-gray-200 focus:border-gray-400",
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
    modalBg: "bg-slate-900 border-slate-700",
    primaryBtn: "bg-blue-600 text-white hover:bg-blue-500 shadow-blue-900/20",
    textareaBg: "bg-slate-800 border-slate-700 focus:border-blue-500 text-white",
  },
};

export default function OrdersPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStatus, setActiveStatus] = useState("all");
  const [orders, setOrders] = useState(initialOrders);
  
  // 记录回忆弹窗状态
  const [recordingOrderId, setRecordingOrderId] = useState<string | null>(null);
  const [memoryText, setMemoryText] = useState("");
  const [memoryImage, setMemoryImage] = useState("");
  
  const currentTheme = themeStyles[theme] || themeStyles.couple;
  const Icon = currentTheme.icon;

  const filteredOrders = orders.filter(order => {
    // 状态过滤
    if (activeStatus !== "all" && order.status !== activeStatus) return false;
    
    // 搜索过滤
    if (!searchQuery) return true;
    return (
      order.dishes.some(d => d.includes(searchQuery)) ||
      order.reason?.includes(searchQuery)
    );
  });

  const handleRecordMemory = (orderId: string) => {
    setRecordingOrderId(orderId);
    setMemoryText("");
    setMemoryImage("");
  };

  const handleSubmitMemory = () => {
    if (!memoryText.trim() && !memoryImage) return;
    
    // 更新订单状态为已记录
    setOrders(prev => prev.map(o => 
      o.id === recordingOrderId ? { ...o, hasMemory: true } : o
    ));
    
    // 实际项目中这里需要调用 API 保存回忆数据，然后可以在回忆相册中读取
    console.log("Saved memory for order", recordingOrderId, { text: memoryText, image: memoryImage });
    
    setRecordingOrderId(null);
    // 可选：显示成功提示或跳转到回忆相册
    // alert("记录成功！已保存到回忆相册~");
  };

  return (
    <div className={cn("h-screen overflow-auto", currentTheme.bg)}>
      {/* Header */}
      <header className={cn(
        "sticky top-0 z-40 backdrop-blur-md border-b pt-5",
        currentTheme.headerBg
      )}>
        {/* Search Bar & Filters */}
        <div className="px-4 pb-4 flex flex-col gap-3">
          <div className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all",
            currentTheme.searchBg
          )}>
            <Search className={cn("w-4 h-4", currentTheme.subText)} />
            <input
              type="text"
              placeholder="搜索订单菜品..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "flex-1 bg-transparent border-none outline-none text-sm placeholder:opacity-50",
                currentTheme.text
              )}
            />
          </div>

          {/* Status Tabs */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {[
              { id: 'all', label: '全部' },
              { id: 'preparing', label: '制作中' },
              { id: 'completed', label: '已完成' },
            ].map(status => (
              <button
                key={status.id}
                onClick={() => setActiveStatus(status.id)}
                className={cn(
                  "whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors border",
                  activeStatus === status.id
                    ? theme === 'night' 
                      ? "bg-blue-600 text-white border-blue-500" 
                      : theme === 'cute'
                        ? "bg-orange-400 text-white border-orange-400 shadow-sm"
                        : theme === 'minimal'
                          ? "bg-gray-900 text-white border-gray-900"
                          : "bg-pink-500 text-white border-pink-500 shadow-sm"
                    : theme === 'night'
                      ? "bg-slate-800 text-slate-400 border-slate-700"
                      : "bg-white text-gray-500 border-gray-200"
                )}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Order List */}
      <div className="p-4 flex flex-col gap-4">
        <AnimatePresence mode="popLayout">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order, index) => (
              <OrderItemCard 
                key={order.id} 
                order={order} 
                index={index}
                onRecordMemory={handleRecordMemory}
              />
            ))
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
              <p className={currentTheme.subText}>没有找到相关订单哦</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Record Memory Modal */}
      <AnimatePresence>
        {recordingOrderId && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRecordingOrderId(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.95 }}
              className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:top-1/2 md:bottom-auto md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-md w-full"
            >
              <div className={cn(
                "rounded-3xl p-5 md:p-6 shadow-2xl border flex flex-col gap-4",
                currentTheme.modalBg
              )}>
                <div className="flex justify-between items-center">
                  <h3 className={cn("font-bold text-lg", currentTheme.text)}>记录这顿美味回忆 ✨</h3>
                  <button 
                    onClick={() => setRecordingOrderId(null)}
                    className={cn("p-2 rounded-full", currentTheme.searchBg)}
                  >
                    <X className={cn("w-5 h-5", currentTheme.text)} />
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  <textarea
                    value={memoryText}
                    onChange={(e) => setMemoryText(e.target.value)}
                    placeholder="写下吃这顿饭时的心情或趣事吧..."
                    rows={4}
                    className={cn(
                      "w-full rounded-2xl p-4 outline-none border transition-colors resize-none text-sm",
                      currentTheme.textareaBg
                    )}
                  />
                  
                  <div className="flex items-center gap-2">
                    <button className={cn(
                      "flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium border border-dashed transition-colors flex-1 justify-center",
                      theme === 'night' 
                        ? "border-slate-700 text-slate-400 hover:bg-slate-800" 
                        : "border-gray-300 text-gray-500 hover:bg-gray-50"
                    )}>
                      <Camera className="w-4 h-4" /> 拍张照片
                    </button>
                    <button className={cn(
                      "flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium border border-dashed transition-colors flex-1 justify-center",
                      theme === 'night' 
                        ? "border-slate-700 text-slate-400 hover:bg-slate-800" 
                        : "border-gray-300 text-gray-500 hover:bg-gray-50"
                    )}>
                      <ImageIcon className="w-4 h-4" /> 从相册选
                    </button>
                  </div>
                </div>

                <button 
                  onClick={handleSubmitMemory}
                  disabled={!memoryText.trim() && !memoryImage}
                  className={cn(
                    "w-full py-3.5 rounded-2xl font-bold mt-2 shadow-lg transition-all",
                    currentTheme.primaryBtn,
                    (!memoryText.trim() && !memoryImage) && "opacity-50 cursor-not-allowed"
                  )}
                >
                  保存到回忆相册
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}