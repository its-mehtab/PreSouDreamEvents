"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart, Share2, Star, MapPin, CalendarDays, Clock, Home, ChevronDown, ChevronUp,
  ShieldCheck, RefreshCcw, Minus, Plus, X, Check,
} from "lucide-react";
import { Product, Venue } from "@/lib/types";
import { formatPrice, discountPercent, cn } from "@/lib/utils";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useLocation } from "@/context/LocationContext";
import { useRouter } from "next/navigation";
import { recordView, useRecentlyViewed } from "@/lib/useRecentlyViewed";
import { products, getRelatedProducts } from "@/lib/data/products";
import ProductRail from "@/components/product/ProductRail";
import WhatsAppCTA from "@/components/WhatsAppCTA";
import { toast } from "sonner";

const VENUES: Venue[] = ["Home", "Hotel", "Hall", "Terrace", "Outdoor", "Office", "Other"];
const TIME_SLOTS = ["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM", "5:00 PM", "7:00 PM"];

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const { toggle, isWishlisted } = useWishlist();
  const { addItem } = useCart();
  const { city, setCity } = useLocation();
  const router = useRouter();

  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [venue, setVenue] = useState<Venue>("Home");
  const [eventDate, setEventDate] = useState(todayISO());
  const [eventTime, setEventTime] = useState(TIME_SLOTS[2]);
  const [customizations, setCustomizations] = useState<Record<string, string>>({});
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    recordView(product.id);
  }, [product.id]);

  const cityAvailability = product.cities.find((c) => c.city === city);
  const discount = discountPercent(product.price, product.mrp);
  const addOnsTotal = selectedAddOns.reduce((sum, id) => {
    const a = product.addOns.find((x) => x.id === id);
    return sum + (a?.price ?? 0);
  }, 0);
  const total = (product.price + addOnsTotal) * quantity;

  const related = useMemo(() => getRelatedProducts(product, 4), [product]);
  const recentIds = useRecentlyViewed(product.id);
  const recentProducts = recentIds.map((id) => products.find((p) => p.id === id)).filter(Boolean).slice(0, 6) as Product[];

  function handleAddToCart(goToCheckout: boolean) {
    addItem({
      productId: product.id,
      quantity,
      customizations,
      addOnIds: selectedAddOns,
      city,
      eventDate,
      eventTime,
      venue,
    });
    if (goToCheckout) router.push("/checkout");
  }

  const customizationSummary = Object.entries(customizations)
    .map(([k, v]) => v)
    .filter(Boolean)
    .join(", ");

  return (
    <div className="container-app py-5">
      <nav className="mb-3 flex items-center gap-1 text-xs text-ink/45">
        <Link href="/" className="hover:text-grape-700">Home</Link>
        <ChevronDown size={12} className="-rotate-90" />
        <Link href={`/shop/${product.category === "Birthday" ? "birthday" : "shop"}`} className="hover:text-grape-700">
          {product.category}
        </Link>
        <ChevronDown size={12} className="-rotate-90" />
        <span className="text-ink/70">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1fr_400px]">
        {/* Gallery */}
        <div className="lg:col-span-1">
          <button
            onClick={() => setLightboxOpen(true)}
            className="relative block aspect-square w-full overflow-hidden rounded-2xl bg-paper"
          >
            <Image src={product.images[activeImage]} alt={product.name} fill className="object-cover" sizes="(max-width:1024px) 100vw, 40vw" priority />
          </button>
          <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-none">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={cn(
                  "relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2",
                  activeImage === i ? "border-grape-600" : "border-transparent"
                )}
              >
                <Image src={img} alt="" fill className="object-cover" sizes="64px" />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              {product.badges.map((b) => (
                <span key={b} className="badge mr-1.5 bg-marigold-400 text-ink">{b}</span>
              ))}
              <h1 className="mt-1 font-display text-2xl font-bold text-ink sm:text-3xl">{product.name}</h1>
              <p className="mt-1 text-sm text-ink/55">{product.tagline}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                onClick={() => toggle(product.id, product.name)}
                className="rounded-full border border-ink/12 p-2.5 hover:bg-paper"
                aria-label="Toggle wishlist"
              >
                <Heart size={18} className={isWishlisted(product.id) ? "fill-punch-500 text-punch-500" : ""} />
              </button>
              <button
                onClick={() => {
                  if (typeof navigator !== "undefined" && navigator.share) {
                    navigator.share({ title: product.name, url: window.location.href }).catch(() => {});
                  } else {
                    toast.success("Link copied to clipboard");
                  }
                }}
                className="rounded-full border border-ink/12 p-2.5 hover:bg-paper"
                aria-label="Share"
              >
                <Share2 size={18} />
              </button>
            </div>
          </div>

          <a href="#reviews" className="mt-3 flex w-fit items-center gap-1.5 text-sm">
            <span className="flex items-center gap-1 rounded bg-leaf-50 px-1.5 py-0.5 font-semibold text-leaf-600">
              {product.rating} <Star size={11} className="fill-leaf-600" />
            </span>
            <span className="text-ink/50 hover:underline">{product.reviewCount} reviews</span>
          </a>

          <div className="mt-4 flex items-baseline gap-2 font-mono">
            <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
            {product.mrp > product.price && (
              <>
                <span className="text-lg text-ink/40 line-through">{formatPrice(product.mrp)}</span>
                <span className="text-sm font-semibold text-punch-500">{discount}% off</span>
              </>
            )}
          </div>
          <p className="mt-1 text-xs text-leaf-600">
            You save {formatPrice(product.mrp - product.price)} on this package
          </p>

          <div className="mt-5 rounded-2xl border border-ink/8 p-4">
            <p className="mb-2 text-sm font-semibold">What&apos;s included</p>
            <ul className="space-y-1.5 text-sm text-ink/65">
              {product.whatsIncluded.map((w) => (
                <li key={w} className="flex items-start gap-2">
                  <Check size={15} className="mt-0.5 shrink-0 text-leaf-500" /> {w}
                </li>
              ))}
            </ul>
          </div>

          {product.customizations.length > 0 && (
            <div className="mt-5 rounded-2xl border border-ink/8 p-4">
              <p className="mb-3 text-sm font-semibold">Customize</p>
              <div className="space-y-4">
                {product.customizations.map((c) => (
                  <div key={c.id}>
                    <label className="mb-1.5 block text-xs font-semibold text-ink/60">{c.label}</label>
                    {c.type === "color" && c.choices && (
                      <div className="flex flex-wrap gap-2">
                        {c.choices.map((choice) => (
                          <button
                            key={choice}
                            onClick={() => setCustomizations((s) => ({ ...s, [c.id]: choice }))}
                            className={cn("chip", customizations[c.id] === choice && "chip-active")}
                          >
                            {choice}
                          </button>
                        ))}
                      </div>
                    )}
                    {c.type === "text" && (
                      <input
                        value={customizations[c.id] ?? ""}
                        onChange={(e) => setCustomizations((s) => ({ ...s, [c.id]: e.target.value }))}
                        placeholder={`Enter ${c.label.toLowerCase()}`}
                        className="input-field"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {product.addOns.length > 0 && (
            <div className="mt-5 rounded-2xl border border-ink/8 p-4">
              <p className="mb-3 text-sm font-semibold">Add-ons</p>
              <div className="space-y-2">
                {product.addOns.map((a) => {
                  const checked = selectedAddOns.includes(a.id);
                  return (
                    <label
                      key={a.id}
                      className={cn(
                        "flex cursor-pointer items-center justify-between rounded-xl border px-3 py-2.5 text-sm transition-colors",
                        checked ? "border-grape-500 bg-grape-50" : "border-ink/10 hover:bg-paper"
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="accent-grape-600"
                          checked={checked}
                          onChange={() =>
                            setSelectedAddOns((s) => (checked ? s.filter((id) => id !== a.id) : [...s, a.id]))
                          }
                        />
                        {a.name}
                      </span>
                      <span className="font-mono font-semibold">+{formatPrice(a.price)}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Booking panel */}
        <BookingPanel
          product={product}
          city={city}
          setCity={setCity}
          venue={venue}
          setVenue={setVenue}
          eventDate={eventDate}
          setEventDate={setEventDate}
          eventTime={eventTime}
          setEventTime={setEventTime}
          quantity={quantity}
          setQuantity={setQuantity}
          cityAvailability={cityAvailability}
          total={total}
          onAddToCart={() => handleAddToCart(false)}
          onBookNow={() => handleAddToCart(true)}
          customizationSummary={customizationSummary}
        />
      </div>

      {/* Setup / Cancellation / FAQ */}
      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1fr_400px]">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-ink/8 p-4">
              <p className="mb-1.5 flex items-center gap-2 text-sm font-semibold">
                <Clock size={15} className="text-grape-600" /> Setup Information
              </p>
              <p className="text-sm text-ink/60">{product.setupInfo}</p>
              <p className="mt-2 text-xs text-ink/45">Estimated setup time: {product.setupDurationMins} minutes</p>
            </div>
            <div className="rounded-2xl border border-ink/8 p-4">
              <p className="mb-1.5 flex items-center gap-2 text-sm font-semibold">
                <RefreshCcw size={15} className="text-grape-600" /> Cancellation & Rescheduling
              </p>
              <p className="text-sm text-ink/60">{product.cancellationInfo}</p>
            </div>
          </div>

          <div className="mt-6">
            <p className="mb-3 font-display text-lg font-semibold">Frequently Asked Questions</p>
            <div className="divide-y divide-ink/8 rounded-2xl border border-ink/8">
              {product.faqs.map((f, i) => (
                <div key={i}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium"
                  >
                    {f.q}
                    {openFaq === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  {openFaq === i && <p className="px-4 pb-3 text-sm text-ink/60">{f.a}</p>}
                </div>
              ))}
            </div>
          </div>

          <div id="reviews" className="mt-8 scroll-mt-24">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-display text-lg font-semibold">Ratings & Reviews</p>
              <span className="flex items-center gap-1 rounded bg-leaf-50 px-2 py-1 text-sm font-semibold text-leaf-600">
                {product.rating} <Star size={13} className="fill-leaf-600" /> · {product.reviewCount} reviews
              </span>
            </div>
            <div className="space-y-3">
              {product.reviews.map((r) => (
                <div key={r.id} className="rounded-2xl border border-ink/8 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{r.author}</p>
                    <span className="flex items-center gap-0.5 text-xs font-semibold text-leaf-600">
                      {r.rating} <Star size={11} className="fill-leaf-600" />
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-ink/40">{r.city} · {new Date(r.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                  <p className="mt-2 text-sm text-ink/65">{r.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="hidden lg:block" />
      </div>

      {related.length > 0 && (
        <div className="mt-6 border-t border-ink/8">
          <ProductRail title="Similar Decorations" products={related} />
        </div>
      )}
      {recentProducts.length > 0 && (
        <div className="border-t border-ink/8">
          <ProductRail title="Recently Viewed" products={recentProducts} />
        </div>
      )}

      {lightboxOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/90 p-6" onClick={() => setLightboxOpen(false)}>
          <button className="absolute right-5 top-5 rounded-full bg-white/10 p-2 text-white hover:bg-white/20" aria-label="Close">
            <X size={22} />
          </button>
          <div className="relative h-full max-h-[85vh] w-full max-w-3xl">
            <Image src={product.images[activeImage]} alt={product.name} fill className="object-contain" sizes="100vw" />
          </div>
        </div>
      )}

      <WhatsAppCTA
        variant="floating"
        productName={product.name}
        city={city}
        venue={venue}
        date={eventDate}
        time={eventTime}
        customization={customizationSummary}
      />
    </div>
  );
}

function BookingPanel(props: {
  product: Product;
  city: string;
  setCity: (c: string) => void;
  venue: Venue;
  setVenue: (v: Venue) => void;
  eventDate: string;
  setEventDate: (d: string) => void;
  eventTime: string;
  setEventTime: (t: string) => void;
  quantity: number;
  setQuantity: (n: number) => void;
  cityAvailability?: { status: string; earliestSlot?: string };
  total: number;
  onAddToCart: () => void;
  onBookNow: () => void;
  customizationSummary: string;
}) {
  const {
    product, city, venue, setVenue, eventDate, setEventDate, eventTime, setEventTime,
    quantity, setQuantity, cityAvailability, total, onAddToCart, onBookNow, customizationSummary,
  } = props;

  return (
    <div className="lg:col-span-1">
      <div className="sticky top-24 rounded-2xl border border-ink/10 bg-white p-5 shadow-card">
        <p className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <MapPin size={15} className="text-grape-600" /> {city}
        </p>

        <div
          className={cn(
            "mb-4 flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold",
            cityAvailability?.status === "available" && "bg-leaf-50 text-leaf-600",
            cityAvailability?.status === "limited" && "bg-marigold-50 text-marigold-700",
            (!cityAvailability || cityAvailability.status === "unavailable") && "bg-punch-50 text-punch-600"
          )}
        >
          {cityAvailability?.status === "available" && `Available · Earliest slot ${cityAvailability.earliestSlot}`}
          {cityAvailability?.status === "limited" && `Limited availability · ${cityAvailability.earliestSlot}`}
          {(!cityAvailability || cityAvailability.status === "unavailable") && "Not available in this city — try WhatsApp for a custom quote"}
        </div>

        <div className="space-y-3">
          <div>
            <label className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-ink/60">
              <Home size={13} /> Venue
            </label>
            <select value={venue} onChange={(e) => setVenue(e.target.value as Venue)} className="input-field">
              {VENUES.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-ink/60">
                <CalendarDays size={13} /> Date
              </label>
              <input
                type="date"
                value={eventDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setEventDate(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-ink/60">
                <Clock size={13} /> Time
              </label>
              <select value={eventTime} onChange={(e) => setEventTime(e.target.value)} className="input-field">
                {TIME_SLOTS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-ink/60">Quantity</label>
            <div className="flex w-fit items-center gap-3 rounded-xl border border-ink/12 px-3 py-1.5">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease quantity">
                <Minus size={14} />
              </button>
              <span className="w-5 text-center text-sm font-semibold">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} aria-label="Increase quantity">
                <Plus size={14} />
              </button>
            </div>
          </div>
        </div>

        <div className="my-4 border-t border-dashed border-ink/15" />

        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-medium text-ink/60">Total</span>
          <span className="ticket-tag text-xl font-bold">{formatPrice(total)}</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button onClick={onAddToCart} className="btn-secondary">Add to Cart</button>
          <button onClick={onBookNow} className="btn-primary">Book Now</button>
        </div>

        <div className="mt-4 space-y-1.5 text-xs text-ink/50">
          <p className="flex items-center gap-1.5"><ShieldCheck size={13} className="text-leaf-500" /> Verified local decorators</p>
          <p className="flex items-center gap-1.5"><RefreshCcw size={13} className="text-leaf-500" /> Free rescheduling up to 24 hrs before</p>
        </div>

        <WhatsAppCTA
          variant="button"
          className="mt-4 w-full"
          productName={product.name}
          city={city}
          venue={venue}
          date={eventDate}
          time={eventTime}
          customization={customizationSummary}
        />
      </div>
    </div>
  );
}
