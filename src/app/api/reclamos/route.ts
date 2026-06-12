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

    const where =
      role === "soporte" || role === "admin"
        ? { type: "reclamo" as const, ...(status && { status: status as never }) }
        : { buyerId: uid, type: "reclamo" as const, ...(status && { status: status as never }) };

    const [data, total] = await Promise.all([
      prisma.ticket.findMany({
        where,
        include: {
          messages: { orderBy: { createdAt: "asc" }, include: { ticket: false } },
          order: { select: { id: true, totalAmount: true, createdAt: true, vendor: { select: { company: { select: { name: true } } } } } },
          assignedTo: { select: { id: true, profile: { select: { firstName: true, lastName: true } } } },
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
    const { orderId, subject, description, priority } = await req.json();

    if (!subject || !description) return err("subject y description son requeridos", 400);

    const ticket = await prisma.ticket.create({
      data: {
        buyerId: uid,
        orderId: orderId ?? null,
        type: "reclamo",
        priority: priority ?? "media",
        subject,
        messages: { create: { authorId: uid, content: description } },
      },
      include: { messages: true },
    });

    return ok(ticket, 201);
  } catch (e) {
    if (e instanceof Response) return e;
    return err("Error creando reclamo", 500);
  }
}
