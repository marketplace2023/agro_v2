import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth, userId, userRole, ok, err, paginate } from "@/lib/api/helpers";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    const uid = userId(session);
    const role = userRole(session);
    const { skip, limit } = paginate(req);

    const vendor = await prisma.vendor.findFirst({ where: { company: { users: { some: { id: uid } } } }, select: { id: true } });
    if (!vendor && role !== "admin" && role !== "finanzas") return err("Vendor no encontrado", 404);

    const where = vendor ? { vendorId: vendor.id } : {};

    const [data, total] = await Promise.all([
      prisma.settlement.findMany({
        where,
        include: { analyst: { select: { profile: { select: { firstName: true, lastName: true } } } } },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.settlement.count({ where }),
    ]);

    return ok({ data, total, page: Math.floor(skip / limit) + 1, limit });
  } catch (e) {
    if (e instanceof Response) return e;
    return err("No autenticado", 401);
  }
}
