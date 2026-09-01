"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CalendarDays, ChevronDown, Check } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { format, subDays, startOfWeek, startOfMonth, startOfYear } from "date-fns";
import { AnimatePresence, motion } from "motion/react";

const RANGES = [
  { value: "all", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "last-7-days", label: "Last 7 Days" },
  { value: "this-month", label: "This Month" },
  { value: "last-30-days", label: "Last 30 Days" },
  { value: "this-year", label: "This Year" },
];

function getLabelForRange(range: string) {
  const now = new Date();
  switch (range) {
    case "today":
      return `${format(now, "dd MMM, yyyy")}`;
    case "yesterday":
      return `${format(subDays(now, 1), "dd MMM, yyyy")}`;
    case "last-7-days":
      return `${format(subDays(now, 7), "dd MMM")} - ${format(now, "dd MMM, yyyy")}`;
    case "this-month":
      return `${format(startOfMonth(now), "dd MMM")} - ${format(now, "dd MMM, yyyy")}`;
    case "last-30-days":
      return `${format(subDays(now, 30), "dd MMM")} - ${format(now, "dd MMM, yyyy")}`;
    case "this-year":
      return `${format(startOfYear(now), "dd MMM")} - ${format(now, "dd MMM, yyyy")}`;
    default:
      return "All Time";
  }
}

export default function DashboardDateFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentRange = searchParams.get("range") || "all";
  const [open, setOpen] = useState(false);

  const displayLabel = getLabelForRange(currentRange);

  function handleSelect(val: string) {
    const params = new URLSearchParams(searchParams);
    if (val === "all") {
      params.delete("range");
    } else {
      params.set("range", val);
    }
    router.push(`?${params.toString()}`);
    setOpen(false);
  }

  return (
    <div className="relative z-50">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900"
      >
        <CalendarDays size={14} className="text-grape-500" />
        <span className="min-w-[140px] text-left">{displayLabel}</span>
        <ChevronDown size={14} className={twMerge("ml-1 text-gray-400 transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.95 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute right-0 top-full z-50 mt-2 w-48 rounded-xl border border-gray-100 bg-white py-1.5 shadow-xl origin-top-right"
            >
              {RANGES.map((r) => (
                <button
                  key={r.value}
                  onClick={() => handleSelect(r.value)}
                  className={twMerge(
                    "flex w-full items-center justify-between px-3 py-2 text-sm transition-colors hover:bg-gray-50",
                    currentRange === r.value ? "text-grape-700 font-semibold bg-grape-50/50" : "text-gray-700"
                  )}
                >
                  {r.label}
                  {currentRange === r.value && <Check size={14} className="text-grape-600" />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
