import ShopExperience from "@/components/shop/ShopExperience";
import { products } from "@/lib/data/products";

export const metadata = { title: "Offers & Deals — Occasio" };

export default function OffersPage({ searchParams }: { searchParams: { maxPrice?: string } }) {
  const deals = products.filter((p) => p.mrp > p.price);

  return (
    <ShopExperience
      title="Today's Deals"
      description="Limited-time offers and combo packages across every occasion."
      baseProducts={deals}
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Offers" }]}
      initialFilters={{ maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined }}
      initialSort="price-asc"
    />
  );
}
