"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createTaxonomy(type: 'Occasion' | 'Theme' | 'DecorationType' | 'Style' | 'City', data: { name: string; slug: string; image?: string }) {
  try {
    let result;
    switch (type) {
      case 'Occasion': result = await prisma.occasion.create({ data }); break;
      case 'Theme': result = await prisma.theme.create({ data }); break;
      case 'DecorationType': result = await prisma.decorationType.create({ data }); break;
      case 'Style': result = await prisma.style.create({ data }); break;
      case 'City': result = await prisma.city.create({ data: { name: data.name, slug: data.slug } }); break;
    }
    revalidatePath("/decorations");
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteTaxonomy(type: 'Occasion' | 'Theme' | 'DecorationType' | 'Style' | 'City', id: string) {
  try {
    switch (type) {
      case 'Occasion': await prisma.occasion.delete({ where: { id } }); break;
      case 'Theme': await prisma.theme.delete({ where: { id } }); break;
      case 'DecorationType': await prisma.decorationType.delete({ where: { id } }); break;
      case 'Style': await prisma.style.delete({ where: { id } }); break;
      case 'City': await prisma.city.delete({ where: { id } }); break;
    }
    revalidatePath("/decorations");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

