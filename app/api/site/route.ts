import { NextResponse } from "next/server";
import { resolveContentEndpoint } from "@/lib/api/content-source";
import type { SiteConfig } from "@/types/content";

export async function GET() {
  return NextResponse.json(await resolveContentEndpoint<SiteConfig>("/site"));
}
