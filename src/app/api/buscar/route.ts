import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { ok, err } from "@/lib/api/helpers";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const q = url.searchParams.get("q") ?? "";
    const type = url.searchParams.get("type") ?? "products";
    const limit = Math.min(50, Math.max(1, Number(url.searchParams.get("limit") ?? 20)));

    if (!q || q.trim().length < 2) return err("El término de búsqueda debe tener al menos 2 caracteres", 400);

    const search = q.trim();

    if (type === "products" || type === "all") {
      const products = await prisma.product.findMany({
        where: {
          isActive: true,
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
            { category: { name: { contains: search, mode: "insensitive" } } },
            { brand: { name: { contains: search, mode: "insensitive" } } },
          ],
        },
        select: {
          id: true, name: true, slug: true, price: true, currency: true, unit: true,
          images: true, stock: true,
          category: { select: { name: true, slug: true } },
          brand: { select: { name: true } },
          vendor: { select: { profile: { select: { companyName: true } } } },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
      });

      if (type === "products") return ok({ products, total: products.length, query: search });

      const vendors = await prisma.user.findMany({
        where: {
          role: { in: ["vendedor", "fabricante", "distribuidor"] },
          OR: [
            { profile: { companyName: { contains: search, mode: "insensitive" } } },
            { profile: { firstName: { contains: search, mode: "insensitive" } } },
          ],
        },
        select: {
          id: true,
          profile: { select: { companyName: true, firstName: true, lastName: true } },
        },
        take: 10,
      });

      return ok({ products, vendors, total: products.length + vendors.length, query: search });
    }

    return err("Tipo de búsqueda no válido. Use: products, all", 400);
  } catch {
    return err("Error en la búsqueda", 500);
  }
}
