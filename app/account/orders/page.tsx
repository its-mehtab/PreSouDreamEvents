"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Circle, Package, MessageCircle, Phone, RefreshCcw } from "lucide-react";
import { getOrders, deriveStatus } from "@/lib/orders";
import { Order, OrderStatus } from "@/lib/types";
import { formatPrice, whatsappLink, cn } from "@/lib/utils";

const STEPS: OrderStatus[] = ["Confirmed", "Decorator Assigned", "On the Way", "Setup Started", "Completed"];

export default function OrdersTrackingPage() {
  return (
    <Suspense fallback={<div className="container-app py-24 text-center text-ink/50">Loading bookings…</div>}>
      <OrdersTrackingContent />
    </Suspense>
  );
}

function OrdersTrackingContent() {
  const params = useSearchParams();
  const highlightId = params.get("id");
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrders(getOrders());
  }, []);

  if (orders.length === 0) {
    return (
      <div className="container-app flex flex-col items-center gap-3 py-24 text-center">
        <Package size={36} className="text-ink/25" />
        <p className="font-display text-xl font-semibold">No bookings yet</p>
        <p className="text-sm text-ink/50">Once you book a decoration, you can track its status here.</p>
        <Link href="/shop" className="btn-primary mt-1">Browse Decorations</Link>
      </div>
    );
  }

  return (
    <div className="container-app py-6">
      <h1 className="font-display text-2xl font-bold sm:text-3xl">Track Your Bookings</h1>
      <p className="mt-1 text-sm text-ink/50">Live status for every decoration booking you&apos;ve made.</p>

      <div className="mt-6 space-y-6">
        {orders.map((order) => {
          const currentStatus = deriveStatus(order);
          const currentIdx = STEPS.indexOf(currentStatus);
          return (
            <div
              key={order.id}
              className={cn(
                "rounded-2xl border bg-white p-5",
                highlightId === order.id ? "border-grape-500 ring-2 ring-grape-100" : "border-ink/10"
              )}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-dashed border-ink/15 pb-4">
                <div>
                  <p className="ticket-tag text-base font-bold text-grape-700">{order.id}</p>
                  <p className="text-xs text-ink/45">
                    Placed {new Date(order.placedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <span className="badge bg-leaf-50 text-leaf-600">{currentStatus}</span>
              </div>

              <div className="flex items-center gap-3 py-3 overflow-x-auto">
                {order.items.map((item, i) => (
                  <div key={i} className="flex shrink-0 items-center gap-2">
                    {item.image && (
                      <div className="relative h-10 w-10 overflow-hidden rounded-lg">
                        <Image src={item.image} alt={item.productName} fill className="object-cover" sizes="40px" />
                      </div>
                    )}
                    <span className="text-xs font-medium text-ink/70">{item.productName}</span>
                  </div>
                ))}
              </div>

              {/* Status stepper */}
              <div className="my-4 flex items-center">
                {STEPS.map((step, i) => (
                  <div key={step} className="flex flex-1 items-center last:flex-initial">
                    <div className="flex flex-col items-center gap-1.5">
                      {i <= currentIdx ? (
                        <CheckCircle2 size={20} className="text-leaf-500" />
                      ) : (
                        <Circle size={20} className="text-ink/20" />
                      )}
                      <span className={cn("w-16 text-center text-[10px] font-medium leading-tight", i <= currentIdx ? "text-ink/70" : "text-ink/30")}>
                        {step}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className={cn("h-0.5 flex-1", i < currentIdx ? "bg-leaf-500" : "bg-ink/10")} />
                    )}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 border-t border-dashed border-ink/15 pt-4 text-sm sm:grid-cols-4">
                <div><p className="text-xs text-ink/45">Location</p><p className="font-medium">{order.city} · {order.venue}</p></div>
                <div><p className="text-xs text-ink/45">Date & Time</p><p className="font-medium">{order.eventDate} · {order.eventTime}</p></div>
                <div><p className="text-xs text-ink/45">Total</p><p className="font-mono font-bold">{formatPrice(order.total)}</p></div>
                <div className="flex items-end gap-2">
                  <a href={whatsappLink(`Hi Occasio! I'd like to reschedule booking ${order.id}.`)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs font-semibold text-grape-700 hover:underline">
                    <RefreshCcw size={12} /> Reschedule
                  </a>
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                <a href={whatsappLink(`Hi Occasio! I need help with booking ${order.id}.`)} target="_blank" rel="noopener noreferrer" className="btn-secondary !py-2 text-xs">
                  <MessageCircle size={14} /> WhatsApp
                </a>
                <a href="tel:+919999999999" className="btn-secondary !py-2 text-xs">
                  <Phone size={14} /> Call Support
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
