import { Building2, Rocket, PartyPopper, Sparkles, Users } from "lucide-react";
import ProductRail from "@/components/product/ProductRail";
import { products } from "@/lib/data/products";
import CorporateForm from "@/components/forms/CorporateForm";

export const metadata = { title: "Corporate & Bulk Bookings — PreSou Dream Events" };

const USE_CASES = [
  { icon: Rocket, title: "Product Launches", desc: "Branded stage & backdrop decor" },
  { icon: PartyPopper, title: "Office Celebrations", desc: "Birthdays, festivals & milestones" },
  { icon: Sparkles, title: "Inaugurations", desc: "Ribbon-cutting & stage setups" },
  { icon: Users, title: "Bulk Bookings", desc: "Multi-floor or multi-day decor" },
];

export default function CorporatePage() {
  const corporateProducts = products.filter((p) => p.category === "Corporate");

  return (
    <div>
      <div className="bg-grape-950 py-10 text-white">
        <div className="container-app">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
            <Building2 size={20} />
          </span>
          <h1 className="mt-3 font-display text-2xl font-bold sm:text-3xl">Corporate & Bulk Bookings</h1>
          <p className="mt-2 max-w-xl text-sm text-white/60">
            Office parties, product launches, festivals and inaugurations — get a dedicated
            account manager and volume pricing for corporate decoration bookings.
          </p>
        </div>
      </div>

      <div className="container-app py-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {USE_CASES.map((u) => (
            <div key={u.title} className="rounded-2xl border border-ink/10 bg-white p-4">
              <u.icon size={20} className="text-grape-700" />
              <p className="mt-2 text-sm font-semibold">{u.title}</p>
              <p className="text-xs text-ink/45">{u.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {corporateProducts.length > 0 && <ProductRail title="Corporate Packages" products={corporateProducts} viewAllHref="/decorations/corporate" />}

      <div className="container-app max-w-xl pb-10">
        <CorporateForm />
      </div>
    </div>
  );
}
