"use client";

import WhatsAppIcon from "./WhatsAppIcon";
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
  label?: React.ReactNode;
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
        <WhatsAppIcon size={20} />
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
        className={`flex items-center justify-between gap-3 rounded-2xl bg-white border border-ink/8 px-4 py-3.5 transition-colors hover:bg-leaf-100 hover:border-leaf-100 ${className}`}
      >
        <div className="flex items-center gap-3">
          <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-leaf-500 text-white shadow-sm">
            <WhatsAppIcon size={18} />
          </span>
          <div className="leading-tight">
            <p className="text-[13px] font-bold text-ink">Need it today?</p>
            <p className="text-[11px] font-medium text-ink/50 mt-0.5">WhatsApp us and we&apos;ll check same-day setup for you</p>
          </div>
        </div>
        <span className="text-xs font-bold text-leaf-600 pr-1">Chat now →</span>
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
      <WhatsAppIcon size={16} />
      {label}
    </a>
  );
}
