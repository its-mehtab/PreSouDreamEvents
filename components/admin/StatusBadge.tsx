import { cn } from "@/lib/utils";

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  // Booking statuses
  CONFIRMED: { label: "Confirmed", className: "bg-leaf-500/15 text-leaf-400 border border-leaf-500/20" },
  DECORATOR_ASSIGNED: { label: "Decorator Assigned", className: "bg-grape-600/15 text-grape-700 border border-grape-600/20" },
  ON_THE_WAY: { label: "On the Way", className: "bg-marigold-400/15 text-marigold-400 border border-marigold-400/20" },
  SETUP_STARTED: { label: "Setup Started", className: "bg-blue-500/15 text-blue-400 border border-blue-500/20" },
  COMPLETED: { label: "Completed", className: "bg-leaf-500/15 text-leaf-400 border border-leaf-500/20" },
  CANCELLED: { label: "Cancelled", className: "bg-punch-500/15 text-punch-400 border border-punch-500/20" },
  // Availability statuses
  AVAILABLE: { label: "Available", className: "bg-leaf-500/15 text-leaf-400 border border-leaf-500/20" },
  LIMITED: { label: "Limited", className: "bg-marigold-400/15 text-marigold-400 border border-marigold-400/20" },
  UNAVAILABLE: { label: "Unavailable", className: "bg-punch-500/15 text-punch-400 border border-punch-500/20" },
  // Role badges
  SUPER_ADMIN: { label: "Super Admin", className: "bg-marigold-400/15 text-marigold-400 border border-marigold-400/20" },
  ADMIN: { label: "Admin", className: "bg-grape-600/15 text-grape-700 border border-grape-600/20" },
  CUSTOMER: { label: "Customer", className: "bg-gray-100 text-gray-500 border border-gray-200" },
  // Generic
  active: { label: "Active", className: "bg-leaf-500/15 text-leaf-400 border border-leaf-500/20" },
  inactive: { label: "Inactive", className: "bg-gray-100 text-gray-500 border border-gray-200" },
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_MAP[status] ?? { label: status, className: "bg-gray-100 text-gray-500 border border-gray-200" };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold leading-none",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
