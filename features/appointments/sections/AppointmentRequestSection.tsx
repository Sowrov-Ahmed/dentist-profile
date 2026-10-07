import type { AppointmentContent, Chamber } from "@/types/content";
import { AppointmentRequestForm } from "../components/AppointmentRequestForm";

export function AppointmentRequestSection({ content, chambers, selectedChamber }: { content: AppointmentContent; chambers: Chamber[]; selectedChamber: Chamber | null }) {
  return <section className="source-appointment-page" aria-label="Appointment request">
    <div className="source-page-container">
      <AppointmentRequestForm content={content} chambers={chambers} selectedChamber={selectedChamber} />
    </div>
  </section>;
}
