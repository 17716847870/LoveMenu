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
  const wsRef = useRef<WebSocket | null>(null);

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
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let closedByCleanup = false;

    const connect = async () => {
      try {
        await fetch("/api/chat/stream", { method: "GET" });
      } catch {
        // ignore
      }

      const protocol = window.location.protocol === "https:" ? "wss" : "ws";
      const wsPort = process.env.NEXT_PUBLIC_CHAT_WS_PORT || "3001";
      const wsUrl = `${protocol}://${window.location.hostname}:${wsPort}/chat`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onmessage = async (event) => {
        try {
          const parsed = JSON.parse(event.data) as {
            event?: string;
            payload?: { isSender?: boolean; count?: number };
          };

          if (parsed.event === "message") {
            queryClient.invalidateQueries({ queryKey: chatKeys.messages() });

            if (parsed.payload?.isSender) {
              return;
            }

            if (inChatPage) {
              await markChatAsRead();
              setUnreadCount(0);
            } else {
              setUnreadCount((prev) => prev + 1);
            }
          }

          if (parsed.event === "unread" && typeof parsed.payload?.count === "number") {
            setUnreadCount(parsed.payload.count);
          }
        } catch {
          // ignore
        }
      };

      ws.onclose = () => {
        wsRef.current = null;
        if (!closedByCleanup) {
          reconnectTimer = setTimeout(connect, 1000);
        }
      };
    };

    connect();

    return () => {
      closedByCleanup = true;
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }
      wsRef.current?.close();
      wsRef.current = null;
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
