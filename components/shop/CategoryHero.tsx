"use client";

import Image from "next/image";
import { motion } from "motion/react";

interface CategoryHeroProps {
  title: string;
  subtitle: string;
  description: string;
  imageSrc: string;
}

export default function CategoryHero({ title, subtitle, description, imageSrc }: CategoryHeroProps) {
  return (
    <section className="relative isolate h-[430px] w-full overflow-hidden bg-white sm:h-[450px] lg:h-[355px]">
      <div className="absolute -left-16 top-12 h-44 w-44 rounded-full bg-grape-50 opacity-75" />
      <div className="absolute bottom-[-100px] left-[26%] h-64 w-64 rounded-full bg-grape-50 opacity-85" />
      <div className="absolute bottom-[-110px] right-[-20px] h-64 w-64 rounded-full bg-grape-100 opacity-80" />

      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: "easeOut" }} className="absolute right-[-7%] top-0 h-full w-[68%] overflow-hidden [clip-path:ellipse(77%_95%_at_68%_50%)] lg:right-[-5%] lg:w-[63%]">
        <Image src={imageSrc} alt={title} fill sizes="(max-width: 1024px) 100vw, 65vw" className="object-cover object-center" priority />
      </motion.div>

      <div className="container-app relative z-10 h-full">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex h-full max-w-[560px] flex-col justify-center pt-8 lg:pt-2"
        >
          <nav className="absolute top-5 flex items-center gap-2 text-sm font-medium text-ink/60 sm:top-6"><span>Home</span><span className="text-ink/40">›</span><span>Baby Shower</span></nav>
          <span className="inline-block w-fit rounded-full bg-grape-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-grape-600">
            {subtitle}
          </span>
          <h1 className="mt-3 max-w-[420px] font-display text-4xl font-bold leading-[1.05] text-ink sm:text-5xl lg:text-[48px]">
            {title}
          </h1>
          <p className="mt-3 max-w-[360px] text-base font-medium leading-snug text-ink/60 sm:text-lg">
            {description}
          </p>
        </motion.div>

      </div>
    </section>
  );
}
