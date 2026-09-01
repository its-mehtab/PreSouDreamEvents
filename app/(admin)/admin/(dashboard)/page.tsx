import { getDashboardStats } from "@/lib/actions/admin";
import { formatPrice } from "@/lib/utils";
import StatusBadge from "@/components/admin/StatusBadge";
import { SparkLine, AreaChart } from "@/components/admin/Charts";
import {
  CalendarDays,
  Users,
  ShoppingBag,
  ArrowRight,
  IndianRupee,
  CheckCircle2,
  UserCheck,
  Truck,
  Wrench,
  CheckCheck,
  XCircle,
  TrendingUp,
  Plus,
  PlusCircle,
  Tag,
  CalendarX,
  BarChart3,
} from "lucide-react";
import { format } from "date-fns";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import DashboardDateFilter from "./DashboardDateFilter";
import DashboardChartFilter from "./DashboardChartFilter";

export const metadata: Metadata = { title: "Dashboard" };

const STATUS_CONFIG: Record<
  string,
  { label: string; icon: React.ElementType; iconCls: string; barCls: string }
> = {
  CONFIRMED: {
    label: "Confirmed",
    icon: CheckCircle2,
    iconCls: "text-leaf-500 bg-leaf-500/10",
    barCls: "bg-leaf-500",
  },
  DECORATOR_ASSIGNED: {
    label: "Decorator Assigned",
    icon: UserCheck,
    iconCls: "text-grape-600 bg-grape-600/10",
    barCls: "bg-grape-600",
  },
  ON_THE_WAY: {
    label: "On the Way",
    icon: Truck,
    iconCls: "text-marigold-500 bg-marigold-400/10",
    barCls: "bg-marigold-400",
  },
  SETUP_STARTED: {
    label: "Setup Started",
    icon: Wrench,
    iconCls: "text-blue-500 bg-blue-500/10",
    barCls: "bg-blue-500",
  },
  COMPLETED: {
    label: "Completed",
    icon: CheckCheck,
    iconCls: "text-leaf-600 bg-leaf-500/10",
    barCls: "bg-leaf-500",
  },
  CANCELLED: {
    label: "Cancelled",
    icon: XCircle,
    iconCls: "text-punch-500 bg-punch-500/10",
    barCls: "bg-punch-500",
  },
};

const STATUS_ORDER = [
  "CONFIRMED",
  "DECORATOR_ASSIGNED",
  "ON_THE_WAY",
  "SETUP_STARTED",
  "COMPLETED",
  "CANCELLED",
];

