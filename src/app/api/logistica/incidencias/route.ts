import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth, userId, userRole, ok, err, paginate } from "@/lib/api/helpers";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    if (!["logistica", "admin", "soporte", "vendedor"].includes(userRole(session))) return err("Sin permiso", 403);
    const { skip, limit } = paginate(req);
    const url = new URL(req.url);
    const status = url.searchParams.get("status") ?? undefined;

    const where = { ...(status && { status: status as never }) };

    const [data, total] = await Promise.all([
      prisma.incident.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: limit }),
      prisma.incident.count({ where }),
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
    const uid = userId(session);
    if (!["logistica", "admin", "vendedor"].includes(userRole(session))) return err("Sin permiso", 403);

    const { orderId, type, description, evidenceUrls } = await req.json();
    if (!orderId || !type || !description) return err("orderId, type y description son requeridos", 400);

    const incident = await prisma.incident.create({
      data: { orderId, type, description, evidenceUrls: evidenceUrls ?? [] },
    });

    return ok(incident, 201);
  } catch (e) {
    if (e instanceof Response) return e;
    return err("Error creando incidencia", 500);
  }
}
