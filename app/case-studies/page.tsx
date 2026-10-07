import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { CaseStudySourcePage } from "@/features/source/CaseStudySourcePage";
import { getCaseStudies, paginateCaseStudies } from "@/features/cases/case.service";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Case Study",
  description: "Dental care planning case studies for smile design, endodontic assessment, gum health, urgent pain review, and restorative decision-making.",
  path: "/case-studies"
});

function firstParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function CaseStudyPage({ searchParams }: { searchParams?: Promise<{ page?: string | string[] }> }) {
  const params = searchParams ? await searchParams : {};
  const requestedPage = Number(firstParam(params.page) || 1);
  const cases = await getCaseStudies();
  const pagination = paginateCaseStudies(cases, requestedPage, 6);

  return <>
    <Breadcrumb title="Case Study" current="Case Study" sourceTemplate />
    <CaseStudySourcePage cases={pagination.cases} pagination={pagination} />
  </>;
}
