import { NextResponse } from "next/server";
import { resolveDemoEndpoint } from "@/lib/api/demo-repository";
import { fail, ok } from "@/lib/api/response";
import type { AppointmentContent, AppointmentSubmissionRequest, AppointmentSubmissionResponse, Chamber } from "@/types/content";

const phonePattern = /^[+\d][+\d\s().-]{6,}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

export async function GET() {
  return NextResponse.json(await resolveDemoEndpoint<AppointmentContent>("/appointments"));
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Partial<AppointmentSubmissionRequest> | null;
  const [appointmentPayload, chambersPayload] = await Promise.all([
    resolveDemoEndpoint<AppointmentContent>("/appointments"),
    resolveDemoEndpoint<Chamber[]>("/chambers")
  ]);
  const content = appointmentPayload.data;
  const chambers = chambersPayload.data || [];
  const details: Record<string, string[]> = {};

  const chamber = body?.chamberId ? chambers.find((item) => item.id === body.chamberId) : null;
  const consultationType = body?.consultationType && content ? content.consultationTypes.find((item) => item.id === body.consultationType) : null;

  if (!chamber) details.chamberId = ["Please select a valid consultation location."];
  if (!consultationType) details.consultationType = ["Please select a valid consultation type."];
  if (!body?.preferredDate || !datePattern.test(body.preferredDate)) details.preferredDate = ["Please select a preferred consultation date."];
  if (!body?.fullName || body.fullName.trim().length < 2) details.fullName = ["Full name is required."];
  if (!body?.phone || !phonePattern.test(body.phone.trim())) details.phone = ["A valid phone number is required."];
  if (!body?.email || !emailPattern.test(body.email.trim())) details.email = ["A valid email address is required."];
  if (!body?.reason || body.reason.trim().length < 10) details.reason = ["Please describe the reason for consultation in at least 10 characters."];

  if (!content) details.appointment = ["Appointment configuration is not available."];

  if (Object.keys(details).length > 0 || !chamber || !consultationType || !content) {
    return NextResponse.json(fail<AppointmentSubmissionResponse>("VALIDATION_ERROR", "Please correct the highlighted fields.", details), { status: 422 });
  }

  return NextResponse.json(ok<AppointmentSubmissionResponse>({
    id: `demo_apt_${Date.now()}`,
    status: "received",
    message: content.successMessage,
    receivedAt: new Date().toISOString(),
    selectedChamber: {
      id: chamber.id,
      name: chamber.name,
      address: chamber.address,
      phone: chamber.phone,
      primary: chamber.primary
    },
    consultationType,
    fee: chamber.fees[consultationType.id]
  }));
}
