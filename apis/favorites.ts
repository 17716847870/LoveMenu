"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { http } from "@/lib/api";

export interface DishFavorite {
  id: string;
  userId: string;
  dishId: string;
  createdAt: string;
}

export const favoriteKeys = {
  all: ["favorites"] as const,
  list: (userId: string) => [...favoriteKeys.all, userId] as const,
};

export function useFavorites(userId?: string) {
  return useQuery({
    queryKey: favoriteKeys.list(userId || "guest"),
    queryFn: async (): Promise<DishFavorite[]> => {
      if (!userId) return [];
      const response = await http.get<DishFavorite[]>("/api/favorites", {
        params: { userId },
      });
      return response.data || [];
    },
    enabled: !!userId,
  });
}

export function useAddFavorite(userId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dishId: string) => {
      if (!userId) {
        throw new Error("未登录，无法收藏");
      }
      const response = await http.post<DishFavorite>("/api/favorites", {
        userId,
        dishId,
      });
      return response.data;
    },
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: favoriteKeys.list(userId) });
      }
    },
  });
}

export function useRemoveFavorite(userId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dishId: string) => {
      if (!userId) {
        throw new Error("未登录，无法取消收藏");
      }
      await http.delete("/api/favorites", {
        params: { userId, dishId },
      });
      return dishId;
    },
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: favoriteKeys.list(userId) });
      }
    },
  });
}
