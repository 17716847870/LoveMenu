"use client";

import React, { useState, useRef, useEffect } from "react";
import { PageContainer } from "@/components/ui/PageContainer";
import PageHeader from "@/components/admin/shared/PageHeader";
import { Send, Image as ImageIcon, Smile, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatMessage } from "@/types";

// 模拟初始消息记录
const initialMessages: ChatMessage[] = [
  {
    id: "m1",
    senderId: "user-partner", // 对方（用户端）发来的
    type: "text",
    content: "今天晚上想吃什么呀？",
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    isSender: false,
  },
  {
    id: "m2",
    senderId: "admin", // 后台发出的
    type: "text",
    content: "宝贝想吃什么我都给你做！",
    createdAt: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
    isSender: true,
  },
  {
    id: "m3",
    senderId: "user-partner",
    type: "text",
    content: "那我要吃草莓松饼！🍓",
    createdAt: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
    isSender: false,
  }
];

export default function AdminChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: "admin",
      type: "text",
      content: inputValue.trim(),
      createdAt: new Date().toISOString(),
      isSender: true, // 标记为我（后台）发送的
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-[#f8f9fa] md:bg-transparent">
      {/* Mobile Header (Hidden on PC) */}
      <div className="md:hidden bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-500 font-bold shadow-sm">
            <Heart size={20} className="fill-current" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-base leading-tight">宝贝</h3>
            <p className="text-[11px] text-green-500 flex items-center gap-1 font-medium mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> 在线
            </p>
          </div>
        </div>
      </div>

      <div className="hidden md:block px-8 pt-8 pb-4">
        <PageHeader title="消息聊天" subtitle="实时接收和回复点餐消息" />
      </div>
      
      {/* Chat Window (Desktop Wrapper) */}
      <div className="flex-1 flex flex-col md:mx-8 md:mb-8 md:bg-white md:rounded-3xl md:shadow-sm md:border md:border-pink-100 overflow-hidden relative">
        
        {/* Desktop Header Bar inside Chat */}
        <div className="hidden md:flex bg-pink-50/50 border-b border-pink-100 px-6 py-4 items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-pink-200 flex items-center justify-center text-pink-600 font-bold">
              <Heart size={20} className="fill-current" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">宝贝</h3>
              <p className="text-xs text-green-500 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500"></span> 在线
              </p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-4 bg-[#f8f9fa] custom-scrollbar scroll-smooth">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={cn(
                "flex w-full",
                msg.isSender ? "justify-end" : "justify-start"
              )}
            >
              <div className={cn(
                "max-w-[80%] md:max-w-[60%] rounded-2xl px-4 py-2.5 text-[15px] md:text-base leading-relaxed relative group shadow-sm",
                msg.isSender 
                  ? "bg-pink-500 text-white rounded-br-sm" 
                  : "bg-white text-gray-800 rounded-bl-sm border border-gray-100"
              )}>
                {msg.content}
                <span className={cn(
                  "text-[10px] absolute -bottom-5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap",
                  msg.isSender ? "right-1 text-gray-400" : "left-1 text-gray-400"
                )}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} className="h-2" />
        </div>

        {/* Input Area */}
        <div className="p-3 md:p-4 bg-white md:border-t md:border-gray-100 pb-safe shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)] md:shadow-none z-20">
          <div className="flex items-end gap-2 bg-gray-50 rounded-[20px] p-1.5 md:p-2 border border-gray-200 focus-within:border-pink-300 focus-within:bg-white transition-colors">
            <div className="flex items-center gap-1 pb-1 px-1">
              <button className="p-2 text-gray-400 hover:text-pink-500 transition-colors rounded-full hover:bg-pink-50">
                <ImageIcon size={22} />
              </button>
              <button className="p-2 text-gray-400 hover:text-pink-500 transition-colors rounded-full hover:bg-pink-50 hidden md:block">
                <Smile size={22} />
              </button>
            </div>
            
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="发送消息..."
              className="flex-1 max-h-24 min-h-[40px] bg-transparent border-none outline-none resize-none py-2.5 px-1 text-[15px] md:text-base custom-scrollbar"
              rows={1}
            />
            
            <button 
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className={cn(
                "w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center transition-all shrink-0 mb-0.5 mr-0.5",
                inputValue.trim() 
                  ? "bg-pink-500 text-white shadow-md hover:bg-pink-600 scale-100" 
                  : "bg-gray-200 text-gray-400 cursor-not-allowed scale-95"
              )}
            >
              <Send size={18} className={cn(inputValue.trim() && "translate-x-0.5 -translate-y-0.5")} />
            </button>
          </div>
          <p className="text-[10px] text-center text-gray-400 mt-2 hidden md:block">
            按 Enter 发送，Shift + Enter 换行
          </p>
        </div>

      </div>
    </div>
  );
}
