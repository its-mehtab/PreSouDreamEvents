import { notFound } from "next/navigation";
import { adminGetCustomerById } from "@/lib/actions/admin";
import CustomerDetailClient from "./CustomerDetailClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Customer Details" };

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = await adminGetCustomerById(id);
  
  if (!customer) {
    notFound();
  }

  return <CustomerDetailClient customer={customer as any} />;
}
