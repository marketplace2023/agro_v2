import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth, userId, userRole, ok, err } from "@/lib/api/helpers";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const session = await requireAuth();
    const uid = userId(session);
    const role = userRole(session);
    const { id } = await params;

    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        messages: { orderBy: { createdAt: "asc" }, include: { ticket: false } },
        order: true,
        buyer: { select: { email: true, profile: { select: { firstName: true, lastName: true, phone: true } } } },
        assignedTo: { select: { profile: { select: { firstName: true, lastName: true } } } },
      },
    });

    if (!ticket) return err("Ticket no encontrado", 404);
    if (ticket.buyerId !== uid && role !== "soporte" && role !== "admin") return err("Sin permiso", 403);

    return ok(ticket);
  } catch (e) {
    if (e instanceof Response) return e;
    return err("No autenticado", 401);
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const session = await requireAuth();
    const role = userRole(session);
    const uid = userId(session);
    if (!["soporte", "admin"].includes(role)) return err("Sin permiso", 403);

    const { id } = await params;
    const { status, assignedToId, priority, message } = await req.json();

    const ticket = await prisma.ticket.update({
      where: { id },
      data: {
        ...(status && { status, ...(status === "resuelto" && { resolvedAt: new Date() }) }),
        ...(assignedToId && { assignedToId }),
        ...(priority && { priority }),
        ...(message && { messages: { create: { authorId: uid, content: message, isInternal: false } } }),
      },
      include: { messages: { orderBy: { createdAt: "desc" }, take: 1 } },
    });

    return ok(ticket);
  } catch (e) {
    if (e instanceof Response) return e;
    return err("Error actualizando ticket", 500);
  }
}
