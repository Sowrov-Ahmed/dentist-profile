import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { ServiceDetailsSourceDental } from "@/features/source/ServiceDetailsSourceDental";
import { getServiceDetailHero } from "@/features/hero/pageHero.service";
import { getRelatedServices, getServiceBySlug, getServices } from "@/features/services/service.service";
import { createPageMetadata } from "@/lib/seo/metadata";
import type { DentalService } from "@/types/content";

export const dynamicParams = false;

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const service = await getServiceBySlug(slug);
    return createPageMetadata({ title: service.title, description: service.summary, path: `/services/${service.slug}`, image: service.detailImage });
  } catch {
    return createPageMetadata({ title: "Service Not Found", path: `/services/${slug}` });
  }
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let service: DentalService;
  try {
    service = await getServiceBySlug(slug);
  } catch {
    notFound();
  }

  const [services, hero] = await Promise.all([
    getServices(),
    getServiceDetailHero(service)
  ]);
  const relatedServices = getRelatedServices(services, service, services.length);

  return <>
    <PageHero {...hero} />
    <ServiceDetailsSourceDental service={service} relatedServices={relatedServices} />
  </>;
}
