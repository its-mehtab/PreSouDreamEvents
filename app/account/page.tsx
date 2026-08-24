import Link from "next/link";
import { User, Package, Heart, MapPin, HelpCircle, LogOut, ChevronRight } from "lucide-react";

const LINKS = [
  { href: "/account/orders", label: "My Bookings", icon: Package, desc: "Track & manage your bookings" },
  { href: "/wishlist", label: "Wishlist", icon: Heart, desc: "Decorations you've saved" },
  { href: "/locations", label: "Saved Addresses", icon: MapPin, desc: "Manage delivery locations" },
  { href: "/faq", label: "Help & FAQs", icon: HelpCircle, desc: "Get answers to common questions" },
];

export default function AccountPage() {
  return (
    <div className="container-app max-w-2xl py-6">
      <h1 className="font-display text-2xl font-bold sm:text-3xl">My Account</h1>

      <div className="mt-5 flex items-center gap-4 rounded-2xl border border-ink/10 bg-white p-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-grape-100 text-grape-700">
          <User size={26} />
        </div>
        <div>
          <p className="font-semibold">Guest User</p>
          <p className="text-sm text-ink/50">Sign in to sync your bookings across devices</p>
        </div>
        <button className="btn-secondary ml-auto !px-4 !py-2 text-xs">Sign In</button>
      </div>

      <div className="mt-5 divide-y divide-ink/8 overflow-hidden rounded-2xl border border-ink/10 bg-white">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} className="flex items-center gap-3 px-5 py-4 hover:bg-paper">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-paper text-grape-700">
              <l.icon size={17} />
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold">{l.label}</p>
              <p className="text-xs text-ink/45">{l.desc}</p>
            </div>
            <ChevronRight size={16} className="text-ink/30" />
          </Link>
        ))}
        <button className="flex w-full items-center gap-3 px-5 py-4 text-left text-punch-500 hover:bg-punch-50">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-punch-50">
            <LogOut size={17} />
          </span>
          <span className="text-sm font-semibold">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
