import siteData from "@/data/site.json";
import navigationData from "@/data/navigation.json";
import doctorData from "@/data/doctor.json";
import homeData from "@/data/home.json";
import servicesData from "@/data/services.json";
import casesData from "@/data/case-studies.json";
import blogData from "@/data/blog-posts.json";
import testimonialsData from "@/data/testimonials.json";
import faqsData from "@/data/faqs.json";
import contactData from "@/data/contact.json";
import chambersData from "@/data/chambers.json";
import appointmentData from "@/data/appointment.json";
import type { ApiResponse } from "@/types/api";
import type { AppointmentContent, BlogPost, CaseStudy, Chamber, ContactContent, DentalService, DoctorProfile, FAQ, HomeContent, NavigationItem, SiteConfig, Testimonial } from "@/types/content";
import { fail, ok } from "./response";

const navigation = navigationData as NavigationItem[];
const site = { ...(siteData as SiteConfig), navigation } as SiteConfig;
const doctor = doctorData as DoctorProfile;
const home = homeData as HomeContent;
const services = servicesData as DentalService[];
const cases = casesData as CaseStudy[];
const blog = blogData as BlogPost[];
const testimonials = testimonialsData as Testimonial[];
const faqs = faqsData as FAQ[];
const contact = contactData as ContactContent;
const chambers = chambersData as Chamber[];
const appointment = appointmentData as AppointmentContent;

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function normalizeEndpoint(endpoint: string): string {
  return endpoint
    .replace(/^https?:\/\/[^/]+/i, "")
    .replace(/^\/?api\/demo\/?/, "")
    .replace(/^\//, "")
    .replace(/\/$/, "");
}

export async function resolveDemoEndpoint<T>(endpoint: string): Promise<ApiResponse<T>> {
  const key = normalizeEndpoint(endpoint);

  if (key === "site") return ok(clone(site)) as ApiResponse<T>;
  if (key === "navigation") return ok(clone(navigation), navigation.length) as ApiResponse<T>;
  if (key === "doctor") return ok(clone(doctor)) as ApiResponse<T>;
  if (key === "home") return ok(clone(home)) as ApiResponse<T>;
  if (key === "services") return ok(clone(services), services.length) as ApiResponse<T>;
  if (key === "case-studies") return ok(clone(cases), cases.length) as ApiResponse<T>;
  if (key === "blog" || key === "blog-posts") return ok(clone(blog), blog.length) as ApiResponse<T>;
  if (key === "testimonials") return ok(clone(testimonials), testimonials.length) as ApiResponse<T>;
  if (key === "faqs") return ok(clone(faqs), faqs.length) as ApiResponse<T>;
  if (key === "contact") return ok(clone(contact)) as ApiResponse<T>;
  if (key === "chambers") return ok(clone(chambers), chambers.length) as ApiResponse<T>;
  if (key === "appointments") return ok(clone(appointment)) as ApiResponse<T>;

  if (key.startsWith("services/")) {
    const slug = key.split("/")[1];
    const item = services.find((service) => service.slug === slug);
    return item ? (ok(clone(item)) as ApiResponse<T>) : fail<T>("NOT_FOUND", "The requested dental service was not found.");
  }

  if (key.startsWith("case-studies/")) {
    const slug = key.split("/")[1];
    const item = cases.find((caseStudy) => caseStudy.slug === slug);
    return item ? (ok(clone(item)) as ApiResponse<T>) : fail<T>("NOT_FOUND", "The requested case study was not found.");
  }

  if (key.startsWith("blog/")) {
    const slug = key.split("/")[1];
    const item = blog.find((post) => post.slug === slug);
    return item ? (ok(clone(item)) as ApiResponse<T>) : fail<T>("NOT_FOUND", "The requested blog article was not found.");
  }

  if (key.startsWith("chambers/")) {
    const slug = key.split("/")[1];
    const item = chambers.find((chamber) => chamber.id === slug);
    return item ? (ok(clone(item)) as ApiResponse<T>) : fail<T>("NOT_FOUND", "The requested chamber was not found.");
  }

  return fail<T>("NOT_FOUND", "The requested demo API endpoint was not found.");
}

export function getAllServiceSlugs(): string[] {
  return services.map((service) => service.slug);
}

export function getAllCaseSlugs(): string[] {
  return cases.map((caseStudy) => caseStudy.slug);
}

export function getAllBlogSlugs(): string[] {
  return blog.map((post) => post.slug);
}

export function getAllChamberIds(): string[] {
  return chambers.map((chamber) => chamber.id);
}
