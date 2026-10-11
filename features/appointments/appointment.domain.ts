import type { AppointmentContent, AppointmentConsultationType, AppointmentSubmissionRequest, Chamber, ChamberFees } from "@/types/content";

export type AppointmentPageData = {
  content: AppointmentContent;
  chambers: Chamber[];
  selectedChamber: Chamber | null;
};

/** Field-keyed validation output, shared by every surface that submits an appointment request. */
export type AppointmentFieldErrors = Partial<Record<keyof AppointmentSubmissionRequest, string[]>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[+\d][+\d\s().-]{6,}$/;

/**
 * Local-calendar `YYYY-MM-DD` value for `<input type="date">` `min`.
 * Computed from local parts on purpose: `toISOString()` would roll back a day for anyone
 * east of UTC, which silently blocks today's appointments.
 */
export function todayInputValue(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Single source of truth for appointment validation. `/appointment` and the Home-page
 * appointment section both submit through this, so the two surfaces cannot drift apart
 * and the user always sees the same messages for the same input.
 */
export function validateAppointmentSubmission(payload: AppointmentSubmissionRequest, options: {
  chambers: Chamber[];
  consultationTypeIds: ReadonlyArray<keyof ChamberFees | string>;
  earliestDate: string;
}): AppointmentFieldErrors {
  const { chambers, consultationTypeIds, earliestDate } = options;
  const errors: AppointmentFieldErrors = {};

  if (!payload.chamberId || !chambers.some((chamber) => chamber.id === payload.chamberId)) errors.chamberId = ["Please select a consultation location."];
  if (!payload.consultationType || !consultationTypeIds.includes(payload.consultationType)) errors.consultationType = ["Please select a consultation type."];
  if (!payload.preferredDate) errors.preferredDate = ["Please select a preferred date."];
  else if (payload.preferredDate < earliestDate) errors.preferredDate = ["Please choose today or a future date."];
  if (!payload.fullName || payload.fullName.trim().length < 2) errors.fullName = ["Full name is required."];
  if (!payload.phone || !phonePattern.test(payload.phone.trim())) errors.phone = ["Please enter a valid phone number."];
  if (!payload.email || !emailPattern.test(payload.email.trim())) errors.email = ["Please enter a valid email address."];
  if (!payload.reason || payload.reason.trim().length < 10) errors.reason = ["Please describe the reason in at least 10 characters."];

  return errors;
}

export function getAppointmentConsultationType(content: AppointmentContent, consultationTypeId: keyof ChamberFees | string): AppointmentConsultationType | null {
  return content.consultationTypes.find((item) => item.id === consultationTypeId) || null;
}

export function getAppointmentFee(chamber: Chamber | null | undefined, consultationTypeId: keyof ChamberFees | string | null | undefined): string | null {
  if (!chamber || !consultationTypeId) return null;
  if (!Object.prototype.hasOwnProperty.call(chamber.fees, consultationTypeId)) return null;
  return chamber.fees[consultationTypeId as keyof ChamberFees];
}

export function formatAppointmentFee(value: string | null | undefined): string {
  if (!value) return "Fee unavailable";
  const amount = Number.parseFloat(value);
  if (Number.isNaN(amount)) return value;
  return `৳${new Intl.NumberFormat("en-BD", { maximumFractionDigits: 0 }).format(amount)}`;
}

export function buildAppointmentReasonMessage(reason: string, chamber: Chamber | null, consultationType: AppointmentConsultationType | null): string {
  return [
    chamber ? `Consultation location: ${chamber.name}` : "Consultation location: Not selected",
    consultationType ? `Consultation type: ${consultationType.label}` : "Consultation type: Not selected",
    `Reason: ${reason}`
  ].join("\n");
}
