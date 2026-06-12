import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth, userId, userRole, ok, err } from "@/lib/api/helpers";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const session = await requireAuth();
    const role = userRole(session);
    const uid = userId(session);
    if (!["credito", "finanzas", "admin"].includes(role)) return err("Sin permiso", 403);

    const { id } = await params;
    const { notes } = await req.json();

    const credit = await prisma.credit.update({
      where: { id },
      data: { status: "bloqueado", analystId: uid, notes },
    });

    return ok(credit);
  } catch (e) {
    if (e instanceof Response) return e;
    return err("Error rechazando solicitud", 500);
  }
}
