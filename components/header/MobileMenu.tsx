"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import {
  X,
  User,
  Heart,
  Package,
  Building2,
  HelpCircle,
  Phone,
  ChevronDown,
} from "lucide-react";
import { NavCategory } from "@/lib/navigation-config";
import LocationSelector from "@/components/header/LocationSelector";

export default function MobileMenu({
  open,
  onClose,
  navConfig,
}: {
  open: boolean;
  onClose: () => void;
  navConfig: NavCategory[];
}) {
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const toggleCategory = (slug: string) => {
    setOpenCategory((prev) => (prev === slug ? null : slug));
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-ink/40"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-0 left-0 top-0 z-[80] flex w-full max-w-[320px] flex-col overflow-y-auto bg-white"
          >
            <div className="flex items-center justify-between border-b border-ink/10 p-4">
              <Link
                href="/"
                onClick={onClose}
                aria-label="PreSou Dream Events Home"
              >
                <Image
                  src="/logo.png"
                  alt="PreSou Dream Events"
                  width={120}
                  height={42}
                  className="h-10 w-auto object-contain"
                />
              </Link>
              <button
                onClick={onClose}
                className="rounded-full p-1.5 hover:bg-paper"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>
            <div className="border-b border-ink/10 px-4 py-3">
              <LocationSelector />
            </div>
            <nav className="flex-1 px-2 py-2">
              <p className="px-3 pb-1 pt-3 text-xs font-semibold uppercase tracking-wide text-ink/40">
                Shop by category
              </p>
              {navConfig.map((c) => (
                <div key={c.id}>
                  <button
                    onClick={() => toggleCategory(c.slug)}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-ink/80 hover:bg-paper"
                  >
                    {c.label}
                    <ChevronDown
                      size={16}
                      className={`text-ink/40 transition-transform ${openCategory === c.slug ? "rotate-180" : ""}`}
                    />
                  </button>
                  <AnimatePresence>
                    {openCategory === c.slug && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 py-2 space-y-4 bg-paper/50 rounded-xl mt-1 mb-2 border border-ink/5">
                          {c.columns.map((colGroup, colIdx) => {
                            const hasLinks = colGroup.some(
                              (g) => g.links.length > 0,
                            );
                            if (!hasLinks) return null;
                            return (
                              <div key={colIdx} className="space-y-4">
                                {colGroup.map((group, gIdx) =>
                                  group.links.length > 0 ? (
                                    <div key={gIdx}>
                                      <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-ink/40">
                                        {group.title}
                                      </p>
                                      <ul className="space-y-1">
                                        {group.links.map((link) => (
                                          <li key={link.href}>
                                            <Link
                                              href={link.href}
                                              onClick={onClose}
                                              className="block py-1 text-[13px] text-ink/70 hover:text-grape-700"
                                            >
                                              {link.label}
                                            </Link>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  ) : null,
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              <div className="px-3 py-3">
                <Link
                  href="/plan-my-celebration"
                  onClick={onClose}
                  className="group flex w-full items-center justify-between gap-2 rounded-xl bg-grape-50 px-4 py-3 text-sm font-bold text-grape-700 transition-all hover:bg-grape-100 hover:text-grape-800"
                >
                  <span>Plan My Celebration</span>
                  <span className="transition-transform group-hover:rotate-12">
                    ✨
                  </span>
                </Link>
              </div>

              <div className="my-2 border-t border-ink/10" />
              {[
                { href: "/account", label: "Account", icon: User },
                { href: "/wishlist", label: "Wishlist", icon: Heart },
                {
                  href: "/account/bookings",
                  label: "Track Booking",
                  icon: Package,
                },
                {
                  href: "/corporate",
                  label: "Corporate Bookings",
                  icon: Building2,
                },
                { href: "/faq", label: "FAQs", icon: HelpCircle },
                { href: "/contact", label: "Contact Us", icon: Phone },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink/80 hover:bg-paper"
                >
                  <l.icon size={17} className="text-ink/40" />
                  {l.label}
                </Link>
              ))}
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
