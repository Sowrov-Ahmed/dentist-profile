import { NextResponse } from "next/server";
import { fail, ok } from "@/lib/api/response";
import type { NewsletterResponse } from "@/types/content";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { email?: string } | null;

  if (!body?.email || !emailPattern.test(body.email)) {
    return NextResponse.json(fail<NewsletterResponse>("VALIDATION_ERROR", "Please provide a valid email address.", { email: ["Valid email is required."] }), { status: 422 });
  }

  return NextResponse.json(ok<NewsletterResponse>({ status: "received", message: "Newsletter subscription received.", receivedAt: new Date().toISOString() }));
}
