import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { CaseStudyDetailsSourceDental } from "@/features/source/CaseStudyDetailsSourceDental";
import { getCaseStudies, getCaseStudyBySlug, getRelatedCaseServices, getRelatedCaseStudies } from "@/features/cases/case.service";
import { getServices } from "@/features/services/service.service";
import { createPageMetadata } from "@/lib/seo/metadata";
import type { CaseStudy } from "@/types/content";

export const dynamicParams = false;

export async function generateStaticParams() {
  const cases = await getCaseStudies();
  return cases.map((caseStudy) => ({ slug: caseStudy.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const item = await getCaseStudyBySlug(slug);
    return createPageMetadata({ title: item.title, description: item.summary, path: `/case-studies/${item.slug}`, image: item.detailImage });
  } catch {
    return createPageMetadata({ title: "Case Study Not Found", path: `/case-studies/${slug}` });
  }
}

export default async function CaseStudyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let item: CaseStudy;
  try {
    item = await getCaseStudyBySlug(slug);
  } catch {
    notFound();
  }

  const [cases, services] = await Promise.all([getCaseStudies(), getServices()]);
  const relatedServices = getRelatedCaseServices(services, item, services.length);
  const relatedCases = getRelatedCaseStudies(cases, item, 3);

  return <>
    <Breadcrumb title="Case Study" current={item.title} sourceTemplate />
    <CaseStudyDetailsSourceDental item={item} relatedServices={relatedServices} relatedCases={relatedCases} />
  </>;
}
