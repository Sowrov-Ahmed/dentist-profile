"use client";

import { useRef } from "react";
import { A11y, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";
import type { DentalService, HomeContent } from "@/types/content";
import { ArrowIcon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceCard } from "@/components/cards/ServiceCard";

export function ServicesCarousel({ services, intro }: { services: DentalService[]; intro: HomeContent["servicesIntro"] }) {
  const swiperRef = useRef<SwiperInstance | null>(null);

  return (
    <section className="home-service home-index-service-carousel">
      <div className="home-service-container">
        <SectionHeading eyebrow={intro.eyebrow} title={intro.title} description={intro.description} center className="home-service-title" />
        <div className="home-service-slider" data-reveal>
          <Swiper
            modules={[A11y, Autoplay]}
            className="home-service-swiper"
            loop
            autoplay={{ delay: 4200, disableOnInteraction: false }}
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
            {services.map((service, index) => (
              <SwiperSlide key={service.slug}>
                <ServiceCard service={service} index={index} variant="home" />
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="home-service-navigation" aria-label="Service carousel controls">
            <button type="button" aria-label="Previous service" onClick={() => swiperRef.current?.slidePrev()}><ArrowIcon /></button>
            <button type="button" aria-label="Next service" onClick={() => swiperRef.current?.slideNext()}><ArrowIcon /></button>
          </div>
        </div>
      </div>
    </section>
  );
}
