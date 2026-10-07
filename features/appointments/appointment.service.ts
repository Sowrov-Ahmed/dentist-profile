import { unwrapApiData } from "@/lib/api/client";
import { getChamberBySlugFromList, getChambers } from "@/features/chambers/chambers.service";
import type { AppointmentSubmissionRequest, AppointmentSubmissionResponse } from "@/types/content";
import { createAppointmentRequest, fetchAppointmentContent } from "./appointment.api";
import type { AppointmentPageData } from "./appointment.domain";

export async function getAppointmentPageData(chamberSlug?: string | null): Promise<AppointmentPageData> {
  const [content, chambers] = await Promise.all([
    unwrapApiData(await fetchAppointmentContent()),
    getChambers()
  ]);
  const selectedChamber = getChamberBySlugFromList(chambers, chamberSlug);

  return { content, chambers, selectedChamber };
}

export async function submitAppointmentRequest(payload: AppointmentSubmissionRequest): Promise<AppointmentSubmissionResponse> {
  return unwrapApiData(await createAppointmentRequest(payload));
}
