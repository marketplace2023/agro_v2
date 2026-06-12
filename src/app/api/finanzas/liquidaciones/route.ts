import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth, userId, userRole, ok, err, paginate } from "@/lib/api/helpers";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    const role = userRole(session);
    const uid = userId(session);
    if (!["finanzas", "admin"].includes(role)) return err("Sin permiso", 403);
    const { skip, limit } = paginate(req);
    const url = new URL(req.url);
    const status = url.searchParams.get("status") ?? undefined;

    const where = { ...(status && { status }) };

    const [data, total] = await Promise.all([
      prisma.settlement.findMany({
        where,
        include: {
          vendor: { select: { company: { select: { name: true } } } },
          analyst: { select: { profile: { select: { firstName: true, lastName: true } } } },
        },
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

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    const role = userRole(session);
    const uid = userId(session);
    if (!["finanzas", "admin"].includes(role)) return err("Sin permiso", 403);

    const { vendorId, period, grossAmount, commissionAmount, returnsAmount, retentionAmount, netAmount } = await req.json();
    if (!vendorId || !period || grossAmount === undefined || netAmount === undefined) return err("Faltan campos requeridos", 400);

    const settlement = await prisma.settlement.create({
      data: { vendorId, analystId: uid, period, grossAmount, commissionAmount: commissionAmount ?? 0, returnsAmount: returnsAmount ?? 0, retentionAmount: retentionAmount ?? 0, netAmount, status: "pendiente" },
    });

    return ok(settlement, 201);
  } catch (e) {
    if (e instanceof Response) return e;
    return err("Error creando liquidación", 500);
  }
}
