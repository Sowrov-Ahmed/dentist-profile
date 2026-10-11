import type { Metadata } from "next";
import type { ReactNode } from "react";
import "swiper/css";
import "./globals.css";
import { BackToTop } from "@/components/ui/BackToTop";
import { MotionProvider } from "@/components/ui/MotionProvider";
import { Preloader } from "@/components/ui/Preloader";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ErrorState } from "@/components/ui/ErrorState";
import { getChambers, getPrimaryChamber } from "@/features/chambers/chambers.service";
import { getDoctorProfile, getSiteConfig } from "@/features/dental/dental.service";
import { getServices } from "@/features/services/service.service";
import { loadAsync } from "@/lib/api/load";
import { createPageMetadata, personJsonLd } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Dr. Nadia Karim - Personal Dental Specialist Website",
  description: "A professional personal website for an individual dental specialist with services, case studies, blog articles, and appointment request flow."
});

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  /**
   * The shell data is awaited by the root layout, so an unreachable or failing API used
   * to reject here. A throw from the root layout is not caught by `app/error.tsx` (which
   * only wraps the route segment) nor by `app/global-error.tsx`, so Next.js answered with
   * a bare, empty document — the blank page visitors reported. Rendering a recovery
   * screen keeps a valid document with a retry affordance instead.
   */
  const shell = await loadAsync(() => Promise.all([getSiteConfig(), getDoctorProfile(), getServices(), getChambers()]));

  if (!shell.ok) {
    return (
      <html lang="en">
        <body>
          <section className="error-page" role="alert">
            <ErrorState title="This site could not be loaded" message={shell.error.message} />
          </section>
        </body>
      </html>
    );
  }

  const [site, doctor, services, chambers] = shell.data;
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