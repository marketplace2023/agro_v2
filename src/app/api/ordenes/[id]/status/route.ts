import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth, userRole, ok, err } from "@/lib/api/helpers";

type Params = { params: Promise<{ id: string }> };

const VENDOR_ALLOWED = ["confirmada", "en_preparacion", "despachada", "cancelada"];
const ADMIN_ALLOWED = ["confirmada", "en_preparacion", "despachada", "en_transito", "entregada", "cancelada", "en_reclamo", "devuelta"];

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const session = await requireAuth();
    const role = userRole(session);
    const { id } = await params;
    const { status, notes } = await req.json();

    const allowed = role === "admin" || role === "soporte" ? ADMIN_ALLOWED : VENDOR_ALLOWED;
    if (!allowed.includes(status)) return err(`Estado '${status}' no permitido para tu rol`, 403);

    const order = await prisma.order.update({
      where: { id },
      data: { status, ...(notes && { notes }) },
      include: { tracking: true },
    });

    return ok(order);
  } catch (e) {
    if (e instanceof Response) return e;
    return err("Error actualizando estado", 500);
  }
}
