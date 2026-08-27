import PromoBanner from "@/components/home/PromoBanner";
import OccasionNav from "@/components/home/OccasionNav";
import ProductRail from "@/components/product/ProductRail";
import WhatsAppCTA from "@/components/WhatsAppCTA";
import { products } from "@/lib/data/products";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Clock, Sparkles, Truck } from "lucide-react";

export default function HomePage() {
  const birthdayBalloon = products.filter(
    (p) => p.category === "Birthday" && p.decorationType === "Balloon",
  );
  const kidsSpecial = products.filter((p) => p.category === "Kids Themes");
  const romanticAnniversary = products.filter(
    (p) =>
      p.category === "Anniversary" ||
      (p.secondaryCategories &&
        p.secondaryCategories.includes("Anniversary" as any)),
  );
  const romanticDecor = products.filter((p) => p.category === "Romantic");
  const newbornWelcome = products.filter(
    (p) =>
      p.category === "Baby Shower" ||
      (p.secondaryCategories &&
        p.secondaryCategories.includes("Welcome Baby" as any)),
  );
  const recommended = [...products]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 10);

  return (
    <div>
      <PromoBanner />
      <OccasionNav />

      <section className="container-app py-2">
        <WhatsAppCTA variant="banner" />
      </section>

      <ProductRail
        title="Birthday Balloon Decoration"
        subtitle="Make their day special with stunning balloon setups"
        products={birthdayBalloon}
        viewAllHref="/decorations/birthday/balloon"
      />
      <ProductRail
        title="Kids Special"
        subtitle="Cartoon, superhero & theme-park kids setups"
        products={kidsSpecial}
        viewAllHref="/decorations/kids"
      />
      <ProductRail
        title="Romantic Anniversary Decoration"
        subtitle="Celebrate your years together"
        products={romanticAnniversary}
        viewAllHref="/decorations/anniversary"
      />

      <section className="bg-grape-950 py-10">
        <div className="container-app grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            {
              icon: ShieldCheck,
              title: "Verified Decorators",
              subtitle: "Background-checked local teams",
            },
            {
              icon: Clock,
              title: "On-Time Setup",
              subtitle: "Ready before your slot begins",
            },
            {
              icon: Sparkles,
              title: "Fully Customizable",
              subtitle: "Colours, names & add-ons",
            },
            {
              icon: Truck,
              title: "Free Rescheduling",
              subtitle: "Up to 24 hours before event",
            },
          ].map((f) => (
            <div key={f.title} className="text-white">
              <f.icon size={22} className="mb-2 text-marigold-400" />
              <p className="text-sm font-semibold">{f.title}</p>
              <p className="text-xs text-white/50">{f.subtitle}</p>
            </div>
          ))}
        </div>
      </section>

      <ProductRail
        title="Newborn Welcome Decor"
        subtitle="Welcome your little one in style"
        products={newbornWelcome}
        viewAllHref="/decorations/baby-shower"
      />

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
              Candlelight dinners, rose petal rooms and proposal backdrops — set
              up at your home, hotel room or terrace.
            </p>
            <Link
              href="/decorations/romantic"
              className="btn-primary mt-4 w-fit"
            >
              Explore Romantic Decor <ArrowRight size={15} />
            </Link>
          </div>
          <div className="hidden sm:block" />
        </div>
      </section>

      <ProductRail
        title="Romantic Decor"
        subtitle="Candlelight dinners & surprise setups"
        products={romanticDecor}
        viewAllHref="/decorations/romantic"
      />

      <section className="container-app py-8">
        <div className="rounded-2xl bg-grape-900 px-6 py-8 text-center text-white sm:px-12 sm:py-10">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            Not sure what to book?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-white/65">
            Tell us your occasion, budget and style — we&apos;ll match you with
            the right decoration package in under a minute.
          </p>
          <Link
            href="/plan-my-celebration"
            className="btn-accent mt-5 inline-flex"
          >
            Plan My Celebration <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      <ProductRail
        title="Recommended For You"
        subtitle="Based on top-rated decorations"
        products={recommended}
        viewAllHref="/decorations"
      />

      <WhatsAppCTA variant="floating" />
    </div>
  );
}
