import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth, userRole, ok, err, paginate } from "@/lib/api/helpers";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    if (!["marketing", "admin"].includes(userRole(session))) return err("Sin permiso", 403);
    const { skip, limit } = paginate(req);
    const url = new URL(req.url);
    const active = url.searchParams.get("active");

    const where = active !== null ? { isActive: active === "true" } : {};

    const [data, total] = await Promise.all([
      prisma.campaign.findMany({ where, orderBy: { startsAt: "desc" }, skip, take: limit }),
      prisma.campaign.count({ where }),
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
    if (!["marketing", "admin"].includes(userRole(session))) return err("Sin permiso", 403);

    const body = await req.json();
    const { name, type, startsAt, endsAt, discountRate, couponCode, minAmount, maxDiscount, maxUses } = body;
    if (!name || !type || !startsAt || !endsAt) return err("name, type, startsAt y endsAt son requeridos", 400);

    const campaign = await prisma.campaign.create({
      data: { name, type, startsAt: new Date(startsAt), endsAt: new Date(endsAt), discountRate, couponCode, minAmount, maxDiscount, maxUses, isActive: true },
    });

    return ok(campaign, 201);
  } catch (e) {
    if (e instanceof Response) return e;
    return err("Error creando campaña", 500);
  }
}
