"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, Clock, TrendingUp, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { products } from "@/lib/data/products";
import { categories } from "@/lib/data/categories";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";

const POPULAR_SEARCHES = [
  "birthday balloon decoration",
  "baby shower",
  "romantic room",
  "red balloon setup",
  "decoration under 2000",
];

const RECENT_KEY = "occasio-recent-searches";

export default function SearchBar({ variant = "desktop" }: { variant?: "desktop" | "mobile" }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setRecent(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const matchedProducts = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 4);
  }, [query]);

  const matchedCategories = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return categories.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 3);
  }, [query]);

  function commitSearch(term: string) {
    const trimmed = term.trim();
    if (!trimmed) return;
    const next = [trimmed, ...recent.filter((r) => r !== trimmed)].slice(0, 6);
    setRecent(next);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <div ref={wrapRef} className="relative w-full">
      <div
        className={
          "flex items-center gap-2 rounded-full border border-ink/12 bg-paper px-4 transition-colors focus-within:border-grape-500 focus-within:bg-white " +
          (variant === "mobile" ? "h-11" : "h-11 lg:h-12")
        }
      >
        <Search size={18} className="shrink-0 text-ink/40" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => e.key === "Enter" && commitSearch(query)}
          placeholder="Search 'birthday balloon decoration'"
          className="w-full bg-transparent text-sm outline-none placeholder:text-ink/40"
        />
        {query && (
          <button onClick={() => setQuery("")} aria-label="Clear search">
            <X size={16} className="text-ink/40 hover:text-ink" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 z-50 mt-2 max-h-[70vh] overflow-y-auto rounded-2xl border border-ink/10 bg-white p-3 shadow-card"
          >
            {!query.trim() && (
              <>
                {recent.length > 0 && (
                  <div className="mb-3">
                    <p className="mb-1.5 px-1 text-xs font-semibold uppercase tracking-wide text-ink/40">
                      Recent searches
                    </p>
                    <div className="flex flex-wrap gap-2 px-1">
                      {recent.map((r) => (
                        <button
                          key={r}
                          onClick={() => commitSearch(r)}
                          className="chip !py-1"
                        >
                          <Clock size={12} /> {r}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <p className="mb-1.5 px-1 text-xs font-semibold uppercase tracking-wide text-ink/40">
                    Popular searches
                  </p>
                  <div className="flex flex-wrap gap-2 px-1">
                    {POPULAR_SEARCHES.map((s) => (
                      <button key={s} onClick={() => commitSearch(s)} className="chip !py-1">
                        <TrendingUp size={12} /> {s}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {query.trim() && (
              <div className="space-y-3">
                {matchedCategories.length > 0 && (
                  <div>
                    <p className="mb-1.5 px-1 text-xs font-semibold uppercase tracking-wide text-ink/40">
                      Categories
                    </p>
                    {matchedCategories.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setOpen(false);
                          router.push(`/shop/${c.slug}`);
                        }}
                        className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-sm hover:bg-paper"
                      >
                        <Search size={14} className="text-ink/40" />
                        In <span className="font-semibold">{c.name}</span>
                      </button>
                    ))}
                  </div>
                )}
                {matchedProducts.length > 0 ? (
                  <div>
                    <p className="mb-1.5 px-1 text-xs font-semibold uppercase tracking-wide text-ink/40">
                      Products
                    </p>
                    {matchedProducts.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setOpen(false);
                          router.push(`/product/${p.slug}`);
                        }}
                        className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-paper"
                      >
                        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg">
                          <Image src={p.images[0]} alt={p.name} fill className="object-cover" sizes="44px" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{p.name}</p>
                          <p className="text-xs text-ink/50">{formatPrice(p.price)}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="px-2 py-1 text-sm text-ink/50">No quick matches — press Enter to see full results.</p>
                )}
                <button
                  onClick={() => commitSearch(query)}
                  className="w-full rounded-xl bg-paper px-3 py-2 text-left text-sm font-semibold text-grape-700 hover:bg-grape-50"
                >
                  See all results for &ldquo;{query}&rdquo;
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
