"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

interface ThemeCardProps {
  title: string;
  count: string;
  imageSrc: string;
}

export function ThemeCard({ title, count, imageSrc }: ThemeCardProps) {
  return (
    <div className="group min-w-[240px] max-w-[280px] shrink-0 snap-start rounded-3xl border border-ink/8 bg-white p-2.5 transition-all hover:shadow-lg">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-paper">
        <Image src={imageSrc} alt={title} fill className="object-cover" />
      </div>
      <div className="mt-4 flex items-end justify-between px-2 pb-2">
        <div>
          <h3 className="font-display text-base font-bold leading-tight text-grape-900 line-clamp-2 pr-2">
            {title}
          </h3>
          <p className="mt-1 text-xs font-medium text-ink/40">{count}</p>
        </div>
        <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-grape-50 text-grape-600 transition-colors group-hover:bg-grape-600 group-hover:text-white">
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

interface ThemeSliderProps {
  label: string;
  title: string;
  subtitle: string;
  themes: ThemeCardProps[];
}

export default function ThemeSlider({ label, title, subtitle, themes }: ThemeSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full bg-white py-12">
      <div className="container-app">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-grape-400">
              {label}
            </p>
            <h2 className="mt-1 font-display text-3xl sm:text-4xl font-bold text-grape-900">
              {title}
            </h2>
            <p className="mt-2 text-sm text-ink/50">
              {subtitle}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="text-sm font-bold text-grape-600 hover:text-grape-800 transition-colors">
              View All Themes &rarr;
            </button>
            <div className="hidden lg:flex items-center gap-2">
              <button
                onClick={() => scroll("left")}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/8 text-ink/60 hover:bg-paper hover:text-ink transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => scroll("right")}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/8 text-ink/60 hover:bg-paper hover:text-ink transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-6 scrollbar-none"
        >
          {themes.map((theme, i) => (
            <ThemeCard key={i} {...theme} />
          ))}
        </div>
      </div>
    </div>
  );
}
