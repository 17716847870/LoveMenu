"use client";

import { useQuery } from "@tanstack/react-query";
import { http } from "@/lib/api";

export interface HomeMoodData {
  mood: string;
  craving: string;
}

export const homeKeys = {
  all: ["home"] as const,
  mood: () => [...homeKeys.all, "mood"] as const,
};

export function useHomeMood() {
  return useQuery({
    queryKey: homeKeys.mood(),
    queryFn: async (): Promise<HomeMoodData> => {
      const response = await http.get<HomeMoodData>("/api/home/mood");
      return response.data || { mood: "", craving: "" };
    },
  });
}
