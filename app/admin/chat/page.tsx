"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import PageHeader from "@/components/admin/shared/PageHeader";
import {
  Send,
  Image as ImageIcon,
  Smile,
  Heart,
  Loader2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatMessage } from "@/types";
import { useChatMessages, useSendChatMessage } from "@/apis/chat";
import { useMessage } from "@/components/ui/Message";
import EmojiPanel from "@/components/mobile/chat/EmojiPanel";
import QuickLoveActions from "@/components/mobile/chat/QuickLoveActions";
import { useUser } from "@/context/UserContext";
import { useUsers } from "@/apis/user";
import { useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";

export default function AdminChatPage() {
  const message = useMessage();
  const { data: messages = [], isLoading } = useChatMessages();
  const sendMessage = useSendChatMessage();
  const [inputValue, setInputValue] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { user: currentUser } = useUser();
  const { data: users = [] } = useUsers();
  const partner = useMemo(
    () => users.find((u) => u.id !== currentUser?.id),
    [users, currentUser]
  );

  const myAvatar = currentUser?.avatar || "";
  const myName = currentUser?.name || currentUser?.username || "我";
  const partnerAvatar = partner?.avatar || "";
  const partnerName = partner?.name || partner?.username || "TA";

  const handleQuickSend = async (
    content: string,
    type: "love" | "text" | "image" | "emoji"
  ) => {
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
      message.error("发送失败，请稍后重试");
    }
  };

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, sendMessage.isPending, scrollToBottom]);

  const handleSend = async () => {
    // 发送图片
    if (imageFile) {
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("path", "chat");
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message);
        await sendMessage.mutateAsync({
          type: "image",
          content: json.data.url,
        });
        setImagePreview(null);
        setImageFile(null);
      } catch (err) {
        console.error("图片上传失败", err);
        message.error("图片上传失败，请稍后重试");
      } finally {
        setIsUploading(false);
      }
      return;
    }

    const content = inputValue.trim();
    if (!content) return;
    setInputValue("");

    try {
      await sendMessage.mutateAsync({ type: "text", content });
    } catch {
      message.error("发送失败，请稍后重试");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
    setShowEmoji(false);
    e.target.value = "";
  };

  const handleEmojiSelect = (emoji: string) => {
    setInputValue((v) => v + emoji);
    textareaRef.current?.focus();
  };

  const renderMessageContent = (msg: ChatMessage) => {
    if (msg.type === "image") {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={msg.content}
          alt="图片"
          className="max-w-[200px] max-h-[260px] rounded-xl object-cover cursor-pointer"
          onClick={() => window.open(msg.content, "_blank")}
        />
      );
    }
    if (msg.type === "emoji") {
      if (msg.content === "kiss" || msg.content === "hug") {
        const LOVE_MAP: Record<string, string> = {
          kiss: "💋 亲亲",
          hug: "🤗 贴贴",
        };
        return (
          <span className="text-2xl">
            {LOVE_MAP[msg.content] ?? msg.content}
          </span>
        );
      }
      if (msg.content.startsWith("quick:")) {
        return <span className="text-sm">{msg.content.slice(6)}</span>;
      }
      return msg.content;
    }
    return msg.content;
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#f8f9fa] lg:bg-transparent">
      <div className="lg:hidden bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-500 font-bold shadow-sm">
            <Heart size={20} className="fill-current" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-base leading-tight">
              宝贝
            </h3>
            <p className="text-[11px] text-green-500 flex items-center gap-1 font-medium mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>{" "}
              在线
            </p>
          </div>
        </div>
      </div>

      <div className="hidden lg:block px-8 pt-8 pb-4">
        <PageHeader title="消息聊天" subtitle="实时接收和回复点餐消息" />
      </div>

      <div className="flex-1 flex flex-col lg:mx-8 lg:mb-8 lg:bg-white lg:rounded-3xl lg:shadow-sm lg:border lg:border-pink-100 overflow-hidden relative">
        <div className="hidden lg:flex bg-pink-50/50 border-b border-pink-100 px-6 py-4 items-center justify-between z-10">
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

        <div className="flex-1 overflow-y-auto p-4 lg:p-6 flex flex-col gap-4 bg-[#f8f9fa] custom-scrollbar scroll-smooth">
          {isLoading && (
            <div className="text-center text-sm text-gray-400 py-8">
              加载中...
            </div>
          )}
          {!isLoading && messages.length === 0 && (
            <div className="text-center text-sm text-gray-400 py-8">
              还没有聊天记录，快发一条吧
            </div>
          )}

          {messages.map((msg: ChatMessage) => {
            const isMe = msg.isSender;
            const avatarSrc = isMe ? myAvatar : partnerAvatar;
            const avatarFallback = isMe
              ? myName.charAt(0).toUpperCase()
              : partnerName.charAt(0).toUpperCase();
            return (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-2 w-full mb-2",
                  isMe ? "flex-row-reverse" : "flex-row"
                )}
              >
                <Avatar className="w-8 h-8 mt-1 shrink-0 border border-white shadow-sm">
                  <AvatarImage src={avatarSrc} />
                  <AvatarFallback>{avatarFallback}</AvatarFallback>
                </Avatar>
                <div
                  className={cn(
                    "max-w-[70%] flex flex-col gap-1",
                    isMe ? "items-end" : "items-start"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-2xl text-[15px] leading-relaxed relative group shadow-sm",
                      msg.type === "image"
                        ? "p-0 bg-transparent shadow-none"
                        : cn(
                            "px-4 py-2.5",
                            isMe
                              ? "bg-pink-500 text-white rounded-tr-sm"
                              : "bg-white text-gray-800 rounded-tl-sm border border-gray-100"
                          )
                    )}
                  >
                    {renderMessageContent(msg)}
                  </div>
                  {msg.isPending && isMe ? (
                    <span className="inline-flex items-center gap-1 text-[10px] text-pink-400 px-1">
                      <Loader2 size={10} className="animate-spin" />
                      发送中...
                    </span>
                  ) : (
                    <span className="text-[10px] text-gray-400 px-1">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} className="h-2" />
        </div>

        {/* Emoji Panel */}
        {showEmoji && (
          <EmojiPanel
            onSelect={handleEmojiSelect}
            onClose={() => setShowEmoji(false)}
          />
        )}

        {/* Quick Love Actions */}
        <QuickLoveActions onSend={handleQuickSend} />

        <div className="p-3 lg:p-4 bg-white lg:border-t lg:border-gray-100 pb-safe shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)] lg:shadow-none z-20">
          {/* Image Preview */}
          {imagePreview && (
            <div className="mb-2 flex items-center gap-2">
              <div className="relative w-14 h-14">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreview}
                  alt="预览"
                  className="w-14 h-14 rounded-xl object-cover border border-gray-200"
                />
                <button
                  onClick={() => {
                    setImagePreview(null);
                    setImageFile(null);
                  }}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-600 text-white rounded-full flex items-center justify-center"
                >
                  <X size={12} />
                </button>
              </div>
              <span className="text-xs text-gray-400">
                点击发送按钮上传图片
              </span>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageSelect}
          />

          <div className="flex items-end gap-2 bg-gray-50 rounded-[20px] p-1.5 lg:p-2 border border-gray-200 focus-within:border-pink-300 focus-within:bg-white transition-colors">
            <div className="flex items-center gap-1 pb-1 px-1">
              <button
                onClick={() => {
                  fileInputRef.current?.click();
                  setShowEmoji(false);
                }}
                className="p-2 text-gray-400 hover:text-pink-500 transition-colors rounded-full hover:bg-pink-50"
                type="button"
              >
                <ImageIcon size={22} />
              </button>
              <button
                onClick={() => setShowEmoji((v) => !v)}
                className={cn(
                  "p-2 transition-colors rounded-full",
                  showEmoji
                    ? "text-pink-500 bg-pink-50"
                    : "text-gray-400 hover:text-pink-500 hover:bg-pink-50"
                )}
                type="button"
              >
                <Smile size={22} />
              </button>
            </div>

            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              onFocus={() => setShowEmoji(false)}
              placeholder={imagePreview ? "" : "发送消息..."}
              disabled={!!imagePreview}
              className="flex-1 max-h-24 min-h-10 bg-transparent border-none outline-none resize-none py-2.5 px-1 text-[15px] lg:text-base custom-scrollbar"
              rows={1}
            />

            <button
              onClick={handleSend}
              disabled={
                (!inputValue.trim() && !imageFile) ||
                sendMessage.isPending ||
                isUploading
              }
              className={cn(
                "w-10 h-10 lg:w-11 lg:h-11 rounded-full flex items-center justify-center transition-all shrink-0 mb-0.5 mr-0.5",
                (inputValue.trim() || imageFile) &&
                  !sendMessage.isPending &&
                  !isUploading
                  ? "bg-pink-500 text-white shadow-md hover:bg-pink-600 scale-100"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed scale-95"
              )}
            >
              {isUploading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Send
                  size={18}
                  className={cn(
                    (inputValue.trim() || imageFile) &&
                      "translate-x-0.5 -translate-y-0.5"
                  )}
                />
              )}
            </button>
          </div>
          <p className="text-[10px] text-center text-gray-400 mt-2 hidden lg:block">
            按 Enter 发送，Shift + Enter 换行
          </p>
        </div>
      </div>
    </div>
  );
}
