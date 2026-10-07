"use client";

import { useEffect } from "react";

function collectRevealItems(root: HTMLElement): HTMLElement[] {
  const items = new Set<HTMLElement>();
  if (root.hasAttribute("data-reveal")) items.add(root);
  root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((item) => items.add(item));
  return Array.from(items);
}

function isNearViewport(item: HTMLElement) {
  const rect = item.getBoundingClientRect();
  return rect.bottom >= -80 && rect.top <= window.innerHeight - 70;
}

export function CaseStudyGridRevealGuard({ watchKey }: { watchKey: string }) {
  useEffect(() => {
    const scope = document.querySelector<HTMLElement>("[data-case-grid-scope]");
    if (!scope) return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const shouldAnimate = !reduceMotion && !mobile && "IntersectionObserver" in window;
    const observed = new Set<HTMLElement>();

    const markVisible = (item: HTMLElement) => {
      item.classList.add("is-visible");
      intersectionObserver?.unobserve(item);
      observed.delete(item);
    };

    const intersectionObserver = shouldAnimate ? new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) markVisible(entry.target as HTMLElement);
      }),
      { rootMargin: "0px 0px -70px", threshold: 0.12 }
    ) : null;

    const prepare = (item: HTMLElement) => {
      item.dataset.caseGridRevealWatchKey = watchKey;
      if (!shouldAnimate) {
        markVisible(item);
        return;
      }

      observed.add(item);
      intersectionObserver?.observe(item);
    };

    collectRevealItems(scope).forEach(prepare);

    const fallbackTimer = window.setTimeout(() => {
      observed.forEach((item) => {
        if (isNearViewport(item)) markVisible(item);
      });
    }, 450);

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          const candidates = node === scope ? collectRevealItems(scope) : collectRevealItems(node);
          candidates.forEach(prepare);
        });
      });
    });

    mutationObserver.observe(scope, { childList: true, subtree: true });

    return () => {
      window.clearTimeout(fallbackTimer);
      intersectionObserver?.disconnect();
      mutationObserver.disconnect();
      observed.clear();
    };
  }, [watchKey]);

  return null;
}
