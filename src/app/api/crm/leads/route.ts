import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth, userRole, ok, err, paginate } from "@/lib/api/helpers";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    const role = userRole(session);
    if (!["vendedor", "representante", "admin"].includes(role)) return err("Sin permiso", 403);

    const { skip, limit } = paginate(req);
    const url = new URL(req.url);
    const q = url.searchParams.get("q") ?? "";

    const where = q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" as const } },
            { commercialName: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      prisma.company.findMany({
        where,
        include: {
          users: {
            take: 1,
            select: {
              id: true,
              email: true,
              profile: { select: { firstName: true, lastName: true, phone: true } },
            },
          },
          orders: {
            orderBy: { createdAt: "desc" },
            take: 5,
            select: { id: true, totalAmount: true, status: true, createdAt: true },
          },
          credit: { select: { limit: true, status: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.company.count({ where }),
    ]);

    return ok({ data, total, page: Math.floor(skip / limit) + 1, limit });
  } catch (e) {
    if (e instanceof Response) return e;
    return err("No autenticado", 401);
  }
}
