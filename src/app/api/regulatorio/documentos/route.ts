import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth, userId, userRole, ok, err, paginate } from "@/lib/api/helpers";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    if (!["regulatorio", "admin", "fabricante", "vendedor"].includes(userRole(session))) return err("Sin permiso", 403);
    const { skip, limit } = paginate(req);
    const url = new URL(req.url);
    const status = url.searchParams.get("status") ?? undefined;
    const type = url.searchParams.get("type") ?? undefined;

    const where = { ...(status && { status: status as never }), ...(type && { type: type as never }) };

    const [data, total] = await Promise.all([
      prisma.document.findMany({
        where,
        include: { product: { select: { name: true, slug: true } }, uploadedBy: { select: { profile: { select: { firstName: true, lastName: true } } } } },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.document.count({ where }),
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
    if (!["regulatorio", "admin", "fabricante", "vendedor"].includes(role)) return err("Sin permiso", 403);

    const { productId, type, title, fileUrl, country, expiresAt } = await req.json();
    if (!productId || !type || !title || !fileUrl) return err("Faltan campos requeridos", 400);

    const doc = await prisma.document.create({
      data: { productId, type, title, fileUrl, country, expiresAt: expiresAt ? new Date(expiresAt) : null, uploadedById: uid, status: "pendiente" },
    });

    return ok(doc, 201);
  } catch (e) {
    if (e instanceof Response) return e;
    return err("Error subiendo documento", 500);
  }
}
