"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2 } from "lucide-react";
import { cities } from "@/lib/data/categories";

const schema = z.object({
  company: z.string().min(2, "Enter company name"),
  contactName: z.string().min(2, "Enter contact name"),
  phone: z.string().min(10, "Enter a valid phone number"),
  email: z.string().email("Enter a valid email"),
  eventType: z.string().min(1, "Select event type"),
  city: z.string().min(1, "Select a city"),
  guestCount: z.string().min(1, "Enter approximate attendee count"),
  details: z.string().max(600).optional(),
});
type FormValues = z.infer<typeof schema>;

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-ink/60">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs font-medium text-punch-500">{error}</p>}
    </div>
  );
}

export default function CorporateForm() {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({ resolver: zodResolver(schema) });

  function onSubmit() {
    return new Promise((resolve) => setTimeout(() => { setSubmitted(true); resolve(true); }, 700));
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-ink/10 bg-white py-14 text-center">
        <CheckCircle2 size={36} className="text-leaf-500" />
        <p className="font-display text-xl font-semibold">Quote request received</p>
        <p className="max-w-sm text-sm text-ink/55">Our corporate team will contact you within one business day.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-2xl border border-ink/10 bg-white p-6">
      <p className="font-display text-lg font-semibold">Request a Corporate Quote</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Company Name" error={errors.company?.message}><input {...register("company")} className="input-field" /></Field>
        <Field label="Contact Person" error={errors.contactName?.message}><input {...register("contactName")} className="input-field" /></Field>
        <Field label="Phone" error={errors.phone?.message}><input {...register("phone")} className="input-field" /></Field>
        <Field label="Email" error={errors.email?.message}><input {...register("email")} className="input-field" /></Field>
        <Field label="Event Type" error={errors.eventType?.message}>
          <select {...register("eventType")} className="input-field">
            <option value="">Select type</option>
            <option>Product Launch</option>
            <option>Office Celebration</option>
            <option>Inauguration</option>
            <option>Festival Decoration</option>
            <option>Bulk / Multi-location</option>
          </select>
        </Field>
        <Field label="City" error={errors.city?.message}>
          <select {...register("city")} className="input-field">
            <option value="">Select city</option>
            {cities.map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Approx. Attendees" error={errors.guestCount?.message}><input {...register("guestCount")} className="input-field" /></Field>
      </div>
      <Field label="Additional details"><textarea {...register("details")} rows={3} className="input-field resize-none" /></Field>
      <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
        {isSubmitting ? "Sending…" : "Request Quote"}
      </button>
    </form>
  );
}
