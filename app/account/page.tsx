import Link from "next/link";
import Image from "next/image";
import { User, Package, Heart, MapPin, HelpCircle, LogOut, ChevronRight } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import prisma from "@/lib/prisma";
import { logout } from "@/lib/actions/auth";
import { redirect } from "next/navigation";

const LINKS = [
  { href: "/account/bookings", label: "My Bookings", icon: Package, desc: "Track & manage your bookings" },
  { href: "/wishlist", label: "Wishlist", icon: Heart, desc: "Decorations you've saved" },
  { href: "/locations", label: "Saved Addresses", icon: MapPin, desc: "Manage delivery locations" },
  { href: "/faq", label: "Help & FAQs", icon: HelpCircle, desc: "Get answers to common questions" },
];

export default async function AccountPage() {
  const session = await getSession();
  let user = null;

  if (session?.userId) {
    user = await prisma.user.findUnique({ where: { id: session.userId } });
  }

  return (
    <div className="container-app max-w-2xl py-6">
      <h1 className="font-display text-2xl font-bold sm:text-3xl">My Account</h1>

      <div className="mt-5 flex items-center gap-4 rounded-2xl border border-ink/10 bg-white p-5 shadow-card relative">
        <div className="relative flex h-14 w-14 shrink-0 overflow-hidden items-center justify-center rounded-full bg-grape-100 text-grape-700">
          {user?.image ? (
            <Image src={user.image} alt="Profile" fill className="object-cover" />
          ) : (
            <User size={26} />
          )}
        </div>
        <div className="flex-1 overflow-hidden">
          {user ? (
            <>
              <p className="font-semibold text-lg truncate">{user.name || "Guest"}</p>
              <p className="text-sm text-ink/60 truncate">{user.phone}</p>
            </>
          ) : (
            <>
              <p className="font-semibold">Guest User</p>
              <p className="text-sm text-ink/50 truncate">Sign in to sync your bookings across devices</p>
            </>
          )}
        </div>
        {user ? (
          <Link href="/account/edit" className="btn-secondary shrink-0 !px-4 !py-2 text-xs">Edit</Link>
        ) : (
          <Link href="/login" className="btn-secondary shrink-0 !px-4 !py-2 text-xs">Sign In</Link>
        )}
      </div>

      <div className="mt-5 divide-y divide-ink/8 overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-card">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} className="flex items-center gap-3 px-5 py-4 transition-colors hover:bg-paper active:bg-paper/70">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-paper text-grape-700">
              <l.icon size={17} />
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-ink">{l.label}</p>
              <p className="text-xs text-ink/45">{l.desc}</p>
            </div>
            <ChevronRight size={16} className="text-ink/30" />
          </Link>
        ))}
        {user && (
          <form action={async () => {
            "use server";
            await logout();
            redirect("/");
          }}>
            <button type="submit" className="flex w-full items-center gap-3 px-5 py-4 text-left text-punch-500 transition-colors hover:bg-punch-50 active:bg-punch-100">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-punch-50">
                <LogOut size={17} />
              </span>
              <span className="text-sm font-semibold">Sign Out</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
