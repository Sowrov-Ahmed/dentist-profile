import Link from "next/link";
import type { Chamber } from "@/types/content";

export function ChambersHeroSection({ chamberCount, primaryChamber }: { chamberCount: number; primaryChamber: Chamber | null }) {
  return <section className="source-chambers-hero" aria-labelledby="chambers-hero-title">
    <div className="source-page-container">
      <div className="source-chambers-hero-inner">
        <nav className="source-chambers-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">{"//"}</span>
          <span>Chambers</span>
        </nav>
        <p className="source-chambers-kicker">Consultation Locations</p>
        <h1 id="chambers-hero-title">Chambers</h1>
        <p>
          View consultation locations, visiting schedules, chamber contact numbers, transparent consultation fees, and map directions before planning your visit.
        </p>
        <div className="source-chambers-hero-meta" aria-label="Chambers overview">
          <span>{chamberCount} consultation {chamberCount === 1 ? "option" : "options"}</span>
          {primaryChamber ? <span>Primary: {primaryChamber.name}</span> : null}
        </div>
      </div>
    </div>
  </section>;
}
