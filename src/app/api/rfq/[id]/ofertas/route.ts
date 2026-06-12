import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth, userId, userRole, ok, err } from "@/lib/api/helpers";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const session = await requireAuth();
    const role = userRole(session);
    const uid = userId(session);
    const { id } = await params;

    const rfq = await prisma.rFQ.findUnique({ where: { id }, select: { id: true, buyerId: true, status: true } });
    if (!rfq) return err("RFQ no encontrado", 404);

    const isVendor = ["vendedor", "fabricante", "distribuidor"].includes(role);
    const isBuyer = rfq.buyerId === uid;
    const isAdmin = role === "admin";

    if (!isVendor && !isBuyer && !isAdmin) return err("Sin permiso", 403);

    const where = {
      rfqId: id,
      ...(isVendor && !isAdmin ? { vendorId: uid } : {}),
    };

    const offers = await prisma.rFQOffer.findMany({
      where,
      include: {
        vendor: { select: { profile: { select: { companyName: true, firstName: true, lastName: true } } } },
      },
      orderBy: { createdAt: "asc" },
    });

    return ok({ data: offers, total: offers.length });
  } catch (e) {
    if (e instanceof Response) return e;
    return err("No autenticado", 401);
  }
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const session = await requireAuth();
    const role = userRole(session);
    const uid = userId(session);
    if (!["vendedor", "fabricante", "distribuidor"].includes(role)) return err("Solo vendedores pueden hacer ofertas", 403);

    const { id } = await params;

    const rfq = await prisma.rFQ.findUnique({ where: { id }, select: { id: true, status: true, expiresAt: true } });
    if (!rfq) return err("RFQ no encontrado", 404);
    if (rfq.status !== "abierto") return err("El RFQ no está abierto", 400);
    if (rfq.expiresAt && rfq.expiresAt < new Date()) return err("El RFQ ha expirado", 400);

    const existing = await prisma.rFQOffer.findFirst({ where: { rfqId: id, vendorId: uid } });
    if (existing) return err("Ya enviaste una oferta para este RFQ", 409);

    const { price, currency, deliveryDays, notes, attachments } = await req.json();
    if (!price || !deliveryDays) return err("price y deliveryDays son requeridos", 400);

    const offer = await prisma.rFQOffer.create({
      data: { rfqId: id, vendorId: uid, price: Number(price), currency: currency ?? "COP", deliveryDays: Number(deliveryDays), notes, attachments: attachments ?? [], status: "enviada" },
    });

    return ok(offer, 201);
  } catch (e) {
    if (e instanceof Response) return e;
    return err("Error creando oferta", 500);
  }
}
