"use client";

import React, { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  Search, 
  Receipt,
  Sparkles,
  Zap,
  Clock,
  X,
  Image as ImageIcon,
  Loader2,
  Trash2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { ThemeName } from "@/types";
import { useOrders, Order as ApiOrder } from "@/apis/orders";
import OrderItemCard from "@/components/mobile/OrderItemCard";

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
  uploadZone: string;
  uploadText: string;
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
    uploadZone: "border-pink-200 bg-pink-50/30",
    uploadText: "text-pink-400",
  },
  cute: {
    bg: "bg-orange-50/30",
    headerBg: "bg-[#fffdf5] border-orange-100",
    text: "text-orange-900",
    subText: "text-orange-600/60",
    icon: Sparkles,
    iconColor: "text-orange-500",
    backBtn: "bg-orange-100 text-orange-600 hover:bg-orange-200",
    searchBg: "bg-orange-50 focus-within:bg-white border-2 border-transparent focus-within:border-orange-200",
    modalBg: "bg-[#fff4fb] border-orange-200",
    primaryBtn: "bg-orange-400 text-white hover:bg-orange-500 shadow-orange-200",
    textareaBg: "bg-white border-orange-200 focus:border-orange-400",
    uploadZone: "border-orange-200 bg-orange-50/30",
    uploadText: "text-orange-400",
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
    uploadZone: "border-gray-200 bg-gray-50",
    uploadText: "text-gray-400",
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
    uploadZone: "border-slate-700 bg-slate-800/50",
    uploadText: "text-slate-400",
  },
};

interface OrderForCard {
  id: string;
  dishes: string[];
  kissPrice: number;
  hugPrice: number;
  status: string;
  createdAt: string;
  reason?: string;
  isEmergency?: boolean;
  hasMemory?: boolean;
  memory?: {
    text: string;
    image?: string | string[];
  };
}

export default function OrdersPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentTheme = themeStyles[theme] || themeStyles.couple;
  const Icon = currentTheme.icon;

  const [searchQuery, setSearchQuery] = useState("");
  const [activeStatus, setActiveStatus] = useState("all");
  
  const [recordingOrderId, setRecordingOrderId] = useState<string | null>(null);
  const [memoryText, setMemoryText] = useState("");
  const [memoryImage, setMemoryImage] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: apiOrders = [], isLoading } = useOrders();
  const [localMemoryOrders, setLocalMemoryOrders] = useState<Set<string>>(new Set());

  const transformedOrders: OrderForCard[] = useMemo(() => {
    return apiOrders.map(order => ({
      id: order.id,
      dishes: order.items.map(item => item.dish?.name || '未知菜品'),
      kissPrice: order.totalKiss,
      hugPrice: order.totalHug,
      status: order.status,
      createdAt: order.createdAt,
      reason: order.reason,
      isEmergency: order.isEmergency,
      hasMemory: localMemoryOrders.has(order.id) || !!order.memory,
      memory: order.memory,
    }));
  }, [apiOrders, localMemoryOrders]);

  const filteredOrders = transformedOrders.filter(order => {
    if (activeStatus !== "all" && order.status !== activeStatus) return false;
    if (!searchQuery) return true;
    return (
      order.dishes.some(d => d.includes(searchQuery)) ||
      order.reason?.includes(searchQuery)
    );
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('path', 'order-memories');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (result.success && result.data?.url) {
        setMemoryImage(result.data.url);
      } else {
        alert(result.message || '图片上传失败');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('图片上传失败，请重试');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRecordMemory = (orderId: string) => {
    setRecordingOrderId(orderId);
    setMemoryText("");
    setMemoryImage("");
  };

  const handleSubmitMemory = async () => {
    if (!recordingOrderId || (!memoryText.trim() && !memoryImage)) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/orders/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: recordingOrderId,
          text: memoryText,
          image: memoryImage,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setLocalMemoryOrders(prev => new Set([...prev, recordingOrderId]));
        setRecordingOrderId(null);
      } else {
        alert(result.message || '保存回忆失败');
      }
    } catch (error) {
      console.error('Save memory error:', error);
      alert('保存回忆失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn("h-screen overflow-auto", currentTheme.bg)}>
      <header className={cn(
        "sticky top-0 z-40 backdrop-blur-md border-b pt-4",
        currentTheme.headerBg
      )}>
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

          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {[
              { id: 'all', label: '全部' },
              { id: 'pending', label: '待接单' },
              { id: 'preparing', label: '制作中' },
              { id: 'completed', label: '已完成' },
              { id: 'cancelled', label: '已取消' },
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

      <div className="p-4 flex flex-col gap-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
          </div>
        ) : (
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
        )}
      </div>

      <AnimatePresence>
        {recordingOrderId && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRecordingOrderId(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-100"
            />
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.95 }}
              className="fixed bottom-0 left-0 right-0 z-100 p-4 md:top-1/2 md:bottom-auto md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-md w-full"
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
                  
                  {memoryImage ? (
                    <div className="relative rounded-xl overflow-hidden">
                      <img 
                        src={memoryImage} 
                        alt="预览" 
                        className="w-full h-32 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setMemoryImage("")}
                        className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className={cn(
                        "w-full h-24 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors",
                        currentTheme.uploadZone,
                        isUploading && "opacity-50 cursor-wait"
                      )}
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="w-6 h-6 animate-spin" />
                          <span className={cn("text-xs", currentTheme.uploadText)}>上传中...</span>
                        </>
                      ) : (
                        <>
                          <ImageIcon className="w-6 h-6" />
                          <span className={cn("text-xs", currentTheme.uploadText)}>添加照片</span>
                        </>
                      )}
                    </div>
                  )}
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                <button 
                  onClick={handleSubmitMemory}
                  disabled={(!memoryText.trim() && !memoryImage) || isSubmitting}
                  className={cn(
                    "w-full py-3.5 rounded-2xl font-bold mt-2 shadow-lg transition-all flex items-center justify-center gap-2",
                    currentTheme.primaryBtn,
                    (!memoryText.trim() && !memoryImage) && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      保存中...
                    </>
                  ) : (
                    "保存到回忆相册"
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
