"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { submitAppointmentRequest } from "@/features/appointments/appointment.service";
import { AppointmentFieldErrors, formatAppointmentFee, todayInputValue, validateAppointmentSubmission } from "@/features/appointments/appointment.domain";
import { buildHomeHeroSlides } from "@/features/home/hero.domain";
import type { HeroSlide } from "@/features/home/hero.domain";
import type { AppointmentContent, AppointmentSubmissionRequest, AppointmentSubmissionResponse, BlogPost, CaseStudy, Chamber, ChamberFees, DentalService, DoctorProfile, HomeContent, Testimonial } from "@/types/content";
import { ApiClientError } from "@/types/api";
import { Icon } from "@/components/ui/Icon";
import { AnimatedChars, Home2SectionTitle, TitleIcon } from "@/components/source/SourceHelpers";
import { Home2Button } from "@/components/source/Home2Button";
import { HomeHeroSlider } from "@/components/source/HomeHeroSlider";
import { HomeTwoAppointmentSection } from "@/features/home/sections/HomeTwoAppointmentSection";

function formatHome2Date(date: string) {
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;

  const day = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(parsed);
  const month = new Intl.DateTimeFormat("en", { month: "long" }).format(parsed);
  const year = new Intl.DateTimeFormat("en", { year: "numeric" }).format(parsed);

  return `${day} ${month}, ${year}`;
}

function CounterNumber({ target = 0, suffix = "" }: { target?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let played = false;
    const animate = () => {
      if (played) return;
      played = true;
      if (reduce) { setValue(target); return; }
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / 1000);
        setValue(Math.floor(target * progress));
        if (progress < 1) frame = window.requestAnimationFrame(tick);
      };
      frame = window.requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        animate();
        observer.disconnect();
      }
    }, { threshold: 0.2 });
    observer.observe(element);
    return () => { observer.disconnect(); if (frame) window.cancelAnimationFrame(frame); };
  }, [target]);

  return <span ref={ref}>{value}{suffix}</span>;
}

function HomeServiceCopy({ service }: { service: DentalService }) {
  if (service.homeCopyLead) {
    return <>{service.homeCopyLead}{service.homeCopyRest ? <span>{service.homeCopyRest}</span> : null}</>;
  }

  return <>{service.homeCopy}</>;
}

/**
 * The hero keeps its existing composition: the same background, the same single doctor image
 * on the right, and the same left-hand content card. Only the card's contents now come from
 * the typed slide model, so the current wording is preserved as slide 1 while three further
 * highlights are driven by the same records the rest of the page reads.
 */
function HomeTwoHero({ doctor, slides }: { doctor: DoctorProfile; slides: HeroSlide[] }) {
  return <section className="home2-hero overflow-hidden">
    <div className="home2-hero-bg" />
    <div className="home2-container home2-hero-inner">
      <div className="home2-hero-content">
        <div className="home2-hero-box home2-hero-box-sequence">
          <HomeHeroSlider slides={slides} />
        </div>
      </div>
      <div className="home2-hero-person" aria-hidden="true">
        <Image src={doctor.profileImage} alt={doctor.name} width={757} height={800} priority sizes="(max-width: 1199px) 70vw, 640px" />
      </div>
    </div>
  </section>;
}

/**
 * Home renders the canonical specialist profile that `/about` renders, reusing that section's
 * own design-system classes (`about-specialist-title/heading/role/focus/bio/meta/badges`) so
 * the two surfaces stay visually locked together instead of merely resembling each other.
 *
 * Only the media column is Home-specific: the two-image collage and the experience badge stay
 * on the left, exactly where the Home page has always had them. Content comes from the shared,
 * request-cached `getDoctorProfile()` service, so name, role, focus, academic post and
 * credentials cannot drift between the two pages.
 */
