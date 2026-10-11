"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, PointerEvent } from "react";
import type { BlogPost, DentalService, DoctorProfile, HomeContent, Testimonial } from "@/types/content";
import { Icon } from "@/components/ui/Icon";
import { AnimatedChars, TitleIcon } from "@/components/source/SourceHelpers";
import { AboutSpecialistSection } from "./AboutSpecialistSection";

function toYouTubeEmbed(url: string) {
  const fallback = "https://www.youtube.com/embed/o8OgzQdA70c?autoplay=1";
  try {
    const parsed = new URL(url);
    const videoId = parsed.hostname.includes("youtu.be") ? parsed.pathname.replace("/", "") : parsed.searchParams.get("v");
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : fallback;
  } catch {
    return fallback;
  }
}

function formatSourceDate(date: string) {
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  const day = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(parsed);
  const month = new Intl.DateTimeFormat("en", { month: "long" }).format(parsed);
  const year = new Intl.DateTimeFormat("en", { year: "numeric" }).format(parsed);
  return `${day} ${month}, ${year}`;
}

function VideoModal({ open, onClose, title, videoUrl }: { open: boolean; onClose: () => void; title: string; videoUrl: string }) {
  useEffect(() => {
    if (!open) return;
    document.body.classList.add("modal-open");
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;
  return <div className="video-modal" role="dialog" aria-modal="true" aria-label={title} onClick={onClose}>
    <div className="video-dialog" onClick={(event) => event.stopPropagation()}>
      <button className="video-close" type="button" aria-label="Close video" onClick={onClose}><Icon name="close" size={24} /></button>
      <div className="video-frame"><iframe src={toYouTubeEmbed(videoUrl)} title={title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen /></div>
    </div>
  </div>;
}

function AnimatedCounter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let started = false;
    const run = () => {
      if (started) return;
      started = true;
      if (reduce) { setDisplay(value); return; }
      const start = performance.now();
      const duration = 1000;
      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(Math.round(value * eased));
        if (progress < 1) frame = window.requestAnimationFrame(tick);
      };
      frame = window.requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        run();
        observer.disconnect();
      }
    }, { threshold: 0.2 });
    observer.observe(element);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, [value]);

  return <span ref={ref} className="about-counter-number">{display}</span>;
}

function useImageParallax(selector: string) {
  const imageRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const image = imageRef.current;
    if (!image) return;
    const section = image.closest<HTMLElement>(selector);
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
  }, [selector]);
  return imageRef;
}

