import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/api/config";
import type { Chamber } from "@/types/content";

const defaultDescription =
  "Professional personal dental specialist website for preventive care, restorative dentistry, root canal consultation, smile design, case studies, and patient education.";

export function absoluteUrl(path = "/"): string {
  const siteUrl = getSiteUrl().replace(/\/$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${cleanPath}`;
}

export function createPageMetadata({
  title,
  description = defaultDescription,
  path = "/",
  image = "/assets/images/common/banner-BG-h2.jpg"
}: {
  title: string;
  description?: string;
  path?: string;
  image?: string;
}): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "Dr. Nadia Karim Dental Specialist",
      images: [{ url: absoluteUrl(image), width: 1200, height: 630, alt: title }],
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl(image)]
    }
  };
}

export function personJsonLd(primaryChamber?: Pick<Chamber, "address" | "phone"> | null) {
  return {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: "Dr. Nadia Karim",
    description: defaultDescription,
    url: absoluteUrl("/"),
    image: absoluteUrl("/assets/images/doctor/banner-img-h2.png"),
    telephone: primaryChamber?.phone || "+880 1712-000000",
    address: primaryChamber ? {
      "@type": "PostalAddress",
      streetAddress: primaryChamber.address,
      addressCountry: "BD"
    } : undefined,
    medicalSpecialty: ["Preventive Dentistry", "Endodontics", "Restorative Dentistry", "Cosmetic Dentistry"]
  };
}
