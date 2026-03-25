"use client";

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { chatKeys, fetchChatUnreadCount, markChatAsRead } from "@/apis/chat";

type ChatRealtimeContextValue = {
  unreadCount: number;
  refreshUnreadCount: () => Promise<void>;
};

const ChatRealtimeContext = createContext<ChatRealtimeContextValue | undefined>(undefined);

const CHAT_PATHS = ["/chat", "/admin/chat"];

export function ChatRealtimeProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [unreadCount, setUnreadCount] = useState(0);
  const eventSourceRef = useRef<EventSource | null>(null);

  const inChatPage = CHAT_PATHS.includes(pathname);

  const refreshUnreadCount = async () => {
    try {
      const count = await fetchChatUnreadCount();
      setUnreadCount(count);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    refreshUnreadCount();
  }, []);

  useEffect(() => {
    const eventSource = new EventSource("/api/chat/stream");
    eventSourceRef.current = eventSource;

    const onMessage = async (event: MessageEvent) => {
      try {
        const payload = JSON.parse(event.data) as { isSender?: boolean };
        queryClient.invalidateQueries({ queryKey: chatKeys.messages() });

        if (payload.isSender) {
          return;
        }

        if (inChatPage) {
          await markChatAsRead();
          setUnreadCount(0);
        } else {
          setUnreadCount((prev) => prev + 1);
        }
      } catch {
        // ignore
      }
    };

    const onUnread = (event: MessageEvent) => {
      try {
        const payload = JSON.parse(event.data) as { count?: number };
        if (typeof payload.count === "number") {
          setUnreadCount(payload.count);
        }
      } catch {
        // ignore
      }
    };

    eventSource.addEventListener("message", onMessage);
    eventSource.addEventListener("unread", onUnread);

    return () => {
      eventSource.removeEventListener("message", onMessage);
      eventSource.removeEventListener("unread", onUnread);
      eventSource.close();
      eventSourceRef.current = null;
    };
  }, [inChatPage, queryClient]);

  useEffect(() => {
    if (!inChatPage) return;

    (async () => {
      await markChatAsRead();
      setUnreadCount(0);
      queryClient.invalidateQueries({ queryKey: chatKeys.messages() });
    })();
  }, [inChatPage, queryClient]);

  const value = useMemo(
    () => ({
      unreadCount,
      refreshUnreadCount,
    }),
    [unreadCount]
  );

  return <ChatRealtimeContext.Provider value={value}>{children}</ChatRealtimeContext.Provider>;
}

export function useChatRealtime() {
  const context = useContext(ChatRealtimeContext);
  if (!context) {
    throw new Error("useChatRealtime must be used within ChatRealtimeProvider");
  }
  return context;
}
