"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { submitAppointmentRequest } from "@/features/dental/submission.service";
import type { BlogPost, CaseStudy, DentalService, DoctorProfile, HomeContent, Testimonial } from "@/types/content";
import { Icon } from "@/components/ui/Icon";
import { Home2SectionTitle } from "@/components/source/SourceHelpers";
import { Home2Button } from "@/components/source/Home2Button";

function telephoneHref(phone: string) {
  return `tel:${phone.replace(/\s/g, "")}`;
}

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

function HomeTwoHero({ doctor }: { doctor: DoctorProfile }) {
  const highlighted = doctor.heroHighlight && doctor.heroTitle.includes(doctor.heroHighlight)
    ? doctor.heroTitle.replace(doctor.heroHighlight, "")
    : doctor.heroTitle;

  return <section className="home2-hero overflow-hidden">
    <div className="home2-hero-bg" />
    <div className="home2-container home2-hero-inner">
      <div className="home2-hero-content">
        <div className="home2-hero-box home2-hero-box-sequence">
          <span className="home2-hero-sub"><span className="home2-title-icon-white" aria-hidden="true" />{doctor.heroEyebrow}</span>
          <h1>{highlighted}{doctor.heroHighlight ? <span>{doctor.heroHighlight}</span> : null}</h1>
          <p>{doctor.heroDescription}</p>
          <div className="home2-hero-actions">
            <Home2Button href="/contact" className="home2-btn-dark">{doctor.appointmentCta}</Home2Button>
            <a className="home2-hero-call" href={telephoneHref(doctor.phone)}>
              <span><Icon name="headphones" size={28} /></span>
              <p><small>Emergency Call</small>{doctor.phone}</p>
            </a>
          </div>
        </div>
      </div>
      <div className="home2-hero-person" aria-hidden="true">
        <Image src={doctor.profileImage} alt={doctor.name} width={655} height={757} priority />
      </div>
    </div>
  </section>;
}

function HomeTwoAbout({ doctor }: { doctor: DoctorProfile }) {
  return <section className="home2-about" data-reveal="up">
    <div className="home2-container">
      <div className="home2-about-grid">
        <div className="home2-about-images" data-reveal="up" style={{ transitionDelay: "0.2s" }}>
          <div className="home2-about-main-image"><Image src={doctor.aboutImages.main} alt="Dental consultation" width={420} height={540} data-parallax /></div>
          <div className="home2-about-side">
            <div className="home2-experience"><strong>{doctor.stats[0]?.value || "12+"}</strong><span>Years of Focused Care</span></div>
            <Image src={doctor.aboutImages.side} alt="Dental planning detail" width={195} height={311} />
          </div>
        </div>
        <div className="home2-about-copy">
          <Home2SectionTitle eyebrow="About Specialist" title={doctor.homeAboutTitle || doctor.aboutTitle} className="home2-about-title" />
          <div className="home2-about-right" data-reveal="up" style={{ transitionDelay: "0.2s" }}>
            <p>{doctor.homeAboutDescription || doctor.aboutDescription}</p>
            <div className="home2-about-boxes">
              <div className="home2-question-box">
                <h3>{doctor.questionBox?.title || "Have Any Question?"}</h3>
                <p>{doctor.questionBox?.description || doctor.emergencyNote}</p>
                <a className="home2-question-call" href={telephoneHref(doctor.phone)}>
                  <span><Icon name="headphones" size={28} /></span>
                  <p><small>Emergency Call</small>{doctor.phone}</p>
                </a>
              </div>
              <div className="home2-about-list-wrap">
                <ul>
                  {doctor.highlights.map((item) => <li key={item}><Icon name="check" size={15} />{item}</li>)}
                </ul>
                <Home2Button href="/about">Read More</Home2Button>
              </div>
            </div>
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
              {doctor.happyPatients ? <div className="home2-patient-box"><Image src={doctor.happyPatients.image} alt="Demo patient group" width={150} height={60} /><div><h3>{doctor.happyPatients.value}</h3><p>{doctor.happyPatients.label}</p></div></div> : null}
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
      <div className="home2-case-grid">{cases.slice(0, 3).map((item, index) => <CaseCard item={item} index={index} key={item.slug} />)}</div>
    </div>
  </section>;
}

