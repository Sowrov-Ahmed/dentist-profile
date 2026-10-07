"use client";

import { useEffect } from "react";

const MOTION_SELECTOR = "[data-reveal], [data-title-reveal]";

function collectMotionItems(root: HTMLElement): HTMLElement[] {
  const items = new Set<HTMLElement>();
  if (root.matches(MOTION_SELECTOR)) items.add(root);
  root.querySelectorAll<HTMLElement>(MOTION_SELECTOR).forEach((item) => items.add(item));
  return Array.from(items);
}

function isNearViewport(item: HTMLElement) {
  const rect = item.getBoundingClientRect();
  return rect.bottom >= -100 && rect.top <= window.innerHeight - 70;
}

function shouldAnimateItem(item: HTMLElement, mobile: boolean) {
  if (!mobile) return true;
  return item.closest("[data-mobile-motion]") !== null;
}

export function ScopedRevealGuard({ scopeSelector, watchKey }: { scopeSelector: string; watchKey: string }) {
  useEffect(() => {
    const scope = document.querySelector<HTMLElement>(scopeSelector);
    if (!scope) return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const canObserve = !reduceMotion && "IntersectionObserver" in window;
    const observed = new Set<HTMLElement>();

    const markVisible = (item: HTMLElement) => {
      item.classList.add("is-visible");
      intersectionObserver?.unobserve(item);
      observed.delete(item);
    };

    const intersectionObserver = canObserve ? new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) markVisible(entry.target as HTMLElement);
      }),
      { rootMargin: "0px 0px -70px", threshold: 0.12 }
    ) : null;

    const prepare = (item: HTMLElement) => {
      item.dataset.scopedRevealWatchKey = watchKey;
      if (!canObserve || !shouldAnimateItem(item, mobile)) {
        markVisible(item);
        return;
      }

      if (item.classList.contains("is-visible")) return;
      observed.add(item);
      intersectionObserver?.observe(item);
    };

    const prepareAll = () => collectMotionItems(scope).forEach(prepare);
    prepareAll();
    const animationFrame = window.requestAnimationFrame(prepareAll);

    const fallbackTimer = window.setTimeout(() => {
      observed.forEach((item) => {
        if (isNearViewport(item)) markVisible(item);
      });
    }, 450);

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          const candidates = node === scope ? collectMotionItems(scope) : collectMotionItems(node);
          candidates.forEach(prepare);
        });
      });
    });

    mutationObserver.observe(scope, { childList: true, subtree: true });

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(fallbackTimer);
      intersectionObserver?.disconnect();
      mutationObserver.disconnect();
      observed.clear();
    };
  }, [scopeSelector, watchKey]);

  return null;
}
