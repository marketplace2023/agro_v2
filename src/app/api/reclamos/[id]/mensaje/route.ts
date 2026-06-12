import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth, userId, ok, err } from "@/lib/api/helpers";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const session = await requireAuth();
    const uid = userId(session);
    const { id } = await params;
    const { content, isInternal } = await req.json();

    if (!content?.trim()) return err("El contenido no puede estar vacío", 400);

    const ticket = await prisma.ticket.findUnique({ where: { id } });
    if (!ticket) return err("Reclamo no encontrado", 404);

    const message = await prisma.ticketMessage.create({
      data: { ticketId: id, authorId: uid, content, isInternal: isInternal ?? false },
    });

    if (ticket.status === "cerrado") {
      await prisma.ticket.update({ where: { id }, data: { status: "abierto" } });
    }

    return ok(message, 201);
  } catch (e) {
    if (e instanceof Response) return e;
    return err("Error enviando mensaje", 500);
  }
}
