"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-6">
      {sent ? (
        <div className="flex flex-col items-center gap-2 py-10 text-center">
          <CheckCircle2 size={32} className="text-leaf-500" />
          <p className="font-semibold">Message sent!</p>
          <p className="text-sm text-ink/50">We&apos;ll get back to you shortly.</p>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="space-y-4"
        >
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink/60">Name</label>
            <input required className="input-field" placeholder="Your name" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink/60">Email</label>
            <input required type="email" className="input-field" placeholder="you@email.com" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink/60">Message</label>
            <textarea required rows={4} className="input-field resize-none" placeholder="How can we help?" />
          </div>
          <button type="submit" className="btn-primary w-full">Send Message</button>
        </form>
      )}
    </div>
  );
}