function HomeTwoAbout({ doctor }: { doctor: DoctorProfile }) {
  const about = doctor.aboutSpecialist;
  const profile = about.profile;
  const academic = about.academicPosition;

  return <section className="home2-about !relative !overflow-hidden" aria-label="About Specialist" data-reveal="up">
    <div className="home2-container">
      <div className="grid grid-cols-2 items-center gap-[30px] max-[1199px]:grid-cols-1">
        {/* Single-image treatment: the portrait sits on its soft-green plate, centred in its
            half of the two-column grid and sized to fill that column. The former collage
            (experience badge + secondary photo) has been removed, so the column is no longer
            a 420px frame plus a 195px stack. */}
        <div className="flex justify-center overflow-hidden max-[1199px]:mb-[30px] max-[767px]:block" data-reveal="up" style={{ transitionDelay: "0.2s" }}>
          <div className="home2-about-main-image !flex !items-end !justify-center !bg-[var(--home2-soft)] !shadow-[0_26px_60px_-34px_rgba(14,29,76,.32)]">
            <Image src={profile.portraitImage} alt={profile.portraitAlt} width={470} height={605} sizes="(max-width: 575px) 92vw, (max-width: 1199px) 470px, 470px" />
          </div>
        </div>
        {/* Copy column mirrors `/about` block for block: identity, title and speciality,
            biography, academic post, credentials, then the single retained CTA. */}
        <div className="home2-about-copy about-specialist-copy">
          <div className="source-title animation-style2 about-specialist-title" data-reveal="up">
            <p className="source-eyebrow"><TitleIcon />About Specialist</p>
            <h2 className="source-heading about-specialist-heading" data-title-reveal aria-label={profile.fullName}><AnimatedChars text={profile.fullName} /></h2>
          </div>
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
          {/* The section's one call to action, carried over from the Home page. */}
          <div data-reveal="up" className="!mt-[36px]">
            <Home2Button href="/about">Read More</Home2Button>
          </div>
        </div>
      </div>
    </div>
  </section>;
}

function HomeTwoServices({ services, intro }: { services: DentalService[]; intro: HomeContent["servicesIntro"] }) {
  const [active, setActive] = useState(0);
  const tabs = services.slice(0, 5);
  const panel = tabs[active] || tabs[0];
  if (!panel) return null;

  return <section className="home2-services" data-reveal="up">
    <div className="home2-container">
      <Home2SectionTitle eyebrow={intro.eyebrow} title={intro.title} center className="home2-services-title" />
      <div className="home2-services-tab">
        <nav className="home2-services-nav" aria-label="Dental services" data-reveal="up" style={{ transitionDelay: "0.5s" }}>
          {tabs.map((service, index) => <button key={service.slug} type="button" className={active === index ? "active" : ""} aria-current={active === index ? "true" : undefined} onClick={() => setActive(index)}><span>{service.number}.</span>{service.tabTitle}</button>)}
        </nav>
        <div className="home2-services-content" data-reveal="up" style={{ transitionDelay: "0.5s" }}>
          <div className="home2-service-panel active" key={panel.slug}>
            <article className="home2-service-card">
              <div className="home2-service-icon-row"><span className="home2-service-icon"><Image src={panel.homeIcon || panel.icon} alt="" width={70} height={70} /></span><span className="home2-service-number">{panel.number}</span></div>
              <div className="home2-service-text">
                <p><HomeServiceCopy service={panel} /></p>
                <Link href={`/services/${panel.slug}`} className="home2-service-read">read more</Link>
              </div>
            </article>
            <div className="home2-service-image"><Image src={panel.homeImage || panel.image} alt={panel.title} width={420} height={480} /></div>
          </div>
        </div>
      </div>
    </div>
  </section>;
}

function HomeTwoVideoCount({ doctor, home }: { doctor: DoctorProfile; home: HomeContent }) {
  return <section className="home2-video-count">
    <div className="home2-container">
      <div className="home2-video-button"><a href={home.videoCount.videoUrl} aria-label="Play video"><Icon name="play" size={34} /></a></div>
      <div className="home2-counter" style={{ backgroundImage: "url('/assets/img/count-h2-bg.jpg')" }}>
        {doctor.stats.map((item, index) => <div className="home2-counter-body" data-reveal="up" style={{ transitionDelay: `${0.2 + index * 0.1}s` }} key={item.label}>
          <div className="home2-counter-text"><h2><CounterNumber target={item.numeric} suffix={item.suffix || ""} /></h2><h3>{item.label}</h3></div>
        </div>)}
      </div>
    </div>
  </section>;
}

