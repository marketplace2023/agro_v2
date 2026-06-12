import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth, userId, userRole, ok, err, paginate } from "@/lib/api/helpers";

const ORDER_INCLUDE = {
  items: { include: { product: { select: { name: true, slug: true } }, variant: { select: { presentation: true, unit: true } } } },
  vendor: { include: { company: { select: { name: true, commercialName: true } } } },
  tracking: { select: { status: true, estimatedDate: true, carrier: true, trackingNumber: true } },
};

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    const uid = userId(session);
    const role = userRole(session);
    const { skip, limit } = paginate(req);
    const url = new URL(req.url);
    const status = url.searchParams.get("status") ?? undefined;
    const vendorId = url.searchParams.get("vendorId") ?? undefined;

    const where =
      role === "vendedor" || role === "distribuidor"
        ? { vendor: { company: { users: { some: { id: uid } } } }, ...(status && { status: status as never }) }
        : { buyerId: uid, ...(status && { status: status as never }), ...(vendorId && { vendorId }) };

    const [data, total] = await Promise.all([
      prisma.order.findMany({ where, include: ORDER_INCLUDE, orderBy: { createdAt: "desc" }, skip, take: limit }),
      prisma.order.count({ where }),
    ]);

    return ok({ data, total, page: Math.floor(skip / limit) + 1, limit });
  } catch (e) {
    if (e instanceof Response) return e;
    return err("No autenticado", 401);
  }
}
