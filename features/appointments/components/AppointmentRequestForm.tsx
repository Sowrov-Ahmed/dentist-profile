"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { ApiClientError } from "@/types/api";
import type { AppointmentContent, AppointmentSubmissionRequest, Chamber, ChamberFees } from "@/types/content";
import { Icon } from "@/components/ui/Icon";
import { formatAppointmentFee, getAppointmentConsultationType, getAppointmentFee } from "../appointment.domain";
import { submitAppointmentRequest } from "../appointment.service";

type FormState = "idle" | "submitting" | "success" | "error";

type FieldErrors = Partial<Record<keyof AppointmentSubmissionRequest, string[]>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function todayInputValue() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function phoneHref(phone: string) {
  return `tel:${phone.replace(/\s/g, "")}`;
}

function describeSchedule(chamber: Chamber) {
  const additional = chamber.additionalSchedule.map((item) => `${item.days}: ${item.hours}`);
  return [
    `${chamber.days}: ${chamber.hours}`,
    ...additional
  ];
}

function formatDateForSummary(date: string) {
  if (!date) return "Not selected yet";
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat("en", { month: "long", day: "2-digit", year: "numeric" }).format(parsed);
}

export function AppointmentRequestForm({ content, chambers, selectedChamber }: { content: AppointmentContent; chambers: Chamber[]; selectedChamber: Chamber | null }) {
  const defaultConsultationType = content.consultationTypes[0]?.id || "";
  const minDate = useMemo(() => todayInputValue(), []);
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [chamberId, setChamberId] = useState(selectedChamber?.id || "");
  const [consultationTypeId, setConsultationTypeId] = useState<string>(defaultConsultationType);
  const [preferredDate, setPreferredDate] = useState("");

  useEffect(() => {
    setChamberId(selectedChamber?.id || "");
  }, [selectedChamber?.id]);

  const activeChamber = useMemo(() => chambers.find((chamber) => chamber.id === chamberId) || null, [chamberId, chambers]);
  const activeConsultationType = useMemo(() => getAppointmentConsultationType(content, consultationTypeId), [consultationTypeId, content]);
  const activeFee = getAppointmentFee(activeChamber, consultationTypeId);
  const isSubmitting = state === "submitting";
  const hasChambers = chambers.length > 0;

  function validate(payload: AppointmentSubmissionRequest): FieldErrors {
    const nextErrors: FieldErrors = {};
    if (!payload.chamberId || !chambers.some((chamber) => chamber.id === payload.chamberId)) nextErrors.chamberId = ["Please select a consultation location."];
    if (!payload.consultationType || !content.consultationTypes.some((item) => item.id === payload.consultationType)) nextErrors.consultationType = ["Please select a consultation type."];
    if (!payload.preferredDate) nextErrors.preferredDate = ["Please select a preferred date."];
    else if (payload.preferredDate < minDate) nextErrors.preferredDate = ["Please choose today or a future date."];
    if (!payload.fullName || payload.fullName.trim().length < 2) nextErrors.fullName = ["Full name is required."];
    if (!payload.phone || !/^[+\d][+\d\s().-]{6,}$/.test(payload.phone.trim())) nextErrors.phone = ["Please enter a valid phone number."];
    if (!payload.email || !emailPattern.test(payload.email.trim())) nextErrors.email = ["Please enter a valid email address."];
    if (!payload.reason || payload.reason.trim().length < 10) nextErrors.reason = ["Please describe the reason in at least 10 characters."];
    return nextErrors;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
    const nextErrors = validate(payload);

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

  return <div className="source-appointment-shell source-appointment-shell-compact" data-reveal="up">
    <form className="source-appointment-request-form source-appointment-request-form-compact" onSubmit={submit} noValidate>
      <div className="source-appointment-card-header">
        <p className="source-chambers-eyebrow">Appointment request</p>
        <h3>Request an appointment</h3>
        <p>Choose your preferred consultation details and provide your contact information. Our team will confirm availability with you.</p>
      </div>

      {!hasChambers ? <div className="source-appointment-inline-note" role="status">Loading chamber options from the consultation directory...</div> : null}

      <fieldset className="source-appointment-compact-fields" disabled={isSubmitting}>
        <label className="source-appointment-field" htmlFor="appointment-chamber">
          <span>Consultation location <em aria-hidden="true">*</em></span>
          <select
            id="appointment-chamber"
            name="chamberId"
            value={chamberId}
            onChange={(event) => {
              setChamberId(event.target.value);
              setErrors((current) => ({ ...current, chamberId: undefined }));
              setState((current) => current === "error" ? "idle" : current);
            }}
            required
            aria-invalid={Boolean(errors.chamberId)}
            aria-describedby={errors.chamberId ? "appointment-chamber-error" : "appointment-chamber-help"}
          >
            <option value="">Choose a chamber</option>
            {chambers.map((chamber) => <option key={chamber.id} value={chamber.id}>{chamber.name}</option>)}
          </select>
          <span id="appointment-chamber-help" className="source-appointment-help">Select where you prefer to be seen.</span>
          <FieldError id="appointment-chamber-error" errors={errors.chamberId} />
        </label>

        <label className="source-appointment-field" htmlFor="appointment-consultation-type">
          <span>Consultation type <em aria-hidden="true">*</em></span>
          <select
            id="appointment-consultation-type"
            name="consultationType"
            value={consultationTypeId}
            onChange={(event) => {
              setConsultationTypeId(event.target.value);
              setErrors((current) => ({ ...current, consultationType: undefined }));
              setState((current) => current === "error" ? "idle" : current);
            }}
            required
            aria-invalid={Boolean(errors.consultationType)}
            aria-describedby={errors.consultationType ? "appointment-consultation-type-error" : "appointment-consultation-type-help"}
          >
            {content.consultationTypes.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select>
          <span id="appointment-consultation-type-help" className="source-appointment-help">The summary will update with the applicable fee.</span>
          <FieldError id="appointment-consultation-type-error" errors={errors.consultationType} />
        </label>

        <label className="source-appointment-field" htmlFor="appointment-date">
          <span>Preferred date <em aria-hidden="true">*</em></span>
          <input
            id="appointment-date"
            name="preferredDate"
            type="date"
            min={minDate}
            value={preferredDate}
            onChange={(event) => {
              setPreferredDate(event.target.value);
              setErrors((current) => ({ ...current, preferredDate: undefined }));
              setState((current) => current === "error" ? "idle" : current);
            }}
            required
            aria-invalid={Boolean(errors.preferredDate)}
            aria-describedby={errors.preferredDate ? "appointment-date-error" : "appointment-date-help"}
          />
          <span id="appointment-date-help" className="source-appointment-help">Choose today or a future date.</span>
          <FieldError id="appointment-date-error" errors={errors.preferredDate} />
        </label>

        <label className="source-appointment-field" htmlFor="appointment-full-name">
          <span>Full name <em aria-hidden="true">*</em></span>
          <input
            id="appointment-full-name"
            name="fullName"
            type="text"
            placeholder="Your name"
            required
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={errors.fullName ? "appointment-full-name-error" : undefined}
          />
          <FieldError id="appointment-full-name-error" errors={errors.fullName} />
        </label>

        <label className="source-appointment-field" htmlFor="appointment-phone">
          <span>Phone <em aria-hidden="true">*</em></span>
          <input
            id="appointment-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            placeholder="+880 1XXX-XXXXXX"
            required
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "appointment-phone-error" : undefined}
          />
          <FieldError id="appointment-phone-error" errors={errors.phone} />
        </label>

        <label className="source-appointment-field" htmlFor="appointment-email">
          <span>Email address <em aria-hidden="true">*</em></span>
          <input
            id="appointment-email"
            name="email"
            type="email"
            inputMode="email"
            placeholder="Your email address"
            required
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "appointment-email-error" : undefined}
          />
          <FieldError id="appointment-email-error" errors={errors.email} />
        </label>

        <label className="source-appointment-field source-appointment-reason-field" htmlFor="appointment-reason">
          <span>Reason for consultation <em aria-hidden="true">*</em></span>
          <textarea
            id="appointment-reason"
            name="reason"
            rows={4}
            placeholder="Briefly describe the concern..."
            required
            aria-invalid={Boolean(errors.reason)}
            aria-describedby={errors.reason ? "appointment-reason-error" : "appointment-reason-help"}
          />
          <span id="appointment-reason-help" className="source-appointment-help">Share symptoms, concerns, or follow-up context.</span>
          <FieldError id="appointment-reason-error" errors={errors.reason} />
        </label>
      </fieldset>

      <div className="source-appointment-submit-row source-appointment-submit-row-compact">
        <button type="submit" disabled={isSubmitting || !hasChambers}>{isSubmitting ? "Submitting request..." : "Request appointment"} <Icon name="arrow" size={17} /></button>
        <p>This request does not confirm a booking. The chamber team will contact you to confirm availability.</p>
      </div>

      {message ? <div className="source-appointment-status" role={state === "success" ? "status" : "alert"} data-state={state === "success" ? "success" : "error"}>{message}</div> : null}
    </form>

    <aside className="source-appointment-live-summary" aria-label="Consultation summary" aria-live="polite">
      <div className="source-appointment-summary-card">
        <p className="source-chambers-eyebrow">Consultation summary</p>
        <h3>{activeChamber?.name || "Select a chamber"}</h3>
        {activeChamber ? <>
          <p className="source-chamber-address"><Icon name="pin" size={18} /> <span>{activeChamber.address}</span></p>
          <dl className="source-appointment-summary-list">
            <div><dt>Primary status</dt><dd>{activeChamber.primary ? "Primary chamber" : activeChamber.tag}</dd></div>
            <div><dt>Consultation type</dt><dd>{activeConsultationType?.label || "Not selected yet"}</dd></div>
            <div><dt>Preferred date</dt><dd>{formatDateForSummary(preferredDate)}</dd></div>
            <div><dt>Schedule</dt><dd>{describeSchedule(activeChamber).map((item) => <span key={item}>{item}</span>)}</dd></div>
            <div><dt>Phone</dt><dd><a href={phoneHref(activeChamber.phone)}>{activeChamber.phone}</a></dd></div>
          </dl>
          <div className="source-appointment-summary-actions">
            <a href={activeChamber.mapUrl} target="_blank" rel="noopener noreferrer"><Icon name="mapLocation" size={18} /> View map</a>
          </div>
        </> : <p className="source-appointment-summary-copy">Choose a consultation location to review chamber address, schedule, contact number, and map link.</p>}
      </div>

      <div className="source-appointment-fee-card" id="appointment-fee-preview">
        <span>Consultation fee</span>
        <strong>{activeChamber && activeConsultationType ? formatAppointmentFee(activeFee) : "—"}</strong>
        <p>{activeChamber && activeConsultationType ? `${activeConsultationType.label} at ${activeChamber.name}` : "Select a chamber and consultation type to view the fee."}</p>
      </div>
    </aside>
  </div>;
}

function FieldError({ id, errors }: { id: string; errors?: string[] }) {
  if (!errors?.length) return null;
  return <span id={id} className="form-error">{errors[0]}</span>;
}
