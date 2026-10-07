"use client";

import Link from "next/link";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="error-page" role="alert">
      <div>
        <p className="error-code">Error</p>
        <h1>Content could not be loaded</h1>
        <p>{error.message || "The dental specialist content is temporarily unavailable."}</p>
        <div className="error-actions">
          <button className="btn-primary-kliniko" type="button" onClick={reset}>
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
  );
}
