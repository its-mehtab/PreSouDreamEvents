"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { categories, allThemes } from "@/lib/data/categories";
import { ChevronDown } from "lucide-react";

export default function CategoryNav() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  return (
    <nav
      className="relative hidden border-t border-ink/8 bg-white lg:block"
      onMouseLeave={() => setOpenSlug(null)}
    >
      <div className="container-app flex items-center gap-1 overflow-x-auto scrollbar-none">
        {categories.map((c) => (
          <div key={c.id} onMouseEnter={() => setOpenSlug(c.slug)} className="shrink-0">
            <Link
              href={`/shop/${c.slug}`}
              className="flex items-center gap-1 px-3.5 py-3 text-sm font-medium text-ink/75 transition-colors hover:text-grape-700"
            >
              {c.name}
              <ChevronDown size={13} className="text-ink/30" />
            </Link>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {openSlug && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full z-40 border-t border-ink/10 bg-white shadow-card"
          >
            <div className="container-app grid grid-cols-4 gap-8 py-6">
              {(() => {
                const cat = categories.find((c) => c.slug === openSlug)!;
                return (
                  <>
                    <div className="col-span-1">
                      <div className="relative mb-3 aspect-[4/3] w-full overflow-hidden rounded-2xl">
                        <Image src={cat.image} alt={cat.name} fill className="object-cover" sizes="240px" />
                      </div>
                      <p className="font-display text-lg font-semibold">{cat.name}</p>
                      <p className="text-sm text-ink/55">{cat.description}</p>
                    </div>
                    <div className="col-span-1">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink/40">
                        Shop by theme
                      </p>
                      <ul className="space-y-1.5">
                        {allThemes.slice(0, 6).map((t) => (
                          <li key={t}>
                            <Link
                              href={`/shop/${cat.slug}?theme=${encodeURIComponent(t)}`}
                              className="text-sm text-ink/70 hover:text-grape-700"
                            >
                              {t}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="col-span-1">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink/40">
                        Popular picks
                      </p>
                      <ul className="space-y-1.5">
                        <li>
                          <Link href={`/shop/${cat.slug}?sort=popular`} className="text-sm text-ink/70 hover:text-grape-700">
                            Bestsellers
                          </Link>
                        </li>
                        <li>
                          <Link href={`/shop/${cat.slug}?maxPrice=999`} className="text-sm text-ink/70 hover:text-grape-700">
                            Under ₹999
                          </Link>
                        </li>
                        <li>
                          <Link href={`/shop/${cat.slug}?premium=true`} className="text-sm text-ink/70 hover:text-grape-700">
                            Premium setups
                          </Link>
                        </li>
                        <li>
                          <Link href={`/shop/${cat.slug}?customizable=true`} className="text-sm text-ink/70 hover:text-grape-700">
                            Customizable
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div className="col-span-1 rounded-2xl bg-grape-900 p-5 text-white">
                      <p className="font-display text-lg font-semibold">Not sure what to pick?</p>
                      <p className="mt-1 text-sm text-white/70">
                        Answer a few quick questions and we&apos;ll recommend the perfect setup.
                      </p>
                      <Link
                        href="/plan-my-celebration"
                        className="mt-3 inline-flex rounded-full bg-marigold-400 px-4 py-2 text-sm font-semibold text-ink hover:bg-marigold-300"
                      >
                        Plan my celebration
                      </Link>
                    </div>
                  </>
                );
              })()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
