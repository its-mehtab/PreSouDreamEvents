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

export async function getAllProducts() {
  return await prisma.product.findMany({
    include: {
      occasions: true,
      cityAvailabilities: { include: { city: true } },
    },
  });
}

// Just fetch all products and let the context-resolver filter them in-memory since
// the catalog is small and text-based fuzzy search (audience) is complex in Prisma.
export async function getShopProducts() {
  return await prisma.product.findMany({
    include: {
      occasions: true,
      cityAvailabilities: { include: { city: true } },
    },
  });
}

export async function getProductBySlug(slug: string) {
  return await prisma.product.findUnique({
    where: { slug },
    include: {
      occasions: true,
      cityAvailabilities: { include: { city: true } },
      addOns: { include: { addOn: true } },
      customizations: true,
      reviews: { include: { user: true } },
    },
  });
}

export async function getProductsByIds(ids: string[]) {
  if (!ids.length) return [];
  return await prisma.product.findMany({
    where: { id: { in: ids } },
    include: { addOns: { include: { addOn: true } } },
  });
}

export async function submitReview(data: {
  productId: string;
  productSlug: string;
  rating: number;
  comment: string;
  city: string;
}) {
  const { getSession } = await import("@/lib/auth/session");
  const session = await getSession();
  if (!session?.userId) {
    return {
      success: false,
      error: "You must be logged in to leave a review.",
    };
  }

  const existing = await prisma.review.findFirst({
    where: { productId: data.productId, userId: session.userId as string },
  });
  if (existing) {
    return { success: false, error: "You have already reviewed this product." };
  }

  try {
    await prisma.review.create({
      data: {
        productId: data.productId,
        userId: session.userId as string,
        rating: data.rating,
        comment: data.comment,
        city: data.city,
      },
    });
    revalidatePath(`/product/${data.productSlug}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
