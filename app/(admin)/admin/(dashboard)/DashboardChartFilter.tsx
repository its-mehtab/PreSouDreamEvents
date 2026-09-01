"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, Check } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { AnimatePresence, motion } from "motion/react";

const RANGES = [
  { value: "3m", label: "Last 3 Months" },
  { value: "6m", label: "Last 6 Months" },
  { value: "12m", label: "Last 12 Months" },
];

export default function DashboardChartFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentRange = searchParams.get("chartRange") || "6m";
  const [open, setOpen] = useState(false);

  const displayLabel = RANGES.find((r) => r.value === currentRange)?.label || "Last 6 Months";

  function handleSelect(val: string) {
    const params = new URLSearchParams(searchParams);
    if (val === "6m") {
      params.delete("chartRange"); // 6m is default
    } else {
      params.set("chartRange", val);
    }
    router.push(`?${params.toString()}`);
    setOpen(false);
  }

  return (
    <div className="relative z-40">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-gray-600 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900"
      >
        <span>{displayLabel}</span>
        <ChevronDown size={12} className={twMerge("text-gray-400 transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.95 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute right-0 top-full z-40 mt-1.5 w-36 rounded-xl border border-gray-100 bg-white py-1.5 shadow-xl origin-top-right"
            >
              {RANGES.map((r) => (
                <button
                  key={r.value}
                  onClick={() => handleSelect(r.value)}
                  className={twMerge(
                    "flex w-full items-center justify-between px-3 py-1.5 text-xs transition-colors hover:bg-gray-50",
                    currentRange === r.value ? "text-grape-700 font-semibold bg-grape-50/50" : "text-gray-700"
                  )}
                >
                  {r.label}
                  {currentRange === r.value && <Check size={12} className="text-grape-600" />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
