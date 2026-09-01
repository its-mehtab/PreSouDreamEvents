import { adminGetAllReviews } from "@/lib/actions/admin";
import ReviewsClient from "./ReviewsClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Reviews" };

export default async function ReviewsPage() {
  const reviews = await adminGetAllReviews();
  return <ReviewsClient reviews={reviews as any} />;
}
