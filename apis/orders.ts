"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { http } from "@/lib/api";
import { Dish } from "@/types";

export interface OrderItem {
  id: string;
  quantity: number;
  note?: string;
  dish: Dish;
}

export interface Order {
  id: string;
  userId: string;
  status: "pending" | "preparing" | "completed" | "cancelled";
  totalKiss: number;
  totalHug: number;
  note?: string;
  reason?: string;
  isEmergency: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  items: OrderItem[];
  memory?: {
    text: string;
    image?: string[];
  };
}

export const orderKeys = {
  all: ["orders"] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  list: (params?: Record<string, string | number | boolean>) =>
    [...orderKeys.lists(), params] as const,
  details: () => [...orderKeys.all, "detail"] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
};

export function useOrders(params?: Record<string, string | number | boolean>) {
  const cleanParams = params
    ? Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== undefined)
      )
    : undefined;

  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: async (): Promise<Order[]> => {
      const response = await http.get<Order[]>("/api/orders", {
        params: cleanParams,
      });
      return response.data || [];
    },
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: async (): Promise<Order> => {
      const response = await http.get<Order>(`/api/orders/${id}`);
      if (!response.data) {
        throw new Error("订单不存在");
      }
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      userId: string;
      items: { dishId: string; quantity: number; note?: string }[];
      totalKiss: number;
      totalHug: number;
      note?: string;
      reason?: string;
      isEmergency?: boolean;
    }) => {
      const response = await http.post<Order>("/api/orders", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}

export function useUpdateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: {
      id: string;
      status?: Order["status"];
      note?: string;
    }) => {
      const response = await http.put<Order>(`/api/orders/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}
