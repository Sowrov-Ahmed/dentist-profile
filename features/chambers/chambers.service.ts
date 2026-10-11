import { cache } from "react";
import { unwrapApiData } from "@/lib/api/client";
import type { Chamber } from "@/types/content";
import { fetchChamberById, fetchChambers } from "./chambers.api";

/** Memoised per request: the layout, `/chambers`, `/contact` and `/appointment` all need the list. */
async function loadChambers(): Promise<Chamber[]> {
  return sortChambersByPriority(unwrapApiData(await fetchChambers()));
}

async function loadChamberById(id: string): Promise<Chamber> {
  return unwrapApiData(await fetchChamberById(id));
}

export const getChambers = cache(loadChambers);
export const getChamberById = cache(loadChamberById);

export function sortChambersByPriority(chambers: Chamber[]): Chamber[] {
  return [...chambers].sort((a, b) => Number(b.primary) - Number(a.primary) || a.name.localeCompare(b.name));
}

export function getPrimaryChamber(chambers: Chamber[]): Chamber | null {
  return chambers.find((chamber) => chamber.primary) || chambers[0] || null;
}

export function getChamberBySlugFromList(chambers: Chamber[], slug?: string | null): Chamber | null {
  if (!slug) return null;
  return chambers.find((chamber) => getChamberSlug(chamber) === slug) || null;
}

export function getChamberSlug(chamber: Chamber): string {
  return chamber.id;
}

export function getChamberAppointmentHref(chamber: Chamber): string {
  return `/appointment?chamber=${encodeURIComponent(getChamberSlug(chamber))}`;
}

export function getChamberPhoneHref(phone: string): string {
  return `tel:${phone.replace(/\s/g, "")}`;
}