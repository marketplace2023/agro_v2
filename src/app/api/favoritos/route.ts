import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth, userId, ok, err } from "@/lib/api/helpers";

// Favoritos se almacenan en UserProfile.cropTypes como workaround hasta tener modelo Favorite en schema.
// Estructura: GET devuelve productos marcados, POST agrega, DELETE elimina por productId query param.

export async function GET(_req: NextRequest) {
  try {
    const session = await requireAuth();
    const uid = userId(session);

    // Leer IDs de favoritos desde el perfil (campo reutilizado temporalmente)
    const profile = await prisma.userProfile.findUnique({ where: { userId: uid }, select: { cropTypes: true } });
    const favoriteIds: string[] = profile?.cropTypes ?? [];

    if (favoriteIds.length === 0) return ok({ data: [], total: 0 });

    const products = await prisma.product.findMany({
      where: { id: { in: favoriteIds } },
      include: {
        brand: { select: { name: true } },
        category: { select: { name: true, slug: true } },
        variants: { where: { isActive: true }, take: 1, orderBy: { basePrice: "asc" } },
        vendorListings: { where: { isActive: true }, take: 1 },
      },
    });

    return ok({ data: products, total: products.length });
  } catch (e) {
    if (e instanceof Response) return e;
    return err("No autenticado", 401);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    const uid = userId(session);
    const { productId } = await req.json();
    if (!productId) return err("productId es requerido", 400);

    const product = await prisma.product.findUnique({ where: { id: productId }, select: { id: true } });
    if (!product) return err("Producto no encontrado", 404);

    const profile = await prisma.userProfile.findUnique({ where: { userId: uid }, select: { cropTypes: true } });
    const current: string[] = profile?.cropTypes ?? [];
    if (current.includes(productId)) return ok({ message: "Ya en favoritos" });

    await prisma.userProfile.update({ where: { userId: uid }, data: { cropTypes: [...current, productId] } });
    return ok({ message: "Agregado a favoritos", productId }, 201);
  } catch (e) {
    if (e instanceof Response) return e;
    return err("Error agregando favorito", 500);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await requireAuth();
    const uid = userId(session);
    const productId = new URL(req.url).searchParams.get("productId");
    if (!productId) return err("productId query param requerido", 400);

    const profile = await prisma.userProfile.findUnique({ where: { userId: uid }, select: { cropTypes: true } });
    const current: string[] = profile?.cropTypes ?? [];
    await prisma.userProfile.update({ where: { userId: uid }, data: { cropTypes: current.filter(id => id !== productId) } });

    return ok({ message: "Eliminado de favoritos", productId });
  } catch (e) {
    if (e instanceof Response) return e;
    return err("Error eliminando favorito", 500);
  }
}
