import type { ChamberFees } from "@/types/content";
import {
  CHAMBER_CONSULTATION_TYPES,
  formatChamberFee,
  formatPerPatientTime,
  getChamberConsultationFee,
  getDefaultChamberConsultationKey
} from "../chambers.domain";

type ChamberConsultationControlProps = {
  chamberId: string;
  chamberName: string;
  fees: ChamberFees;
  perPatientTime: number;
};

export function ChamberConsultationControl({ chamberId, chamberName, fees, perPatientTime }: ChamberConsultationControlProps) {
  const controlId = `chamber-${chamberId}-consultation-type`;
  const durationId = `chamber-${chamberId}-per-patient-time`;

  return <section className="source-chamber-consultation" aria-label={`Consultation details for ${chamberName}`}>
    <div className="source-chamber-consultation-row">
      <div className="source-chamber-consultation-selector">
        <label htmlFor={controlId}>Consultation type:</label>
        <div className="source-chamber-select-wrap">
          <select
            id={controlId}
            name={`${chamberId}-consultation-type`}
            defaultValue={getDefaultChamberConsultationKey()}
            aria-describedby={durationId}
          >
            {CHAMBER_CONSULTATION_TYPES.map((item) => {
              const fee = getChamberConsultationFee({ fees }, item.key);
              const optionLabel = `${item.label} · ${formatChamberFee(fee)}`;
              return <option key={item.key} value={item.key}>{optionLabel}</option>;
            })}
          </select>
        </div>
      </div>
      <p className="source-chamber-per-patient" id={durationId}><span>Per patient:</span> <strong>{formatPerPatientTime(perPatientTime).replace(" / patient", "")}</strong></p>
    </div>
  </section>;
}
