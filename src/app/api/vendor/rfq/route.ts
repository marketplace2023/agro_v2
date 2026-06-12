import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth, userId, ok, err, paginate } from "@/lib/api/helpers";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    const uid = userId(session);
    const { skip, limit } = paginate(req);
    const url = new URL(req.url);
    const status = url.searchParams.get("status") ?? undefined;

    const vendor = await prisma.vendor.findFirst({ where: { company: { users: { some: { id: uid } } } }, select: { id: true } });
    if (!vendor) return err("Vendor no encontrado", 404);

    const where = {
      offers: { some: { vendorId: vendor.id } },
      ...(status && { status: status as never }),
    };

    const [data, total] = await Promise.all([
      prisma.rFQ.findMany({
        where,
        include: {
          items: true,
          offers: { where: { vendorId: vendor.id } },
          buyer: { select: { email: true, profile: { select: { firstName: true, lastName: true } } } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.rFQ.count({ where }),
    ]);

    return ok({ data, total, page: Math.floor(skip / limit) + 1, limit });
  } catch (e) {
    if (e instanceof Response) return e;
    return err("No autenticado", 401);
  }
}
