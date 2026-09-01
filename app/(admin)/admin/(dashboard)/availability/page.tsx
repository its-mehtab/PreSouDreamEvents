import { adminGetAvailabilityMatrix } from "@/lib/actions/admin";
import AvailabilityClient from "./AvailabilityClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Availability Matrix" };

export default async function AvailabilityPage() {
  const { products, cities, availabilities } = await adminGetAvailabilityMatrix();
  return <AvailabilityClient products={products} cities={cities} availabilities={availabilities} />;
}
