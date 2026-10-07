import { EmptyState } from "@/components/ui/DataState";
import type { Chamber } from "@/types/content";
import { ChamberCard } from "../components/ChamberCard";

export function ChambersListSection({ chambers }: { chambers: Chamber[] }) {
  return <section className="source-chambers-list" aria-labelledby="chambers-list-title">
    <div className="source-page-container">
      <div className="source-chambers-list-head" data-reveal="up">
        <div>
          <p className="source-chambers-eyebrow">Chamber directory</p>
          <h2 id="chambers-list-title">Available consultation chambers</h2>
        </div>
        <p>
          Review schedule, direct contact, fee details, and map access for each chamber before requesting an appointment.
        </p>
      </div>
      {chambers.length === 0 ? <EmptyState title="No chambers available" message="Chamber data is not available from the API yet." /> : <div className="source-chambers-grid">
        {chambers.map((chamber, index) => <ChamberCard chamber={chamber} index={index} key={chamber.id} />)}
      </div>}
    </div>
  </section>;
}
