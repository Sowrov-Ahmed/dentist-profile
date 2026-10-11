import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { getBlogPostBySlug, getBlogPosts, getRelatedPosts } from "@/features/blog/blog.service";
import { getBlogDetailHero } from "@/features/hero/pageHero.service";
import { getServices } from "@/features/services/service.service";
import { BlogDetailsSourceDental } from "@/features/source/BlogDetailsSourceDental";
import { createPageMetadata } from "@/lib/seo/metadata";
import type { BlogPost } from "@/types/content";

export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const post = await getBlogPostBySlug(slug);
    return createPageMetadata({ title: post.title, description: post.excerpt, path: `/blog/${post.slug}`, image: post.detailImage });
  } catch {
    return createPageMetadata({ title: "Blog Article Not Found", path: `/blog/${slug}` });
  }
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let post: BlogPost;
  try { post = await getBlogPostBySlug(slug); } catch { notFound(); }

  const [posts, services, hero] = await Promise.all([
    getBlogPosts(),
    getServices(),
    getBlogDetailHero(post)
  ]);
  const relatedPosts = getRelatedPosts(posts, post, 3);

  return <>
    <PageHero {...hero} />
    <BlogDetailsSourceDental post={post} services={services} relatedPosts={relatedPosts} />
  </>;
}
