"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createReview(data: {
  productId: string;
  userId: string;
  rating: number;
  comment: string;
  city: string;
}) {
  try {
    const review = await prisma.review.create({ data });
    revalidatePath(`/product/[slug]`, "page");
    return { success: true, review };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createDiscount(data: {
  code: string;
  description?: string;
  discountPct?: number;
  discountAmt?: number;
  minOrderAmt?: number;
  expiresAt?: Date;
}) {
  try {
    const discount = await prisma.discount.create({ data });
    return { success: true, discount };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateProductCityAvailability(
  productId: string,
  cityId: string,
  status: "AVAILABLE" | "LIMITED" | "UNAVAILABLE",
  earliestSlot?: string,
) {
  try {
    const availability = await prisma.productCityAvailability.upsert({
      where: { productId_cityId: { productId, cityId } },
      update: { status, earliestSlot },
      create: { productId, cityId, status, earliestSlot },
    });
    revalidatePath("/decorations");
    revalidatePath(`/product/[slug]`, "page");
    return { success: true, availability };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
