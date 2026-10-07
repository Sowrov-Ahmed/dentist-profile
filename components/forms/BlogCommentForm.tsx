"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { submitBlogComment } from "@/features/blog/comment.service";

export function BlogCommentForm({ postSlug }: { postSlug: string }) {
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setSubmitting(true);
    setMessage("");

    try {
      const response = await submitBlogComment({
        postSlug,
        name: String(formData.get("name") || ""),
        email: String(formData.get("email") || ""),
        comment: String(formData.get("comment") || "")
      });
      setMessage(response.message || "Thank you. Your comment has been received.");
      form.reset();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return <form onSubmit={submit} noValidate>
    <div className="source-blog-reply-name-email"><label className="sr-only" htmlFor="comment-name">Complete Name</label><input id="comment-name" name="name" type="text" placeholder="Complete Name" required /><label className="sr-only" htmlFor="comment-email">Email address</label><input id="comment-email" name="email" type="email" placeholder="Email address" required /></div>
    <label className="sr-only" htmlFor="comment-message">Comment</label><textarea id="comment-message" name="comment" rows={3} placeholder="comment" required />
    <div className="source-blog-save"><input id="comment-save" name="save" type="checkbox" /><label htmlFor="comment-save"> Save my name, email, and website in this browser for the next time I comment.</label></div>
    <div className="source-blog-post-wrap"><button type="submit" className="source-blog-post-btn" disabled={submitting}>{submitting ? "Submitting..." : "Submit A Comment"}</button></div>
    {message ? <p className="source-blog-reply-status" role="status">{message}</p> : null}
  </form>;
}