function AboutServices({ services }: { services: DentalService[] }) {
  const servicesPerLoop = services.length;
  const initialPosition = servicesPerLoop;
  const [visible, setVisible] = useState(3);
  const [gap, setGap] = useState(30);
  const [position, setPosition] = useState(initialPosition);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; pointerId: number; startHoverIndex: number | null } | null>(null);
  const draggedRef = useRef(false);
  const loopedServices = useMemo(() => [...services, ...services, ...services], [services]);
  const stepPercent = 100 / visible;
  const stepPixels = gap / visible;
  const cardBasis = `calc((100% - ${(visible - 1) * gap}px) / ${visible})`;
  const trackStyle = {
    "--service-gap": `${gap}px`,
    "--service-item-basis": cardBasis,
    transform: `translateX(calc(-${position * stepPercent}% - ${position * stepPixels}px + ${dragOffset}px))`,
    transition: transitionEnabled ? undefined : "none"
  } as CSSProperties;

  useEffect(() => { setPosition(services.length); }, [services.length]);

  const enableTransitionNextFrame = useCallback(() => {
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => setTransitionEnabled(true)));
  }, []);

  const cardIndexFromPoint = useCallback((clientX: number, clientY: number) => {
    const card = document.elementFromPoint(clientX, clientY)?.closest<HTMLElement>(".about-service-carousel .home-service-card");
    const index = card?.dataset.aboutServiceIndex ? Number(card.dataset.aboutServiceIndex) : Number.NaN;
    return Number.isFinite(index) ? index : null;
  }, []);

  const getStepPx = useCallback(() => {
    const firstCard = trackRef.current?.querySelector<HTMLElement>(".home-service-card");
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
    const update = () => {
      const width = window.innerWidth;
      setVisible(width < 768 ? 1 : width < 992 ? 2 : 3);
      setGap(width < 576 ? 10 : width < 992 ? 15 : width < 1200 ? 20 : 30);
    };
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (isDragging || servicesPerLoop === 0 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(next, 3000);
    return () => window.clearInterval(timer);
  }, [isDragging, next, servicesPerLoop]);

  const resetLoopPosition = useCallback(() => {
    if (isDragging || servicesPerLoop === 0) return;
    if (position < servicesPerLoop || position >= servicesPerLoop * 2) {
      const normalized = servicesPerLoop + ((position % servicesPerLoop) + servicesPerLoop) % servicesPerLoop;
      setTransitionEnabled(false);
      setPosition(normalized);
      enableTransitionNextFrame();
    }
  }, [enableTransitionNextFrame, isDragging, position, servicesPerLoop]);

  const startDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const startHoverIndex = cardIndexFromPoint(event.clientX, event.clientY);
    dragRef.current = { startX: event.clientX, pointerId: event.pointerId, startHoverIndex };
    draggedRef.current = false;
    setHoveredIndex(startHoverIndex);
    setIsDragging(true);
    setTransitionEnabled(false);
    setDragOffset(0);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const updateDrag = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    const deltaX = event.clientX - drag.startX;
    if (Math.abs(deltaX) > 4) draggedRef.current = true;
    event.preventDefault();
    setDragOffset(deltaX);
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

  return <section className="home-service about-service-carousel source-service-section" data-reveal="up">
    <div className="home-service-container">
      <div className="source-title source-title-center animation-style2 home-service-title">
        <p className="source-eyebrow source-eyebrow-center"><TitleIcon />Service<TitleIcon /></p>
        <h2 className="source-heading home-service-heading" data-title-reveal aria-label="Delivering Trusted Dental Care With Precision"><AnimatedChars text="Delivering Trusted Dental Care With Precision" /></h2>
      </div>
      <div className="home-service-slider" aria-roledescription="carousel">
        <div
          ref={viewportRef}
          className={`home-service-viewport ${isDragging ? "is-dragging" : ""}`}
          aria-label="Draggable about page service carousel"
          onPointerDown={startDrag}
          onPointerMove={updateDrag}
          onPointerUp={finishDrag}
          onPointerCancel={finishDrag}
          onMouseLeave={() => { if (!isDragging) setHoveredIndex(null); }}
          onClickCapture={(event) => {
            if (!draggedRef.current) return;
            event.preventDefault();
            event.stopPropagation();
            draggedRef.current = false;
          }}
        >
          <div ref={trackRef} className="home-service-track" style={trackStyle} onTransitionEnd={(event) => { if (event.propertyName === "transform") resetLoopPosition(); }}>
            {loopedServices.map((service, index) => <article className={`home-service-card is-visible ${hoveredIndex === index ? "is-cursor-hover" : ""}`} key={`${service.slug}-${index}`} data-about-service-index={index} data-reveal="up" style={{ transitionDelay: `${0.2 + (index % 4) * 0.1}s` }} onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => { if (!isDragging) setHoveredIndex(null); }}>
              <div className="home-service-icon-row">
                <div className="home-service-icon"><Image src={service.icon} alt="" width={70} height={70} draggable={false} /></div>
                <span className="home-service-number">{service.number}</span>
              </div>
              <div className="home-service-text">
                <Link href={`/services/${service.slug}`}><h3>{service.title}</h3></Link>
                <p>{service.summary}</p>
                <Link href={`/services/${service.slug}`} className="home-service-link">Read More</Link>
              </div>
            </article>)}
          </div>
        </div>
        <div className="home-service-navigation" aria-label="About page service carousel controls">
          <button type="button" aria-label="Previous service" onClick={prev}><Icon name="arrow" size={18} /></button>
          <button type="button" aria-label="Next service" onClick={next}><Icon name="arrow" size={18} /></button>
        </div>
      </div>
    </div>
  </section>;
}

