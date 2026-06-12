import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth, userRole, ok, err } from "@/lib/api/helpers";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const session = await requireAuth();
    if (userRole(session) !== "admin") return err("Sin permiso", 403);
    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true, email: true, role: true, createdAt: true, emailVerified: true,
        profile: true,
        orders: { select: { id: true, status: true, total: true, createdAt: true }, orderBy: { createdAt: "desc" }, take: 5 },
        credit: { select: { id: true, status: true, limit: true } },
      },
    });

    if (!user) return err("Usuario no encontrado", 404);
    return ok(user);
  } catch (e) {
    if (e instanceof Response) return e;
    return err("No autenticado", 401);
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const session = await requireAuth();
    if (userRole(session) !== "admin") return err("Sin permiso", 403);
    const { id } = await params;

    const { role, firstName, lastName, phone, companyName, isActive } = await req.json();

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(role && { role }),
        profile: {
          upsert: {
            create: { firstName: firstName ?? "", lastName: lastName ?? "", phone, companyName },
            update: { ...(firstName !== undefined && { firstName }), ...(lastName !== undefined && { lastName }), ...(phone !== undefined && { phone }), ...(companyName !== undefined && { companyName }) },
          },
        },
      },
      select: {
        id: true, email: true, role: true,
        profile: { select: { firstName: true, lastName: true, phone: true, companyName: true } },
      },
    });

    return ok(user);
  } catch (e) {
    if (e instanceof Response) return e;
    return err("Error actualizando usuario", 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const session = await requireAuth();
    if (userRole(session) !== "admin") return err("Sin permiso", 403);
    const { id } = await params;

    const existing = await prisma.user.findUnique({ where: { id }, select: { id: true } });
    if (!existing) return err("Usuario no encontrado", 404);

    await prisma.user.delete({ where: { id } });
    return ok({ message: "Usuario eliminado" });
  } catch (e) {
    if (e instanceof Response) return e;
    return err("Error eliminando usuario", 500);
  }
}
