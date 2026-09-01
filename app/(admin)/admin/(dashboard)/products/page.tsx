import { adminGetAllProducts } from "@/lib/actions/admin";
import ProductsClient from "./ProductsClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Products" };

export default async function ProductsPage() {
  const products = await adminGetAllProducts();
  return <ProductsClient products={products as any} />;
}
