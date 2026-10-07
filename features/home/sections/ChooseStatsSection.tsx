import Image from "next/image";
import type { DoctorProfile, HomeContent } from "@/types/content";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function ChooseStatsSection({ choose, stats }: { choose: HomeContent["choose"]; stats: DoctorProfile["stats"] }) {
  return (
    <section className="home-choose">
      <div className="home-choose-container">
        <div className="home-choose-copy">
          <div className="home-choose-wrap">
            <SectionHeading eyebrow={choose.eyebrow} title={choose.title} description={choose.description} light className="home-choose-title" />
            <div className="home-choose-points">
              {choose.items.map((item, index) => (
                <article className="home-choose-card" key={item.title} data-reveal>
                  <span className="home-choose-icon" aria-hidden="true">
                    <Image src="/assets/images/common/title-icon-white.svg" alt="" width={40} height={40} />
                  </span>
                  <div className="home-choose-text">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                  <span className="home-choose-number" aria-hidden="true">0{index + 1}</span>
                </article>
              ))}
            </div>
          </div>
        </div>
        <div className="home-choose-image" data-reveal="right">
          <Image src={choose.image} alt="Why choose dental specialist" fill sizes="(max-width: 991px) 100vw, 750px" />
        </div>
        <div className="home-counter" style={{ backgroundImage: "url('/assets/images/common/count-bg.jpg')" }} data-reveal>
          {stats.map((stat) => (
            <div className="home-counter-item" key={stat.label}>
              <strong className="counter-number">{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
