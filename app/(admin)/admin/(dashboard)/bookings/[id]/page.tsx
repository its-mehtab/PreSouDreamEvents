import { adminGetBookingById } from "@/lib/actions/admin";
import { notFound } from "next/navigation";
import BookingDetailClient from "./BookingDetailClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Booking Detail" };

export default async function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const booking = await adminGetBookingById(id);
  if (!booking) notFound();
  return <BookingDetailClient booking={booking as any} />;
}
