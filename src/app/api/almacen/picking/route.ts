import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth, userRole, ok, err, paginate } from "@/lib/api/helpers";

// Picking = órdenes en_preparacion que necesitan despacho físico
export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    if (!["almacen", "logistica", "admin"].includes(userRole(session))) return err("Sin permiso", 403);
    const { skip, limit } = paginate(req);

    const [data, total] = await Promise.all([
      prisma.order.findMany({
        where: { status: { in: ["confirmada", "en_preparacion"] } },
        include: {
          items: { include: { product: { select: { name: true, slug: true } }, variant: { select: { sku: true, presentation: true, unit: true } } } },
          vendor: { select: { company: { select: { name: true } } } },
          tracking: { select: { status: true } },
        },
        orderBy: { createdAt: "asc" },
        skip,
        take: limit,
      }),
      prisma.order.count({ where: { status: { in: ["confirmada", "en_preparacion"] } } }),
    ]);

    return ok({ data, total, page: Math.floor(skip / limit) + 1, limit });
  } catch (e) {
    if (e instanceof Response) return e;
    return err("No autenticado", 401);
  }
}
