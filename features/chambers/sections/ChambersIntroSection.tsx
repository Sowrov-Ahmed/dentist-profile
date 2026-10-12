import type { Chamber } from "@/types/content";

const summaryRowClassName = "rounded-2xl border border-[rgba(14,29,76,.08)] bg-white px-5 py-[18px]";

export function ChambersIntroSection({ chamberCount, primaryChamber }: { chamberCount: number; primaryChamber: Chamber | null }) {
  return <section className="source-chambers-intro" aria-labelledby="chambers-intro-title">
    <div className="source-page-container">
      <div className="source-chambers-intro-card" data-reveal="up">
        <div className="source-chambers-intro-copy">
          <p className="source-chambers-eyebrow">Patient planning</p>
          <h2 id="chambers-intro-title">Choose the chamber that fits your visit</h2>
          <p>
            Each chamber record is maintained from one central source so patients can compare location, routine schedule, additional visiting hours, phone contact, and consultation fees with confidence.
          </p>
        </div>
        <dl className="source-chambers-summary grid gap-[14px] m-0">
          <div className={summaryRowClassName}>
            <dt>Total chambers</dt>
            <dd>{chamberCount}</dd>
          </div>
          <div className={summaryRowClassName}>
            <dt>Primary chamber</dt>
            <dd>{primaryChamber?.name || "Not configured"}</dd>
          </div>
          <div className={summaryRowClassName}>
            <dt>Best for</dt>
            <dd>In-person specialist consultation</dd>
          </div>
        </dl>
      </div>
    </div>
  </section>;
}
