import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth, userRole, ok, err, paginate } from "@/lib/api/helpers";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    if (userRole(session) !== "admin") return err("Sin permiso", 403);
    const { skip, limit } = paginate(req);
    const url = new URL(req.url);
    const role = url.searchParams.get("role") ?? undefined;
    const search = url.searchParams.get("search") ?? undefined;

    const where = {
      ...(role && { role: role as never }),
      ...(search && {
        OR: [
          { email: { contains: search, mode: "insensitive" as never } },
          { profile: { firstName: { contains: search, mode: "insensitive" as never } } },
          { profile: { lastName: { contains: search, mode: "insensitive" as never } } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true, email: true, role: true, createdAt: true, emailVerified: true,
          profile: { select: { firstName: true, lastName: true, phone: true, companyName: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return ok({ data, total, page: Math.floor(skip / limit) + 1, limit });
  } catch (e) {
    if (e instanceof Response) return e;
    return err("No autenticado", 401);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    if (userRole(session) !== "admin") return err("Sin permiso", 403);

    const { email, role, firstName, lastName, phone, companyName } = await req.json();
    if (!email || !role) return err("email y role son requeridos", 400);

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return err("El email ya está registrado", 409);

    const user = await prisma.user.create({
      data: {
        email,
        role,
        profile: { create: { firstName: firstName ?? "", lastName: lastName ?? "", phone, companyName } },
      },
      select: {
        id: true, email: true, role: true, createdAt: true,
        profile: { select: { firstName: true, lastName: true } },
      },
    });

    return ok(user, 201);
  } catch (e) {
    if (e instanceof Response) return e;
    return err("Error creando usuario", 500);
  }
}
