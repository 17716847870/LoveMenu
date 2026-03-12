"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Send, 
  Mic, 
  Image as ImageIcon, 
  Smile,
  Heart
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { ThemeName } from "@/types";
import QuickLoveActions from "./QuickLoveActions";

interface ChatInputBarProps {
  onSend: (content: string, type: "text" | "love") => void;
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
  const inputRef = useRef<HTMLInputElement>(null);
  const { theme } = useTheme();
  const currentTheme = themeStyles[theme] || themeStyles.couple;

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!value.trim()) return;
    onSend(value, "text");
    setValue("");
  };

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 z-50 flex flex-col",
      currentTheme.container
    )}>
      {/* Quick Actions */}
      <QuickLoveActions onSend={onSend} />

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 p-3 pb-6 sm:pb-3">
        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          <button type="button" className={cn("p-2 rounded-full transition-colors", currentTheme.icon)}>
            <Mic className="w-5 h-5" />
          </button>
          <button type="button" className={cn("p-2 rounded-full transition-colors", currentTheme.icon)}>
            <ImageIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Text Input */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="说点什么..."
          className={cn(
            "flex-1 h-10 px-4 rounded-full text-sm outline-none border transition-colors",
            currentTheme.input
          )}
        />

        {/* Emoji Button */}
        <button type="button" className={cn("p-2 rounded-full transition-colors", currentTheme.icon)}>
          <Smile className="w-5 h-5" />
        </button>

        {/* Send Button */}
        <motion.button
          type="submit"
          whileTap={{ scale: 0.9 }}
          disabled={!value.trim()}
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md",
            currentTheme.send
          )}
        >
          {value.trim() ? (
            <Send className="w-4 h-4 ml-0.5" />
          ) : (
            <Heart className="w-4 h-4 fill-current" />
          )}
        </motion.button>
      </form>
    </div>
  );
}
