"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { adminUpdateBookingStatus } from "@/lib/actions/admin";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import StatusBadge from "@/components/admin/StatusBadge";
import { Search, Filter, Calendar, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { AnimatePresence, motion } from "motion/react";
import { Select } from "@/components/ui/Select";

const STATUSES = ["", "CONFIRMED", "DECORATOR_ASSIGNED", "ON_THE_WAY", "SETUP_STARTED", "COMPLETED", "CANCELLED"];

interface Booking {
  id: string;
  status: string;
  totalPrice: number;
  eventDate: string;
  eventTime: string;
  venue: string;
  createdAt: string;
  user: { name?: string; phone: string; email?: string };
  city: { name: string };
  items: { product: { name: string } }[];
}

export default function BookingsClient({ bookings, cities }: { bookings: Booking[]; cities: { id: string; name: string }[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [isPending, startTransition] = useTransition();

  const filtered = bookings.filter((b) => {
    const matchSearch = !search || b.user.phone.includes(search) || (b.user.name ?? "").toLowerCase().includes(search.toLowerCase()) || b.id.includes(search);
    const matchStatus = !statusFilter || b.status === statusFilter;
    const matchCity = !cityFilter || b.city.name === cityFilter;
    return matchSearch && matchStatus && matchCity;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Bookings</h1>
          <p className="text-sm text-gray-500">{filtered.length} of {bookings.length} bookings</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, phone, ID…"
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-grape-500/40 transition"
          />
        </div>
        <div className="w-48">
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { label: "All Statuses", value: "" },
              ...STATUSES.filter(Boolean).map(s => ({ label: s.replace(/_/g, " "), value: s }))
            ]}
          />
        </div>
        <div className="w-48">
          <Select
            value={cityFilter}
            onChange={setCityFilter}
            options={[
              { label: "All Cities", value: "" },
              ...cities.map(c => ({ label: c.name, value: c.name }))
            ]}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Customer</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Products</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Event</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400 text-right">Total</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Status</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Booked On</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="py-16 text-center text-sm text-gray-400">No bookings found</td></tr>
                )}
                {filtered.map((booking) => (
                  <motion.tr
                    key={booking.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-b border-gray-200 last:border-0 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-700">{booking.user.name || "—"}</p>
                      <p className="text-xs text-gray-400">{booking.user.phone}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-gray-600 truncate max-w-[180px]">
                        {booking.items?.[0]?.product?.name ?? "—"}
                        {booking.items?.length > 1 && <span className="text-gray-400"> +{booking.items.length - 1}</span>}
                      </p>
                      <p className="text-xs text-gray-400">{booking.city.name} · {booking.venue}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-gray-600 text-xs flex items-center gap-1">
                        <Calendar size={11} className="text-gray-400" />
                        {format(new Date(booking.eventDate), "dd MMM yyyy")}
                      </p>
                      <p className="text-xs text-gray-400">{booking.eventTime}</p>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-700">{formatPrice(booking.totalPrice)}</td>
                    <td className="px-4 py-3"><StatusBadge status={booking.status} /></td>
                    <td className="px-4 py-3 text-xs text-gray-400">
                      {format(new Date(booking.createdAt), "dd MMM")}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => router.push(`/admin/bookings/${booking.id}`)}
                        className="rounded-lg px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-100 hover:text-gray-900/70 transition-colors flex items-center gap-1 ml-auto"
                      >
                        Manage <ChevronRight size={12} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
