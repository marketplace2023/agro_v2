import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth, userRole, ok, err, paginate } from "@/lib/api/helpers";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    if (!["finanzas", "admin"].includes(userRole(session))) return err("Sin permiso", 403);
    const { skip, limit } = paginate(req);
    const url = new URL(req.url);
    const settled = url.searchParams.get("settled");

    const where = settled !== null ? { settled: settled === "true" } : {};

    const [data, total] = await Promise.all([
      prisma.commission.findMany({
        where,
        include: { order: { select: { id: true, totalAmount: true, currency: true, createdAt: true, vendor: { select: { company: { select: { name: true } } } } } } },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.commission.count({ where }),
    ]);

    const totalAmount = await prisma.commission.aggregate({ where, _sum: { amount: true } });

    return ok({ data, total, totalAmount: totalAmount._sum.amount ?? 0, page: Math.floor(skip / limit) + 1, limit });
  } catch (e) {
    if (e instanceof Response) return e;
    return err("No autenticado", 401);
  }
}
