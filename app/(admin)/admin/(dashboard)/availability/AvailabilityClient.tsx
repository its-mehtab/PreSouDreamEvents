"use client";

import { useState, useTransition } from "react";
import { adminUpdateAvailability } from "@/lib/actions/admin";
import { toast } from "sonner";
import { Search, Info, Loader2 } from "lucide-react";
import { Select } from "@/components/ui/Select";

export default function AvailabilityClient({
  products,
  cities,
  availabilities,
}: {
  products: any[];
  cities: any[];
  availabilities: any[];
}) {
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  const filteredProducts = products.filter((p) =>
    !search || p.name.toLowerCase().includes(search.toLowerCase())
  );

  function handleStatusChange(productId: string, cityId: string, status: string) {
    startTransition(async () => {
      const res = await adminUpdateAvailability(productId, cityId, status as any);
      if (res.success) toast.success("Availability updated");
      else toast.error("Failed to update availability");
    });
  }

  const statusColors: Record<string, string> = {
    AVAILABLE: "text-leaf-400 bg-leaf-500/10 border-leaf-500/20",
    LIMITED: "text-marigold-400 bg-marigold-400/10 border-marigold-400/20",
    UNAVAILABLE: "text-punch-400 bg-punch-500/10 border-punch-500/20",
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Availability Matrix</h1>
          <p className="text-sm text-gray-500">Manage product availability per city</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-grape-500/40 transition"
          />
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Info size={14} /> Default is AVAILABLE if not set.
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left">
                <th className="sticky left-0 z-10 bg-white px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400 border-r border-gray-200">Product</th>
                {cities.map((c) => (
                  <th key={c.id} className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400 text-center min-w-[140px]">{c.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={cities.length + 1} className="py-16 text-center text-sm text-gray-400">No products found</td>
                </tr>
              )}
              {filteredProducts.map((p) => (
                <tr key={p.id} className="border-b border-gray-200 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="sticky left-0 z-10 bg-white px-4 py-3 border-r border-gray-200">
                    <p className="font-medium text-gray-700 truncate max-w-[200px]" title={p.name}>{p.name}</p>
                    <p className="text-xs text-gray-400">/{p.slug}</p>
                  </td>
                  {cities.map((c) => {
                    const avail = availabilities.find((a) => a.productId === p.id && a.cityId === c.id);
                    const status = avail?.status || "AVAILABLE";
                    return (
                      <td key={c.id} className="px-2 py-2 text-center">
                        <div className="w-full text-left">
                          <Select
                            value={status}
                            onChange={(val) => handleStatusChange(p.id, c.id, val)}
                            options={[
                              { label: "Available", value: "AVAILABLE" },
                              { label: "Limited", value: "LIMITED" },
                              { label: "Unavailable", value: "UNAVAILABLE" },
                            ]}
                          />
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
