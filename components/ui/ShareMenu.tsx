"use client";

import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { Icon } from "./Icon";

export function ShareMenu({ label }: { label: string }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (event: globalThis.MouseEvent) => {
      if (root.current && !root.current.contains(event.target as Node)) setOpen(false);
    };
    const closeOther = (event: Event) => {
      if ((event as CustomEvent<HTMLDivElement>).detail !== root.current) setOpen(false);
    };

    document.addEventListener("click", close);
    window.addEventListener("kliniko:share-open", closeOther);
    return () => {
      document.removeEventListener("click", close);
      window.removeEventListener("kliniko:share-open", closeOther);
    };
  }, []);

  const toggle = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const next = !open;
    if (next && root.current) window.dispatchEvent(new CustomEvent("kliniko:share-open", { detail: root.current }));
    setOpen(next);
  };

  const share = (network: "facebook" | "twitter" | "linkedin") => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const page = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(label);
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${page}`,
      twitter: `https://twitter.com/intent/tweet?url=${page}&text=${text}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${page}`
    };
    window.open(urls[network], "kliniko-share", "noopener,noreferrer,width=620,height=500");
    setOpen(false);
  };

  return <div className={`doctor-social ${open ? "open" : ""}`} ref={root}>
    <button className="share-toggle" type="button" aria-label={`Share ${label}`} aria-expanded={open} onClick={toggle}><Icon name="share" size={17} /></button>
    <ul className="share-list" aria-hidden={!open}>
      <li><a href="https://www.facebook.com/sharer/sharer.php" aria-label={`Share ${label} on Facebook`} onClick={share("facebook")}><Icon name="facebook" size={13} /></a></li>
      <li><a href="https://twitter.com/intent/tweet" aria-label={`Share ${label} on Twitter`} onClick={share("twitter")}><Icon name="twitter" size={13} /></a></li>
      <li><a href="https://www.linkedin.com/sharing/share-offsite/" aria-label={`Share ${label} on LinkedIn`} onClick={share("linkedin")}><Icon name="linkedin" size={13} /></a></li>
    </ul>
  </div>;
}
