import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Circle, Package, Phone, RefreshCcw } from "lucide-react";
import { getUserBookings } from "@/lib/actions/booking";
import { formatPrice, whatsappLink, cn } from "@/lib/utils";
import WhatsAppIcon from "@/components/WhatsAppIcon";

const STEPS = [
  "CONFIRMED",
  "DECORATOR_ASSIGNED",
  "ON_THE_WAY",
  "SETUP_STARTED",
  "COMPLETED",
];
const STEP_LABELS: Record<string, string> = {
  CONFIRMED: "Confirmed",
  DECORATOR_ASSIGNED: "Decorator Assigned",
  ON_THE_WAY: "On the Way",
  SETUP_STARTED: "Setup Started",
  COMPLETED: "Completed",
};

export default async function bookingsTrackingPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id: highlightId } = await searchParams;
  const bookings = await getUserBookings();

  if (bookings.length === 0) {
    return (
      <div className="container-app flex flex-col items-center gap-3 py-24 text-center">
        <Package size={36} className="text-ink/25" />
        <p className="font-display text-xl font-semibold">No bookings yet</p>
        <p className="text-sm text-ink/50">
          Once you book a decoration, you can track its status here.
        </p>
        <Link href="/decorations" className="btn-primary mt-1">
          Browse Decorations
        </Link>
      </div>
    );
  }

  return (
    <div className="container-app py-6 max-w-3xl">
      <h1 className="font-display text-2xl font-bold sm:text-3xl">
        Track Your Bookings
      </h1>
      <p className="mt-1 text-sm text-ink/50">
        Live status for every decoration booking you&apos;ve made.
      </p>

      <div className="mt-6 space-y-6">
        {bookings.map((booking) => {
          const currentStatus =
            booking.status === "CANCELLED" ? "CONFIRMED" : booking.status;
          const currentIdx = STEPS.indexOf(currentStatus);

          return (
            <div
              key={booking.id}
              className={cn(
                "rounded-2xl border bg-white p-5 shadow-card",
                highlightId === booking.id
                  ? "border-grape-500 ring-2 ring-grape-100"
                  : "border-ink/10",
              )}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-dashed border-ink/15 pb-4">
                <div>
                  <p className="ticket-tag text-base font-bold text-grape-700">
                    Booking #{booking.id.slice(-6).toUpperCase()}
                  </p>
                  <p className="text-xs text-ink/45">
                    Placed{" "}
                    {new Date(booking.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <span
                  className={cn(
                    "badge",
                    booking.status === "CANCELLED"
                      ? "bg-punch-50 text-punch-600"
                      : "bg-leaf-50 text-leaf-600",
                  )}
                >
                  {booking.status === "CANCELLED"
                    ? "Cancelled"
                    : STEP_LABELS[booking.status] || "Processing"}
                </span>
              </div>

              <div className="flex flex-col gap-3 py-4 border-b border-dashed border-ink/15">
                {booking.items.map((item: any, i: number) => {
                  const addOnNames =
                    item.addOns
                      ?.map((id: string) => {
                        const matched = item.product.addOns?.find(
                          (pa: any) => pa.addOnId === id,
                        );
                        return matched?.addOn?.name;
                      })
                      .filter(Boolean) || [];

                  return (
                    <div key={i} className="flex gap-3 items-start">
                      {item.product.images?.[0] && (
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-ink/5">
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <span className="text-sm font-semibold text-ink/90">
                            {item.product.name}
                          </span>
                          <span className="text-sm font-semibold whitespace-nowrap">
                            {formatPrice(item.priceAtBooking * item.quantity)}
                          </span>
                        </div>
                        <p className="text-xs text-ink/50 mt-0.5">
                          Qty: {item.quantity}
                        </p>

                        {item.customizations &&
                          Object.keys(item.customizations).length > 0 && (
                            <p className="text-[10px] text-ink/45 mt-1 leading-tight">
                              <span className="font-medium text-ink/60">
                                Customizations:
                              </span>{" "}
                              {Object.values(item.customizations).join(", ")}
                            </p>
                          )}

                        {addOnNames.length > 0 && (
                          <p className="text-[10px] text-ink/45 mt-0.5 leading-tight">
                            <span className="font-medium text-ink/60">
                              Add-ons:
                            </span>{" "}
                            {addOnNames.join(", ")}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {booking.status !== "CANCELLED" && (
                <div className="my-6 flex items-center px-2">
                  {STEPS.map((step, i) => (
                    <div
                      key={step}
                      className="flex flex-1 items-center last:flex-initial"
                    >
                      <div className="flex flex-col items-center gap-2">
                        {i <= currentIdx ? (
                          <CheckCircle2
                            size={24}
                            className="text-leaf-500 fill-leaf-50"
                          />
                        ) : (
                          <Circle size={24} className="text-ink/20" />
                        )}
                        <span
                          className={cn(
                            "w-16 text-center text-[10px] font-semibold leading-tight",
                            i <= currentIdx ? "text-ink/80" : "text-ink/30",
                          )}
                        >
                          {STEP_LABELS[step]}
                        </span>
                      </div>
                      {i < STEPS.length - 1 && (
                        <div
                          className={cn(
                            "h-1 flex-1 -mt-4",
                            i < currentIdx ? "bg-leaf-500" : "bg-ink/10",
                          )}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 flex flex-col gap-3 rounded-xl bg-paper p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold text-ink/70">
                    {new Date(booking.eventDate).toLocaleDateString("en-IN", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    })}{" "}
                    • {booking.eventTime}
                  </p>
                  <p className="text-xs text-ink/50">{booking.venue}</p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={whatsappLink(
                      `Hi, I need help with my booking #${booking.id.slice(-6).toUpperCase()}`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary flex-1 sm:flex-initial !px-3 !py-2 text-xs"
                  >
                    <WhatsAppIcon size={14} /> Support
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
