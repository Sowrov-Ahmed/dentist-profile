"use client";

import Image from "next/image";
import type { DoctorProfile } from "@/types/content";
import { Icon } from "@/components/ui/Icon";
import { AnimatedChars, TitleIcon } from "@/components/source/SourceHelpers";

function SectionTitle({
  eyebrow,
  title,
  headingId,
  className = ""
}: {
  eyebrow: string;
  title: string;
  headingId: string;
  className?: string;
}) {
  return <div className={`source-title animation-style2 about-specialist-title ${className}`.trim()}>
    <p className="source-eyebrow"><TitleIcon />{eyebrow}</p>
    <h2 id={headingId} className="source-heading about-specialist-heading" data-title-reveal aria-label={title}><AnimatedChars text={title} /></h2>
  </div>;
}

export function AboutSpecialistSection({ doctor }: { doctor: DoctorProfile }) {
  const about = doctor.aboutSpecialist;
  const profile = about.profile;
  const academic = about.academicPosition;
  const career = about.career.length ? about.career : about.experience;
  const qualifications = about.qualifications.length ? about.qualifications : [...about.education, ...about.internationalTraining];
  const expertise = about.credentialsAndSpecialization.areasOfSpecialistExpertise;
  const credentialLine = profile.credentials.slice(0, 3).join(" · ");

  return <section className="about-specialist-section" aria-labelledby="about-specialist-title" data-mobile-motion>
    <div className="about-source-container">
      <div className="about-specialist-profile">
        <div className="about-specialist-profile-media" data-reveal="up">
          <div className="about-specialist-photo">
            <Image
              src={profile.portraitImage}
              alt={profile.portraitAlt}
              fill
              sizes="(max-width: 991px) 100vw, 533px"
              priority
            />
          </div>
        </div>

        <div className="about-specialist-profile-copy">
          <SectionTitle eyebrow="About Specialist" title={profile.fullName} headingId="about-specialist-title" />
          <p className="about-specialist-role" data-reveal="up">{profile.professionalTitle}</p>
          <p className="about-specialist-position" data-reveal="up">{profile.professionalPositioning}</p>
          <p className="about-specialist-copy" data-reveal="up">{profile.shortProfile}</p>
          <p className="about-specialist-academic" data-reveal="up">{academic.role}, {academic.department}, {academic.institution} · {academic.period}</p>
          {credentialLine ? <p className="about-specialist-letters" data-reveal="up">{credentialLine}</p> : null}
          {expertise.length ? <ul className="about-specialist-expertise-list" data-reveal="up">
            {expertise.map((item) => <li key={item}><Icon name="check" size={16} />{item}</li>)}
          </ul> : null}
          <p className="about-specialist-care" data-reveal="up">{profile.patientCareStatement}</p>
        </div>
      </div>

      <section className="about-specialist-block" aria-labelledby="about-specialist-career-title">
        <SectionTitle eyebrow="Career & Professional Journey" title={profile.professionalPositioning} headingId="about-specialist-career-title" />
        <ol className="about-specialist-record" aria-label="Professional experience">
          {career.map((item, index) => <li className="about-specialist-record-item" key={`${item.period}-${item.role}`} data-reveal="up" style={{ transitionDelay: `${0.2 + (index % 4) * 0.08}s` }}>
            <time dateTime={item.period}>{item.period}</time>
            <div>
              <h3>{item.role}</h3>
              <p className="about-specialist-record-place">{item.institution}</p>
              <p>{item.description}</p>
            </div>
          </li>)}
        </ol>
      </section>

      <section className="about-specialist-block" aria-labelledby="about-specialist-training-title">
        <SectionTitle eyebrow="Qualifications & Training" title={about.credentialsAndSpecialization.dentalSpecialization} headingId="about-specialist-training-title" />
        <ul className="about-specialist-record" aria-label="Qualifications and training">
          {qualifications.map((item, index) => <li className="about-specialist-record-item" key={`${item.period}-${item.qualification}`} data-reveal="up" style={{ transitionDelay: `${0.2 + (index % 5) * 0.08}s` }}>
            <time dateTime={item.period}>{item.period}</time>
            <div>
              <h3>{item.qualification}</h3>
              <p className="about-specialist-record-place">{item.institution}</p>
              <p>{item.details}</p>
            </div>
          </li>)}
        </ul>
      </section>
    </div>
  </section>;
}
