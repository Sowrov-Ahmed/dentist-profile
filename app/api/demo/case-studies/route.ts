import { NextResponse } from "next/server";
import { resolveDemoEndpoint } from "@/lib/api/demo-repository";
import type { CaseStudy } from "@/types/content";
export async function GET() { return NextResponse.json(await resolveDemoEndpoint<CaseStudy[]>("/case-studies")); }
