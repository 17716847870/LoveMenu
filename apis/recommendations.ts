"use client";

import { useQuery } from "@tanstack/react-query";
import { http } from "@/lib/api";
import { Dish } from "@/types";

export interface RecommendationItem extends Dish {
  reason: string;
  score: number;
}

export const recommendationKeys = {
  all: ["recommendations"] as const,
  list: () => [...recommendationKeys.all, "list"] as const,
};

export function useRecommendations() {
  return useQuery({
    queryKey: recommendationKeys.list(),
    queryFn: async (): Promise<RecommendationItem[]> => {
      const response = await http.get<RecommendationItem[]>(
        "/api/recommendations"
      );
      return response.data || [];
    },
  });
}
