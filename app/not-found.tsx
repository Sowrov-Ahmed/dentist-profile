import Link from "next/link";

export default function NotFound() {
  return (
    <section className="error-page">
      <div>
        <p className="error-code">404</p>
        <h1>Page not found</h1>
        <p>The dental specialist page you requested is unavailable or has moved.</p>
        <Link className="btn-primary-kliniko" href="/">
          <span className="btn-ripple" aria-hidden="true" />
          <span className="btn-label">Back Home</span>
        </Link>
      </div>
    </section>
  );
}
