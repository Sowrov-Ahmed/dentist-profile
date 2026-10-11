"use client";

/**
 * The canonical Home appointment section, shared verbatim by `/` and `/services`.
 *
 * Both pages render this single component, so there is exactly one appointment
 * implementation: the same field set, the same shared client validation, the same
 * `submitAppointmentRequest` service call, the same API contract and JSON source, and the same
 * submitting / error / success / auto-reset behaviour. Copying the markup into a second
 * component would have duplicated all of that and let the two forms drift apart.
 *
 * Content arrives as typed props resolved on the server: `appointmentContent` and `chambers`
 * from the shared `getAppointmentPageData()` service, and `appointment` from the Home content,
 * whose heading copy is identical to the heading this section previously hard-coded.
 *
 * `overlap` is a page-composition concern, not a design one. On `/` the card is pulled up 190px
 * into the 300px of trailing padding `.home2-cases` already reserves, so the offset only ever
 * overlaps empty background. The section above this one on `/services` has much less trailing
 * padding, so there the pull-up is switched off rather than allowed to cover the service grid.
 *
 * `top: -190px` and `margin-bottom: -85px` are a coupled pair, not two independent numbers: the
 * negative bottom margin collapses straight out of `.home2-appointment` (which has no padding)
 * and lifts whatever follows, while the top offset only moves the card's paint position. On `/`
 * the pair resolves to a clean 105px of white between the card and the testimonial band. Setting
 * `top: 0` on its own therefore left the -85px behind, which pulled the testimonial section up so
 * the navy card hung 85px into it and the gap below the card collapsed to nothing. Cancelling both
 * halves together and giving the section real bottom padding restores that same breathing room
 * using the design system's own section rhythm (110px, stepping down to 80px on small screens).
 * The card, its form and every state inside it are byte-identical either way.
 */

import { FormEvent, useEffect, useState } from "react";
import { submitAppointmentRequest } from "@/features/appointments/appointment.service";
import { AppointmentFieldErrors, formatAppointmentFee, todayInputValue, validateAppointmentSubmission } from "@/features/appointments/appointment.domain";
import type { AppointmentContent, AppointmentSubmissionRequest, AppointmentSubmissionResponse, Chamber, ChamberFees, DoctorProfile, HomeContent } from "@/types/content";
import { ApiClientError } from "@/types/api";
import { Icon } from "@/components/ui/Icon";
import { Home2SectionTitle } from "@/components/source/SourceHelpers";
import { Home2Button } from "@/components/source/Home2Button";

/**
 * Inline validation message for the Home appointment form. The appointment form renders its
 * errors as `#b42318`, which measures 2.46:1 on this card's navy background and would be
 * unreadable here; `#ffb4ab` is the light-surface counterpart and measures 9.5:1. Colours are
 * utilities rather than a new stylesheet, so the frozen globals.css stays untouched.
 */
/** How long the confirmation stays on screen before the section returns to a ready form. */
const SUCCESS_RESET_DELAY_MS = 8000;

const HOME_FIELD_ERROR_CLASS = "!mt-2 !block !text-[13px] !font-bold !leading-[1.4] !text-[#ffb4ab]";

/**
 * The frozen `.home2-appointment-card` rules hand `select:hover` and `select:focus` a
 * `background: #fff` **shorthand**, which resets `background-position`, `background-size` and
 * `background-repeat` along with the image. The chevron therefore jumped to the top-left
 * corner, tiled, and changed scale on hover, and keyboard focus hit the same problem. These
 * re-assert the geometry in all three states so the chevron stays pinned to the right edge at
 * a fixed 16×13. The chevron artwork itself is left to the existing rules, which already swap
 * it to the dark variant for both `:hover` and `:focus`.
 *
 * `[&_option]` mirrors the four other appointment forms on the site, which all render select
 * options navy-on-white so the native dropdown list stays readable.
 */
const HOME_SELECT_CLASS = [
  "!bg-[length:16px_13px]",
  "!bg-no-repeat",
  "!bg-[position:right_15px_center]",
  "hover:!bg-[length:16px_13px]",
  "hover:!bg-no-repeat",
  "hover:!bg-[position:right_15px_center]",
  "focus:!bg-[length:16px_13px]",
  "focus:!bg-no-repeat",
  "focus:!bg-[position:right_15px_center]",
  "[&_option]:!text-navy",
  "[&_option]:!bg-white"
].join(" ");

function telephoneHref(phone: string) {
  return `tel:${phone.replace(/\s/g, "")}`;
}

