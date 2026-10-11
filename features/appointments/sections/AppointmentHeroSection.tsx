import { PageHero } from "@/components/ui/PageHero";
import type { Chamber, PageHeroContent } from "@/types/content";

export function AppointmentHeroSection({ hero, selectedChamber }: { hero: PageHeroContent; selectedChamber: Chamber | null }) {
  return (
    <PageHero
      {...hero}
      headingId="appointment-page-title"
      meta={
        selectedChamber ? (
          <p role="status" className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-4 py-2.5 text-sm text-white">
            Selected chamber: <strong className="ml-1 font-bold">{selectedChamber.name}</strong>
          </p>
        ) : null
      }
    />
  );
}