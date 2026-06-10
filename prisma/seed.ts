import { PrismaClient } from "../src/generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import bcrypt from "bcryptjs";

neonConfig.webSocketConstructor = ws;

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);

async function main() {
  console.log("🌱 Seeding Marketplace Agro...");

  // ─── Categories ─────────────────────────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: "fertilizantes" }, update: {}, create: { name: "Fertilizantes", slug: "fertilizantes", description: "Nutrición vegetal para todos los cultivos" } }),
    prisma.category.upsert({ where: { slug: "biologicos" }, update: {}, create: { name: "Biológicos", slug: "biologicos", description: "Bioestimulantes, biofertilizantes y biopesticidas" } }),
    prisma.category.upsert({ where: { slug: "herbicidas" }, update: {}, create: { name: "Herbicidas", slug: "herbicidas", description: "Control de malezas" } }),
    prisma.category.upsert({ where: { slug: "insecticidas" }, update: {}, create: { name: "Insecticidas", slug: "insecticidas", description: "Control de plagas" } }),
    prisma.category.upsert({ where: { slug: "fungicidas" }, update: {}, create: { name: "Fungicidas", slug: "fungicidas", description: "Control de enfermedades fúngicas" } }),
    prisma.category.upsert({ where: { slug: "semillas" }, update: {}, create: { name: "Semillas", slug: "semillas", description: "Semillas certificadas" } }),
    prisma.category.upsert({ where: { slug: "coadyuvantes" }, update: {}, create: { name: "Coadyuvantes", slug: "coadyuvantes", description: "Mejoran la eficacia de tratamientos" } }),
    prisma.category.upsert({ where: { slug: "maquinaria" }, update: {}, create: { name: "Maquinaria", slug: "maquinaria", description: "Equipos agrícolas" } }),
  ]);
  console.log(`✅ ${categories.length} categorías creadas`);

  // ─── Brands ─────────────────────────────────────────────────────────────────
  const brands = await Promise.all([
    prisma.brand.upsert({ where: { slug: "fertiagro" }, update: {}, create: { name: "Fertiagro", slug: "fertiagro", country: "CO" } }),
    prisma.brand.upsert({ where: { slug: "agroquim" }, update: {}, create: { name: "AgroQuim", slug: "agroquim", country: "CO" } }),
    prisma.brand.upsert({ where: { slug: "biosolutions" }, update: {}, create: { name: "BioSolutions", slug: "biosolutions", country: "EC" } }),
    prisma.brand.upsert({ where: { slug: "cropprotect" }, update: {}, create: { name: "CropProtect", slug: "cropprotect", country: "MX" } }),
    prisma.brand.upsert({ where: { slug: "pestcontrol" }, update: {}, create: { name: "PestControl", slug: "pestcontrol", country: "CO" } }),
    prisma.brand.upsert({ where: { slug: "nutriplant" }, update: {}, create: { name: "NutriPlant", slug: "nutriplant", country: "BR" } }),
  ]);
  console.log(`✅ ${brands.length} marcas creadas`);

  // ─── Vendor Companies ───────────────────────────────────────────────────────
  const company1 = await prisma.company.upsert({
    where: { id: "company-distagromax" },
    update: {},
    create: {
      id: "company-distagromax",
      name: "DistAgroMax SAS",
      commercialName: "DistAgroMax",
      nit: "900.123.456-7",
      type: "vendedora",
      country: "CO",
      city: "Bogotá",
      description: "Distribuidora líder en Colombia con más de 8 años en el sector agroindustrial.",
    },
  });

  const company2 = await prisma.company.upsert({
    where: { id: "company-agrosuministros" },
    update: {},
    create: {
      id: "company-agrosuministros",
      name: "AgroSuministros CO SAS",
      commercialName: "AgroSuministros CO",
      nit: "800.987.654-3",
      type: "vendedora",
      country: "CO",
      city: "Bogotá",
      description: "Distribuidor con presencia en Cundinamarca y Boyacá.",
    },
  });

  // ─── Vendors ────────────────────────────────────────────────────────────────
  const vendor1 = await prisma.vendor.upsert({
    where: { slug: "distagromax" },
    update: {},
    create: {
      companyId: company1.id,
      slug: "distagromax",
      rating: 4.9,
      totalSales: 1245,
      fulfillmentRate: 98,
      countries: ["CO", "VE", "EC"],
      categories: ["fertilizantes", "herbicidas", "fungicidas"],
    },
  });

  const vendor2 = await prisma.vendor.upsert({
    where: { slug: "agrosuministros-co" },
    update: {},
    create: {
      companyId: company2.id,
      slug: "agrosuministros-co",
      rating: 4.7,
      totalSales: 890,
      fulfillmentRate: 94,
      countries: ["CO"],
      categories: ["fertilizantes", "insecticidas"],
    },
  });

  console.log("✅ 2 empresas y vendedores creados");

  // ─── Products ───────────────────────────────────────────────────────────────
  const [fertCat, bioCat, herbCat, insecCat, fungCat] = categories;

  const productDefs = [
    { name: "Urea Granulada 46% Nitrógeno", slug: "urea-granulada-46-nitrogeno", brandSlug: "fertiagro", catId: fertCat.id, price: 42.5, unit: "50kg", isRegulated: false, isBiological: false },
    { name: "Glifosato 480 SL Herbicida No Selectivo", slug: "glifosato-480-sl", brandSlug: "agroquim", catId: herbCat.id, price: 18.9, unit: "lt", isRegulated: true, isBiological: false },
    { name: "Trichoderma Harzianum Biocontrol", slug: "trichoderma-harzianum-biocontrol", brandSlug: "biosolutions", catId: bioCat.id, price: 35.0, unit: "kg", isRegulated: true, isBiological: true },
    { name: "Mancozeb 80% WP Fungicida Preventivo", slug: "mancozeb-80-wp-fungicida", brandSlug: "cropprotect", catId: fungCat.id, price: 22.0, unit: "kg", isRegulated: true, isBiological: false },
    { name: "Clorpirifos 480 EC Insecticida", slug: "chlorpyrifos-480-ec-insecticida", brandSlug: "pestcontrol", catId: insecCat.id, price: 28.0, unit: "lt", isRegulated: true, isBiological: false },
    { name: "Fosfato Diamónico NPK 18-46-0", slug: "fosfato-diamonico-npk-18-46-0", brandSlug: "fertiagro", catId: fertCat.id, price: 55.0, unit: "50kg", isRegulated: false, isBiological: false },
    { name: "Abamectina 1.8 EC Acaricida-Insecticida", slug: "abamectina-18-ec", brandSlug: "pestcontrol", catId: insecCat.id, price: 45.0, unit: "lt", isRegulated: true, isBiological: false },
    { name: "Beauveria bassiana WP Entomopatógeno", slug: "beauveria-bassiana-wp", brandSlug: "biosolutions", catId: bioCat.id, price: 32.0, unit: "kg", isRegulated: true, isBiological: true },
    { name: "Sulfato de Potasio 50% K2O Soluble", slug: "sulfato-potasio-50-k2o", brandSlug: "nutriplant", catId: fertCat.id, price: 68.0, unit: "25kg", isRegulated: false, isBiological: false },
    { name: "Imidacloprid 350 SC Insecticida Sistémico", slug: "imidacloprid-350-sc", brandSlug: "cropprotect", catId: insecCat.id, price: 38.0, unit: "lt", isRegulated: true, isBiological: false },
    { name: "Azoxistrobina + Ciproconazol Fungicida", slug: "azoxistrobina-ciproconazol", brandSlug: "agroquim", catId: fungCat.id, price: 52.0, unit: "lt", isRegulated: true, isBiological: false },
    { name: "NPK 15-15-15 Fertilizante Completo", slug: "npk-15-15-15", brandSlug: "fertiagro", catId: fertCat.id, price: 38.0, unit: "50kg", isRegulated: false, isBiological: false },
  ];

  let productsCreated = 0;
  for (const def of productDefs) {
    const brand = brands.find((b) => b.slug === def.brandSlug);
    if (!brand) continue;

    const product = await prisma.product.upsert({
      where: { slug: def.slug },
      update: {},
      create: {
        name: def.name,
        slug: def.slug,
        brandId: brand.id,
        categoryId: def.catId,
        isRegulated: def.isRegulated,
        isBiological: def.isBiological,
        status: "aprobado",
        publishedAt: new Date(),
      },
    });

    // ProductVariant (required for cart/checkout)
    const sku = `${def.slug.toUpperCase().slice(0, 6)}-V1`;
    await prisma.productVariant.upsert({
      where: { sku },
      update: {},
      create: {
        productId: product.id,
        sku,
        presentation: `${def.unit} estándar`,
        unit: def.unit,
        basePrice: def.price,
        stock: Math.floor(Math.random() * 500 + 50),
        isActive: true,
      },
    });

    // Attach to vendors — use findFirst + create pattern to avoid null composite key issues
    const existing1 = await prisma.productVendor.findFirst({
      where: { productId: product.id, vendorId: vendor1.id, companyId: null },
    });
    if (!existing1) {
      await prisma.productVendor.create({
        data: {
          productId: product.id,
          vendorId: vendor1.id,
          price: def.price,
          stock: Math.floor(Math.random() * 500 + 50),
          countries: ["CO", "VE", "EC"],
          isActive: true,
        },
      });
    }

    if (Math.random() > 0.5) {
      const existing2 = await prisma.productVendor.findFirst({
        where: { productId: product.id, vendorId: vendor2.id, companyId: null },
      });
      if (!existing2) {
        await prisma.productVendor.create({
          data: {
            productId: product.id,
            vendorId: vendor2.id,
            price: def.price * 1.05,
            stock: Math.floor(Math.random() * 200 + 10),
            countries: ["CO"],
            isActive: true,
          },
        });
      }
    }

    productsCreated++;
  }
  console.log(`✅ ${productsCreated} productos creados`);

  // ─── Demo users ─────────────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash("Demo1234!", 10);

  const userDefs = [
    { email: "comprador@demo.com",     name: "Carlos",     lastName: "Comprador",    role: "comprador"     as const },
    { email: "vendedor@demo.com",      name: "María",      lastName: "Vendedora",    role: "vendedor"      as const },
    { email: "admin@demo.com",         name: "Admin",      lastName: "Sistema",      role: "admin"         as const },
    { email: "asesor@demo.com",        name: "José",       lastName: "Asesor",       role: "asesor"        as const },
    { email: "regulatorio@demo.com",   name: "Ana",        lastName: "Regulatoria",  role: "regulatorio"   as const },
    { email: "fabricante@demo.com",    name: "Rodrigo",    lastName: "Fabricante",   role: "fabricante"    as const },
    { email: "distribuidor@demo.com",  name: "Lucía",      lastName: "Distribuidora",role: "distribuidor"  as const },
    { email: "logistica@demo.com",     name: "Jhon",       lastName: "Logística",    role: "logistica"     as const },
    { email: "finanzas@demo.com",      name: "Claudia",    lastName: "Finanzas",     role: "finanzas"      as const },
    { email: "soporte@demo.com",       name: "Sofía",      lastName: "Soporte",      role: "soporte"       as const },
    { email: "marketing@demo.com",     name: "Daniel",     lastName: "Marketing",    role: "marketing"     as const },
    { email: "almacen@demo.com",       name: "Pedro",      lastName: "Almacén",      role: "almacen"       as const },
    { email: "representante@demo.com", name: "Camila",     lastName: "Representante",role: "representante" as const },
    { email: "credito@demo.com",       name: "Beatriz",    lastName: "Crédito",      role: "credito"       as const },
  ];

  for (const u of userDefs) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        email: u.email,
        passwordHash,
        role: u.role,
        verified: true,
        emailVerified: new Date(),
        profile: {
          create: {
            firstName: u.name,
            lastName: u.lastName,
            country: "CO",
            phone: "+57 300 000 0000",
          },
        },
      },
    });
  }

  console.log(`✅ ${userDefs.length} usuarios demo creados`);
  console.log("\n🎉 Seed completado exitosamente!");
  console.log("\nUsuarios demo (contraseña: Demo1234!):");
  userDefs.forEach((u) => console.log(`  ${u.role}: ${u.email}`));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
