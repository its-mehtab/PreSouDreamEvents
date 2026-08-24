"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Product } from "@/lib/types";
import ProductCard from "@/components/product/ProductCard";

export default function ProductRail({
  title,
  subtitle,
  products,
  viewAllHref,
}: {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref?: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    scrollerRef.current?.scrollBy({ left: dir * 600, behavior: "smooth" });
  };

  if (products.length === 0) return null;

  return (
    <section className="container-app py-8">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-ink sm:text-2xl">{title}</h2>
          {subtitle && <p className="mt-0.5 text-sm text-ink/50">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="hidden items-center gap-1 text-sm font-semibold text-grape-700 hover:underline sm:flex"
            >
              View all <ArrowRight size={14} />
            </Link>
          )}
          <div className="hidden gap-1.5 sm:flex">
            <button
              onClick={() => scroll(-1)}
              aria-label="Scroll left"
              className="rounded-full border border-ink/12 p-1.5 hover:bg-paper"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scroll(1)}
              aria-label="Scroll right"
              className="rounded-full border border-ink/12 p-1.5 hover:bg-paper"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <div ref={scrollerRef} className="flex gap-4 overflow-x-auto scroll-px-4 pb-2 scrollbar-none">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} className="w-[190px] shrink-0 snap-start sm:w-[230px]" />
        ))}
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="flex w-[190px] shrink-0 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-ink/15 text-sm font-semibold text-grape-700 hover:bg-paper sm:w-[230px]"
          >
            View all
            <ArrowRight size={18} />
          </Link>
        )}
      </div>
    </section>
  );
}
