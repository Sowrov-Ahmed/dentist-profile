import Image from "next/image";
import type { DoctorProfile } from "@/types/content";
import { Icon } from "@/components/ui/Icon";
import { AnimatedChars, TitleIcon } from "@/components/source/SourceHelpers";

function splitTitle(title: string, breakAfter?: string) {
  if (!breakAfter) return null;
  const at = title.indexOf(breakAfter);
  if (at < 0) return null;
  const end = at + breakAfter.length;
  const lineOne = title.slice(0, end).trim();
  const lineTwo = title.slice(end).trim();
  return lineOne && lineTwo ? { lineOne, lineTwo } : null;
}

function SectionTitle({
  eyebrow,
  title,
  headingId,
  headingClassName = "",
  breakAfter
}: {
  eyebrow: string;
  title: string;
  headingId: string;
  headingClassName?: string;
  breakAfter?: string;
}) {
  const lines = splitTitle(title, breakAfter);

  return <div className="source-title animation-style2 about-specialist-title">
    <p className="source-eyebrow"><TitleIcon />{eyebrow}</p>
    <h2 id={headingId} className={`source-heading about-specialist-heading ${headingClassName}`.trim()} data-title-reveal aria-label={title}>
      {lines ? <><AnimatedChars text={lines.lineOne} /><br className="about-specialist-break" /><AnimatedChars text={lines.lineTwo} /></> : <AnimatedChars text={title} />}
    </h2>
  </div>;
}

export function AboutSpecialistSection({ doctor }: { doctor: DoctorProfile }) {
  const about = doctor.aboutSpecialist;
  const profile = about.profile;
  const academic = about.academicPosition;
  const career = about.career.length ? about.career : about.experience;
  const qualifications = about.qualifications.length ? about.qualifications : [...about.education, ...about.internationalTraining];
  const careerTitle = about.careerSectionTitle || profile.professionalPositioning;
  const trainingTitle = about.trainingSectionTitle || about.credentialsAndSpecialization.dentalSpecialization;

  return <>
    <section className="about-specialist-section" aria-labelledby="about-specialist-title" data-mobile-motion>
      <div className="about-source-container">
        <div className="about-specialist-profile">
          <div className="about-specialist-media" data-reveal="up">
            <figure className="about-specialist-photo">
              <Image src={profile.portraitImage} alt={profile.portraitAlt} fill sizes="(max-width: 991px) 620px, (max-width: 1199px) 470px, 537px" priority />
            </figure>
          </div>

          <div className="about-specialist-copy">
            <SectionTitle eyebrow="About Specialist" title={profile.fullName} headingId="about-specialist-title" />
            <div className="about-specialist-identity" data-reveal="up">
              <p className="about-specialist-role">{profile.professionalTitle}</p>
              <p className="about-specialist-focus">{profile.specialistFocus}</p>
            </div>
            <p className="about-specialist-bio" data-reveal="up">{profile.shortProfile}</p>
            <div className="about-specialist-meta" data-reveal="up">
              <span className="about-specialist-meta-icon" aria-hidden="true"><Icon name="user" size={22} /></span>
              <p>
                <strong>{academic.role}</strong>
                <span>{academic.institution}</span>
                <em>{academic.department} · {academic.period}</em>
              </p>
            </div>
            <ul className="about-specialist-badges" data-reveal="up" aria-label="Professional credentials">
              {about.credentials.map((credential) => <li key={credential.abbreviation}>
                {credential.abbreviation}
                <span className="sr-only"> — {credential.title}</span>
              </li>)}
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section className="about-specialist-section about-specialist-career-section" aria-labelledby="about-specialist-career-title" data-mobile-motion>
      <div className="about-source-container">
        <SectionTitle eyebrow="Career & Professional Journey" title={careerTitle} headingId="about-specialist-career-title" headingClassName="about-specialist-heading-statement" breakAfter="practice in" />
        <ol className="about-specialist-timeline">
          {career.map((item, index) => <li className="about-specialist-timeline-item" key={`${item.period}-${item.role}`} data-reveal="up" style={{ transitionDelay: `${0.12 + (index % 4) * 0.08}s` }}>
            <p className="about-specialist-timeline-period">{item.period}</p>
            <div className="about-specialist-timeline-body">
              <h3>{item.role}</h3>
              <p className="about-specialist-timeline-place">{item.institution}</p>
              <p className="about-specialist-timeline-copy">{item.description}</p>
            </div>
          </li>)}
        </ol>
      </div>
    </section>

    <section className="about-specialist-section" aria-labelledby="about-specialist-training-title" data-mobile-motion>
      <div className="about-source-container">
        <SectionTitle eyebrow="Qualifications & Training" title={trainingTitle} headingId="about-specialist-training-title" headingClassName="about-specialist-heading-statement" breakAfter="in restorative" />
        <ul className="about-specialist-training">
          {qualifications.map((item, index) => <li className="about-specialist-training-item" key={`${item.period}-${item.qualification}`} data-reveal="up" style={{ transitionDelay: `${0.12 + (index % 4) * 0.08}s` }}>
            <p className="about-specialist-training-period">{item.period}</p>
            <h3>{item.qualification}</h3>
            <p className="about-specialist-training-place">{item.institution}</p>
            <p className="about-specialist-training-copy">{item.details}</p>
          </li>)}
        </ul>
      </div>
    </section>
  </>;
}