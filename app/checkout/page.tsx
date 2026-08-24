"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { checkoutSchema, CheckoutFormValues } from "@/lib/checkoutSchema";
import { useCart } from "@/context/CartContext";
import { useLocation } from "@/context/LocationContext";
import { products } from "@/lib/data/products";
import { formatPrice, cn } from "@/lib/utils";
import { createOrder } from "@/lib/orders";
import { cities } from "@/lib/data/categories";
import { User, Phone, Mail, MapPin, Home, CalendarDays, Clock, MessageSquareText, Wallet, CreditCard, Landmark, HandCoins, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

const VENUES = ["Home", "Hotel", "Hall", "Terrace", "Outdoor", "Office", "Other"];
const TIME_SLOTS = ["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM", "5:00 PM", "7:00 PM"];

const PAYMENT_OPTIONS = [
  { value: "upi", label: "UPI", icon: Wallet, hint: "GPay, PhonePe, Paytm" },
  { value: "card", label: "Card", icon: CreditCard, hint: "Credit or Debit card" },
  { value: "netbanking", label: "Netbanking", icon: Landmark, hint: "All major banks" },
  { value: "pay-on-setup", label: "Pay on Setup", icon: HandCoins, hint: "Pay after decoration" },
] as const;

export default function CheckoutPage() {
  const { items, subtotal, discount, clearCart } = useCart();
  const { city } = useLocation();
  const router = useRouter();

  const firstItem = items[0];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      city,
      venue: firstItem?.venue ?? "Home",
      eventDate: firstItem?.eventDate ?? new Date().toISOString().split("T")[0],
      eventTime: firstItem?.eventTime ?? "3:00 PM",
      paymentMethod: "upi",
    },
  });

  useEffect(() => {
    if (items.length === 0) router.replace("/cart");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const taxes = Math.round(subtotal * 0.05);
  const total = Math.max(subtotal - discount, 0) + taxes;
  const paymentMethod = watch("paymentMethod");

  function onSubmit(data: CheckoutFormValues) {
    const order = createOrder({
      items,
      city: data.city,
      venue: data.venue as any,
      eventDate: data.eventDate,
      eventTime: data.eventTime,
      total,
    });
    clearCart();
    router.push(`/checkout/confirmation?orderId=${order.id}`);
  }

  if (items.length === 0) {
    return (
      <div className="container-app flex flex-col items-center gap-3 py-24 text-center">
        <ShoppingBag size={36} className="text-ink/25" />
        <p className="text-ink/60">Your cart is empty. Redirecting…</p>
      </div>
    );
  }

  return (
    <div className="container-app py-6">
      <h1 className="font-display text-2xl font-bold sm:text-3xl">Checkout</h1>
      <p className="mt-1 text-sm text-ink/50">Customize → Availability → Cart → Checkout → Confirmation</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <fieldset className="rounded-2xl border border-ink/10 bg-white p-5">
            <legend className="mb-3 px-1 font-display text-lg font-semibold">Customer Information</legend>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Full Name" icon={User} error={errors.fullName?.message}>
                <input {...register("fullName")} className="input-field" placeholder="Priya Sharma" />
              </Field>
              <Field label="Phone Number" icon={Phone} error={errors.phone?.message}>
                <input {...register("phone")} className="input-field" placeholder="98765 43210" />
              </Field>
              <Field label="Email" icon={Mail} error={errors.email?.message}>
                <input {...register("email")} className="input-field" placeholder="you@email.com" />
              </Field>
              <Field label="City" icon={MapPin} error={errors.city?.message}>
                <select {...register("city")} className="input-field">
                  {cities.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </Field>
              <div className="sm:col-span-2">
                <Field label="Full Address" icon={Home} error={errors.address?.message}>
                  <textarea {...register("address")} rows={2} className="input-field resize-none" placeholder="House / flat, street, landmark" />
                </Field>
              </div>
            </div>
          </fieldset>

          <fieldset className="rounded-2xl border border-ink/10 bg-white p-5">
            <legend className="mb-3 px-1 font-display text-lg font-semibold">Event Details</legend>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="Venue" icon={Home} error={errors.venue?.message}>
                <select {...register("venue")} className="input-field">
                  {VENUES.map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </Field>
              <Field label="Event Date" icon={CalendarDays} error={errors.eventDate?.message}>
                <input type="date" {...register("eventDate")} className="input-field" />
              </Field>
              <Field label="Time Slot" icon={Clock} error={errors.eventTime?.message}>
                <select {...register("eventTime")} className="input-field">
                  {TIME_SLOTS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </Field>
            </div>
            <div className="mt-4">
              <Field label="Special Instructions (optional)" icon={MessageSquareText}>
                <textarea {...register("instructions")} rows={2} className="input-field resize-none" placeholder="Gate code, floor number, or specific requests" />
              </Field>
            </div>
          </fieldset>

          <fieldset className="rounded-2xl border border-ink/10 bg-white p-5">
            <legend className="mb-3 px-1 font-display text-lg font-semibold">Payment Method</legend>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {PAYMENT_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className={cn(
                    "flex cursor-pointer flex-col items-center gap-1.5 rounded-2xl border px-3 py-4 text-center transition-colors",
                    paymentMethod === opt.value ? "border-grape-600 bg-grape-50" : "border-ink/10 hover:bg-paper"
                  )}
                >
                  <input type="radio" value={opt.value} {...register("paymentMethod")} className="hidden" />
                  <opt.icon size={20} className={paymentMethod === opt.value ? "text-grape-700" : "text-ink/50"} />
                  <span className="text-xs font-semibold">{opt.label}</span>
                  <span className="text-[10px] text-ink/40">{opt.hint}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="h-fit space-y-4">
          <div className="rounded-2xl border border-ink/10 bg-white p-5">
            <p className="mb-3 font-display text-lg font-semibold">Order Summary</p>
            <div className="max-h-64 space-y-3 overflow-y-auto pr-1">
              {items.map((item) => {
                const product = products.find((p) => p.id === item.productId);
                if (!product) return null;
                return (
                  <div key={item.cartId} className="flex items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                      <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="48px" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{product.name}</p>
                      <p className="text-xs text-ink/45">Qty {item.quantity}</p>
                    </div>
                    <span className="shrink-0 font-mono text-sm font-semibold">{formatPrice(product.price * item.quantity)}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 space-y-2 border-t border-dashed border-ink/15 pt-3 text-sm">
              <div className="flex justify-between text-ink/60"><span>Subtotal</span><span className="font-mono">{formatPrice(subtotal)}</span></div>
              {discount > 0 && <div className="flex justify-between text-leaf-600"><span>Discount</span><span className="font-mono">-{formatPrice(discount)}</span></div>}
              <div className="flex justify-between text-ink/60"><span>Taxes & fees</span><span className="font-mono">{formatPrice(taxes)}</span></div>
            </div>
            <div className="mt-3 flex justify-between border-t border-ink/10 pt-3 text-base font-bold">
              <span>Total</span><span className="font-mono">{formatPrice(total)}</span>
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
            {isSubmitting ? "Placing your booking…" : `Place Booking · ${formatPrice(total)}`}
          </button>
          <Link href="/cart" className="block text-center text-sm text-ink/50 hover:text-grape-700">
            ← Back to cart
          </Link>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  icon: Icon,
  error,
  children,
}: {
  label: string;
  icon: any;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-ink/60">
        <Icon size={13} /> {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs font-medium text-punch-500">{error}</p>}
    </div>
  );
}
