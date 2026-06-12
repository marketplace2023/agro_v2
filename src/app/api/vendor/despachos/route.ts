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

    const vendor = await prisma.vendor.findFirst({ where: { company: { users: { some: { id: uid } } } }, select: { id: true } });
    if (!vendor && role !== "admin" && role !== "logistica") return err("Vendor no encontrado", 404);

    const where = {
      ...(vendor && { vendorId: vendor.id }),
      status: status ? status as never : { in: ["confirmada", "en_preparacion", "despachada", "en_transito"] as never[] },
    };

    const [data, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: { include: { product: { select: { name: true } }, variant: { select: { presentation: true, unit: true } } } },
          buyer: { select: { email: true, profile: { select: { firstName: true, lastName: true, phone: true } } } },
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
