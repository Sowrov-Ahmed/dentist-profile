import Image from "next/image";
import type { DentalService, DoctorProfile, HomeContent } from "@/types/content";
import { AppointmentForm } from "@/components/forms/AppointmentForm";
import { MailIcon, PhoneIcon, PlayIcon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function AppointmentSection({ doctor, services, appointment }: { doctor: DoctorProfile; services: DentalService[]; appointment: HomeContent["appointment"] }) {
  return (
    <section className="home-appoint" style={{ backgroundImage: "url('/assets/images/common/appointment-overlay.png')" }}>
      <div className="home-appoint-image">
        <Image src="/assets/images/common/video-bg.png" alt="Dental care appointment" fill sizes="(max-width: 991px) 100vw, 44vw" />
        <a className="home-appoint-play" href="/about" aria-label="Learn about appointment process"><PlayIcon /></a>
      </div>
      <div className="home-appoint-container">
        <div className="home-appoint-right">
          <SectionHeading eyebrow={appointment.eyebrow} title={appointment.title} description={appointment.description} light className="home-appoint-title" />
          <div className="home-appoint-contact">
            <a className="home-appoint-contact-item" href={`tel:${doctor.phone.replace(/\s/g, "")}`}>
              <span><PhoneIcon /></span>
              <p><small>Call Anytime</small>{doctor.phone}</p>
            </a>
            <a className="home-appoint-contact-item" href={`mailto:${doctor.email}`}>
              <span><MailIcon /></span>
              <p><small>Email Address</small>{doctor.email}</p>
            </a>
          </div>
          <AppointmentForm services={services} />
        </div>
      </div>
    </section>
  );
}
