"use client";

import { useRef } from "react";
import { A11y, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";
import type { CaseStudy } from "@/types/content";
import { CaseCard } from "@/components/cards/CaseCard";
import { ArrowIcon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function CaseCarousel({ cases }: { cases: CaseStudy[] }) {
  const swiperRef = useRef<SwiperInstance | null>(null);

  return (
    <section className="home-case home-index-case-carousel">
      <div className="home-source-container">
        <div className="home-case-head">
          <SectionHeading eyebrow="Case Study" title="Care Planning Stories For Dental Decisions" className="home-case-heading" />
          <div className="home-section-navigation home-case-nav" aria-label="Case carousel controls">
            <button type="button" aria-label="Previous case" onClick={() => swiperRef.current?.slidePrev()}><ArrowIcon /></button>
            <button type="button" aria-label="Next case" onClick={() => swiperRef.current?.slideNext()}><ArrowIcon /></button>
          </div>
        </div>
        <Swiper
          modules={[A11y, Autoplay]}
          className="home-case-swiper"
          loop
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          speed={900}
          spaceBetween={30}
          slidesPerView={2}
          breakpoints={{
            0: { slidesPerView: 1, spaceBetween: 15 },
            992: { slidesPerView: 2, spaceBetween: 30 }
          }}
          onSwiper={(swiper) => { swiperRef.current = swiper; }}
        >
          {cases.map((item) => (
            <SwiperSlide key={item.slug}>
              <CaseCard item={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
