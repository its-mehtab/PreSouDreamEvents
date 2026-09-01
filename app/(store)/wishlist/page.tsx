"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { products } from "@/lib/data/products";
import ProductCard from "@/components/product/ProductCard";

export default function WishlistPage() {
  const { ids } = useWishlist();
  const items = products.filter((p) => ids.includes(p.id));

  return (
    <div className="container-app py-6">
      <h1 className="font-display text-2xl font-bold sm:text-3xl">Your Wishlist</h1>
      <p className="mt-1 text-sm text-ink/50">{items.length} saved decoration{items.length !== 1 ? "s" : ""}</p>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <div className="rounded-full bg-paper p-5">
            <Heart size={30} className="text-ink/25" />
          </div>
          <p className="font-display text-lg font-semibold">Nothing here yet</p>
          <p className="max-w-sm text-sm text-ink/50">
            Tap the heart icon on any decoration to save it here for later.
          </p>
          <Link href="/decorations" className="btn-primary mt-1">Browse Decorations</Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-5">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
