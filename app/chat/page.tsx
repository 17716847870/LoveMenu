"use client";

import { useState } from "react";
import { PageContainer } from "../../components/ui/PageContainer";
import { ChatBubble } from "../../components/chat/ChatBubble";
import { MessageInput } from "../../components/chat/MessageInput";
import { EmojiPicker } from "../../components/chat/EmojiPicker";
import { ImageUploader } from "../../components/chat/ImageUploader";
import { VoiceRecorder } from "../../components/chat/VoiceRecorder";
import { ChatMessage } from "../../types";
import { chatMessages } from "../../lib/mock-data";

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(chatMessages);

  const handleSend = (value: string) => {
    const next: ChatMessage = {
      id: `${Date.now()}`,
      senderId: "user-a",
      type: "text",
      content: value,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, next]);
  };

  const handleEmoji = (emoji: string) => {
    handleSend(emoji);
  };

  return (
    <PageContainer className="flex min-h-[80vh] flex-col">
      <h1 className="text-2xl font-semibold">聊天</h1>
      <div className="mt-6 flex flex-1 flex-col gap-3 rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] p-4">
        {messages.map((message) => (
          <ChatBubble
            key={message.id}
            message={message}
            isSelf={message.senderId === "user-a"}
          />
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <EmojiPicker onSelect={handleEmoji} />
        <ImageUploader />
        <VoiceRecorder />
      </div>
      <div className="mt-4">
        <MessageInput onSend={handleSend} />
      </div>
    </PageContainer>
  );
}
