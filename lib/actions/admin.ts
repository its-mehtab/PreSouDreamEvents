"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";

// ─────────────────────────────────────────────
// Auth Guard & Audit Log helpers
// ─────────────────────────────────────────────

async function requireAdmin() {
  const session = await getSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
    throw new Error("Unauthorized: Admin access required");
  }
  return session;
}

async function requireSuperAdmin() {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    throw new Error("Unauthorized: Super Admin access required");
  }
  return session;
}

async function auditLog(
  adminId: string,
  adminPhone: string,
  action: string,
  entity: string,
  entityId?: string,
  details?: object,
) {
  try {
    await prisma.auditLog.create({
      data: { adminId, adminPhone, action, entity, entityId, details: details ?? {} },
    });
  } catch {
    // Audit log failure should not block the main action
    console.error("[AuditLog] Failed to write audit log");
  }
}

// ─────────────────────────────────────────────
// Dashboard Analytics
// ─────────────────────────────────────────────

import { startOfDay, startOfWeek, startOfMonth, startOfYear, subDays } from "date-fns";

export async function getDashboardStats(range: string = "all", chartRange: string = "6m") {
  await requireAdmin();

  let dateFilter: any = undefined;
  const now = new Date();

  switch (range) {
    case "today":
      dateFilter = { gte: startOfDay(now) };
      break;
    case "yesterday":
      dateFilter = { gte: startOfDay(subDays(now, 1)), lt: startOfDay(now) };
      break;
    case "last-7-days":
      dateFilter = { gte: startOfDay(subDays(now, 7)) };
      break;
    case "this-month":
      dateFilter = { gte: startOfMonth(now) };
      break;
    case "last-30-days":
      dateFilter = { gte: startOfDay(subDays(now, 30)) };
      break;
    case "this-year":
      dateFilter = { gte: startOfYear(now) };
      break;
  }

  const bookingWhere = dateFilter ? { createdAt: dateFilter } : undefined;
  const userWhere = dateFilter ? { role: "CUSTOMER" as const, createdAt: dateFilter } : { role: "CUSTOMER" as const };
  const productWhere = dateFilter ? { createdAt: dateFilter } : undefined;
  
  // For booking items (top products), we need to filter by the booking's createdAt
  const bookingItemWhere = dateFilter ? { booking: { createdAt: dateFilter } } : undefined;

  const [
    totalBookings,
    totalRevenue,
    totalProducts,
    totalCustomers,
    recentBookings,
    bookingsByStatus,
    bookingsByMonth,
    topProducts,
  ] = await Promise.all([
    prisma.booking.count({ where: bookingWhere }),
    prisma.booking.aggregate({ _sum: { totalPrice: true }, where: bookingWhere }),
    prisma.product.count({ where: productWhere }),
    prisma.user.count({ where: userWhere }),
    prisma.booking.findMany({
      take: 5,
      where: bookingWhere,
      orderBy: { createdAt: "desc" },
      include: { user: true, city: true, items: { include: { product: { select: { name: true } } } } },
    }),
    prisma.booking.groupBy({ by: ["status"], _count: { id: true }, where: bookingWhere }),
    chartRange === "3m" ? prisma.$queryRaw<{ month: string; count: bigint; revenue: number }[]>`
      SELECT TO_CHAR("createdAt", 'YYYY-MM') as month, COUNT(*) as count, SUM("totalPrice") as revenue
      FROM "Booking" WHERE "createdAt" >= NOW() - INTERVAL '3 months' GROUP BY month ORDER BY month ASC
    ` : chartRange === "12m" ? prisma.$queryRaw<{ month: string; count: bigint; revenue: number }[]>`
      SELECT TO_CHAR("createdAt", 'YYYY-MM') as month, COUNT(*) as count, SUM("totalPrice") as revenue
      FROM "Booking" WHERE "createdAt" >= NOW() - INTERVAL '12 months' GROUP BY month ORDER BY month ASC
    ` : prisma.$queryRaw<{ month: string; count: bigint; revenue: number }[]>`
      SELECT TO_CHAR("createdAt", 'YYYY-MM') as month, COUNT(*) as count, SUM("totalPrice") as revenue
      FROM "Booking" WHERE "createdAt" >= NOW() - INTERVAL '6 months' GROUP BY month ORDER BY month ASC
    `,
    prisma.bookingItem.groupBy({
      by: ["productId"],
      _count: { id: true },
      _sum: { priceAtBooking: true },
      where: bookingItemWhere,
      orderBy: { _count: { id: "desc" } },
      take: 5,
    }),
  ]);

  // Enrich top products with names
  const productIds = topProducts.map((p) => p.productId);
  const productNames = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, name: true, images: true },
  });

  return {
    totalBookings,
    totalRevenue: totalRevenue._sum.totalPrice ?? 0,
    totalProducts,
    totalCustomers,
    recentBookings,
    bookingsByStatus,
    bookingsByMonth: bookingsByMonth.map((b) => ({
      month: b.month,
      count: Number(b.count),
      revenue: Number(b.revenue),
    })),
    topProducts: topProducts.map((tp) => ({
      ...tp,
      product: productNames.find((p) => p.id === tp.productId),
      bookings: tp._count.id,
      revenue: tp._sum.priceAtBooking ?? 0,
    })),
  };
}

