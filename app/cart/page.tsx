"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, Tag, ArrowRight, Heart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { products, getRelatedProducts } from "@/lib/data/products";
import { formatPrice } from "@/lib/utils";
import ProductRail from "@/components/product/ProductRail";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, discount, couponCode, applyCoupon, removeCoupon } = useCart();
  const { toggle } = useWishlist();
  const [couponInput, setCouponInput] = useState("");
  const [savedForLater, setSavedForLater] = useState<string[]>([]);

  const taxes = Math.round(subtotal * 0.05);
  const total = Math.max(subtotal - discount, 0) + taxes;

  const recommendations = items.length > 0
    ? getRelatedProducts(products.find((p) => p.id === items[0].productId) ?? products[0], 6)
    : products.slice(0, 6);

  if (items.length === 0) {
    return (
      <div className="container-app flex flex-col items-center justify-center gap-4 py-24 text-center">
        <div className="rounded-full bg-paper p-6">
          <ShoppingBag size={40} className="text-ink/25" />
        </div>
        <h1 className="font-display text-2xl font-bold">Your cart is empty</h1>
        <p className="max-w-sm text-sm text-ink/50">
          Browse our decoration catalog and add a package to get started with your booking.
        </p>
        <Link href="/decorations" className="btn-primary mt-2">
          Browse Decorations <ArrowRight size={15} />
        </Link>
      </div>
    );
  }

  return (
    <div className="container-app py-6">
      <h1 className="font-display text-2xl font-bold sm:text-3xl">Your Cart</h1>
      <p className="mt-1 text-sm text-ink/50">{items.length} item(s) in your cart</p>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          {items.map((item) => {
            const product = products.find((p) => p.id === item.productId);
            if (!product) return null;
            const addOnsTotal = item.addOnIds.reduce((s, id) => {
              const a = product.addOns.find((x) => x.id === id);
              return s + (a?.price ?? 0);
            }, 0);
            const addOnNames = item.addOnIds
              .map((id) => product.addOns.find((a) => a.id === id)?.name)
              .filter(Boolean);
            const customEntries = Object.entries(item.customizations).filter(([, v]) => v);

            return (
              <div key={item.cartId} className="flex flex-col gap-4 rounded-2xl border border-ink/8 bg-white p-4 sm:flex-row">
                <div className="relative h-32 w-full shrink-0 overflow-hidden rounded-xl sm:h-28 sm:w-28">
                  <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="128px" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link href={`/product/${product.slug}`} className="font-semibold hover:text-grape-700">
                        {product.name}
                      </Link>
                      <p className="text-xs text-ink/50">
                        {item.city} · {item.venue} · {item.eventDate} at {item.eventTime}
                      </p>
                    </div>
                    <span className="font-mono text-base font-bold">
                      {formatPrice((product.price + addOnsTotal) * item.quantity)}
                    </span>
                  </div>

                  {customEntries.length > 0 && (
                    <p className="mt-1.5 text-xs text-ink/50">
                      Customization: {customEntries.map(([, v]) => v).join(", ")}
                    </p>
                  )}
                  {addOnNames.length > 0 && (
                    <p className="mt-0.5 text-xs text-ink/50">Add-ons: {addOnNames.join(", ")}</p>
                  )}

                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-3 rounded-full border border-ink/12 px-3 py-1">
                      <button onClick={() => updateQuantity(item.cartId, item.quantity - 1)} aria-label="Decrease">
                        <Minus size={14} />
                      </button>
                      <span className="w-5 text-center text-sm font-semibold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.cartId, item.quantity + 1)} aria-label="Increase">
                        <Plus size={14} />
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        setSavedForLater((s) => [...s, item.cartId]);
                        removeItem(item.cartId);
                      }}
                      className="flex items-center gap-1 text-xs font-semibold text-ink/50 hover:text-grape-700"
                    >
                      <Heart size={13} /> Save for later
                    </button>
                    <button
                      onClick={() => removeItem(item.cartId)}
                      className="flex items-center gap-1 text-xs font-semibold text-punch-500 hover:text-punch-600"
                    >
                      <Trash2 size={13} /> Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="h-fit rounded-2xl border border-ink/10 bg-white p-5">
          <p className="mb-3 font-display text-lg font-semibold">Order Summary</p>

          <div className="mb-4">
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-ink/60">
              <Tag size={13} /> Coupon Code
            </label>
            {couponCode ? (
              <div className="flex items-center justify-between rounded-xl bg-leaf-50 px-3 py-2 text-sm">
                <span className="font-semibold text-leaf-600">{couponCode} applied</span>
                <button onClick={removeCoupon} className="text-xs font-semibold text-ink/50 hover:text-punch-500">
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Try SAVE10"
                  className="input-field"
                />
                <button
                  onClick={() => {
                    applyCoupon(couponInput);
                    setCouponInput("");
                  }}
                  className="btn-secondary shrink-0 !px-4"
                >
                  Apply
                </button>
              </div>
            )}
          </div>

          <div className="space-y-2 border-t border-dashed border-ink/15 pt-3 text-sm">
            <div className="flex justify-between text-ink/60">
              <span>Subtotal</span>
              <span className="font-mono">{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-leaf-600">
                <span>Coupon discount</span>
                <span className="font-mono">-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-ink/60">
              <span>Taxes & fees</span>
              <span className="font-mono">{formatPrice(taxes)}</span>
            </div>
          </div>
          <div className="mt-3 flex justify-between border-t border-ink/10 pt-3 text-base font-bold">
            <span>Total</span>
            <span className="font-mono">{formatPrice(total)}</span>
          </div>

          <Link href="/checkout" className="btn-primary mt-4 w-full">
            Proceed to Checkout <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      <div className="mt-4 border-t border-ink/8">
        <ProductRail title="You might also like" products={recommendations} />
      </div>
    </div>
  );
}
