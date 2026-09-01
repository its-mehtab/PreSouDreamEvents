import { adminGetAllOccasions, adminGetAllAddOns } from "@/lib/actions/admin";
import ProductForm from "../ProductForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "New Product" };

export default async function NewProductPage() {
  const [occasions, addOns] = await Promise.all([
    adminGetAllOccasions(),
    adminGetAllAddOns(),
  ]);

  return (
    <ProductForm
      occasions={occasions.map((o: any) => ({ id: o.id, name: o.name }))}
      existingAddOns={addOns.map((a: any) => ({ id: a.id, name: a.name, price: a.price }))}
    />
  );
}
