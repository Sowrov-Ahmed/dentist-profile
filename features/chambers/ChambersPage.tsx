import type { Chamber } from "@/types/content";
import { ScopedRevealGuard } from "@/features/source/ScopedRevealGuard";
import { ChambersHeroSection } from "./sections/ChambersHeroSection";
import { ChambersIntroSection } from "./sections/ChambersIntroSection";
import { ChambersListSection } from "./sections/ChambersListSection";

export function ChambersPage({ chambers, primaryChamber }: { chambers: Chamber[]; primaryChamber: Chamber | null }) {
  const revealWatchKey = ["chambers", chambers.length, primaryChamber?.id || "none", chambers.map((chamber) => chamber.id).join("|")].join(":");

  return <div data-chambers-page-scope>
    <ScopedRevealGuard scopeSelector="[data-chambers-page-scope]" watchKey={revealWatchKey} />
    <ChambersHeroSection chamberCount={chambers.length} primaryChamber={primaryChamber} />
    <ChambersIntroSection chamberCount={chambers.length} primaryChamber={primaryChamber} />
    <ChambersListSection chambers={chambers} />
  </div>;
}
