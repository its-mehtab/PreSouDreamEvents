"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createOrder(data: any) {
  try {
    const order = await prisma.order.create({
      data: {
        userId: data.userId,
        cityId: data.cityId,
        venue: data.venue,
        eventDate: new Date(data.eventDate),
        eventTime: data.eventTime,
        totalPrice: data.totalPrice,
        items: {
          create: data.items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            priceAtBooking: item.price,
            customizations: item.customizations,
            addOns: item.addOns
          }))
        }
      }
    });
    revalidatePath("/account/orders");
    return { success: true, order };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateOrderStatus(id: string, status: 'CONFIRMED' | 'DECORATOR_ASSIGNED' | 'ON_THE_WAY' | 'SETUP_STARTED' | 'COMPLETED' | 'CANCELLED') {
  try {
    const order = await prisma.order.update({
      where: { id },
      data: { status }
    });
    revalidatePath("/account/orders");
    return { success: true, order };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

