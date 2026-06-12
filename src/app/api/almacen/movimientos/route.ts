import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth, userRole, ok, err, paginate } from "@/lib/api/helpers";

// Movimientos = cambios de stock en variantes (se reconstruyen desde OrderItems como historial)
export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    if (!["almacen", "admin", "finanzas"].includes(userRole(session))) return err("Sin permiso", 403);
    const { skip, limit } = paginate(req);

    const items = await prisma.orderItem.findMany({
      include: {
        product: { select: { name: true, slug: true } },
        variant: { select: { sku: true, presentation: true, unit: true } },
        order: { select: { id: true, status: true, createdAt: true } },
      },
      orderBy: { order: { createdAt: "desc" } },
      skip,
      take: limit,
    });

    const total = await prisma.orderItem.count();

    const data = items.map(i => ({
      id: i.id,
      type: "salida",
      productName: i.product.name,
      sku: i.variant.sku,
      presentation: i.variant.presentation,
      quantity: i.quantity,
      unit: i.variant.unit,
      orderId: i.order.id,
      orderStatus: i.order.status,
      date: i.order.createdAt,
    }));

    return ok({ data, total, page: Math.floor(skip / limit) + 1, limit });
  } catch (e) {
    if (e instanceof Response) return e;
    return err("No autenticado", 401);
  }
}
