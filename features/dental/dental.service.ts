import { cache } from "react";
import { apiGet, unwrapApiData } from "@/lib/api/client";
import type { ContactContent, DoctorProfile, FAQ, HomeContent, NavigationItem, SiteConfig, Testimonial } from "@/types/content";

/**
 * The root layout and several page routes request the same resources during a single
 * render pass (for example `/about` needs the doctor profile that the layout already
 * fetched). `cache` memoises per request, so each resource is read once per request
 * instead of once per caller, without changing what any caller receives.
 */
async function loadSiteConfig(): Promise<SiteConfig> {
  return unwrapApiData(await apiGet<SiteConfig>("/site", { next: { revalidate: 3600 } }));
}

async function loadNavigation(): Promise<NavigationItem[]> {
  return unwrapApiData(await apiGet<NavigationItem[]>("/navigation", { next: { revalidate: 3600 } }));
}

async function loadDoctorProfile(): Promise<DoctorProfile> {
  return unwrapApiData(await apiGet<DoctorProfile>("/doctor", { next: { revalidate: 3600 } }));
}

async function loadHomeContent(): Promise<HomeContent> {
  return unwrapApiData(await apiGet<HomeContent>("/home", { next: { revalidate: 3600 } }));
}

async function loadTestimonials(): Promise<Testimonial[]> {
  return unwrapApiData(await apiGet<Testimonial[]>("/testimonials", { next: { revalidate: 3600 } }));
}

async function loadFaqs(): Promise<FAQ[]> {
  return unwrapApiData(await apiGet<FAQ[]>("/faqs", { next: { revalidate: 3600 } }));
}

async function loadContactContent(): Promise<ContactContent> {
  return unwrapApiData(await apiGet<ContactContent>("/contact", { next: { revalidate: 3600 } }));
}

export const getSiteConfig = cache(loadSiteConfig);
export const getNavigation = cache(loadNavigation);
export const getDoctorProfile = cache(loadDoctorProfile);
export const getHomeContent = cache(loadHomeContent);
export const getTestimonials = cache(loadTestimonials);
export const getFaqs = cache(loadFaqs);
export const getContactContent = cache(loadContactContent);