"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Send,
  Image as ImageIcon,
  Smile,
  Heart,
  X,
  Loader2,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { ThemeName } from "@/types";
import QuickLoveActions from "./QuickLoveActions";
import EmojiPanel from "./EmojiPanel";

interface ChatInputBarProps {
  onSend: (content: string, type: "text" | "love" | "image" | "emoji") => void;
}

const themeStyles: Record<ThemeName, {
  container: string;
  input: string;
  icon: string;
  send: string;
}> = {
  couple: {
    container: "bg-white/90 backdrop-blur-sm border-t border-pink-100",
    input: "bg-pink-50 border-pink-100 focus:border-pink-300 text-pink-900",
    icon: "text-pink-400 hover:bg-pink-50",
    send: "bg-pink-500 hover:bg-pink-600 text-white shadow-pink-200",
  },
  cute: {
    container: "bg-white/90 backdrop-blur-sm border-t border-orange-100",
    input: "bg-orange-50 border-orange-100 focus:border-orange-300 text-orange-900",
    icon: "text-orange-400 hover:bg-orange-50",
    send: "bg-orange-500 hover:bg-orange-600 text-white shadow-orange-200",
  },
  minimal: {
    container: "bg-white border-t border-gray-100",
    input: "bg-gray-50 border-gray-200 focus:border-gray-900 text-gray-900",
    icon: "text-gray-400 hover:bg-gray-50",
    send: "bg-black hover:bg-gray-800 text-white",
  },
  night: {
    container: "bg-slate-900/90 backdrop-blur-sm border-t border-slate-800",
    input: "bg-slate-800 border-slate-700 focus:border-blue-500 text-slate-100",
    icon: "text-slate-500 hover:bg-slate-800",
    send: "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/50",
  },
};

export default function ChatInputBar({ onSend }: ChatInputBarProps) {
  const [value, setValue] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { theme } = useTheme();
  const currentTheme = themeStyles[theme] || themeStyles.couple;

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    // 发送图片
    if (imageFile) {
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("path", "chat");
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message);
        onSend(json.data.url, "image");
        setImagePreview(null);
        setImageFile(null);
      } catch (err) {
        console.error("图片上传失败", err);
      } finally {
        setIsUploading(false);
      }
      return;
    }

    if (!value.trim()) return;
    onSend(value, "text");
    setValue("");
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
    setShowEmoji(false);
    // 清空 file input 以支持重复选同一张图
    e.target.value = "";
  };

  const handleEmojiSelect = (emoji: string) => {
    setValue((v) => v + emoji);
    inputRef.current?.focus();
  };

  return (
    <div className={cn("flex flex-col shrink-0", currentTheme.container)}>
      {/* Quick Actions */}
      <QuickLoveActions onSend={onSend} />

      {/* Image Preview */}
      {imagePreview && (
        <div className="px-3 pb-2 flex items-center gap-2">
          <div className="relative w-16 h-16">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imagePreview} alt="预览" className="w-16 h-16 rounded-xl object-cover border border-gray-200" />
            <button
              onClick={() => { setImagePreview(null); setImageFile(null); }}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-600 text-white rounded-full flex items-center justify-center"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <span className="text-xs text-gray-400">点击发送按钮上传图片</span>
        </div>
      )}

      {/* Emoji Panel */}
      {showEmoji && <EmojiPanel onSelect={handleEmojiSelect} onClose={() => setShowEmoji(false)} />}

      {/* Input Area */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 p-3"
        style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
      >
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageSelect}
        />

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => { fileInputRef.current?.click(); setShowEmoji(false); }}
            className={cn("p-2 rounded-full transition-colors", currentTheme.icon)}
          >
            <ImageIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Text Input */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setShowEmoji(false)}
          placeholder={imagePreview ? "" : "说点什么..."}
          disabled={!!imagePreview}
          className={cn(
            "flex-1 h-10 px-4 rounded-full text-sm outline-none border transition-colors",
            currentTheme.input
          )}
        />

        {/* Emoji Button */}
        <button
          type="button"
          onClick={() => setShowEmoji((v) => !v)}
          className={cn("p-2 rounded-full transition-colors", currentTheme.icon,
            showEmoji && "bg-pink-100"
          )}
        >
          <Smile className="w-5 h-5" />
        </button>

        {/* Send Button */}
        <motion.button
          type="submit"
          whileTap={{ scale: 0.9 }}
          disabled={(!value.trim() && !imageFile) || isUploading}
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md",
            currentTheme.send
          )}
        >
          {isUploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : value.trim() || imageFile ? (
            <Send className="w-4 h-4 ml-0.5" />
          ) : (
            <Heart className="w-4 h-4 fill-current" />
          )}
        </motion.button>
      </form>
    </div>
  );
}
