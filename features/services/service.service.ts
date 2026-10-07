import { apiGet, unwrapApiData } from "@/lib/api/client";
import type { DentalService } from "@/types/content";

export async function getServices(): Promise<DentalService[]> {
  return unwrapApiData(await apiGet<DentalService[]>("/services", { next: { revalidate: 3600 } }));
}

export async function getServiceBySlug(slug: string): Promise<DentalService> {
  return unwrapApiData(await apiGet<DentalService>(`/services/${slug}`, { next: { revalidate: 3600 } }));
}

export function getFeaturedServices(services: DentalService[], limit = 5): DentalService[] {
  return services.slice(0, limit);
}

export function getRelatedServices(services: DentalService[], current: DentalService | string, limit = 4): DentalService[] {
  const currentService = typeof current === "string" ? services.find((service) => service.slug === current) : current;
  const currentSlug = typeof current === "string" ? current : current.slug;
  const relatedSlugs = currentService?.relatedSlugs || [];
  const bySlug = new Map(services.map((service) => [service.slug, service]));
  const related = relatedSlugs.map((slug) => bySlug.get(slug)).filter((service): service is DentalService => Boolean(service));
  const fallback = services.filter((service) => service.slug !== currentSlug && !relatedSlugs.includes(service.slug));

  return [currentService, ...related, ...fallback].filter((service): service is DentalService => Boolean(service)).slice(0, limit);
}
