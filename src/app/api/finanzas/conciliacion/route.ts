import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth, userRole, ok, err, paginate } from "@/lib/api/helpers";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    if (!["finanzas", "admin"].includes(userRole(session))) return err("Sin permiso", 403);
    const { skip, limit } = paginate(req);
    const url = new URL(req.url);
    const status = url.searchParams.get("status") ?? undefined;

    const where = { payment: { isNot: null }, ...(status && { payment: { status } }) };

    const [data, total] = await Promise.all([
      prisma.order.findMany({
        where,
        select: {
          id: true, totalAmount: true, taxAmount: true, currency: true, status: true, createdAt: true,
          payment: true,
          commission: true,
          vendor: { select: { company: { select: { name: true } } } },
          buyer: { select: { email: true, profile: { select: { firstName: true, lastName: true } } } },
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
