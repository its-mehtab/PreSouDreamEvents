"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createProduct(data: any) {
  try {
    const product = await prisma.product.create({
      data,
    });
    revalidatePath("/decorations");
    return { success: true, product };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateProduct(id: string, data: any) {
  try {
    const product = await prisma.product.update({
      where: { id },
      data,
    });
    revalidatePath("/decorations");
    revalidatePath(`/product/${product.slug}`);
    return { success: true, product };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({ where: { id } });
    revalidatePath("/decorations");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getProducts() {
  return await prisma.product.findMany({
    include: {
      occasions: true,
      themes: true,
      decorationTypes: true,
      cityAvailabilities: { include: { city: true } },
    }
  });
}

