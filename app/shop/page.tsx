import ShopExperience from "@/components/shop/ShopExperience";
import { products } from "@/lib/data/products";

export const metadata = { title: "Shop All Decorations — PreSou Dream Events" };

export default function ShopPage() {
  return (
    <ShopExperience
      title="Shop All Decorations"
      description="Browse our full catalog of balloon arches, room decor, romantic setups and event packages."
      baseProducts={products}
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Shop" }]}
    />
  );
}
