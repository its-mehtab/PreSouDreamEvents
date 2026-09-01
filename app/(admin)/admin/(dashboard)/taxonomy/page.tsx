import { adminGetAllOccasions, adminGetAllCities, adminGetAllAddOns } from "@/lib/actions/admin";
import TaxonomyClient from "./TaxonomyClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Taxonomy" };

export default async function TaxonomyPage() {
  const [occasions, cities, addOns] = await Promise.all([
    adminGetAllOccasions(),
    adminGetAllCities(),
    adminGetAllAddOns(),
  ]);

  return <TaxonomyClient occasions={occasions} cities={cities} addOns={addOns as any} />;
}
