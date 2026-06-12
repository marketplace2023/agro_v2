import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth, userId, userRole, ok, err, paginate } from "@/lib/api/helpers";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    const uid = userId(session);
    const role = userRole(session);
    const { skip, limit } = paginate(req);
    const url = new URL(req.url);
    const status = url.searchParams.get("status") ?? undefined;

    const orderWhere =
      role === "admin" || role === "finanzas"
        ? { payment: { isNot: null }, ...(status && { payment: { status } }) }
        : { buyerId: uid, payment: { isNot: null }, ...(status && { payment: { status } }) };

    const [data, total] = await Promise.all([
      prisma.order.findMany({
        where: orderWhere,
        select: {
          id: true, totalAmount: true, currency: true, status: true, createdAt: true,
          payment: true,
          vendor: { select: { company: { select: { name: true } } } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.order.count({ where: orderWhere }),
    ]);

    return ok({ data, total, page: Math.floor(skip / limit) + 1, limit });
  } catch (e) {
    if (e instanceof Response) return e;
    return err("No autenticado", 401);
  }
}
