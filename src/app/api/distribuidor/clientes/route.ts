import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth, userId, userRole, ok, err } from "@/lib/api/helpers";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    const uid = userId(session);
    const role = userRole(session);
    if (!["distribuidor", "admin"].includes(role)) return err("Sin permiso", 403);
    const url = new URL(req.url);
    const q = url.searchParams.get("q") ?? "";

    const vendor = await prisma.vendor.findFirst({
      where: { company: { users: { some: { id: uid } } } },
      select: { id: true },
    });

    if (!vendor && role !== "admin") return err("Distribuidor no encontrado", 404);

    const orders = await prisma.order.findMany({
      where: vendor ? { vendorId: vendor.id } : {},
      include: {
        buyer: {
          select: {
            id: true,
            email: true,
            profile: { select: { firstName: true, lastName: true } },
            company: { select: { name: true, commercialName: true, country: true, city: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const clientMap = new Map<string, {
      buyerId: string;
      name: string;
      email: string;
      company: string;
      city: string;
      country: string;
      totalOrders: number;
      totalAmount: number;
      lastOrderDate: string;
    }>();

    for (const order of orders) {
      const buyer = order.buyer;
      if (!buyer) continue;

      const name = buyer.profile
        ? `${buyer.profile.firstName} ${buyer.profile.lastName}`.trim()
        : buyer.email;
      const company = buyer.company?.commercialName ?? buyer.company?.name ?? "—";
      const city = buyer.company?.city ?? "—";
      const country = buyer.company?.country ?? "—";

      const existing = clientMap.get(buyer.id);
      if (existing) {
        existing.totalOrders++;
        existing.totalAmount += order.totalAmount;
        if (order.createdAt.toISOString() > existing.lastOrderDate) {
          existing.lastOrderDate = order.createdAt.toISOString().slice(0, 10);
        }
      } else {
        clientMap.set(buyer.id, {
          buyerId: buyer.id,
          name,
          email: buyer.email,
          company,
          city,
          country,
          totalOrders: 1,
          totalAmount: order.totalAmount,
          lastOrderDate: order.createdAt.toISOString().slice(0, 10),
        });
      }
    }

    let data = Array.from(clientMap.values());
    if (q) {
      const qLow = q.toLowerCase();
      data = data.filter(
        (c) => c.name.toLowerCase().includes(qLow) || c.company.toLowerCase().includes(qLow)
      );
    }

    return ok({ data, total: data.length });
  } catch (e) {
    if (e instanceof Response) return e;
    return err("No autenticado", 401);
  }
}
