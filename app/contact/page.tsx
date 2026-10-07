import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ContactSourceDental } from "@/features/source/ContactSourceDental";
import { getChambers, getPrimaryChamber } from "@/features/chambers/chambers.service";
import { getContactContent, getDoctorProfile } from "@/features/dental/dental.service";
import { getServices } from "@/features/services/service.service";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Contact",
  description: "Contact the dental specialist, review office information, and request a dental appointment through the demo API form.",
  path: "/contact"
});

export default async function ContactPage() {
  const [doctor, services, contact, chambers] = await Promise.all([getDoctorProfile(), getServices(), getContactContent(), getChambers()]);
  const primaryChamber = getPrimaryChamber(chambers);

  return <>
    <Breadcrumb title="Contact" current="Contact" sourceTemplate />
    <ContactSourceDental doctor={doctor} services={services} contact={contact} primaryChamber={primaryChamber} />
  </>;
}
