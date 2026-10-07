import { HomeTwoDental } from "@/features/home/sections/HomeTwoDental";
import { getBlogPosts } from "@/features/blog/blog.service";
import { getCaseStudies } from "@/features/cases/case.service";
import { getDoctorProfile, getHomeContent, getTestimonials } from "@/features/dental/dental.service";
import { getServices } from "@/features/services/service.service";

export default async function HomePage() {
  const [doctor, home, services, cases, posts, testimonials] = await Promise.all([
    getDoctorProfile(),
    getHomeContent(),
    getServices(),
    getCaseStudies(),
    getBlogPosts(),
    getTestimonials()
  ]);

  return <HomeTwoDental doctor={doctor} home={home} services={services} cases={cases} posts={posts} testimonials={testimonials} />;
}
