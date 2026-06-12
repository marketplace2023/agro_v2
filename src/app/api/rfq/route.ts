import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth, userId, userRole, ok, err, paginate } from "@/lib/api/helpers";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    const role = userRole(session);
    const uid = userId(session);
    const { skip, limit } = paginate(req);
    const url = new URL(req.url);
    const status = url.searchParams.get("status") ?? undefined;

    const isVendor = ["vendedor", "fabricante", "distribuidor"].includes(role);

    const where = {
      ...(status && { status: status as never }),
      ...(role === "comprador" && { buyerId: uid }),
    };

    const [data, total] = await Promise.all([
      prisma.rFQ.findMany({
        where,
        include: {
          buyer: { select: { profile: { select: { companyName: true, firstName: true, lastName: true } } } },
          offers: isVendor
            ? { where: { vendorId: uid }, select: { id: true, price: true, currency: true, deliveryDays: true, status: true } }
            : { select: { id: true, vendorId: true, price: true, currency: true, deliveryDays: true, status: true } },
          _count: { select: { offers: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.rFQ.count({ where }),
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
    if (!["comprador", "admin"].includes(role)) return err("Solo compradores pueden crear RFQs", 403);

    const { productName, description, quantity, unit, deliveryDate, deliveryAddress, budget, currency, specifications } = await req.json();
    if (!productName || !quantity || !unit) return err("productName, quantity y unit son requeridos", 400);

    const rfq = await prisma.rFQ.create({
      data: {
        buyerId: uid,
        productName,
        description,
        quantity: Number(quantity),
        unit,
        deliveryDate: deliveryDate ? new Date(deliveryDate) : null,
        deliveryAddress,
        budget,
        currency: currency ?? "COP",
        specifications: specifications ?? {},
        status: "abierto",
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    return ok(rfq, 201);
  } catch (e) {
    if (e instanceof Response) return e;
    return err("Error creando RFQ", 500);
  }
}
