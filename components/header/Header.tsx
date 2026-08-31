"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, User, Menu, PartyPopper } from "lucide-react";
import SearchBar from "@/components/header/SearchBar";
import LocationSelector from "@/components/header/LocationSelector";
import CategoryNav from "@/components/header/CategoryNav";
import MobileMenu from "@/components/header/MobileMenu";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { cn } from "@/lib/utils";

import { NavCategory } from "@/lib/navigation-config";

const PROMOS = [
  "Birthday Decorations Starting ₹999",
  "Premium Event Setups, Now Bookable Online",
  "Use code SAVE10 for 10% off your first booking",
  "Same-day setup? WhatsApp us directly",
];

interface HeaderProps {
  navConfig: NavCategory[];
}

export default function Header({ navConfig }: HeaderProps) {
  const { itemCount, openDrawer } = useCart();
  const { ids } = useWishlist();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="overflow-hidden bg-grape-900 py-1.5 text-white">
        <div className="flex animate-marquee whitespace-nowrap text-xs font-medium">
          {[...PROMOS, ...PROMOS].map((p, i) => (
            <span key={i} className="mx-6 inline-flex items-center gap-1.5">
              <PartyPopper size={12} className="text-marigold-400" />
              {p}
            </span>
          ))}
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 bg-white transition-shadow",
          scrolled && "shadow-card",
        )}
      >
        <div className="container-app flex items-center gap-3 py-3">
          <button
            className="rounded-full p-2 hover:bg-paper lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          <Link
            href="/"
            className="flex shrink-0 items-center gap-1.5"
            aria-label="PreSou Dream Events Home"
          >
            <Image
              src="/logo.png"
              alt="PreSou Dream Events"
              width={140}
              height={48}
              className="h-12 w-auto object-contain"
              priority
            />
          </Link>

          <div className="hidden shrink-0 lg:block">
            <LocationSelector />
          </div>

          <div className="hidden flex-1 lg:block">
            <SearchBar />
          </div>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <Link
              href="/account"
              className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium hover:bg-paper sm:flex"
            >
              <User size={19} />
              <span className="hidden xl:inline">Account</span>
            </Link>
            <Link
              href="/wishlist"
              className="relative flex items-center gap-1.5 rounded-full px-2.5 py-2 text-sm font-medium hover:bg-paper sm:px-3"
            >
              <Heart size={19} />
              <span className="hidden xl:inline">Wishlist</span>
              {ids.length > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-punch-500 text-[10px] font-bold text-white">
                  {ids.length}
                </span>
              )}
            </Link>
            <button
              onClick={openDrawer}
              className="relative flex items-center gap-1.5 rounded-full bg-grape-600 px-3 py-2 text-sm font-medium text-white hover:bg-grape-700 sm:px-4"
            >
              <ShoppingBag size={19} />
              <span className="hidden xl:inline">Cart</span>
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4.5 w-4.5 min-w-[18px] items-center justify-center rounded-full bg-marigold-400 px-1 text-[10px] font-bold text-ink">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="px-4 pb-3 lg:hidden">
          <SearchBar variant="mobile" />
        </div>

        <CategoryNav navConfig={navConfig} />
      </header>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        navConfig={navConfig}
      />
    </>
  );
}
