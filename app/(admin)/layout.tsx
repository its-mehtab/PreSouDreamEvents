import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/app/globals.css";
import { Toaster } from "sonner";

const outfit = localFont({
  src: "../../public/fonts/outfit-latin.woff2",
  variable: "--font-outfit",
  display: "swap",
});

const playfairDisplay = localFont({
  src: "../../public/fonts/playfair-latin.woff2",
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Admin — PreSou Dream Events", template: "%s | Admin" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${playfairDisplay.variable}`}>
      <body className="font-sans bg-gray-50 text-gray-900 antialiased">
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
