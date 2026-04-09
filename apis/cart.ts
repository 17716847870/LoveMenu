"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { http } from "@/lib/api";
import { CartItem, Dish } from "@/types";

export type { CartItem };

export const cartKeys = {
  all: ["cart"] as const,
  lists: () => [...cartKeys.all, "list"] as const,
  list: (userId: string) => [...cartKeys.lists(), userId] as const,
};

interface CartItemResponse {
  id: string;
  quantity: number;
  dish: Dish;
}

interface AddToCartParams {
  userId: string;
  dishId: string;
  quantity?: number;
}

interface UpdateCartParams {
  itemId: string;
  quantity: number;
}

export function useCartItems(userId: string) {
  return useQuery({
    queryKey: cartKeys.list(userId),
    queryFn: async (): Promise<CartItemResponse[]> => {
      const response = await http.get<CartItemResponse[]>("/api/cart", {
        params: { userId },
      });
      return response.data || [];
    },
    enabled: !!userId,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, dishId, quantity = 1 }: AddToCartParams) => {
      const response = await http.post<{
        success: boolean;
        data: CartItemResponse;
      }>("/api/cart", { userId, dishId, quantity });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: cartKeys.list(variables.userId),
      });
    },
  });
}

export function useUpdateCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ itemId, quantity }: UpdateCartParams) => {
      const response = await http.put<{
        success: boolean;
        data: CartItemResponse | null;
      }>("/api/cart", { itemId, quantity });
      return response.data;
    },
    onMutate: async ({ itemId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: cartKeys.all });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
}

export function useRemoveFromCart(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId: string) => {
      await http.delete("/api/cart", { params: { itemId } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.list(userId) });
    },
  });
}

export function useClearCart(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await http.delete("/api/cart", { params: { userId } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.list(userId) });
    },
  });
}
