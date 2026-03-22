"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { ThemeName } from "@/types";
import { X } from "lucide-react";

interface OrderReasonSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isLoading?: boolean;
}

const reasons = [
  "宝贝想吃",
  "我想吃",
  "纪念日",
  "夜宵",
  "看电影",
  "随便吃点",
];

const themeStyles: Record<ThemeName, {
  overlay: string;
  sheet: string;
  title: string;
  btn: string;
  btnActive: string;
  input: string;
  confirmBtn: string;
}> = {
  couple: {
    overlay: "bg-black/40",
    sheet: "bg-gradient-to-b from-pink-50 to-white",
    title: "text-pink-900",
    btn: "bg-white border border-pink-200 text-pink-600 shadow-sm rounded-full",
    btnActive: "bg-pink-500 text-white border-pink-500 shadow-pink-200",
    input: "bg-white border-pink-200 focus:border-pink-500 focus:ring-pink-200 text-pink-900 placeholder:text-pink-300",
    confirmBtn: "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-pink-200",
  },
  cute: {
    overlay: "bg-black/50",
    sheet: "bg-[#fff5fb]",
    title: "text-orange-900",
    btn: "bg-white border-2 border-orange-100 text-orange-600 rounded-2xl shadow-[2px_2px_0px_0px_rgba(255,237,213,1)]",
    btnActive: "bg-orange-400 text-white border-orange-400 shadow-[2px_2px_0px_0px_rgba(251,146,60,0.5)]",
    input: "bg-white border-2 border-orange-200 focus:border-orange-400 focus:ring-orange-100 text-orange-900 rounded-xl",
    confirmBtn: "bg-orange-400 text-white shadow-orange-200 border-b-4 border-orange-600 active:border-b-0 active:translate-y-1",
  },
  minimal: {
    overlay: "bg-black/60",
    sheet: "bg-white",
    title: "text-gray-900",
    btn: "bg-white border border-gray-200 text-gray-600 rounded-lg",
    btnActive: "bg-black text-white border-black",
    input: "bg-white border-gray-300 focus:border-black focus:ring-gray-200 text-gray-900 rounded-lg",
    confirmBtn: "bg-black text-white hover:bg-gray-800 rounded-lg",
  },
  night: {
    overlay: "bg-black/80",
    sheet: "bg-slate-900 border-t border-slate-800",
    title: "text-white",
    btn: "bg-slate-800 border border-slate-700 text-slate-300 rounded-xl",
    btnActive: "bg-purple-600 text-white border-purple-500 shadow-[0_0_15px_rgba(147,51,234,0.3)]",
    input: "bg-slate-800 border-slate-700 focus:border-purple-500 focus:ring-purple-500/20 text-white rounded-xl placeholder:text-slate-500",
    confirmBtn: "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-purple-900/50 rounded-xl",
  },
};

export default function OrderReasonSelector({ isOpen, onClose, onConfirm, isLoading }: OrderReasonSelectorProps) {
  const { theme } = useTheme();
  const styles = themeStyles[theme];
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  const handleConfirm = () => {
    if (isLoading) return;
    let finalReason = customReason.trim() || selectedReason;
    if (!finalReason) {
      finalReason = "今天一起吃点好吃的";
    }
    onConfirm(finalReason);
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
              "fixed bottom-0 left-0 right-0 z-[101] rounded-t-3xl p-6 pb-safe max-w-[480px] mx-auto",
              styles.sheet
            )}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className={cn("text-xl font-bold", styles.title)}>为什么要下单呢？</h3>
              <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-wrap gap-3 mb-6">
              {reasons.map((reason) => (
                <button
                  key={reason}
                  onClick={() => {
                    setSelectedReason(reason);
                    setCustomReason(""); // Clear custom if standard selected
                  }}
                  className={cn(
                    "px-4 py-2 text-sm font-medium transition-all",
                    selectedReason === reason && !customReason ? styles.btnActive : styles.btn
                  )}
                >
                  {reason}
                </button>
              ))}
            </div>

            <div className="mb-8">
              <input
                type="text"
                placeholder="输入其他原因..."
                value={customReason}
                onChange={(e) => {
                  setCustomReason(e.target.value);
                  if (e.target.value) setSelectedReason(""); // Clear standard if custom typed
                }}
                className={cn(
                  "w-full px-4 py-3 outline-none focus:ring-2 transition-all",
                  styles.input
                )}
              />
            </div>

            <motion.button
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              onClick={handleConfirm}
              disabled={isLoading}
              className={cn(
                "w-full py-3.5 font-bold text-lg flex items-center justify-center transition-all",
                styles.confirmBtn,
                isLoading && "opacity-70 cursor-not-allowed"
              )}
            >
              {isLoading ? "下单中..." : "确认下单"}
            </motion.button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
