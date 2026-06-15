import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth, userId, userRole, ok, err, paginate } from "@/lib/api/helpers";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    const uid = userId(session);
    const role = userRole(session);
    if (!["distribuidor", "admin"].includes(role)) return err("Sin permiso", 403);
    const { skip, limit } = paginate(req);
    const url = new URL(req.url);
    const status = url.searchParams.get("status") ?? undefined;

    const vendor = await prisma.vendor.findFirst({
      where: { company: { users: { some: { id: uid } } } },
      select: { id: true },
    });

    if (!vendor && role !== "admin") return err("Distribuidor no encontrado", 404);

    const where = {
      ...(vendor && { vendorId: vendor.id }),
      ...(status && { status: status as never }),
    };

    const [data, total] = await Promise.all([
      prisma.contract.findMany({
        where,
        include: {
          buyerCompany: { select: { name: true, commercialName: true, country: true, city: true } },
          vendorCompany: { select: { name: true, commercialName: true } },
          items: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.contract.count({ where }),
    ]);

    return ok({ data, total, page: Math.floor(skip / limit) + 1, limit });
  } catch (e) {
    if (e instanceof Response) return e;
    return err("No autenticado", 401);
  }
}
