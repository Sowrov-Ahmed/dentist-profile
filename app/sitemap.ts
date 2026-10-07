import type { MetadataRoute } from "next";
import { getBlogPosts } from "@/features/blog/blog.service";
import { getCaseStudies } from "@/features/cases/case.service";
import { getServices } from "@/features/services/service.service";
import { absoluteUrl } from "@/lib/seo/metadata";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, cases, posts] = await Promise.all([getServices(), getCaseStudies(), getBlogPosts()]);
  const staticRoutes = ["/", "/about", "/services", "/case-studies", "/blog", "/chambers", "/appointment", "/contact"];

  return [
    ...staticRoutes.map((path) => ({ url: absoluteUrl(path), lastModified: new Date(), changeFrequency: "weekly" as const, priority: path === "/" ? 1 : 0.8 })),
    ...services.map((service) => ({ url: absoluteUrl(`/services/${service.slug}`), lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 })),
    ...cases.map((item) => ({ url: absoluteUrl(`/case-studies/${item.slug}`), lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...posts.map((post) => ({ url: absoluteUrl(`/blog/${post.slug}`), lastModified: new Date(post.date), changeFrequency: "monthly" as const, priority: 0.6 }))
  ];
}
