"use client";

import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { ThemeName } from "@/types";
import { X } from "lucide-react";

interface EmojiPanelProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

const EMOJI_GROUPS = [
  {
    label: "爱意",
    emojis: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟", "♥️", "😍", "🥰", "😘"],
  },
  {
    label: "表情",
    emojis: ["😂", "🤣", "😊", "🥺", "😭", "😅", "🤭", "😏", "🥹", "😇", "🤗", "😌", "🫠", "🥴", "🤤", "😋", "😜", "🤪", "😎", "🫡"],
  },
  {
    label: "食物",
    emojis: ["🍜", "🍱", "🍣", "🍕", "🍔", "🌮", "🥗", "🍰", "🧁", "🍩", "🍦", "🧃", "🧋", "☕", "🍵", "🍺", "🥂", "🍾", "🎂", "🍫"],
  },
  {
    label: "动作",
    emojis: ["👏", "🙏", "🤝", "👍", "✌️", "🤞", "🤟", "🫶", "💪", "🤜", "🫂", "💅", "🫰", "👋", "🙌", "🤲", "🫵", "☝️", "👀", "💋"],
  },
];

const themeStyles: Record<ThemeName, { panel: string; tab: string; activeTab: string }> = {
  couple: { panel: "bg-white border-t border-pink-100", tab: "text-gray-400", activeTab: "text-pink-500 border-b-2 border-pink-500" },
  cute: { panel: "bg-white border-t border-orange-100", tab: "text-gray-400", activeTab: "text-orange-500 border-b-2 border-orange-500" },
  minimal: { panel: "bg-white border-t border-gray-100", tab: "text-gray-400", activeTab: "text-gray-900 border-b-2 border-gray-900" },
  night: { panel: "bg-slate-900 border-t border-slate-800", tab: "text-slate-500", activeTab: "text-blue-400 border-b-2 border-blue-400" },
};

export default function EmojiPanel({ onSelect, onClose }: EmojiPanelProps) {
  const { theme } = useTheme();
  const currentTheme = themeStyles[theme] || themeStyles.couple;
  const [activeGroup, setActiveGroup] = useState(0);

  return (
    <div className={cn("w-full", currentTheme.panel)}>
      {/* Tabs */}
      <div className="flex items-center border-b border-gray-100 dark:border-slate-800">
        {EMOJI_GROUPS.map((g, i) => (
          <button
            key={g.label}
            onClick={() => setActiveGroup(i)}
            className={cn(
              "flex-1 py-2 text-xs font-medium transition-colors",
              activeGroup === i ? currentTheme.activeTab : currentTheme.tab
            )}
          >
            {g.label}
          </button>
        ))}
        <button onClick={onClose} className={cn("px-3 py-2", currentTheme.tab)}>
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Emoji Grid */}
      <div className="grid grid-cols-8 gap-1 p-3 h-36 overflow-y-auto">
        {EMOJI_GROUPS[activeGroup].emojis.map((emoji) => (
          <button
            key={emoji}
            onClick={() => onSelect(emoji)}
            className="text-2xl h-10 w-10 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors active:scale-90"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
