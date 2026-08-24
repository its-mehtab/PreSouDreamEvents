"use client";

import { useState, useRef, useEffect } from "react";
import { MapPin, ChevronDown, Check } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cities } from "@/lib/data/categories";
import { useLocation } from "@/context/LocationContext";
import { cn } from "@/lib/utils";

export default function LocationSelector({ compact = false }: { compact?: boolean }) {
  const { city, setCity } = useLocation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex items-center gap-1.5 rounded-full text-sm font-medium text-ink/80 transition-colors hover:text-grape-700",
          compact ? "px-2 py-1" : "px-3 py-2"
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <MapPin size={16} className="text-grape-600 shrink-0" />
        {!compact && <span className="text-ink/50">Deliver to</span>}
        <span className="max-w-[110px] truncate font-semibold">{city}</span>
        <ChevronDown size={14} className={cn("transition-transform", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 z-50 mt-2 w-64 rounded-2xl border border-ink/10 bg-white p-2 shadow-card"
            role="listbox"
          >
            <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-ink/40">
              Select your city
            </p>
            <div className="max-h-64 overflow-y-auto">
              {cities.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setCity(c);
                    setOpen(false);
                  }}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm hover:bg-paper"
                  role="option"
                  aria-selected={c === city}
                >
                  {c}
                  {c === city && <Check size={16} className="text-grape-600" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
