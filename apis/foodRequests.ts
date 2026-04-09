"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { http } from "@/lib/api";
import { FoodRequest } from "@/types";

export type { FoodRequest };

export const foodRequestKeys = {
  all: ["foodRequests"] as const,
  lists: () => [...foodRequestKeys.all, "list"] as const,
  list: (params?: Record<string, string | number | boolean>) =>
    [...foodRequestKeys.lists(), params] as const,
  details: () => [...foodRequestKeys.all, "detail"] as const,
  detail: (id: string) => [...foodRequestKeys.details(), id] as const,
};

export function useFoodRequests(status?: string) {
  return useQuery({
    queryKey: foodRequestKeys.list(status ? { status } : undefined),
    queryFn: async (): Promise<FoodRequest[]> => {
      const params = status ? { status } : undefined;
      const response = await http.get<FoodRequest[]>("/api/requests", {
        params,
      });
      return response.data || [];
    },
  });
}

export function useFoodRequest(id: string) {
  return useQuery({
    queryKey: foodRequestKeys.detail(id),
    queryFn: async (): Promise<FoodRequest> => {
      const response = await http.get<FoodRequest>(`/api/requests/${id}`);
      if (!response.data) {
        throw new Error("请求不存在");
      }
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateFoodRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      description?: string;
      image?: string;
    }) => {
      const response = await http.post<FoodRequest>("/api/requests", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: foodRequestKeys.all });
    },
  });
}

export function useUpdateFoodRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: {
      id: string;
      status?: string;
      description?: string;
    }) => {
      const response = await http.patch<FoodRequest>(
        `/api/requests/${id}`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: foodRequestKeys.all });
    },
  });
}
