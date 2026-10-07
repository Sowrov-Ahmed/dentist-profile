"use client";

import Link from "next/link";
import type { PointerEvent, ReactNode } from "react";

export function Home2Button({ href, children, className = "", type = "button" }: { href?: string; children: ReactNode; className?: string; type?: "button" | "submit" }) {
  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--btn-x", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--btn-y", `${event.clientY - rect.top}px`);
  };
  const content = <>{children}<span aria-hidden="true" /></>;
  const cls = `home2-btn ${className}`.trim();
  if (href) return <Link href={href} className={cls} onPointerMove={handlePointerMove}>{content}</Link>;
  return <button type={type} className={cls} onPointerMove={handlePointerMove}>{content}</button>;
}
