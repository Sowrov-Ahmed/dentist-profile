import { apiGet } from "@/lib/api/client";
import type { ApiResponse } from "@/types/api";
import type { Chamber } from "@/types/content";

export function fetchChambers(): Promise<ApiResponse<Chamber[]>> {
  return apiGet<Chamber[]>("/chambers", { next: { revalidate: 3600 } });
}

export function fetchChamberById(id: string): Promise<ApiResponse<Chamber>> {
  return apiGet<Chamber>(`/chambers/${id}`, { next: { revalidate: 3600 } });
}
