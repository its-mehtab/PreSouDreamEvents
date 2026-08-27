import Link from "next/link";
import Image from "next/image";
import { categories, cities } from "@/lib/data/categories";
import { Phone, Mail, MapPin } from "lucide-react";

// Brand icons removed from lucide-react v1.x — using inline SVGs to preserve appearance
function IconInstagram() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
    </svg>
  );
}
function IconFacebook() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  );
}
function IconYoutube() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.41 19.1C5.12 19.56 12 19.56 12 19.56s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-ink/10 bg-grape-950 text-white/80">
      <div className="container-app grid grid-cols-2 gap-8 py-12 md:grid-cols-5">
        <div className="col-span-2">
          <Link href="/" aria-label="PreSou Dream Events Home">
            <Image
              src="/logo.png"
              alt="PreSou Dream Events"
              width={160}
              height={56}
              className="h-14 w-auto object-contain brightness-0 invert"
            />
          </Link>
          <p className="mt-3 max-w-xs text-sm text-white/55">
            India&apos;s decoration marketplace — shop balloon arches, room setups, romantic
            decor and event packages, then book a local team to set it all up.
          </p>
          <div className="mt-4 flex gap-3">
            <a href="#" aria-label="Instagram" className="rounded-full bg-white/10 p-2 hover:bg-white/20">
              <IconInstagram />
            </a>
            <a href="#" aria-label="Facebook" className="rounded-full bg-white/10 p-2 hover:bg-white/20">
              <IconFacebook />
            </a>
            <a href="#" aria-label="YouTube" className="rounded-full bg-white/10 p-2 hover:bg-white/20">
              <IconYoutube />
            </a>
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/40">Shop</p>
          <ul className="space-y-2 text-sm">
            {categories.slice(0, 6).map((c) => (
              <li key={c.id}>
                <Link href={`/decorations/${c.slug}`} className="hover:text-white">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/40">Company</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-white">About Us</Link></li>
            <li><Link href="/corporate" className="hover:text-white">Corporate Bookings</Link></li>
            <li><Link href="/custom-decoration" className="hover:text-white">Custom Decoration</Link></li>
            <li><Link href="/inspiration" className="hover:text-white">Inspiration</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/40">Support</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/faq" className="hover:text-white">FAQs</Link></li>
            <li><Link href="/account/orders" className="hover:text-white">Track Booking</Link></li>
            <li><Link href="/locations" className="hover:text-white">Cities We Serve</Link></li>
          </ul>
          <div className="mt-4 space-y-1.5 text-sm text-white/60">
            <p className="flex items-center gap-2"><Phone size={13} /> +91 99999 99999</p>
            <p className="flex items-center gap-2"><Mail size={13} /> hello@presoudreamevents.in</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-app flex flex-wrap items-center gap-x-1.5 gap-y-1 py-3 text-xs text-white/45">
          <MapPin size={12} className="mr-1" /> Serving:
          {cities.map((c, i) => (
            <span key={c}>
              {c}
              {i < cities.length - 1 ? "," : ""}
            </span>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-white/40">
        © {new Date().getFullYear()} PreSou Dream Events. All rights reserved.
      </div>
    </footer>
  );
}
