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
    <div className="relative w-full overflow-hidden bg-white pb-12 sm:pb-16 lg:pb-24 pt-8">
      {/* Background SVG Wave */}
      <div className="absolute inset-0 z-0">
        <svg
          viewBox="0 0 1440 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full object-cover object-left lg:object-center"
          preserveAspectRatio="none"
        >
          <path
            d="M0,150 C300,300 600,0 900,100 C1200,200 1350,150 1440,100 L1440,0 L0,0 Z"
            fill="#F4EDFB"
          />
          <path
            d="M0,120 C400,250 700,-50 1000,80 C1300,210 1440,50 1440,50 L1440,0 L0,0 Z"
            fill="#E4D2F5"
            opacity="0.5"
          />
        </svg>
      </div>

      <div className="container-app relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-xl pt-4 lg:pt-12"
        >
          <span className="inline-block rounded-full bg-grape-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-grape-600">
            {subtitle}
          </span>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-grape-900">
            {title}
          </h1>
          <p className="mt-4 text-lg text-grape-700/80 font-medium max-w-md leading-relaxed">
            {description}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          className="relative h-[300px] sm:h-[400px] lg:h-[500px] w-full"
        >
          {/* Main decorative image */}
          <div className="absolute right-0 top-0 h-full w-full max-w-[600px] rounded-[3rem] overflow-hidden shadow-2xl">
            <Image
              src={imageSrc}
              alt={title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
          
          {/* Decorative floating blobs */}
          <motion.div 
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-6 bottom-12 h-24 w-24 rounded-full bg-marigold-200 blur-2xl opacity-60 mix-blend-multiply"
          />
          <motion.div 
            animate={{ y: [10, -10, 10] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-grape-300 blur-2xl opacity-40 mix-blend-multiply"
          />
        </motion.div>
      </div>
    </div>
  );
}
