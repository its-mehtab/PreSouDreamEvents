"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/session";

export async function createBooking(data: any) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      throw new Error("Must be logged in to create a booking");
    }

    const productIds = data.items.map((i: any) => i.productId);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: {
        addOns: {
          include: {
            addOn: true,
          },
        },
      },
    });

    let computedTotal = 0;

    const bookingItemsData = data.items.map((item: any) => {
      const product = dbProducts.find((p) => p.id === item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);

      let addOnsTotal = 0;
      if (product.addOns && Array.isArray(product.addOns)) {
        item.addOnIds?.forEach((id: string) => {
          const matched = (product.addOns as any[]).find(
            (pa) => pa.addOnId === id,
          );
          if (matched && matched.addOn?.price) {
            addOnsTotal += matched.addOn.price;
          }
        });
      }

      const priceAtBooking = product.price + addOnsTotal;
      computedTotal += priceAtBooking * item.quantity;

      return {
        productId: item.productId,
        quantity: item.quantity,
        priceAtBooking: priceAtBooking,
        customizations: item.customizations || {},
        addOns: item.addOnIds || [],
      };
    });

    const discount = 0;
    const subtotalAfterDiscount = Math.max(computedTotal - discount, 0);
    const taxes = Math.round(subtotalAfterDiscount * 0.05);
    const finalTotal = subtotalAfterDiscount + taxes;

    const dbCity = await prisma.city.findFirst({
      where: {
        OR: [{ slug: data.city }, { name: data.city }],
      },
    });

    if (!dbCity) {
      throw new Error(`City '${data.city}' not found in database.`);
    }

    const booking = await prisma.booking.create({
      data: {
        userId: session.userId,
        cityId: dbCity.id,
        venue: data.venue,
        eventDate: new Date(data.eventDate),
        eventTime: data.eventTime,
        totalPrice: finalTotal,
        items: {
          create: bookingItemsData,
        },
      },
    });
    revalidatePath("/account/bookings");
    return { success: true, booking };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateBookingStatus(
  id: string,
  status:
    | "CONFIRMED"
    | "DECORATOR_ASSIGNED"
    | "ON_THE_WAY"
    | "SETUP_STARTED"
    | "COMPLETED"
    | "CANCELLED",
) {
  try {
    const booking = await prisma.booking.update({
      where: { id },
      data: { status },
    });
    revalidatePath("/account/bookings");
    return { success: true, booking };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getUserBookings() {
  const session = await getSession();
  if (!session?.userId) return [];

  const bookings = await prisma.booking.findMany({
    where: { userId: session.userId },
    include: {
      items: {
        include: {
          product: {
            select: {
              name: true,
              images: true,
              addOns: {
                include: {
                  addOn: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return bookings;
}
