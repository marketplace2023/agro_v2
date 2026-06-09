import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { createAuditLog } from "@/lib/audit/log";

interface RouteParams { params: Promise<{ productId: string }> }

// POST /api/regulatorio/[productId]/aprobar
export async function POST(req: Request, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const role = (session.user as { role?: string }).role;
  if (role !== "regulatorio" && role !== "admin") {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
  }

  const { productId } = await params;
  const body = await req.json() as {
    country: string;
    registrationNum: string;
    authority: string;
    issuedAt: string;
    expiresAt: string;
    notes?: string;
  };

  const { country, registrationNum, authority, issuedAt, expiresAt, notes } = body;

  if (!country || !registrationNum || !authority || !issuedAt || !expiresAt) {
    return NextResponse.json({ error: "Campos obligatorios: country, registrationNum, authority, issuedAt, expiresAt" }, { status: 400 });
  }

  // Validate product exists and is regulated
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, name: true, isRegulated: true, status: true },
  });

  if (!product) return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  if (!product.isRegulated) return NextResponse.json({ error: "Producto no requiere registro regulatorio" }, { status: 400 });

  const existing = await prisma.regulatoryRecord.findUnique({
    where: { productId_country: { productId, country } },
  });

  // Upsert regulatory record for this country
  const record = await prisma.regulatoryRecord.upsert({
    where: { productId_country: { productId, country } },
    create: {
      productId,
      country,
      authority,
      registrationNum,
      issuedAt: new Date(issuedAt),
      expiresAt: new Date(expiresAt),
      status: "aprobado",
    },
    update: {
      authority,
      registrationNum,
      issuedAt: new Date(issuedAt),
      expiresAt: new Date(expiresAt),
      status: "aprobado",
    },
  });

  // Check if all regulated records for this product are approved → activate product
  const allRecords = await prisma.regulatoryRecord.findMany({
    where: { productId },
    select: { status: true },
  });

  const allApproved = allRecords.length > 0 && allRecords.every(r => r.status === "aprobado");

  if (allApproved && product.status !== "aprobado") {
    await prisma.product.update({
      where: { id: productId },
      data: { status: "aprobado", publishedAt: new Date() },
    });
  }

  // Immutable audit log
  const ipAddress = (req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "unknown").split(",")[0].trim();
  await createAuditLog({
    userId: (session.user as { id?: string }).id ?? "unknown",
    userRole: role ?? "regulatorio",
    module: "Regulatorio",
    action: "aprobar_registro",
    entityType: "RegulatoryRecord",
    entityId: record.id,
    ipAddress,
    fieldsBefore: existing ? { status: existing.status, registrationNum: existing.registrationNum } : {},
    fieldsAfter: { status: "aprobado", registrationNum, country, expiresAt },
    comment: notes,
  });

  return NextResponse.json({ record, productActivated: allApproved });
}
