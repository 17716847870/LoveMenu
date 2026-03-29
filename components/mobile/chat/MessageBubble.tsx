"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { ThemeName } from "@/types";
import LoveMessage from "./LoveMessage";

export interface AvatarInfo {
  myAvatar: string;
  myName: string;
  partnerAvatar: string;
  partnerName: string;
}

export interface Message {
  id: string;
  type: "text" | "love" | "image";
  content: string;
  sender: "me" | "partner";
  createdAt: string;
  isPending?: boolean;
}

interface MessageBubbleProps {
  message: Message;
  avatarInfo: AvatarInfo;
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

export default function MessageBubble({ message, avatarInfo }: MessageBubbleProps) {
  const { theme } = useTheme();
  const currentTheme = themeStyles[theme] || themeStyles.couple;
  const isMe = message.sender === "me";

  const { myAvatar, myName, partnerAvatar, partnerName } = avatarInfo;
  const avatarSrc = isMe ? myAvatar : partnerAvatar;
  const avatarFallback = isMe ? myName.charAt(0).toUpperCase() : partnerName.charAt(0).toUpperCase();

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
        <AvatarImage src={avatarSrc} />
        <AvatarFallback>{avatarFallback}</AvatarFallback>
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
            {message.content.startsWith("quick:") ? message.content.slice(6) : message.content}
          </div>
        ) : message.type === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={message.content}
            alt="图片消息"
            className="max-w-[220px] max-h-[300px] rounded-2xl object-cover shadow-sm cursor-pointer"
            onClick={() => window.open(message.content, "_blank")}
          />
        ) : (
          <LoveMessage type={message.content as "kiss" | "hug"} />
        )}
        
        {message.isPending && isMe ? (
          <span className="inline-flex items-center gap-1 text-[10px] text-pink-400 px-1">
            <Loader2 className="w-3 h-3 animate-spin" />
            发送中...
          </span>
        ) : (
          <span className="text-[10px] text-gray-400 px-1">
            {message.createdAt}
          </span>
        )}
      </div>
    </motion.div>
  );
}
