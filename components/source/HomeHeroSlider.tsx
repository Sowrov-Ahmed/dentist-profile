"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { FocusEvent as ReactFocusEvent } from "react";
import { A11y, Autoplay, Keyboard } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Icon } from "@/components/ui/Icon";
import { Home2Button } from "@/components/source/Home2Button";
import type { HeroSlide } from "@/features/home/hero.domain";

const AUTOPLAY_DELAY_MS = 6000;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(REDUCED_MOTION_QUERY);
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return reduced;
}

/**
 * Home hero carousel.
 *
 * Renders the left-hand content card only: the eyebrow, headline, supporting copy, primary
 * CTA and dot indicators change per slide, while the doctor's image beside it is rendered by
 * the parent and never animated or swapped.
 *
 * Built on Swiper — already a dependency used by the Home blog carousel — so loop, swipe,
 * keyboard and autoplay come from the same library rather than a second carousel
 * implementation. This component holds no business data: every string, route and contact
 * detail arrives through `slides`, which the Home domain layer builds from the typed records.
 */
export function HomeHeroSlider({ slides }: { slides: HeroSlide[] }) {
  const swiperRef = useRef<SwiperClass | null>(null);
  const [active, setActive] = useState(0);
  const reducedMotion = usePrefersReducedMotion();

  // `realIndex` keeps the dot indicator correct across the loop wrap-around, where the raw
  // slide index runs past the end of the array.
  useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper) return;
    const sync = () => setActive(swiper.realIndex);
    swiper.on("slideChange", sync);
    swiper.on("loopFix", sync);
    return () => {
      swiper.off("slideChange", sync);
      swiper.off("loopFix", sync);
    };
  }, []);

  // Swiper caches each slide's geometry. Re-measuring once the slides exist (and again if the
  // slide count ever changes) keeps the slide transform, the fixed card height and the active
  // dot in agreement; Swiper already handles window resizes on its own.
  useEffect(() => {
    swiperRef.current?.update();
  }, [slides.length]);

  const goTo = useCallback((index: number) => {
    swiperRef.current?.slideToLoop(index);
  }, []);

  const pause = useCallback(() => {
    swiperRef.current?.autoplay?.pause();
  }, []);

  const resume = useCallback(() => {
    if (reducedMotion) return;
    swiperRef.current?.autoplay?.resume();
  }, [reducedMotion]);

  /**
   * Autoplay pauses while a keyboard user is inside the slider, and only for keyboard focus.
   *
   * Pausing on every `focusin` looked right but was what actually stalled the loop: clicking
   * a dot also focuses it, focus never leaves the container afterwards, and autoplay stayed
   * paused forever — the carousel appeared to "stop". Matching `:focus-visible` separates the
   * two intents, so a mouse click changes the slide and keeps the rotation running, while a
   * keyboard visitor still gets a stable carousel to read with focus inside it.
   */
  const handleFocusCapture = useCallback((event: ReactFocusEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement | null;
    if (target?.matches(":focus-visible")) pause();
  }, [pause]);

  /**
   * `resume` runs on the blur that precedes a move *within* the slider too (tabbing from one
   * dot to the next). Re-checking on the following focus keeps the carousel paused while
   * keyboard focus is still inside, and only restarts it once focus has genuinely left.
   */
  const handleBlurCapture = useCallback((event: ReactFocusEvent<HTMLDivElement>) => {
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
    resume();
  }, [resume]);

  if (slides.length === 0) return null;

  // A single slide needs no carousel machinery, so no dots, live region or autoplay timer
  // are created for a one-panel hero.
  if (slides.length === 1) {
    return <div className="home2-hero-slider home2-hero-slider-single">{renderSlideBody(slides[0], true)}</div>;
  }

  return (
    <div
      className="home2-hero-slider"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocusCapture={handleFocusCapture}
      onBlurCapture={handleBlurCapture}
    >
      <Swiper
        modules={[Autoplay, Keyboard, A11y]}
        onSwiper={(swiper) => { swiperRef.current = swiper; }}
        loop
        loopAdditionalSlides={1}
        speed={reducedMotion ? 0 : 620}
        slidesPerView={1}
        spaceBetween={0}
        grabCursor
        allowTouchMove
        watchOverflow
        keyboard={{ enabled: true, onlyInViewport: true }}
        a11y={{
          enabled: true,
          containerRoleDescriptionMessage: "Hero highlights",
          itemRoleDescriptionMessage: "Hero highlight",
          prevSlideMessage: "Previous highlight",
          nextSlideMessage: "Next highlight",
          slideLabelMessage: "{{index}} of {{slidesLength}}"
        }}
        autoplay={
          reducedMotion
            ? false
            : { delay: AUTOPLAY_DELAY_MS, disableOnInteraction: false }
        }
        className="home2-hero-swiper"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <div className="home2-hero-slide">{renderSlideBody(slide, index === 0)}</div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Announces the active slide without moving focus or re-reading the whole card. */}
      <p className="sr-only" role="status" aria-live="polite">
        {`Highlight ${active + 1} of ${slides.length}: ${slides[active]?.title ?? ""}`}
      </p>

      <div className="home2-hero-dots" aria-label="Choose a hero highlight">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            aria-label={`Show highlight ${index + 1}: ${slide.title}`}
            aria-current={index === active ? "true" : undefined}
            className={index === active ? "is-active" : undefined}
            onClick={() => goTo(index)}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * `headingLevel` keeps one `<h1>` per document: the first slide carries the page's main
 * headline exactly as the hero always did, and the supporting slides sit beneath it as `<h2>`.
 */
function renderSlideBody(slide: HeroSlide, isPrimary: boolean) {
  const Heading = isPrimary ? "h1" : "h2";

  return (
    <>
      <span className="home2-hero-sub">
        <span className="home2-title-icon-white" aria-hidden="true" />
        {slide.eyebrow}
      </span>

      <Heading className="home2-hero-heading">{slide.title}{slide.highlight ? <span>{slide.highlight}</span> : null}</Heading>

      <p className="home2-hero-description">{slide.description}</p>

      {slide.details && slide.details.length > 0 ? (
        <ul className="home2-hero-details">
          {slide.details.map((detail) => (
            <li key={`${detail.label}-${detail.value}`}>
              {detail.label ? <strong>{detail.label}</strong> : null}
              <span>{detail.value}</span>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="home2-hero-actions">
        <Home2Button href={slide.cta.href} className="home2-btn-dark" ariaLabel={slide.cta.ariaLabel}>
          {slide.cta.label}
        </Home2Button>

        {slide.call ? (
          <a className="home2-hero-call" href={slide.call.href}>
            <span><Icon name="headphones" size={28} /></span>
            <p><small>{slide.call.label}</small>{slide.call.value}</p>
          </a>
        ) : null}
      </div>
    </>
  );
}