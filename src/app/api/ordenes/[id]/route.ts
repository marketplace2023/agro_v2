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

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { product: { select: { name: true, slug: true } }, variant: true } },
        vendor: { include: { company: { select: { name: true, commercialName: true, address: true } } } },
        tracking: true,
        payment: true,
        tickets: { select: { id: true, status: true, type: true, subject: true } },
      },
    });

    if (!order) return err("Orden no encontrada", 404);

    const isBuyer = order.buyerId === uid;
    const isVendorUser = role === "vendedor" || role === "distribuidor";
    if (!isBuyer && !isVendorUser && role !== "admin" && role !== "soporte" && role !== "finanzas") {
      return err("Sin permiso", 403);
    }

    return ok(order);
  } catch (e) {
    if (e instanceof Response) return e;
    return err("No autenticado", 401);
  }
}
