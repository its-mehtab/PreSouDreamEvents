"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ShoppingBag,
  CalendarDays,
  Users,
  Tag,
  Star,
  BarChart3,
  MapPin,
  Settings,
  UserCog,
  ScrollText,
  ChevronRight,
  Sparkles,
  Package,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  superAdminOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: ShoppingBag },
  { label: "Bookings", href: "/admin/bookings", icon: CalendarDays },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Taxonomy & Add-Ons", href: "/admin/taxonomy", icon: Tag },
  { label: "Availability", href: "/admin/availability", icon: MapPin },
  { label: "Discounts", href: "/admin/discounts", icon: Package },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
  { label: "Staff", href: "/admin/staff", icon: UserCog, superAdminOnly: true },
  { label: "Audit Logs", href: "/admin/logs", icon: ScrollText, superAdminOnly: true },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar({ role }: { role: string }) {
  const pathname = usePathname();
  const isSuperAdmin = role === "SUPER_ADMIN";

  return (
    <aside className="flex w-60 flex-col border-r border-gray-200 bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 border-b border-gray-200 px-5">
        <Link href="/admin" className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg">
          <Image
            src="/logo.png"
            alt="PreSou Dream Events"
            fill
            className="object-contain"
            sizes="32px"
            priority
          />
        </Link>
        <div>
          <p className="text-sm font-bold text-gray-900 leading-none">PreSou</p>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">Admin</p>
        </div>
        {isSuperAdmin && (
          <span className="ml-auto rounded-full bg-marigold-400/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-marigold-400">
            Super
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {NAV_ITEMS.filter((item) => !item.superAdminOnly || isSuperAdmin).map((item) => {
          const isActive = item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-grape-100 text-grape-700"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              )}
            >
              <item.icon
                size={16}
                className={cn(
                  "shrink-0 transition-colors",
                  isActive ? "text-grape-400" : "text-gray-400 group-hover:text-gray-600"
                )}
              />
              <span className="flex-1">{item.label}</span>
              {isActive && (
                <ChevronRight size={13} className="text-grape-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 px-3 py-3">
        <div className="flex items-center gap-2.5 rounded-xl px-3 py-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-grape-100 text-grape-700 text-xs font-bold">
            <BarChart3 size={13} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-gray-600">
              {role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
            </p>
            <p className="text-[10px] text-gray-400">Logged in</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
