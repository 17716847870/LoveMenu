import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Anniversary {
  id: string;
  title: string;
  calendarType: 'solar' | 'lunar';
  month: number;
  day: number;
  weekday?: number | null;
  repeatType: 'once' | 'weekly' | 'monthly' | 'quarterly' | 'halfyear' | 'yearly';
  advanceDays: number;
  emailTo: string;
  emailSubject: string;
  emailContent: string;
  status: 'active' | 'paused' | 'done';
  nextRemindAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AnniversaryLog {
  id: string;
  anniversaryId: string;
  sentAt: string;
  emailTo: string;
  status: 'success' | 'failed';
  error?: string | null;
}

const BASE = '/api/anniversaries';

async function fetchJSON<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || '请求失败');
  return json.data as T;
}

export const anniversaryKeys = {
  all: ['anniversaries'] as const,
  detail: (id: string) => ['anniversaries', id] as const,
  logs: (id: string) => ['anniversaries', id, 'logs'] as const,
};

export function useAnniversaries() {
  return useQuery({
    queryKey: anniversaryKeys.all,
    queryFn: () => fetchJSON<Anniversary[]>(BASE),
  });
}

export function useAnniversary(id: string) {
  return useQuery({
    queryKey: anniversaryKeys.detail(id),
    queryFn: () => fetchJSON<Anniversary & { logs: AnniversaryLog[] }>(`${BASE}/${id}`),
    enabled: !!id,
  });
}

export function useCreateAnniversary() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Anniversary, 'id' | 'status' | 'nextRemindAt' | 'createdAt' | 'updatedAt'>) =>
      fetchJSON<Anniversary>(BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: anniversaryKeys.all }),
  });
}

export function useUpdateAnniversary() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Anniversary> }) =>
      fetchJSON<Anniversary>(`${BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    onSuccess: (_r, { id }) => {
      qc.invalidateQueries({ queryKey: anniversaryKeys.all });
      qc.invalidateQueries({ queryKey: anniversaryKeys.detail(id) });
    },
  });
}

export function useDeleteAnniversary() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      fetch(`${BASE}/${id}`, { method: 'DELETE' }).then(r => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: anniversaryKeys.all }),
  });
}
