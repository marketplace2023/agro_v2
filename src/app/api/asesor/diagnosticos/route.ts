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

    const where = {
      ...(status && { status: status as never }),
      ...(!["asesor", "admin"].includes(role) && { userId: uid }),
    };

    const [data, total] = await Promise.all([
      prisma.diagnostic.findMany({
        where,
        include: {
          user: { select: { profile: { select: { firstName: true, lastName: true } } } },
          asesor: { select: { profile: { select: { firstName: true, lastName: true } } } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.diagnostic.count({ where }),
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
    if (!["asesor", "admin"].includes(role)) return err("Solo asesores pueden crear diagnósticos", 403);

    const { clientId, cropType, area, soilType, irrigationType, notes, recommendations } = await req.json();
    if (!clientId || !cropType) return err("clientId y cropType son requeridos", 400);

    const diagnostic = await prisma.diagnostic.create({
      data: { userId: clientId, asesorId: uid, cropType, area, soilType, irrigationType, notes, recommendations, status: "borrador" },
    });

    return ok(diagnostic, 201);
  } catch (e) {
    if (e instanceof Response) return e;
    return err("Error creando diagnóstico", 500);
  }
}
