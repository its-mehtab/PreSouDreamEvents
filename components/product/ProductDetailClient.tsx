"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart, Share2, Star, MapPin, CalendarDays, Clock, Home,
  ChevronDown, ChevronUp, ShieldCheck, RefreshCcw, Minus, Plus, X, Check, ChevronRight, Zap, ChevronLeft, CheckCircle2
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
import { DatePicker } from "@/components/ui/DatePicker";
import { CustomColorPicker, BalloonIcon, SINGLE_BALLOON_COLORS } from "@/components/ui/CustomColorPicker";
import { AnimatePresence, motion } from "framer-motion";

const TIME_SLOTS = ["9 AM – 11 AM", "11 AM – 1 PM", "1 PM – 3 PM", "3 PM – 5 PM", "5 PM – 7 PM", "7 PM – 9 PM", "9 PM – 11 PM"];

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

/** Next 6 days as selectable date pills */
function getDateStrip() {
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const isToday = i === 0;
    const isTmrw = i === 1;
    return {
      iso: d.toISOString().split("T")[0],
      dayLabel: isToday ? "TODAY" : isTmrw ? "TMRW" : d.toLocaleDateString("en-IN", { weekday: "short" }).toUpperCase(),
      dateNum: d.getDate(),
      monthLabel: d.toLocaleDateString("en-IN", { month: "short" }),
      isFast: isToday || isTmrw,
    };
  });
}

type TabKey = "reviews" | "faqs" | "similar";

