"use client";

import { Order, OrderStatus, CartItem } from "@/lib/types";
import { products } from "@/lib/data/products";

const KEY = "occasio-orders-v1";
const STATUS_FLOW: OrderStatus[] = [
  "Confirmed",
  "Decorator Assigned",
  "On the Way",
  "Setup Started",
  "Completed",
];

function readAll(): Order[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeAll(orders: Order[]) {
  localStorage.setItem(KEY, JSON.stringify(orders));
}

function generateBookingId() {
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `OCC-${rand}`;
}

// Deterministically derive a "current" status from how long ago the order was placed,
// so the tracking page feels alive without needing a real backend.
export function deriveStatus(order: Order): OrderStatus {
  const minutesSincePlaced = (Date.now() - new Date(order.placedAt).getTime()) / 60000;
  const idx = Math.min(Math.floor(minutesSincePlaced / 2), STATUS_FLOW.length - 1);
  return STATUS_FLOW[Math.max(idx, 0)];
}

export function createOrder(args: {
  items: CartItem[];
  city: string;
  venue: Order["venue"];
  eventDate: string;
  eventTime: string;
  total: number;
}): Order {
  const orders = readAll();
  const order: Order = {
    id: generateBookingId(),
    items: args.items.map((i) => {
      const product = products.find((p) => p.id === i.productId);
      return {
        productName: product?.name ?? "Decoration Package",
        image: product?.images[0] ?? "",
        qty: i.quantity,
      };
    }),
    status: "Confirmed",
    city: args.city,
    venue: args.venue,
    eventDate: args.eventDate,
    eventTime: args.eventTime,
    total: args.total,
    placedAt: new Date().toISOString(),
  };
  writeAll([order, ...orders]);
  localStorage.setItem("occasio-last-order", order.id);
  return order;
}

export function getOrders(): Order[] {
  return readAll();
}

export function getOrder(id: string): Order | undefined {
  return readAll().find((o) => o.id === id);
}

export function getLastOrderId(): string | null {
  return localStorage.getItem("occasio-last-order");
}
