import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { createAuditLog } from "@/lib/audit/log";

interface RouteParams { params: Promise<{ productId: string }> }

// POST /api/regulatorio/[productId]/rechazar
export async function POST(req: Request, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const role = (session.user as { role?: string }).role;
  if (role !== "regulatorio" && role !== "admin") {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
  }

  const { productId } = await params;
  const body = await req.json() as { country?: string; notes: string };
  const { country, notes } = body;

  if (!notes) return NextResponse.json({ error: "El motivo de rechazo es obligatorio" }, { status: 400 });

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, name: true, status: true },
  });
  if (!product) return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });

  const ipAddress = (req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "unknown").split(",")[0].trim();

  if (country) {
    // Reject a specific country's record
    const existing = await prisma.regulatoryRecord.findUnique({
      where: { productId_country: { productId, country } },
    });

    const record = await prisma.regulatoryRecord.upsert({
      where: { productId_country: { productId, country } },
      create: {
        productId, country, authority: "", registrationNum: "",
        issuedAt: new Date(), expiresAt: new Date(),
        status: "rechazado",
      },
      update: { status: "rechazado" },
    });

    await createAuditLog({
      userId: (session.user as { id?: string }).id ?? "unknown",
      userRole: role ?? "regulatorio",
      module: "Regulatorio",
      action: "rechazar_registro",
      entityType: "RegulatoryRecord",
      entityId: record.id,
      ipAddress,
      fieldsBefore: { status: existing?.status ?? "pendiente", country },
      fieldsAfter: { status: "rechazado", country },
      comment: notes,
    });

    return NextResponse.json({ record });
  }

  // Reject all pending records for this product and block the product
  await prisma.regulatoryRecord.updateMany({
    where: { productId, status: "pendiente" },
    data: { status: "rechazado" },
  });

  await prisma.product.update({
    where: { id: productId },
    data: { status: "rechazado" },
  });

  await createAuditLog({
    userId: (session.user as { id?: string }).id ?? "unknown",
    userRole: role ?? "regulatorio",
    module: "Regulatorio",
    action: "rechazar_producto",
    entityType: "Product",
    entityId: productId,
    ipAddress,
    fieldsBefore: { status: product.status },
    fieldsAfter: { status: "rechazado" },
    comment: notes,
  });

  return NextResponse.json({ rejected: true });
}
