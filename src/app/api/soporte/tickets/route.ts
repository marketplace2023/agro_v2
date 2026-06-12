import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth, userId, userRole, ok, err, paginate } from "@/lib/api/helpers";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    const uid = userId(session);
    const role = userRole(session);
    const { skip, limit } = paginate(req);
    const url = new URL(req.url);
    const status = url.searchParams.get("status") ?? undefined;
    const type = url.searchParams.get("type") ?? undefined;
    const priority = url.searchParams.get("priority") ?? undefined;

    const where =
      role === "soporte" || role === "admin"
        ? { ...(status && { status: status as never }), ...(type && { type: type as never }), ...(priority && { priority: priority as never }) }
        : { buyerId: uid, ...(status && { status: status as never }), ...(type && { type: type as never }) };

    const [data, total] = await Promise.all([
      prisma.ticket.findMany({
        where,
        include: {
          messages: { orderBy: { createdAt: "asc" }, take: 1 },
          order: { select: { id: true, totalAmount: true } },
          assignedTo: { select: { profile: { select: { firstName: true, lastName: true } } } },
          buyer: { select: { email: true, profile: { select: { firstName: true, lastName: true } } } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.ticket.count({ where }),
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
    const { orderId, type, priority, subject, description } = await req.json();
    if (!type || !subject || !description) return err("type, subject y description son requeridos", 400);

    const ticket = await prisma.ticket.create({
      data: {
        buyerId: uid,
        orderId: orderId ?? null,
        type,
        priority: priority ?? "media",
        subject,
        messages: { create: { authorId: uid, content: description } },
      },
      include: { messages: true },
    });

    return ok(ticket, 201);
  } catch (e) {
    if (e instanceof Response) return e;
    return err("Error creando ticket", 500);
  }
}
