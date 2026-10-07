"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { submitNewsletterSignup } from "@/features/dental/submission.service";
import type { Chamber, DentalService, DoctorProfile, NavigationItem, SiteConfig } from "@/types/content";
import { Icon } from "@/components/ui/Icon";

function phoneHref(phone: string) {
  return `tel:${phone.replace(/\s/g, "")}`;
}

function usefulFooterLinks(navigation: NavigationItem[]) {
  const intendedNavigation = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Service", href: "/services" },
    { label: "Case Study", href: "/case-studies" },
    { label: "Blog", href: "/blog" },
    { label: "Chambers", href: "/chambers" },
    { label: "Contact", href: "/contact" }
  ];

  return intendedNavigation.map((item) => {
    const configured = navigation.find((navigationItem) => navigationItem.href === item.href);
    return { label: configured?.label || item.label, href: configured?.href || item.href };
  });
}

export function Footer({ site, doctor, services, primaryChamber }: { site: SiteConfig; doctor: DoctorProfile; services: DentalService[]; primaryChamber: Chamber | null }) {
  const [newsletterSent, setNewsletterSent] = useState(false);
  const [newsletterError, setNewsletterError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const footerServices = services.slice(0, 4);
  const footerLinks = usefulFooterLinks(site.navigation || []);
  const footerAddress = primaryChamber?.address || "Primary chamber details will be updated soon.";
  const footerPhone = primaryChamber?.phone || doctor.phone;
  const legalLinks = site.footerLegalLinks || [
    { label: "Terms & Conditions", href: "/contact" },
    { label: "Privacy Policy", href: "/contact" }
  ];

  async function submitNewsletter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setSubmitting(true);
    setNewsletterError("");

    try {
      await submitNewsletterSignup(String(formData.get("email") || ""));
      setNewsletterSent(true);
      form.reset();
    } catch (error) {
      setNewsletterError(error instanceof Error ? error.message : "Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return <footer className="site-footer source-footer source-footer-default" style={{ backgroundImage: "url('/assets/img/footer-bg-h1.png')" }}>
    <div className="container-kliniko footer-top">
      <div className="footer-contact-strip" style={{ backgroundImage: "linear-gradient(rgba(21,154,175,.96), rgba(21,154,175,.96)), url(/assets/img/footer-contactBG-h1.jpg)" }}>
        <div className="footer-contact-box"><span><Icon name="pin" size={36} /></span><h3>{footerAddress}</h3></div>
        <div className="footer-contact-box"><span><Icon name="mail" size={36} /></span><div><p>Email Address</p><h3><a href={`mailto:${doctor.email}`}>{doctor.email}</a></h3></div></div>
        <div className="footer-contact-box"><span><Icon name="headphones" size={36} /></span><div><p>Call Anytime</p><h3><a href={phoneHref(footerPhone)}>{footerPhone}</a></h3></div></div>
      </div>

      <div className="footer-main">
        <div className="footer-widget footer-widget-about">
          <Link href="/" className="footer-logo" aria-label={`${site.brandName} home`}><Image src={site.logo} alt={site.brandName} width={236} height={50} /></Link>
          <p className="footer-copy">{site.footerCopy || doctor.intro}</p>
        </div>
        <div className="footer-widget">
          <h2 className="footer-heading">Our Services</h2>
          <ul className="footer-list">{footerServices.map((service) => <li key={service.slug}><Link href={`/services/${service.slug}`}>{service.tabTitle}</Link></li>)}</ul>
        </div>
        <div className="footer-widget">
          <h2 className="footer-heading">Useful Links</h2>
          <ul className="footer-list">{footerLinks.map((link) => <li key={link.label}><Link href={link.href}>{link.label}</Link></li>)}</ul>
        </div>
        <div className="footer-widget footer-widget-newsletter">
          <h2 className="footer-heading">Newsletter</h2>
          {newsletterSent ? <p className="footer-success" role="status">{site.newsletterSuccessMessage || "Thanks for subscribing."}</p> : <>
            <p className="footer-newsletter-copy">{site.newsletterCopy || "Subscribe For Get Latest Updates"}</p>
            <form className="newsletter" onSubmit={submitNewsletter} noValidate>
              <label className="sr-only" htmlFor="footer-email">Email Address</label>
              <input id="footer-email" name="email" type="email" placeholder="Email Address" required />
              <button type="submit" disabled={submitting}>{submitting ? "Sending" : "Subscribe"}</button>
            </form>
            {newsletterError ? <p className="footer-success" role="alert">{newsletterError}</p> : null}
          </>}
        </div>
      </div>
    </div>
    <div className="footer-bottom-wrap">
      <div className="container-kliniko footer-bottom">
        <span>Copyright © 2026 <Link href="/">{site.brandName}</Link>. All rights reserved.</span>
        <nav aria-label="Footer legal links">{legalLinks.map((link) => <Link key={link.label} href={link.href}>{link.label}</Link>)}</nav>
      </div>
    </div>
  </footer>;
}
