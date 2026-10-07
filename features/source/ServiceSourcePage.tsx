"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, PointerEvent } from "react";
import { submitAppointmentRequest } from "@/features/dental/submission.service";
import type { BlogPost, DentalService, DoctorProfile, Testimonial } from "@/types/content";
import { Icon } from "@/components/ui/Icon";
import { EmptyState } from "@/components/ui/DataState";
import { AnimatedChars, TitleIcon } from "@/components/source/SourceHelpers";
import { ScopedRevealGuard } from "./ScopedRevealGuard";

function serviceHref(slug: string) {
  return `/services/${slug}`;
}

function formatSourceDate(date: string) {
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  const day = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(parsed);
  const month = new Intl.DateTimeFormat("en", { month: "long" }).format(parsed);
  const year = new Intl.DateTimeFormat("en", { year: "numeric" }).format(parsed);
  return `${day} ${month}, ${year}`;
}

export function SourceServiceGrid({ services }: { services: DentalService[] }) {
  return <section className="source-service-page" data-reveal="up">
    <div className="source-page-container">
      {services.length === 0 ? <EmptyState title="No services available" message="Service content is not available from the API yet." /> : <div className="source-service-grid">
        {services.map((service, index) => <article className="source-service-card" key={service.slug} data-reveal="up" style={{ transitionDelay: `${0.2 + Math.min(index, 3) * 0.1}s` }}>
          <div className="source-service-icon-row"><span className="source-service-icon"><Image src={service.icon} alt="" width={70} height={70} /></span><span className="source-service-number">{service.number}</span></div>
          <div className="source-service-text"><Link href={serviceHref(service.slug)}><h2>{service.title}</h2></Link><p>{service.summary}</p><Link href={serviceHref(service.slug)} className="source-service-read">Read More</Link></div>
        </article>)}
      </div>}
    </div>
  </section>;
}

