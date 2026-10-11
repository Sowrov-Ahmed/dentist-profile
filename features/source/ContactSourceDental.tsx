"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { submitAppointmentRequest } from "@/features/dental/submission.service";
import type { Chamber, ContactContent, DentalService, DoctorProfile } from "@/types/content";
import { Icon } from "@/components/ui/Icon";

type ContactIcon = "pin" | "phone" | "mail" | "user";

function SmallFieldIcon({ type }: { type: ContactIcon }) {
  const paths: Record<ContactIcon, string> = {
    pin: "M21 10c0 7-9 12-9 12S3 17 3 10a9 9 0 1 1 18 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
    phone: "M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.8 12.8 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.8 12.8 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",
    mail: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6",
    user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0"
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill={type === "user" ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={paths[type]} /></svg>;
}

function TitleIcon() { return <span className="source-contact-title-icon" aria-hidden="true"><span /><span /></span>; }

function LocationGraphic() {
  return <svg aria-hidden="true" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.0287 21.2161H8.23486C7.76428 21.2161 7.33948 21.4963 7.15332 21.9278L2.1875 33.4906L13.9807 27.4673C12.569 25.5139 11.1722 23.3594 10.0287 21.2161Z" /><path d="M32.8439 21.9278C32.6581 21.4963 32.233 21.2161 31.7627 21.2161H29.9689C27.8095 25.2628 24.6634 29.4446 22.6621 31.7453C21.2546 33.3597 18.7405 33.3579 17.3352 31.7453C17.1915 31.5802 16.441 30.7114 15.4074 29.3753L13.2812 30.4617L21.3239 38.4888L36.5631 30.5884L32.8439 21.9278Z" /><path d="M0.737606 36.8698L0.0961263 38.3636C-0.235905 39.1367 0.332943 40 1.17736 40H18.447C18.555 39.9197 18.5562 39.9246 19.136 39.624L11.0815 31.5863L0.737606 36.8698Z" /><path d="M39.9048 38.3636L37.4951 32.7527L23.5156 40H38.8235C39.6661 40 40.2374 39.1382 39.9048 38.3636Z" /><path d="M21.1771 10.5722C21.1771 9.92462 20.6492 9.39819 20.0007 9.39819C19.3519 9.39819 18.8242 9.92462 18.8242 10.5722C18.8242 11.2195 19.3519 11.7462 20.0007 11.7462C20.6492 11.7462 21.1771 11.2195 21.1771 10.5722Z" /><path d="M20.8896 30.1263C21.2857 29.6716 30.5896 18.9093 30.5896 11.5112C30.5896 -3.74393 9.41406 -3.93009 9.41406 11.5112C9.41406 18.9093 18.718 29.6716 19.1141 30.1263C19.5831 30.6643 20.4214 30.6637 20.8896 30.1263ZM16.4725 10.5722C16.4725 8.63004 18.0557 7.05014 20.0018 7.05014C21.9476 7.05014 23.5309 8.63004 23.5309 10.5722C23.5309 12.514 21.9476 14.0939 20.0018 14.0939C18.0557 14.0939 16.4725 12.514 16.4725 10.5722Z" /></svg>;
}

/**
 * Envelope glyph for the contact info panel.
 *
 * The shared `Icon` "mail" glyph is a stroke-outline envelope: a closed rounded
 * rectangle plus a separate flap subpath. The contact panel's design system sets
 * `fill: currentColor` on every `.source-contact-icon svg path`, which is what makes
 * the location pin and the phone handset read as solid shapes. The same rule fills the
 * envelope's closed rectangle and swallows its flap, so the glyph renders as an
 * unrecognisable solid block. This glyph keeps the same 24x24 grid, size, colour and
 * stroke weight, but knocks the flap out with `fill-rule: evenodd` so it stays legible
 * once filled and matches its siblings in the panel.
 */
function MailGraphic({ size = 38, strokeWidth = 2.2 }: { size?: number; strokeWidth?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path fillRule="evenodd" d="M3.5 5h17A1.5 1.5 0 0 1 22 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-17A1.5 1.5 0 0 1 2 17.5v-11A1.5 1.5 0 0 1 3.5 5zm.9 1.6L12 12.1l7.6-5.5H4.4z" />
    </svg>
  );
}

function ContactInfoCard({ kind, title, children }: { kind: "location" | "phone" | "mail"; title: string; children: React.ReactNode }) {
  const headIcon = kind === "location"
    ? <LocationGraphic />
    : kind === "mail"
      ? <MailGraphic size={38} strokeWidth={2.2} />
      : <Icon name={kind} size={38} strokeWidth={2.2} />;
  const bgIcon = kind === "location" ? null : kind === "mail" ? <MailGraphic size={115} strokeWidth={1.8} /> : <Icon name={kind} size={115} strokeWidth={1.8} />;
  return <div className="source-contact-info" data-reveal="up" style={{ transitionDelay: "0.45s" }}><div className="source-contact-info-head"><h2>{title}</h2><div className="source-contact-icon">{headIcon}</div></div>{children}{kind === "location" ? <Image src="/assets/img/map-green.png" alt="Map icon" width={120} height={100} /> : <span className="source-contact-bg-icon">{bgIcon}</span>}</div>;
}

export function ContactSourceDental({ doctor, contact, primaryChamber }: { doctor: DoctorProfile; services: DentalService[]; contact: ContactContent; primaryChamber: Chamber | null }) {
  const contactAddress = primaryChamber?.address || "Primary chamber details will be updated soon.";
  const contactPhone = primaryChamber?.phone || doctor.phone;
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    const formData = new FormData(event.currentTarget);
    try {
      await submitAppointmentRequest({
        name: `${String(formData.get("fname") || "")} ${String(formData.get("lname") || "")}`.trim(),
        email: String(formData.get("email") || ""),
        service: String(formData.get("service") || ""),
        message: String(formData.get("message") || "")
      });
      setMessage("Thank you. Your message has been sent.");
      setSent(true);
      event.currentTarget.reset();
    } catch (error) {
      setSent(false);
      setMessage(error instanceof Error ? error.message : "Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return <>
    <section className="source-contact-section">
      <div className="source-contact-container">
        <div className="source-contact-layout">
          <div className="source-contact-panel">
            <ContactInfoCard kind="location" title="Our Location / Address"><p>{contactAddress}</p></ContactInfoCard>
            <ContactInfoCard kind="phone" title="Our Contact Number"><ul><li><Link href={`tel:${contactPhone.replace(/\s/g, "")}`}>{contactPhone}</Link></li>{doctor.secondaryPhone && doctor.secondaryPhone !== contactPhone ? <li><Link href={`tel:${doctor.secondaryPhone.replace(/\s/g, "")}`}>{doctor.secondaryPhone}</Link></li> : null}</ul></ContactInfoCard>
            <ContactInfoCard kind="mail" title="Our official Email Address"><ul><li><Link href={`mailto:${doctor.email}`}>{doctor.email}</Link></li>{doctor.secondaryEmail ? <li><Link href={`mailto:${doctor.secondaryEmail}`}>{doctor.secondaryEmail}</Link></li> : null}</ul></ContactInfoCard>
          </div>
          <div className="source-contact-form-box">
            <div className="source-contact-title text-center"><p><TitleIcon /> {contact.subtitle} <TitleIcon /></p><h2>{contact.title}</h2></div>
            {sent ? <p className="source-contact-form-message" role="status">{message}</p> : <form className="source-contact-form" onSubmit={onSubmit} data-reveal="up" style={{ transitionDelay: "0.95s" }}>
              <div className="source-contact-form-grid">
                <div className="source-contact-form-group"><label className="sr-only" htmlFor="contact-fname">First name</label><input id="contact-fname" name="fname" type="text" placeholder="First name" required /><span className="source-contact-field-icon"><SmallFieldIcon type="user" /></span></div>
                <div className="source-contact-form-group"><label className="sr-only" htmlFor="contact-lname">Last Name</label><input id="contact-lname" name="lname" type="text" placeholder="Last Name" /><span className="source-contact-field-icon"><SmallFieldIcon type="user" /></span></div>
                <div className="source-contact-form-group"><label className="sr-only" htmlFor="contact-email">Email Address</label><input id="contact-email" name="email" type="email" placeholder="Email Address" required /><span className="source-contact-field-icon"><SmallFieldIcon type="mail" /></span></div>
                <div className="source-contact-form-group"><label className="sr-only" htmlFor="contact-service">Select a subject</label><select id="contact-service" name="service" defaultValue=""><option value="" disabled>Select a subject</option><option value="General enquiry">General enquiry</option><option value="Doctor&apos;s information">Doctor&apos;s information</option><option value="About Services">About Services</option><option value="Others">Others</option></select></div>
                <div className="source-contact-form-group source-contact-form-wide"><label className="sr-only" htmlFor="contact-message">Message</label><textarea id="contact-message" name="message" placeholder="Message here..." rows={4} required /></div>
                <div className="source-contact-form-wide"><button className="source-contact-submit" type="submit">{submitting ? "Sending..." : "Send Message"}</button></div>
              </div>
              {message ? <p className="source-contact-form-message" role="alert">{message}</p> : null}
            </form>}
          </div>
        </div>
      </div>
    </section>
    <div className="source-contact-map" data-reveal="up" style={{ transitionDelay: "0.25s" }}><div className="source-contact-mapouter"><iframe className="source-contact-gmap" src={contact.mapEmbedUrl} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title={contact.mapTitle} /></div></div>
  </>;
}
