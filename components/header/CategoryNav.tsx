"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { navigationConfig } from "@/lib/navigation-config";
import { ChevronDown } from "lucide-react";

export default function CategoryNav() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  return (
    <nav
      className="relative hidden border-t border-ink/8 bg-white lg:block"
      onMouseLeave={() => setOpenSlug(null)}
    >
      <div className="container-app">
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
            {navigationConfig.map((c) => (
              <div
                key={c.id}
                onMouseEnter={() => setOpenSlug(c.slug)}
                className="shrink-0"
              >
                <Link
                  href={`/decorations/${c.slug}`}
                  className="flex items-center gap-1 px-3.5 py-3 text-sm font-medium text-ink/75 transition-colors hover:text-grape-700"
                >
                  {c.label}
                  <ChevronDown size={13} className="text-ink/30" />
                </Link>
              </div>
            ))}
          </div>

          <Link
            href="/plan-my-celebration"
            className="group flex shrink-0 items-center gap-2 rounded-full bg-grape-50 px-4 py-1.5 text-sm font-bold text-grape-700 transition-all hover:bg-grape-600 hover:text-white hover:shadow-md"
          >
            <span>Plan My Celebration</span>
            <span className="transition-transform group-hover:rotate-12">
              ✨
            </span>
          </Link>

          <AnimatePresence>
            {openSlug && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 top-full z-40 w-[960px] max-w-full pt-3"
              >
                <div className="flex gap-12 rounded-2xl border border-ink/10 bg-white p-8 shadow-xl">
                  {(() => {
                    const cat = navigationConfig.find(
                      (c) => c.slug === openSlug,
                    )!;
                    return (
                      <>
                        {cat.image && (
                          <div className="w-[240px] shrink-0">
                            <div className="relative mb-3 aspect-[4/3] w-full overflow-hidden rounded-2xl">
                              <Image
                                src={cat.image}
                                alt={cat.label}
                                fill
                                className="object-cover"
                                sizes="240px"
                              />
                            </div>
                            <p className="font-display text-lg font-semibold">
                              {cat.label}
                            </p>
                            {cat.description && (
                              <p className="text-sm text-ink/55">
                                {cat.description}
                              </p>
                            )}
                          </div>
                        )}

                        {cat.columns.map((colGroups, colIdx) => {
                          const hasLinks = colGroups.some(
                            (g) => g.links.length > 0,
                          );
                          if (!hasLinks) return null;
                          return (
                            <div
                              key={colIdx}
                              className="flex flex-col gap-6 min-w-[140px]"
                            >
                              {colGroups.map((group, groupIdx) =>
                                group.links.length > 0 ? (
                                  <div key={groupIdx}>
                                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink/40">
                                      {group.title}
                                    </p>
                                    <ul className="space-y-1.5">
                                      {group.links.map((link) => (
                                        <li key={link.href}>
                                          <Link
                                            href={link.href}
                                            className="text-sm text-ink/70 hover:text-grape-700 block py-0.5"
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
                      </>
                    );
                  })()}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}
