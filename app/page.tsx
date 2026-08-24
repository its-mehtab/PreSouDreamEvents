import PromoBanner from "@/components/home/PromoBanner";
import OccasionNav from "@/components/home/OccasionNav";
import ProductRail from "@/components/product/ProductRail";
import WhatsAppCTA from "@/components/WhatsAppCTA";
import { products } from "@/lib/data/products";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Clock, Sparkles, Truck } from "lucide-react";

export default function HomePage() {
  const trending = products.filter((p) => p.isTrending);
  const bestSellers = products.filter((p) => p.isBestSeller);
  const under999 = products.filter((p) => p.price <= 999);
  const under1999 = products.filter((p) => p.price > 999 && p.price <= 1999);
  const birthday = products.filter((p) => p.category === "Birthday");
  const romantic = products.filter((p) => p.category === "Romantic");
  const premium = products.filter((p) => p.isPremium);
  const newArrivals = products.filter((p) => p.isNewArrival);
  const recommended = [...products].sort((a, b) => b.rating - a.rating).slice(0, 10);

  return (
    <div>
      <PromoBanner />
      <OccasionNav />

      <section className="container-app py-2">
        <WhatsAppCTA variant="banner" />
      </section>

      <ProductRail title="Trending Decorations" subtitle="What's popular across cities right now" products={trending} viewAllHref="/shop?sort=trending" />
      <ProductRail title="Best Sellers" subtitle="Our most-booked decoration packages" products={bestSellers} viewAllHref="/shop?sort=popular" />
      <ProductRail title="Popular Under ₹999" products={under999} viewAllHref="/offers?maxPrice=999" />

      <section className="bg-grape-950 py-10">
        <div className="container-app grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { icon: ShieldCheck, title: "Verified Decorators", subtitle: "Background-checked local teams" },
            { icon: Clock, title: "On-Time Setup", subtitle: "Ready before your slot begins" },
            { icon: Sparkles, title: "Fully Customizable", subtitle: "Colours, names & add-ons" },
            { icon: Truck, title: "Free Rescheduling", subtitle: "Up to 24 hours before event" },
          ].map((f) => (
            <div key={f.title} className="text-white">
              <f.icon size={22} className="mb-2 text-marigold-400" />
              <p className="text-sm font-semibold">{f.title}</p>
              <p className="text-xs text-white/50">{f.subtitle}</p>
            </div>
          ))}
        </div>
      </section>

      <ProductRail title="Popular Under ₹1,999" products={under1999} viewAllHref="/offers?maxPrice=1999" />
      <ProductRail title="Birthday Decorations" products={birthday} viewAllHref="/shop/birthday" />

      <section className="container-app py-8">
        <div className="grid grid-cols-1 gap-4 overflow-hidden rounded-2xl bg-punch-50 p-6 sm:grid-cols-[1.2fr_1fr] sm:p-10">
          <div className="flex flex-col justify-center">
            <span className="mb-2 inline-flex w-fit items-center gap-1 rounded-full bg-punch-500 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
              Romantic Setups
            </span>
            <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
              Set the mood for date night
            </h2>
            <p className="mt-2 max-w-md text-sm text-ink/60">
              Candlelight dinners, rose petal rooms and proposal backdrops — set up at your home,
              hotel room or terrace.
            </p>
            <Link href="/shop/romantic" className="btn-primary mt-4 w-fit">
              Explore Romantic Decor <ArrowRight size={15} />
            </Link>
          </div>
          <div className="hidden sm:block" />
        </div>
      </section>

      <ProductRail title="Romantic Setups" products={romantic} viewAllHref="/shop/romantic" />
      <ProductRail title="Premium Decorations" subtitle="Designer-grade, elaborate setups" products={premium} viewAllHref="/shop/premium" />
      <ProductRail title="New Arrivals" products={newArrivals} viewAllHref="/shop?sort=newest" />

      <section className="container-app py-8">
        <div className="rounded-2xl bg-grape-900 px-6 py-8 text-center text-white sm:px-12 sm:py-10">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Not sure what to book?</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-white/65">
            Tell us your occasion, budget and style — we&apos;ll match you with the right decoration
            package in under a minute.
          </p>
          <Link href="/plan-my-celebration" className="btn-accent mt-5 inline-flex">
            Plan My Celebration <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      <ProductRail title="Recommended For You" subtitle="Based on top-rated decorations" products={recommended} viewAllHref="/shop" />

      <WhatsAppCTA variant="floating" />
    </div>
  );
}
