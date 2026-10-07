import Image from "next/image";
import type { DoctorProfile } from "@/types/content";
import { PrimaryButton } from "@/components/ui/Button";
import { PlayIcon } from "@/components/ui/Icon";

export function HeroSection({ doctor }: { doctor: DoctorProfile }) {
  return (
    <section className="hero source-hero home-source-hero hero-light-content" style={{ backgroundImage: "url('/assets/images/common/banner-BG-h2.jpg')" }}>
      <div className="hero-inner home-source-container">
        <div className="hero-content">
          <span className="hero-eyebrow">{doctor.heroEyebrow}</span>
          <h1 className="hero-title">{doctor.heroTitle}</h1>
          <p className="hero-copy">{doctor.heroDescription}</p>
          <div className="hero-buttons">
            <PrimaryButton href="/contact">{doctor.appointmentCta}</PrimaryButton>
            <a className="hero-play" href="/about" aria-label="Learn about the dental specialist">
              <PlayIcon />
            </a>
          </div>
        </div>
        <div className="hero-art cutout" data-parallax>
          <Image
            src={doctor.profileImage}
            alt={doctor.name}
            fill
            className="hero-photo hero-photo-cutout"
            priority
            sizes="(max-width: 991px) 90vw, 757px"
          />
        </div>
      </div>
    </section>
  );
}
