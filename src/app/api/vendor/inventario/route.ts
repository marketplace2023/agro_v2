import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth, userId, userRole, ok, err, paginate } from "@/lib/api/helpers";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    const role = userRole(session);
    const uid = userId(session);
    const { skip, limit } = paginate(req);

    const vendor = await prisma.vendor.findFirst({ where: { company: { users: { some: { id: uid } } } }, select: { id: true } });
    if (!vendor && role !== "admin") return err("Vendor no encontrado", 404);

    const where = vendor ? { vendorId: vendor.id } : {};

    const [data, total] = await Promise.all([
      prisma.productVariant.findMany({
        where: vendor ? { product: { vendorListings: { some: { vendorId: vendor.id } } } } : {},
        include: { product: { select: { name: true, slug: true, category: { select: { name: true } } } } },
        orderBy: { stock: "asc" },
        skip,
        take: limit,
      }),
      prisma.productVariant.count({ where: vendor ? { product: { vendorListings: { some: { vendorId: vendor.id } } } } : {} }),
    ]);

    return ok({ data, total, page: Math.floor(skip / limit) + 1, limit });
  } catch (e) {
    if (e instanceof Response) return e;
    return err("No autenticado", 401);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await requireAuth();
    const role = userRole(session);
    if (!["vendedor", "fabricante", "distribuidor", "almacen", "admin"].includes(role)) return err("Sin permiso", 403);

    const { variantId, stock } = await req.json();
    if (!variantId || stock === undefined) return err("variantId y stock son requeridos", 400);

    const variant = await prisma.productVariant.update({ where: { id: variantId }, data: { stock } });
    return ok(variant);
  } catch (e) {
    if (e instanceof Response) return e;
    return err("Error actualizando inventario", 500);
  }
}
