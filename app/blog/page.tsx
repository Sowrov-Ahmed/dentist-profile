import { PageHero } from "@/components/ui/PageHero";
import { filterBlogPosts, getBlogPosts, getLatestPosts, paginateBlogPosts } from "@/features/blog/blog.service";
import { getPageHero } from "@/features/hero/pageHero.service";
import { getServices } from "@/features/services/service.service";
import { BlogSourcePage } from "@/features/source/BlogSourcePage";
import { createPageMetadata } from "@/lib/seo/metadata";
import type { PageHeroContent } from "@/types/content";

export const metadata = createPageMetadata({
  title: "Blog",
  description: "Patient-friendly dental education articles about sensitivity, root canal treatment, bleeding gums, prevention, pain, and smile planning.",
  path: "/blog"
});

const fallbackHero: PageHeroContent = {
  eyebrow: "Blog & News",
  title: "Practical dental guidance you can actually use.",
  description: "Read clear, patient-friendly articles on symptoms, treatment options, and day-to-day oral care."
};

function firstParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function BlogPage({ searchParams }: { searchParams?: Promise<{ page?: string | string[]; search?: string | string[]; tag?: string | string[] }> }) {
  const params = searchParams ? await searchParams : {};
  const search = firstParam(params.search)?.trim() || undefined;
  const tag = firstParam(params.tag)?.trim() || undefined;
  const requestedPage = Number(firstParam(params.page) || 1);

  const [posts, services, hero] = await Promise.all([
    getBlogPosts(),
    getServices(),
    getPageHero("blog", fallbackHero)
  ]);
  const latest = getLatestPosts(posts, 3);
  const filteredPosts = filterBlogPosts(posts, { search, tag });
  const pagination = paginateBlogPosts(filteredPosts, requestedPage, 6);

  return <>
    <PageHero {...hero} />
    <BlogSourcePage posts={pagination.posts} services={services} latest={latest} pagination={pagination} filters={{ search, tag }} />
  </>;
}
