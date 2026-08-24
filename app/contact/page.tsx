import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/utils";
import ContactForm from "@/components/forms/ContactForm";

export const metadata = { title: "Contact Us — PreSou Dream Events" };

export default function ContactPage() {
  return (
    <div className="container-app grid max-w-4xl grid-cols-1 gap-8 py-10 sm:grid-cols-2">
      <div>
        <h1 className="font-display text-3xl font-bold">Contact Us</h1>
        <p className="mt-2 text-sm text-ink/55">
          Questions about a booking, a product, or a partnership? Reach out — we usually respond
          within a few hours.
        </p>
        <div className="mt-6 space-y-4 text-sm">
          <p className="flex items-center gap-3"><Phone size={16} className="text-grape-700" /> +91 99999 99999</p>
          <p className="flex items-center gap-3"><Mail size={16} className="text-grape-700" /> hello@presoudreamevents.in</p>
          <p className="flex items-center gap-3"><MapPin size={16} className="text-grape-700" /> Salt Lake, Kolkata, West Bengal</p>
        </div>
        <a
          href={whatsappLink("Hi PreSou Dream Events! I have a question about your decoration packages.")}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary mt-6"
        >
          <MessageCircle size={16} /> Chat on WhatsApp
        </a>
      </div>

      <ContactForm />
    </div>
  );
}
