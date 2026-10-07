import { NextResponse } from "next/server";
import { resolveDemoEndpoint } from "@/lib/api/demo-repository";
import type { BlogPost } from "@/types/content";

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const payload = await resolveDemoEndpoint<BlogPost>(`/blog/${slug}`);
  return NextResponse.json(payload, { status: payload.success ? 200 : 404 });
}
