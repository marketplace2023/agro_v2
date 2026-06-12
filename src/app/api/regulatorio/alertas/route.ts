import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth, userRole, ok, err } from "@/lib/api/helpers";

// Alertas = registros que vencen en los próximos 60 días o ya vencidos
export async function GET(_req: NextRequest) {
  try {
    const session = await requireAuth();
    if (!["regulatorio", "admin"].includes(userRole(session))) return err("Sin permiso", 403);

    const now = new Date();
    const in60Days = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);

    const [expiring, expired, pendingDocs] = await Promise.all([
      prisma.regulatoryRecord.findMany({
        where: { expiresAt: { gte: now, lte: in60Days }, status: "aprobado" },
        include: { product: { select: { name: true, slug: true } } },
        orderBy: { expiresAt: "asc" },
        take: 50,
      }),
      prisma.regulatoryRecord.findMany({
        where: { expiresAt: { lt: now }, status: { not: "vencido" } },
        include: { product: { select: { name: true, slug: true } } },
        take: 50,
      }),
      prisma.document.findMany({
        where: { status: "pendiente" },
        include: { product: { select: { name: true } } },
        orderBy: { createdAt: "asc" },
        take: 20,
      }),
    ]);

    return ok({ expiring, expired, pendingDocs, counts: { expiring: expiring.length, expired: expired.length, pendingDocs: pendingDocs.length } });
  } catch (e) {
    if (e instanceof Response) return e;
    return err("No autenticado", 401);
  }
}
