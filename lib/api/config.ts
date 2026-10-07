const DEFAULT_API_BASE = "/api/demo";

export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || DEFAULT_API_BASE;
}

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";
}

export function isDemoApiBase(base = getApiBaseUrl()): boolean {
  return base.replace(/\/$/, "").endsWith("/api/demo") || base.replace(/\/$/, "") === "api/demo" || base === "/api/demo";
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
