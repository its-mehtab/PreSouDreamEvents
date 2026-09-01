"use client";

import { useState } from "react";
import { Search, Users, CalendarDays, Star } from "lucide-react";
import { format } from "date-fns";
import { AnimatePresence, motion } from "motion/react";

interface Customer {
  id: string;
  name?: string;
  phone: string;
  email?: string;
  createdAt: string;
  gender?: string;
  address?: string;
  _count: { bookings: number; reviews: number };
}

export default function CustomersClient({ customers }: { customers: Customer[] }) {
  const [search, setSearch] = useState("");

  const filtered = customers.filter((c) =>
    !search ||
    c.phone.includes(search) ||
    (c.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (c.email ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Customers</h1>
          <p className="text-sm text-gray-500">{customers.length} total customers</p>
        </div>
      </div>

      <div className="relative">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, phone, email…"
          className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-grape-500/40 transition"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Customer</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Phone</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400 text-right">Bookings</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400 text-right">Reviews</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Joined</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.length === 0 && (
                  <tr><td colSpan={5} className="py-16 text-center text-sm text-gray-400">No customers found</td></tr>
                )}
                {filtered.map((c) => (
                  <motion.tr
                    key={c.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-b border-gray-200 last:border-0 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-grape-600/20 text-[11px] font-bold text-grape-700">
                          {(c.name || c.phone).charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">{c.name || "—"}</p>
                          {c.email && <p className="text-xs text-gray-400">{c.email}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 font-mono text-xs">{c.phone}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="flex items-center justify-end gap-1 text-xs text-gray-500">
                        <CalendarDays size={11} /> {c._count.bookings}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="flex items-center justify-end gap-1 text-xs text-gray-500">
                        <Star size={11} /> {c._count.reviews}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">{format(new Date(c.createdAt), "dd MMM yyyy")}</td>
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
