import { PageHero } from "@/components/ui/PageHero";
import { CaseStudySourcePage } from "@/features/source/CaseStudySourcePage";
import { getCaseStudies, paginateCaseStudies } from "@/features/cases/case.service";
import { getPageHero } from "@/features/hero/pageHero.service";
import { createPageMetadata } from "@/lib/seo/metadata";
import type { PageHeroContent } from "@/types/content";

export const metadata = createPageMetadata({
  title: "Case Study",
  description: "Dental care planning case studies for smile design, endodontic assessment, gum health, urgent pain review, and restorative decision-making.",
  path: "/case-studies"
});

const fallbackHero: PageHeroContent = {
  eyebrow: "Case Study",
  title: "Real decisions, documented from consultation to review.",
  description: "Browse documented treatment journeys showing how findings, options, and outcomes were reasoned through case by case."
};

function firstParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function CaseStudyPage({ searchParams }: { searchParams?: Promise<{ page?: string | string[] }> }) {
  const params = searchParams ? await searchParams : {};
  const requestedPage = Number(firstParam(params.page) || 1);
  const [cases, hero] = await Promise.all([
    getCaseStudies(),
    getPageHero("caseStudies", fallbackHero)
  ]);
  const pagination = paginateCaseStudies(cases, requestedPage, 6);

  return <>
    <PageHero {...hero} />
    <CaseStudySourcePage cases={pagination.cases} pagination={pagination} />
  </>;
}
