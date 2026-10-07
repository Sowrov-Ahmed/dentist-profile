import { apiGet, unwrapApiData } from "@/lib/api/client";
import type { ContactContent, DoctorProfile, FAQ, HomeContent, NavigationItem, SiteConfig, Testimonial } from "@/types/content";

export async function getSiteConfig(): Promise<SiteConfig> {
  return unwrapApiData(await apiGet<SiteConfig>("/site", { next: { revalidate: 3600 } }));
}

export async function getNavigation(): Promise<NavigationItem[]> {
  return unwrapApiData(await apiGet<NavigationItem[]>("/navigation", { next: { revalidate: 3600 } }));
}

export async function getDoctorProfile(): Promise<DoctorProfile> {
  return unwrapApiData(await apiGet<DoctorProfile>("/doctor", { next: { revalidate: 3600 } }));
}

export async function getHomeContent(): Promise<HomeContent> {
  return unwrapApiData(await apiGet<HomeContent>("/home", { next: { revalidate: 3600 } }));
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return unwrapApiData(await apiGet<Testimonial[]>("/testimonials", { next: { revalidate: 3600 } }));
}

export async function getFaqs(): Promise<FAQ[]> {
  return unwrapApiData(await apiGet<FAQ[]>("/faqs", { next: { revalidate: 3600 } }));
}

export async function getContactContent(): Promise<ContactContent> {
  return unwrapApiData(await apiGet<ContactContent>("/contact", { next: { revalidate: 3600 } }));
}
