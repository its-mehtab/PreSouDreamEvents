"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, UploadCloud } from "lucide-react";
import { cities, allThemes } from "@/lib/data/categories";

const schema = z.object({
  occasion: z.string().min(2, "Tell us the occasion"),
  budget: z.string().min(1, "Select a budget range"),
  theme: z.string().min(1, "Pick a theme"),
  colors: z.string().min(2, "Tell us your preferred colours"),
  venue: z.string().min(2, "Tell us the venue"),
  city: z.string().min(1, "Select a city"),
  eventDate: z.string().min(1, "Select a date"),
  guestCount: z.string().min(1, "Enter approximate guest count"),
  requirements: z.string().max(600).optional(),
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

export default function CustomForm() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  function onSubmit(data: FormValues) {
    return new Promise((resolve) => {
      setTimeout(() => {
        setSubmitted(true);
        resolve(true);
      }, 700);
    });
  }

  if (submitted) {
    return (
      <div className="container-app flex flex-col items-center gap-3 py-24 text-center">
        <CheckCircle2 size={40} className="text-leaf-500" />
        <h1 className="font-display text-2xl font-bold">Request received!</h1>
        <p className="max-w-sm text-sm text-ink/55">
          Our design team will review your requirements and reach out within 24 hours with a
          custom quote and mood board.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4 rounded-2xl border border-ink/10 bg-white p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Occasion" error={errors.occasion?.message}>
          <input {...register("occasion")} className="input-field" placeholder="e.g. 25th Anniversary" />
        </Field>
        <Field label="Budget Range" error={errors.budget?.message}>
          <select {...register("budget")} className="input-field">
            <option value="">Select budget</option>
            <option>Under ₹5,000</option>
            <option>₹5,000 – ₹15,000</option>
            <option>₹15,000 – ₹50,000</option>
            <option>Above ₹50,000</option>
          </select>
        </Field>
        <Field label="Preferred Theme" error={errors.theme?.message}>
          <select {...register("theme")} className="input-field">
            <option value="">Select theme</option>
            {allThemes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>
        <Field label="Preferred Colours" error={errors.colors?.message}>
          <input {...register("colors")} className="input-field" placeholder="e.g. Blush pink & gold" />
        </Field>
        <Field label="Venue Type" error={errors.venue?.message}>
          <input {...register("venue")} className="input-field" placeholder="e.g. Rooftop terrace" />
        </Field>
        <Field label="City" error={errors.city?.message}>
          <select {...register("city")} className="input-field">
            <option value="">Select city</option>
            {cities.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>
        <Field label="Event Date" error={errors.eventDate?.message}>
          <input type="date" {...register("eventDate")} className="input-field" />
        </Field>
        <Field label="Guest Count" error={errors.guestCount?.message}>
          <input {...register("guestCount")} className="input-field" placeholder="e.g. 40" />
        </Field>
      </div>
      <Field label="Requirements & Inspiration">
        <textarea {...register("requirements")} rows={4} className="input-field resize-none" placeholder="Describe your vision, must-haves, or paste reference links…" />
      </Field>
      <div className="flex items-center gap-3 rounded-xl border border-dashed border-ink/20 p-4 text-sm text-ink/50">
        <UploadCloud size={20} />
        Attach inspiration images (drag & drop coming soon — for now, share links in Requirements)
      </div>
      <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
        {isSubmitting ? "Sending request…" : "Submit Custom Request"}
      </button>
    </form>
  );
}
