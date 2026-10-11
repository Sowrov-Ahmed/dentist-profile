import { NextResponse } from "next/server";
import { resolveContentEndpoint } from "@/lib/api/content-source";
import type { DoctorProfile } from "@/types/content";

export async function GET() {
  return NextResponse.json(await resolveContentEndpoint<DoctorProfile>("/doctor"));
}
