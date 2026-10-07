import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import type { Chamber, ChamberSchedule } from "@/types/content";
import { getChamberAppointmentHref, getChamberPhoneHref } from "../chambers.service";
import { ChamberConsultationControl } from "./ChamberConsultationControl";

function getScheduleRows(chamber: Chamber): ChamberSchedule[] {
  return [
    { days: chamber.days, hours: chamber.hours },
    ...chamber.additionalSchedule
  ];
}

export function ChamberCard({ chamber, index }: { chamber: Chamber; index: number }) {
  const appointmentHref = getChamberAppointmentHref(chamber);
  const phoneHref = getChamberPhoneHref(chamber.phone);
  const scheduleRows = getScheduleRows(chamber);
  const titleId = `chamber-${chamber.id}-title`;
  const scheduleTitleId = `chamber-${chamber.id}-schedule-title`;

  return <article className="source-chamber-card" data-primary={chamber.primary ? "true" : undefined} data-reveal="up" aria-labelledby={titleId} style={{ transitionDelay: `${0.18 + Math.min(index, 3) * 0.08}s` }}>
    <header className="source-chamber-card-header">
      <div className="source-chamber-card-heading">
        <h2 id={titleId}>{chamber.name}</h2>
        <p className="source-chamber-address"><Icon name="pin" size={16} /> <span>{chamber.address}</span></p>
      </div>
      <span className="source-chamber-tag">{chamber.tag}</span>
    </header>

    <section className="source-chamber-schedule" aria-labelledby={scheduleTitleId}>
      <h3 id={scheduleTitleId} className="source-chamber-section-title">Schedule</h3>
      <div className="source-chamber-schedule-grid" role="list">
        <div className="source-chamber-schedule-head" aria-hidden="true">
          <span>Days</span>
          <span>Hours</span>
          <span>Phone</span>
        </div>
        {scheduleRows.map((schedule) => <div className="source-chamber-schedule-row" role="listitem" key={`${schedule.days}-${schedule.hours}`}>
          <div className="source-chamber-schedule-cell" aria-label={`Days: ${schedule.days}`}>
            <span className="source-chamber-mobile-label">Days</span>
            <span>{schedule.days}</span>
          </div>
          <div className="source-chamber-schedule-cell" aria-label={`Hours: ${schedule.hours}`}>
            <span className="source-chamber-mobile-label">Hours</span>
            <span>{schedule.hours}</span>
          </div>
          <div className="source-chamber-schedule-cell source-chamber-phone-cell" aria-label={`Phone: ${chamber.phone}`}>
            <span className="source-chamber-mobile-label">Phone</span>
            <a href={phoneHref} aria-label={`Call ${chamber.name} at ${chamber.phone}`}>{chamber.phone}</a>
          </div>
        </div>)}
      </div>
    </section>

    <ChamberConsultationControl chamberId={chamber.id} chamberName={chamber.name} fees={chamber.fees} perPatientTime={chamber.perPatientTime} />

    <div className="source-chamber-actions">
      <Link className="source-chamber-appointment" href={appointmentHref} aria-label={`Request an appointment at ${chamber.name}`}>Request appointment</Link>
      <a className="source-chamber-map" href={chamber.mapUrl} target="_blank" rel="noopener noreferrer" aria-label={`View location for ${chamber.name}`}><Icon name="mapLocation" size={17} /> <span>Map</span></a>
    </div>
  </article>;
}
