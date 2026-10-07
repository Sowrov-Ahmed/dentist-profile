import { NextResponse } from "next/server";
import { fail, ok } from "@/lib/api/response";
import { resolveDemoEndpoint } from "@/lib/api/demo-repository";
import type { AppointmentRequest, AppointmentResponse, ContactContent } from "@/types/content";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET() {
  return NextResponse.json(await resolveDemoEndpoint<ContactContent>("/contact"));
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Partial<AppointmentRequest> | null;
  const details: Record<string, string[]> = {};

  if (!body?.name || body.name.trim().length < 2) details.name = ["Name is required."];
  if (!body?.email || !emailPattern.test(body.email)) details.email = ["A valid email address is required."];
  if (!body?.message || body.message.trim().length < 10) details.message = ["Please describe your dental concern in at least 10 characters."];

  if (Object.keys(details).length > 0) {
    return NextResponse.json(fail<AppointmentResponse>("VALIDATION_ERROR", "Please correct the highlighted fields.", details), { status: 422 });
  }

  return NextResponse.json(
    ok<AppointmentResponse>({
      id: `apt_${Date.now()}`,
      status: "received",
      message: "Thank you. Your demo appointment request has been received. Connect this endpoint to Laravel for production handling.",
      receivedAt: new Date().toISOString()
    })
  );
}
