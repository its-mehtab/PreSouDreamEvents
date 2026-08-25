"use client";

import { FilterState, DEFAULT_MAX_PRICE } from "@/lib/filtering";
import { allThemes, allStyles, cities } from "@/lib/data/categories";
import { formatPrice, cn } from "@/lib/utils";
import { Select } from "@/components/ui/Select";

const OCCASIONS = [
  "Birthday", "Anniversary", "Baby Shower", "Kids Themes", "Romantic", "Wedding",
  "Bachelorette", "Haldi & Mehndi", "Corporate", "Festival", "Retirement & Farewell", "Congratulations",
];

const DECORATION_TYPES = [
  "Balloon", "Flowers", "Room Decoration", "Canopy & Terrace", "Candlelight Dinner",
  "Balloon Bouquet", "Stage & Ceremony", "Combo",
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-ink/8 py-4 first:pt-0">
      <p className="mb-3 text-sm font-semibold text-ink">{title}</p>
      {children}
    </div>
  );
}

function toggleInArray(arr: string[], value: string) {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

export default function FilterPanel({
  filters,
  onChange,
  hideOccasion = false,
}: {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  hideOccasion?: boolean;
}) {
  const resultCountBadge = (active: boolean) =>
    cn(
      "flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm cursor-pointer transition-colors",
      active ? "bg-grape-50 text-grape-700 font-medium" : "text-ink/70 hover:bg-paper"
    );

  return (
    <div className="text-sm">
      {!hideOccasion && (
        <Section title="Occasion">
          <div className="space-y-1">
            {OCCASIONS.map((o) => (
              <label key={o} className={resultCountBadge(filters.occasions.includes(o))}>
                <input
                  type="checkbox"
                  className="accent-grape-600"
                  checked={filters.occasions.includes(o)}
                  onChange={() => onChange({ ...filters, occasions: toggleInArray(filters.occasions, o) })}
                />
                {o}
              </label>
            ))}
          </div>
        </Section>
      )}

      <Section title="Decoration Type">
        <div className="space-y-1">
          {DECORATION_TYPES.map((d) => (
            <label key={d} className={resultCountBadge(filters.decorationTypes.includes(d))}>
              <input
                type="checkbox"
                className="accent-grape-600"
                checked={filters.decorationTypes.includes(d)}
                onChange={() =>
                  onChange({ ...filters, decorationTypes: toggleInArray(filters.decorationTypes, d) })
                }
              />
              {d}
            </label>
          ))}
        </div>
      </Section>

      <Section title="Theme">
        <div className="flex flex-wrap gap-1.5">
          {allThemes.map((t) => (
            <button
              key={t}
              onClick={() => onChange({ ...filters, themes: toggleInArray(filters.themes, t) })}
              className={cn("chip", filters.themes.includes(t) && "chip-active")}
            >
              {t}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Style">
        <div className="flex flex-wrap gap-1.5">
          {allStyles.map((s) => (
            <button
              key={s}
              onClick={() => onChange({ ...filters, styles: toggleInArray(filters.styles, s) })}
              className={cn("chip", filters.styles.includes(s) && "chip-active")}
            >
              {s}
            </button>
          ))}
        </div>
      </Section>

      <Section title={`Price up to ${formatPrice(filters.maxPrice)}`}>
        <input
          type="range"
          min={499}
          max={DEFAULT_MAX_PRICE}
          step={100}
          value={filters.maxPrice}
          onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
          className="w-full accent-grape-600"
        />
        <div className="mt-1 flex justify-between text-xs text-ink/40">
          <span>₹499</span>
          <span>{formatPrice(DEFAULT_MAX_PRICE)}+</span>
        </div>
      </Section>

      <Section title="Rating">
        <div className="flex gap-1.5">
          {[4.5, 4, 3.5, 0].map((r) => (
            <button
              key={r}
              onClick={() => onChange({ ...filters, minRating: r })}
              className={cn("chip", filters.minRating === r && "chip-active")}
            >
              {r === 0 ? "Any" : `${r}+`}
            </button>
          ))}
        </div>
      </Section>

      <Section title="City Availability">
        <Select
          options={[{ label: "Any city", value: "" }, ...cities]}
          value={filters.city ?? ""}
          onChange={(v) => onChange({ ...filters, city: v || null })}
          placeholder="Any city"
        />
      </Section>

      <Section title="More filters">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-ink/70">
            <input
              type="checkbox"
              className="accent-grape-600"
              checked={filters.customizableOnly}
              onChange={(e) => onChange({ ...filters, customizableOnly: e.target.checked })}
            />
            Customizable
          </label>
          <label className="flex items-center gap-2 text-ink/70">
            <input
              type="checkbox"
              className="accent-grape-600"
              checked={filters.premiumOnly}
              onChange={(e) => onChange({ ...filters, premiumOnly: e.target.checked })}
            />
            Premium
          </label>
          <label className="flex items-center gap-2 text-ink/70">
            <input
              type="checkbox"
              className="accent-grape-600"
              checked={filters.trendingOnly}
              onChange={(e) => onChange({ ...filters, trendingOnly: e.target.checked })}
            />
            Trending
          </label>
        </div>
      </Section>
    </div>
  );
}
