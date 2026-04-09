"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { useMessage } from "@/components/ui/Message";
import { ThemeName, FoodRequest } from "@/types";
import { X, Image as ImageIcon, Loader2, Trash2 } from "lucide-react";

interface CreateFoodRequestProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<FoodRequest, "id" | "status" | "createdAt">) => void;
}

const themeStyles: Record<
  ThemeName,
  {
    overlay: string;
    sheet: string;
    title: string;
    input: string;
    label: string;
    submitBtn: string;
    uploadZone: string;
    uploadText: string;
  }
> = {
  couple: {
    overlay: "bg-black/40",
    sheet: "bg-white",
    title: "text-pink-900",
    input:
      "bg-pink-50/50 border-pink-100 focus:border-pink-300 focus:ring-pink-100 text-pink-900 placeholder:text-pink-300",
    label: "text-pink-700",
    submitBtn:
      "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-pink-200",
    uploadZone: "border-pink-200 bg-pink-50/50",
    uploadText: "text-pink-400",
  },
  cute: {
    overlay: "bg-black/50",
    sheet: "bg-[#fff5fb]",
    title: "text-orange-900",
    input:
      "bg-white border-2 border-orange-100 focus:border-orange-300 focus:ring-orange-100 text-orange-900 placeholder:text-orange-300 rounded-xl",
    label: "text-orange-800",
    submitBtn:
      "bg-orange-400 text-white shadow-orange-200 border-b-4 border-orange-600 active:border-b-0 active:translate-y-1",
    uploadZone: "border-orange-200 bg-orange-50/30",
    uploadText: "text-orange-400",
  },
  minimal: {
    overlay: "bg-black/60",
    sheet: "bg-white",
    title: "text-gray-900",
    input:
      "bg-white border-gray-200 focus:border-black focus:ring-gray-100 text-gray-900 placeholder:text-gray-400 rounded-lg",
    label: "text-gray-700",
    submitBtn: "bg-black text-white hover:bg-gray-800 rounded-lg",
    uploadZone: "border-gray-200 bg-gray-50",
    uploadText: "text-gray-400",
  },
  night: {
    overlay: "bg-black/80",
    sheet: "bg-slate-900 border-t border-slate-800",
    title: "text-white",
    input:
      "bg-slate-800 border-slate-700 focus:border-purple-500 focus:ring-purple-900 text-white placeholder:text-slate-500 rounded-xl",
    label: "text-slate-300",
    submitBtn:
      "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-purple-900/50 rounded-xl",
    uploadZone: "border-slate-600 bg-slate-800/50",
    uploadText: "text-slate-400",
  },
};

export default function CreateFoodRequest({
  isOpen,
  onClose,
  onSubmit,
}: CreateFoodRequestProps) {
  const { theme } = useTheme();
  const message = useMessage();
  const styles = themeStyles[theme];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("path", "food-requests");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success && result.data?.url) {
        setImage(result.data.url);
      } else {
        message.error(result.message || "图片上传失败");
      }
    } catch (error) {
      console.error("Upload error:", error);
      message.error("图片上传失败，请重试");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = () => {
    setImage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);

    onSubmit({
      name,
      description,
      image,
    });

    setName("");
    setDescription("");
    setImage("");
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
              <h3 className={cn("text-xl font-bold", styles.title)}>
                提议新食物
              </h3>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="space-y-2">
                <label className={cn("font-medium text-sm", styles.label)}>
                  食物名称
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="例如：韩式炸鸡"
                  className={cn(
                    "w-full px-4 py-3 outline-none focus:ring-2 transition-all rounded-xl",
                    styles.input
                  )}
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <label className={cn("font-medium text-sm", styles.label)}>
                  想吃理由 / 描述
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="说说为什么想吃这个..."
                  rows={4}
                  className={cn(
                    "w-full px-4 py-3 outline-none focus:ring-2 transition-all rounded-xl resize-none",
                    styles.input
                  )}
                />
              </div>

              <div className="space-y-2">
                <label className={cn("font-medium text-sm", styles.label)}>
                  参考图片 (可选)
                </label>

                {image ? (
                  <div className="relative rounded-xl overflow-hidden">
                    <img
                      src={image}
                      alt="预览"
                      className="w-full h-48 object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      "w-full h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors",
                      styles.uploadZone,
                      isUploading && "opacity-50 cursor-wait"
                    )}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-8 h-8 animate-spin" />
                        <span className={cn("text-xs", styles.uploadText)}>
                          上传中...
                        </span>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-8 h-8" />
                        <span className={cn("text-xs", styles.uploadText)}>
                          点击上传图片
                        </span>
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

              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={!name.trim() || isSubmitting}
                className={cn(
                  "w-full py-4 rounded-xl font-bold text-base shadow-lg transition-all flex items-center justify-center gap-2",
                  styles.submitBtn,
                  (isSubmitting || !name.trim()) &&
                    "opacity-50 cursor-not-allowed"
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
