import { apiPost, unwrapApiData } from "@/lib/api/client";
import type { BlogCommentRequest, BlogCommentResponse } from "@/types/content";

export async function submitBlogComment(payload: BlogCommentRequest): Promise<BlogCommentResponse> {
  return unwrapApiData(await apiPost<BlogCommentResponse, Record<string, unknown>>("/comments", {
    postSlug: payload.postSlug,
    name: payload.name,
    email: payload.email,
    comment: payload.comment
  }));
}
