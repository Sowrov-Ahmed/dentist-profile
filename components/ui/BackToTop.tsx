"use client";
import { useEffect, useState } from "react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  useEffect(() => { const onScroll = () => { const total = document.documentElement.scrollHeight - window.innerHeight; const next = total > 0 ? Math.min(100, Math.max(0, window.scrollY / total * 100)) : 0; setProgress(next); setVisible(next > 5); }; window.addEventListener("scroll", onScroll, { passive: true }); onScroll(); return () => window.removeEventListener("scroll", onScroll); }, []);
  const circumference = 2 * Math.PI * 40;
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  return <button aria-label={`Back to top, page ${Math.round(progress)} percent scrolled`} className={`back-top ${visible ? "show" : ""}`} onClick={scrollToTop}><svg className="back-progress" viewBox="0 0 100 100" aria-hidden="true"><circle className="back-progress-track" cx="50" cy="50" r="40" /><circle className="back-progress-value" cx="50" cy="50" r="40" style={{ strokeDasharray: circumference, strokeDashoffset: circumference * (1 - progress / 100) }} /></svg><span className="back-progress-text">{Math.round(progress)}%</span></button>;
}
