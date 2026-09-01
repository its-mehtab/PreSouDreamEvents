import { adminGetAllBookings, adminGetAllCities } from "@/lib/actions/admin";
import BookingsClient from "./BookingsClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Bookings" };

export default async function BookingsPage() {
  const [bookings, cities] = await Promise.all([
    adminGetAllBookings(),
    adminGetAllCities(),
  ]);
  return <BookingsClient bookings={bookings as any} cities={cities as any} />;
}
