import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth, userRole, ok, err, paginate } from "@/lib/api/helpers";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    if (!["regulatorio", "admin", "fabricante"].includes(userRole(session))) return err("Sin permiso", 403);
    const { skip, limit } = paginate(req);
    const url = new URL(req.url);
    const status = url.searchParams.get("status") ?? undefined;
    const country = url.searchParams.get("country") ?? undefined;

    const where = { ...(status && { status: status as never }), ...(country && { country }) };

    const [data, total] = await Promise.all([
      prisma.regulatoryRecord.findMany({
        where,
        include: { product: { select: { name: true, slug: true, brand: { select: { name: true } } } } },
        orderBy: { expiresAt: "asc" },
        skip,
        take: limit,
      }),
      prisma.regulatoryRecord.count({ where }),
    ]);

    return ok({ data, total, page: Math.floor(skip / limit) + 1, limit });
  } catch (e) {
    if (e instanceof Response) return e;
    return err("No autenticado", 401);
  }
}
