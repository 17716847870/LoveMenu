"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { ThemeName } from "@/types";
import LoveMessage from "./LoveMessage";

export interface Message {
  id: string;
  type: "text" | "love";
  content: string;
  sender: "me" | "partner";
  createdAt: string;
}

interface MessageBubbleProps {
  message: Message;
}

const themeStyles: Record<ThemeName, {
  me: string;
  partner: string;
  textMe: string;
  textPartner: string;
}> = {
  couple: {
    me: "bg-pink-500 rounded-tr-sm shadow-pink-200",
    partner: "bg-white rounded-tl-sm border-gray-100 shadow-sm",
    textMe: "text-white",
    textPartner: "text-gray-800",
  },
  cute: {
    me: "bg-orange-400 rounded-tr-sm shadow-orange-200",
    partner: "bg-white rounded-tl-sm border-gray-100 shadow-sm",
    textMe: "text-white",
    textPartner: "text-gray-800",
  },
  minimal: {
    me: "bg-black rounded-tr-sm shadow-gray-200",
    partner: "bg-white rounded-tl-sm border-gray-100 shadow-sm",
    textMe: "text-white",
    textPartner: "text-gray-900",
  },
  night: {
    me: "bg-blue-600 rounded-tr-sm shadow-blue-900/50",
    partner: "bg-slate-800 rounded-tl-sm border-slate-700 shadow-sm",
    textMe: "text-white",
    textPartner: "text-slate-200",
  },
};

export default function MessageBubble({ message }: MessageBubbleProps) {
  const { theme } = useTheme();
  const currentTheme = themeStyles[theme] || themeStyles.couple;
  const isMe = message.sender === "me";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex gap-2 mb-4 w-full",
        isMe ? "flex-row-reverse" : "flex-row"
      )}
    >
      <Avatar className="w-8 h-8 mt-1 border border-white dark:border-slate-800 shadow-sm">
        <AvatarImage src={isMe ? "/avatar-me.jpg" : "/avatar-partner.jpg"} />
        <AvatarFallback>{isMe ? "ME" : "TA"}</AvatarFallback>
      </Avatar>

      <div className={cn(
        "max-w-[70%] flex flex-col gap-1",
        isMe ? "items-end" : "items-start"
      )}>
        {message.type === "text" ? (
          <div className={cn(
            "px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm break-words",
            isMe ? currentTheme.me : currentTheme.partner,
            isMe ? currentTheme.textMe : currentTheme.textPartner
          )}>
            {message.content}
          </div>
        ) : (
          <LoveMessage type={message.content as "kiss" | "hug"} />
        )}
        
        <span className="text-[10px] text-gray-400 px-1">
          {message.createdAt.split(' ')[1]}
        </span>
      </div>
    </motion.div>
  );
}