export function SourceServiceAppointment({ doctor, services }: { doctor: DoctorProfile; services: DentalService[] }) {
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setSent(false);
    setMessage("");
    const form = event.currentTarget;
    const formData = new FormData(form);
    try {
      const response = await submitAppointmentRequest({
        name: String(formData.get("name") || ""),
        email: String(formData.get("email") || ""),
        service: String(formData.get("department") || ""),
        preferredDate: String(formData.get("date") || ""),
        message: "Appointment requested from the dental services page for a consultation."
      });
      setMessage(response.message || "Thank you. Your appointment request has been received.");
      setSent(true);
      form.reset();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return <section className="source-service-appoint" data-reveal="up">
    <div className="source-page-container">
      <div className="source-service-appoint-content">
        <div className="source-service-appoint-head">
          <div className="source-title source-title-light source-service-appoint-title animation-style2">
            <p className="source-eyebrow source-eyebrow-light"><TitleIcon />Appointment</p>
            <h2 className="source-heading source-heading-light source-service-appoint-heading" data-title-reveal aria-label="Make An Appointment For Consulting"><AnimatedChars text="Make An Appointment For Consulting" /></h2>
          </div>
          <div className="source-service-callbox">
            <span><Icon name="headphones" size={30} /></span>
            <p><small>Call Us 24/7</small><a href={`tel:${doctor.phone.replace(/\s/g, "")}`}>{doctor.phone}</a></p>
          </div>
        </div>
        {sent ? <div className="source-service-appoint-success" role="status">{message}</div> : <form className="source-service-appoint-form" onSubmit={onSubmit} data-reveal="up">
          <input name="name" type="text" placeholder="Your Name" required />
          <input name="email" type="email" placeholder="Email Address" required />
          <select name="department" aria-label="Select Service" defaultValue=""><option value="" disabled>Select Service</option>{services.map((service) => <option key={service.slug}>{service.title}</option>)}</select>
          <select name="doctor" aria-label="Select Specialist" defaultValue={doctor.name}><option>{doctor.name}</option></select>
          <input name="date" aria-label="Appointment date" type="date" />
          <button type="submit">{submitting ? "Submitting..." : "Make An Appointment"}</button>
        </form>}
        {!sent && message ? <div className="source-service-appoint-success" role="alert">{message}</div> : null}
      </div>
    </div>
  </section>;
}

export function SourceTestimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const testimonialsPerLoop = testimonials.length;
  const initialPosition = testimonialsPerLoop + 1;
  const [visible, setVisible] = useState(3);
  const [position, setPosition] = useState(initialPosition);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; pointerId: number; startHoverIndex: number | null } | null>(null);
  const loopedTestimonials = useMemo(() => [...testimonials, ...testimonials, ...testimonials], [testimonials]);
  const gap = visible === 1 ? 15 : 30;
  const stepPercent = 100 / visible;
  const stepPixels = visible === 3 ? 10 : visible === 2 ? 15 : gap;
  const trackStyle = {
    "--testimonial-gap": `${gap}px`,
    transform: `translateX(calc(-${position * stepPercent}% - ${position * stepPixels}px + ${dragOffset}px))`,
    transition: transitionEnabled ? undefined : "none"
  } as CSSProperties;

  useEffect(() => { setPosition(testimonials.length + 1); }, [testimonials.length]);

  const enableTransitionNextFrame = useCallback(() => {
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => setTransitionEnabled(true)));
  }, []);

  const cardIndexFromPoint = useCallback((clientX: number, clientY: number) => {
    const card = document.elementFromPoint(clientX, clientY)?.closest<HTMLElement>(".home-testimonial-card");
    const index = card?.dataset.testimonialIndex ? Number(card.dataset.testimonialIndex) : Number.NaN;
    return Number.isFinite(index) ? index : null;
  }, []);

  const getStepPx = useCallback(() => {
    const firstCard = trackRef.current?.querySelector<HTMLElement>(".home-testimonial-card");
    if (firstCard) return firstCard.getBoundingClientRect().width + gap;
    const viewportWidth = viewportRef.current?.getBoundingClientRect().width ?? 0;
    return viewportWidth ? (viewportWidth + gap) / visible : 0;
  }, [gap, visible]);

  const moveBy = useCallback((amount: number) => {
    setTransitionEnabled(true);
    setDragOffset(0);
    setPosition((value) => value + amount);
  }, []);

  const next = useCallback(() => moveBy(1), [moveBy]);
  const prev = useCallback(() => moveBy(-1), [moveBy]);

  useEffect(() => {
    const update = () => setVisible(window.innerWidth < 768 ? 1 : window.innerWidth < 992 ? 2 : 3);
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (isDragging || testimonialsPerLoop === 0 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(next, 3000);
    return () => window.clearInterval(timer);
  }, [isDragging, next, testimonialsPerLoop]);

  const resetLoopPosition = useCallback(() => {
    if (isDragging || testimonialsPerLoop === 0) return;
    if (position < testimonialsPerLoop || position >= testimonialsPerLoop * 2) {
      const normalized = testimonialsPerLoop + ((position % testimonialsPerLoop) + testimonialsPerLoop) % testimonialsPerLoop;
      setTransitionEnabled(false);
      setPosition(normalized);
      enableTransitionNextFrame();
    }
  }, [enableTransitionNextFrame, isDragging, position, testimonialsPerLoop]);

  const startDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const startHoverIndex = cardIndexFromPoint(event.clientX, event.clientY);
    dragRef.current = { startX: event.clientX, pointerId: event.pointerId, startHoverIndex };
    setHoveredIndex(startHoverIndex);
    setIsDragging(true);
    setTransitionEnabled(false);
    setDragOffset(0);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const updateDrag = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    event.preventDefault();
    setDragOffset(event.clientX - drag.startX);
    setHoveredIndex(cardIndexFromPoint(event.clientX, event.clientY) ?? drag.startHoverIndex);
  };

  const finishDrag = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    const deltaX = event.clientX - drag.startX;
    const stepPx = getStepPx();
    const threshold = stepPx ? Math.min(90, Math.max(40, stepPx * 0.22)) : 45;
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(drag.pointerId)) event.currentTarget.releasePointerCapture(drag.pointerId);
    setIsDragging(false);
    setTransitionEnabled(true);
    setDragOffset(0);
    if (Math.abs(deltaX) > threshold) {
      setPosition((value) => value + (deltaX < 0 ? 1 : -1));
    }
    window.requestAnimationFrame(() => setHoveredIndex(cardIndexFromPoint(event.clientX, event.clientY)));
  };

  return <section className="home-testimonial" data-reveal="up">
    <div className="home-source-container">
      <div className="home-testimonial-head">
        <div className="source-title animation-style2">
          <p className="source-eyebrow"><TitleIcon />Testimonials</p>
          <h2 className="source-heading home-testimonial-heading" data-title-reveal aria-label="Feedback & Review From Demo Patients"><AnimatedChars text="Feedback & Review From Demo Patients" /></h2>
        </div>
        <div className="home-section-navigation home-testimonial-nav" aria-label="Testimonial carousel controls">
          <button type="button" aria-label="Previous testimonial" onClick={prev}><Icon name="arrow" size={18} /></button>
          <button type="button" aria-label="Next testimonial" onClick={next}><Icon name="arrow" size={18} /></button>
        </div>
      </div>
      <div
        ref={viewportRef}
        className={`home-testimonial-viewport ${isDragging ? "is-dragging" : ""}`}
        aria-label="Draggable testimonial carousel"
        onPointerDown={startDrag}
        onPointerMove={updateDrag}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        onMouseLeave={() => { if (!isDragging) setHoveredIndex(null); }}
      >
        <div ref={trackRef} className="home-testimonial-track" onTransitionEnd={(event) => { if (event.propertyName === "transform") resetLoopPosition(); }} style={trackStyle}>
          {loopedTestimonials.map((item, index) => <article className={`home-testimonial-card is-visible ${hoveredIndex === index ? "is-cursor-hover" : ""}`} data-testimonial-index={index} data-reveal="up" style={{ transitionDelay: `${0.2 + (index % 3) * 0.1}s` }} key={`${item.role}-${index}`} onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => { if (!isDragging) setHoveredIndex(null); }}>
            <div className="home-testimonial-image-row"><span className="home-testimonial-avatar"><Image src={item.image} alt={item.name} fill sizes="60px" draggable={false} /></span><span className="home-testimonial-quote" aria-hidden="true"><Image className="comma-primary" src="/assets/img/comma.png" alt="" fill sizes="64px" draggable={false} /><Image className="comma-alt" src="/assets/img/comma2.png" alt="" fill sizes="64px" draggable={false} /></span></div>
            <div className="home-testimonial-stars" aria-label={`${item.rating || 5} out of 5 stars`}>★★★★☆</div>
            <p>“{item.quote}”</p>
            <div className="home-testimonial-admin"><h3>{item.name}</h3><span>{item.role}</span></div>
          </article>)}
        </div>
      </div>
    </div>
  </section>;
}

