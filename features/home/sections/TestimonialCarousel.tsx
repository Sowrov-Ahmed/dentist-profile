"use client";

import Image from "next/image";
import { useRef } from "react";
import { A11y, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";
import type { Testimonial } from "@/types/content";
import { ArrowIcon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function TestimonialCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const swiperRef = useRef<SwiperInstance | null>(null);

  return (
    <section className="home-testimonial">
      <div className="home-source-container">
        <div className="home-testimonial-head">
          <SectionHeading eyebrow="Testimonials" title="What Patients Appreciate About The Visit" className="home-testimonial-heading" />
          <div className="home-section-navigation home-testimonial-nav" aria-label="Testimonial carousel controls">
            <button type="button" aria-label="Previous testimonial" onClick={() => swiperRef.current?.slidePrev()}><ArrowIcon /></button>
            <button type="button" aria-label="Next testimonial" onClick={() => swiperRef.current?.slideNext()}><ArrowIcon /></button>
          </div>
        </div>
        <Swiper
          modules={[A11y, Autoplay]}
          className="home-testimonial-swiper"
          loop
          autoplay={{ delay: 4700, disableOnInteraction: false }}
          speed={900}
          spaceBetween={30}
          slidesPerView={3}
          breakpoints={{
            0: { slidesPerView: 1, spaceBetween: 15 },
            768: { slidesPerView: 2, spaceBetween: 30 },
            992: { slidesPerView: 3, spaceBetween: 30 }
          }}
          onSwiper={(swiper) => { swiperRef.current = swiper; }}
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={`${testimonial.role}-${index}`}>
              <article className="home-testimonial-card" data-reveal>
                <div className="home-testimonial-image-row">
                  <span className="home-testimonial-avatar">
                    <Image src={testimonial.image} alt="" fill sizes="60px" />
                  </span>
                  <span className="home-testimonial-quote" aria-hidden="true">”</span>
                </div>
                <span className="home-testimonial-stars" aria-label="Five star feedback">★★★★★</span>
                <p>{testimonial.quote}</p>
                <div className="home-testimonial-admin">
                  <h3>{testimonial.name}</h3>
                  <span>{testimonial.role}</span>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
