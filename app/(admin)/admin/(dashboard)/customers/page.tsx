import { adminGetAllCustomers } from "@/lib/actions/admin";
import CustomersClient from "./CustomersClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Customers" };

export default async function CustomersPage() {
  const customers = await adminGetAllCustomers();
  return <CustomersClient customers={customers as any} />;
}
