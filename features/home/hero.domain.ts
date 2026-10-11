import type { Chamber, DentalService, DoctorProfile, HomeContent } from "@/types/content";
import { getChamberAppointmentHref, getChamberPhoneHref, getPrimaryChamber } from "@/features/chambers/chambers.service";

/**
 * Home hero slide model.
 *
 * The hero presentation component knows nothing about the doctor, the service list or the
 * chamber record: it renders whatever `HeroSlide[]` it is handed. Slide content is assembled
 * here, in the feature/domain layer, from the same typed records the rest of the site reads
 * through `getDoctorProfile()` / `getServices()` / `getChambers()`. No JSON is imported here
 * and no business value is written into the component.
 */

export type HeroSlideCta = {
  label: string;
  href: string;
  /** Extra context for assistive tech, since the visible label is short. */
  ariaLabel?: string;
};

export type HeroSlideDetail = {
  label: string;
  value: string;
};

export type HeroSlide = {
  id: string;
  eyebrow: string;
  title: string;
  /** Trailing phrase rendered in the accent colour, when the headline has one. */
  highlight?: string;
  description: string;
  cta: HeroSlideCta;
  /** Compact supporting rows (credentials, schedule). Omitted when there is nothing to show. */
  details?: HeroSlideDetail[];
  /** Emergency contact block, used by the headline slide only. */
  call?: { label: string; value: string; href: string };
};

export type HeroSlideInput = {
  doctor: DoctorProfile;
  home: HomeContent;
  services: DentalService[];
  chambers: Chamber[];
};

/** Abbreviations the profile slide lists, in the order a reader expects them. */
const CREDENTIAL_ORDER = ["BDS", "MDS", "FCPS"] as const;

/**
 * The Appointment route the headline CTA offers. The project has no central route table
 * (`Header.tsx`, `app/sitemap.ts` and `app/appointment/page.tsx` each spell it out), so the
 * canonical path is named here once and reused by the slide builders instead of being
 * repeated as a bare string per slide.
 */
const APPOINTMENT_ROUTE = "/appointment";

function text(value: string | null | undefined): string {
  return typeof value === "string" ? value.trim() : "";
}

function firstValue(...candidates: Array<string | null | undefined>): string {
  for (const candidate of candidates) {
    const value = text(candidate);
    if (value) return value;
  }
  return "";
}

/** Splits "…Trusted By Families Everywhere" into base + accent tail, as the hero already did. */
function splitHighlight(title: string, highlight: string | undefined) {
  const accent = text(highlight);
  if (accent && title.includes(accent)) {
    return { title: text(title.replace(accent, "")), highlight: accent };
  }
  return { title, highlight: undefined };
}

function buildHeroSlide(doctor: DoctorProfile): HeroSlide {
  const { title, highlight } = splitHighlight(doctor.heroTitle, doctor.heroHighlight);
  const ctaLabel = firstValue(doctor.appointmentCta, "Appointment");

  return {
    id: "hero-highlight",
    eyebrow: doctor.heroEyebrow,
    title,
    highlight,
    description: doctor.heroDescription,
    cta: { label: ctaLabel, href: APPOINTMENT_ROUTE, ariaLabel: `${ctaLabel} — request a visit` },
    call: {
      label: "Emergency Call",
      value: doctor.phone,
      href: `tel:${doctor.phone.replace(/\s/g, "")}`
    }
  };
}

function buildProfileSlide(doctor: DoctorProfile): HeroSlide {
  const about = doctor.aboutSpecialist;
  const profile = about.profile;
  const academic = about.academicPosition;

  // Prefer the recognised clinical abbreviations; fall back to whatever the record carries so a
  // profile without BDS/MDS/FCPS still renders its real credentials instead of nothing.
  const abbreviations = about.credentials.map((credential) => text(credential.abbreviation)).filter(Boolean);
  const preferred = CREDENTIAL_ORDER.filter((abbreviation) => abbreviations.includes(abbreviation));
  const qualifications = (preferred.length > 0 ? preferred : abbreviations).slice(0, 3).join(" · ");

  const details: HeroSlideDetail[] = [];
  if (qualifications) details.push({ label: "Qualifications", value: qualifications });
  if (text(academic.role)) {
    details.push({
      label: "Position",
      value: firstValue(academic.role, academic.institution) === academic.role && text(academic.institution)
        ? `${academic.role}, ${academic.institution}`
        : academic.role
    });
  }

  const eyebrow = firstValue(profile.specialistFocus, doctor.title);
  const description = firstValue(profile.shortDescriptor, profile.shortProfessionalSummary, doctor.aboutDescription);

  return {
    id: "hero-profile",
    eyebrow,
    title: firstValue(profile.fullName, doctor.name),
    description,
    cta: { label: "Read More", href: "/about", ariaLabel: `Read more about ${firstValue(profile.fullName, doctor.name)}` },
    ...(details.length > 0 ? { details } : {})
  };
}

function buildServicesSlide(home: HomeContent, services: DentalService[]): HeroSlide {
  const intro = home.servicesIntro;
  // The hero lists the leading clinical areas; the full set stays on /services.
  const highlights = services.slice(0, 4).map((service) => text(service.tabTitle) || text(service.title)).filter(Boolean);

  return {
    id: "hero-services",
    eyebrow: intro.eyebrow,
    title: intro.title,
    description: intro.description,
    cta: { label: "View Services", href: "/services", ariaLabel: "View all dental services" },
    ...(highlights.length > 0 ? { details: highlights.map((value) => ({ label: "", value })) } : {})
  };
}

function buildChamberSlide(chambers: Chamber[]): HeroSlide | null {
  const chamber = getPrimaryChamber(chambers);
  if (!chamber) return null;

  const details: HeroSlideDetail[] = [];
  if (text(chamber.days)) details.push({ label: "Days", value: chamber.days });
  if (text(chamber.hours)) details.push({ label: "Hours", value: chamber.hours });

  const description = firstValue(chamber.address, chamber.name);

  return {
    id: "hero-chamber",
    eyebrow: firstValue(chamber.tag, "Primary Chamber"),
    title: chamber.name,
    description,
    cta: {
      label: "Book Appointment",
      href: getChamberAppointmentHref(chamber),
      ariaLabel: `Book an appointment at ${chamber.name}`
    },
    ...(details.length > 0 ? { details } : {}),
    call: {
      label: "Chamber Phone",
      value: chamber.phone,
      href: getChamberPhoneHref(chamber.phone)
    }
  };
}

/**
 * Builds the hero's slides in order. A slide is omitted only when the record it describes is
 * absent (for example no chamber at all), so the slider never renders an empty panel; the
 * caller falls back to the headline slide alone in that case.
 */
export function buildHomeHeroSlides({ doctor, home, services, chambers }: HeroSlideInput): HeroSlide[] {
  const slides: HeroSlide[] = [buildHeroSlide(doctor)];
  const chamberSlide = buildChamberSlide(chambers);

  if (doctor.aboutSpecialist.profile.fullName) slides.push(buildProfileSlide(doctor));
  if (home.servicesIntro.title) slides.push(buildServicesSlide(home, services));
  if (chamberSlide) slides.push(chamberSlide);

  return slides;
}