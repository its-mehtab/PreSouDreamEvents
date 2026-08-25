"use client";

import React, { useState, useRef, useEffect, useId } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export const SINGLE_BALLOON_COLORS = [
  { name: "Red", hex: "#ef4444" },
  { name: "Pink", hex: "#ec4899" },
  { name: "Dark Red", hex: "#991b1b" },
  { name: "Orange", hex: "#f97316" },
  { name: "Peach", hex: "#fdba74" },
  { name: "Yellow", hex: "#eab308" },
  { name: "Light Yellow", hex: "#fef08a" },
  { name: "Green", hex: "#22c55e" },
  { name: "Mint", hex: "#6ee7b7" },
  { name: "Teal", hex: "#14b8a6" },
  { name: "Blue", hex: "#3b82f6" },
  { name: "Light Blue", hex: "#7dd3fc" },
  { name: "Dark Blue", hex: "#1e3a8a" },
  { name: "Purple", hex: "#a855f7" },
  { name: "Dark Purple", hex: "#581c87" },
  { name: "Lavender", hex: "#c084fc" },
  { name: "Brown", hex: "#78350f" },
  { name: "White", hex: "#ffffff" },
  { name: "Grey", hex: "#6b7280" },
  { name: "Black", hex: "#0f172a" },
  { name: "Gold", hex: "#fbbf24" },
  { name: "Silver", hex: "#e2e8f0" },
  { name: "Rose Gold", hex: "#fda4af" },
  { name: "Light Grey", hex: "#d1d5db" },
];

export const BalloonIcon = ({ color, size = 14 }: { color: string; size?: number }) => {
  const gradId = "grad-" + useId().replace(/:/g, "");
  const actualColor = color === "url(#sameAsImage)" ? `url(#${gradId})` : color;
  
  return (
    <svg width={size} height={Math.round(size * 18 / 14)} viewBox="0 0 24 32" className="drop-shadow-sm shrink-0">
      <defs>
        <linearGradient id={gradId} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="24" y2="32">
          <stop offset="0%" stopColor="#ec4899" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      <path
        d="M12 1C6 1 2 6 2 12.5C2 19 8 24 11 26.5L12 27L13 26.5C16 24 22 19 22 12.5C22 6 18 1 12 1Z"
        fill={actualColor}
      />
      <path d="M9.5 27L14.5 27L12.5 30H11.5L9.5 27Z" fill={actualColor} />
      <path d="M12 30 Q 10 33 13 36" stroke={actualColor} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M6 10A6 6 0 0 1 10 6" stroke="rgba(255,255,255,0.55)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </svg>
  );
};

interface CustomColorPickerProps {
  onClose: () => void;
  onDone: (colors: string[]) => void;
  initialColors?: string[];
}

export function CustomColorPicker({ onClose, onDone, initialColors = [] }: CustomColorPickerProps) {
  const [selected, setSelected] = useState<string[]>(initialColors);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (ref.current && !ref.current.contains(target)) {
        // Ignore clicks on the toggle button itself so its onClick can handle toggling
        if (target.closest('[data-custom-picker-toggle]')) return;
        onClose();
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const toggleColor = (name: string) => {
    setSelected((prev) => {
      if (prev.includes(name)) return prev.filter((n) => n !== name);
      if (prev.length >= 3) return prev;
      return [...prev, name];
    });
  };

  return (
    <div
      ref={ref}
      className="mt-3 w-full"
    >
      <div className="rounded-2xl border border-ink/10 bg-white p-2 shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-ink/8 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1.5">
              <AnimatePresence mode="popLayout">
                {selected.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <BalloonIcon color="#cbd5e1" size={16} />
                  </motion.div>
                ) : (
                  selected.map((s, i) => (
                    <motion.div
                      key={`${s}-${i}`}
                      initial={{ scale: 0, opacity: 0, x: -10 }}
                      animate={{ scale: 1, opacity: 1, x: 0 }}
                      exit={{ scale: 0, opacity: 0, x: -10 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className="relative"
                      style={{ zIndex: selected.length - i }}
                    >
                      <BalloonIcon
                        size={16}
                        color={SINGLE_BALLOON_COLORS.find((c) => c.name === s)?.hex || "#000"}
                      />
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
            <span className="text-sm font-semibold text-ink">
              {selected.length > 0 ? selected.join(" · ") : "Pick your mix"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className={cn(
              "text-xs font-bold tabular-nums",
              selected.length === 3 ? "text-punch-500" : "text-ink/35"
            )}>
              {selected.length}/3
            </span>
            {selected.length > 0 && (
              <button
                onClick={() => setSelected([])}
                className="text-[11px] font-semibold text-ink/40 hover:text-punch-500 transition-colors"
              >
                Clear
              </button>
            )}
            <button onClick={onClose} className="text-ink/30 hover:text-ink transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Color grid */}
        <div className="p-3">
          <div className="grid grid-cols-6 gap-1">
            {SINGLE_BALLOON_COLORS.map((c) => {
              const isSelected = selected.includes(c.name);
              const isDisabled = !isSelected && selected.length >= 3;
              return (
                <button
                  key={c.name}
                  onClick={() => toggleColor(c.name)}
                  disabled={isDisabled}
                  title={c.name}
                  className={cn(
                    "group relative flex flex-col items-center gap-1 rounded-xl p-2 transition-all duration-150",
                    isSelected
                      ? "bg-[#6A4C9C]/8 ring-1 ring-[#6A4C9C]/30"
                      : isDisabled
                      ? "opacity-30 cursor-not-allowed"
                      : "hover:bg-ink/5 cursor-pointer"
                  )}
                >
                  <BalloonIcon color={c.hex} size={18} />
                  <span className={cn(
                    "text-[9px] font-medium leading-none text-center transition-colors",
                    isSelected ? "text-[#6A4C9C]" : "text-ink/40 group-hover:text-ink/60"
                  )}>
                    {c.name}
                  </span>
                  {isSelected && (
                    <div className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#6A4C9C] text-white shadow-sm">
                      <Check size={8} strokeWidth={4} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-ink/8 px-4 py-3">
          <p className="mb-2.5 text-[11px] text-ink/45 leading-snug">
            Choose up to <strong>3 balloon colours</strong>. Need more? Add it in Special Instructions at checkout.
          </p>
          <button
            onClick={() => {
              if (selected.length > 0) onDone(selected);
              else onClose();
            }}
            disabled={selected.length === 0}
            className={cn(
              "flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-bold transition-all",
              selected.length > 0
                ? "bg-[#6A4C9C] text-white hover:bg-[#5a3d85] shadow-md shadow-[#6A4C9C]/25"
                : "bg-ink/8 text-ink/30 cursor-not-allowed"
            )}
          >
            <Check size={14} strokeWidth={3} />
            Apply{selected.length > 0 ? ` (${selected.length} colour${selected.length > 1 ? "s" : ""})` : ""}
          </button>
        </div>
      </div>
      <style>{`
        @keyframes selectIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
