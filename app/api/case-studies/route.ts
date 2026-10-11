import { NextResponse } from "next/server";
import { resolveContentEndpoint } from "@/lib/api/content-source";
import type { CaseStudy } from "@/types/content";
export async function GET() { return NextResponse.json(await resolveContentEndpoint<CaseStudy[]>("/case-studies")); }
