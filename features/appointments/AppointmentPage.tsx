import type { AppointmentContent, Chamber, PageHeroContent } from "@/types/content";
import { ScopedRevealGuard } from "@/features/source/ScopedRevealGuard";
import { AppointmentHeroSection } from "./sections/AppointmentHeroSection";
import { AppointmentRequestSection } from "./sections/AppointmentRequestSection";

export function AppointmentPage({ hero, content, chambers, selectedChamber }: { hero: PageHeroContent; content: AppointmentContent; chambers: Chamber[]; selectedChamber: Chamber | null }) {
  const revealWatchKey = [
    "appointment",
    selectedChamber?.id || "none",
    chambers.map((chamber) => chamber.id).join("|"),
    content.consultationTypes.map((item) => item.id).join("|")
  ].join(":");

  return <div data-appointment-page-scope>
    <ScopedRevealGuard scopeSelector="[data-appointment-page-scope]" watchKey={revealWatchKey} />
    <AppointmentHeroSection hero={hero} selectedChamber={selectedChamber} />
    <AppointmentRequestSection content={content} chambers={chambers} selectedChamber={selectedChamber} />
  </div>;
}