export function HomeTwoAppointmentSection({ doctor, appointment, appointmentContent, chambers, overlap = true }: { doctor: DoctorProfile; appointment: HomeContent["appointment"]; appointmentContent: AppointmentContent; chambers: Chamber[]; overlap?: boolean }) {
  const [minDate, setMinDate] = useState<string | null>(null);
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<AppointmentFieldErrors>({});
  const [confirmation, setConfirmation] = useState<AppointmentSubmissionResponse | null>(null);

  // Resolved after mount so the server and first client render agree; see `todayInputValue`.
  useEffect(() => { setMinDate(todayInputValue()); }, []);

  /**
   * Long enough to read the confirmation and its summary, then the panel clears itself. The
   * form controls are uncontrolled, so returning to the `idle` branch remounts them with their
   * original `defaultValue`s — a clean React state reset, with no page reload and no manual
   * field-by-field clearing.
   */
  useEffect(() => {
    if (state !== "success") return;
    const timer = window.setTimeout(() => {
      setState("idle");
      setMessage("");
      setErrors({});
      setConfirmation(null);
    }, SUCCESS_RESET_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [state]);

  const defaultConsultationType = appointmentContent.consultationTypes[0]?.id || "";
  const consultationTypeIds = appointmentContent.consultationTypes.map((item) => item.id);
  const isSubmitting = state === "submitting";
  const hasChambers = chambers.length > 0;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Belt-and-braces alongside the disabled button, so a double Enter cannot queue a second
    // request while the first is still in flight.
    if (state === "submitting") return;

    const formData = new FormData(event.currentTarget);
    const payload: AppointmentSubmissionRequest = {
      chamberId: String(formData.get("chamberId") || ""),
      consultationType: String(formData.get("consultationType") || "") as keyof ChamberFees,
      preferredDate: String(formData.get("preferredDate") || ""),
      fullName: String(formData.get("fullName") || ""),
      phone: String(formData.get("phone") || ""),
      email: String(formData.get("email") || ""),
      reason: String(formData.get("reason") || "")
    };
    const nextErrors = validateAppointmentSubmission(payload, {
      chambers,
      consultationTypeIds,
      earliestDate: minDate ?? todayInputValue()
    });

    setErrors(nextErrors);
    setMessage("");

    if (Object.keys(nextErrors).length > 0) {
      setState("error");
      setMessage("Please review the highlighted appointment details.");
      return;
    }

    setState("submitting");

    try {
      const response = await submitAppointmentRequest(payload);
      setMessage(response.message);
      setConfirmation(response);
      setState("success");
    } catch (error) {
      if (error instanceof ApiClientError) {
        setErrors(error.details || {});
        setMessage(error.message);
      } else {
        setMessage("Something went wrong. Please try again.");
      }
      setState("error");
    }
  }

  const fieldError = (key: keyof AppointmentSubmissionRequest) => errors[key]?.[0];

  return <section className={overlap ? "home2-appointment" : "home2-appointment !pb-[80px] lg:!pb-[110px]"} data-reveal="up">
    <div className="home2-container">
      <div className={overlap ? "home2-appointment-card" : "home2-appointment-card !top-0 !mb-0"} style={{ backgroundImage: "url('/assets/img/appoint-overImg2-h1.png')" }}>
        <div className="home2-appointment-left">
          {/* Section copy stays owned by the Home content; the appointment model only supplies
              the form's domain data, so this heading renders exactly as it did before. */}
          <Home2SectionTitle eyebrow={appointment.eyebrow} title={appointment.title} light className="home2-appointment-title" />
          <div className="home2-appointment-contact" data-reveal="up" style={{ transitionDelay: "0.3s" }}>
            <div><span><Icon name="headphones" size={30} /></span><p><small>Call Us 24/7</small><a href={telephoneHref(doctor.phone)}>{doctor.phone}</a></p></div>
            <div><span><Icon name="mail" size={30} /></span><p><small>Need Assistance?</small><a href={`mailto:${doctor.email}`}>{doctor.email}</a></p></div>
          </div>
        </div>
        <div className="home2-appointment-form-wrap" data-reveal="up" style={{ transitionDelay: "0.4s" }}>
          {state === "success" ? <div className="home2-appointment-success !flex !h-full !flex-col !items-center !justify-center !text-center" role="status" aria-live="polite">
            <span className="!mb-6 !flex !h-16 !w-16 !flex-none !items-center !justify-center !rounded-full !bg-teal">
              <Icon name="check" size={34} strokeWidth={2.4} />
            </span>
            <h3 className="!m-0 font-title !text-[26px] !font-bold !leading-[1.2] !text-white">Appointment Request Received</h3>
            <p className="!mb-0 !mt-3 !text-[15px] !leading-[1.6] !text-white/90">{message}</p>
            {confirmation ? <dl className="!mb-0 !mt-6 !grid !w-full !gap-3 !text-left">
              <div className="!flex !flex-wrap !items-baseline !justify-between !gap-x-4 !rounded-[10px] !border !border-white/15 !px-4 !py-3">
                <dt className="!text-[13px] !font-bold !uppercase !tracking-[.04em] !text-white/70">Location</dt>
                <dd className="!m-0 !text-[15px] !font-bold !text-white">{confirmation.selectedChamber.name}</dd>
              </div>
              <div className="!flex !flex-wrap !items-baseline !justify-between !gap-x-4 !rounded-[10px] !border !border-white/15 !px-4 !py-3">
                <dt className="!text-[13px] !font-bold !uppercase !tracking-[.04em] !text-white/70">Consultation</dt>
                <dd className="!m-0 !text-[15px] !font-bold !text-white">{confirmation.consultationType.label}</dd>
              </div>
              <div className="!flex !flex-wrap !items-baseline !justify-between !gap-x-4 !rounded-[10px] !border !border-white/15 !px-4 !py-3">
                <dt className="!text-[13px] !font-bold !uppercase !tracking-[.04em] !text-white/70">Consultation fee</dt>
                <dd className="!m-0 !text-[15px] !font-bold !text-white">{formatAppointmentFee(confirmation.fee)}</dd>
              </div>
            </dl> : null}
            <p className="!mb-0 !mt-6 !text-[13px] !italic !text-white/75">This panel clears automatically in a few seconds, ready for another request.</p>
          </div> : <form onSubmit={onSubmit} noValidate>
            <div className="home2-appointment-grid">
              {/* Each control is wrapped so its inline validation message sits inside the same
                  grid cell, leaving the existing two-column layout untouched. */}
              <div>
                <input id="home-appointment-name" name="fullName" type="text" placeholder="Your Name" required
                  aria-invalid={Boolean(fieldError("fullName"))}
                  aria-describedby={fieldError("fullName") ? "home-appointment-name-error" : undefined} />
                {fieldError("fullName") ? <span id="home-appointment-name-error" className={HOME_FIELD_ERROR_CLASS}>{fieldError("fullName")}</span> : null}
              </div>
              <div>
                <input id="home-appointment-email" name="email" type="email" placeholder="Email Address" required
                  aria-invalid={Boolean(fieldError("email"))}
                  aria-describedby={fieldError("email") ? "home-appointment-email-error" : undefined} />
                {fieldError("email") ? <span id="home-appointment-email-error" className={HOME_FIELD_ERROR_CLASS}>{fieldError("email")}</span> : null}
              </div>
              <div>
                <input id="home-appointment-phone" name="phone" type="tel" placeholder="Phone Number" required
                  aria-invalid={Boolean(fieldError("phone"))}
                  aria-describedby={fieldError("phone") ? "home-appointment-phone-error" : undefined} />
                {fieldError("phone") ? <span id="home-appointment-phone-error" className={HOME_FIELD_ERROR_CLASS}>{fieldError("phone")}</span> : null}
              </div>
              {/* The current appointment model has no department field, so "Select Department" is
                  mapped onto the consultation type and "Select Doctor" onto the consultation
                  location. Both option lists come from the sources `/appointment` already uses,
                  so the two forms cannot drift apart or duplicate the directory. */}
              <div>
                <select id="home-appointment-consultation-type" name="consultationType" aria-label="Consultation type" className={HOME_SELECT_CLASS} defaultValue={defaultConsultationType} required
                  aria-invalid={Boolean(fieldError("consultationType"))}
                  aria-describedby={fieldError("consultationType") ? "home-appointment-consultation-type-error" : undefined}>
                  {appointmentContent.consultationTypes.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
                </select>
                {fieldError("consultationType") ? <span id="home-appointment-consultation-type-error" className={HOME_FIELD_ERROR_CLASS}>{fieldError("consultationType")}</span> : null}
              </div>
              <div>
                <select id="home-appointment-chamber" name="chamberId" aria-label="Consultation location" className={HOME_SELECT_CLASS} defaultValue="" required
                  aria-invalid={Boolean(fieldError("chamberId"))}
                  aria-describedby={fieldError("chamberId") ? "home-appointment-chamber-error" : undefined}>
                  <option value="">Choose a chamber</option>
                  {chambers.map((chamber) => <option key={chamber.id} value={chamber.id}>{chamber.name}</option>)}
                </select>
                {fieldError("chamberId") ? <span id="home-appointment-chamber-error" className={HOME_FIELD_ERROR_CLASS}>{fieldError("chamberId")}</span> : null}
              </div>
              <div>
                <input id="home-appointment-date" name="preferredDate" aria-label="Preferred date" type="date" min={minDate ?? undefined} required
                  aria-invalid={Boolean(fieldError("preferredDate"))}
                  aria-describedby={fieldError("preferredDate") ? "home-appointment-date-error" : undefined} />
                {fieldError("preferredDate") ? <span id="home-appointment-date-error" className={HOME_FIELD_ERROR_CLASS}>{fieldError("preferredDate")}</span> : null}
              </div>
            </div>
            <textarea id="home-appointment-reason" name="reason" placeholder="Type Your Message" required
              aria-invalid={Boolean(fieldError("reason"))}
              aria-describedby={fieldError("reason") ? "home-appointment-reason-error" : undefined} />
            {fieldError("reason") ? <span id="home-appointment-reason-error" className={`${HOME_FIELD_ERROR_CLASS} !mt-2`}>{fieldError("reason")}</span> : null}
            <div className="home2-appointment-submit"><Home2Button type="submit" hoverStyle="solid" disabled={isSubmitting || !hasChambers} ariaBusy={isSubmitting}>{isSubmitting ? "Submitting..." : "Make An Appointment"}</Home2Button></div>
            {state === "error" && message ? <p className="home2-appointment-success !mt-5" role="alert">{message}</p> : null}
          </form>}
        </div>
      </div>
    </div>
  </section>
}
