"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

type FaqItem = { q: string; a: string };
type FaqSection = { category: string; items: FaqItem[] };

export default function FaqAccordion({ faqs }: { faqs: FaqSection[] }) {
  const [open, setOpen] = useState<string | null>("Booking-0");

  return (
    <div className="mt-8 space-y-8">
      {faqs.map((section) => (
        <div key={section.category}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink/40">{section.category}</p>
          <div className="divide-y divide-ink/8 rounded-2xl border border-ink/10 bg-white">
            {section.items.map((item, i) => {
              const key = `${section.category}-${i}`;
              const isOpen = open === key;
              return (
                <div key={key}>
                  <button
                    onClick={() => setOpen(isOpen ? null : key)}
                    className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium"
                  >
                    {item.q}
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  <div className={cn("grid overflow-hidden transition-all", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                    <div className="overflow-hidden">
                      <p className="px-5 pb-4 text-sm text-ink/60">{item.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
