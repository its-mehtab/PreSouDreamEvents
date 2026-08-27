"use client";

import { AnimatePresence, motion } from "motion/react";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { products } from "@/lib/data/products";
import { formatPrice } from "@/lib/utils";

export default function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer, removeItem, updateQuantity, subtotal, discount } = useCart();

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-ink/40 backdrop-blur-[2px]"
            onClick={closeDrawer}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-[80] flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
              <h2 className="font-display text-lg font-semibold">Your Cart ({items.length})</h2>
              <button onClick={closeDrawer} aria-label="Close cart" className="rounded-full p-1.5 hover:bg-paper">
                <X size={20} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
                <div className="rounded-full bg-paper p-4">
                  <ShoppingBag size={28} className="text-ink/30" />
                </div>
                <p className="font-medium text-ink/70">Your cart is empty</p>
                <p className="text-sm text-ink/45">Add a decoration package to get started.</p>
                <Link href="/decorations" onClick={closeDrawer} className="btn-primary mt-2">
                  Browse decorations
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
                  {items.map((item) => {
                    const product = products.find((p) => p.id === item.productId);
                    if (!product) return null;
                    const addOnsTotal = item.addOnIds.reduce((s, id) => {
                      const a = product.addOns.find((x) => x.id === id);
                      return s + (a?.price ?? 0);
                    }, 0);
                    return (
                      <div key={item.cartId} className="flex gap-3 rounded-2xl border border-ink/8 p-3">
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                          <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="80px" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold">{product.name}</p>
                          <p className="mt-0.5 text-xs text-ink/50">
                            {item.city} · {item.eventDate ?? "Date pending"}
                          </p>
                          {item.addOnIds.length > 0 && (
                            <p className="mt-0.5 truncate text-xs text-ink/45">+{item.addOnIds.length} add-on(s)</p>
                          )}
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center gap-2 rounded-full border border-ink/12 px-1.5 py-1">
                              <button
                                onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                                className="rounded-full p-0.5 hover:bg-paper"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={13} />
                              </button>
                              <span className="w-4 text-center text-xs font-semibold">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                                className="rounded-full p-0.5 hover:bg-paper"
                                aria-label="Increase quantity"
                              >
                                <Plus size={13} />
                              </button>
                            </div>
                            <span className="font-mono text-sm font-semibold">
                              {formatPrice((product.price + addOnsTotal) * item.quantity)}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(item.cartId)}
                          aria-label="Remove item"
                          className="h-fit rounded-full p-1.5 text-ink/30 hover:bg-punch-50 hover:text-punch-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-ink/10 px-5 py-4">
                  <div className="mb-1 flex justify-between text-sm text-ink/60">
                    <span>Subtotal</span>
                    <span className="font-mono">{formatPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="mb-1 flex justify-between text-sm text-leaf-500">
                      <span>Coupon discount</span>
                      <span className="font-mono">-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="mb-3 flex justify-between text-base font-bold">
                    <span>Total</span>
                    <span className="font-mono">{formatPrice(Math.max(subtotal - discount, 0))}</span>
                  </div>
                  <Link href="/cart" onClick={closeDrawer} className="btn-secondary mb-2 w-full">
                    View Cart
                  </Link>
                  <Link href="/checkout" onClick={closeDrawer} className="btn-primary w-full">
                    Checkout
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
