"use client";

import Link from "next/link";
import type { PointerEvent, ReactNode } from "react";

/**
 * `solid` reproduces the Navbar Appointment button's hover (`.header-appointment:hover`) — a
 * flat colour swap with the same small lift — instead of the pointer-tracked ripple blob.
 *
 * Two reasons it is needed here: the ripple span scales to 225% of the button box, which on a
 * full-width pill looks like a smear rather than a hover, and because `--btn-x`/`--btn-y` are
 * only written on pointer move, a keyboard user gets a blob that grows from the centre instead
 * of from the control. `--indigo` is the colour the design system already assigns to
 * `.header-appointment:hover` for this page's header variant; a literal `--navy` hover would be
 * invisible against the navy appointment card (1.00:1).
 */
const SOLID_HOVER_CLASS = "hover:!translate-y-[-2px] hover:!bg-[var(--indigo)] hover:!text-white";

/** Mirrors the disabled treatment used by the appointment form's submit button. */
const DISABLED_CLASS = "disabled:!cursor-wait disabled:!opacity-70 disabled:hover:!translate-y-0";

export function Home2Button({ href, children, className = "", type = "button", disabled = false, hoverStyle = "ripple", ariaBusy = false, ariaLabel }: { href?: string; children: ReactNode; className?: string; type?: "button" | "submit"; disabled?: boolean; hoverStyle?: "ripple" | "solid"; ariaBusy?: boolean; ariaLabel?: string }) {
  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--btn-x", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--btn-y", `${event.clientY - rect.top}px`);
  };
  const solid = hoverStyle === "solid";
  const content = <>{children}{solid ? null : <span aria-hidden="true" />}</>;
  const cls = ["home2-btn", solid ? SOLID_HOVER_CLASS : "", disabled ? DISABLED_CLASS : "", className].filter(Boolean).join(" ");
  const track = solid ? undefined : handlePointerMove;
  if (href) return <Link href={href} className={cls} onPointerMove={track} aria-label={ariaLabel}>{content}</Link>;
  return <button type={type} className={cls} onPointerMove={track} disabled={disabled} aria-disabled={disabled || undefined} aria-busy={ariaBusy || undefined} aria-label={ariaLabel}>{content}</button>;
}
