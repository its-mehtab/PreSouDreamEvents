import {
  LandingContext,
  buildCanonicalUrl,
  applyContext,
} from "./context-resolver";
import { products } from "./data/products";

export interface NavLink {
  label: string;
  href: string;
}

export interface NavGroup {
  title: string;
  links: NavLink[];
}

export interface NavCategory {
  id: string;
  label: string;
  slug: string;
  image?: string;
  description?: string;
  columns: NavGroup[][];
}

function hasProducts(ctx: LandingContext) {
  return applyContext(products, ctx).length > 0;
}

function createLink(label: string, ctx: LandingContext): NavLink | null {
  if (hasProducts(ctx)) {
    return { label, href: buildCanonicalUrl(ctx) };
  }
  return null;
}

function filterLinks(links: (NavLink | null)[]): NavLink[] {
  return links.filter((l): l is NavLink => l !== null);
}

export const navigationConfig: NavCategory[] = [
  {
    id: "birthday",
    label: "Birthday",
    slug: "birthday",
    columns: [
      [
        {
          title: "Birthday Decorations",
          links: filterLinks([
            { label: "All Birthday", href: "/decorations/birthday" },
            createLink("For Kids", { occasion: "Birthday", audience: "Kids" }),
            createLink("For Husband", { occasion: "Birthday", audience: "Husband" }),
            createLink("For Wife", { occasion: "Birthday", audience: "Wife" }),
            createLink("For Parents", { occasion: "Birthday", audience: "Parents" }),
          ])
        }
      ],
      [
        {
          title: "Shop by Theme",
          links: filterLinks([
            createLink("Rose Gold", { occasion: "Birthday", theme: "Rose Gold" }),
            createLink("Pastel", { occasion: "Birthday", theme: "Pastel" }),
            createLink("Jungle Safari", { occasion: "Birthday", theme: "Jungle Safari" }),
            createLink("Superhero", { occasion: "Birthday", theme: "Superhero" }),
            createLink("Princess", { occasion: "Birthday", theme: "Princess" }),
            createLink("Unicorn", { occasion: "Birthday", theme: "Unicorn" }),
          ])
        }
      ],
      [
        {
          title: "Party Setups",
          links: filterLinks([
            createLink("Balloon Decorations", { occasion: "Birthday", decorationType: "Balloon" }),
            createLink("Room Decorations", { occasion: "Birthday", decorationType: "Room Decoration" }),
            createLink("Canopy Decorations", { occasion: "Birthday", decorationType: "Canopy" }),
            createLink("Stage / Backdrop", { occasion: "Birthday", style: "Backdrop" }),
            createLink("Premium Setups", { occasion: "Birthday", isPremium: true }),
          ])
        }
      ],
      [
        {
          title: "Popular Picks",
          links: filterLinks([
            createLink("Best Sellers", { occasion: "Birthday", isBestSeller: true }),
            createLink("Under ₹999", { occasion: "Birthday", maxPrice: 999 }),
            createLink("Under ₹1,999", { occasion: "Birthday", maxPrice: 1999 }),
            createLink("New Arrivals", { occasion: "Birthday", isNewArrival: true }),
          ])
        }
      ]
    ]
  },
  {
    id: "balloon",
    label: "Balloon Decor",
    slug: "balloon",
    columns: [
      [
        {
          title: "Balloon Decorations",
          links: filterLinks([
            { label: "All Balloon Decor", href: "/decorations/balloon" },
            createLink("Birthday Balloons", { occasion: "Birthday", decorationType: "Balloon" }),
            createLink("Anniversary Balloons", { occasion: "Anniversary", decorationType: "Balloon" }),
            createLink("Baby Shower Balloons", { occasion: "Baby Shower", decorationType: "Balloon" }),
            createLink("Kids Balloons", { occasion: "Kids", decorationType: "Balloon" }),
            createLink("Romantic Balloons", { occasion: "Romantic", decorationType: "Balloon" }),
            createLink("Wedding Balloons", { occasion: "Wedding", decorationType: "Balloon" }),
          ])
        }
      ],
      [
        {
          title: "By Setup",
          links: filterLinks([
            createLink("Balloon Arch", { decorationType: "Balloon", style: "Balloon Arch" }),
            createLink("Balloon Backdrop", { decorationType: "Balloon", style: "Backdrop" }),
            createLink("Ceiling Decor", { decorationType: "Balloon", style: "Ceiling" }),
            createLink("Balloon Bouquet", { decorationType: "Balloon", style: "Bouquet" }),
            createLink("Room Balloon Decor", { decorationType: "Room Decoration" }),
            createLink("Premium Balloon", { decorationType: "Balloon", isPremium: true }),
          ])
        }
      ],
      [
        {
          title: "By Theme",
          links: filterLinks([
            createLink("Rose Gold", { decorationType: "Balloon", theme: "Rose Gold" }),
            createLink("Pastel", { decorationType: "Balloon", theme: "Pastel" }),
            createLink("Minimal", { decorationType: "Balloon", theme: "Minimal" }),
            createLink("Black & Gold", { decorationType: "Balloon", theme: "Black & Gold" }),
          ])
        }
      ]
    ]
  },
  {
    id: "anniversary",
    label: "Anniversary",
    slug: "anniversary",
    columns: [
      [
        {
          title: "Anniversary Decorations",
          links: filterLinks([
            { label: "All Anniversary", href: "/decorations/anniversary" },
            createLink("For Parents", { occasion: "Anniversary", audience: "Parents" }),
            createLink("For Husband", { occasion: "Anniversary", audience: "Husband" }),
            createLink("For Wife", { occasion: "Anniversary", audience: "Wife" }),
            createLink("Romantic Anniversary", { occasion: "Anniversary", audience: "Romantic" }),
          ])
        }
      ],
      [
        {
          title: "Themes",
          links: filterLinks([
            createLink("Rose Gold", { occasion: "Anniversary", theme: "Rose Gold" }),
            createLink("Red & White", { occasion: "Anniversary", theme: "Red & White" }),
            createLink("Pastel", { occasion: "Anniversary", theme: "Pastel" }),
            createLink("Floral", { occasion: "Anniversary", theme: "Floral" }),
          ])
        }
      ],
      [
        {
          title: "Setups",
          links: filterLinks([
            createLink("Balloon", { occasion: "Anniversary", decorationType: "Balloon" }),
            createLink("Room", { occasion: "Anniversary", decorationType: "Room Decoration" }),
            createLink("Candlelight", { occasion: "Anniversary", decorationType: "Candlelight Dinner" }),
            createLink("Premium", { occasion: "Anniversary", isPremium: true }),
          ])
        },
        {
          title: "More Romantic",
          links: filterLinks([
            createLink("Proposal", { occasion: "Romantic", audience: "Proposal" }),
            createLink("Date Night", { occasion: "Romantic", audience: "Date Night" }),
          ])
        }
      ]
    ]
  },
  {
    id: "baby-and-kids",
    label: "Baby & Kids",
    slug: "kids",
    columns: [
      [
        {
          title: "Baby Shower",
          links: filterLinks([
            { label: "All Baby Shower", href: "/decorations/baby-shower" },
            createLink("Baby Boy", { occasion: "Baby Shower", audience: "Boy" }),
            createLink("Baby Girl", { occasion: "Baby Shower", audience: "Girl" }),
            createLink("Baby Welcome", { occasion: "Baby Shower", audience: "Welcome" }),
            createLink("Baby Shower Themes", { occasion: "Baby Shower", theme: "Pastel" }),
          ])
        }
      ],
      [
        {
          title: "Kids Themes",
          links: filterLinks([
            { label: "All Kids Themes", href: "/decorations/kids" },
            createLink("Unicorn", { occasion: "Kids", theme: "Unicorn" }),
            createLink("Jungle Safari", { occasion: "Kids", theme: "Jungle Safari" }),
            createLink("Superhero", { occasion: "Kids", theme: "Superhero" }),
            createLink("Princess", { occasion: "Kids", theme: "Princess" }),
            createLink("Space", { occasion: "Kids", theme: "Space" }),
            createLink("Cocomelon", { occasion: "Kids", theme: "Cocomelon" }),
          ])
        }
      ],
      [
        {
          title: "By Setup",
          links: filterLinks([
            createLink("Balloon", { occasion: "Kids", decorationType: "Balloon" }),
            createLink("Room", { occasion: "Kids", decorationType: "Room Decoration" }),
            createLink("Backdrop", { occasion: "Kids", style: "Backdrop" }),
            createLink("Premium", { occasion: "Kids", isPremium: true }),
          ])
        }
      ]
    ]
  },
  {
    id: "wedding",
    label: "Wedding",
    slug: "wedding",
    columns: [
      [
        {
          title: "Wedding Events",
          links: filterLinks([
            { label: "All Wedding", href: "/decorations/wedding" },
            createLink("Haldi", { occasion: "Wedding", audience: "Haldi" }),
            createLink("Mehndi", { occasion: "Wedding", audience: "Mehndi" }),
            createLink("Bridal Welcome", { occasion: "Wedding", audience: "Bridal Welcome" }),
            createLink("Wedding Car", { occasion: "Wedding", decorationType: "Wedding Car" }),
            createLink("First Night", { occasion: "Wedding", audience: "First Night" }),
            createLink("Bachelorette", { occasion: "Wedding", audience: "Bachelorette" }),
          ])
        }
      ],
      [
        {
          title: "Setups",
          links: filterLinks([
            createLink("Stage Decorations", { occasion: "Wedding", decorationType: "Stage" }),
            createLink("Canopy", { occasion: "Wedding", decorationType: "Canopy" }),
            createLink("Room", { occasion: "Wedding", decorationType: "Room Decoration" }),
            createLink("Balloon", { occasion: "Wedding", decorationType: "Balloon" }),
            createLink("Flower Decor", { decorationType: "Flowers" }),
          ])
        }
      ],
      [
        {
          title: "Popular",
          links: filterLinks([
            createLink("Premium", { occasion: "Wedding", isPremium: true }),
            createLink("Best Sellers", { occasion: "Wedding", isBestSeller: true }),
            createLink("New Arrivals", { occasion: "Wedding", isNewArrival: true }),
          ])
        },
        {
          title: "Other Events",
          links: filterLinks([
            createLink("Corporate Events", { occasion: "Corporate" }),
            createLink("Housewarming", { occasion: "Housewarming" }),
            createLink("Farewell", { occasion: "Farewell" }),
          ])
        }
      ]
    ]
  },
  {
    id: "cities",
    label: "Cities",
    slug: "mumbai",
    columns: [
      [
        {
          title: "Popular Cities",
          links: filterLinks([
            { label: "Mumbai", href: "/decorations/mumbai" },
            { label: "Delhi NCR", href: "/decorations/delhi-ncr" },
            { label: "Kolkata", href: "/decorations/kolkata" },
            { label: "Bengaluru", href: "/decorations/bengaluru" },
            { label: "Hyderabad", href: "/decorations/hyderabad" },
            { label: "Pune", href: "/decorations/pune" },
          ])
        }
      ]
    ]
  }
];
