"use client";

import { useRef, useState, useEffect } from "react";
import { Check, ChevronDown } from "lucide-react";
import { twMerge } from "tailwind-merge";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: (SelectOption | string)[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function Select({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  function toggleOpen() {
    setOpen((prev) => {
      if (!prev && ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        // if less than ~250px below, flip it upwards
        setDropUp(spaceBelow < 250);
      }
      return !prev;
    });
  }

  const normalized = options.map((o) =>
    typeof o === "string" ? { value: o, label: o } : o
  );
  const selected = normalized.find((o) => o.value === value);

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

  // Keyboard nav
  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") setOpen(false);
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleOpen();
    }
  }

  return (
    <div ref={ref} className={twMerge("relative w-full", className)}>
      {/* Trigger — exactly matches .input-field */}
      <button
        type="button"
        role="combobox"
        aria-expanded={open}
        onClick={toggleOpen}
        onKeyDown={onKeyDown}
        className="input-field flex cursor-pointer items-center justify-between text-left"
      >
        <span className={selected ? "text-ink" : "text-ink/40"}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          size={16}
          className={twMerge(
            "ml-2 shrink-0 text-ink/40 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          role="listbox"
          className={twMerge(
            "absolute left-0 right-0 z-50 max-h-60 overflow-auto rounded-xl border border-ink/10 bg-white py-1.5 shadow-xl",
            dropUp ? "bottom-full mb-1.5" : "top-full mt-1.5"
          )}
          style={{
            animation: dropUp
              ? "selectInUp 0.15s cubic-bezier(0.4,0,0.2,1) both"
              : "selectInDown 0.15s cubic-bezier(0.4,0,0.2,1) both",
          }}
        >
          {normalized.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={twMerge(
                  "flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors duration-100 text-left",
                  isSelected
                    ? "bg-grape-50 font-semibold text-grape-700"
                    : "text-ink/80 hover:bg-paper"
                )}
              >
                <span
                  className={twMerge(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
                    isSelected
                      ? "bg-grape-600 text-white"
                      : "border border-ink/20"
                  )}
                >
                  {isSelected && <Check size={10} strokeWidth={3} />}
                </span>
                {opt.label}
              </button>
            );
          })}
        </div>
      )}

      <style>{`
        @keyframes selectInDown {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes selectInUp {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
