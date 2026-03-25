"use client";

import React, { useMemo, useRef, useEffect } from "react";
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
    return chatMessages.map((msg) => ({
      id: msg.id,
      type: msg.type === "emoji" && (msg.content === "kiss" || msg.content === "hug") ? "love" : "text",
      content: msg.content,
      sender: msg.isSender ? "me" : "partner",
      createdAt: new Date(msg.createdAt).toLocaleString("zh-CN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isPending: msg.isPending,
    }));
  }, [chatMessages]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, sendMessage.isPending]);

  const handleSend = async (content: string, type: "text" | "love") => {
    try {
      await sendMessage.mutateAsync({
        type: type === "love" ? "emoji" : "text",
        content,
      });
    } catch {
      toast.error("发送失败，请稍后重试");
    }
  };

  return (
    <div className={cn("flex flex-col h-screen", currentTheme.bg)}>
      <ChatHeader />

      <div ref={scrollRef} className="flex-1 overflow-y-auto scroll-smooth">
        <ChatMessages messages={messages} />
      </div>

      <ChatInputBar onSend={handleSend} />
    </div>
  );
}