function HomeTwoChoose({ doctor, home }: { doctor: DoctorProfile; home: HomeContent }) {
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const image = imageRef.current;
    if (!image) return;
    const section = image.closest<HTMLElement>(".home2-choose");
    if (!section) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    const update = () => {
      frame = 0;
      if (reduceMotion || window.innerWidth <= 1199) {
        image.style.transform = "none";
        return;
      }
      const rect = section.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
      const yPercent = -15 + progress * 30;
      image.style.transform = `translate3d(0, ${yPercent.toFixed(2)}%, 0)`;
    };
    const requestUpdate = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });
    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return <section className="home2-choose" data-reveal="up">
    <div className="home2-container">
      <div className="home2-choose-grid">
        <div className="home2-choose-left"><div className="home2-choose-image"><Image ref={imageRef} src={home.choose.image} alt="Dental specialist planning" width={533} height={744} /></div></div>
        <div className="home2-choose-copy">
          <Home2SectionTitle eyebrow={home.choose.eyebrow} title={home.choose.title} className="home2-choose-title" />
          <div className="home2-choose-wrap">
            <p>{home.choose.description}</p>
            <div className="home2-patient-row">
              <Home2Button href="/services">Read More</Home2Button>
              {doctor.happyPatients ? <div className="home2-patient-box"><Image src={doctor.happyPatients.image} alt="Patients at the practice" width={150} height={60} /><div><h3>{doctor.happyPatients.value}</h3><p>{doctor.happyPatients.label}</p></div></div> : null}
            </div>
            <div className="home2-choose-bottom">
              {home.choose.items.map((item) => <article className="home2-choose-box" key={item.number}><span>{item.number}</span><h3><Link href="/services">{item.title}</Link></h3><p>{item.description}</p></article>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>;
}

function CaseCard({ item, index }: { item: CaseStudy; index: number }) {
  return <article className="home2-case-card" data-reveal="up" style={{ transitionDelay: `${0.2 + index * 0.1}s` }}>
    <div className="home2-case-image"><Link href={`/case-studies/${item.slug}`}><Image src={item.image} alt={item.title} width={420} height={320} /></Link><span>{item.label}</span></div>
    <form className="home2-case-form" action={`/case-studies/${item.slug}`}>
      <input type="text" placeholder={item.shortTitle} aria-label={item.title} readOnly />
      <button type="submit" aria-label={`Open ${item.title}`}><Icon name="arrow" size={22} strokeWidth={2.4} /></button>
    </form>
  </article>;
}

function HomeTwoCases({ cases, eyebrow, title }: { cases: CaseStudy[]; eyebrow: string; title: string }) {
  return <section className="home2-cases" data-reveal="up">
    <div className="home2-container">
      <Home2SectionTitle eyebrow={eyebrow} title={title} center className="home2-cases-title" />
      <div className="grid grid-cols-3 gap-[30px] max-[991px]:grid-cols-1">{cases.slice(0, 3).map((item, index) => <CaseCard item={item} index={index} key={item.slug} />)}</div>
    </div>
  </section>;
}

function HomeTwoTestimonials({ testimonials, eyebrow, title }: { testimonials: Testimonial[]; eyebrow: string; title: string }) {
  const [visible, setVisible] = useState(3);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const update = () => setVisible(window.innerWidth < 768 ? 1 : window.innerWidth < 992 ? 2 : 3);
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);
  const max = Math.max(0, testimonials.length - visible);
  useEffect(() => {
    if (visible >= 3 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActive((value) => value >= max ? 0 : value + 1), 3000);
    return () => window.clearInterval(timer);
  }, [max, visible]);
  const clamped = Math.min(active, max);
  const gap = visible === 1 ? 15 : 30;
  const stepPercent = 100 / visible;
  const stepPixels = gap / visible;
  const trackStyle = { "--visible": visible, "--gap": `${gap}px`, transform: `translateX(calc(-${clamped * stepPercent}% - ${clamped * stepPixels}px))` } as CSSProperties;
  return <section className="home2-testimonials" data-reveal="up">
    <div className="home2-container">
      <Home2SectionTitle eyebrow={eyebrow} title={title} center className="home2-testimonials-title" />
      <div className="home2-testimonial-viewport">
        <div className="home2-testimonial-track" style={trackStyle}>
          {testimonials.map((item, index) => {
            const rating = Math.max(0, Math.min(item.rating, 4));
            return <article className="home2-testimonial-card" data-reveal="up" style={{ transitionDelay: `${0.2 + (index % 3) * 0.1}s` }} key={`${item.role}-${index}`}>
              <div className="home2-testimonial-head"><span><Image src={item.image} alt="" width={60} height={60} /></span><strong aria-hidden="true">”</strong></div>
              <div className="home2-stars">{"★".repeat(rating)}<span>{"☆".repeat(Math.max(0, 5 - rating))}</span></div>
              <p>“{item.quote}”</p>
              <h3>{item.name}</h3><p className="home2-testimonial-role">{item.role}</p>
              <i className="home2-border-corner" aria-hidden="true" /><i className="home2-border-corner style2" aria-hidden="true" />
            </article>;
          })}
        </div>
      </div>
    </div>
  </section>;
}

