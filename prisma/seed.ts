import { PrismaClient, Role } from "@prisma/client";
import {
  categories,
  occasionShortcuts,
  allThemes,
  allStyles,
  cities,
} from "../lib/data/categories";
import { products } from "../lib/data/products";

const prisma = new PrismaClient();

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function main() {
  console.log("Seeding database from local variables...");

  // 1. Create Admin User
  const adminUser = await prisma.user.upsert({
    where: { phone: "9999999999" },
    update: { role: Role.ADMIN },
    create: {
      phone: "9999999999",
      name: "Admin User",
      role: Role.ADMIN,
    },
  });
  console.log(`Created Admin User: ${adminUser.phone}`);

  // 2. Taxonomy (Cities, Occasions, Themes, DecorationTypes, Styles)
  console.log("Seeding cities...");
  const cityMap = new Map();
  for (const c of cities) {
    const slug = slugify(c);
    const dbCity = await prisma.city.upsert({
      where: { slug },
      update: {},
      create: { name: c, slug },
    });
    cityMap.set(slug, dbCity.id);
  }

  console.log("Seeding categories (Occasions)...");
  const occasionMap = new Map();
  for (const c of categories) {
    const slug = c.slug;
    const dbOccasion = await prisma.occasion.upsert({
      where: { slug },
      update: { description: c.description, image: c.image },
      create: {
        name: c.name,
        slug,
        description: c.description,
        image: c.image,
      },
    });
    occasionMap.set(slug, dbOccasion.id);
  }

  // Ensure shortcuts are there too
  for (const os of occasionShortcuts) {
    const slug = slugify(os);
    if (!occasionMap.has(slug)) {
      const dbOcc = await prisma.occasion.upsert({
        where: { slug },
        update: {},
        create: { name: os, slug },
      });
      occasionMap.set(slug, dbOcc.id);
    }
  }

  console.log("Seeding Themes...");
  const themeMap = new Map();
  for (const t of allThemes) {
    const slug = slugify(t);
    const dbTheme = await prisma.theme.upsert({
      where: { slug },
      update: {},
      create: { name: t, slug },
    });
    themeMap.set(slug, dbTheme.id);
  }

  console.log("Seeding Styles...");
  const styleMap = new Map();
  for (const s of allStyles) {
    const slug = slugify(s);
    const dbStyle = await prisma.style.upsert({
      where: { slug },
      update: {},
      create: { name: s, slug },
    });
    styleMap.set(slug, dbStyle.id);
  }

  console.log("Seeding Decoration Types...");
  // We'll infer decoration types from the products
  const decorTypes = new Set<string>();
  for (const p of products) {
    decorTypes.add(p.decorationType);
  }
  const decorTypeMap = new Map();
  for (const dt of decorTypes) {
    const slug = slugify(dt);
    const dbDt = await prisma.decorationType.upsert({
      where: { slug },
      update: {},
      create: { name: dt, slug },
    });
    decorTypeMap.set(slug, dbDt.id);
  }

  // 3. Products
  console.log(`Seeding ${products.length} products...`);
  for (const p of products) {
    const slug = slugify(p.name);

    // Connect Taxonomy
    const connectOccasions = [{ id: occasionMap.get(slugify(p.category)) }].filter(x => x.id !== undefined);
    if (p.secondaryCategories) {
      for (const sc of p.secondaryCategories) {
        if (occasionMap.has(slugify(sc)))
          connectOccasions.push({ id: occasionMap.get(slugify(sc)) });
      }
    }

    const connectThemes = p.theme
      .map((t) => ({ id: themeMap.get(slugify(t)) }))
      .filter((x) => x.id !== undefined);
    const connectStyles = p.style
      .map((s) => ({ id: styleMap.get(slugify(s)) }))
      .filter((x) => x.id !== undefined);
    const connectDecorTypes = [
      { id: decorTypeMap.get(slugify(p.decorationType)) },
    ].filter(x => x.id !== undefined);

    // Upsert product
    const dbProduct = await prisma.product.upsert({
      where: { slug },
      update: {
        price: p.price,
        mrp: p.mrp,
        isTrending: p.isTrending,
        isBestSeller: p.isBestSeller,
        isNewArrival: p.isNewArrival,
        isPremium: p.isPremium,
      },
      create: {
        name: p.name,
        slug,
        tagline: p.tagline,
        price: p.price,
        mrp: p.mrp ?? p.price,
        images: p.images,
        setupDurationMins: p.setupDurationMins ?? 60,
        cancellationInfo: p.cancellationInfo,
        faqs: p.faqs,
        whatsIncluded: p.whatsIncluded,
        numberOfBalloons: p.numberOfBalloons,
        isCustomizable: p.isCustomizable,
        isPremium: p.isPremium,
        isTrending: p.isTrending,
        isBestSeller: p.isBestSeller,
        isNewArrival: p.isNewArrival,
        occasions: { connect: connectOccasions },
        themes: { connect: connectThemes },
        styles: { connect: connectStyles },
        decorationTypes: { connect: connectDecorTypes },
      },
    });

    // Availabilities
    if (p.cities) {
      for (const av of p.cities) {
        const cityId = cityMap.get(slugify(av.city));
        if (cityId) {
          await prisma.productCityAvailability.upsert({
            where: { productId_cityId: { productId: dbProduct.id, cityId } },
            update: {
              status:
                av.status === "available"
                  ? "AVAILABLE"
                  : av.status === "limited"
                    ? "LIMITED"
                    : "UNAVAILABLE",
              earliestSlot: av.earliestSlot,
            },
            create: {
              productId: dbProduct.id,
              cityId,
              status:
                av.status === "available"
                  ? "AVAILABLE"
                  : av.status === "limited"
                    ? "LIMITED"
                    : "UNAVAILABLE",
              earliestSlot: av.earliestSlot,
            },
          });
        }
      }
    }

    // Customizations
    if (p.customizations) {
      for (const cust of p.customizations) {
        // Just create them (skip duplicates might be tricky if no unique constraint, so we just clear and create for simplicity)
      }
    }
  }

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
