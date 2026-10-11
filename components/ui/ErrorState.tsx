"use client";

import { useRouter } from "next/navigation";

/**
 * Scoped failure state for a single region of a page.
 *
 * Today a rejected request inside a Server Component bubbles all the way to
 * `app/error.tsx`, which replaces the entire document with a full-page error screen.
 * This keeps the page shell intact and offers an in-place retry that re-runs the
 * server components, so one unavailable endpoint no longer empties the whole page.
 *
 * Reuses the existing `.data-state` / `.error-actions` / `.btn-primary-kliniko`
 * design-system classes — no additional CSS.
 */
export function ErrorState({ title = "This section could not be loaded", message }: { title?: string; message?: string }) {
  const router = useRouter();

  return (
    <div className="data-state" role="alert">
      <h2>{title}</h2>
      <p>{message || "The content service did not respond. Please try again in a moment."}</p>
      <div className="error-actions">
        <button className="btn-primary-kliniko" type="button" onClick={() => router.refresh()}>
          <span className="btn-ripple" aria-hidden="true" />
          <span className="btn-label">Try Again</span>
        </button>
      </div>
    </div>
  );
}