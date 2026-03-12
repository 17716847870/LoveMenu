"use client";

import React, { useState, useRef, useEffect } from "react";
import ChatHeader from "@/components/mobile/chat/ChatHeader";
import ChatMessages from "@/components/mobile/chat/ChatMessages";
import ChatInputBar from "@/components/mobile/chat/ChatInputBar";
import { Message } from "@/components/mobile/chat/MessageBubble";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { ThemeName } from "@/types";

const initialMessages: Message[] = [
  {
    id: "1",
    type: "text",
    content: "想要草莓松饼！🍓",
    sender: "partner",
    createdAt: "2024-03-12 12:30"
  },
  {
    id: "2",
    type: "text",
    content: "今天想吃点什么呀？🤔",
    sender: "me",
    createdAt: "2024-03-12 12:31"
  },
  {
    id: "3",
    type: "love",
    content: "kiss",
    sender: "partner",
    createdAt: "2024-03-12 12:32"
  },
  {
    id: "4",
    type: "text",
    content: "我也想吃！既然你想吃，那我们就去吃吧~",
    sender: "me",
    createdAt: "2024-03-12 12:33"
  }
];

const themeStyles: Record<ThemeName, {
  bg: string;
}> = {
  couple: { bg: "bg-gradient-to-b from-pink-50/50 to-white" },
  cute: { bg: "bg-gradient-to-b from-orange-50/50 to-white" },
  minimal: { bg: "bg-gray-50/30" },
  night: { bg: "bg-slate-900" },
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const currentTheme = themeStyles[theme] || themeStyles.couple;

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (content: string, type: "text" | "love") => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      sender: "me",
      createdAt: new Date().toLocaleString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, newMessage]);

    // Mock reply
    if (type === "love") {
      setTimeout(() => {
        const reply: Message = {
          id: (Date.now() + 1).toString(),
          type: "love",
          content: content === "kiss" ? "kiss" : "hug",
          sender: "partner",
          createdAt: new Date().toLocaleString('zh-CN', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, reply]);
      }, 1000);
    }
  };

  return (
    <div className={cn("flex flex-col h-screen", currentTheme.bg)}>
      {/* Header */}
      <ChatHeader />

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto scroll-smooth"
      >
        <ChatMessages messages={messages} />
      </div>

      {/* Input Area */}
      <ChatInputBar onSend={handleSend} />
    </div>
  );
}