function AboutVideoCounter({ doctor, home }: { doctor: DoctorProfile; home: HomeContent }) {
  const [videoOpen, setVideoOpen] = useState(false);
  return <section className="about-videoCount" data-reveal="up">
    <div className="about-source-container about-videoCount-container">
      <div className="about-videoCount-button">
        <button type="button" className="about-play-btn" aria-label="Play dental specialist introduction video" onClick={() => setVideoOpen(true)}><Icon name="play" size={36} strokeWidth={2.4} /></button>
      </div>
      <div className="about-counter-panel" aria-label="Dental specialist statistics">
        {doctor.stats.map((item, index) => <div className="about-counter-body" data-reveal="up" style={{ transitionDelay: `${0.2 + index * 0.1}s` }} key={item.label}>
          <div className="about-counter-txt">
            <h2><AnimatedCounter value={item.numeric || 0} />{item.suffix || ""}</h2>
            <h3>{item.label}</h3>
          </div>
        </div>)}
      </div>
    </div>
    <VideoModal open={videoOpen} onClose={() => setVideoOpen(false)} title="Dental specialist introduction video" videoUrl={home.videoCount.videoUrl} />
  </section>;
}

function AboutChoose({ doctor, home }: { doctor: DoctorProfile; home: HomeContent }) {
  const imageRef = useImageParallax(".about-choose-source");
  return <section className="about-choose-source" data-reveal="up">
    <div className="about-source-container">
      <div className="about-choose-grid">
        <div className="about-choose-left">
          <div className="about-choose-img"><Image ref={imageRef} src={home.choose.image} alt="Dental patient support" width={533} height={744} sizes="(max-width: 991px) 100vw, 533px" /></div>
        </div>
        <div className="about-choose-right">
          <div className="source-title animation-style2 about-choose-title">
            <p className="source-eyebrow"><TitleIcon />{home.choose.eyebrow}</p>
            <h2 className="source-heading about-choose-heading" data-title-reveal aria-label={home.choose.title}><AnimatedChars text={home.choose.title} /></h2>
          </div>
          <div className="about-choose-wrap">
            <p className="about-choose-copy">{home.choose.description}</p>
            <div className="about-patient-row">
              <Link className="about-read-btn" href="/services">Read More<span aria-hidden="true" /></Link>
              {doctor.happyPatients ? <div className="about-patient-box">
                <Image src={doctor.happyPatients.image} alt="Patients at the practice" width={150} height={60} />
                <div className="about-patient-txt"><h3>{doctor.happyPatients.value}</h3><p>{doctor.happyPatients.label}</p></div>
              </div> : null}
            </div>
            <div className="about-choose-bottom">
              {home.choose.items.map((card) => <article className="about-choose-box" key={card.number}>
                <div className="about-choose-icon"><span>{card.number}</span></div>
                <div className="about-choose-txt"><Link href="/services"><h3>{card.title}</h3></Link><p>{card.description}</p></div>
              </article>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>;
}

function SourceTestimonials({ testimonials, title }: { testimonials: Testimonial[]; title: string }) {
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
          <h2 className="source-heading home-testimonial-heading" data-title-reveal aria-label={title}><AnimatedChars text={title} /></h2>
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
            <div className="home-testimonial-stars" aria-label="4.5 out of 5 stars">★★★★☆</div>
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

function SourceBlog({ posts }: { posts: BlogPost[] }) {
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

export function AboutSourcePage({ doctor, home, services, testimonials, posts }: { doctor: DoctorProfile; home: HomeContent; services: DentalService[]; testimonials: Testimonial[]; posts: BlogPost[] }) {
  return <>
    <AboutSpecialistSection doctor={doctor} />
    <AboutServices services={services} />
    <AboutVideoCounter doctor={doctor} home={home} />
    <AboutChoose doctor={doctor} home={home} />
    <SourceTestimonials testimonials={testimonials} title={home.testimonialTitle} />
    <SourceBlog posts={posts} />
  </>;
}
