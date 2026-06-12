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
      role === "admin" || role === "finanzas"
        ? { invoiceUrl: { not: null } }
        : { buyerId: uid, invoiceUrl: { not: null } };

    const [data, total] = await Promise.all([
      prisma.order.findMany({
        where,
        select: {
          id: true, totalAmount: true, taxAmount: true, currency: true,
          status: true, invoiceUrl: true, createdAt: true,
          vendor: { select: { company: { select: { name: true } } } },
          payment: { select: { method: true, status: true, confirmedAt: true } },
        },
        orderBy: { createdAt: "desc" },
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
