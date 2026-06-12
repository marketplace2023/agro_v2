import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth, userId, userRole, ok, err, paginate } from "@/lib/api/helpers";

const VENDOR_ROLES = ["vendedor", "fabricante", "distribuidor", "admin"];

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    const role = userRole(session);
    if (!VENDOR_ROLES.includes(role)) return err("Sin permiso", 403);

    const uid = userId(session);
    const { skip, limit } = paginate(req);
    const url = new URL(req.url);
    const q = url.searchParams.get("q") ?? "";
    const status = url.searchParams.get("status") ?? undefined;

    const vendor = await prisma.vendor.findFirst({ where: { company: { users: { some: { id: uid } } } }, select: { id: true } });
    if (!vendor && role !== "admin") return err("Vendor no encontrado para este usuario", 404);

    const where = {
      ...(vendor && { vendorListings: { some: { vendorId: vendor.id } } }),
      ...(q && { name: { contains: q, mode: "insensitive" as const } }),
      ...(status && { status: status as never }),
    };

    const [data, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          brand: { select: { name: true } },
          category: { select: { name: true, slug: true } },
          variants: { where: { isActive: true } },
          vendorListings: vendor ? { where: { vendorId: vendor.id } } : false,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return ok({ data, total, page: Math.floor(skip / limit) + 1, limit });
  } catch (e) {
    if (e instanceof Response) return e;
    return err("No autenticado", 401);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    const role = userRole(session);
    if (!VENDOR_ROLES.includes(role)) return err("Sin permiso", 403);

    const body = await req.json();
    const { name, slug, categoryId, brandId, description, isRegulated, isBiological, isOrganic, variants } = body;
    if (!name || !slug || !categoryId) return err("name, slug y categoryId son requeridos", 400);

    const product = await prisma.product.create({
      data: {
        name, slug, categoryId, brandId, description,
        isRegulated: isRegulated ?? true,
        isBiological: isBiological ?? false,
        isOrganic: isOrganic ?? false,
        status: "pendiente",
        variants: variants?.length
          ? { create: variants.map((v: { sku: string; presentation: string; unit: string; basePrice: number; stock?: number }) => ({ sku: v.sku, presentation: v.presentation, unit: v.unit, basePrice: v.basePrice, stock: v.stock ?? 0 })) }
          : undefined,
      },
      include: { variants: true },
    });

    return ok(product, 201);
  } catch (e) {
    if (e instanceof Response) return e;
    return err("Error creando producto", 500);
  }
}
