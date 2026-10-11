"use client";

import Link from "next/link";

import "./globals.css";

/**
 * Last-resort boundary for failures thrown by the root layout itself.
 *
 * `app/error.tsx` only wraps the route segment, so anything thrown while the layout
 * runs (site config, doctor profile, services, chambers) bypasses it entirely and
 * Next falls back to an empty document — the blank page visitors reported. This
 * boundary replaces the whole tree, so it re-imports the global stylesheet to stay
 * visually consistent with the rest of the site.
 */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body className="bg-white font-body text-navy">
        <section className="error-page" role="alert">
          <div>
            <p className="error-code">Error</p>
            <h1>This site could not be loaded</h1>
            <p>{error.message || "The dental specialist website is temporarily unavailable."}</p>
            <div className="error-actions">
              <button className="btn-primary-kliniko" type="button" onClick={() => reset()}>
                <span className="btn-ripple" aria-hidden="true" />
                <span className="btn-label">Try Again</span>
              </button>
              <Link className="btn-primary-kliniko" href="/">
                <span className="btn-ripple" aria-hidden="true" />
                <span className="btn-label">Back Home</span>
              </Link>
            </div>
          </div>
        </section>
      </body>
    </html>
  );
}