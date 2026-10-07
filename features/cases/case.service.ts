import { apiGet, unwrapApiData } from "@/lib/api/client";
import type { CaseStudy, DentalService } from "@/types/content";

export async function getCaseStudies(): Promise<CaseStudy[]> {
  return unwrapApiData(await apiGet<CaseStudy[]>("/case-studies", { next: { revalidate: 3600 } }));
}

export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy> {
  return unwrapApiData(await apiGet<CaseStudy>(`/case-studies/${slug}`, { next: { revalidate: 3600 } }));
}

export function getFeaturedCases(cases: CaseStudy[], limit = 3): CaseStudy[] {
  return cases.slice(0, limit);
}

export function paginateCaseStudies(cases: CaseStudy[], requestedPage = 1, pageSize = 6) {
  const totalPages = Math.max(1, Math.ceil(cases.length / pageSize));
  const currentPage = Number.isFinite(requestedPage) ? Math.min(Math.max(1, Math.trunc(requestedPage)), totalPages) : 1;
  const start = (currentPage - 1) * pageSize;

  return {
    currentPage,
    totalPages,
    pageSize,
    totalItems: cases.length,
    previousPage: currentPage > 1 ? currentPage - 1 : null,
    nextPage: currentPage < totalPages ? currentPage + 1 : null,
    cases: cases.slice(start, start + pageSize)
  };
}

export function getRelatedCaseServices(services: DentalService[], caseStudy: CaseStudy, limit = 4): DentalService[] {
  const bySlug = new Map(services.map((service) => [service.slug, service]));
  const related = caseStudy.relatedServiceSlugs.map((slug) => bySlug.get(slug)).filter((service): service is DentalService => Boolean(service));
  const fallback = services.filter((service) => !caseStudy.relatedServiceSlugs.includes(service.slug));

  return [...related, ...fallback].slice(0, limit);
}

export function getRelatedCaseStudies(cases: CaseStudy[], current: CaseStudy | string, limit = 3): CaseStudy[] {
  const currentCase = typeof current === "string" ? cases.find((caseStudy) => caseStudy.slug === current) : current;
  const currentSlug = typeof current === "string" ? current : current.slug;
  const relatedSlugs = currentCase?.relatedCaseSlugs || [];
  const bySlug = new Map(cases.map((caseStudy) => [caseStudy.slug, caseStudy]));
  const related = relatedSlugs.map((slug) => bySlug.get(slug)).filter((caseStudy): caseStudy is CaseStudy => Boolean(caseStudy));
  const sameCategory = cases.filter((caseStudy) => caseStudy.slug !== currentSlug && caseStudy.label === currentCase?.label && !relatedSlugs.includes(caseStudy.slug));
  const fallback = cases.filter((caseStudy) => caseStudy.slug !== currentSlug && caseStudy.label !== currentCase?.label && !relatedSlugs.includes(caseStudy.slug));

  return [...related, ...sameCategory, ...fallback].slice(0, limit);
}