// ─────────────────────────────────────────────
// Products
// ─────────────────────────────────────────────

export async function adminGetAllProducts() {
  await requireAdmin();
  return prisma.product.findMany({
    include: {
      occasions: true,
      cityAvailabilities: { include: { city: true } },
      addOns: { include: { addOn: true } },
      customizations: true,
      reviews: { select: { rating: true } },
      _count: { select: { bookingItems: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function adminGetProductById(id: string) {
  await requireAdmin();
  return prisma.product.findUnique({
    where: { id },
    include: {
      occasions: true,
      cityAvailabilities: { include: { city: true } },
      addOns: { include: { addOn: true } },
      customizations: true,
    },
  });
}

export async function adminCreateProduct(data: {
  slug: string;
  name: string;
  tagline?: string;
  description?: string;
  price: number;
  mrp?: number;
  images: string[];
  decorationType: string;
  themes: string[];
  styles: string[];
  whatsIncluded: string[];
  setupDurationMins?: number;
  cancellationInfo?: string;
  numberOfBalloons?: number;
  isCustomizable?: boolean;
  isPremium?: boolean;
  isTrending?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  occasionIds?: string[];
}) {
  const session = await requireAdmin();
  const { occasionIds, ...productData } = data;

  const product = await prisma.product.create({
    data: {
      ...productData,
      occasions: occasionIds?.length ? { connect: occasionIds.map((id) => ({ id })) } : undefined,
    },
  });

  await auditLog(session.userId, session.phone, "CREATE_PRODUCT", "Product", product.id, { name: product.name });
  revalidatePath("/admin/products");
  revalidatePath("/decorations");
  return { success: true, product };
}

export async function adminUpdateProduct(
  id: string,
  data: {
    name?: string;
    tagline?: string;
    description?: string;
    price?: number;
    mrp?: number;
    images?: string[];
    decorationType?: string;
    themes?: string[];
    styles?: string[];
    whatsIncluded?: string[];
    setupDurationMins?: number;
    cancellationInfo?: string;
    numberOfBalloons?: number;
    isCustomizable?: boolean;
    isPremium?: boolean;
    isTrending?: boolean;
    isBestSeller?: boolean;
    isNewArrival?: boolean;
    occasionIds?: string[];
  },
) {
  const session = await requireAdmin();
  const { occasionIds, ...productData } = data;

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...productData,
      occasions: occasionIds !== undefined
        ? { set: occasionIds.map((oid) => ({ id: oid })) }
        : undefined,
    },
  });

  await auditLog(session.userId, session.phone, "UPDATE_PRODUCT", "Product", id, productData);
  revalidatePath("/admin/products");
  revalidatePath("/decorations");
  revalidatePath(`/product/${product.slug}`);
  return { success: true, product };
}

export async function adminDeleteProduct(id: string) {
  const session = await requireAdmin();
  const product = await prisma.product.findUnique({ where: { id }, select: { name: true } });
  await prisma.product.delete({ where: { id } });
  await auditLog(session.userId, session.phone, "DELETE_PRODUCT", "Product", id, { name: product?.name });
  revalidatePath("/admin/products");
  revalidatePath("/decorations");
  return { success: true };
}

// ─────────────────────────────────────────────
// Add-Ons & Customizations
// ─────────────────────────────────────────────

export async function adminGetAllAddOns() {
  await requireAdmin();
  return prisma.addOn.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });
}

export async function adminCreateAddOn(data: { name: string; price: number; image?: string }) {
  const session = await requireAdmin();
  const addOn = await prisma.addOn.create({ data });
  await auditLog(session.userId, session.phone, "CREATE_ADDON", "AddOn", addOn.id, data);
  return { success: true, addOn };
}

export async function adminUpdateAddOn(id: string, data: { name?: string; price?: number; image?: string }) {
  const session = await requireAdmin();
  const addOn = await prisma.addOn.update({ where: { id }, data });
  await auditLog(session.userId, session.phone, "UPDATE_ADDON", "AddOn", id, data);
  return { success: true, addOn };
}

export async function adminDeleteAddOn(id: string) {
  const session = await requireAdmin();
  await prisma.addOn.delete({ where: { id } });
  await auditLog(session.userId, session.phone, "DELETE_ADDON", "AddOn", id, {});
  return { success: true };
}

export async function adminUpsertCustomizationOption(data: {
  id?: string;
  productId: string;
  label: string;
  type: string;
  choices: string[];
  priceDelta?: number;
}) {
  const session = await requireAdmin();
  const { id, ...rest } = data;
  let option;
  if (id) {
    option = await prisma.customizationOption.update({ where: { id }, data: rest });
  } else {
    option = await prisma.customizationOption.create({ data: rest });
  }
  await auditLog(session.userId, session.phone, id ? "UPDATE_CUSTOMIZATION" : "CREATE_CUSTOMIZATION", "CustomizationOption", option.id, rest);
  return { success: true, option };
}

export async function adminDeleteCustomizationOption(id: string) {
  const session = await requireAdmin();
  await prisma.customizationOption.delete({ where: { id } });
  await auditLog(session.userId, session.phone, "DELETE_CUSTOMIZATION", "CustomizationOption", id, {});
  return { success: true };
}

// ─────────────────────────────────────────────
// Bookings
// ─────────────────────────────────────────────

export async function adminGetAllBookings(filters?: {
  status?: string;
  cityId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}) {
  await requireAdmin();
  return prisma.booking.findMany({
    where: {
      ...(filters?.status && { status: filters.status as any }),
      ...(filters?.cityId && { cityId: filters.cityId }),
      ...(filters?.dateFrom || filters?.dateTo
        ? {
            eventDate: {
              ...(filters?.dateFrom && { gte: new Date(filters.dateFrom) }),
              ...(filters?.dateTo && { lte: new Date(filters.dateTo) }),
            },
          }
        : {}),
      ...(filters?.search && {
        OR: [
          { user: { name: { contains: filters.search, mode: "insensitive" } } },
          { user: { phone: { contains: filters.search } } },
          { id: { contains: filters.search } },
        ],
      }),
    },
    include: {
      user: { select: { id: true, name: true, phone: true, email: true } },
      city: true,
      coupon: true,
      items: { include: { product: { select: { name: true, images: true, slug: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function adminGetBookingById(id: string) {
  await requireAdmin();
  return prisma.booking.findUnique({
    where: { id },
    include: {
      user: true,
      city: true,
      coupon: true,
      items: {
        include: {
          product: {
            include: { addOns: { include: { addOn: true } } },
          },
        },
      },
    },
  });
}

export async function adminUpdateBookingStatus(
  id: string,
  status: "CONFIRMED" | "DECORATOR_ASSIGNED" | "ON_THE_WAY" | "SETUP_STARTED" | "COMPLETED" | "CANCELLED",
) {
  const session = await requireAdmin();
  const booking = await prisma.booking.update({ where: { id }, data: { status } });
  await auditLog(session.userId, session.phone, "UPDATE_BOOKING_STATUS", "Booking", id, { status });
  revalidatePath("/admin/bookings");
  revalidatePath("/account/bookings");
  return { success: true, booking };
}

// ─────────────────────────────────────────────
// Customers
// ─────────────────────────────────────────────

export async function adminGetAllCustomers(search?: string) {
  await requireAdmin();
  return prisma.user.findMany({
    where: {
      role: "CUSTOMER",
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { phone: { contains: search } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      }),
    },
    include: {
      _count: { select: { bookings: true, reviews: true } },
      bookings: { select: { totalPrice: true, status: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function adminGetCustomerById(id: string) {
  await requireAdmin();
  return prisma.user.findUnique({
    where: { id },
    include: {
      bookings: {
        include: { city: true, items: { include: { product: { select: { name: true } } } } },
        orderBy: { createdAt: "desc" },
      },
      reviews: { include: { product: { select: { name: true } } } },
    },
  });
}

export async function adminToggleCustomerStatus(id: string, disabled: boolean) {
  const session = await requireAdmin();
  const user = await prisma.user.update({
    where: { id },
    data: { disabled },
  });
  await auditLog(session.userId, session.phone, "UPDATE_USER_STATUS", "User", id, { disabled });
  revalidatePath("/admin/customers");
  revalidatePath(`/admin/customers/${id}`);
  return { success: true, user };
}

// ─────────────────────────────────────────────
// Taxonomy: Occasions & Cities
// ─────────────────────────────────────────────

export async function adminGetAllOccasions() {
  await requireAdmin();
  return prisma.occasion.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });
}

export async function adminUpsertOccasion(data: {
  id?: string;
  name: string;
  slug: string;
  icon?: string;
  image?: string;
  description?: string;
}) {
  const session = await requireAdmin();
  const { id, ...rest } = data;
  let occasion;
  if (id) {
    occasion = await prisma.occasion.update({ where: { id }, data: rest });
  } else {
    occasion = await prisma.occasion.create({ data: rest });
  }
  await auditLog(session.userId, session.phone, id ? "UPDATE_OCCASION" : "CREATE_OCCASION", "Occasion", occasion.id, rest);
  revalidatePath("/admin/taxonomy");
  revalidatePath("/decorations");
  return { success: true, occasion };
}

export async function adminDeleteOccasion(id: string) {
  const session = await requireAdmin();
  await prisma.occasion.delete({ where: { id } });
  await auditLog(session.userId, session.phone, "DELETE_OCCASION", "Occasion", id, {});
  revalidatePath("/admin/taxonomy");
  return { success: true };
}

export async function adminGetAllCities() {
  await requireAdmin();
  return prisma.city.findMany({
    include: { _count: { select: { bookings: true, availabilities: true } } },
    orderBy: { name: "asc" },
  });
}

export async function adminUpsertCity(data: { id?: string; name: string; slug: string }) {
  const session = await requireAdmin();
  const { id, ...rest } = data;
  let city;
  if (id) {
    city = await prisma.city.update({ where: { id }, data: rest });
  } else {
    city = await prisma.city.create({ data: rest });
  }
  await auditLog(session.userId, session.phone, id ? "UPDATE_CITY" : "CREATE_CITY", "City", city.id, rest);
  revalidatePath("/admin/taxonomy");
  return { success: true, city };
}

export async function adminDeleteCity(id: string) {
  const session = await requireAdmin();
  await prisma.city.delete({ where: { id } });
  await auditLog(session.userId, session.phone, "DELETE_CITY", "City", id, {});
  revalidatePath("/admin/taxonomy");
  return { success: true };
}

// ─────────────────────────────────────────────
// Availability Matrix
// ─────────────────────────────────────────────

export async function adminGetAvailabilityMatrix() {
  await requireAdmin();
  const [products, cities, availabilities] = await Promise.all([
    prisma.product.findMany({ select: { id: true, name: true, slug: true }, orderBy: { name: "asc" } }),
    prisma.city.findMany({ orderBy: { name: "asc" } }),
    prisma.productCityAvailability.findMany(),
  ]);
  return { products, cities, availabilities };
}

export async function adminUpdateAvailability(
  productId: string,
  cityId: string,
  status: "AVAILABLE" | "LIMITED" | "UNAVAILABLE",
  earliestSlot?: string,
) {
  const session = await requireAdmin();
  const availability = await prisma.productCityAvailability.upsert({
    where: { productId_cityId: { productId, cityId } },
    update: { status, earliestSlot },
    create: { productId, cityId, status, earliestSlot },
  });
  await auditLog(session.userId, session.phone, "UPDATE_AVAILABILITY", "ProductCityAvailability", availability.id, {
    productId,
    cityId,
    status,
  });
  revalidatePath("/admin/availability");
  revalidatePath("/decorations");
  return { success: true, availability };
}

// ─────────────────────────────────────────────
// Discounts / Offers
// ─────────────────────────────────────────────

export async function adminGetAllDiscounts() {
  await requireAdmin();
  return prisma.discount.findMany({
    include: { _count: { select: { bookings: true } } },
    orderBy: { id: "desc" },
  });
}

export async function adminUpsertDiscount(data: {
  id?: string;
  code: string;
  description?: string;
  discountPct?: number;
  discountAmt?: number;
  minOrderAmt?: number;
  isActive?: boolean;
  expiresAt?: Date | null;
}) {
  const session = await requireAdmin();
  const { id, ...rest } = data;
  let discount;
  if (id) {
    discount = await prisma.discount.update({ where: { id }, data: rest });
  } else {
    discount = await prisma.discount.create({ data: rest });
  }
  await auditLog(session.userId, session.phone, id ? "UPDATE_DISCOUNT" : "CREATE_DISCOUNT", "Discount", discount.id, rest);
  revalidatePath("/admin/discounts");
  return { success: true, discount };
}

export async function adminDeleteDiscount(id: string) {
  const session = await requireAdmin();
  await prisma.discount.delete({ where: { id } });
  await auditLog(session.userId, session.phone, "DELETE_DISCOUNT", "Discount", id, {});
  revalidatePath("/admin/discounts");
  return { success: true };
}

// ─────────────────────────────────────────────
// Reviews
// ─────────────────────────────────────────────

export async function adminGetAllReviews(filters?: { productId?: string; minRating?: number }) {
  await requireAdmin();
  return prisma.review.findMany({
    where: {
      ...(filters?.productId && { productId: filters.productId }),
      ...(filters?.minRating && { rating: { gte: filters.minRating } }),
    },
    include: {
      user: { select: { id: true, name: true, phone: true } },
      product: { select: { id: true, name: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function adminDeleteReview(id: string) {
  const session = await requireAdmin();
  const review = await prisma.review.findUnique({ where: { id }, select: { productId: true } });
  await prisma.review.delete({ where: { id } });
  await auditLog(session.userId, session.phone, "DELETE_REVIEW", "Review", id, {});
  if (review?.productId) revalidatePath(`/product/[slug]`, "page");
  revalidatePath("/admin/reviews");
  return { success: true };
}

// ─────────────────────────────────────────────
// Staff / Admin Management (SUPER_ADMIN only)
// ─────────────────────────────────────────────

export async function adminGetAllAdmins() {
  await requireSuperAdmin();
  return prisma.user.findMany({
    where: { role: { in: ["ADMIN", "SUPER_ADMIN"] } },
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      role: true,
      createdAt: true,
      _count: { select: { bookings: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function adminSetUserRole(
  userId: string,
  role: "CUSTOMER" | "ADMIN" | "SUPER_ADMIN",
) {
  const session = await requireSuperAdmin();
  const user = await prisma.user.update({ where: { id: userId }, data: { role } });
  await auditLog(session.userId, session.phone, "SET_USER_ROLE", "User", userId, { role });
  revalidatePath("/admin/staff");
  return { success: true, user };
}

// ─────────────────────────────────────────────
// Audit Logs
// ─────────────────────────────────────────────

export async function adminGetAuditLogs(filters?: { adminId?: string; entity?: string; limit?: number }) {
  await requireSuperAdmin();
  return prisma.auditLog.findMany({
    where: {
      ...(filters?.adminId && { adminId: filters.adminId }),
      ...(filters?.entity && { entity: filters.entity }),
    },
    orderBy: { createdAt: "desc" },
    take: filters?.limit ?? 100,
  });
}
