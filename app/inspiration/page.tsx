"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { products } from "@/lib/data/products";
import { allThemes } from "@/lib/data/categories";
import { cn } from "@/lib/utils";

export default function InspirationPage() {
  const [themeFilter, setThemeFilter] = useState<string | null>(null);
  const filtered = themeFilter ? products.filter((p) => p.theme.includes(themeFilter)) : products;

  return (
    <div className="container-app py-8">
      <h1 className="font-display text-2xl font-bold sm:text-3xl">Inspiration</h1>
      <p className="mt-1 max-w-xl text-sm text-ink/55">
        Explore decoration ideas by theme and style — tap any idea to shop the exact package.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={() => setThemeFilter(null)} className={cn("chip", !themeFilter && "chip-active")}>
          All
        </button>
        {allThemes.map((t) => (
          <button key={t} onClick={() => setThemeFilter(t)} className={cn("chip", themeFilter === t && "chip-active")}>
            {t}
          </button>
        ))}
      </div>

      <div className="mt-6 columns-2 gap-3 sm:columns-3 lg:columns-4 [&>*]:mb-3">
        {filtered.map((p) => (
          <Link
            key={p.id}
            href={`/product/${p.slug}`}
            className="group relative block overflow-hidden rounded-2xl border border-ink/8 break-inside-avoid"
          >
            <div className="relative aspect-[3/4] w-full">
              <Image src={p.images[0]} alt={p.name} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="(max-width:768px) 50vw, 25vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="line-clamp-1 text-sm font-semibold text-white">{p.name}</p>
                <p className="text-xs text-white/70">{p.theme[0]}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
