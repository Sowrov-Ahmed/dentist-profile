import { NextResponse } from "next/server";
import { resolveContentEndpoint } from "@/lib/api/content-source";
import type { BlogPost } from "@/types/content";

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const payload = await resolveContentEndpoint<BlogPost>(`/blog/${slug}`);
  return NextResponse.json(payload, { status: payload.success ? 200 : 404 });
}
