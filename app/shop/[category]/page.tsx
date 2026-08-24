import { notFound } from "next/navigation";
import ShopExperience from "@/components/shop/ShopExperience";
import { products } from "@/lib/data/products";
import { categories } from "@/lib/data/categories";
import { Product } from "@/lib/types";

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

function resolveProducts(slug: string): { list: Product[]; hideOccasion: boolean } {
  switch (slug) {
    case "birthday":
      return { list: products.filter((p) => p.category === "Birthday"), hideOccasion: true };
    case "anniversary":
      return { list: products.filter((p) => p.category === "Anniversary"), hideOccasion: true };
    case "baby-shower":
      return {
        list: products.filter((p) => p.category === "Baby Shower" || p.category === "Welcome Baby"),
        hideOccasion: true,
      };
    case "kids":
      return { list: products.filter((p) => p.category === "Kids Themes"), hideOccasion: true };
    case "romantic":
      return { list: products.filter((p) => p.category === "Romantic"), hideOccasion: true };
    case "wedding":
      return {
        list: products.filter(
          (p) => p.category === "Wedding" || p.category === "Haldi & Mehndi" || p.category === "Bachelorette"
        ),
        hideOccasion: true,
      };
    case "balloon":
      return { list: products.filter((p) => p.decorationType === "Balloon" || p.decorationType === "Balloon Bouquet"), hideOccasion: false };
    case "flowers":
      return { list: products.filter((p) => p.decorationType === "Flowers" || p.theme.includes("Floral")), hideOccasion: false };
    case "corporate":
      return { list: products.filter((p) => p.category === "Corporate"), hideOccasion: true };
    case "premium":
      return { list: products.filter((p) => p.isPremium), hideOccasion: false };
    case "offers":
      return { list: products.filter((p) => p.mrp > p.price), hideOccasion: false };
    default:
      return { list: [], hideOccasion: false };
  }
}

export default function CategoryPage({
  params,
  searchParams,
}: {
  params: { category: string };
  searchParams: { theme?: string; sort?: string; maxPrice?: string; premium?: string; customizable?: string };
}) {
  const category = categories.find((c) => c.slug === params.category);
  if (!category) notFound();

  const { list, hideOccasion } = resolveProducts(params.category);

  return (
    <ShopExperience
      title={category.name}
      description={category.description}
      baseProducts={list}
      hideOccasion={hideOccasion}
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }, { label: category.name }]}
      initialFilters={{
        themes: searchParams.theme ? [searchParams.theme] : [],
        maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
        premiumOnly: searchParams.premium === "true",
        customizableOnly: searchParams.customizable === "true",
      }}
      initialSort={searchParams.sort === "popular" ? "popular" : "recommended"}
    />
  );
}
