import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth, userRole, ok, err } from "@/lib/api/helpers";

type Params = { params: Promise<{ id: string }> };
const VENDOR_ROLES = ["vendedor", "fabricante", "distribuidor", "admin"];

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const session = await requireAuth();
    if (!VENDOR_ROLES.includes(userRole(session))) return err("Sin permiso", 403);
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: { brand: true, category: true, variants: true, vendorListings: true, documents: true, regulatoryRecords: true },
    });
    if (!product) return err("Producto no encontrado", 404);
    return ok(product);
  } catch (e) {
    if (e instanceof Response) return e;
    return err("No autenticado", 401);
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const session = await requireAuth();
    if (!VENDOR_ROLES.includes(userRole(session))) return err("Sin permiso", 403);
    const { id } = await params;
    const body = await req.json();

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        technicalDesc: body.technicalDesc,
        cropTypes: body.cropTypes,
        targetPests: body.targetPests,
        isRegulated: body.isRegulated,
        isBiological: body.isBiological,
        isOrganic: body.isOrganic,
      },
      include: { variants: true },
    });
    return ok(product);
  } catch (e) {
    if (e instanceof Response) return e;
    return err("Error actualizando producto", 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const session = await requireAuth();
    if (!["admin"].includes(userRole(session))) return err("Sin permiso", 403);
    const { id } = await params;
    await prisma.product.delete({ where: { id } });
    return ok({ message: "Producto eliminado" });
  } catch (e) {
    if (e instanceof Response) return e;
    return err("Error eliminando producto", 500);
  }
}
