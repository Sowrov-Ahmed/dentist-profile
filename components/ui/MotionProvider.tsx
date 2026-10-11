"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const REVEAL_SELECTOR = "[data-reveal], [data-title-reveal]";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    document.body.classList.add("motion-ready");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const parallaxItems = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
    const mouseZones = Array.from(document.querySelectorAll<HTMLElement>("[data-mouse-zone]"));
    const shouldAnimateOnMobile = (item: HTMLElement) => item.closest("[data-mobile-motion]") !== null;

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }),
      { rootMargin: "0px 0px -70px", threshold: 0.12 }
    );

    const tracked = new WeakSet<Element>();

    /**
     * Applies reveal visibility rules and attaches the observer to a set of elements.
     *
     * This runs both for the elements present at mount and for elements inserted later,
     * because `body.motion-ready [data-reveal] { opacity: 0 }` keeps anything that has not
     * been revealed invisible. An element that is never observed therefore stays hidden.
     */
    const track = (items: HTMLElement[]) => {
      if (items.length === 0) return;

      if (reduceMotion) {
        items.forEach((item) => item.classList.add("is-visible"));
        return;
      }

      if (mobile) {
        items.forEach((item) => {
          if (shouldAnimateOnMobile(item)) item.classList.remove("is-visible");
          else item.classList.add("is-visible");
        });
      }

      (mobile ? items.filter(shouldAnimateOnMobile) : items).forEach((item) => {
        if (tracked.has(item)) return;
        tracked.add(item);
        observer.observe(item);
      });
    };

    const collect = (scope: ParentNode): HTMLElement[] => {
      const found: HTMLElement[] = [];
      if (scope instanceof Element && scope.matches(REVEAL_SELECTOR)) found.push(scope as HTMLElement);
      found.push(...Array.from(scope.querySelectorAll<HTMLElement>(REVEAL_SELECTOR)));
      return found;
    };

    track(collect(document));

    /**
     * A route rendered behind `app/loading.tsx` streams in through a Suspense boundary that
     * resolves *after* this effect has already run, so a one-shot scan at mount missed those
     * nodes entirely and left the section hidden on a first direct load. Watching for inserted
     * subtrees means late content is picked up as soon as it arrives; client navigation is
     * unaffected because its nodes are already present and tracked by the initial scan.
     */
    const mutationObserver = new MutationObserver((mutations) => {
      const added: HTMLElement[] = [];

      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType !== Node.ELEMENT_NODE) return;
          added.push(...collect(node as Element));
        });
      });

      track(added);
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

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
      mutationObserver.disconnect();
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
