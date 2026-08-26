import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { LocationProvider } from "@/context/LocationContext";
import { Toaster } from "sonner";
import Header from "@/components/header/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/header/CartDrawer";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-outfit",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PreSou Dream Events — Shop Decorations & Book Event Setups",
  description:
    "Shop balloon arches, room decorations, romantic setups & event packages. Choose your city, date and time, customize, and book in minutes.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${playfairDisplay.variable}`}>
      <body className="font-sans">
        <LocationProvider>
          <WishlistProvider>
            <CartProvider>
              <Header />
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
