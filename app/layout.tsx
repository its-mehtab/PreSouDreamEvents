import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { LocationProvider } from "@/context/LocationContext";
import { Toaster } from "sonner";
import Header from "@/components/header/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/header/CartDrawer";

const outfit = localFont({
  src: "../public/fonts/outfit-latin.woff2",
  variable: "--font-outfit",
  display: "swap",
});

const playfairDisplay = localFont({
  src: "../public/fonts/playfair-latin.woff2",
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PreSou Dream Events — Shop Decorations & Book Event Setups",
  description:
    "Shop balloon arches, room decorations, romantic setups & event packages. Choose your city, date and time, customize, and book in minutes.",
};

import { getGlobalNavConfig } from "@/lib/actions/nav";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navConfig = await getGlobalNavConfig();

  return (
    <html
      lang="en"
      className={`${outfit.variable} ${playfairDisplay.variable}`}
    >
      <body className="font-sans">
        <LocationProvider>
          <WishlistProvider>
            <CartProvider>
              <Header navConfig={navConfig} />
              <main className="min-h-screen">{children}</main>
              <Footer />
              <CartDrawer />
              <Toaster position="top-center" richColors closeButton />
            </CartProvider>
          </WishlistProvider>
        </LocationProvider>
      </body>
    </html>
  );
}
