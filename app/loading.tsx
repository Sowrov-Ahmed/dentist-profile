export default function Loading() {
  return (
    <div className="page-loading" role="status" aria-live="polite">
      <span className="loading-pill" aria-hidden="true" />
      <p>Loading dental specialist content...</p>
    </div>
  );
}
