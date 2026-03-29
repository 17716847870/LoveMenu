"use client";

import React, { useMemo, useRef, useEffect, useCallback } from "react";
import ChatHeader from "@/components/mobile/chat/ChatHeader";
import ChatMessages from "@/components/mobile/chat/ChatMessages";
import ChatInputBar from "@/components/mobile/chat/ChatInputBar";
import { Message } from "@/components/mobile/chat/MessageBubble";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { ThemeName } from "@/types";
import { useChatMessages, useSendChatMessage } from "@/apis/chat";
import { useMessage } from "@/components/ui/Message";

const themeStyles: Record<ThemeName, { bg: string }> = {
  couple: { bg: "bg-gradient-to-b from-pink-50/50 to-white" },
  cute: { bg: "bg-gradient-to-b from-orange-50/50 to-white" },
  minimal: { bg: "bg-gray-50/30" },
  night: { bg: "bg-slate-900" },
};

export default function ChatPage() {
  const toast = useMessage();
  const { data: chatMessages = [] } = useChatMessages();
  const sendMessage = useSendChatMessage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const currentTheme = themeStyles[theme] || themeStyles.couple;

  const messages = useMemo<Message[]>(() => {
    return chatMessages.map((msg) => {
      let type: Message["type"] = "text";
      if (msg.type === "image") type = "image";
      else if (msg.type === "emoji") {
        if (msg.content === "kiss" || msg.content === "hug") type = "love";
        else if (msg.content.startsWith("quick:")) type = "text";
        else type = "text";
      }
      return {
        id: msg.id,
        type,
        content: msg.content,
        sender: msg.isSender ? "me" : "partner",
        createdAt: new Date(msg.createdAt).toLocaleString("zh-CN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isPending: msg.isPending,
      };
    });
  }, [chatMessages]);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, sendMessage.isPending, scrollToBottom]);

  const handleSend = async (content: string, type: "text" | "love" | "image" | "emoji") => {
    try {
      let msgType: "text" | "image" | "voice" | "emoji" = "text";
      if (type === "love") msgType = "emoji";
      else if (type === "image") msgType = "image";
      else if (type === "emoji") msgType = "emoji";
      
      await sendMessage.mutateAsync({
        type: msgType,
        content,
      });
    } catch {
      toast.error("发送失败，请稍后重试");
    }
  };

  return (
    <div
      className={cn("flex flex-col h-dvh", currentTheme.bg)}
    >
      <ChatHeader />

      <div ref={scrollRef} className="flex-1 overflow-y-auto scroll-smooth">
        <ChatMessages messages={messages} />
      </div>

      <ChatInputBar onSend={handleSend} />
    </div>
  );
}
