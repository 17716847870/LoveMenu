"use client";

export interface ApiRequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

export interface ApiResponse<T = any> {
  data: T | null;
  message?: string;
  code?: number;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function api<T = any>(
  endpoint: string,
  config: ApiRequestConfig = {}
): Promise<ApiResponse<T>> {
  const { params, ...fetchConfig } = config;

  let url = endpoint;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(url, {
      ...fetchConfig,
      headers: {
        ...defaultHeaders,
        ...fetchConfig.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.message || "请求失败",
        response.status,
        data.code
      );
    }

    return {
      data: data.data ?? null,
      message: data.message,
      code: data.code,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : "网络错误",
      0
    );
  }
}

export const http = {
  get: <T = any>(endpoint: string, config?: ApiRequestConfig) =>
    api<T>(endpoint, { ...config, method: "GET" }),

  post: <T = any>(endpoint: string, data?: any, config?: ApiRequestConfig) =>
    api<T>(endpoint, {
      ...config,
      method: "POST",
      body: JSON.stringify(data),
    }),

  put: <T = any>(endpoint: string, data?: any, config?: ApiRequestConfig) =>
    api<T>(endpoint, {
      ...config,
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: <T = any>(endpoint: string, config?: ApiRequestConfig) =>
    api<T>(endpoint, { ...config, method: "DELETE" }),

  patch: <T = any>(endpoint: string, data?: any, config?: ApiRequestConfig) =>
    api<T>(endpoint, {
      ...config,
      method: "PATCH",
      body: JSON.stringify(data),
    }),
};
