import { HelpCircle } from "lucide-react";
import FaqAccordion from "@/components/FaqAccordion";

export const metadata = { title: "Frequently Asked Questions — PreSou Dream Events" };

const FAQS = [
  {
    category: "Booking",
    items: [
      { q: "How do I book a decoration?", a: "Browse or search for a decoration, choose your city, venue, date and time on the product page, customize if needed, and add it to your cart. Then proceed to checkout to confirm your booking." },
      { q: "Can I book for the same day?", a: "Yes — use the 'Need it today? WhatsApp us' button on any product or the floating button on the site. Our team will confirm same-day availability directly." },
      { q: "How far in advance should I book?", a: "We recommend booking at least 2 days in advance for standard packages, and 1–2 weeks for premium or wedding-scale setups." },
    ],
  },
  {
    category: "Customization & Pricing",
    items: [
      { q: "Can I customize colours and names?", a: "Most products support customization such as balloon colour palettes, names, ages, and messages. Look for the 'Customizable' badge on the product." },
      { q: "Are there hidden charges?", a: "No. The price shown includes setup and takedown. Taxes are added at checkout and any optional add-ons are always shown before you pay." },
    ],
  },
  {
    category: "Rescheduling & Cancellation",
    items: [
      { q: "Can I reschedule my booking?", a: "Yes, reschedule for free up to 24 hours before your event from the booking tracking page or by contacting WhatsApp support." },
      { q: "What's your cancellation policy?", a: "Free cancellation up to 48 hours before the event. Cancellations within 48 hours may incur a partial charge." },
    ],
  },
  {
    category: "Setup",
    items: [
      { q: "How long does setup take?", a: "Most setups take 60–90 minutes and are completed before your requested time slot." },
      { q: "What if it's raining for an outdoor setup?", a: "Our team will proactively reach out to shift to an indoor alternative or reschedule at no extra cost." },
    ],
  },
];

export default function FaqPage() {
  return (
    <div className="container-app max-w-3xl py-10">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-grape-50 text-grape-700">
        <HelpCircle size={20} />
      </span>
      <h1 className="mt-3 font-display text-3xl font-bold">Frequently Asked Questions</h1>

      <FaqAccordion faqs={FAQS} />
    </div>
  );
}
