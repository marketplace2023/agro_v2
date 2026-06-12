import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth, userId, userRole, ok, err, paginate } from "@/lib/api/helpers";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    const uid = userId(session);
    const role = userRole(session);
    const { skip, limit } = paginate(req);

    const where =
      role === "admin" || role === "soporte" || role === "finanzas"
        ? { status: "devuelta" as const }
        : { buyerId: uid, status: "devuelta" as const };

    const [data, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: { include: { product: { select: { name: true, slug: true } }, variant: { select: { presentation: true, unit: true } } } },
          vendor: { include: { company: { select: { name: true } } } },
          tickets: { where: { type: "reclamo" }, select: { id: true, status: true, subject: true } },
        },
        orderBy: { updatedAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
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
    const uid = userId(session);
    const { orderId, reason } = await req.json();

    if (!orderId) return err("orderId es requerido", 400);

    const order = await prisma.order.findFirst({
      where: { id: orderId, buyerId: uid, status: "entregada" },
    });
    if (!order) return err("Orden no encontrada o no elegible para devolución", 404);

    const [updated] = await Promise.all([
      prisma.order.update({ where: { id: orderId }, data: { status: "devuelta" } }),
      prisma.ticket.create({
        data: { buyerId: uid, orderId, type: "garantia", priority: "media", subject: `Devolución - Orden ${orderId}`, messages: { create: { authorId: uid, content: reason ?? "Solicitud de devolución" } } },
      }),
    ]);

    return ok(updated, 201);
  } catch (e) {
    if (e instanceof Response) return e;
    return err("Error procesando devolución", 500);
  }
}
