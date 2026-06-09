import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";

// GET /api/admin/auditoria?module=&action=&userId=&ip=&from=&to=&entityType=&entityId=&page=
export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const role = (session.user as { role?: string }).role;
  if (role !== "admin" && role !== "regulatorio" && role !== "finanzas") {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const module    = searchParams.get("module");
  const action    = searchParams.get("action");
  const userId    = searchParams.get("userId");
  const ip        = searchParams.get("ip");
  const from      = searchParams.get("from");
  const to        = searchParams.get("to");
  const entityType = searchParams.get("entityType");
  const entityId   = searchParams.get("entityId");
  const page      = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit     = 25;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: Record<string, any> = {};
  if (module)     where.module     = { contains: module,  mode: "insensitive" };
  if (action)     where.action     = { contains: action,  mode: "insensitive" };
  if (userId)     where.userId     = userId;
  if (ip)         where.ipAddress  = { contains: ip };
  if (entityType) where.entityType = entityType;
  if (entityId)   where.entityId   = entityId;
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to)   where.createdAt.lte = new Date(to);
  }

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      include: { user: { select: { email: true, profile: { select: { firstName: true, lastName: true } } } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.auditLog.count({ where }),
  ]);

  return NextResponse.json({ logs, total, page, pages: Math.ceil(total / limit) });
}
