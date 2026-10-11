import { ErrorState } from "@/components/ui/ErrorState";
import { PageHero } from "@/components/ui/PageHero";
import { AppointmentPage } from "@/features/appointments/AppointmentPage";
import { getAppointmentPageData } from "@/features/appointments/appointment.service";
import { getPageHero } from "@/features/hero/pageHero.service";
import { loadAsync } from "@/lib/api/load";
import { createPageMetadata } from "@/lib/seo/metadata";
import type { PageHeroContent } from "@/types/content";

export const metadata = createPageMetadata({
  title: "Appointment",
  description: "Request a dental consultation by selecting a chamber, consultation type, preferred date, full name, phone number, and reason for consultation.",
  path: "/appointment"
});

const fallbackHero: PageHeroContent = {
  eyebrow: "Appointment",
  title: "Request a dental consultation.",
  description: "Choose a chamber, consultation type, and preferred date, and describe your concern so the team can prepare for your visit."
};

function firstParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AppointmentRoutePage({ searchParams }: { searchParams?: Promise<{ chamber?: string | string[] }> }) {
  const params = searchParams ? await searchParams : {};
  const chamber = firstParam(params.chamber);
  const result = await loadAsync(() => Promise.all([getAppointmentPageData(chamber), getPageHero("appointment", fallbackHero)]));

  if (!result.ok) {
    return (
      <>
        <PageHero {...fallbackHero} />
        <ErrorState title="Appointment details could not be loaded" message={result.error.message} />
      </>
    );
  }

  const [appointmentData, hero] = result.data;

  return <AppointmentPage hero={hero} {...appointmentData} />;
}