import type { ApiResponse } from "@/types/api";
import { ApiClientError } from "@/types/api";
import { buildApiUrl, getApiBaseUrl, isDemoApiBase } from "./config";
import { resolveDemoEndpoint } from "./demo-repository";

type FetchOptions = RequestInit & {
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
};

export async function apiGet<T>(endpoint: string, options: FetchOptions = {}): Promise<ApiResponse<T>> {
  const base = getApiBaseUrl();

  // Server Components use the same service API without needing an active HTTP server at build time.
  // Browser/client requests still go through /api/demo exactly as they will go through a future Laravel API.
  if (typeof window === "undefined" && isDemoApiBase(base)) {
    return resolveDemoEndpoint<T>(endpoint);
  }

  const response = await fetch(buildApiUrl(endpoint, base), {
    ...options,
    method: "GET",
    headers: {
      Accept: "application/json",
      ...(options.headers || {})
    }
  });

  return parseApiResponse<T>(response);
}

export async function apiPost<TResponse, TBody extends Record<string, unknown>>(
  endpoint: string,
  body: TBody,
  options: FetchOptions = {}
): Promise<ApiResponse<TResponse>> {
  const response = await fetch(buildApiUrl(endpoint), {
    ...options,
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    body: JSON.stringify(body)
  });

  return parseApiResponse<TResponse>(response);
}

async function parseApiResponse<T>(response: Response): Promise<ApiResponse<T>> {
  let payload: ApiResponse<T> | null = null;

  try {
    payload = (await response.json()) as ApiResponse<T>;
  } catch {
    throw new ApiClientError("The API returned an invalid JSON response.", {
      code: "INVALID_JSON",
      status: response.status
    });
  }

  if (!response.ok || !payload.success) {
    throw new ApiClientError(payload.error?.message || "The API request failed.", {
      code: payload.error?.code || "API_ERROR",
      status: response.status,
      details: payload.error?.details
    });
  }

  return payload;
}

export function unwrapApiData<T>(response: ApiResponse<T>): T {
  if (!response.success || response.data === null) {
    throw new ApiClientError(response.error?.message || "The requested data is unavailable.", {
      code: response.error?.code || "EMPTY_RESPONSE",
      details: response.error?.details
    });
  }

  return response.data;
}
