"use client";

import { FormEvent, useState } from "react";
import { submitAppointmentRequest } from "@/features/dental/submission.service";
import { ApiClientError } from "@/types/api";
import type { AppointmentRequest, Chamber, DentalService } from "@/types/content";

type FormState = "idle" | "submitting" | "success" | "error";

type AppointmentFormProps = {
  services: DentalService[];
  compact?: boolean;
  chambers?: Chamber[];
  selectedChamber?: Chamber | null;
};

export function AppointmentForm({ services, compact = false, chambers = [], selectedChamber = null }: AppointmentFormProps) {
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setState("submitting");
    setMessage("");
    setErrors({});

    const selectedChamberId = String(formData.get("chamberId") || "");
    const requestedChamber = chambers.find((chamber) => chamber.id === selectedChamberId) || selectedChamber;
    const payload: AppointmentRequest = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      service: String(formData.get("service") || ""),
      preferredDate: String(formData.get("preferredDate") || ""),
      chamberId: requestedChamber?.id,
      chamberName: requestedChamber?.name,
      message: String(formData.get("message") || "")
    };

    try {
      const response = await submitAppointmentRequest(payload);
      setMessage(response.message || "Your request has been received.");
      setState("success");
    } catch (error) {
      if (error instanceof ApiClientError) {
        setMessage(error.message);
        setErrors(error.details || {});
      } else {
        setMessage("Something went wrong. Please try again.");
      }
      setState("error");
    }
  }

  return (
    <form onSubmit={submit} className={compact ? "source-service-appoint-form" : "home-appoint-form"} noValidate>
      <div className={compact ? "source-service-form-gridless" : "home-appoint-grid"}>
        <FieldError errors={errors.name} />
        <input name="name" type="text" placeholder="Your Name" aria-label="Your Name" required />
        <FieldError errors={errors.email} />
        <input name="email" type="email" placeholder="Email Address" aria-label="Email Address" required />
        <input name="phone" type="tel" placeholder="Phone Number" aria-label="Phone Number" />
        <select name="service" aria-label="Select Service" defaultValue="">
          <option value="" disabled>
            Select Service
          </option>
          {services.map((service) => (
            <option key={service.slug} value={service.title}>
              {service.title}
            </option>
          ))}
        </select>
        {chambers.length > 0 ? <select name="chamberId" aria-label="Select Chamber" defaultValue={selectedChamber?.id || ""}>
          <option value="">Select Chamber</option>
          {chambers.map((chamber) => <option key={chamber.id} value={chamber.id}>{chamber.name}</option>)}
        </select> : selectedChamber ? <input type="hidden" name="chamberId" value={selectedChamber.id} /> : null}
        {!compact ? <input name="preferredDate" type="date" aria-label="Preferred appointment date" /> : null}
      </div>
      {!compact ? (
        <>
          <FieldError errors={errors.message} />
          <textarea name="message" placeholder="Describe Your Dental Concern" aria-label="Describe your dental concern" required />
          <div className="home-appoint-submit">
            <button type="submit" disabled={state === "submitting"}>
              {state === "submitting" ? "Submitting..." : "Make Appointment"}
            </button>
          </div>
        </>
      ) : (
        <button type="submit" disabled={state === "submitting"}>
          {state === "submitting" ? "Submitting..." : "Book Now"}
        </button>
      )}
      {compact ? <input type="hidden" name="message" value="Appointment requested from compact service form." /> : null}
      {message ? <p className={compact ? "source-service-appoint-success" : "home-appoint-success"}>{message}</p> : null}
    </form>
  );
}

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <span className="form-error">{errors[0]}</span>;
}
