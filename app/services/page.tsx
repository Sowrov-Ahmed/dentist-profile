import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ServiceSourcePage } from "@/features/source/ServiceSourcePage";
import { getBlogPosts } from "@/features/blog/blog.service";
import { getDoctorProfile, getTestimonials } from "@/features/dental/dental.service";
import { getServices } from "@/features/services/service.service";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Dental Services",
  description: "Browse preventive dentistry, root canal consultation, restorative care, smile design, gum care, and urgent dental pain review services.",
  path: "/services"
});

export default async function ServicePage() {
  const [doctor, services, testimonials, posts] = await Promise.all([getDoctorProfile(), getServices(), getTestimonials(), getBlogPosts()]);

  return <>
    <Breadcrumb title="Service" current="Service" sourceTemplate />
    <ServiceSourcePage doctor={doctor} services={services} testimonials={testimonials} posts={posts} />
  </>;
}
