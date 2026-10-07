import type { AppointmentContent, AppointmentConsultationType, Chamber, ChamberFees } from "@/types/content";

export type AppointmentPageData = {
  content: AppointmentContent;
  chambers: Chamber[];
  selectedChamber: Chamber | null;
};

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
