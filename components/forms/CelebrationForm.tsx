"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PartyPopper, MapPin, Wallet, Palette, CalendarDays, ArrowRight, ArrowLeft, RotateCcw } from "lucide-react";
import { products } from "@/lib/data/products";
import { cities, allThemes } from "@/lib/data/categories";
import ProductCard from "@/components/product/ProductCard";
import { cn } from "@/lib/utils";

const OCCASIONS = ["Birthday", "Anniversary", "Baby Shower", "Kids Themes", "Romantic", "Wedding", "Corporate"];
const BUDGETS = [
  { label: "Under ₹1,000", max: 1000 },
  { label: "₹1,000 – ₹2,500", max: 2500 },
  { label: "₹2,500 – ₹5,000", max: 5000 },
  { label: "Above ₹5,000", max: Infinity },
];

const STEPS = ["Occasion", "Location", "Budget", "Style", "Date"];

export default function CelebrationForm() {
  const [step, setStep] = useState(0);
  const [occasion, setOccasion] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [budgetMax, setBudgetMax] = useState<number | null>(null);
  const [theme, setTheme] = useState<string | null>(null);
  const [date, setDate] = useState("");
  const [showResults, setShowResults] = useState(false);

  const stepValidity = [Boolean(occasion), Boolean(city), budgetMax !== null, Boolean(theme), true];
  const canNext = stepValidity[step];

  function reset() {
    setStep(0);
    setOccasion(null);
    setCity(null);
    setBudgetMax(null);
    setTheme(null);
    setDate("");
    setShowResults(false);
  }

  const results = products
    .filter((p) => !occasion || p.category === occasion)
    .filter((p) => !city || p.cities.some((c) => c.city === city && c.status !== "unavailable"))
    .filter((p) => budgetMax === null || p.price <= budgetMax)
    .filter((p) => !theme || p.theme.includes(theme))
    .sort((a, b) => b.rating - a.rating);

  const fallbackResults = results.length > 0 ? results : products.filter((p) => !occasion || p.category === occasion).slice(0, 8);

  if (showResults) {
    return (
      <div className="container-app py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-bold sm:text-3xl">Recommended for your {occasion}</h1>
            <p className="mt-1 text-sm text-ink/55">
              {city} · {theme} · under ₹{budgetMax === Infinity ? "5,000+" : budgetMax?.toLocaleString("en-IN")}
              {date && ` · ${date}`}
            </p>
          </div>
          <button onClick={reset} className="btn-secondary">
            <RotateCcw size={15} /> Start Over
          </button>
        </div>

        {fallbackResults.length === 0 ? (
          <p className="py-16 text-center text-ink/50">No exact matches — try widening your budget or theme.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
            {fallbackResults.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container-app flex flex-col items-center py-10">
      <div className="mb-6 flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold",
                i < step ? "bg-leaf-500 text-white" : i === step ? "bg-grape-600 text-white" : "bg-paper text-ink/40"
              )}
            >
              {i + 1}
            </div>
            {i < STEPS.length - 1 && <div className={cn("h-0.5 w-6 sm:w-10", i < step ? "bg-leaf-500" : "bg-ink/10")} />}
          </div>
        ))}
      </div>

      <div className="w-full max-w-xl rounded-2xl border border-ink/10 bg-white p-6 sm:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {step === 0 && (
              <StepShell icon={PartyPopper} title="What are you celebrating?">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {OCCASIONS.map((o) => (
                    <OptionButton key={o} active={occasion === o} onClick={() => setOccasion(o)}>
                      {o}
                    </OptionButton>
                  ))}
                </div>
              </StepShell>
            )}
            {step === 1 && (
              <StepShell icon={MapPin} title="Where's the celebration?">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {cities.map((c) => (
                    <OptionButton key={c} active={city === c} onClick={() => setCity(c)}>
                      {c}
                    </OptionButton>
                  ))}
                </div>
              </StepShell>
            )}
            {step === 2 && (
              <StepShell icon={Wallet} title="What's your budget?">
                <div className="grid grid-cols-2 gap-2">
                  {BUDGETS.map((b) => (
                    <OptionButton key={b.label} active={budgetMax === b.max} onClick={() => setBudgetMax(b.max)}>
                      {b.label}
                    </OptionButton>
                  ))}
                </div>
              </StepShell>
            )}
            {step === 3 && (
              <StepShell icon={Palette} title="Pick a style you love">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {allThemes.map((t) => (
                    <OptionButton key={t} active={theme === t} onClick={() => setTheme(t)}>
                      {t}
                    </OptionButton>
                  ))}
                </div>
              </StepShell>
            )}
            {step === 4 && (
              <StepShell icon={CalendarDays} title="When's the big day?">
                <input
                  type="date"
                  value={date}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setDate(e.target.value)}
                  className="input-field"
                />
              </StepShell>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className={cn("btn-secondary", step === 0 && "invisible")}
          >
            <ArrowLeft size={15} /> Back
          </button>
          <button
            onClick={() => (step === STEPS.length - 1 ? setShowResults(true) : setStep((s) => s + 1))}
            disabled={!canNext}
            className="btn-primary"
          >
            {step === STEPS.length - 1 ? "See Recommendations" : "Next"} <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

function StepShell({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-grape-50 text-grape-700">
          <Icon size={17} />
        </span>
        <h2 className="font-display text-lg font-semibold">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function OptionButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-xl border px-4 py-3 text-sm font-medium transition-colors",
        active ? "border-grape-600 bg-grape-600 text-white" : "border-ink/12 text-ink/75 hover:border-grape-400"
      )}
    >
      {children}
    </button>
  );
}
