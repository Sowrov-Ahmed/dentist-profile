import { HomeTwoDental } from "@/features/home/sections/HomeTwoDental";
import { getAppointmentPageData } from "@/features/appointments/appointment.service";
import { getBlogPosts } from "@/features/blog/blog.service";
import { getCaseStudies } from "@/features/cases/case.service";
import { getDoctorProfile, getHomeContent, getTestimonials } from "@/features/dental/dental.service";
import { getServices } from "@/features/services/service.service";

export default async function HomePage() {
  const [doctor, home, services, cases, posts, testimonials, appointmentData] = await Promise.all([
    getDoctorProfile(),
    getHomeContent(),
    getServices(),
    getCaseStudies(),
    getBlogPosts(),
    getTestimonials(),
    // The Home appointment section submits through the same service as `/appointment`, so both
    // surfaces share one content source and one contract. `getChambers` is already memoised
    // per request, and this route reuses it rather than adding a second fetch path.
    getAppointmentPageData()
  ]);

  return <HomeTwoDental doctor={doctor} home={home} services={services} cases={cases} posts={posts} testimonials={testimonials} appointmentContent={appointmentData.content} chambers={appointmentData.chambers} />;
}
