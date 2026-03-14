"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { ThemeName, FoodRequest } from "@/types";
import { X, Image as ImageIcon, Loader2 } from "lucide-react";

interface CreateFoodRequestProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<FoodRequest, "id" | "status" | "createdAt">) => void;
}

const themeStyles: Record<ThemeName, {
  overlay: string;
  sheet: string;
  title: string;
  input: string;
  label: string;
  submitBtn: string;
}> = {
  couple: {
    overlay: "bg-black/40",
    sheet: "bg-white",
    title: "text-pink-900",
    input: "bg-pink-50/50 border-pink-100 focus:border-pink-300 focus:ring-pink-100 text-pink-900 placeholder:text-pink-300",
    label: "text-pink-700",
    submitBtn: "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-pink-200",
  },
  cute: {
    overlay: "bg-black/50",
    sheet: "bg-[#fff5fb]",
    title: "text-orange-900",
    input: "bg-white border-2 border-orange-100 focus:border-orange-300 focus:ring-orange-100 text-orange-900 placeholder:text-orange-300 rounded-xl",
    label: "text-orange-800",
    submitBtn: "bg-orange-400 text-white shadow-orange-200 border-b-4 border-orange-600 active:border-b-0 active:translate-y-1",
  },
  minimal: {
    overlay: "bg-black/60",
    sheet: "bg-white",
    title: "text-gray-900",
    input: "bg-white border-gray-200 focus:border-black focus:ring-gray-100 text-gray-900 placeholder:text-gray-400 rounded-lg",
    label: "text-gray-700",
    submitBtn: "bg-black text-white hover:bg-gray-800 rounded-lg",
  },
  night: {
    overlay: "bg-black/80",
    sheet: "bg-slate-900 border-t border-slate-800",
    title: "text-white",
    input: "bg-slate-800 border-slate-700 focus:border-purple-500 focus:ring-purple-900 text-white placeholder:text-slate-500 rounded-xl",
    label: "text-slate-300",
    submitBtn: "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-purple-900/50 rounded-xl",
  },
};

export default function CreateFoodRequest({ isOpen, onClose, onSubmit }: CreateFoodRequestProps) {
  const { theme } = useTheme();
  const styles = themeStyles[theme];
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    onSubmit({
      name,
      description,
      image: "", // Image upload simplified for now
    });
    
    setName("");
    setDescription("");
    setIsSubmitting(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className={cn("fixed inset-0 z-[100]", styles.overlay)}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={cn(
              "fixed bottom-0 left-0 right-0 z-[101] rounded-t-3xl p-6 pb-safe max-w-[480px] mx-auto h-[80vh] overflow-y-auto",
              styles.sheet
            )}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className={cn("text-xl font-bold", styles.title)}>提议新食物</h3>
              <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="space-y-2">
                <label className={cn("font-medium text-sm", styles.label)}>食物名称</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="例如：韩式炸鸡"
                  className={cn("w-full px-4 py-3 outline-none focus:ring-2 transition-all rounded-xl", styles.input)}
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <label className={cn("font-medium text-sm", styles.label)}>想吃理由 / 描述</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="说说为什么想吃这个..."
                  rows={4}
                  className={cn("w-full px-4 py-3 outline-none focus:ring-2 transition-all rounded-xl resize-none", styles.input)}
                />
              </div>

              {/* Simplified Image Upload Placeholder */}
              <div className="space-y-2">
                <label className={cn("font-medium text-sm", styles.label)}>参考图片 (可选)</label>
                <div className={cn("w-full h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors opacity-60 hover:opacity-100", styles.input)}>
                    <ImageIcon className="w-8 h-8" />
                    <span className="text-xs">点击上传图片</span>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={!name.trim() || isSubmitting}
                className={cn(
                  "w-full py-4 font-bold text-lg flex items-center justify-center gap-2 transition-all rounded-full mt-4 disabled:opacity-50 disabled:scale-100",
                  styles.submitBtn
                )}
              >
                {isSubmitting ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        提交中...
                    </>
                ) : (
                    "提交提议"
                )}
              </motion.button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
