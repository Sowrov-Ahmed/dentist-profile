import type { Metadata } from "next";
import type { ReactNode } from "react";
import "swiper/css";
import "./globals.css";
import { BackToTop } from "@/components/ui/BackToTop";
import { MotionProvider } from "@/components/ui/MotionProvider";
import { Preloader } from "@/components/ui/Preloader";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { getChambers, getPrimaryChamber } from "@/features/chambers/chambers.service";
import { getDoctorProfile, getSiteConfig } from "@/features/dental/dental.service";
import { getServices } from "@/features/services/service.service";
import { createPageMetadata, personJsonLd } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Dr. Nadia Karim - Personal Dental Specialist Website",
  description: "A professional personal website for an individual dental specialist with services, case studies, blog articles, and appointment request flow."
});

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const [site, doctor, services, chambers] = await Promise.all([getSiteConfig(), getDoctorProfile(), getServices(), getChambers()]);
  const primaryChamber = getPrimaryChamber(chambers);

  return (
    <html lang="en">
      <body>
        <MotionProvider>
          <Preloader />
          <Header site={site} doctor={doctor} />
          <main>{children}</main>
          <Footer site={site} doctor={doctor} services={services} primaryChamber={primaryChamber} />
          <BackToTop />
        </MotionProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd(primaryChamber)) }} />
      </body>
    </html>
  );
}
