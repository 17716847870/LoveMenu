"use client";

import { motion, AnimatePresence } from "framer-motion";
import MessageBubble, { Message } from "./MessageBubble";
import type { AvatarInfo } from "./MessageBubble";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { ThemeName } from "@/types";
import { useUser } from "@/context/UserContext";
import { useUsers } from "@/apis/user";
import { useMemo } from "react";

interface ChatMessagesProps {
  messages: Message[];
}

const themeStyles: Record<ThemeName, {
  date: string;
}> = {
  couple: { date: "text-pink-400 bg-pink-50/50" },
  cute: { date: "text-orange-400 bg-orange-50/50" },
  minimal: { date: "text-gray-400 bg-gray-50/50" },
  night: { date: "text-slate-500 bg-slate-800/50" },
};

export default function ChatMessages({ messages }: ChatMessagesProps) {
  const { theme } = useTheme();
  const currentTheme = themeStyles[theme] || themeStyles.couple;
  const { user: currentUser } = useUser();
  const { data: users = [] } = useUsers();
  const partner = useMemo(() => users.find((u) => u.id !== currentUser?.id), [users, currentUser]);

  const myAvatar = currentUser?.avatar || "";
  const myName = currentUser?.name || currentUser?.username || "我";
  const partnerAvatar = partner?.avatar || "";
  const partnerName = partner?.name || partner?.username || "TA";

  const avatarInfo = {
    myAvatar, myName, partnerAvatar, partnerName,
  };

  return (
    <div className="flex flex-col p-4 pb-6 pt-20">
      {/* Date Divider */}
      <div className="flex justify-center mb-6">
        <span className={cn(
          "text-xs px-3 py-1 rounded-full",
          currentTheme.date
        )}>
          今天 12:30
        </span>
      </div>

      <AnimatePresence initial={false}>
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <MessageBubble message={message} avatarInfo={avatarInfo} />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Typing Indicator (Optional) */}
      {/* <div className="text-xs text-gray-400 ml-12 animate-pulse">
        对方正在输入...
      </div> */}
    </div>
  );
}