function getBalloonColors(choice: string): string[] {
  if (choice === "Same as Image") return ["url(#sameAsImage)"];
  if (choice.startsWith("Custom: ")) {
    const names = choice.replace("Custom: ", "").split(" · ");
    return names.map((n) => SINGLE_BALLOON_COLORS.find((c) => c.name === n)?.hex || "#000");
  }
  const c = choice.toLowerCase();
  if (c.includes("rose gold")) return ["#d4af37", "#ffc0cb"]; // approximate rose gold
  if (c.includes("pastel mix")) return ["#ffb3ba", "#baffc9", "#bae1ff"];
  if (c.includes("red & white")) return ["#ef4444", "#f8fafc"];
  if (c.includes("black & gold")) return ["#1e293b", "#fbbf24"];
  if (c.includes("blue & silver")) return ["#3b82f6", "#e2e8f0"];
  return ["#94a3b8"];
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const { toggle, isWishlisted } = useWishlist();
  const { addItem } = useCart();
  const { city } = useLocation();
  const router = useRouter();
  useRecentlyViewed();

  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState(TIME_SLOTS[0]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [customizations, setCustomizations] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    product.customizations.forEach((c) => {
      if (c.choices && c.choices.length > 0) {
        init[c.id] = c.choices[0];
      }
    });
    return init;
  });
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<TabKey>("reviews");
  const [showColorPickerFor, setShowColorPickerFor] = useState<string | null>(null);
  const addOnsScrollRef = useRef<HTMLDivElement>(null);
  const addOnsDragging = useRef(false);
  const addOnsDragStartX = useRef(0);
  const addOnsDragScrollLeft = useRef(0);
  const addOnsDragMoved = useRef(false);

  function scrollAddOns(dir: "left" | "right") {
    addOnsScrollRef.current?.scrollBy({ left: dir === "right" ? 310 : -310, behavior: "smooth" });
  }

  function onAddOnsMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    const el = addOnsScrollRef.current;
    if (!el) return;
    addOnsDragging.current = true;
    addOnsDragMoved.current = false;
    addOnsDragStartX.current = e.pageX - el.offsetLeft;
    addOnsDragScrollLeft.current = el.scrollLeft;
    el.style.cursor = "grabbing";
    el.style.userSelect = "none";
  }

  function onAddOnsMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!addOnsDragging.current) return;
    const el = addOnsScrollRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const delta = x - addOnsDragStartX.current;
    if (Math.abs(delta) > 4) addOnsDragMoved.current = true;
    el.scrollLeft = addOnsDragScrollLeft.current - delta;
  }

  function onAddOnsMouseUp() {
    addOnsDragging.current = false;
    const el = addOnsScrollRef.current;
    if (el) { el.style.cursor = "grab"; el.style.userSelect = ""; }
  }

  const DATE_STRIP = useMemo(() => isMounted ? getDateStrip() : [], [isMounted]);

  useEffect(() => {
    setEventDate(todayISO());
    setIsMounted(true);
  }, []);

  useEffect(() => { recordView(product.id); }, [product.id]);

  const cityAvailability = product.cities.find((c) => c.city === city);
  const discount = discountPercent(product.price, product.mrp);
  const addOnsTotal = selectedAddOns.reduce((sum, id) => {
    const a = product.addOns.find((x) => x.id === id);
    return sum + (a?.price ?? 0);
  }, 0);
  const total = product.price + addOnsTotal;

  const related = useMemo(() => getRelatedProducts(product, 8), [product]);
  const recentIds = useRecentlyViewed(product.id);
  const recentProducts = recentIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean).slice(0, 6) as Product[];

  const customizationSummary = Object.values(customizations).filter(Boolean).join(", ");

  function handleBookNow() {
    addItem({ productId: product.id, quantity: 1, customizations, addOnIds: selectedAddOns, city, eventDate, eventTime });
    router.push("/checkout");
  }

  const categorySlug = product.category.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="container-app py-5">
      {/* ── Breadcrumb ── */}
      <nav className="mb-5 flex items-center gap-1.5 text-xs text-ink/45">
        <Link href="/" className="hover:text-grape-700 transition-colors">Home</Link>
        <ChevronRight size={11} className="opacity-50" />
        <Link href={`/shop/${categorySlug}`} className="hover:text-grape-700 transition-colors">{product.category}</Link>
        <ChevronRight size={11} className="opacity-50" />
        <span className="truncate max-w-[200px] text-ink/70">{product.name}</span>
      </nav>

      {/* ── 2-column main layout ── */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">

        {/* ════ LEFT: sticky gallery ════ */}
        <div className="lg:sticky lg:top-24 lg:self-start lg:col-span-5">
          {/* Main image */}
          <button
            onClick={() => setLightboxOpen(true)}
            className="group relative block w-full overflow-hidden rounded-2xl bg-paper shadow-sm"
            style={{ aspectRatio: "1 / 1" }}
          >
            <Image
              src={product.images[activeImage]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              sizes="(max-width:1024px) 100vw, 42vw"
              priority
            />
            {/* Discount badge */}
            {discount > 0 && (
              <span className="absolute left-3 top-3 rounded-full bg-punch-500 px-3 py-1 text-xs font-bold text-white shadow">
                {discount}% OFF
              </span>
            )}
            {/* Click to zoom hint */}
            <span className="absolute bottom-3 right-3 rounded-full bg-ink/50 px-2.5 py-1 text-[10px] font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
              Tap to zoom
            </span>
          </button>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-none pb-0.5">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    "relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-200",
                    activeImage === i
                      ? "border-grape-600 shadow-sm scale-100"
                      : "border-transparent opacity-60 hover:opacity-90"
                  )}
                >
                  <Image src={img} alt="" fill className="object-cover" sizes="72px" />
                </button>
              ))}
            </div>
          )}

          {/* Trust badges row */}
          <div className="mt-4 flex flex-wrap gap-3">
            <span className="flex items-center gap-1.5 rounded-lg bg-leaf-50 px-3 py-1.5 text-xs font-semibold text-leaf-700">
              <ShieldCheck size={13} /> Verified Decorators
            </span>
            <span className="flex items-center gap-1.5 rounded-lg bg-leaf-50 px-3 py-1.5 text-xs font-semibold text-leaf-700">
              <RefreshCcw size={13} /> Free Reschedule 24h
            </span>
            <span className="flex items-center gap-1.5 rounded-lg bg-marigold-50 px-3 py-1.5 text-xs font-semibold text-marigold-700">
              <MapPin size={13} /> {city}
            </span>
          </div>
        </div>

        {/* ════ RIGHT: product info + booking ════ */}
        <div className="flex flex-col gap-5 lg:col-span-7">

          {/* ── Title block ── */}
          <div>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {product.badges.map((b) => (
                    <span key={b} className="badge bg-marigold-400 text-ink">{b}</span>
                  ))}
                  <span className="badge bg-grape-100 text-grape-700">{product.category}</span>
                </div>
                <h1 className="font-display text-2xl font-bold leading-snug text-ink sm:text-3xl">
                  {product.name}
                </h1>
                <p className="mt-1.5 text-sm text-ink/55">{product.tagline}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => toggle(product.id, product.name)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/12 bg-white transition-all hover:border-punch-300 hover:bg-punch-50"
                  aria-label="Toggle wishlist"
                >
                  <Heart size={16} className={isWishlisted(product.id) ? "fill-punch-500 text-punch-500" : "text-ink/50"} />
                </button>
                <button
                  onClick={() => {
                    if (typeof navigator !== "undefined" && navigator.share) {
                      navigator.share({ title: product.name, url: window.location.href }).catch(() => { });
                    } else {
                      toast.success("Link copied!");
                    }
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/12 bg-white transition-all hover:bg-paper"
                  aria-label="Share"
                >
                  <Share2 size={16} className="text-ink/50" />
                </button>
              </div>
            </div>

            {/* Rating pill */}
            <a href="#tabs" className="mt-3 flex w-fit items-center gap-2 text-sm">
              <span className="flex items-center gap-1 rounded-full bg-leaf-50 px-2.5 py-1 font-bold text-leaf-700">
                <Star size={12} className="fill-leaf-600" /> {product.rating}
              </span>
              <span className="text-ink/45 hover:underline">{product.reviewCount} reviews</span>
            </a>
          </div>

          {/* ── Price block ── */}
          <div className="rounded-2xl bg-paper border border-ink/8 p-4">
            <div className="flex items-baseline gap-2.5">
              <span className="font-mono text-3xl font-bold text-ink">{formatPrice(product.price)}</span>
              {product.mrp > product.price && (
                <>
                  <span className="font-mono text-lg text-ink/35 line-through">{formatPrice(product.mrp)}</span>
                  <span className="rounded-full bg-punch-100 px-2.5 py-0.5 text-xs font-bold text-punch-600">
                    {discount}% off
                  </span>
                </>
              )}
            </div>
            {product.mrp > product.price && (
              <p className="mt-1 text-xs font-medium text-leaf-600">
                You save {formatPrice(product.mrp - product.price)} on this package
              </p>
            )}
            {/* City availability status */}
            <div className={cn(
              "mt-3 flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold",
              cityAvailability?.status === "available" && "bg-leaf-50 text-leaf-700",
              cityAvailability?.status === "limited" && "bg-marigold-50 text-marigold-700",
              (!cityAvailability || cityAvailability.status === "unavailable") && "bg-punch-50 text-punch-600"
            )}>
              <MapPin size={12} />
              {cityAvailability?.status === "available" && `Available in ${city} · Earliest slot ${cityAvailability.earliestSlot}`}
              {cityAvailability?.status === "limited" && `Limited slots in ${city} · ${cityAvailability.earliestSlot}`}
              {(!cityAvailability || cityAvailability.status === "unavailable") && `Not available in ${city} yet — contact us`}
            </div>
          </div>

          {/* ── What's included ── */}
          <div className="rounded-2xl border border-ink/8 p-5 bg-white shadow-sm">
            <p className="mb-4 text-sm font-semibold text-ink">What&apos;s included</p>
            <ul className="grid grid-cols-1 gap-y-3.5 sm:grid-cols-2 gap-x-6">
              {product.whatsIncluded.map((w) => (
                <li key={w} className="flex items-start gap-3 text-[13px] text-ink/70 leading-relaxed">
                  <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-leaf-50 text-leaf-500">
                    <Check size={10} strokeWidth={3} />
                  </div>
                  {w}
                </li>
              ))}
            </ul>
          </div>

          {/* ── Customizations ── */}
          {product.customizations.length > 0 && (
            <div className="rounded-2xl border border-ink/8 p-4 bg-paper/30">
              <p className="mb-4 text-sm font-semibold text-ink">Customize Your Setup</p>
              <div className="space-y-5">
                {product.customizations.map((c) => (
                  <div key={c.id}>
                    <label className="mb-2.5 block text-xs font-bold uppercase tracking-wider text-ink/40">{c.label}</label>
                    {c.type === "color" && c.choices && (
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-wrap gap-2.5">
                          {c.choices.map((choice) => {
                            const isActive = customizations[c.id] === choice;
                            return (
                              <button
                                type="button"
                                key={choice}
                                onClick={() => setCustomizations((s) => ({ ...s, [c.id]: choice }))}
                                className={cn(
                                  "relative flex flex-col items-center justify-center gap-2 rounded-[14px] border p-2.5 transition-all duration-200 hover:-translate-y-0.5 w-[76px] h-[86px]",
                                  isActive
                                    ? "border-grape-600 bg-grape-50 shadow-sm ring-1 ring-grape-600/20"
                                    : "border-ink/10 bg-white hover:border-grape-400 hover:shadow-sm"
                                )}
                              >
                                <div className="flex -space-x-1.5 pt-0.5">
                                  {getBalloonColors(choice).map((color, i) => (
                                    <BalloonIcon key={i} color={color} size={22} />
                                  ))}
                                </div>
                                <span className={cn("text-[10px] font-bold leading-tight text-center", isActive ? "text-grape-600" : "text-ink/60")}>{choice}</span>
                                {isActive && (
                                  <CheckCircle2 size={16} className="absolute -right-2 -top-2 text-white fill-grape-600 drop-shadow-sm" />
                                )}
                              </button>
                            );
                          })}

                          <button
                            type="button"
                            data-custom-picker-toggle
                            onClick={() => setShowColorPickerFor(showColorPickerFor === c.id ? null : c.id)}
                            className={cn(
                              "relative flex flex-col items-center justify-center gap-2 rounded-[14px] border p-2.5 transition-all duration-200 hover:-translate-y-0.5 min-w-[76px] h-[86px] px-3",
                              customizations[c.id]?.startsWith("Custom: ")
                                ? "border-grape-600 bg-grape-50 shadow-sm ring-1 ring-grape-600/20"
                                : "border-dashed border-ink/20 bg-white hover:border-grape-400 hover:bg-grape-50"
                            )}
                          >
                            {customizations[c.id]?.startsWith("Custom: ") ? (
                              <div className="flex -space-x-1.5 pt-0.5">
                                {getBalloonColors(customizations[c.id]).map((color, i) => (
                                  <BalloonIcon key={i} color={color} size={22} />
                                ))}
                              </div>
                            ) : (
                              <div className="flex -space-x-1.5 pt-0.5">
                                <BalloonIcon color="#ec4899" size={22} />
                                <BalloonIcon color="#3b82f6" size={22} />
                                <BalloonIcon color="#eab308" size={22} />
                              </div>
                            )}
                            <span className={cn("text-[10px] font-bold leading-tight text-center", customizations[c.id]?.startsWith("Custom: ") ? "text-grape-600" : "text-ink/60")}>
                              {customizations[c.id]?.startsWith("Custom: ") ? "Custom" : "Pick Your Mix"}
                            </span>
                            {customizations[c.id]?.startsWith("Custom: ") && (
                              <CheckCircle2 size={16} className="absolute -right-2 -top-2 text-white fill-grape-600 drop-shadow-sm" />
                            )}
                          </button>
                        </div>

                        <AnimatePresence>
                          {showColorPickerFor === c.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0, scale: 0.95 }}
                              animate={{ opacity: 1, height: "auto", scale: 1 }}
                              exit={{ opacity: 0, height: 0, scale: 0.95 }}
                              transition={{ duration: 0.2, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <CustomColorPicker
                                initialColors={
                                  customizations[c.id]?.startsWith("Custom: ")
                                    ? customizations[c.id].replace("Custom: ", "").split(" · ")
                                    : []
                                }
                                onClose={() => setShowColorPickerFor(null)}
                                onDone={(colors) => {
                                  setCustomizations((s) => ({ ...s, [c.id]: `Custom: ${colors.join(" · ")}` }));
                                  setShowColorPickerFor(null);
                                }}
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                    {c.type === "text" && (
                      <input
                        value={customizations[c.id] ?? ""}
                        onChange={(e) => setCustomizations((s) => ({ ...s, [c.id]: e.target.value }))}
                        placeholder={`e.g. "Happy 25th Ananya!"`}
                        className="w-full rounded-xl border border-transparent bg-ink/5 px-4 py-3.5 text-[13px] font-medium text-ink placeholder:text-ink/40 transition-all focus:border-grape-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-grape-600/10"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Date & Time Section ── */}
          <div className="relative rounded-2xl border border-ink/8 p-5 bg-white shadow-sm">
            <p className="mb-0.5 text-sm font-semibold text-ink">Choose Date & Time</p>
            <p className="mb-4 text-[13px] text-ink/50">When should we arrive to set up?</p>

            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-ink/40">Select Date</p>
            <div className="flex gap-2.5 overflow-x-auto scrollbar-none pb-2 pt-4 -mt-2 -mx-2 px-2 snap-x snap-mandatory">
              {!isMounted ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-[92px] w-[72px] shrink-0 rounded-[14px] border border-ink/5 bg-paper/50 animate-pulse snap-start" />
                ))
              ) : (
                <>
                  {DATE_STRIP.map((d) => (
                    <button
                      key={d.iso}
                      onClick={() => setEventDate(d.iso)}
                      className={cn(
                        "group relative flex h-[92px] w-[72px] shrink-0 snap-start flex-col items-center justify-center rounded-[14px] border transition-all duration-200",
                        eventDate === d.iso
                          ? "border-grape-600 bg-grape-600 text-white shadow-md ring-2 ring-grape-600/20 ring-offset-1"
                          : "border-ink/10 bg-white text-ink hover:-translate-y-0.5 hover:border-grape-400 hover:shadow-sm"
                      )}
                    >
                      {d.isFast && (
                        <span className={cn(
                          "absolute -top-2.5 flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[8.5px] font-extrabold tracking-widest shadow-sm",
                          eventDate === d.iso ? "bg-white text-punch-600" : "bg-gradient-to-r from-punch-500 to-punch-600 text-white"
                        )}>
                          <Zap size={9} className={eventDate === d.iso ? "text-punch-500 fill-punch-500" : "text-white fill-white"} />
                          FAST
                        </span>
                      )}
                      <span className={cn("text-[9px] font-bold uppercase tracking-wider", eventDate === d.iso ? "opacity-90" : "text-ink/40")}>{d.dayLabel}</span>
                      <span className={cn("text-[26px] font-extrabold leading-none my-1", eventDate === d.iso ? "text-white" : "text-ink/90")}>{d.dateNum}</span>
                      <span className={cn("text-[9px] font-bold uppercase tracking-wider", eventDate === d.iso ? "opacity-90" : "text-ink/40")}>{d.monthLabel}</span>
                    </button>
                  ))}

                  <button
                    onClick={() => setShowCalendar((s) => !s)}
                    className="flex h-[92px] w-[72px] shrink-0 snap-start flex-col items-center justify-center rounded-[14px] border-2 border-dashed border-ink/15 bg-paper/30 text-ink/50 transition-all duration-200 hover:border-grape-400 hover:bg-grape-50 hover:text-grape-700"
                  >
                    <CalendarDays size={20} className="mb-1.5 opacity-70" />
                    <span className="text-[9px] font-bold uppercase tracking-widest">More<br />Dates</span>
                  </button>
                </>
              )}
            </div>

            <div
              className={cn(
                "absolute right-4 top-[185px] z-50 shadow-2xl rounded-2xl bg-white transition-all duration-300 origin-top",
                showCalendar
                  ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
              )}
            >
              <DatePicker
                value={eventDate}
                onChange={(d) => {
                  setEventDate(d);
                  setShowCalendar(false);
                }}
                inline
              />
            </div>

            <div className="mt-5 mb-3 flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Select Time</p>
              <p className="flex items-center gap-1.5 text-[11px] font-semibold text-leaf-700 bg-leaf-50 px-2 py-0.5 rounded-full border border-leaf-100"><Clock size={11} strokeWidth={2.5} /> 2-hr window</p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {TIME_SLOTS.map((t) => (
                <button
                  key={t}
                  onClick={() => setEventTime(t)}
                  className={cn(
                    "rounded-[12px] border py-2.5 text-[12px] font-bold transition-all duration-150",
                    eventTime === t
                      ? "border-grape-600 bg-grape-50 text-grape-700 ring-1 ring-grape-600/30 shadow-sm"
                      : "border-ink/10 bg-white text-ink/70 hover:border-grape-400 hover:shadow-sm hover:text-grape-700"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="mt-5 rounded-xl bg-leaf-50/50 p-3 border border-leaf-100/50">
              <p className="flex items-center gap-2.5 text-[11px] font-medium text-leaf-800">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-leaf-100 text-leaf-600">
                  <Check size={12} strokeWidth={3} />
                </span>
                <span>Our team <strong className="font-bold">arrives & completes setup</strong> within this window.</span>
              </p>
            </div>
          </div>

          {/* ── Add-ons ── */}
          {product.addOns.length > 0 && (
            <div className="rounded-2xl border border-ink/8 p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-ink">
                  Enhance Your Setup <span className="font-normal text-ink/40">(optional)</span>
                </p>
                <div className="flex items-center gap-2">
                  {selectedAddOns.length > 0 && (
                    <span className="rounded-full bg-grape-100 px-2.5 py-0.5 text-xs font-semibold text-grape-700">
                      {selectedAddOns.length} selected
                    </span>
                  )}
                  {/* Carousel arrows */}
                  <button
                    type="button"
                    onClick={() => scrollAddOns("left")}
                    aria-label="Scroll left"
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-ink/12 bg-white text-ink/50 transition-all hover:border-grape-400 hover:text-grape-600 hover:shadow-sm"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollAddOns("right")}
                    aria-label="Scroll right"
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-ink/12 bg-white text-ink/50 transition-all hover:border-grape-400 hover:text-grape-600 hover:shadow-sm"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
              {/* Carousel track container */}
              <div className="relative -mx-2 px-2">
                <div
                  ref={addOnsScrollRef}
                  className="flex gap-3 overflow-x-auto scrollbar-none pb-3 pt-2 cursor-grab active:cursor-grabbing px-1"
                  style={{ scrollBehavior: "auto" }}
                  onMouseDown={onAddOnsMouseDown}
                  onMouseMove={onAddOnsMouseMove}
                  onMouseUp={onAddOnsMouseUp}
                  onMouseLeave={onAddOnsMouseUp}
                >
                  {product.addOns.map((a) => {
                    const checked = selectedAddOns.includes(a.id);
                    return (
                      <div
                        key={a.id}
                        className={cn(
                          "group relative flex w-[140px] shrink-0 flex-col overflow-hidden rounded-[16px] border bg-white transition-all duration-200",
                          checked
                            ? "border-grape-600 shadow-md ring-1 ring-grape-600"
                            : "border-ink/10 hover:border-grape-400 hover:shadow-sm"
                        )}
                      >
                        {/* Image */}
                        <div
                          className="relative h-[110px] w-full overflow-hidden bg-paper cursor-pointer"
                          onClick={() => { if (!addOnsDragMoved.current) setSelectedAddOns((s) => checked ? s.filter((id) => id !== a.id) : [...s, a.id]); }}
                        >
                          {a.image ? (
                            <Image
                              src={a.image}
                              alt={a.name}
                              fill
                              className={cn(
                                "object-cover transition-transform duration-500",
                                !checked && "group-hover:scale-105"
                              )}
                              sizes="140px"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-2xl">🎉</div>
                          )}

                          {/* Selected Overlay */}
                          {checked && (
                            <div className="absolute inset-0 flex items-center justify-center bg-grape-900/20 backdrop-blur-[1px]">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm">
                                <Check size={18} strokeWidth={3.5} className="text-grape-600" />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Info & Add Button */}
                        <div className="flex flex-1 flex-col p-2.5">
                          <p className="mb-2 line-clamp-2 text-[12px] font-bold leading-snug text-ink">{a.name}</p>

                          <div className="mt-auto pt-1">
                            <button
                              type="button"
                              onClick={() => { if (!addOnsDragMoved.current) setSelectedAddOns((s) => checked ? s.filter((id) => id !== a.id) : [...s, a.id]); }}
                              className={cn(
                                "flex w-full items-center justify-center gap-1.5 rounded-[10px] py-1.5 text-[11px] font-bold transition-all",
                                checked
                                  ? "bg-grape-50 text-grape-700"
                                  : "bg-paper text-ink/70 hover:bg-grape-50 hover:text-grape-600"
                              )}
                            >
                              {checked ? (
                                <>
                                  <Check size={12} strokeWidth={3} /> Added
                                </>
                              ) : (
                                <>
                                  <Plus size={12} strokeWidth={3} /> {formatPrice(a.price)}
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {/* Fade edges to hint at scroll */}
                <div className="pointer-events-none absolute bottom-0 left-0 top-0 w-6 bg-gradient-to-r from-white to-transparent" />
                <div className="pointer-events-none absolute bottom-0 right-0 top-0 w-8 bg-gradient-to-l from-white to-transparent" />
              </div>
            </div>
          )}

          {/* ── Checkout Summary (Sticky Bottom Bar) ── */}
          <div className="sticky bottom-4 z-40 mt-8 overflow-hidden rounded-2xl border border-ink/10 bg-white/95 backdrop-blur-md shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] transition-all lg:static lg:bottom-auto lg:z-auto lg:shadow-card lg:bg-white">
            <div className="p-5">
              {/* Add-ons Breakdown (only show if selected) */}
              {selectedAddOns.length > 0 && (
                <div className="mb-4 space-y-2 border-b border-dashed border-ink/10 pb-4 text-sm text-ink/70">
                  <div className="flex justify-between">
                    <span>Base Package</span>
                    <span className="font-mono">{formatPrice(product.price)}</span>
                  </div>
                  <div className="flex justify-between text-grape-600 font-medium">
                    <span>Add-ons ({selectedAddOns.length})</span>
                    <span className="font-mono">+{formatPrice(addOnsTotal)}</span>
                  </div>
                </div>
              )}

              {/* Price Row */}
              <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                <div>
                  <p className="text-sm font-bold text-ink">Total Amount</p>
                  <p className="text-[11px] font-medium text-ink/40">inclusive of all taxes</p>
                </div>
                <div className="flex flex-col sm:items-end">
                  <div className="flex items-center gap-2">
                    {product.mrp > product.price && (
                      <span className="font-mono text-sm text-ink/40 line-through">{formatPrice(product.mrp + addOnsTotal)}</span>
                    )}
                    <p className="font-mono text-[32px] font-extrabold leading-none tracking-tight text-ink">{formatPrice(total)}</p>
                  </div>
                  {product.mrp > product.price && (
                    <span className="mt-1.5 inline-block w-fit rounded-full border border-leaf-200 bg-leaf-50 px-2 py-0.5 text-[10px] font-bold text-leaf-700">
                      You save {formatPrice(product.mrp - product.price)}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <WhatsAppCTA
                  variant="button"
                  label="WhatsApp Us"
                  className="w-full flex items-center justify-center gap-2 !rounded-xl !border-2 !border-ink/10 !bg-white !py-3.5 !text-[14px] !font-bold !text-ink hover:!border-ink/20 hover:!bg-paper transition-all sm:!text-base shadow-sm"
                  productName={product.name}
                  city={city}
                  date={eventDate}
                  time={eventTime}
                  customization={customizationSummary}
                />
                <button
                  onClick={handleBookNow}
                  className="flex items-center justify-center gap-2 rounded-xl bg-grape-600 py-3.5 text-[14px] font-bold text-white shadow-[0_8px_16px_-6px_rgba(106,76,156,0.4)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_20px_-6px_rgba(106,76,156,0.5)] hover:bg-grape-700 active:translate-y-0 active:shadow-none sm:text-base"
                >
                  <span>Book Now</span>
                  <ChevronRight size={16} strokeWidth={3} />
                </button>
              </div>
            </div>

            {/* Trust Footer */}
            <div className="border-t border-ink/5 bg-paper/50 px-5 py-3">
              <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] font-bold text-ink/60 sm:gap-4">
                <div className="flex items-center gap-1.5 rounded-full border border-ink/5 bg-white px-2.5 py-1 shadow-sm">
                  <ShieldCheck size={14} className="text-leaf-500" strokeWidth={2.5} />
                  <span>Secure Booking</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full border border-ink/5 bg-white px-2.5 py-1 shadow-sm">
                  <Heart size={14} className="text-punch-500" strokeWidth={2.5} />
                  <span>Satisfaction Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══ Setup + Cancellation info ══ */}
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-ink/8 p-4">
          <p className="mb-1.5 flex items-center gap-2 text-sm font-semibold">
            <Clock size={14} className="text-grape-600" /> Setup Information
          </p>
          <p className="text-sm text-ink/60">{product.setupInfo}</p>
          <p className="mt-2 text-xs text-ink/40">Est. setup time: {product.setupDurationMins} minutes</p>
        </div>
        <div className="rounded-2xl border border-ink/8 p-4">
          <p className="mb-1.5 flex items-center gap-2 text-sm font-semibold">
            <RefreshCcw size={14} className="text-grape-600" /> Cancellation & Rescheduling
          </p>
          <p className="text-sm text-ink/60">{product.cancellationInfo}</p>
        </div>
      </div>

      {/* ══ Tabbed bottom section ══ */}
      <div className="mt-8" id="tabs">
        {/* Tab bar */}
        <div className="flex border-b border-ink/10">
          {(["reviews", "faqs", "similar"] as const).map((tab) => {
            const LABELS: Record<TabKey, string> = {
              reviews: `Reviews (${product.reviewCount})`,
              faqs: "FAQs",
              similar: "Similar Packages",
            };
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "-mb-px border-b-2 px-4 py-3 text-sm font-semibold transition-colors",
                  activeTab === tab
                    ? "border-grape-600 text-grape-700"
                    : "border-transparent text-ink/45 hover:text-ink"
                )}
              >
                {LABELS[tab]}
              </button>
            );
          })}
        </div>

        {/* Reviews tab */}
        {activeTab === "reviews" && (
          <div className="mt-6 space-y-4" id="reviews">
            {/* Rating summary */}
            <div className="flex items-center gap-5 rounded-2xl border border-ink/8 p-5">
              <div className="text-center">
                <p className="font-display text-5xl font-bold text-ink">{product.rating}</p>
                <div className="mt-1.5 flex justify-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < Math.round(product.rating) ? "fill-marigold-400 text-marigold-400" : "text-ink/15 fill-ink/15"}
                    />
                  ))}
                </div>
                <p className="mt-1 text-xs text-ink/40">{product.reviewCount} reviews</p>
              </div>
              <div className="flex-1 space-y-1.5">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = product.reviews.filter((r) => Math.round(r.rating) === star).length;
                  const pct = product.reviews.length > 0 ? (count / product.reviews.length) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-2 text-[11px] font-bold text-ink/60">
                      <span className="w-3 text-right">{star}</span>
                      <Star size={10} className="fill-marigold-400 text-marigold-400 shrink-0" />
                      <div className="flex-1 rounded-full bg-ink/5 h-2 overflow-hidden shadow-inner">
                        <div className="h-full rounded-full bg-marigold-400 transition-all duration-500 ease-out" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-4 font-semibold text-ink/40">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Review cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {product.reviews.map((r) => (
                <div key={r.id} className="rounded-2xl border border-ink/8 p-5 bg-white shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-grape-100 text-[15px] font-bold text-grape-700">
                        {r.author.charAt(0)}
                      </span>
                      <div>
                        <p className="text-sm font-bold text-ink">{r.author}</p>
                        <p className="text-[11px] font-medium text-ink/40 mt-0.5">
                          {r.city} · {new Date(r.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                    </div>
                    <span className="flex shrink-0 items-center gap-1 rounded-full bg-leaf-50 border border-leaf-100 px-2 py-1 text-[11px] font-bold text-leaf-700">
                      {r.rating} <Star size={10} className="fill-leaf-600" />
                    </span>
                  </div>
                  <p className="mt-4 text-[13px] leading-relaxed text-ink/70">{r.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQs tab */}
        {activeTab === "faqs" && (
          <div className="mt-6 space-y-2">
            {product.faqs.map((f, i) => (
              <FaqItem key={i} q={f.q} a={f.a} />
            ))}
          </div>
        )}

        {/* Similar tab */}
        {activeTab === "similar" && related.length > 0 && (
          <div className="mt-6">
            <ProductRail title="" products={related} />
          </div>
        )}
      </div>

      {/* ── Recently Viewed ── */}
      {recentProducts.length > 0 && (
        <div className="mt-6 border-t border-ink/8">
          <ProductRail title="Recently Viewed" products={recentProducts} />
        </div>
      )}

      {/* ── Lightbox ── */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/90 p-6"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            className="absolute right-5 top-5 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label="Close lightbox"
          >
            <X size={22} />
          </button>
          <div className="relative h-full max-h-[85vh] w-full max-w-3xl">
            <Image src={product.images[activeImage]} alt={product.name} fill className="object-contain" sizes="100vw" />
          </div>
        </div>
      )}

      {/* Floating WhatsApp */}
      <WhatsAppCTA
        variant="floating"
        productName={product.name}
        city={city}
        date={eventDate}
        time={eventTime}
        customization={customizationSummary}
      />
    </div>
  );
}

/** Self-contained FAQ accordion item */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={cn(
      "rounded-2xl border transition-colors",
      open ? "border-grape-200 bg-grape-50/50" : "border-ink/8 bg-white"
    )}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-4 text-left"
      >
        <span className="pr-4 text-sm font-semibold text-ink">{q}</span>
        {open
          ? <ChevronUp size={16} className="shrink-0 text-grape-600" />
          : <ChevronDown size={16} className="shrink-0 text-ink/40" />
        }
      </button>
      {open && (
        <p className="px-4 pb-4 text-sm leading-relaxed text-ink/60">{a}</p>
      )}
    </div>
  );
}
