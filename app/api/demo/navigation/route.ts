import { NextResponse } from "next/server";
import { resolveDemoEndpoint } from "@/lib/api/demo-repository";
import type { NavigationItem } from "@/types/content";
export async function GET() { return NextResponse.json(await resolveDemoEndpoint<NavigationItem[]>("/navigation")); }
