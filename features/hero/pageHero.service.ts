import { cache } from "react";
import { apiGet, unwrapApiData } from "@/lib/api/client";
import type { BlogPost, CaseStudy, DentalService, PageHeroContent, PageHeroKey, PageHeroMap } from "@/types/content";

/**
 * One hero copy source for every route, read through the same
 * `UI → Feature → API client/service → API → Content Source` chain as the rest of the site.
 * Memoised per request so ten routes resolving heroes in one pass read the resource once.
 */
async function loadPageHeroes(): Promise<PageHeroMap> {
  return unwrapApiData(await apiGet<PageHeroMap>("/page-heroes", { next: { revalidate: 3600 } }));
}

export const getPageHeroes = cache(loadPageHeroes);

/**
 * Returns the stored hero for a route. A key with no stored copy still renders: the page
 * label is used as the heading so a missing record degrades to a plain title instead of
 * an empty hero.
 */
export async function getPageHero(key: PageHeroKey, fallback: PageHeroContent): Promise<PageHeroContent> {
  const heroes = await getPageHeroes();
  return heroes[key] ?? fallback;
}

function nonEmpty(value: string | undefined | null): string | null {
  const trimmed = typeof value === "string" ? value.trim() : "";
  return trimmed.length > 0 ? trimmed : null;
}

/**
 * Detail-page heroes lead with the record's own fields rather than a generic placeholder.
 * The stored copy supplies the eyebrow and the fallback text used when a record field is
 * missing, so the hierarchy stays eyebrow → record title → record summary.
 */
export async function getServiceDetailHero(service: DentalService): Promise<PageHeroContent> {
  const base = await getPageHero("serviceDetail", {
    eyebrow: "Treatment Detail",
    title: service.tabTitle || service.title,
    description: service.summary
  });

  return {
    ...base,
    title: nonEmpty(service.title) ?? base.title,
    description: nonEmpty(service.summary) ?? nonEmpty(service.description) ?? base.description
  };
}

export async function getCaseStudyDetailHero(item: CaseStudy): Promise<PageHeroContent> {
  const base = await getPageHero("caseStudyDetail", {
    eyebrow: "Case Study",
    title: item.shortTitle || item.title,
    description: item.summary
  });

  return {
    ...base,
    // `label` is the record's own category (Endodontics, Restorative, ...), so each case
    // detail opens under the discipline it belongs to instead of a shared static eyebrow.
    eyebrow: nonEmpty(item.label) ?? base.eyebrow,
    title: nonEmpty(item.title) ?? base.title,
    description: nonEmpty(item.summary) ?? nonEmpty(item.challenge) ?? base.description
  };
}

export async function getBlogDetailHero(post: BlogPost): Promise<PageHeroContent> {
  const base = await getPageHero("blogDetail", {
    eyebrow: post.category,
    title: post.title,
    description: post.excerpt
  });

  return {
    ...base,
    eyebrow: nonEmpty(post.category) ?? base.eyebrow,
    title: nonEmpty(post.title) ?? base.title,
    description: nonEmpty(post.excerpt) ?? base.description
  };
}