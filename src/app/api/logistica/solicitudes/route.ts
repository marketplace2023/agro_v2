import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth, userRole, ok, err, paginate } from "@/lib/api/helpers";

const ALLOWED = ["logistica", "vendedor", "admin", "finanzas"];

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    if (!ALLOWED.includes(userRole(session))) return err("Sin permiso", 403);
    const { skip, limit } = paginate(req);
    const url = new URL(req.url);
    const status = url.searchParams.get("status") ?? undefined;

    const where = { status: status ? status as never : { in: ["confirmada", "en_preparacion", "despachada", "en_transito"] as never[] } };

    const [data, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: { include: { product: { select: { name: true } }, variant: { select: { presentation: true, unit: true } } } },
          buyer: { select: { email: true, profile: { select: { firstName: true, lastName: true, phone: true } } } },
          vendor: { select: { company: { select: { name: true } } } },
          tracking: true,
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
