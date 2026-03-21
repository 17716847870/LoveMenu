"use client";

import { useQueryClient } from "@tanstack/react-query";

export function useClearCache() {
  const queryClient = useQueryClient();

  return (queryKey?: string[]) => {
    if (queryKey) {
      queryClient.invalidateQueries({ queryKey });
    } else {
      queryClient.clear();
    }
  };
}

export function usePrefetchData<T = any>() {
  const queryClient = useQueryClient();

  return (queryKey: string[], queryFn: () => Promise<T>) => {
    queryClient.prefetchQuery({
      queryKey,
      queryFn,
    });
  };
}
