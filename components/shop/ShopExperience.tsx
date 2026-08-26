"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { SlidersHorizontal, ChevronRight, PackageSearch } from "lucide-react";
import { Product } from "@/lib/types";
import { FilterState, defaultFilters, applyFilters, applySort, SortOption } from "@/lib/filtering";
import FilterPanel from "@/components/shop/FilterPanel";
import FilterDrawer from "@/components/shop/FilterDrawer";
import SortDropdown from "@/components/shop/SortDropdown";
import ProductCard from "@/components/product/ProductCard";

interface Crumb {
  label: string;
  href?: string;
}

export default function ShopExperience({
  title,
  description,
  baseProducts,
  breadcrumbs,
  hideOccasion = false,
  initialFilters,
  initialSort = "recommended",
  hideHeader = false,
}: {
  title: string;
  description?: string;
  baseProducts: Product[];
  breadcrumbs: Crumb[];
  hideOccasion?: boolean;
  initialFilters?: Partial<FilterState>;
  initialSort?: SortOption;
  hideHeader?: boolean;
}) {
  const cleanInitial = initialFilters
    ? (Object.fromEntries(Object.entries(initialFilters).filter(([, v]) => v !== undefined)) as Partial<FilterState>)
    : {};
  const [filters, setFilters] = useState<FilterState>({ ...defaultFilters, ...cleanInitial });
  const [sort, setSort] = useState<SortOption>(initialSort);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filtered = useMemo(() => applySort(applyFilters(baseProducts, filters), sort), [baseProducts, filters, sort]);

  const activeFilterCount =
    filters.occasions.length +
    filters.decorationTypes.length +
    filters.themes.length +
    filters.styles.length +
    (filters.customizableOnly ? 1 : 0) +
    (filters.premiumOnly ? 1 : 0) +
    (filters.trendingOnly ? 1 : 0) +
    (filters.city ? 1 : 0);

  return (
    <div className="container-app py-5">
      {!hideHeader && (
        <>
          <nav className="mb-3 flex items-center gap-1 text-xs text-ink/45">
            {breadcrumbs.map((b, i) => (
              <span key={i} className="flex items-center gap-1">
                {b.href ? (
                  <Link href={b.href} className="hover:text-grape-700">
                    {b.label}
                  </Link>
                ) : (
                  <span className="text-ink/70">{b.label}</span>
                )}
                {i < breadcrumbs.length - 1 && <ChevronRight size={12} />}
              </span>
            ))}
          </nav>

          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">{title}</h1>
              {description && <p className="mt-1 max-w-xl text-sm text-ink/55">{description}</p>}
            </div>
          </div>
        </>
      )}

      <div className={`mb-5 flex flex-wrap items-end justify-between gap-3 ${hideHeader ? 'mt-4' : ''}`}>
        <p className="mt-1 text-sm text-ink/45">{filtered.length} products</p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDrawerOpen(true)}
            className="btn-secondary !px-3.5 !py-2 text-xs sm:text-sm"
          >
            <SlidersHorizontal size={14} />
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>
          <SortDropdown value={sort} onChange={setSort} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">

        <div>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-ink/15 py-20 text-center">
              <PackageSearch size={36} className="text-ink/25" />
              <p className="font-display text-lg font-semibold">No decorations match your filters</p>
              <p className="max-w-sm text-sm text-ink/50">
                Try widening your price range or clearing a few filters to see more options.
              </p>
              <button
                onClick={() => setFilters({ ...defaultFilters, ...cleanInitial })}
                className="btn-primary mt-1"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        filters={filters}
        onChange={setFilters}
        hideOccasion={hideOccasion}
        resultCount={filtered.length}
      />
    </div>
  );
}
