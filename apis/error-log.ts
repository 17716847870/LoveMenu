import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface ErrorLog {
  id: string;
  source: "api" | "frontend";
  level: "error" | "warn";
  scope?: string | null;
  path?: string | null;
  method?: string | null;
  message: string;
  stack?: string | null;
  url?: string | null;
  userAgent?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
}

export interface ErrorLogQuery {
  source?: "api" | "frontend";
  keyword?: string;
  limit?: number;
}

async function fetchJSON<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "请求失败");
  return (json.data ?? json) as T;
}

function buildQuery(query: ErrorLogQuery) {
  const params = new URLSearchParams();
  if (query.source) params.set("source", query.source);
  if (query.keyword?.trim()) params.set("keyword", query.keyword.trim());
  if (query.limit) params.set("limit", String(query.limit));
  const value = params.toString();
  return value ? `?${value}` : "";
}

export const errorLogKeys = {
  all: ["error-logs"] as const,
  list: (query: ErrorLogQuery) =>
    [
      "error-logs",
      query.source ?? "all",
      query.keyword ?? "",
      query.limit ?? 100,
    ] as const,
};

export function useErrorLogs(query: ErrorLogQuery) {
  const queryString = buildQuery(query);
  return useQuery({
    queryKey: errorLogKeys.list(query),
    queryFn: () => fetchJSON<ErrorLog[]>(`/api/error-logs${queryString}`),
    refetchInterval: 30000,
  });
}

export function useDeleteErrorLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      fetchJSON<{ success: true }>(
        `/api/error-logs?id=${encodeURIComponent(id)}`,
        { method: "DELETE" }
      ),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: errorLogKeys.all }),
  });
}

export function useClearErrorLogs() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (query: ErrorLogQuery) =>
      fetchJSON<{ success: true }>(`/api/error-logs${buildQuery(query)}`, {
        method: "DELETE",
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: errorLogKeys.all }),
  });
}
