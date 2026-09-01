import { adminGetProductById, adminGetAllOccasions, adminGetAllAddOns } from "@/lib/actions/admin";
import ProductForm from "../ProductForm";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Edit Product" };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, occasions, addOns] = await Promise.all([
    adminGetProductById(id),
    adminGetAllOccasions(),
    adminGetAllAddOns(),
  ]);

  if (!product) notFound();

  return (
    <ProductForm
      product={product}
      occasions={occasions.map((o: any) => ({ id: o.id, name: o.name }))}
      existingAddOns={addOns.map((a: any) => ({ id: a.id, name: a.name, price: a.price }))}
    />
  );
}
