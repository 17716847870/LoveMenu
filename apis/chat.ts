"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { http } from "@/lib/api";
import { ChatMessage } from "@/types";

export interface SendChatMessageDto {
  type: "text" | "image" | "voice" | "emoji";
  content: string;
}

export const chatKeys = {
  all: ["chat"] as const,
  messages: () => [...chatKeys.all, "messages"] as const,
  unread: () => [...chatKeys.all, "unread"] as const,
};

export function useChatMessages() {
  return useQuery({
    queryKey: chatKeys.messages(),
    queryFn: async (): Promise<ChatMessage[]> => {
      const response = await http.get<ChatMessage[]>("/api/chat");
      return response.data || [];
    },
  });
}

export function useSendChatMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: SendChatMessageDto): Promise<ChatMessage> => {
      const response = await http.post<ChatMessage>("/api/chat", data);
      if (!response.data) {
        throw new Error("发送失败");
      }
      return response.data;
    },
    onMutate: async (newMessage) => {
      await queryClient.cancelQueries({ queryKey: chatKeys.messages() });

      const previousMessages =
        queryClient.getQueryData<ChatMessage[]>(chatKeys.messages()) || [];

      const optimisticMessage: ChatMessage = {
        id: `temp-${Date.now()}`,
        senderId: "self",
        type: newMessage.type,
        content: newMessage.content,
        createdAt: new Date().toISOString(),
        isRead: true,
        isSender: true,
        isPending: true,
      };

      queryClient.setQueryData<ChatMessage[]>(chatKeys.messages(), [
        ...previousMessages,
        optimisticMessage,
      ]);

      return { previousMessages, optimisticMessageId: optimisticMessage.id };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(chatKeys.messages(), context.previousMessages);
      }
    },
    onSuccess: (savedMessage, _variables, context) => {
      queryClient.setQueryData<ChatMessage[]>(
        chatKeys.messages(),
        (current = []) =>
          current.map((msg) =>
            msg.id === context?.optimisticMessageId ? savedMessage : msg
          )
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.messages() });
    },
  });
}

export async function fetchChatUnreadCount() {
  const response = await http.get<{ count: number }>("/api/chat/unread");
  return response.data?.count ?? 0;
}

export async function markChatAsRead() {
  await http.patch("/api/chat");
}
