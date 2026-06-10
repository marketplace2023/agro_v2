import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const allowedRoles = ["comprador_corporativo", "admin", "vendedor", "finanzas"];
  if (!allowedRoles.includes(session.user.role ?? "")) {
    return NextResponse.json({ error: "Sin permiso" }, { status: 403 });
  }

  const { searchParams } = req.nextUrl;
  const companyId = searchParams.get("companyId");
  const search = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = 20;

  if (!companyId) {
    return NextResponse.json({ error: "companyId requerido" }, { status: 400 });
  }

  type WhereClause = Record<string, unknown>;
  const where: WhereClause = {
    status: "aprobado",
    vendorListings: {
      some: { companyId, isActive: true },
    },
  };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { brand: { name: { contains: search, mode: "insensitive" } } },
    ];
  }

  if (category) {
    where.category = { slug: category };
  }

  const [products, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      include: {
        brand: { select: { name: true, logoUrl: true } },
        category: { select: { name: true, slug: true } },
        vendorListings: {
          where: { companyId, isActive: true },
          select: { price: true, stock: true, deliveryDays: true },
          take: 1,
        },
      } as any,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { name: "asc" },
    }),
    prisma.product.count({ where }),
  ]);

  const mapped = products.map((p: typeof products[number]) => {
    const listing = (p as any).vendorListings?.[0];
    return {
      id: p.id,
      name: p.name,
      brand: p.brand,
      category: p.category,
      imageUrl: (p as any).images?.[0]?.url ?? null,
      price: listing?.price ?? null,
      stock: listing?.stock ?? null,
      deliveryDays: listing?.deliveryDays ?? null,
    };
  });

  return NextResponse.json({
    products: mapped,
    total,
    page,
    pages: Math.ceil(total / limit),
  });
}
