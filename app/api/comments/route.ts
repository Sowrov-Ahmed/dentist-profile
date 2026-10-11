import { NextResponse } from "next/server";
import { fail, ok } from "@/lib/api/response";
import type { BlogCommentRequest, BlogCommentResponse } from "@/types/content";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Partial<BlogCommentRequest> | null;
  const details: Record<string, string[]> = {};

  if (!body?.postSlug) details.postSlug = ["Post slug is required."];
  if (!body?.name || body.name.trim().length < 2) details.name = ["Name is required."];
  if (!body?.email || !emailPattern.test(body.email)) details.email = ["A valid email address is required."];
  if (!body?.comment || body.comment.trim().length < 5) details.comment = ["Comment must be at least 5 characters."];

  if (Object.keys(details).length > 0) {
    return NextResponse.json(fail<BlogCommentResponse>("VALIDATION_ERROR", "Please correct the highlighted fields.", details), { status: 422 });
  }

  return NextResponse.json(ok<BlogCommentResponse>({
    id: `comment_${Date.now()}`,
    status: "received",
    message: "Thank you. Your comment has been received and is awaiting review.",
    receivedAt: new Date().toISOString()
  }));
}
