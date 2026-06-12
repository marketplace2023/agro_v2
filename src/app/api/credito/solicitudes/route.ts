import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth, userRole, ok, err, paginate } from "@/lib/api/helpers";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    if (!["credito", "finanzas", "admin"].includes(userRole(session))) return err("Sin permiso", 403);
    const { skip, limit } = paginate(req);
    const url = new URL(req.url);
    const status = url.searchParams.get("status") ?? undefined;

    const where = { ...(status && { status: status as never }) };

    const [data, total] = await Promise.all([
      prisma.credit.findMany({
        where,
        include: { company: { select: { id: true, name: true, commercialName: true, country: true, nit: true } } },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.credit.count({ where }),
    ]);

    return ok({ data, total, page: Math.floor(skip / limit) + 1, limit });
  } catch (e) {
    if (e instanceof Response) return e;
    return err("No autenticado", 401);
  }
}
