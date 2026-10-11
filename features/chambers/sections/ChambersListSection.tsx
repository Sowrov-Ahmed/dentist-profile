import { EmptyState } from "@/components/ui/DataState";
import type { Chamber } from "@/types/content";
import { ChamberCard } from "../components/ChamberCard";

export function ChambersListSection({ chambers }: { chambers: Chamber[] }) {
  // The "Chamber directory" eyebrow, the "Available consultation chambers" heading and its
  // supporting paragraph now live in the page hero above (data/page-heroes.json -> PageHero),
  // so they are not repeated here. This section is the chamber grid alone.
  return <section className="source-chambers-list" aria-label="Available consultation chambers">
    <div className="source-page-container">
      {chambers.length === 0 ? <EmptyState title="No chambers available" message="Chamber data is not available from the API yet." /> : <div className="source-chambers-grid">
        {chambers.map((chamber, index) => <ChamberCard chamber={chamber} index={index} key={chamber.id} />)}
      </div>}
    </div>
  </section>;
}
