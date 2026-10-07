"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

export function Preloader() {
  const pathname = usePathname();
  const firstLoad = useRef(true);
  const removeTimer = useRef<number | null>(null);
  const [leaving, setLeaving] = useState(false);
  const [removed, setRemoved] = useState(false);
  const beginExit = useCallback(() => {
    setLeaving(true);
    if (removeTimer.current) window.clearTimeout(removeTimer.current);
    removeTimer.current = window.setTimeout(() => setRemoved(true), 1250);
  }, []);

  useEffect(() => {
    let enterTimer = 0;
    const start = () => { enterTimer = window.setTimeout(beginExit, firstLoad.current ? 0 : 100); };
    if (firstLoad.current) {
      firstLoad.current = false;
      if (document.readyState === "complete") start();
      else window.addEventListener("load", start, { once: true });
    } else {
      setRemoved(false);
      setLeaving(false);
      start();
    }
    return () => { window.removeEventListener("load", start); window.clearTimeout(enterTimer); if (removeTimer.current) window.clearTimeout(removeTimer.current); };
  }, [pathname, beginExit]);

  if (removed) return null;
  return <div className={`preloader-shell ${leaving ? "leaving" : ""}`} aria-hidden="true"><button type="button" className="preloader-cancel" onClick={beginExit}>Cancel Preloader</button><div className="preloader-inner"><Image src="/assets/img/logo.svg" alt="Dr. Nadia Karim" width={142} height={30} priority /><div className="preloader-content"><div className="preloader-pill"><div className="preloader-medicine">{Array.from({ length: 12 }, (_, index) => <i key={index} />)}</div><div className="preloader-side top" /><div className="preloader-side bottom" /></div></div></div></div>;
}
