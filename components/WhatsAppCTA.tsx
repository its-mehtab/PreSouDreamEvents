"use client";

import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/utils";

interface Props {
  productName?: string;
  city?: string;
  venue?: string;
  date?: string;
  time?: string;
  customization?: string;
  variant?: "banner" | "button" | "floating";
  className?: string;
  label?: string;
}

export default function WhatsAppCTA({
  productName,
  city,
  venue,
  date,
  time,
  customization,
  variant = "button",
  className = "",
  label = "Need it today? WhatsApp us",
}: Props) {
  const lines = [
    "Hi PreSou Dream Events! I need decoration set up. Can you confirm availability?",
    productName ? `Decoration: ${productName}` : null,
    city ? `City: ${city}` : null,
    venue ? `Venue: ${venue}` : null,
    date ? `Requested date: ${date}` : null,
    time ? `Requested time: ${time}` : null,
    customization ? `Customization: ${customization}` : null,
  ].filter(Boolean) as string[];

  const href = whatsappLink(lines.join("\n"));

  if (variant === "floating") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Need it today? WhatsApp us"
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-leaf-500 px-4 py-3 text-sm font-semibold text-white shadow-pop transition-transform hover:scale-105 active:scale-95"
      >
        <MessageCircle size={20} />
        <span className="hidden sm:inline">Need it today?</span>
      </a>
    );
  }

  if (variant === "banner") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center justify-between gap-3 rounded-2xl bg-leaf-50 px-4 py-3.5 transition-colors hover:bg-leaf-100 ${className}`}
      >
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-leaf-500 text-white">
            <MessageCircle size={18} />
          </span>
          <div>
            <p className="text-sm font-semibold text-leaf-600">Need it today?</p>
            <p className="text-xs text-ink/50">WhatsApp us and we&apos;ll check same-day setup for you</p>
          </div>
        </div>
        <span className="text-xs font-semibold text-leaf-600">Chat now →</span>
      </a>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-full border border-leaf-500 px-4 py-2.5 text-sm font-semibold text-leaf-600 hover:bg-leaf-50 ${className}`}
    >
      <MessageCircle size={16} />
      {label}
    </a>
  );
}
