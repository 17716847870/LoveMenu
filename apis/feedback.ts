"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { http } from "@/lib/api";
import { Feedback } from "@/types";

export const feedbackKeys = {
  all: ["feedback"] as const,
  lists: () => [...feedbackKeys.all, "list"] as const,
  list: (params?: Record<string, string | number | boolean>) =>
    [...feedbackKeys.lists(), params] as const,
  details: () => [...feedbackKeys.all, "detail"] as const,
  detail: (id: string) => [...feedbackKeys.details(), id] as const,
};

export function useFeedbacks(status?: string) {
  return useQuery({
    queryKey: feedbackKeys.list(status ? { status } : undefined),
    queryFn: async (): Promise<Feedback[]> => {
      const response = await http.get<Feedback[]>("/api/feedback", {
        params: status ? { status } : undefined,
      });
      return response.data || [];
    },
  });
}

export function useCreateFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      type: Feedback["type"];
      title: string;
      content: string;
      image?: string;
    }) => {
      const response = await http.post<Feedback>("/api/feedback", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: feedbackKeys.all });
    },
  });
}

export function useUpdateFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Partial<Feedback>) => {
      const response = await http.patch<Feedback>(`/api/feedback/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: feedbackKeys.all });
      queryClient.invalidateQueries({
        queryKey: feedbackKeys.detail(variables.id),
      });
    },
  });
}

export function useDeleteFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await http.delete(`/api/feedback/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: feedbackKeys.all });
    },
  });
}
