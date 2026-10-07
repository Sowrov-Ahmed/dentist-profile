import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { filterBlogPosts, getBlogPosts, getLatestPosts, paginateBlogPosts } from "@/features/blog/blog.service";
import { getServices } from "@/features/services/service.service";
import { BlogSourcePage } from "@/features/source/BlogSourcePage";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Blog",
  description: "Patient-friendly dental education articles about sensitivity, root canal treatment, bleeding gums, prevention, pain, and smile planning.",
  path: "/blog"
});

function firstParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function BlogPage({ searchParams }: { searchParams?: Promise<{ page?: string | string[]; search?: string | string[]; tag?: string | string[] }> }) {
  const params = searchParams ? await searchParams : {};
  const search = firstParam(params.search)?.trim() || undefined;
  const tag = firstParam(params.tag)?.trim() || undefined;
  const requestedPage = Number(firstParam(params.page) || 1);

  const [posts, services] = await Promise.all([getBlogPosts(), getServices()]);
  const latest = getLatestPosts(posts, 3);
  const filteredPosts = filterBlogPosts(posts, { search, tag });
  const pagination = paginateBlogPosts(filteredPosts, requestedPage, 6);

  return <>
    <Breadcrumb title="Blog" current="Blog" sourceTemplate />
    <BlogSourcePage posts={pagination.posts} services={services} latest={latest} pagination={pagination} filters={{ search, tag }} />
  </>;
}
