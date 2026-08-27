import { RelatedDiscoveryLink } from "@/lib/context-resolver";
import ThemeSlider from "@/components/shop/ThemeSlider";

export default function RelatedDiscovery({
  links,
}: {
  links: RelatedDiscoveryLink[];
}) {
  if (!links || links.length === 0) return null;

  const themes = links.map((link) => ({
    title: link.label,
    count: `${link.count || 0} setups`,
    imageSrc:
      link.image ||
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=800&auto=format&fit=crop",
    href: link.url,
  }));

  return (
    <div className="mb-6 lg:mb-8">
      <ThemeSlider themes={themes} />
    </div>
  );
}
