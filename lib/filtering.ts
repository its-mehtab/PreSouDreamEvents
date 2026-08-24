import { Product } from "@/lib/types";

export interface FilterState {
  occasions: string[];
  decorationTypes: string[];
  themes: string[];
  styles: string[];
  maxPrice: number;
  minRating: number;
  customizableOnly: boolean;
  premiumOnly: boolean;
  trendingOnly: boolean;
  city: string | null;
}

export const DEFAULT_MAX_PRICE = 12000;

export const defaultFilters: FilterState = {
  occasions: [],
  decorationTypes: [],
  themes: [],
  styles: [],
  maxPrice: DEFAULT_MAX_PRICE,
  minRating: 0,
  customizableOnly: false,
  premiumOnly: false,
  trendingOnly: false,
  city: null,
};

export type SortOption =
  | "recommended"
  | "popular"
  | "newest"
  | "price-asc"
  | "price-desc"
  | "rating";

export function applyFilters(products: Product[], filters: FilterState): Product[] {
  return products.filter((p) => {
    if (filters.occasions.length && !filters.occasions.includes(p.category)) {
      const inSecondary = p.secondaryCategories.some((c) => filters.occasions.includes(c));
      if (!inSecondary) return false;
    }
    if (filters.decorationTypes.length && !filters.decorationTypes.includes(p.decorationType))
      return false;
    if (filters.themes.length && !p.theme.some((t) => filters.themes.includes(t))) return false;
    if (filters.styles.length && !p.style.some((s) => filters.styles.includes(s))) return false;
    if (p.price > filters.maxPrice) return false;
    if (p.rating < filters.minRating) return false;
    if (filters.customizableOnly && !p.isCustomizable) return false;
    if (filters.premiumOnly && !p.isPremium) return false;
    if (filters.trendingOnly && !p.isTrending) return false;
    if (filters.city) {
      const avail = p.cities.find((c) => c.city === filters.city);
      if (!avail || avail.status === "unavailable") return false;
    }
    return true;
  });
}

export function applySort(products: Product[], sort: SortOption): Product[] {
  const arr = [...products];
  switch (sort) {
    case "popular":
      return arr.sort((a, b) => b.reviewCount - a.reviewCount);
    case "newest":
      return arr.sort((a, b) => Number(b.isNewArrival) - Number(a.isNewArrival));
    case "price-asc":
      return arr.sort((a, b) => a.price - b.price);
    case "price-desc":
      return arr.sort((a, b) => b.price - a.price);
    case "rating":
      return arr.sort((a, b) => b.rating - a.rating);
    default:
      return arr;
  }
}
