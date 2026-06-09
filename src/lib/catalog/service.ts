import { prisma } from "@/lib/db/prisma";

export interface ProductFilters {
  q?: string;
  categoriaSlug?: string;
  pais?: string;
  regulado?: boolean;
  biologico?: boolean;
  organico?: boolean;
  orden?: string;
  pagina?: number;
  limite?: number;
}

export interface ProductListItem {
  id: string;
  slug: string;
  name: string;
  brand: { name: string; slug: string } | null;
  category: { name: string; slug: string };
  imageUrl: string | null;
  priceFrom: number;
  isRegulated: boolean;
  isBiological: boolean;
  isOrganic: boolean;
  isNew: boolean;
  rating: number;
  reviewCount: number;
}

export async function getProducts(filters: ProductFilters = {}) {
  const {
    q,
    categoriaSlug,
    pais,
    regulado,
    biologico,
    organico,
    orden = "nuevos",
    pagina = 1,
    limite = 24,
  } = filters;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { status: "aprobado" };

  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { technicalName: { contains: q, mode: "insensitive" } },
      { activeIngredient: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }

  if (categoriaSlug) where.category = { slug: categoriaSlug };
  if (regulado === true) where.isRegulated = true;
  if (biologico === true) where.isBiological = true;
  if (organico === true) where.isOrganic = true;
  if (pais) {
    where.regulatoryRecords = { some: { country: pais, status: "aprobado" } };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let orderBy: any = { createdAt: "desc" };
  if (orden === "nuevos") orderBy = { publishedAt: "desc" };

  const skip = (pagina - 1) * limite;

  const [rawProducts, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      include: {
        brand: { select: { name: true, slug: true } },
        category: { select: { name: true, slug: true } },
        variants: {
          where: { isActive: true },
          select: { basePrice: true },
          orderBy: { basePrice: "asc" },
          take: 1,
        },
        _count: { select: { reviews: true } },
      },
      orderBy,
      skip,
      take: limite,
    }),
    prisma.product.count({ where }),
  ]);

  const now = Date.now();
  let items: ProductListItem[] = rawProducts.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    category: p.category,
    imageUrl: null,
    priceFrom: p.variants[0]?.basePrice ?? 0,
    isRegulated: p.isRegulated,
    isBiological: p.isBiological,
    isOrganic: p.isOrganic,
    isNew: !!p.publishedAt && now - p.publishedAt.getTime() < 30 * 86_400_000,
    rating: 0,
    reviewCount: p._count.reviews,
  }));

  if (orden === "precio-asc") items.sort((a, b) => a.priceFrom - b.priceFrom);
  if (orden === "precio-desc") items.sort((a, b) => b.priceFrom - a.priceFrom);

  return { items, total, pagina, paginas: Math.ceil(total / limite), limite };
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      brand: true,
      category: {
        include: { parent: { select: { name: true, slug: true } } },
      },
      variants: {
        where: { isActive: true },
        include: { priceVolumes: { orderBy: { minQty: "asc" } } },
        orderBy: { basePrice: "asc" },
      },
      vendorListings: {
        where: { isActive: true },
        include: {
          vendor: {
            include: {
              company: { select: { name: true, logoUrl: true, country: true } },
            },
          },
        },
        orderBy: { price: "asc" },
        take: 10,
      },
      regulatoryRecords: { orderBy: { country: "asc" } },
      documents: {
        where: { status: "aprobado" },
        orderBy: { type: "asc" },
      },
      reviews: {
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          buyer: {
            select: {
              profile: {
                select: { firstName: true, lastName: true, avatarUrl: true },
              },
            },
          },
        },
      },
      _count: { select: { reviews: true } },
    },
  });
}

export async function getCategoriesTree() {
  return prisma.category.findMany({
    where: { parentId: null },
    include: {
      children: { orderBy: { sortOrder: "asc" } },
      _count: { select: { products: true } },
    },
    orderBy: { sortOrder: "asc" },
  });
}
