export type Occasion =
  | "Birthday"
  | "Anniversary"
  | "Baby Shower"
  | "Welcome Baby"
  | "Kids Themes"
  | "Romantic"
  | "Wedding"
  | "Bachelorette"
  | "Haldi & Mehndi"
  | "Corporate"
  | "Festival"
  | "Retirement & Farewell"
  | "Congratulations";

export type DecorationType =
  | "Balloon"
  | "Flowers"
  | "Room Decoration"
  | "Canopy & Terrace"
  | "Candlelight Dinner"
  | "Balloon Bouquet"
  | "Stage & Ceremony"
  | "Combo";

export type Venue = "Home" | "Hotel" | "Hall" | "Terrace" | "Outdoor" | "Office" | "Other";

export type AvailabilityStatus = "available" | "limited" | "unavailable";

export interface CityAvailability {
  city: string;
  status: AvailabilityStatus;
  earliestSlot?: string;
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
  image?: string;
}

export interface CustomizationOption {
  id: string;
  label: string;
  type: "color" | "text" | "select" | "toggle";
  choices?: string[];
  priceDelta?: number;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  city: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  category: Occasion;
  secondaryCategories: Occasion[];
  decorationType: DecorationType;
  theme: string[];
  style: string[];
  images: string[];
  price: number;
  mrp: number;
  rating: number;
  reviewCount: number;
  reviews: Review[];
  badges: string[];
  isCustomizable: boolean;
  isPremium: boolean;
  isTrending: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  cities: CityAvailability[];
  whatsIncluded: string[];
  addOns: AddOn[];
  customizations: CustomizationOption[];
  setupInfo: string;
  cancellationInfo: string;
  faqs: { q: string; a: string }[];
  numberOfBalloons?: number;
  setupDurationMins: number;
}

export interface CategoryDef {
  id: string;
  name: Occasion | string;
  slug: string;
  icon: string;
  description: string;
  image: string;
  productCount: number;
}

export interface CartCustomization {
  [key: string]: string;
}

export interface CartItem {
  cartId: string;
  productId: string;
  quantity: number;
  customizations: CartCustomization;
  addOnIds: string[];
  city: string;
  eventDate?: string;
  eventTime?: string;
  venue?: Venue;
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
}

export type OrderStatus =
  | "Confirmed"
  | "Decorator Assigned"
  | "On the Way"
  | "Setup Started"
  | "Completed";

export interface Order {
  id: string;
  items: { productName: string; image: string; qty: number }[];
  status: OrderStatus;
  city: string;
  venue: Venue;
  eventDate: string;
  eventTime: string;
  total: number;
  placedAt: string;
}
