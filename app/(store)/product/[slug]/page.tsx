import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getProductBySlug, getAllProducts } from "@/lib/actions/product";
import ProductDetailClient from "@/components/product/ProductDetailClient";

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found — PreSou" };
  return {
    title: `${product.name} — PreSou Dream Events`,
    description: product.tagline,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  // Transform data slightly to match what frontend expects
  const transformedProduct = {
    ...product,
    category: product.occasions?.[0]?.name || "Uncategorized",
    cities:
      product.cityAvailabilities?.map((ca: any) => ({
        city: ca.city.name,
        status: ca.status.toLowerCase(),
        earliestSlot: ca.earliestSlot,
      })) || [],
    addOns: product.addOns?.map((pa: any) => pa.addOn) || [],
    customizations: product.customizations || [],
  };

  return <ProductDetailClient product={transformedProduct as any} />;
}
