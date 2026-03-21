"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { http } from "@/lib/api";
import { Dish } from "@/types";

export interface CreateDishDto {
  name: string;
  image?: string;
  kissPrice: number;
  hugPrice: number;
  categoryId: string;
  description?: string;
  popularity?: number;
  allowCook?: boolean;
  allowRestaurant?: boolean;
}

export interface UpdateDishDto {
  name?: string;
  image?: string;
  kissPrice?: number;
  hugPrice?: number;
  categoryId?: string;
  description?: string;
  popularity?: number;
  allowCook?: boolean;
  allowRestaurant?: boolean;
}

export const dishKeys = {
  all: ["dishes"] as const,
  lists: () => [...dishKeys.all, "list"] as const,
  list: () => [...dishKeys.lists()] as const,
  details: () => [...dishKeys.all, "detail"] as const,
  detail: (id: string) => [...dishKeys.details(), id] as const,
  byCategory: (categoryId: string) => [...dishKeys.lists(), "category", categoryId] as const,
};

export function useDishes() {
  return useQuery({
    queryKey: dishKeys.list(),
    queryFn: async (): Promise<Dish[]> => {
      const response = await http.get<Dish[]>("/api/dishes");
      return response.data || [];
    },
  });
}

export function useDish(id: string) {
  return useQuery({
    queryKey: dishKeys.detail(id),
    queryFn: async (): Promise<Dish> => {
      const response = await http.get<Dish>(`/api/dishes/${id}`);
      if (!response.data) {
        throw new Error("菜品不存在");
      }
      return response.data;
    },
    enabled: !!id,
  });
}

export function useDishesByCategory(categoryId: string) {
  return useQuery({
    queryKey: dishKeys.byCategory(categoryId),
    queryFn: async (): Promise<Dish[]> => {
      const response = await http.get<Dish[]>("/api/dishes", {
        params: { categoryId },
      });
      return response.data || [];
    },
    enabled: !!categoryId,
  });
}

export function useCreateDish() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateDishDto) => {
      const response = await http.post<Dish>("/api/dishes", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dishKeys.lists() });
    },
  });
}

export function useUpdateDish() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateDishDto }) => {
      const response = await http.put<Dish>(`/api/dishes/${id}`, data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: dishKeys.lists() });
      queryClient.invalidateQueries({ queryKey: dishKeys.detail(variables.id) });
    },
  });
}

export function useDeleteDish() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await http.delete(`/api/dishes/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dishKeys.lists() });
    },
  });
}
