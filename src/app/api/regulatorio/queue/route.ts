import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import type { RegulatoryStatus } from "@/generated/prisma";

// GET /api/regulatorio/queue?status=&country=&category=&page=
export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const role = (session.user as { role?: string }).role;
  if (role !== "regulatorio" && role !== "admin") {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") as "pendiente" | "rechazado" | "vencido" | null;
  const country = searchParams.get("country");
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = 20;

  const defaultStatuses: RegulatoryStatus[] = ["pendiente", "rechazado", "vencido"];
  const where = {
    ...(status ? { status } : { status: { in: defaultStatuses } }),
    ...(country ? { country } : {}),
  };

  const [records, total] = await Promise.all([
    prisma.regulatoryRecord.findMany({
      where,
      include: {
        product: {
          select: {
            id: true, name: true, slug: true, status: true,
            category: { select: { name: true } },
            brand:    { select: { name: true } },
            documents: { select: { id: true, status: true, type: true }, where: { status: "pendiente" } },
          },
        },
      },
      orderBy: { updatedAt: "asc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.regulatoryRecord.count({ where }),
  ]);

  return NextResponse.json({ records, total, page, pages: Math.ceil(total / limit) });
}
