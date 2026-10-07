import Image from "next/image";
import type { DoctorProfile } from "@/types/content";
import { PrimaryButton } from "@/components/ui/Button";

export function AboutSection({ doctor }: { doctor: DoctorProfile }) {
  return (
    <section className="about-source" id="about-preview">
      <div className="about-source-container">
        <div className="about-source-grid">
          <div className="about-source-left">
            <div className="about-source-heading" data-reveal>
              <span className="about-source-eyebrow"><span className="about-source-icon" aria-hidden="true" />About Specialist</span>
              <h2 data-title-reveal>{doctor.aboutTitle}</h2>
            </div>
            <div className="about-source-wrap">
              <div className="about-source-actions" data-reveal>
                <PrimaryButton href="/about">More About</PrimaryButton>
                <div className="about-source-experience">
                  <strong>12+</strong>
                  <span>Years Focused Practice</span>
                </div>
              </div>
              <div className="about-source-small-image" data-reveal="right">
                <Image src={doctor.aboutImages.side} alt="Dental consultation detail" fill sizes="473px" />
              </div>
            </div>
          </div>
          <div className="about-source-right" data-reveal="right">
            <div className="about-source-large-image">
              <Image src={doctor.aboutImages.main} alt="Dental specialist consultation" fill sizes="(max-width: 991px) 100vw, 532px" />
            </div>
            <p>{doctor.aboutDescription}</p>
            <ul className="about-checks">
              {doctor.highlights.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
