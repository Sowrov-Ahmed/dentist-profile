import { PageHero } from "@/components/ui/PageHero";
import { ServiceSourcePage } from "@/features/source/ServiceSourcePage";
import { getBlogPosts } from "@/features/blog/blog.service";
import { getDoctorProfile, getHomeContent, getTestimonials } from "@/features/dental/dental.service";
import { getPageHero } from "@/features/hero/pageHero.service";
import { getAppointmentPageData } from "@/features/appointments/appointment.service";
import { getServices } from "@/features/services/service.service";
import { createPageMetadata } from "@/lib/seo/metadata";
import type { PageHeroContent } from "@/types/content";

export const metadata = createPageMetadata({
  title: "Dental Services",
  description: "Browse preventive dentistry, root canal consultation, restorative care, smile design, gum care, and urgent dental pain review services.",
  path: "/services"
});

const fallbackHero: PageHeroContent = {
  eyebrow: "Services & Procedures",
  title: "A clear treatment pathway for every stage of care.",
  description: "Explore the doctor's verified services and clinical scope below."
};

export default async function ServicePage() {
  // The appointment section is the same component `/` renders, so it resolves the same typed
  // data through the same service. `getAppointmentPageData()` is request-cached and reuses the
  // already-memoised chamber fetch, and it reads the existing `/appointments` endpoint -
  // no second API, no second JSON source, and nothing imported into the UI.
  const [doctor, services, testimonials, posts, home, appointmentData, hero] = await Promise.all([
    getDoctorProfile(),
    getServices(),
    getTestimonials(),
    getBlogPosts(),
    getHomeContent(),
    getAppointmentPageData(),
    getPageHero("services", fallbackHero)
  ]);

  return (
    <>
      <PageHero {...hero} />
      <ServiceSourcePage doctor={doctor} services={services} testimonials={testimonials} posts={posts} appointment={home.appointment} appointmentContent={appointmentData.content} chambers={appointmentData.chambers} testimonialTitle={home.testimonialTitle} />
    </>
  );
}