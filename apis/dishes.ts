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

export interface DishQueryParams {
  search?: string;
  categoryId?: string;
  status?: string;
  sortBy?: "createdAt" | "popularity" | "price";
  sortOrder?: "asc" | "desc";
}

export const dishKeys = {
  all: ["dishes"] as const,
  lists: () => [...dishKeys.all, "list"] as const,
  list: (params?: DishQueryParams) => [...dishKeys.lists(), params] as const,
  details: () => [...dishKeys.all, "detail"] as const,
  detail: (id: string) => [...dishKeys.details(), id] as const,
  byCategory: (categoryId: string) =>
    [...dishKeys.lists(), "category", categoryId] as const,
};

export function useDishes(params?: DishQueryParams) {
  const cleanParams = params
    ? Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== undefined)
      )
    : undefined;

  console.log("useDishes - params:", params, "cleanParams:", cleanParams);

  return useQuery({
    queryKey: dishKeys.list(params),
    queryFn: async (): Promise<Dish[]> => {
      console.log("useDishes queryFn - calling API with params:", cleanParams);
      const response = await http.get<Dish[]>("/api/dishes", {
        params: cleanParams as Record<string, string | number | boolean>,
      });
      console.log(
        "useDishes queryFn - received data count:",
        response.data?.length
      );
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
      console.log("useCreateDish 发送的数据:", data);
      const response = await http.post<Dish>("/api/dishes", data);
      console.log("useCreateDish 接收的响应:", response);
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
      console.log("useUpdateDish 发送的数据:", { id, data });
      const response = await http.put<Dish>(`/api/dishes/${id}`, data);
      console.log("useUpdateDish 接收的响应:", response);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: dishKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: dishKeys.detail(variables.id),
      });
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
