import type { AppointmentContent, Chamber } from "@/types/content";
import { AppointmentRequestForm } from "../components/AppointmentRequestForm";

export function AppointmentRequestSection({ content, chambers, selectedChamber }: { content: AppointmentContent; chambers: Chamber[]; selectedChamber: Chamber | null }) {
  // The page section sat on flat white directly beneath a near-white hero, so the two blocks
  // read as one undivided slab. The site already alternates white / `--soft-green` sections
  // (see `.home-service`, `.home-case`), so the content band now settles into that same soft
  // tint, easing down from the hero's tone instead of cutting to it. The `!` modifiers are
  // required: the frozen rules in globals.css are authored after `@tailwind utilities` and so
  // would otherwise win on equal specificity.
  return <section
    className="source-appointment-page !bg-[linear-gradient(180deg,#f8fcfc_0%,var(--soft-green)_38%)] !py-14 lg:!py-24"
    aria-label="Appointment request"
  >
    <div className="source-page-container">
      <AppointmentRequestForm content={content} chambers={chambers} selectedChamber={selectedChamber} />
    </div>
  </section>;
}
