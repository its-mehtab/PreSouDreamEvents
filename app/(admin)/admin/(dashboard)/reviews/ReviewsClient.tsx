"use client";

import { useState, useTransition } from "react";
import { adminDeleteReview } from "@/lib/actions/admin";
import { toast } from "sonner";
import { Search, Star, Trash2, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { Select } from "@/components/ui/Select";

interface Review {
  id: string;
  rating: number;
  comment: string;
  city: string;
  createdAt: string;
  user: { name?: string; phone: string };
  product: { id: string; name: string; slug: string };
}

export default function ReviewsClient({ reviews }: { reviews: Review[] }) {
  const [search, setSearch] = useState("");
  const [minRating, setMinRating] = useState<number>(0);
  const [isPending, startTransition] = useTransition();

  const filtered = reviews.filter((r) =>
    r.rating >= minRating &&
    (!search || r.product.name.toLowerCase().includes(search.toLowerCase()) || r.comment.toLowerCase().includes(search.toLowerCase()) || r.user.phone.includes(search))
  );

  async function deleteReview(id: string) {
    if (!confirm("Are you sure you want to delete this review?")) return;
    startTransition(async () => {
      const res = await adminDeleteReview(id);
      if (res.success) toast.success("Review deleted");
      else toast.error("Failed to delete");
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Reviews</h1>
          <p className="text-sm text-gray-500">{filtered.length} of {reviews.length} reviews</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product, comment, phone…"
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-grape-500/40 transition"
          />
        </div>
        <div className="w-40">
          <Select
            value={minRating.toString()}
            onChange={(val) => setMinRating(Number(val))}
            options={[
              { label: "All Ratings", value: "0" },
              { label: "5 Stars only", value: "5" },
              { label: "4+ Stars", value: "4" },
              { label: "3+ Stars", value: "3" },
            ]}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <AnimatePresence>
          {filtered.length === 0 && (
            <div className="col-span-full py-16 text-center text-sm text-gray-400">No reviews found</div>
          )}
          {filtered.map((r) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl border border-gray-200 bg-gray-50 p-5 hover:bg-white/[0.05] transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} className={i < r.rating ? "fill-marigold-400 text-marigold-400" : "fill-white/5 text-gray-500"} />
                    ))}
                  </div>
                  <Link href={`/product/${r.product.slug}`} target="_blank" className="text-sm font-semibold text-gray-700 hover:text-gray-900 flex items-center gap-1 group">
                    {r.product.name} <ExternalLink size={12} className="text-gray-400 group-hover:text-gray-600" />
                  </Link>
                </div>
                <button
                  onClick={() => deleteReview(r.id)}
                  disabled={isPending}
                  className="rounded-lg bg-gray-100 p-2 text-gray-400 hover:bg-punch-500/20 hover:text-punch-400 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="mt-4 rounded-xl bg-gray-100 p-4 text-sm text-gray-600 italic">
                "{r.comment}"
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-gray-500 border-t border-gray-200 pt-3">
                <span>By {r.user.name || r.user.phone} in {r.city}</span>
                <span>{format(new Date(r.createdAt), "dd MMM yyyy")}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
