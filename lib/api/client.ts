import type { ApiResponse } from "@/types/api";
import { ApiClientError } from "@/types/api";
import { buildApiUrl, getApiBaseUrl, isLocalApiBase } from "./config";
import { resolveContentEndpoint } from "./content-source";

type FetchOptions = RequestInit & {
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
};

/**
 * Guards every upstream request with a hard ceiling. Without it a request that never
 * settles (socket held open by a proxy, a Laravel route that hangs, a dropped upstream)
 * keeps its Suspense boundary pending forever, so the visitor is pinned on the loading
 * state indefinitely. Converting the hang into a rejected request lets each page render
 * its own error state instead. This is a failure-detection limit, not an artificial delay.
 */
export const API_REQUEST_TIMEOUT_MS = 10_000;

function createTimeoutSignal(timeoutMs: number, externalSignal?: AbortSignal | null) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(new Error("API_REQUEST_TIMEOUT")), timeoutMs);

  const onExternalAbort = () => controller.abort(externalSignal?.reason);
  if (externalSignal) {
    if (externalSignal.aborted) onExternalAbort();
    else externalSignal.addEventListener("abort", onExternalAbort, { once: true });
  }

  return {
    signal: controller.signal,
    release() {
      clearTimeout(timer);
      externalSignal?.removeEventListener("abort", onExternalAbort);
    }
  };
}

async function requestWithTimeout(input: RequestInfo | URL, init: RequestInit, externalSignal?: AbortSignal | null) {
  const timeout = createTimeoutSignal(API_REQUEST_TIMEOUT_MS, externalSignal);

  try {
    return await fetch(input, { ...init, signal: timeout.signal });
  } catch (error) {
    if (timeout.signal.aborted && !externalSignal?.aborted) {
      throw new ApiClientError("The API did not respond in time.", { code: "API_TIMEOUT" });
    }

    throw error;
  } finally {
    timeout.release();
  }
}

export async function apiGet<T>(endpoint: string, options: FetchOptions = {}): Promise<ApiResponse<T>> {
  const base = getApiBaseUrl();

  // Server Components use the same service API without needing an active HTTP server at build time:
  // when the bundled API is in use they read it directly. Browser/client requests still go over HTTP
  // to the configured base, which is where an external Laravel API would sit.
  if (typeof window === "undefined" && isLocalApiBase(base)) {
    return resolveContentEndpoint<T>(endpoint);
  }

  const response = await requestWithTimeout(
    buildApiUrl(endpoint, base),
    {
      ...options,
      method: "GET",
      headers: {
        Accept: "application/json",
        ...(options.headers || {})
      }
    },
    options.signal
  );

  return parseApiResponse<T>(response);
}

export async function apiPost<TResponse, TBody extends Record<string, unknown>>(
  endpoint: string,
  body: TBody,
  options: FetchOptions = {}
): Promise<ApiResponse<TResponse>> {
  const response = await requestWithTimeout(
    buildApiUrl(endpoint),
    {
      ...options,
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(options.headers || {})
      },
      body: JSON.stringify(body)
    },
    options.signal
  );

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
