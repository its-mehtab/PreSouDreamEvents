"use client";

import React, { useRef, useState, useEffect } from "react";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isBefore,
  startOfDay,
} from "date-fns";
import { twMerge } from "tailwind-merge";

interface DatePickerProps {
  value: string; // yyyy-MM-dd or ""
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  trigger?: React.ReactNode;
  inline?: boolean;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  className,
  trigger,
  inline,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState<Date>(
    value ? new Date(value) : new Date()
  );
  const ref = useRef<HTMLDivElement>(null);
  const today = startOfDay(new Date());
  const selected = value ? startOfDay(new Date(value)) : null;

  // Close on outside click
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  function buildCalendarDays(): Date[] {
    const start = startOfWeek(startOfMonth(viewMonth), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(viewMonth), { weekStartsOn: 0 });
    const days: Date[] = [];
    let cur = start;
    while (cur <= end) {
      days.push(cur);
      cur = addDays(cur, 1);
    }
    return days;
  }

  function handleSelect(day: Date) {
    if (isBefore(day, today)) return;
    onChange(format(day, "yyyy-MM-dd"));
    if (!inline) setOpen(false);
  }

  const days = buildCalendarDays();
  const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const calendarContent = (
    <div
      className={twMerge(
        "rounded-2xl border border-ink/10 bg-white p-5 w-[340px]",
        !inline && "absolute right-0 z-50 mt-1.5 shadow-xl"
      )}
      style={!inline ? { animation: "selectIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) both" } : undefined}
    >
      {/* Month header */}
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setViewMonth((m) => subMonths(m, 1))}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-ink/50 hover:bg-paper hover:text-ink transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft size={16} />
        </button>
        <p className="text-sm font-semibold text-ink">
          {format(viewMonth, "MMMM yyyy")}
        </p>
        <button
          type="button"
          onClick={() => setViewMonth((m) => addMonths(m, 1))}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-ink/50 hover:bg-paper hover:text-ink transition-colors"
          aria-label="Next month"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Day labels */}
      <div className="mb-1 grid grid-cols-7 gap-0.5">
        {DAY_LABELS.map((d) => (
          <div
            key={d}
            className="text-center text-[11px] font-semibold uppercase tracking-wide text-ink/35"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {days.map((day, i) => {
          const isPast = isBefore(day, today);
          const isCurrentMonth = isSameMonth(day, viewMonth);
          const isSelected = selected ? isSameDay(day, selected) : false;
          const isToday = isSameDay(day, today);

          return (
            <button
              type="button"
              key={i}
              onClick={() => handleSelect(day)}
              disabled={isPast}
              className={twMerge(
                "flex h-9 w-full items-center justify-center rounded-xl text-sm transition-colors duration-100",
                !isCurrentMonth && "text-ink/20",
                isCurrentMonth && !isSelected && !isPast &&
                  "text-ink/75 hover:bg-grape-50 hover:text-grape-700",
                isPast && "cursor-not-allowed text-ink/25",
                isToday && !isSelected &&
                  "font-semibold text-grape-600 ring-1 ring-inset ring-grape-300",
                isSelected &&
                  "bg-grape-600 font-semibold text-white hover:bg-grape-700 shadow-sm"
              )}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>
    </div>
  );

  if (inline) {
    return <div className={className}>{calendarContent}</div>;
  }

  return (
    <div ref={ref} className={twMerge("relative w-full", className)}>
      {/* Trigger */}
      {trigger ? (
        <div onClick={() => setOpen((o) => !o)} className="cursor-pointer">
          {trigger}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="input-field flex cursor-pointer items-center justify-between text-left"
        >
          <span className={selected ? "text-ink" : "text-ink/40"}>
            {selected ? format(selected, "dd MMM yyyy") : placeholder}
          </span>
          <CalendarIcon size={16} className="ml-2 shrink-0 text-ink/40" />
        </button>
      )}

      {/* Calendar Popover */}
      {open && calendarContent}

      <style>{`
        @keyframes selectIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
