import { Breadcrumb } from "@/components/ui/Breadcrumb";
import type { AppointmentContent, Chamber } from "@/types/content";

export function AppointmentHeroSection({ content, selectedChamber }: { content: AppointmentContent; selectedChamber: Chamber | null }) {
  return <>
    <Breadcrumb title="Appointment" current="Appointment" sourceTemplate />
    <section className="source-appointment-hero" aria-labelledby="appointment-page-title">
      <div className="source-page-container">
        <p className="source-chambers-eyebrow">{content.eyebrow}</p>
        <h1 id="appointment-page-title">{content.title}</h1>
        <p>{content.description}</p>
        {selectedChamber ? <div className="source-appointment-selected-note" role="status">Selected chamber: <strong>{selectedChamber.name}</strong></div> : null}
      </div>
    </section>
  </>;
}
