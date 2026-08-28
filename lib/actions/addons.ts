"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createAddOn(data: {
  name: string;
  price: number;
  image?: string;
}) {
  try {
    const addOn = await prisma.addOn.create({ data });
    revalidatePath("/decorations");
    return { success: true, addOn };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function linkAddOnToProduct(productId: string, addOnId: string) {
  try {
    const link = await prisma.productAddOn.create({
      data: { productId, addOnId },
    });
    revalidatePath(`/product/[slug]`, "page");
    return { success: true, link };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createCustomizationOption(data: {
  productId: string;
  label: string;
  type: string;
  choices: string[];
  priceDelta?: number;
}) {
  try {
    const option = await prisma.customizationOption.create({ data });
    revalidatePath(`/product/[slug]`, "page");
    return { success: true, option };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
