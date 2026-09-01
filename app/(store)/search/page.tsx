import ShopExperience from "@/components/shop/ShopExperience";
import { searchProducts } from "@/lib/data/products";

export const metadata = { title: "Search Results — PreSou" };

export default function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = searchParams.q ?? "";
  const results = searchProducts(q);

  return (
    <ShopExperience
      title={q ? `Results for "${q}"` : "Search"}
      description={q ? undefined : "Search for decorations, themes, or occasions."}
      baseProducts={results}
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Search" }]}
    />
  );
}
