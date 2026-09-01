"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { adminDeleteProduct } from "@/lib/actions/admin";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import StatusBadge from "@/components/admin/StatusBadge";
import {
  Search, Plus, Edit2, Trash2, ImageIcon, Star, Package,
  ChevronUp, ChevronDown,
} from "lucide-react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  decorationType: string;
  images: string[];
  isPremium: boolean;
  isTrending: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  occasions: { name: string }[];
  reviews: { rating: number }[];
  _count: { bookingItems: number };
  createdAt: string;
}

export default function ProductsClient({ products }: { products: Product[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<"name" | "price" | "bookings">("bookings");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = products
    .filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.decorationType.toLowerCase().includes(search.toLowerCase()) ||
      p.occasions.some((o) => o.name.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      let av: number | string = 0;
      let bv: number | string = 0;
      if (sortField === "name") { av = a.name; bv = b.name; }
      if (sortField === "price") { av = a.price; bv = b.price; }
      if (sortField === "bookings") { av = a._count.bookingItems; bv = b._count.bookingItems; }
      if (typeof av === "string") return sortDir === "asc" ? av.localeCompare(bv as string) : (bv as string).localeCompare(av);
      return sortDir === "asc" ? av - (bv as number) : (bv as number) - av;
    });

  function toggleSort(field: typeof sortField) {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("desc"); }
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const res = await adminDeleteProduct(id);
      if (res.success) {
        toast.success("Product deleted");
        setConfirmDelete(null);
        router.refresh();
      } else {
        toast.error("Failed to delete product");
      }
    });
  }

  const SortIcon = ({ field }: { field: string }) =>
    sortField === field ? (
      sortDir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />
    ) : (
      <ChevronDown size={12} className="opacity-20" />
    );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500">{products.length} products total</p>
        </div>
        <button
          onClick={() => router.push("/admin/products/new")}
          className="flex items-center gap-2 rounded-xl bg-grape-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-grape-700 transition-colors"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, type, occasion…"
          className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-grape-500/40 focus:ring-1 focus:ring-grape-500/20 transition"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400 w-12">Image</th>
                <th
                  className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400 cursor-pointer hover:text-gray-600"
                  onClick={() => toggleSort("name")}
                >
                  <span className="flex items-center gap-1">Name <SortIcon field="name" /></span>
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Type</th>
                <th
                  className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400 cursor-pointer hover:text-gray-600 text-right"
                  onClick={() => toggleSort("price")}
                >
                  <span className="flex items-center justify-end gap-1">Price <SortIcon field="price" /></span>
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400 text-right">Rating</th>
                <th
                  className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400 cursor-pointer hover:text-gray-600 text-right"
                  onClick={() => toggleSort("bookings")}
                >
                  <span className="flex items-center justify-end gap-1">Bookings <SortIcon field="bookings" /></span>
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Badges</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-16 text-center text-sm text-gray-400">
                      No products found
                    </td>
                  </tr>
                )}
                {filtered.map((product) => {
                  const avgRating =
                    product.reviews.length > 0
                      ? (product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length).toFixed(1)
                      : "—";

                  return (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-b border-gray-200 last:border-0 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-gray-100">
                          {product.images[0] ? (
                            <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="40px" />
                          ) : (
                            <ImageIcon size={16} className="absolute inset-0 m-auto text-gray-500" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-700 leading-tight">{product.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {product.occasions.map((o) => o.name).join(", ") || "No occasion"}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded-lg bg-gray-100 px-2 py-1 text-xs text-gray-500">
                          {product.decorationType}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-700">
                        {formatPrice(product.price)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="flex items-center justify-end gap-1 text-marigold-400 font-semibold text-xs">
                          <Star size={11} className="fill-marigold-400" /> {avgRating}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="flex items-center justify-end gap-1 text-xs text-gray-500">
                          <Package size={11} /> {product._count.bookingItems}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {product.isPremium && <span className="rounded-full bg-marigold-400/15 px-1.5 py-0.5 text-[9px] font-bold uppercase text-marigold-400">Premium</span>}
                          {product.isTrending && <span className="rounded-full bg-punch-500/15 px-1.5 py-0.5 text-[9px] font-bold uppercase text-punch-400">Trending</span>}
                          {product.isBestSeller && <span className="rounded-full bg-leaf-500/15 px-1.5 py-0.5 text-[9px] font-bold uppercase text-leaf-400">Bestseller</span>}
                          {product.isNewArrival && <span className="rounded-full bg-blue-500/15 px-1.5 py-0.5 text-[9px] font-bold uppercase text-blue-400">New</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => router.push(`/admin/products/${product.id}`)}
                            className="rounded-lg p-1.5 text-gray-400 hover:bg-grape-600/20 hover:text-grape-400 transition-colors"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => setConfirmDelete(product.id)}
                            className="rounded-lg p-1.5 text-gray-400 hover:bg-punch-500/15 hover:text-punch-400 transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirm Dialog */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl"
            >
              <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-xl bg-punch-500/15">
                <Trash2 size={18} className="text-punch-400" />
              </div>
              <h3 className="mt-3 text-base font-bold text-gray-900">Delete Product?</h3>
              <p className="mt-1 text-sm text-gray-500">
                This action is irreversible. All associated booking items and reviews will remain but the product will be removed.
              </p>
              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(confirmDelete)}
                  disabled={isPending}
                  className="flex-1 rounded-xl bg-punch-600 py-2.5 text-sm font-semibold text-white hover:bg-punch-700 disabled:opacity-50 transition"
                >
                  {isPending ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
