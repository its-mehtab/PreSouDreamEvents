"use client";

import Link from "next/link";
import { useRef } from "react";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

export interface ThemeCardProps {
  title: string;
  count: string;
  imageSrc: string;
  href?: string;
}

export function ThemeCard({ title, count, imageSrc, href }: ThemeCardProps) {
  const content = (
    <div className="group min-w-[200px] max-w-[200px] shrink-0 snap-start rounded-[22px] border border-ink/8 bg-white p-2.5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md cursor-pointer">
      <div className="relative w-full aspect-[4/3] overflow-hidden rounded-[17px]">
        <Image src={imageSrc} alt={title} fill className="object-cover" />
      </div>
      <div className="mt-3 flex min-h-[74px] items-end justify-between px-1.5 pb-1">
        <div>
          <h3 className="font-sans text-[14px] font-bold leading-[1.25] text-ink line-clamp-2 pr-1">
            {title}
          </h3>
          <p className="mt-2 text-xs font-medium text-ink/50">{count}</p>
        </div>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-grape-50 text-grape-600 transition-colors group-hover:bg-grape-600 group-hover:text-white">
          <ArrowRight size={16} />
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }
  return content;
}

interface ThemeSliderProps {
  label?: string;
  title?: string;
  subtitle?: string;
  themes: ThemeCardProps[];
}

export default function ThemeSlider({
  label,
  title,
  subtitle,
  themes,
}: ThemeSliderProps) {
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
    <div className="w-full">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4 px-4 sm:px-0">
        <div>
          {title && (
            <>
              {label && (
                <p className="text-xs font-bold uppercase tracking-[0.13em] text-grape-500">
                  {label}
                </p>
              )}
              <h2 className="mt-1 font-display text-2xl font-bold text-ink sm:text-3xl">
                {title}
              </h2>
              {subtitle && (
                <p className="mt-1 text-sm text-ink/60">{subtitle}</p>
              )}
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden gap-1.5 sm:flex">
            <button
              onClick={() => scroll("left")}
              aria-label="Scroll left"
              className="rounded-full border border-ink/12 p-1.5 hover:bg-paper"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label="Scroll right"
              className="rounded-full border border-ink/12 p-1.5 hover:bg-paper"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 scrollbar-none lg:gap-5 pt-2"
      >
        {themes.map((theme, i) => (
          <ThemeCard key={i} {...theme} />
        ))}
      </div>
    </div>
  );
}
