import { apiGet, apiPost } from "@/lib/api/client";
import type { ApiResponse } from "@/types/api";
import type { AppointmentContent, AppointmentSubmissionRequest, AppointmentSubmissionResponse } from "@/types/content";

export function fetchAppointmentContent(): Promise<ApiResponse<AppointmentContent>> {
  return apiGet<AppointmentContent>("/appointments", { next: { revalidate: 3600 } });
}

export function createAppointmentRequest(payload: AppointmentSubmissionRequest): Promise<ApiResponse<AppointmentSubmissionResponse>> {
  return apiPost<AppointmentSubmissionResponse, Record<string, unknown>>("/appointments", {
    chamberId: payload.chamberId,
    consultationType: payload.consultationType,
    preferredDate: payload.preferredDate,
    fullName: payload.fullName,
    phone: payload.phone,
    email: payload.email,
    reason: payload.reason
  });
}
