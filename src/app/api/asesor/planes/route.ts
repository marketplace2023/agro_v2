import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth, userId, userRole, ok, err, paginate } from "@/lib/api/helpers";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    const role = userRole(session);
    const uid = userId(session);
    if (!["asesor", "admin", "comprador"].includes(role)) return err("Sin permiso", 403);
    const { skip, limit } = paginate(req);
    const url = new URL(req.url);
    const status = url.searchParams.get("status") ?? undefined;
    const diagnosticId = url.searchParams.get("diagnosticId") ?? undefined;

    const where = {
      ...(status && { status: status as never }),
      ...(diagnosticId && { diagnosticId }),
      ...(!["asesor", "admin"].includes(role) && { diagnostic: { userId: uid } }),
    };

    const [data, total] = await Promise.all([
      prisma.agroPlan.findMany({
        where,
        include: {
          diagnostic: {
            select: { cropType: true, user: { select: { profile: { select: { firstName: true, lastName: true } } } } },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.agroPlan.count({ where }),
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
    if (!["asesor", "admin"].includes(role)) return err("Solo asesores pueden crear planes", 403);

    const { diagnosticId, title, description, phases, products, estimatedCost, startsAt, endsAt } = await req.json();
    if (!diagnosticId || !title) return err("diagnosticId y title son requeridos", 400);

    const plan = await prisma.agroPlan.create({
      data: { diagnosticId, title, description, phases: phases ?? [], products: products ?? [], estimatedCost, startsAt: startsAt ? new Date(startsAt) : null, endsAt: endsAt ? new Date(endsAt) : null, status: "borrador" },
    });

    return ok(plan, 201);
  } catch (e) {
    if (e instanceof Response) return e;
    return err("Error creando plan", 500);
  }
}
