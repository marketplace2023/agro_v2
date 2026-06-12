import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth, userId, userRole, ok, err } from "@/lib/api/helpers";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const session = await requireAuth();
    const uid = userId(session);
    const role = userRole(session);
    const { id } = await params;

    const tracking = await prisma.tracking.findFirst({
      where: { orderId: id },
      include: {
        order: {
          select: {
            id: true, status: true, buyerId: true, totalAmount: true, currency: true,
            deliveryAddress: true,
            items: { include: { product: { select: { name: true } }, variant: { select: { presentation: true } } } },
            vendor: { select: { company: { select: { name: true } } } },
          },
        },
      },
    });

    if (!tracking) return err("Tracking no encontrado", 404);

    const isBuyer = tracking.order.buyerId === uid;
    if (!isBuyer && role !== "admin" && role !== "logistica" && role !== "soporte") {
      return err("Sin permiso", 403);
    }

    return ok(tracking);
  } catch (e) {
    if (e instanceof Response) return e;
    return err("No autenticado", 401);
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const session = await requireAuth();
    const role = userRole(session);
    if (!["admin", "logistica"].includes(role)) return err("Sin permiso", 403);

    const { id } = await params;
    const body = await req.json();

    const tracking = await prisma.tracking.update({
      where: { orderId: id },
      data: {
        status: body.status,
        carrier: body.carrier,
        trackingNumber: body.trackingNumber,
        estimatedDate: body.estimatedDate ? new Date(body.estimatedDate) : undefined,
        deliveredAt: body.deliveredAt ? new Date(body.deliveredAt) : undefined,
        events: body.events,
      },
    });

    return ok(tracking);
  } catch (e) {
    if (e instanceof Response) return e;
    return err("Error actualizando tracking", 500);
  }
}
