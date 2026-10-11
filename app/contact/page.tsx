import { ErrorState } from "@/components/ui/ErrorState";
import { PageHero } from "@/components/ui/PageHero";
import { ContactSourceDental } from "@/features/source/ContactSourceDental";
import { getChambers, getPrimaryChamber } from "@/features/chambers/chambers.service";
import { getContactContent, getDoctorProfile } from "@/features/dental/dental.service";
import { getPageHero } from "@/features/hero/pageHero.service";
import { getServices } from "@/features/services/service.service";
import { loadAsync } from "@/lib/api/load";
import { createPageMetadata } from "@/lib/seo/metadata";
import type { PageHeroContent } from "@/types/content";

export const metadata = createPageMetadata({
  title: "Contact",
  description: "Contact the dental specialist, review office information, and request a dental appointment through the online request form.",
  path: "/contact"
});

const fallbackHero: PageHeroContent = {
  eyebrow: "Get In Touch",
  title: "Questions are the start of good care.",
  description: "Send a message or call directly, and choose the chamber that best fits your schedule."
};

export default async function ContactPage() {
  const result = await loadAsync(() => Promise.all([
    getDoctorProfile(),
    getServices(),
    getContactContent(),
    getChambers(),
    getPageHero("contact", fallbackHero)
  ]));

  if (!result.ok) {
    return (
      <>
        <PageHero {...fallbackHero} />
        <ErrorState title="Contact details could not be loaded" message={result.error.message} />
      </>
    );
  }

  const [doctor, services, contact, chambers, hero] = result.data;
  const primaryChamber = getPrimaryChamber(chambers);

  return (
    <>
      <PageHero {...hero} />
      <ContactSourceDental doctor={doctor} services={services} contact={contact} primaryChamber={primaryChamber} />
    </>
  );
}