// Fake sparkline seeds (in real app you'd pass actual per-day data)
const SPARK_SEEDS: Record<string, number[]> = {
  bookings: [8, 12, 9, 14, 11, 16, 13, 18, 15, 20, 17, 22],
  revenue: [20000, 28000, 22000, 35000, 30000, 40000, 38000, 52000, 45000, 60000, 55000, 72000],
  products: [80, 90, 85, 100, 95, 110, 105, 115, 110, 120, 118, 126],
  customers: [180, 200, 190, 210, 205, 220, 215, 230, 225, 240, 238, 249],
};

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const range = typeof resolvedParams.range === "string" ? resolvedParams.range : "all";
  const chartRange = typeof resolvedParams.chartRange === "string" ? resolvedParams.chartRange : "6m";
  const stats = await getDashboardStats(range, chartRange);

  const bookingStatusMap: Record<string, number> = {};
  stats.bookingsByStatus.forEach((b: any) => {
    bookingStatusMap[b.status] = b._count.id;
  });

  const totalChartRevenue = stats.bookingsByMonth.reduce(
    (s: number, m: any) => s + m.revenue,
    0
  );

  const chartData = stats.bookingsByMonth.map((m: any) => ({
    label: m.month.slice(5),
    value: m.revenue,
  }));

  return (
    <div className="space-y-5">
      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">
            Dashboard
          </h1>
          <p className="mt-0.5 text-xs text-gray-500">
            Welcome back, Super Admin! Here&apos;s what&apos;s happening with your business today.
          </p>
        </div>
        <DashboardDateFilter />
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* Total Bookings */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                Total Bookings
              </p>
              <div className="mt-1.5 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-grape-100">
                  <CalendarDays size={15} className="text-grape-600" />
                </div>
                <p className="text-xl font-bold text-gray-900">
                  {stats.totalBookings}
                </p>
              </div>
              <p className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-leaf-600">
                <TrendingUp size={10} /> 18%
                <span className="font-normal text-gray-400">vs yesterday</span>
              </p>
            </div>
            <SparkLine data={SPARK_SEEDS.bookings} color="#7c3aed" fill />
          </div>
        </div>

        {/* Total Revenue */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                Total Revenue
              </p>
              <div className="mt-1.5 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-leaf-500/10">
                  <IndianRupee size={15} className="text-leaf-600" />
                </div>
                <p className="text-base font-bold text-gray-900 leading-tight">
                  {formatPrice(stats.totalRevenue)}
                </p>
              </div>
              <p className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-leaf-600">
                <TrendingUp size={10} /> 28%
                <span className="font-normal text-gray-400">vs yesterday</span>
              </p>
            </div>
            <SparkLine data={SPARK_SEEDS.revenue} color="#22c55e" fill />
          </div>
        </div>

        {/* Total Products */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                Total Products
              </p>
              <div className="mt-1.5 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-marigold-400/10">
                  <ShoppingBag size={15} className="text-marigold-500" />
                </div>
                <p className="text-xl font-bold text-gray-900">
                  {stats.totalProducts}
                </p>
              </div>
              <p className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-leaf-600">
                <TrendingUp size={10} /> 6%
                <span className="font-normal text-gray-400">vs yesterday</span>
              </p>
            </div>
            <SparkLine data={SPARK_SEEDS.products} color="#f59e0b" fill />
          </div>
        </div>

        {/* Total Customers */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                Total Customers
              </p>
              <div className="mt-1.5 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                  <Users size={15} className="text-blue-500" />
                </div>
                <p className="text-xl font-bold text-gray-900">
                  {stats.totalCustomers}
                </p>
              </div>
              <p className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-leaf-600">
                <TrendingUp size={10} /> 12%
                <span className="font-normal text-gray-400">vs yesterday</span>
              </p>
            </div>
            <SparkLine data={SPARK_SEEDS.customers} color="#3b82f6" fill />
          </div>
        </div>
      </div>

      {/* ── Middle row ── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Bookings by Status */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-800">Bookings by Status</p>
            <Link
              href="/admin/bookings"
              className="text-xs font-semibold text-grape-600 hover:text-grape-800 transition-colors"
            >
              View all
            </Link>
          </div>
          <div className="space-y-3.5">
            {STATUS_ORDER.map((status) => {
              const cfg = STATUS_CONFIG[status];
              const count = bookingStatusMap[status] ?? 0;
              const pct =
                stats.totalBookings > 0
                  ? Math.round((count / stats.totalBookings) * 100)
                  : 0;
              const Icon = cfg.icon;
              return (
                <div key={status}>
                  <div className="mb-1.5 flex items-center gap-2.5">
                    <div
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                        cfg.iconCls
                      )}
                    >
                      <Icon size={13} />
                    </div>
                    <span className="flex-1 text-xs text-gray-600">
                      {cfg.label}
                    </span>
                    <span className="text-xs font-bold text-gray-800">
                      {count}
                    </span>
                    <span className="w-8 text-right text-xs text-gray-400">
                      {pct}%
                    </span>
                  </div>
                  <div className="ml-9 h-1.5 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={cn("h-full rounded-full transition-all", cfg.barCls)}
                      style={{ width: `${Math.max(pct, count > 0 ? 2 : 0)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-800">Recent Bookings</p>
            <Link
              href="/admin/bookings"
              className="text-xs font-semibold text-grape-600 hover:text-grape-800 transition-colors"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {stats.recentBookings.length === 0 && (
              <p className="py-8 text-center text-sm text-gray-400">
                No bookings yet
              </p>
            )}
            {stats.recentBookings.map((booking: any) => (
              <Link
                key={booking.id}
                href={`/admin/bookings/${booking.id}`}
                className="flex items-center gap-3 py-2.5 hover:bg-gray-50 rounded-xl px-2 -mx-2 transition-colors group"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-grape-100 text-sm font-bold text-grape-700">
                  {(booking.user?.name || booking.user?.phone || "?")
                    .charAt(0)
                    .toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-gray-800">
                    {booking.user?.name || booking.user?.phone}
                  </p>
                  <p className="truncate text-xs text-gray-400">
                    {booking.items?.[0]?.product?.name}
                    {booking.items?.length > 1
                      ? ` +${booking.items.length - 1}`
                      : ""}
                    {" · "}
                    {booking.city?.name}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <StatusBadge status={booking.status} />
                  <p className="mt-0.5 text-[10px] text-gray-400">
                    {format(new Date(booking.createdAt), "dd MMM, HH:mm aa")}
                  </p>
                </div>
                <ArrowRight
                  size={13}
                  className="shrink-0 text-gray-300 group-hover:text-grape-400 transition-colors"
                />
              </Link>
            ))}
          </div>
        </div>

        {/* Revenue Overview */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-800">Revenue Overview</p>
            <DashboardChartFilter />
          </div>

          <p className="text-xl font-bold text-gray-900">
            {formatPrice(stats.totalRevenue)}
          </p>
          <p className="mb-1 text-[11px] text-gray-400">Total Revenue</p>
          <p className="mb-4 flex items-center gap-1 text-xs font-semibold text-leaf-600">
            <TrendingUp size={11} /> 28%
            <span className="font-normal text-gray-400">vs last month</span>
          </p>

          {chartData.length >= 2 ? (
            <AreaChart data={chartData} color="#7c3aed" />
          ) : (
            <div className="flex h-28 items-center justify-center text-sm text-gray-400">
              Not enough data
            </div>
          )}

          <div className="mt-3 flex items-center justify-between rounded-xl bg-grape-50 px-4 py-2.5">
            <span className="text-xs font-medium text-gray-500">
              {chartRange === "3m" ? "3-month" : chartRange === "12m" ? "12-month" : "6-month"} total
            </span>
            <span className="text-sm font-bold text-grape-700">
              {formatPrice(totalChartRevenue)}
            </span>
          </div>
        </div>
      </div>

      {/* ── Bottom row ── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Top Products */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-800">Top Products</p>
            <Link
              href="/admin/products"
              className="text-xs font-semibold text-grape-600 hover:text-grape-800 transition-colors"
            >
              View all
            </Link>
          </div>

          {stats.topProducts.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">
              No booking data yet
            </p>
          ) : (
            <div className="space-y-3">
              {stats.topProducts.map((tp: any, i: number) => {
                const maxBookings = stats.topProducts[0]?.bookings ?? 1;
                const pct = Math.round((tp.bookings / maxBookings) * 100);
                const rankColors = [
                  "bg-marigold-400 text-white",
                  "bg-gray-300 text-gray-700",
                  "bg-orange-400 text-white",
                  "bg-gray-100 text-gray-500",
                  "bg-gray-100 text-gray-500",
                ];
                return (
                  <div
                    key={tp.productId}
                    className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-gray-50 transition-colors"
                  >
                    {/* Rank */}
                    <span
                      className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                        rankColors[i] ?? rankColors[3]
                      )}
                    >
                      {i + 1}
                    </span>

                    {/* Product image */}
                    {tp.product?.images?.[0] ? (
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-gray-100">
                        <Image
                          src={tp.product.images[0]}
                          alt={tp.product.name}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-grape-50 border border-grape-100">
                        <ShoppingBag size={14} className="text-grape-400" />
                      </div>
                    )}

                    {/* Name + bar */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-gray-800">
                        {tp.product?.name ?? tp.productId}
                      </p>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-grape-500 transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="shrink-0 text-right">
                      <p className="text-xs font-bold text-gray-700">
                        {tp.bookings}{" "}
                        <span className="font-normal text-gray-400 text-[10px]">
                          bookings
                        </span>
                      </p>
                      <p className="text-xs font-bold text-leaf-600">
                        {formatPrice(tp.revenue)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="mb-3 text-sm font-semibold text-gray-800">Quick Actions</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                label: "Add Product",
                href: "/admin/products/new",
                icon: PlusCircle,
                cls: "bg-grape-100 text-grape-600",
              },
              {
                label: "New Booking",
                href: "/admin/bookings",
                icon: CalendarDays,
                cls: "bg-blue-100 text-blue-600",
              },
              {
                label: "Add Customer",
                href: "/admin/customers",
                icon: Users,
                cls: "bg-marigold-400/15 text-marigold-600",
              },
              {
                label: "Add Discount",
                href: "/admin/discounts",
                icon: Tag,
                cls: "bg-punch-500/10 text-punch-600",
              },
              {
                label: "Block Date",
                href: "/admin/availability",
                icon: CalendarX,
                cls: "bg-gray-100 text-gray-600",
              },
              {
                label: "View Reports",
                href: "/admin/logs",
                icon: BarChart3,
                cls: "bg-leaf-500/10 text-leaf-600",
              },
            ].map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="flex flex-col items-center gap-2.5 rounded-xl border border-gray-100 p-3 text-center hover:border-grape-200 hover:bg-grape-50 transition-all group"
              >
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-xl transition-transform group-hover:scale-110",
                    action.cls
                  )}
                >
                  <action.icon size={16} />
                </div>
                <span className="text-xs font-semibold text-gray-600 group-hover:text-grape-700 transition-colors">
                  {action.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
