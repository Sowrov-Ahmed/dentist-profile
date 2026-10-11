import { ErrorState } from "@/components/ui/ErrorState";
import { PageHero } from "@/components/ui/PageHero";
import { ChambersPage } from "@/features/chambers/ChambersPage";
import { getChambers, getPrimaryChamber } from "@/features/chambers/chambers.service";
import { getPageHero } from "@/features/hero/pageHero.service";
import { loadAsync } from "@/lib/api/load";
import { createPageMetadata } from "@/lib/seo/metadata";
import type { PageHeroContent } from "@/types/content";

export const metadata = createPageMetadata({
  title: "Chambers",
  description: "View dental specialist consultation chambers with locations, visiting schedules, direct contact numbers, consultation fees, and map links.",
  path: "/chambers"
});

const fallbackHero: PageHeroContent = {
  eyebrow: "Chamber directory",
  title: "Available consultation chambers",
  description: "Review schedule, direct contact, fee details, and map access for each chamber before requesting an appointment."
};

export default async function ChambersRoutePage() {
  const result = await loadAsync(() => Promise.all([getChambers(), getPageHero("chambers", fallbackHero)]));

  if (!result.ok) {
    return (
      <>
        <PageHero {...fallbackHero} />
        <ErrorState title="Chambers could not be loaded" message={result.error.message} />
      </>
    );
  }

  const [chambers, hero] = result.data;
  const primaryChamber = getPrimaryChamber(chambers);

  return <ChambersPage hero={hero} chambers={chambers} primaryChamber={primaryChamber} />;
}