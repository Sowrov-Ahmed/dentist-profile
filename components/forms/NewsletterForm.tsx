"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { submitNewsletterSignup } from "@/features/dental/submission.service";

export function NewsletterForm({
  inputId = "footer-email",
  className = "newsletter",
  statusClassName = "footer-success",
  placeholder = "Email Address",
  buttonLabel = "Subscribe",
  sendingLabel = "Sending"
}: {
  inputId?: string;
  className?: string;
  statusClassName?: string;
  placeholder?: string;
  buttonLabel?: string;
  sendingLabel?: string;
}) {
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setSubmitting(true);
    setMessage("");

    try {
      const response = await submitNewsletterSignup(String(formData.get("email") || ""));
      setMessage(response.message || "Newsletter signup received.");
      form.reset();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className={className} onSubmit={submit} noValidate>
      <label className="sr-only" htmlFor={inputId}>Email Address</label>
      <input id={inputId} name="email" type="email" placeholder={placeholder} aria-label="Email Address" required />
      <button type="submit" disabled={submitting}>{submitting ? sendingLabel : buttonLabel}</button>
      {message ? <p className={statusClassName}>{message}</p> : null}
    </form>
  );
}
