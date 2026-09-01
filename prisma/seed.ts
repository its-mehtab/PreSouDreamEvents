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

  // 1. Create Admin & Super Admin Users
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

  const superAdminUser = await prisma.user.upsert({
    where: { phone: "8888888888" },
    update: { role: Role.SUPER_ADMIN },
    create: {
      phone: "8888888888",
      name: "Super Admin",
      role: Role.SUPER_ADMIN,
    },
  });
  console.log(`Created Super Admin User: ${superAdminUser.phone}`);
  
  const customerUser = await prisma.user.upsert({
    where: { phone: "7777777777" },
    update: { role: Role.CUSTOMER },
    create: {
      phone: "7777777777",
      name: "Test Customer",
      role: Role.CUSTOMER,
    },
  });
  console.log(`Created Customer User: ${customerUser.phone}`);

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

  // 3. Products
  console.log(`Seeding ${products.length} products...`);
  for (const p of products) {
    const slug = slugify(p.name);

    // Connect Taxonomy
    const connectOccasions = [
      { id: occasionMap.get(slugify(p.category)) },
    ].filter((x) => x.id !== undefined);
    if (p.secondaryCategories) {
      for (const sc of p.secondaryCategories) {
        if (occasionMap.has(slugify(sc)))
          connectOccasions.push({ id: occasionMap.get(slugify(sc)) });
      }
    }

    // Create Product
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
        decorationType: p.decorationType,
        themes: p.theme,
        styles: p.style,
        occasions: { connect: connectOccasions },
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

    // AddOns
    if (p.addOns) {
      for (const addon of p.addOns) {
        const dbAddOn = await prisma.addOn.upsert({
          where: { id: addon.id },
          update: { name: addon.name, price: addon.price, image: addon.image },
          create: {
            id: addon.id,
            name: addon.name,
            price: addon.price,
            image: addon.image,
          },
        });
        await prisma.productAddOn.upsert({
          where: {
            productId_addOnId: { productId: dbProduct.id, addOnId: dbAddOn.id },
          },
          update: {},
          create: { productId: dbProduct.id, addOnId: dbAddOn.id },
        });
      }
    }

    // Customizations
    if (p.customizations) {
      for (const cust of p.customizations) {
        // Find existing to avoid duplicates
        const existing = await prisma.customizationOption.findFirst({
          where: { productId: dbProduct.id, label: cust.label },
        });
        if (!existing) {
          await prisma.customizationOption.create({
            data: {
              productId: dbProduct.id,
              label: cust.label,
              type: cust.type,
              choices: cust.choices || [],
              priceDelta: cust.priceDelta || 0,
            },
          });
        }
      }
    }
  }

  // 4. Discounts
  console.log("Seeding discounts...");
  const discount = await prisma.discount.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: {
      code: "WELCOME10",
      description: "10% off your first booking",
      discountPct: 10,
      isActive: true,
    },
  });

  // 5. Bookings
  console.log("Seeding bookings and reviews...");
  const product = await prisma.product.findFirst();
  const city = await prisma.city.findFirst();

  if (product && city) {
    const booking = await prisma.booking.create({
      data: {
        userId: customerUser.id,
        cityId: city.id,
        venue: "Home",
        eventDate: new Date(),
        eventTime: "18:00 - 20:00",
        totalPrice: product.price,
        status: "CONFIRMED",
        couponId: discount.id,
        items: {
          create: [
            {
              productId: product.id,
              quantity: 1,
              priceAtBooking: product.price,
            }
          ]
        }
      }
    });
    console.log(`Created Booking: ${booking.id}`);

    const review = await prisma.review.create({
      data: {
        productId: product.id,
        userId: customerUser.id,
        rating: 5,
        comment: "Amazing decoration! Loved it.",
        city: city.name,
      }
    });
    console.log(`Created Review: ${review.id}`);
  }

  // 6. Audit Logs
  console.log("Seeding audit logs...");
  await prisma.auditLog.create({
    data: {
      adminId: superAdminUser.id,
      adminPhone: superAdminUser.phone,
      action: "CREATED_DISCOUNT",
      entity: "Discount",
      entityId: discount.id,
      details: { code: discount.code },
    }
  });

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
