import Link from "next/link";
import { ArrowRight } from "lucide-react";

const PROMOS = [
  {
    title: "Birthday Decor from ₹999",
    subtitle: "Balloon arches, backdrops & themed setups",
    href: "/shop/birthday",
    bg: "bg-grape-800",
    text: "text-white",
    accent: "text-marigold-300",
  },
  {
    title: "Premium Event Setups",
    subtitle: "Designer-grade decor for weddings & stages",
    href: "/shop/premium",
    bg: "bg-marigold-400",
    text: "text-ink",
    accent: "text-grape-700",
  },
  {
    title: "Today's Deals",
    subtitle: "Up to 40% off combo packages",
    href: "/offers",
    bg: "bg-punch-500",
    text: "text-white",
    accent: "text-marigold-200",
  },
];

export default function PromoBanner() {
  return (
    <section className="container-app pt-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {PROMOS.map((p) => (
          <Link
            key={p.title}
            href={p.href}
            className={`group relative flex min-h-[110px] flex-col justify-between overflow-hidden rounded-2xl ${p.bg} ${p.text} p-5`}
          >
            <div className="confetti-bg pointer-events-none absolute -right-6 -top-6 h-28 w-28 rotate-12 opacity-10" />
            <div>
              <p className="font-display text-lg font-bold leading-tight sm:text-xl">{p.title}</p>
              <p className={`mt-1 text-sm opacity-80`}>{p.subtitle}</p>
            </div>
            <span className={`flex items-center gap-1 text-sm font-semibold ${p.accent}`}>
              Shop now <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
