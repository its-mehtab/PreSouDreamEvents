import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { cities } from "@/lib/data/categories";
import { products } from "@/lib/data/products";

export const metadata = { title: "Cities We Serve — PreSou" };

export default function LocationsPage() {
  return (
    <div className="container-app py-6">
      <h1 className="font-display text-2xl font-bold sm:text-3xl">Cities We Serve</h1>
      <p className="mt-1 max-w-xl text-sm text-ink/55">
        Occasio operates through verified local decorator teams across these cities. Pick your
        city to see products with confirmed availability near you.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cities.map((city) => {
          const availableCount = products.filter((p) =>
            p.cities.some((c) => c.city === city && c.status !== "unavailable")
          ).length;
          return (
            <div key={city} className="flex flex-col justify-between rounded-2xl border border-ink/10 bg-white p-5">
              <div>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-grape-50 text-grape-700">
                  <MapPin size={18} />
                </span>
                <p className="mt-3 font-display text-lg font-semibold">{city}</p>
                <p className="text-xs text-ink/45">{availableCount} decorations available</p>
              </div>
              <Link
                href={`/shop?city=${encodeURIComponent(city)}`}
                className="mt-4 flex items-center gap-1 text-sm font-semibold text-grape-700 hover:underline"
              >
                Shop in {city} <ArrowRight size={14} />
              </Link>
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-2xl bg-paper p-6 text-center">
        <p className="font-display text-lg font-semibold">Don&apos;t see your city?</p>
        <p className="mt-1 text-sm text-ink/55">
          We&apos;re expanding every month. WhatsApp us your city and we&apos;ll let you know when we launch there.
        </p>
        <a
          href="https://wa.me/919999999999?text=Hi%20Occasio!%20Can%20you%20tell%20me%20when%20you%27ll%20launch%20in%20my%20city%3F"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary mt-3 inline-flex"
        >
          Request my city
        </a>
      </div>
    </div>
  );
}
