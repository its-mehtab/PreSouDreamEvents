"use client";

import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { FilterState } from "@/lib/filtering";
import FilterPanel from "@/components/shop/FilterPanel";

export default function FilterDrawer({
  open,
  onClose,
  filters,
  onChange,
  hideOccasion,
  resultCount,
}: {
  open: boolean;
  onClose: () => void;
  filters: FilterState;
  onChange: (f: FilterState) => void;
  hideOccasion?: boolean;
  resultCount: number;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-ink/40 lg:hidden"
            onClick={onClose}
          />
          <motion.aside
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            className="fixed inset-x-0 bottom-0 z-[80] flex max-h-[85vh] flex-col rounded-t-3xl bg-white lg:hidden"
          >
            <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
              <h2 className="font-display text-lg font-semibold">Filters</h2>
              <button onClick={onClose} className="rounded-full p-1.5 hover:bg-paper" aria-label="Close filters">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5">
              <FilterPanel filters={filters} onChange={onChange} hideOccasion={hideOccasion} />
            </div>
            <div className="border-t border-ink/10 p-4">
              <button onClick={onClose} className="btn-primary w-full">
                Show {resultCount} result{resultCount !== 1 ? "s" : ""}
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