function BlogMetaIcon({ type }: { type: "user" | "comments" }) {
  if (type === "comments") return <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16"><path d="M7 14h7.5a5.5 5.5 0 1 0 0-11H7a5.5 5.5 0 0 0 0 11Zm-2 1.5L2.6 20a.7.7 0 0 0 .95.94l5.2-2.44h5.75a7.5 7.5 0 0 0 7.18-5.34 7 7 0 0 1-7.18 6.84H8.9l-5.3 2.48A1.9 1.9 0 0 1 1 20.02l2.76-5.15c.38.25.8.46 1.24.63Z" fill="currentColor"/></svg>;
  return <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16"><path d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm0 2.25c-4.15 0-7.5 2.15-7.5 4.8 0 .83.67 1.5 1.5 1.5h12c.83 0 1.5-.67 1.5-1.5 0-2.65-3.35-4.8-7.5-4.8Z" fill="currentColor"/></svg>;
}

export function SourceBlog({ posts }: { posts: BlogPost[] }) {
  return <section className="home-blog" data-reveal="up">
    <div className="home-source-container">
      <div className="source-title source-title-center animation-style2 home-blog-title">
        <p className="source-eyebrow source-eyebrow-center"><TitleIcon />Blog & News<TitleIcon /></p>
        <h2 className="source-heading home-blog-heading" data-title-reveal aria-label="Dental Advice For Confident Patients"><AnimatedChars text="Dental Advice For Confident Patients" /></h2>
      </div>
      <div className="home-blog-grid">
        {posts.slice(0, 3).map((post, index) => <article className="home-blog-card" data-reveal="up" style={{ transitionDelay: `${0.2 + index * 0.1}s` }} key={post.slug}>
          <div className="home-blog-image"><Link href={`/blog/${post.slug}`}><Image src={post.homeImage || post.image} alt={post.homeTitle || post.title} fill sizes="420px" /></Link><p>{formatSourceDate(post.date)}</p></div>
          <div className="home-blog-content">
            <div className="home-blog-meta"><Link href={`/blog/${post.slug}`}><BlogMetaIcon type="user" /> {post.author}</Link><Link href={`/blog/${post.slug}`}><BlogMetaIcon type="comments" /> ({String(post.comments).padStart(2, "0")}) Comments</Link></div>
            <h3><Link href={`/blog/${post.slug}`}>{post.homeTitle || post.title}</Link></h3>
            <div className="home-blog-actions"><Link className="home-blog-read" href={`/blog/${post.slug}`}>Read More</Link><Link className="home-blog-share" href={`/blog/${post.slug}`} aria-label={`Share ${post.title}`}><Icon name="share" size={18} /></Link></div>
          </div>
        </article>)}
      </div>
    </div>
  </section>;
}

export function ServiceSourcePage({ doctor, services, testimonials, posts }: { doctor: DoctorProfile; services: DentalService[]; testimonials: Testimonial[]; posts: BlogPost[] }) {
  const revealWatchKey = [
    "services",
    services.length,
    services.map((service) => service.slug).join("|"),
    testimonials.length,
    posts.slice(0, 3).map((post) => post.slug).join("|")
  ].join(":");

  return <div data-service-page-scope>
    <ScopedRevealGuard scopeSelector="[data-service-page-scope]" watchKey={revealWatchKey} />
    <SourceServiceGrid services={services} />
    <SourceServiceAppointment doctor={doctor} services={services} />
    <SourceTestimonials testimonials={testimonials} />
    <SourceBlog posts={posts} />
  </div>;
}
