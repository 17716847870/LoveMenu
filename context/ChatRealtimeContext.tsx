"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { chatKeys, fetchChatUnreadCount, markChatAsRead } from "@/apis/chat";
import { useUser } from "@/context/UserContext";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import { CHAT_REALTIME_CHANNEL } from "@/lib/supabase-server";

type ChatRealtimeContextValue = {
  unreadCount: number;
  refreshUnreadCount: () => Promise<void>;
};

const ChatRealtimeContext = createContext<ChatRealtimeContextValue | undefined>(undefined);

const CHAT_PATHS = ["/chat", "/admin/chat"];
const CHAT_FALLBACK_POLL_INTERVAL = 3000;

export function ChatRealtimeProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { user } = useUser();
  const [unreadCount, setUnreadCount] = useState(0);

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
    if (!user?.id) return;
    refreshUnreadCount();
  }, [user?.id]);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!user?.id) return;

    if (!supabase) {
      if (process.env.NODE_ENV !== "production") {
        console.info("[chat] using polling fallback (Supabase Realtime unavailable)");
      }

      const timer = setInterval(async () => {
        await refreshUnreadCount();
        queryClient.invalidateQueries({ queryKey: chatKeys.messages() });
      }, CHAT_FALLBACK_POLL_INTERVAL);

      return () => clearInterval(timer);
    }

    if (process.env.NODE_ENV !== "production") {
      console.info("[chat] using Supabase Realtime broadcast");
    }

    const channel = supabase
      .channel(CHAT_REALTIME_CHANNEL)
      .on("broadcast", { event: "message" }, async ({ payload }) => {
        queryClient.invalidateQueries({ queryKey: chatKeys.messages() });

        const unreadByUser = Array.isArray((payload as { unreadByUser?: unknown[] })?.unreadByUser)
          ? ((payload as { unreadByUser: Array<{ userId: string; unreadCount: number }> }).unreadByUser)
          : [];

        const unreadEntry = unreadByUser.find((item) => item.userId === user.id);

        if (inChatPage) {
          await markChatAsRead();
          setUnreadCount(0);
        } else if (unreadEntry) {
          setUnreadCount(unreadEntry.unreadCount);
        } else {
          await refreshUnreadCount();
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [inChatPage, queryClient, user?.id]);

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
