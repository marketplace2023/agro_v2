import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth, userRole, ok, err } from "@/lib/api/helpers";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const session = await requireAuth();
    const role = userRole(session);
    if (!["vendedor", "representante", "admin", "finanzas"].includes(role)) return err("Sin permiso", 403);

    const { id } = await params;

    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        users: {
          take: 1,
          select: {
            id: true,
            email: true,
            profile: { select: { firstName: true, lastName: true, phone: true } },
          },
        },
        orders: {
          orderBy: { createdAt: "desc" },
          take: 30,
          select: {
            id: true,
            status: true,
            totalAmount: true,
            createdAt: true,
            items: { select: { product: { select: { name: true } }, quantity: true }, take: 1 },
          },
        },
        contracts: {
          orderBy: { createdAt: "desc" },
          take: 10,
          select: { id: true, status: true, totalAmount: true, startDate: true, endDate: true },
        },
        credit: { select: { limit: true, status: true } },
      },
    });

    if (!company) return err("Empresa no encontrada", 404);
    return ok(company);
  } catch (e) {
    if (e instanceof Response) return e;
    return err("No autenticado", 401);
  }
}
