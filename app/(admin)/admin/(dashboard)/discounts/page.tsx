import { adminGetAllDiscounts } from "@/lib/actions/admin";
import DiscountsClient from "./DiscountsClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Discounts" };

export default async function DiscountsPage() {
  const discounts = await adminGetAllDiscounts();
  return <DiscountsClient discounts={discounts as any} />;
}
