import ShopExperience from "@/components/shop/ShopExperience";
import CategoryHero from "@/components/shop/CategoryHero";
import ThemeSlider from "@/components/shop/ThemeSlider";
import { products } from "@/lib/data/products";

export const metadata = { title: "Shop All Decorations — PreSou Dream Events" };

const babyShowerThemes = [
  { title: "Classic Baby Shower", count: "120+ products", imageSrc: "/product1.webp" },
  { title: "Naming Ceremony", count: "90+ products", imageSrc: "/product2.webp" },
  { title: "Cradle Ceremony", count: "70+ products", imageSrc: "/product3.webp" },
  { title: "Gender Reveal", count: "85+ products", imageSrc: "/product4.webp" },
  { title: "Safari Theme", count: "60+ products", imageSrc: "/product1.webp" },
  { title: "Twinkle Twinkle Theme", count: "75+ products", imageSrc: "/product2.webp" },
  { title: "Pastel Theme", count: "80+ products", imageSrc: "/product3.webp" },
];

export default function ShopPage() {
  return (
    <>
      <CategoryHero
        subtitle="BABY SHOWER"
        title="A Beautiful New Beginning"
        description="Thoughtful decorations for life's most special moments"
        imageSrc="/product1.webp"
      />
      <ThemeSlider
        label="EXPLORE THEMES"
        title="Explore Baby Shower Themes"
        subtitle="Find the perfect theme for your celebration"
        themes={babyShowerThemes}
      />
      <ShopExperience
        title="Shop All Decorations"
        description="Browse our full catalog of balloon arches, room decor, romantic setups and event packages."
        baseProducts={products}
        hideHeader={true}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Shop" }]}
      />
    </>
  );
}
