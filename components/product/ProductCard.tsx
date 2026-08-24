"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Heart, Star, Sparkles, MapPin } from "lucide-react";
import { Product } from "@/lib/types";
import { formatPrice, discountPercent, cn } from "@/lib/utils";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useLocation } from "@/context/LocationContext";
import { motion } from "motion/react";

export default function ProductCard({ product, className }: { product: Product; className?: string }) {
  const { toggle, isWishlisted } = useWishlist();
  const { addItem } = useCart();
  const { city } = useLocation();
  const [hover, setHover] = useState(false);
  const wishlisted = isWishlisted(product.id);
  const discount = discountPercent(product.price, product.mrp);
  const cityAvailability = product.cities.find((c) => c.city === city);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.18 }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-ink/8 bg-white shadow-card",
        className
      )}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Link href={`/product/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-paper">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 280px"
          className={cn("object-cover transition-opacity duration-300", hover && product.images[1] && "opacity-0")}
        />
        {product.images[1] && (
          <Image
            src={product.images[1]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 280px"
            className={cn("object-cover opacity-0 transition-opacity duration-300", hover && "opacity-100")}
          />
        )}

        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {discount > 0 && <span className="badge bg-punch-500 text-white">{discount}% OFF</span>}
          {product.badges.slice(0, 1).map((b) => (
            <span key={b} className="badge bg-marigold-400 text-ink">
              {b}
            </span>
          ))}
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            toggle(product.id, product.name);
          }}
          aria-label="Toggle wishlist"
          className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 shadow-sm backdrop-blur transition-transform hover:scale-110 active:scale-95"
        >
          <Heart size={16} className={wishlisted ? "fill-punch-500 text-punch-500" : "text-ink/50"} />
        </button>

        {product.isCustomizable && (
          <span className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-grape-700 backdrop-blur">
            <Sparkles size={10} /> Customizable
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <Link href={`/product/${product.slug}`} className="line-clamp-1 text-sm font-semibold text-ink hover:text-grape-700">
          {product.name}
        </Link>
        <p className="line-clamp-1 text-xs text-ink/50">{product.tagline}</p>

        <div className="flex items-center gap-1.5 text-xs">
          <span className="flex items-center gap-0.5 rounded bg-leaf-50 px-1.5 py-0.5 font-semibold text-leaf-600">
            {product.rating} <Star size={10} className="fill-leaf-600" />
          </span>
          <span className="text-ink/40">({product.reviewCount})</span>
        </div>

        <div className="mt-0.5 flex items-baseline gap-1.5 font-mono">
          <span className="text-base font-bold text-ink">{formatPrice(product.price)}</span>
          {product.mrp > product.price && (
            <span className="text-xs text-ink/40 line-through">{formatPrice(product.mrp)}</span>
          )}
        </div>

        <p
          className={cn(
            "flex items-center gap-1 text-[11px] font-medium",
            cityAvailability?.status === "available" && "text-leaf-600",
            cityAvailability?.status === "limited" && "text-marigold-600",
            cityAvailability?.status === "unavailable" && "text-ink/40"
          )}
        >
          <MapPin size={11} />
          {cityAvailability?.status === "available" && "Available in " + city}
          {cityAvailability?.status === "limited" && "Limited slots in " + city}
          {cityAvailability?.status === "unavailable" && "Check other cities"}
        </p>

        <div className="mt-auto grid grid-cols-2 gap-2 pt-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              addItem({ productId: product.id, city });
            }}
            className="rounded-full border border-ink/15 px-2 py-1.5 text-xs font-semibold text-ink hover:border-grape-500 hover:text-grape-700"
          >
            Add to Cart
          </button>
          <Link
            href={`/product/${product.slug}`}
            className="rounded-full bg-grape-600 px-2 py-1.5 text-center text-xs font-semibold text-white hover:bg-grape-700"
          >
            Book Now
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
