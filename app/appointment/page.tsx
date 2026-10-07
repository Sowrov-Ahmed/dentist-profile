import { AppointmentPage } from "@/features/appointments/AppointmentPage";
import { getAppointmentPageData } from "@/features/appointments/appointment.service";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Appointment",
  description: "Request a dental consultation by selecting a chamber, consultation type, preferred date, full name, phone number, and reason for consultation.",
  path: "/appointment"
});

function firstParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AppointmentRoutePage({ searchParams }: { searchParams?: Promise<{ chamber?: string | string[] }> }) {
  const params = searchParams ? await searchParams : {};
  const appointmentData = await getAppointmentPageData(firstParam(params.chamber));

  return <AppointmentPage {...appointmentData} />;
}
