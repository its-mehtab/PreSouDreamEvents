"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { X, User, Heart, Package, Building2, HelpCircle, Phone } from "lucide-react";
import { categories } from "@/lib/data/categories";
import LocationSelector from "@/components/header/LocationSelector";

export default function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
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
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed left-0 top-0 z-[80] flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-ink/10 px-4 py-4">
              <Link href="/" onClick={onClose} aria-label="PreSou Dream Events Home">
                <Image
                  src="/logo.png"
                  alt="PreSou Dream Events"
                  width={120}
                  height={42}
                  className="h-10 w-auto object-contain"
                />
              </Link>
              <button onClick={onClose} className="rounded-full p-1.5 hover:bg-paper" aria-label="Close menu">
                <X size={20} />
              </button>
            </div>
            <div className="border-b border-ink/10 px-4 py-3">
              <LocationSelector />
            </div>
            <nav className="flex-1 px-2 py-2">
              <p className="px-3 pb-1 pt-3 text-xs font-semibold uppercase tracking-wide text-ink/40">
                Shop by occasion
              </p>
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/shop/${c.slug}`}
                  onClick={onClose}
                  className="block rounded-xl px-3 py-2.5 text-sm font-medium text-ink/80 hover:bg-paper"
                >
                  {c.name}
                </Link>
              ))}
              <div className="my-2 border-t border-ink/10" />
              {[
                { href: "/account", label: "Account", icon: User },
                { href: "/wishlist", label: "Wishlist", icon: Heart },
                { href: "/account/orders", label: "Track Booking", icon: Package },
                { href: "/corporate", label: "Corporate Bookings", icon: Building2 },
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
