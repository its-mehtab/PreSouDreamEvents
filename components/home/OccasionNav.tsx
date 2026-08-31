import Link from "next/link";
import prisma from "@/lib/prisma";
import {
  Cake,
  Heart,
  Baby,
  PartyPopper,
  HeartHandshake,
  Gem,
  CircleDot,
  Flower2,
  Building2,
} from "lucide-react";

const ICONS: Record<string, any> = {
  Cake,
  Heart,
  Baby,
  PartyPopper,
  HeartHandshake,
  Gem,
  CircleDot,
  Flower2,
  Building2,
};

export default async function OccasionNav() {
  const occasions = await prisma.occasion.findMany({
    take: 9,
  });

  return (
    <section className="container-app py-5">
      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none sm:grid sm:grid-cols-9 sm:gap-2">
        {occasions.map((c: any) => {
          const Icon = ICONS[c.icon || "Cake"] ?? Cake;
          return (
            <Link
              key={c.id}
              href={`/decorations/${c.slug}`}
              className="group flex shrink-0 flex-col items-center gap-2 rounded-2xl border border-ink/8 bg-white px-4 py-3 text-center transition-colors hover:border-grape-400 sm:shrink"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-grape-50 text-grape-700 transition-colors group-hover:bg-grape-600 group-hover:text-white">
                <Icon size={18} />
              </span>
              <span className="text-xs font-semibold text-ink/75">
                {c.name}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
