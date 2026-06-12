import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth, userId, userRole, ok, err, paginate } from "@/lib/api/helpers";

const ALLOWED = ["almacen", "vendedor", "admin", "logistica"];

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    const role = userRole(session);
    const uid = userId(session);
    if (!ALLOWED.includes(role)) return err("Sin permiso", 403);
    const { skip, limit } = paginate(req);
    const url = new URL(req.url);
    const vendorId = url.searchParams.get("vendorId") ?? undefined;
    const expiring = url.searchParams.get("expiring") === "true";

    const vendor = role === "vendedor"
      ? await prisma.vendor.findFirst({ where: { company: { users: { some: { id: uid } } } }, select: { id: true } })
      : null;

    const where = {
      ...(vendor ? { vendorId: vendor.id } : vendorId ? { vendorId } : {}),
      isActive: true,
      ...(expiring && { expiresAt: { lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) } }),
    };

    const [data, total] = await Promise.all([
      prisma.lote.findMany({ where, orderBy: { expiresAt: "asc" }, skip, take: limit }),
      prisma.lote.count({ where }),
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
    if (!ALLOWED.includes(role)) return err("Sin permiso", 403);

    const body = await req.json();
    const { vendorId, productId, loteCode, quantity, unit, manufacturedAt, expiresAt, warehouseLocation } = body;
    if (!vendorId || !productId || !loteCode || !quantity || !unit) return err("Faltan campos requeridos", 400);

    const lote = await prisma.lote.create({
      data: { vendorId, productId, loteCode, quantity, unit, manufacturedAt: manufacturedAt ? new Date(manufacturedAt) : null, expiresAt: expiresAt ? new Date(expiresAt) : null, warehouseLocation },
    });

    return ok(lote, 201);
  } catch (e) {
    if (e instanceof Response) return e;
    return err("Error creando lote", 500);
  }
}
