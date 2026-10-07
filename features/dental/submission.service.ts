import { apiPost, unwrapApiData } from "@/lib/api/client";
import type { AppointmentRequest, AppointmentResponse, NewsletterResponse } from "@/types/content";

export async function submitAppointmentRequest(payload: AppointmentRequest): Promise<AppointmentResponse> {
  return unwrapApiData(await apiPost<AppointmentResponse, Record<string, unknown>>("/contact", {
    name: payload.name,
    email: payload.email,
    phone: payload.phone || "",
    service: payload.service || "",
    preferredDate: payload.preferredDate || "",
    chamberId: payload.chamberId || "",
    chamberName: payload.chamberName || "",
    message: payload.message
  }));
}

export async function submitNewsletterSignup(email: string): Promise<NewsletterResponse> {
  return unwrapApiData(await apiPost<NewsletterResponse, Record<string, unknown>>("/newsletter", { email }));
}
