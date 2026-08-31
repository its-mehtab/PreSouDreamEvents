import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Phone, Package } from "lucide-react";
import { formatPrice, whatsappLink } from "@/lib/utils";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ bookingId?: string }>;
}) {
  const session = await getSession();
  if (!session?.userId) redirect("/login");

  const { bookingId } = await searchParams;
  if (!bookingId) redirect("/account/bookings");

  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
      userId: session.userId,
    },
    include: {
      city: true,
      items: {
        include: {
          product: {
            select: { name: true, images: true },
          },
        },
      },
    },
  });

  if (!booking) {
    return (
      <div className="container-app flex flex-col items-center gap-3 py-24 text-center">
        <p className="font-display text-xl font-semibold">
          We couldn&apos;t find that booking
        </p>
        <Link href="/decorations" className="btn-primary">
          Browse Decorations
        </Link>
      </div>
    );
  }

  return (
    <div className="container-app flex flex-col items-center py-10">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-leaf-50">
        <CheckCircle2 size={34} className="text-leaf-500" />
      </div>
      <h1 className="mt-4 font-display text-2xl font-bold sm:text-3xl">
        Booking Confirmed!
      </h1>
      <p className="mt-1 text-center text-sm text-ink/55">
        We&apos;ve sent the details to your email. Our team will reach out to
        confirm setup timing.
      </p>

      <div className="mt-6 w-full max-w-lg rounded-2xl border border-ink/10 bg-white p-6">
        <div className="mb-4 flex items-center justify-between border-b border-dashed border-ink/15 pb-4">
          <div>
            <p className="text-xs text-ink/45">Booking ID</p>
            <p className="ticket-tag text-lg font-bold text-grape-700">
              #{booking.id.slice(-6).toUpperCase()}
            </p>
          </div>
          <span className="badge bg-leaf-50 text-leaf-600">
            {booking.status}
          </span>
        </div>

        <div className="space-y-3">
          {booking.items.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              {item.product.images?.[0] && (
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-ink/10">
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
              )}
              <div className="flex-1">
                <p className="text-sm font-medium">{item.product.name}</p>
                <p className="text-xs text-ink/45">Qty {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-dashed border-ink/15 pt-4 text-sm">
          <div>
            <p className="text-xs text-ink/45">Location</p>
            <p className="font-medium capitalize">
              {booking.city.name} · {booking.venue}
            </p>
          </div>
          <div>
            <p className="text-xs text-ink/45">Date & Time</p>
            <p className="font-medium">
              {new Date(booking.eventDate).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
              })}{" "}
              · {booking.eventTime}
            </p>
          </div>
          <div>
            <p className="text-xs text-ink/45">Total Paid</p>
            <p className="font-mono font-bold">
              {formatPrice(booking.totalPrice)}
            </p>
          </div>
          <div>
            <p className="text-xs text-ink/45">Support</p>
            <p className="font-medium">+91 99999 99999</p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href={`/account/bookings?id=${booking.id}`}
          className="btn-primary"
        >
          <Package size={16} /> Track Booking
        </Link>
        <a
          href={whatsappLink(
            `Hi, I'd like an update on my booking #${booking.id.slice(-6).toUpperCase()}.`,
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary"
        >
          <WhatsAppIcon size={16} /> WhatsApp Support
        </a>
      </div>

      <Link
        href="/decorations"
        className="mt-6 text-sm text-ink/50 hover:text-grape-700"
      >
        Continue shopping →
      </Link>
    </div>
  );
}
