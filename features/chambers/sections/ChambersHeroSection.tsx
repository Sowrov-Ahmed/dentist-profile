import { PageHero } from "@/components/ui/PageHero";
import type { Chamber, PageHeroContent } from "@/types/content";

export function ChambersHeroSection({ hero, chamberCount, primaryChamber }: { hero: PageHeroContent; chamberCount: number; primaryChamber: Chamber | null }) {
  return (
    <PageHero
      {...hero}
      headingId="chambers-hero-title"
      meta={
        <div className="flex flex-wrap gap-2.5" aria-label="Chambers overview">
          <span className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-bold text-white">
            {chamberCount} consultation {chamberCount === 1 ? "option" : "options"}
          </span>
          {primaryChamber ? (
            <span className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-bold text-white">
              Primary: {primaryChamber.name}
            </span>
          ) : null}
        </div>
      }
    />
  );
}