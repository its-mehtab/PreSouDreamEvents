import { notFound } from "next/navigation";
import { getShopProducts } from "@/lib/actions/product";
import ShopExperience from "@/components/shop/ShopExperience";
import RelatedDiscovery from "@/components/shop/RelatedDiscovery";
import {
  parseSlug,
  applyContext,
  generateRelatedDiscovery,
  generateH1,
} from "@/lib/context-resolver";

export default async function DecorationsPage(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const slug = params.slug || [];

  const ctx = parseSlug(slug);
  const products = await getShopProducts();
  const matchedProducts = applyContext(products as any[], ctx);

  if (slug.length > 0 && matchedProducts.length === 0) {
    notFound();
  }

  const h1 = generateH1(ctx);
  const relatedLinks = generateRelatedDiscovery(ctx, matchedProducts);

  // Derive breadcrumbs
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Decorations", href: "/decorations" },
  ];
  if (slug.length > 0) {
    breadcrumbs.push({ label: h1, href: "" });
  }

  return (
    <div className="bg-paper min-h-screen pb-12 pt-6">
      <ShopExperience
        baseProducts={matchedProducts}
        title={h1}
        description="Explore our handpicked decoration packages."
        breadcrumbs={breadcrumbs}
        relatedDiscovery={<RelatedDiscovery links={relatedLinks} />}
      />
    </div>
  );
}
