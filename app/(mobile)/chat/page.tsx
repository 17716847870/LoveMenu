"use client";

import { useState } from "react";
import ChatBubble from "@/components/chat/ChatBubble";
import MessageInput from "@/components/chat/MessageInput";
import { chatMessages } from "@/lib/mock-data";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Video, Phone } from "lucide-react";

export default function ChatPage() {
  const [messages, setMessages] = useState(chatMessages);

  const handleSend = (content: string, type: "text" | "image" | "voice" | "emoji") => {
    const newMessage = {
      id: `m-${Date.now()}`,
      senderId: "user-a", // Current user
      type,
      content,
      createdAt: new Date().toISOString(),
      isSender: true,
    };
    setMessages([...messages, newMessage]);
    
    // Auto reply mock
    setTimeout(() => {
        setMessages(prev => [...prev, {
            id: `m-${Date.now() + 1}`,
            senderId: "user-b",
            type: "text",
            content: "收到啦！❤️",
            createdAt: new Date().toISOString(),
            isSender: false,
        }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-muted/20">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-14 bg-background border-b shadow-sm shrink-0">
        <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9" />
            <div className="flex flex-col">
                <span className="font-semibold text-sm">亲爱的</span>
                <span className="text-[10px] text-green-500">在线</span>
            </div>
        </div>
        <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
                <Phone size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
                <Video size={20} />
            </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {messages.map((msg) => (
          <ChatBubble 
            key={msg.id} 
            message={{...msg, isSender: msg.senderId === "user-a"}} 
          />
        ))}
      </div>

      {/* Input */}
      <div className="shrink-0 mb-16">
        <MessageInput onSend={handleSend} />
      </div>
    </div>
  );
}
