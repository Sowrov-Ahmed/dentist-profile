import type { ApiResponse } from "@/types/api";

const requestId = () => `demo_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;

export function ok<T>(data: T, count?: number): ApiResponse<T> {
  return {
    success: true,
    data,
    error: null,
    meta: {
      requestId: requestId(),
      generatedAt: new Date().toISOString(),
      source: "demo-json",
      ...(typeof count === "number" ? { count } : {})
    }
  };
}

export function fail<T = never>(code: string, message: string, details?: Record<string, string[]>): ApiResponse<T> {
  return {
    success: false,
    data: null,
    error: { code, message, ...(details ? { details } : {}) },
    meta: {
      requestId: requestId(),
      generatedAt: new Date().toISOString(),
      source: "demo-json"
    }
  };
}
