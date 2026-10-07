import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { AboutSourcePage } from "@/features/source/AboutSourcePage";
import { getBlogPosts } from "@/features/blog/blog.service";
import { getDoctorProfile, getHomeContent, getTestimonials } from "@/features/dental/dental.service";
import { getServices } from "@/features/services/service.service";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "About Dr. Nadia Karim",
  description: "Learn about the personal dental specialist approach, patient communication values, preventive focus, and treatment planning philosophy.",
  path: "/about"
});

export default async function AboutPage() {
  const [doctor, home, services, testimonials, posts] = await Promise.all([
    getDoctorProfile(),
    getHomeContent(),
    getServices(),
    getTestimonials(),
    getBlogPosts()
  ]);

  return <>
    <Breadcrumb title="About" current="About" sourceTemplate />
    <AboutSourcePage doctor={doctor} home={home} services={services} testimonials={testimonials} posts={posts} />
  </>;
}
