import "server-only";
import prisma from "@/lib/prisma";
import { buildNavigationConfig, NavCategory } from "@/lib/navigation-config";

export async function getGlobalNavConfig(): Promise<NavCategory[]> {
  const [products, cities] = await Promise.all([
    prisma.product.findMany({
      include: {
        occasions: true,
        cityAvailabilities: {
          include: { city: true },
        },
      },
    }),
    prisma.city.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  return buildNavigationConfig(products, cities);
}
