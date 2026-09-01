"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { adminUpdateBookingStatus } from "@/lib/actions/admin";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import StatusBadge from "@/components/admin/StatusBadge";
import { ArrowLeft, Calendar, MapPin, Home, User, Phone, Mail, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import { motion } from "motion/react";
import { Select } from "@/components/ui/Select";

const STATUS_PROGRESSION = [
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "DECORATOR_ASSIGNED", label: "Decorator Assigned" },
  { value: "ON_THE_WAY", label: "On the Way" },
  { value: "SETUP_STARTED", label: "Setup Started" },
  { value: "COMPLETED", label: "Completed" },
];

export default function BookingDetailClient({ booking }: { booking: any }) {
  const router = useRouter();
  const [status, setStatus] = useState(booking.status);
  const [isPending, startTransition] = useTransition();

  async function updateStatus(newStatus: string) {
    startTransition(async () => {
      const res = await adminUpdateBookingStatus(booking.id, newStatus as any);
      if (res.success) {
        setStatus(newStatus);
        toast.success("Status updated");
      } else {
        toast.error("Failed to update status");
      }
    });
  }

  const currentIdx = STATUS_PROGRESSION.findIndex((s) => s.value === status);
  const isCancelled = status === "CANCELLED";

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="rounded-xl p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900/70 transition-colors">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">Booking #{booking.id.slice(-8).toUpperCase()}</h1>
          <p className="text-sm text-gray-400">{format(new Date(booking.createdAt), "dd MMM yyyy, HH:mm")}</p>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Status Progression */}
      {!isCancelled && (
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
          <p className="mb-5 text-xs font-semibold uppercase tracking-wide text-gray-400">Status Progression</p>
          <div className="flex items-center gap-0">
            {STATUS_PROGRESSION.map((s, i) => {
              const isDone = i <= currentIdx;
              const isNext = i === currentIdx + 1;
              return (
                <div key={s.value} className="flex flex-1 flex-col items-center">
                  <div className="flex w-full items-center">
                    {i > 0 && (
                      <div className={`h-0.5 flex-1 transition-colors ${isDone ? "bg-grape-600" : "bg-gray-200"}`} />
                    )}
                    <button
                      onClick={() => !isDone && updateStatus(s.value)}
                      disabled={isPending || isDone}
                      className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all ${
                        isDone ? "bg-grape-600 text-white" : isNext ? "border-2 border-grape-600/50 bg-grape-50 text-grape-400 hover:bg-grape-600/20 cursor-pointer" : "border border-gray-200 bg-gray-100 text-gray-500"
                      }`}
                    >
                      {isDone ? <CheckCircle2 size={16} /> : <span className="text-[10px] font-bold">{i + 1}</span>}
                    </button>
                    {i < STATUS_PROGRESSION.length - 1 && (
                      <div className={`h-0.5 flex-1 transition-colors ${i < currentIdx ? "bg-grape-600" : "bg-gray-200"}`} />
                    )}
                  </div>
                  <p className={`mt-2 text-center text-[10px] font-medium ${isDone ? "text-grape-700" : "text-gray-500"}`}>
                    {s.label}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="mt-5 flex items-center gap-3">
            <div className="flex-1">
              <Select
                value={status}
                onChange={updateStatus}
                options={[...STATUS_PROGRESSION.map((s) => s.value), "CANCELLED"].map((s) => ({ label: s.replace(/_/g, " "), value: s }))}
              />
            </div>
            {isPending && <span className="text-xs text-gray-400 animate-pulse">Updating…</span>}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Customer Info */}
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Customer</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User size={14} className="text-gray-500 shrink-0" />
              {booking.user.name || "Name not set"}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone size={14} className="text-gray-500 shrink-0" />
              {booking.user.phone}
            </div>
            {booking.user.email && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail size={14} className="text-gray-500 shrink-0" />
                {booking.user.email}
              </div>
            )}
          </div>
        </div>

        {/* Event Info */}
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Event Details</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar size={14} className="text-gray-500 shrink-0" />
              {format(new Date(booking.eventDate), "dd MMM yyyy")} at {booking.eventTime}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin size={14} className="text-gray-500 shrink-0" />
              {booking.city.name}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Home size={14} className="text-gray-500 shrink-0" />
              {booking.venue}
            </div>
            {booking.coupon && (
              <div className="mt-2 rounded-lg bg-leaf-500/10 px-3 py-2 text-xs text-leaf-400">
                Coupon: {booking.coupon.code} ({booking.coupon.discountPct ? `${booking.coupon.discountPct}% off` : `₹${booking.coupon.discountAmt} off`})
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Order Items</p>
        <div className="space-y-2">
          {booking.items.map((item: any) => (
            <div key={item.id} className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                {item.product?.images?.[0] && (
                  <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" sizes="48px" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-700 truncate">{item.product?.name}</p>
                <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                {item.customizations && Object.keys(item.customizations).length > 0 && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    {Object.entries(item.customizations).map(([k, v]) => `${k}: ${v}`).join(" · ")}
                  </p>
                )}
              </div>
              <p className="shrink-0 text-sm font-semibold text-gray-600">{formatPrice(item.priceAtBooking)}</p>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
          <span className="text-sm text-gray-500">Total</span>
          <span className="text-lg font-bold text-gray-900">{formatPrice(booking.totalPrice)}</span>
        </div>
      </div>
    </div>
  );
}
