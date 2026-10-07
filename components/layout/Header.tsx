"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import type { DoctorProfile, NavigationItem, SiteConfig } from "@/types/content";
import { Icon } from "@/components/ui/Icon";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Header({ site, doctor }: { site: SiteConfig; doctor: DoctorProfile }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScroll = useRef(0);
  const searchInput = useRef<HTMLInputElement>(null);
  const searchTrigger = useRef<HTMLButtonElement>(null);
  const navigation = site.navigation || [];

  const isActive = (item: NavigationItem) => {
    const href = item.href;
    if (href === "/") return pathname === "/";
    if (pathname === href || pathname.startsWith(`${href}/`)) return true;
    return Boolean(item.children?.some((child) => pathname === child.href || pathname.startsWith(`${child.href}/`)));
  };

  const ariaCurrentFor = (href: string, active: boolean) => {
    if (!active) return undefined;
    return pathname === href ? "page" : "location";
  };

  const closeMenu = useCallback(() => {
    setOpen(false);
    setExpanded(null);
  }, []);

  const closeSearch = useCallback(() => {
    setSearchOpen((current) => {
      if (current) window.requestAnimationFrame(() => searchTrigger.current?.focus());
      return false;
    });
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 800);
      setHidden(y > lastScroll.current && y > 800);
      lastScroll.current = y;
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
        closeSearch();
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
    };
  }, [closeMenu, closeSearch]);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open || searchOpen);
    return () => document.body.classList.remove("menu-open");
  }, [open, searchOpen]);

  useEffect(() => {
    closeMenu();
    setSearchOpen(false);
  }, [pathname, closeMenu]);

  useEffect(() => {
    if (searchOpen) window.requestAnimationFrame(() => searchInput.current?.focus());
  }, [searchOpen]);

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = new FormData(event.currentTarget).get("q")?.toString().trim();
    if (value) window.location.href = `/blog?search=${encodeURIComponent(value)}`;
  };

  return (
    <>
      <div className={cn("header-shell", scrolled && "is-scrolled")}>
        <header className={cn("site-header", scrolled && "is-scrolled", hidden && "header-hidden")}>
          <div className="container-kliniko header-main">
            <Link href="/" aria-label={`${site.brandName} home`} className="logo">
              <Image src={site.logo} alt={site.brandName} width={236} height={50} priority />
            </Link>
            <nav className="primary-nav" aria-label="Primary navigation">
              {navigation.map((item) => {
                const active = isActive(item);
                return (
                  <div key={item.href} className={cn("nav-item", active && "active")}>
                    <Link href={item.href} aria-current={ariaCurrentFor(item.href, active)}>{item.label}</Link>
                    {item.children ? <div className="dropdown">{item.children.map((child) => {
                      const childActive = pathname === child.href || pathname.startsWith(`${child.href}/`);
                      return <Link key={child.href} href={child.href} aria-current={ariaCurrentFor(child.href, childActive)}>{child.label}</Link>;
                    })}</div> : null}
                  </div>
                );
              })}
            </nav>
            <div className="header-actions">
              <a className="header-call" href={`tel:${doctor.phone.replace(/\s/g, "")}`}>
                <span className="header-icon"><Icon name="headphones" size={24} /></span>
                <span><small>Emergency Call</small><strong>{doctor.phone}</strong></span>
              </a>
              <button ref={searchTrigger} className="header-search" aria-label="Open search" onClick={() => setSearchOpen(true)}><Icon name="search" size={21} /></button>
              <Link href="/appointment" className="header-appointment">Appointment</Link>
              <button className="menu-toggle" aria-label="Open menu" aria-expanded={open} onClick={() => { setExpanded(null); setOpen(true); }}><Icon name="menu" /></button>
            </div>
          </div>
        </header>
      </div>

      <div className={cn("mobile-panel", open && "open")} role="dialog" aria-modal="true" aria-hidden={!open} aria-label="Mobile navigation" onClick={closeMenu}>
        <div className="mobile-drawer" onClick={(event) => event.stopPropagation()}>
          <div className="mobile-drawer-head">
            <Link href="/" className="logo" onClick={closeMenu}><Image src={site.logo} alt={site.brandName} width={180} height={38} /></Link>
            <button className="mobile-close" aria-label="Close menu" onClick={closeMenu}><Icon name="close" /></button>
          </div>
          <nav className="mobile-nav">
            {navigation.map((item) => {
              const active = isActive(item);
              return (
                <div key={item.href}>
                  <div className={cn("mobile-nav-row", active && "active")}>
                    <Link href={item.href} onClick={closeMenu} aria-current={ariaCurrentFor(item.href, active)}>{item.label}</Link>
                    {item.children ? <button aria-label={`Toggle ${item.label} submenu`} aria-expanded={expanded === item.label} onClick={() => setExpanded(expanded === item.label ? null : item.label)}>⌄</button> : null}
                  </div>
                  {item.children ? <div className={cn("mobile-subnav", expanded === item.label && "expanded")}>{item.children.map((child) => {
                    const childActive = pathname === child.href || pathname.startsWith(`${child.href}/`);
                    return <Link key={child.href} href={child.href} onClick={closeMenu} aria-current={ariaCurrentFor(child.href, childActive)}>{child.label}</Link>;
                  })}</div> : null}
                </div>
              );
            })}
          </nav>
          <div className="mt-7"><a className="btn-primary-kliniko w-full" href={`tel:${doctor.phone.replace(/\s/g, "")}`}>Call for appointment <Icon name="phone" size={16} /></a></div>
        </div>
      </div>

      <div className={cn("search-overlay", searchOpen && "open")} role="dialog" aria-modal="true" aria-hidden={!searchOpen} aria-label="Search" onClick={closeSearch}>
        <div className="search-dialog" onClick={(event) => event.stopPropagation()}>
          <button className="search-close" aria-label="Close search" onClick={closeSearch}><Icon name="close" size={28} /></button>
          <span className="eyebrow">Search Dental Care</span>
          <h2>What are you looking for?</h2>
          <form onSubmit={submitSearch}>
            <label className="sr-only" htmlFor="site-search">Search</label>
            <input ref={searchInput} id="site-search" name="q" placeholder="Search articles and services" />
            <button type="submit" aria-label="Submit search"><Icon name="search" size={22} /></button>
          </form>
        </div>
      </div>
    </>
  );
}