function HomeTwoAppointment({ doctor, services, appointment }: { doctor: DoctorProfile; services: DentalService[]; appointment: HomeContent["appointment"] }) {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage("");
    const form = event.currentTarget;
    const formData = new FormData(form);
    try {
      await submitAppointmentRequest({
        name: String(formData.get("name") || ""),
        email: String(formData.get("email") || ""),
        phone: String(formData.get("phone") || ""),
        service: String(formData.get("service") || ""),
        preferredDate: String(formData.get("date") || ""),
        message: String(formData.get("message") || "Appointment requested from Home-2 form.")
      });
      setSuccessMessage(appointment.successMessage);
      form.reset();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return <section className="home2-appointment" data-reveal="up">
    <div className="home2-container">
      <div className="home2-appointment-card" style={{ backgroundImage: "url('/assets/img/appoint-overImg2-h1.png')" }}>
        <div className="home2-appointment-left">
          <Home2SectionTitle eyebrow={appointment.eyebrow} title={appointment.title} light className="home2-appointment-title" />
          <div className="home2-appointment-contact" data-reveal="up" style={{ transitionDelay: "0.3s" }}>
            <div><span><Icon name="headphones" size={30} /></span><p><small>Call Us 24/7</small><a href={telephoneHref(doctor.phone)}>{doctor.phone}</a></p></div>
            <div><span><Icon name="mail" size={30} /></span><p><small>Need Assistance?</small><a href={`mailto:${doctor.email}`}>{doctor.email}</a></p></div>
          </div>
        </div>
        <div className="home2-appointment-form-wrap" data-reveal="up" style={{ transitionDelay: "0.4s" }}>
          {successMessage ? <p className="home2-appointment-success" role="status">{successMessage}</p> : <form onSubmit={onSubmit}>
            <div className="home2-appointment-grid">
              <input name="name" type="text" placeholder="Your Name" required />
              <input name="email" type="email" placeholder="Email Address" required />
              <input name="phone" type="text" placeholder="Phone Number" required />
              <select name="service" aria-label="Select Department" defaultValue=""><option value="" disabled>Select Department</option>{services.map((service) => <option key={service.slug}>{service.title}</option>)}</select>
              <select name="doctor" aria-label="Select Doctor" defaultValue={doctor.name}><option>{doctor.name}</option></select>
              <input name="date" aria-label="Appointment date" type="date" />
            </div>
            <textarea name="message" placeholder="Type Your Message" />
            <div className="home2-appointment-submit"><Home2Button type="submit">{submitting ? "Submitting..." : "Make An Appointment"}</Home2Button></div>
            {errorMessage ? <p className="home2-appointment-success" role="alert">{errorMessage}</p> : null}
          </form>}
        </div>
      </div>
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
              <div className="home2-testimonial-head"><span><Image src={item.image} alt="Demo patient feedback" width={60} height={60} /></span><strong aria-hidden="true">”</strong></div>
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

export function HomeTwoDental({ doctor, home, services, cases, posts, testimonials }: { doctor: DoctorProfile; home: HomeContent; services: DentalService[]; cases: CaseStudy[]; posts: BlogPost[]; testimonials: Testimonial[] }) {
  return <div className="home2-page">
    <HomeTwoHero doctor={doctor} />
    <HomeTwoAbout doctor={doctor} />
    <HomeTwoServices services={services} intro={home.servicesIntro} />
    <HomeTwoVideoCount doctor={doctor} home={home} />
    <HomeTwoChoose doctor={doctor} home={home} />
    <HomeTwoCases cases={cases} eyebrow={home.caseEyebrow} title={home.caseTitle} />
    <HomeTwoAppointment doctor={doctor} services={services} appointment={home.appointment} />
    <HomeTwoTestimonials testimonials={testimonials} eyebrow={home.testimonialEyebrow} title={home.testimonialTitle} />
    <HomeTwoBlog posts={posts} eyebrow={home.blogEyebrow} title={home.blogTitle} />
  </div>;
}
