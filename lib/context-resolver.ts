import { Product } from "@/lib/types";
import { allThemes, allStyles, cities } from "@/lib/data/categories";

export interface LandingContext {
  occasion?: string;
  decorationType?: string;
  theme?: string;
  style?: string;
  audience?: string;
  city?: string;

  isPremium?: boolean;
  isTrending?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  maxPrice?: number;
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Generate maps from known values
const OCCASIONS = [
  "Birthday",
  "Anniversary",
  "Baby Shower",
  "Kids Themes",
  "Romantic",
  "Wedding",
  "Bachelorette",
  "Haldi & Mehndi",
  "Corporate",
  "Festival",
  "Retirement & Farewell",
  "Congratulations",
  "Welcome Baby",
];

const DECORATION_TYPES = [
  "Balloon",
  "Flowers",
  "Room Decoration",
  "Canopy & Terrace",
  "Candlelight Dinner",
  "Balloon Bouquet",
  "Stage & Ceremony",
  "Combo",
];

const slugToOccasion = Object.fromEntries(
  OCCASIONS.map((o) => [slugify(o), o]),
);
slugToOccasion["kids"] = "Kids Themes";
slugToOccasion["haldi"] = "Haldi & Mehndi";

const slugToDecType = Object.fromEntries(
  DECORATION_TYPES.map((d) => [slugify(d), d]),
);
slugToDecType["room"] = "Room Decoration";
slugToDecType["canopy"] = "Canopy & Terrace";
slugToDecType["stage"] = "Stage & Ceremony";
slugToDecType["candlelight"] = "Candlelight Dinner";

const slugToTheme = Object.fromEntries(allThemes.map((t) => [slugify(t), t]));
const slugToStyle = Object.fromEntries(allStyles.map((s) => [slugify(s), s]));
const slugToCity = Object.fromEntries(cities.map((c) => [slugify(c), c]));

export function parseSlug(slugs: string[]): LandingContext {
  const ctx: LandingContext = {};

  for (const slug of slugs) {
    if (slugToOccasion[slug]) {
      ctx.occasion = slugToOccasion[slug];
    } else if (slugToDecType[slug]) {
      ctx.decorationType = slugToDecType[slug];
    } else if (slugToTheme[slug]) {
      ctx.theme = slugToTheme[slug];
    } else if (slugToStyle[slug]) {
      ctx.style = slugToStyle[slug];
    } else if (slugToCity[slug]) {
      ctx.city = slugToCity[slug];
    } else if (slug.startsWith("for-")) {
      ctx.audience = slug.replace("-", " ");
    } else if (slug === "premium") {
      ctx.isPremium = true;
    } else if (slug === "trending") {
      ctx.isTrending = true;
    } else if (slug === "best-sellers") {
      ctx.isBestSeller = true;
    } else if (slug === "new-arrivals") {
      ctx.isNewArrival = true;
    } else if (slug.startsWith("under-")) {
      ctx.maxPrice = parseInt(slug.replace("under-", ""), 10);
    }
  }

  return ctx;
}

export function applyContext(productsList: any[], ctx: LandingContext): any[] {
  return productsList.filter((p: any) => {
    if (
      ctx.occasion &&
      (!p.occasions ||
        !p.occasions.some((occ: any) => occ.name === ctx.occasion))
    ) {
      return false;
    }
    if (ctx.decorationType && p.decorationType !== ctx.decorationType) {
      return false;
    }
    const themes = (p as any).themes || p.theme || [];
    if (ctx.theme && !themes.includes(ctx.theme)) {
      return false;
    }
    const styles = (p as any).styles || p.style || [];
    if (ctx.style && !styles.includes(ctx.style)) {
      return false;
    }
    if (ctx.isPremium && !p.isPremium) return false;
    if (ctx.isTrending && !p.isTrending) return false;
    if (ctx.isBestSeller && !p.isBestSeller) return false;
    if (ctx.isNewArrival && !p.isNewArrival) return false;
    if (ctx.maxPrice && p.price > ctx.maxPrice) return false;
    if (ctx.city) {
      const cityData = p.cityAvailabilities?.find(
        (c: any) =>
          c.city?.slug === ctx.city ||
          c.city?.name?.toLowerCase() === ctx.city!.toLowerCase(),
      );
      if (!cityData || cityData.status === "UNAVAILABLE") return false;
    }
    // Audience matching (for-dad, for-mom, etc)
    if (ctx.audience) {
      const q = ctx.audience.toLowerCase().replace("for ", "");
      if (
        !p.name.toLowerCase().includes(q) &&
        !p.tagline?.toLowerCase().includes(q) &&
        (!p.occasions ||
          !p.occasions.some((occ: any) => occ.name.toLowerCase().includes(q)))
      ) {
        return false;
      }
    }
    return true;
  });
}

export function buildCanonicalUrl(ctx: LandingContext): string {
  const parts: string[] = [];
  if (ctx.occasion) parts.push(slugify(ctx.occasion));
  if (ctx.decorationType) parts.push(slugify(ctx.decorationType));
  if (ctx.theme) parts.push(slugify(ctx.theme));
  if (ctx.style) parts.push(slugify(ctx.style));
  if (ctx.audience) parts.push(slugify(ctx.audience));
  if (ctx.city) parts.push(slugify(ctx.city));

  if (ctx.isPremium) parts.push("premium");
  if (ctx.isTrending) parts.push("trending");
  if (ctx.isBestSeller) parts.push("best-sellers");
  if (ctx.isNewArrival) parts.push("new-arrivals");
  if (ctx.maxPrice) parts.push(`under-${ctx.maxPrice}`);

  if (parts.length === 0) return "/decorations";
  return `/decorations/${parts.join("/")}`;
}

export interface RelatedDiscoveryLink {
  label: string;
  url: string;
  image?: string;
  count?: number;
}

const themeImages: Record<string, string> = {
  Pastel: "/theme_pastel.webp",
  "Jungle Safari": "/theme_safari_v2.webp",
  Classic: "/theme_classic_v2.webp",
  Cradle: "/theme_cradle_v2.webp",
  "Gender Reveal": "/theme_gender_v2.webp",
  "Naming Ceremony": "/theme_naming_v2.webp",
  Twinkle: "/theme_twinkle_v2.webp",
};

const fallbackImages = [
  "/theme_classic_v2.webp",
  "/theme_cradle_v2.webp",
  "/theme_gender_v2.webp",
  "/theme_naming_v2.webp",
  "/theme_pastel.webp",
  "/theme_safari_v2.webp",
  "/theme_twinkle_v2.webp",
];

export function generateRelatedDiscovery(
  ctx: LandingContext,
  filteredProducts: any[],
): RelatedDiscoveryLink[] {
  const links: RelatedDiscoveryLink[] = [];
  let fallbackIndex = 0;

  const addLink = (label: string, newCtx: LandingContext) => {
    const testProducts = applyContext(filteredProducts, newCtx);
    if (testProducts.length > 0) {
      let mappedImage = "";

      // Match by exact label or fallback checking lowercase inclusions
      if (themeImages[label]) {
        mappedImage = themeImages[label];
      } else {
        const lowerLabel = label.toLowerCase();
        let found = false;
        for (const [key, img] of Object.entries(themeImages)) {
          if (lowerLabel.includes(key.toLowerCase())) {
            mappedImage = img;
            found = true;
            break;
          }
        }
        if (!found) {
          // Use one of the public theme images instead of product image
          mappedImage = fallbackImages[fallbackIndex % fallbackImages.length];
          fallbackIndex++;
        }
      }

      links.push({
        label,
        url: buildCanonicalUrl(newCtx),
        image: mappedImage,
        count: testProducts.length,
      });
    }
  };

  // Suggest Occasions if not set
  if (!ctx.occasion) {
    const presentOccasions = new Set(
      filteredProducts.flatMap(
        (p: any) =>
          p.occasions?.map((o: any) => o.name) || [p.category].filter(Boolean),
      ),
    );
    // Let's stick to the main ones if they are in the pool
  }

  // Suggest Decoration Types
  if (!ctx.decorationType) {
    const presentTypes = new Set(
      filteredProducts.map((p) => p.decorationType).filter(Boolean),
    );
    presentTypes.forEach((dt) => addLink(dt, { ...ctx, decorationType: dt }));
  }

  if (!ctx.theme) {
    const presentThemes = new Set(
      filteredProducts.flatMap((p: any) => p.themes || p.theme || []),
    );
    presentThemes.forEach((t) => addLink(t, { ...ctx, theme: t }));
  }

  // Suggest Merchandising

  return links;
}

export function generateH1(ctx: LandingContext): string {
  const parts = [];
  if (ctx.isPremium) parts.push("Premium");
  if (ctx.isTrending) parts.push("Trending");
  if (ctx.isBestSeller) parts.push("Best Selling");

  if (ctx.theme) parts.push(ctx.theme);

  if (ctx.occasion) {
    let occ = ctx.occasion;
    if (occ === "Kids Themes") occ = "Kids Theme";
    parts.push(occ);
  }

  if (ctx.decorationType) {
    parts.push(ctx.decorationType);
    if (
      !ctx.decorationType.includes("Decor") &&
      ctx.decorationType !== "Candlelight Dinner"
    ) {
      parts.push("Decorations");
    }
  } else if (
    !ctx.decorationType &&
    ctx.occasion &&
    !ctx.occasion.includes("Decor")
  ) {
    parts.push("Decorations");
  } else if (!ctx.occasion && !ctx.decorationType) {
    parts.push("Decorations");
  }

  if (ctx.audience) parts.push(ctx.audience);
  if (ctx.city) parts.push(`in ${ctx.city}`);
  if (ctx.maxPrice) parts.push(`Under ₹${ctx.maxPrice}`);

  return parts.join(" ");
}
