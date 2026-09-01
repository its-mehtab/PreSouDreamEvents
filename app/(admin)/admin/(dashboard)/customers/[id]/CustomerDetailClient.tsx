"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { adminToggleCustomerStatus } from "@/lib/actions/admin";
import { toast } from "sonner";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  ChevronRight,
  User,
  MapPin,
  Pencil,
  MoreHorizontal,
  Star,
  Heart,
  Crown,
  MessageSquare,
  CreditCard,
  Bell,
  Clock,
  Ban,
} from "lucide-react";
import { format } from "date-fns";
import { formatPrice } from "@/lib/utils";
import StatusBadge from "@/components/admin/StatusBadge";
import Link from "next/link";
import Image from "next/image";

export default function CustomerDetailClient({ customer }: { customer: any }) {
  const router = useRouter();
  const [showAllBookings, setShowAllBookings] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleToggleStatus = () => {
    startTransition(async () => {
      try {
        await adminToggleCustomerStatus(customer.id, !customer.disabled);
        toast.success(customer.disabled ? "Customer enabled successfully" : "Customer disabled successfully");
      } catch (error) {
        toast.error("Failed to update status");
      }
    });
  };

  const totalSpent = customer.bookings
    .filter((b: any) => b.status !== "CANCELLED")
    .reduce((sum: number, b: any) => sum + b.totalPrice, 0);

  // Mock calculations for missing data
  const avgRating =
    customer.reviews?.length > 0
      ? (
          customer.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) /
          customer.reviews.length
        ).toFixed(1)
      : "—";

  const firstBooking = customer.bookings?.length > 0 ? customer.bookings[customer.bookings.length - 1] : null;
  const firstReview = customer.reviews?.length > 0 ? customer.reviews[customer.reviews.length - 1] : null;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="rounded-xl border border-gray-200 bg-white p-2.5 text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Customer Details</h1>
            <p className="text-xs text-gray-500 mt-0.5">View complete customer information, bookings and activity.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a 
            href={`https://wa.me/${customer.phone.replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-2 text-xs font-medium text-white hover:bg-[#20b858] shadow-sm transition-all"
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>
            Send WhatsApp
          </a>
          <button 
            onClick={handleToggleStatus}
            disabled={isPending}
            className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-medium shadow-sm transition-all ${
              customer.disabled 
                ? "border-gray-200 bg-white text-gray-700 hover:bg-gray-50" 
                : "border-red-200 bg-white text-red-600 hover:bg-red-50"
            }`}
          >
            <Ban size={14} /> {isPending ? "Updating..." : (customer.disabled ? "Enable Customer" : "Disable Customer")}
          </button>
        </div>
      </div>

      {/* Top Profile & Stats Card */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col lg:flex-row gap-8">
        {/* Left: Profile Info */}
        <div className="flex gap-5 lg:w-[35%] lg:border-r lg:border-gray-100 lg:pr-8">
          <div className="relative shrink-0">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-grape-100 text-2xl font-bold text-grape-700">
              {(customer.name || customer.phone).charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="flex-1 pt-1">
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-lg font-bold text-gray-900">{customer.name || "Unknown"}</h2>
              {customer.disabled ? (
                <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-red-700">
                  Disabled
                </span>
              ) : (
                <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-green-700">
                  Active
                </span>
              )}
            </div>
            <div className="space-y-2.5 text-sm text-gray-500">
              <p className="flex items-center gap-2.5">
                <Phone size={14} className="text-gray-400" /> +91 {customer.phone.replace('+91', '').trim()}
              </p>
              {customer.email && (
                <p className="flex items-center gap-2.5">
                  <Mail size={14} className="text-gray-400" /> {customer.email}
                </p>
              )}
              <p className="flex items-center gap-2.5">
                <Calendar size={14} className="text-gray-400" /> Joined on {format(new Date(customer.createdAt), "dd MMM, yyyy")}
              </p>
              <p className="flex items-center gap-2.5">
                <MapPin size={14} className="text-gray-400" /> {customer.address || "Kolkata, West Bengal"}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Stats & Banner */}
        <div className="flex-1 flex flex-col justify-between">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="flex flex-col items-center justify-center">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <Calendar size={18} />
              </div>
              <p className="text-xl font-bold text-gray-900">{customer.bookings.length}</p>
              <p className="text-[11px] font-medium text-gray-400 mt-0.5">Total Bookings</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <span className="font-sans text-lg font-bold">₹</span>
              </div>
              <p className="text-xl font-bold text-gray-900">{formatPrice(totalSpent).replace('₹', '')}</p>
              <p className="text-[11px] font-medium text-gray-400 mt-0.5">Total Spent</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                <Star size={18} className="fill-orange-500/20" />
              </div>
              <p className="text-xl font-bold text-gray-900">{avgRating}</p>
              <p className="text-[11px] font-medium text-gray-400 mt-0.5">Avg. Rating</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
                <Heart size={18} className="fill-blue-500/20" />
              </div>
              <p className="text-xl font-bold text-gray-900">6</p>
              <p className="text-[11px] font-medium text-gray-400 mt-0.5">Wishlist Items</p>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-purple-50/50 py-2.5 text-xs font-medium text-gray-600 border border-purple-100">
            <Crown size={14} className="text-yellow-500 fill-yellow-500" /> 
            <span className="font-bold text-purple-900">Top Customer</span> 
            <span className="text-gray-400 mx-1">|</span>
            Among top 10% customers by spending
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Bookings & Info) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Booking History */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-bold text-gray-900">Booking History</h3>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-grape-100 text-[10px] font-bold text-grape-700">
                  {customer.bookings.length}
                </span>
              </div>
              <Link href="/admin/bookings" className="text-xs font-bold text-grape-600 hover:text-grape-700 flex items-center gap-1 transition-colors">
                View All Bookings <ChevronRight size={14} />
              </Link>
            </div>

            <div className="space-y-4">
              {customer.bookings.length === 0 && (
                <div className="py-8 text-center text-xs text-gray-400">No bookings found.</div>
              )}
              {(showAllBookings ? customer.bookings : customer.bookings.slice(0, 3)).map((booking: any) => (
                <Link
                  key={booking.id}
                  href={`/admin/bookings/${booking.id}`}
                  className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 p-4 hover:border-grape-200 hover:shadow-sm hover:bg-grape-50/30 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative h-14 w-14 overflow-hidden rounded-lg bg-gray-100 shrink-0">
                      {booking.items?.[0]?.product?.images?.[0] ? (
                        <Image
                          src={booking.items[0].product.images[0]}
                          alt="Product"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <Calendar size={20} className="text-gray-300" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 group-hover:text-grape-700 transition-colors">
                        {booking.items?.[0]?.product?.name ?? "Custom Booking"}
                      </h4>
                      <p className="mt-1 text-xs text-gray-500 flex items-center gap-3">
                        <span className="flex items-center gap-1"><Calendar size={11} /> {format(new Date(booking.eventDate), "dd MMM, yyyy")}</span>
                        <span className="flex items-center gap-1"><MapPin size={11} /> {booking.city?.name || "Kolkata"}</span>
                      </p>
                      <p className="mt-1 text-[10px] text-gray-400 font-mono uppercase">Booking ID: #{booking.id.slice(-8)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-right">
                    <div className="flex flex-col items-end gap-1.5">
                      <StatusBadge status={booking.status} />
                      <p className="text-sm font-bold text-gray-900">{formatPrice(booking.totalPrice)}</p>
                    </div>
                    <ChevronRight size={18} className="text-gray-300 group-hover:text-grape-600 transition-colors" />
                  </div>
                </Link>
              ))}
              {customer.bookings.length > 3 && !showAllBookings && (
                <button 
                  onClick={() => setShowAllBookings(true)}
                  className="w-full py-2 text-xs font-semibold text-gray-500 hover:text-gray-800 flex items-center justify-center gap-1 transition-colors"
                >
                  Show more <ChevronRight size={14} className="rotate-90" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (Timeline & Notes) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Customer Timeline */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-6">Customer Timeline</h3>
            <div className="relative pl-6 space-y-8 before:absolute before:inset-y-2 before:left-2.5 before:w-0.5 before:bg-gray-100">
              
              {/* Account Created */}
              <div className="relative">
                <div className="absolute -left-[31.5px] top-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-green-100 text-green-600">
                  <User size={12} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Account Created</h4>
                  <p className="mt-1 text-[11px] text-gray-500">{format(new Date(customer.createdAt), "dd MMM, yyyy 'at' hh:mm a")}</p>
                </div>
              </div>

              {/* First Booking */}
              {firstBooking && (
                <div className="relative">
                  <div className="absolute -left-[31.5px] top-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-grape-100 text-grape-600">
                    <Calendar size={12} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 flex justify-between">
                      First Booking 
                      <span className="text-grape-600 font-medium text-[10px] truncate max-w-[120px]">
                        {firstBooking.items?.[0]?.product?.name}
                      </span>
                    </h4>
                    <p className="mt-1 text-[11px] text-gray-500">{format(new Date(firstBooking.createdAt), "dd MMM, yyyy 'at' hh:mm a")}</p>
                  </div>
                </div>
              )}

              {/* First Review */}
              {firstReview && (
                <div className="relative">
                  <div className="absolute -left-[31.5px] top-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-blue-100 text-blue-500">
                    <Star size={12} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 flex justify-between">
                      First Review 
                      <span className="text-gray-500 font-medium text-[10px]">Rated {firstReview.rating} Stars</span>
                    </h4>
                    <p className="mt-1 text-[11px] text-gray-500">{format(new Date(firstReview.createdAt), "dd MMM, yyyy 'at' hh:mm a")}</p>
                  </div>
                </div>
              )}

              {/* Latest Booking */}
              <div className="relative">
                <div className="absolute -left-[31.5px] top-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-orange-100 text-orange-500">
                  <Clock size={12} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Total {customer.bookings.length} Bookings</h4>
                  {customer.bookings.length > 0 && (
                     <p className="mt-1 text-[11px] text-gray-500">
                        Latest: {format(new Date(customer.bookings[0].createdAt), "dd MMM, yyyy 'at' hh:mm a")}
                     </p>
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
