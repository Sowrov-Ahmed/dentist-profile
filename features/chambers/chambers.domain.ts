import type { Chamber, ChamberFees } from "@/types/content";

export type ChamberConsultationKey = keyof ChamberFees;

export const CHAMBER_CONSULTATION_TYPES: ReadonlyArray<{ key: ChamberConsultationKey; label: string }> = [
  { key: "new_patient", label: "New appointment" },
  { key: "follow_up", label: "Follow-up" },
  { key: "telemedicine", label: "Telemedicine" },
  { key: "report_review", label: "Report review" }
];

export function getDefaultChamberConsultationKey(): ChamberConsultationKey {
  return CHAMBER_CONSULTATION_TYPES[0].key;
}

export function getChamberConsultationFee(chamber: Pick<Chamber, "fees">, consultationType: ChamberConsultationKey): string {
  return chamber.fees[consultationType];
}

export function formatChamberFee(value: string): string {
  const amount = Number.parseFloat(value);
  if (Number.isNaN(amount)) return value;
  return `৳${new Intl.NumberFormat("en-BD", { maximumFractionDigits: 0 }).format(amount)}`;
}

export function formatPerPatientTime(minutes: number): string {
  if (!Number.isFinite(minutes) || minutes <= 0) return "Duration unavailable";
  return `${minutes} min / patient`;
}
