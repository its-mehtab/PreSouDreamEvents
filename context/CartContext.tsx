"use client";

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { CartItem } from "@/lib/types";
import { products } from "@/lib/data/products";
import { toast } from "sonner";

interface AddItemArgs {
  productId: string;
  quantity?: number;
  customizations?: Record<string, string>;
  addOnIds?: string[];
  city: string;
  eventDate?: string;
  eventTime?: string;
  venue?: CartItem["venue"];
}

interface CartContextValue {
  items: CartItem[];
  addItem: (args: AddItemArgs) => void;
  removeItem: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  subtotal: number;
  itemCount: number;
  couponCode: string | null;
  discount: number;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "presou-cart-v1";

const VALID_COUPONS: Record<string, number> = {
  FIRST100: 100,
  SAVE10: 0.1,
  BALLOON200: 200,
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setItems(parsed.items ?? []);
        setCouponCode(parsed.couponCode ?? null);
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ items, couponCode }));
  }, [items, couponCode, hydrated]);

  const addItem = (args: AddItemArgs) => {
    const cartId = `${args.productId}-${Date.now()}`;
    setItems((prev) => [
      ...prev,
      {
        cartId,
        productId: args.productId,
        quantity: args.quantity ?? 1,
        customizations: args.customizations ?? {},
        addOnIds: args.addOnIds ?? [],
        city: args.city,
        eventDate: args.eventDate,
        eventTime: args.eventTime,
        venue: args.venue,
      },
    ]);
    const product = products.find((p) => p.id === args.productId);
    toast.success(`${product?.name ?? "Item"} added to cart`);
    setDrawerOpen(true);
  };

  const removeItem = (cartId: string) => {
    setItems((prev) => prev.filter((i) => i.cartId !== cartId));
  };

  const updateQuantity = (cartId: string, quantity: number) => {
    setItems((prev) =>
      prev.map((i) => (i.cartId === cartId ? { ...i, quantity: Math.max(1, quantity) } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
    setCouponCode(null);
  };

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return sum;
      const addOnsTotal = item.addOnIds.reduce((s, id) => {
        const addOn = product.addOns.find((a) => a.id === id);
        return s + (addOn?.price ?? 0);
      }, 0);
      return sum + (product.price + addOnsTotal) * item.quantity;
    }, 0);
  }, [items]);

  const discount = useMemo(() => {
    if (!couponCode) return 0;
    const rule = VALID_COUPONS[couponCode];
    if (!rule) return 0;
    if (rule < 1) return Math.round(subtotal * rule);
    return rule;
  }, [couponCode, subtotal]);

  const applyCoupon = (code: string) => {
    const normalized = code.trim().toUpperCase();
    if (VALID_COUPONS[normalized]) {
      setCouponCode(normalized);
      toast.success(`Coupon ${normalized} applied`);
      return true;
    }
    toast.error("Invalid coupon code");
    return false;
  };

  const removeCoupon = () => setCouponCode(null);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isDrawerOpen,
        openDrawer: () => setDrawerOpen(true),
        closeDrawer: () => setDrawerOpen(false),
        subtotal,
        itemCount,
        couponCode,
        discount,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
