/**
 * Default API base. The application ships its own JSON-backed API under `/api`,
 * so the site is fully functional without any external service.
 *
 * Point `NEXT_PUBLIC_API_BASE_URL` at a remote backend (for example the Laravel
 * API) and every service call is routed there instead, with no code changes.
 */
const DEFAULT_API_BASE = "/api";

export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || DEFAULT_API_BASE;
}

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";
}

/**
 * Reports whether the configured base is the application's own bundled API.
 *
 * When it is, Server Components resolve content directly from the bundled data
 * set instead of issuing an HTTP request, so static rendering does not depend on
 * a running server. An external base (absolute URL, or any other path) always
 * goes over HTTP, exactly as it will once the Laravel backend is connected.
 */
export function isLocalApiBase(base = getApiBaseUrl()): boolean {
  const trimmed = base.replace(/\/$/, "");
  return trimmed === DEFAULT_API_BASE || trimmed === "" || trimmed === DEFAULT_API_BASE.replace(/^\//, "");
}

export function buildApiUrl(endpoint: string, base = getApiBaseUrl()): string {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  if (/^https?:\/\//i.test(base)) {
    return new URL(`${base.replace(/\/$/, "")}${cleanEndpoint}`, base).toString();
  }

  const relativePath = `${base.replace(/\/$/, "")}${cleanEndpoint}`;

  if (typeof window === "undefined") {
    return new URL(relativePath, getSiteUrl()).toString();
  }

  return relativePath;
}