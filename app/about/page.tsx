import { ErrorState } from "@/components/ui/ErrorState";
import { PageHero } from "@/components/ui/PageHero";
import { AboutSourcePage } from "@/features/source/AboutSourcePage";
import { getBlogPosts } from "@/features/blog/blog.service";
import { getDoctorProfile, getHomeContent, getTestimonials } from "@/features/dental/dental.service";
import { getPageHero } from "@/features/hero/pageHero.service";
import { getServices } from "@/features/services/service.service";
import { loadAsync } from "@/lib/api/load";
import { createPageMetadata } from "@/lib/seo/metadata";
import type { PageHeroContent } from "@/types/content";

export const metadata = createPageMetadata({
  title: "About Dr. Nadia Karim",
  description: "Learn about the personal dental specialist approach, patient communication values, preventive focus, and treatment planning philosophy.",
  path: "/about"
});

const fallbackHero: PageHeroContent = {
  eyebrow: "Meet The Specialist",
  title: "A calm, explanation-first dental practice.",
  description: "Get to know the specialist behind the chair and the philosophy that shapes every treatment plan."
};

export default async function AboutPage() {
  const result = await loadAsync(() => Promise.all([
    getDoctorProfile(),
    getHomeContent(),
    getServices(),
    getTestimonials(),
    getBlogPosts(),
    getPageHero("about", fallbackHero)
  ]));

  if (!result.ok) {
    return (
      <>
        <PageHero {...fallbackHero} />
        <ErrorState title="About content could not be loaded" message={result.error.message} />
      </>
    );
  }

  const [doctor, home, services, testimonials, posts, hero] = result.data;

  return (
    <>
      <PageHero {...hero} />
      <AboutSourcePage doctor={doctor} home={home} services={services} testimonials={testimonials} posts={posts} />
    </>
  );
}