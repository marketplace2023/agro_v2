import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const type = url.searchParams.get("type") ?? "";
    const crop = url.searchParams.get("crop") ?? "";
    const cropSlug = crop ? toSlug(crop) : "";

    const items = await prisma.agroKnowledge.findMany({
      where: {
        ...(type && { type }),
        ...(cropSlug && { cropTypes: { hasSome: [crop, cropSlug] } }),
      },
      take: 6,
      orderBy: { createdAt: "desc" },
    });

    const productIds = [...new Set(items.flatMap(i => i.recommendedProductIds))];
    const products = productIds.length > 0
      ? await prisma.product.findMany({
          where: { id: { in: productIds } },
          select: { id: true, name: true, slug: true, category: { select: { name: true } } },
        })
      : [];

    const productMap = Object.fromEntries(products.map(p => [p.id, p]));

    const data = items.map(item => ({
      id: item.id,
      name: item.name,
      type: item.type,
      description: item.description,
      symptoms: item.symptoms,
      causes: item.causes,
      products: item.recommendedProductIds
        .map(id => productMap[id])
        .filter(Boolean)
        .map(p => ({ name: p.name, slug: p.slug, type: p.category.name })),
    }));

    return NextResponse.json({ data, total: data.length });
  } catch {
    return NextResponse.json({ data: [], total: 0 });
  }
}