function HomeTwoBlog({ posts, eyebrow, title }: { posts: BlogPost[]; eyebrow: string; title: string }) {
  const featuredPosts = useMemo(() => posts.slice(0, 4), [posts]);
  const loopItems = useMemo(() => [...featuredPosts, ...featuredPosts], [featuredPosts]);
  if (featuredPosts.length === 0) return null;

  return <section className="home2-blog home2-blog-carousel" data-reveal="up">
    <div className="home2-container">
      <div className="home2-blog-head">
        <Home2SectionTitle eyebrow={eyebrow} title={title} className="home2-blog-title" />
        <div className="home2-blog-nav" aria-label="Blog carousel controls"><button className="home2-blog-prev" type="button" aria-label="Previous blog">←</button><button className="home2-blog-next" type="button" aria-label="Next blog">→</button></div>
      </div>
      <Swiper className="home2-blog-viewport home2-blog-swiper" modules={[Autoplay, Navigation]} speed={1000} loop loopAdditionalSlides={featuredPosts.length} slidesPerView={1} slidesPerGroup={1} spaceBetween={10} grabCursor allowTouchMove touchEventsTarget="container" autoplay={{ delay: 3000, disableOnInteraction: false }} navigation={{ nextEl: ".home2-blog-next", prevEl: ".home2-blog-prev" }} breakpoints={{ 320: { slidesPerView: 1, spaceBetween: 10 }, 576: { slidesPerView: 1, spaceBetween: 15 }, 768: { slidesPerView: 2, spaceBetween: 15 }, 992: { slidesPerView: 3, spaceBetween: 20 }, 1200: { slidesPerView: 3, spaceBetween: 30 } }}>
        {loopItems.map((blog, index) => {
          const blogTitle = blog.homeTitle || blog.title;
          const blogImage = blog.homeImage || blog.image;
          return <SwiperSlide key={`${blog.slug}-${index}`}>
            <article className="home2-blog-card" data-reveal="up" style={{ transitionDelay: `${0.2 + (index % 3) * 0.1}s` }}>
              <div className="home2-blog-image"><Link href={`/blog/${blog.slug}`}><Image src={blogImage} alt={blogTitle} width={420} height={260} draggable={false} /></Link><p>{formatHome2Date(blog.date)}</p></div>
              <div className="home2-blog-content"><div className="home2-blog-meta"><Link href={`/blog/${blog.slug}`}><Icon name="user" size={14} strokeWidth={2.2} />{blog.author}</Link><Link href={`/blog/${blog.slug}`}><Icon name="comments" size={16} strokeWidth={2.2} />({String(blog.comments).padStart(2, "0")}) comments</Link></div><h3><Link href={`/blog/${blog.slug}`}>{blogTitle}</Link></h3><div className="home2-blog-buttons"><Link className="home2-blog-read" href={`/blog/${blog.slug}`}>read more</Link><Link className="home2-blog-share" href={`/blog/${blog.slug}`} aria-label={`Share ${blogTitle}`}><Icon name="share" size={18} /></Link></div></div>
            </article>
          </SwiperSlide>;
        })}
      </Swiper>
    </div>
  </section>;
}

export function HomeTwoDental({ doctor, home, services, cases, posts, testimonials, appointmentContent, chambers }: { doctor: DoctorProfile; home: HomeContent; services: DentalService[]; cases: CaseStudy[]; posts: BlogPost[]; testimonials: Testimonial[]; appointmentContent: AppointmentContent; chambers: Chamber[] }) {
  // Slide content is assembled in the domain layer from the same typed records the rest of the
  // page renders, so the hero adds no second data source and no new fetch.
  const heroSlides = buildHomeHeroSlides({ doctor, home, services, chambers });

  return <div className="home2-page">
    <HomeTwoHero doctor={doctor} slides={heroSlides} />
    <HomeTwoAbout doctor={doctor} />
    <HomeTwoServices services={services} intro={home.servicesIntro} />
    <HomeTwoVideoCount doctor={doctor} home={home} />
    <HomeTwoChoose doctor={doctor} home={home} />
    <HomeTwoCases cases={cases} eyebrow={home.caseEyebrow} title={home.caseTitle} />
    <HomeTwoAppointmentSection doctor={doctor} appointment={home.appointment} appointmentContent={appointmentContent} chambers={chambers} />
    <HomeTwoTestimonials testimonials={testimonials} eyebrow={home.testimonialEyebrow} title={home.testimonialTitle} />
    <HomeTwoBlog posts={posts} eyebrow={home.blogEyebrow} title={home.blogTitle} />
  </div>;
}
