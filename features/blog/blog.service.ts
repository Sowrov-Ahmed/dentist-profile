import { apiGet, unwrapApiData } from "@/lib/api/client";
import type { BlogPost } from "@/types/content";

export async function getBlogPosts(): Promise<BlogPost[]> {
  return unwrapApiData(await apiGet<BlogPost[]>("/blog", { next: { revalidate: 3600 } }));
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost> {
  return unwrapApiData(await apiGet<BlogPost>(`/blog/${slug}`, { next: { revalidate: 3600 } }));
}

export function getLatestPosts(posts: BlogPost[], limit = 3): BlogPost[] {
  return [...posts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit);
}

export function filterBlogPosts(posts: BlogPost[], filters: { search?: string; tag?: string } = {}): BlogPost[] {
  const search = filters.search?.trim().toLowerCase();
  const tag = filters.tag?.trim().toLowerCase();

  return posts.filter((post) => {
    const matchesTag = tag ? post.tags.some((item) => item.toLowerCase() === tag) : true;
    const matchesSearch = search ? [
      post.title,
      post.excerpt,
      post.category,
      post.author,
      ...post.tags,
      ...post.content.map((block) => `${block.heading} ${block.body}`)
    ].some((value) => value.toLowerCase().includes(search)) : true;

    return matchesTag && matchesSearch;
  });
}

export function paginateBlogPosts(posts: BlogPost[], requestedPage = 1, pageSize = 6) {
  const totalPages = Math.max(1, Math.ceil(posts.length / pageSize));
  const currentPage = Number.isFinite(requestedPage) ? Math.min(Math.max(1, Math.trunc(requestedPage)), totalPages) : 1;
  const start = (currentPage - 1) * pageSize;

  return {
    currentPage,
    totalPages,
    pageSize,
    totalItems: posts.length,
    posts: posts.slice(start, start + pageSize)
  };
}

export function getRelatedPosts(posts: BlogPost[], current: BlogPost, limit = 3): BlogPost[] {
  const currentTags = new Set(current.tags);

  return posts
    .filter((post) => post.slug !== current.slug)
    .map((post) => ({
      post,
      score: (post.category === current.category ? 3 : 0) + post.tags.filter((tag) => currentTags.has(tag)).length
    }))
    .sort((a, b) => b.score - a.score || b.post.date.localeCompare(a.post.date))
    .map(({ post }) => post)
    .slice(0, limit);
}

export function formatPostDate(date: string): string {
  return new Intl.DateTimeFormat("en", { month: "short", day: "2-digit", year: "numeric" }).format(new Date(date));
}
