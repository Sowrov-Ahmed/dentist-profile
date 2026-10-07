"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    document.body.classList.add("motion-ready");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const titleItems = Array.from(document.querySelectorAll<HTMLElement>("[data-title-reveal]"));
    const parallaxItems = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
    const mouseZones = Array.from(document.querySelectorAll<HTMLElement>("[data-mouse-zone]"));
    const shouldAnimateOnMobile = (item: HTMLElement) => item.closest("[data-mobile-motion]") !== null;

    if (reduceMotion) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      titleItems.forEach((item) => item.classList.add("is-visible"));
    } else if (mobile) {
      revealItems.forEach((item) => {
        if (shouldAnimateOnMobile(item)) item.classList.remove("is-visible");
        else item.classList.add("is-visible");
      });
      titleItems.forEach((item) => {
        if (shouldAnimateOnMobile(item)) item.classList.remove("is-visible");
        else item.classList.add("is-visible");
      });
    }

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }),
      { rootMargin: "0px 0px -70px", threshold: 0.12 }
    );

    if (!reduceMotion) {
      const revealTargets = mobile ? revealItems.filter(shouldAnimateOnMobile) : revealItems;
      const titleTargets = mobile ? titleItems.filter(shouldAnimateOnMobile) : titleItems;
      revealTargets.forEach((item) => observer.observe(item));
      titleTargets.forEach((item) => observer.observe(item));
    }

    let raf = 0;
    const updateParallax = () => {
      raf = 0;
      parallaxItems.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const offset = ((window.innerHeight / 2 - (rect.top + rect.height / 2)) / window.innerHeight) * rect.height * 0.3;
        item.style.setProperty("--parallax-offset", `${offset.toFixed(2)}px`);
      });
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(updateParallax); };
    updateParallax();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    window.addEventListener("load", onScroll);

    const zoneCleanups = mouseZones.map((zone) => {
      const items = Array.from(zone.querySelectorAll<HTMLElement>("[data-mouse-parallax]"));
      const move = (event: MouseEvent) => {
        const x = (event.clientX / window.innerWidth - 0.5) * 30;
        const y = (event.clientY / window.innerHeight - 0.5) * 30;
        items.forEach((item) => {
          const mx = Number.parseFloat(item.dataset.mouseX ?? "0.35");
          const my = Number.parseFloat(item.dataset.mouseY ?? "0.35");
          item.style.setProperty("--mouse-x", `${(x * (Number.isFinite(mx) ? mx : 0.35)).toFixed(2)}px`);
          item.style.setProperty("--mouse-y", `${(y * (Number.isFinite(my) ? my : 0.35)).toFixed(2)}px`);
        });
      };
      const leave = () => items.forEach((item) => {
        item.style.setProperty("--mouse-x", "0px");
        item.style.setProperty("--mouse-y", "0px");
      });
      zone.addEventListener("mousemove", move);
      zone.addEventListener("mouseleave", leave);
      return () => {
        zone.removeEventListener("mousemove", move);
        zone.removeEventListener("mouseleave", leave);
      };
    });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("load", onScroll);
      if (raf) cancelAnimationFrame(raf);
      zoneCleanups.forEach((cleanup) => cleanup());
      document.body.classList.remove("motion-ready");
    };
  }, [pathname]);

  return <>{children}</>;
}
