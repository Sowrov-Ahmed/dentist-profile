"use client";

import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";
import { Icon, ArrowIcon } from "./Icon";

type ButtonProps = {
  href?: string;
  children: ReactNode;
  className?: string;
  type?: "button" | "submit";
};

export function Button({ href, children, variant = "primary", type = "button", onClick }: { href?: string; children: ReactNode; variant?: "primary" | "outline"; type?: "button" | "submit"; onClick?: () => void }) {
  const className = variant === "primary" ? "btn-primary-kliniko" : "btn-outline-kliniko";
  const moveRipple = (event: MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--ripple-x", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--ripple-y", `${event.clientY - rect.top}px`);
  };
  const content = <><span className="btn-label">{children}<span className="btn-arrow"><Icon name="arrow" size={17} /></span></span><span className="btn-ripple" aria-hidden="true" /></>;
  if (href) return <Link className={className} href={href} onMouseMove={moveRipple}>{content}</Link>;
  return <button className={className} type={type} onClick={onClick} onMouseMove={moveRipple}>{content}</button>;
}

export function PrimaryButton({ href, children, className = "", type = "button" }: ButtonProps) {
  const content = (
    <>
      <span className="btn-ripple" aria-hidden="true" />
      <span className="btn-label">
        {children}
        <ArrowIcon className="btn-arrow" />
      </span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={`btn-primary-kliniko ${className}`}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} className={`btn-primary-kliniko ${className}`}>
      {content}
    </button>
  );
}
