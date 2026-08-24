import { ShieldCheck, Sparkles, MapPin, Users } from "lucide-react";

export const metadata = { title: "About Us — PreSou Dream Events" };

export default function AboutPage() {
  return (
    <div className="container-app max-w-3xl py-10">
      <h1 className="font-display text-3xl font-bold">About PreSou Dream Events</h1>
      <p className="mt-3 text-sm leading-relaxed text-ink/65">
        PreSou Dream Events started with a simple idea: booking decoration for your celebration should feel
        as easy as shopping online. Instead of chasing quotes on the phone, you should be able to
        browse real packages, see transparent pricing, check availability in your city, and book
        in a few taps.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-ink/65">
        Today we work with verified local decorator teams across major Indian cities, offering
        everything from a ₹349 balloon bunch to elaborate wedding stage setups — all bookable
        through the same simple flow.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[
          { icon: ShieldCheck, title: "Verified Teams", desc: "Every decorator partner is background-checked and rated by real customers." },
          { icon: Sparkles, title: "Fully Customizable", desc: "Colours, names, add-ons and themes tailored to your event." },
          { icon: MapPin, title: "Local Presence", desc: "On-ground teams in 8 cities and growing every month." },
          { icon: Users, title: "10,000+ Events", desc: "From birthdays to weddings, we've decorated for every occasion." },
        ].map((f) => (
          <div key={f.title} className="rounded-2xl border border-ink/10 bg-white p-5">
            <f.icon size={22} className="text-grape-700" />
            <p className="mt-2 font-semibold">{f.title}</p>
            <p className="mt-1 text-sm text-ink/55">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
