import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth, userId, ok, err } from "@/lib/api/helpers";

export async function GET() {
  try {
    const session = await requireAuth();
    const uid = userId(session);

    const user = await prisma.user.findUnique({
      where: { id: uid },
      select: {
        id: true, email: true, role: true, verified: true, createdAt: true,
        profile: { select: { firstName: true, lastName: true, phone: true, country: true, city: true, bio: true, avatarUrl: true, cropTypes: true, volumeRange: true } },
        company: { select: { id: true, name: true, commercialName: true, nit: true, type: true, country: true, city: true, address: true } },
      },
    });

    if (!user) return err("Usuario no encontrado", 404);
    return ok(user);
  } catch (e) {
    if (e instanceof Response) return e;
    return err("No autenticado", 401);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await requireAuth();
    const uid = userId(session);
    const body = await req.json();

    const { firstName, lastName, phone, country, city, bio, cropTypes, volumeRange } = body;

    const profile = await prisma.userProfile.upsert({
      where: { userId: uid },
      update: { firstName, lastName, phone, country, city, bio, cropTypes, volumeRange },
      create: { userId: uid, firstName: firstName ?? "", lastName: lastName ?? "", phone, country, city, bio, cropTypes, volumeRange },
    });

    return ok(profile);
  } catch (e) {
    if (e instanceof Response) return e;
    return err("Error actualizando perfil", 500);
  }
}
