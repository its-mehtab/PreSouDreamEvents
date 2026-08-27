"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Phone, MessageCircle, Package } from "lucide-react";
import { getOrder } from "@/lib/orders";
import { Order } from "@/lib/types";
import { formatPrice, whatsappLink } from "@/lib/utils";
import { motion } from "motion/react";

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="container-app py-24 text-center text-ink/50">Loading your booking…</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}

function ConfirmationContent() {
  const params = useSearchParams();
  const orderId = params.get("orderId");
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (orderId) setOrder(getOrder(orderId));
  }, [orderId]);

  if (order === undefined) {
    return <div className="container-app py-24 text-center text-ink/50">Loading your booking…</div>;
  }

  if (!order) {
    return (
      <div className="container-app flex flex-col items-center gap-3 py-24 text-center">
        <p className="font-display text-xl font-semibold">We couldn&apos;t find that booking</p>
        <Link href="/decorations" className="btn-primary">Browse Decorations</Link>
      </div>
    );
  }

  return (
    <div className="container-app flex flex-col items-center py-10">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 14 }}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-leaf-50"
      >
        <CheckCircle2 size={34} className="text-leaf-500" />
      </motion.div>
      <h1 className="mt-4 font-display text-2xl font-bold sm:text-3xl">Booking Confirmed!</h1>
      <p className="mt-1 text-center text-sm text-ink/55">
        We&apos;ve sent the details to your email. Our team will reach out to confirm setup timing.
      </p>

      <div className="mt-6 w-full max-w-lg rounded-2xl border border-ink/10 bg-white p-6">
        <div className="mb-4 flex items-center justify-between border-b border-dashed border-ink/15 pb-4">
          <div>
            <p className="text-xs text-ink/45">Booking ID</p>
            <p className="ticket-tag text-lg font-bold text-grape-700">{order.id}</p>
          </div>
          <span className="badge bg-leaf-50 text-leaf-600">{order.status}</span>
        </div>

        <div className="space-y-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              {item.image && (
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                  <Image src={item.image} alt={item.productName} fill className="object-cover" sizes="48px" />
                </div>
              )}
              <div className="flex-1">
                <p className="text-sm font-medium">{item.productName}</p>
                <p className="text-xs text-ink/45">Qty {item.qty}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-dashed border-ink/15 pt-4 text-sm">
          <div><p className="text-xs text-ink/45">Location</p><p className="font-medium">{order.city} · {order.venue}</p></div>
          <div><p className="text-xs text-ink/45">Date & Time</p><p className="font-medium">{order.eventDate} · {order.eventTime}</p></div>
          <div><p className="text-xs text-ink/45">Total Paid</p><p className="font-mono font-bold">{formatPrice(order.total)}</p></div>
          <div><p className="text-xs text-ink/45">Support</p><p className="font-medium">+91 99999 99999</p></div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href={`/account/orders?id=${order.id}`} className="btn-primary">
          <Package size={16} /> Track Booking
        </Link>
        <a href={whatsappLink(`Hi Occasio! I'd like an update on my booking ${order.id}.`)} target="_blank" rel="noopener noreferrer" className="btn-secondary">
          <MessageCircle size={16} /> WhatsApp Support
        </a>
        <a href="tel:+919999999999" className="btn-secondary">
          <Phone size={16} /> Call Support
        </a>
      </div>

      <Link href="/decorations" className="mt-6 text-sm text-ink/50 hover:text-grape-700">
        Continue shopping →
      </Link>
    </div>
  );
}
