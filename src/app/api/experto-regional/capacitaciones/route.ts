import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth, ok, err, paginate } from "@/lib/api/helpers";

export async function GET(req: NextRequest) {
  try {
    await requireAuth();
    const { skip, limit } = paginate(req);
    const url = new URL(req.url);
    const q = url.searchParams.get("q") ?? "";

    const where = {
      OR: [
        { category: "capacitacion" },
        { tags: { has: "capacitacion" } },
        { tags: { has: "formacion" } },
        { tags: { has: "taller" } },
      ],
      ...(q && { title: { contains: q, mode: "insensitive" as const } }),
    };

    const [data, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        select: {
          id: true, slug: true, title: true, excerpt: true,
          coverImageUrl: true, category: true, tags: true,
          published: true, publishedAt: true, createdAt: true,
          author: { select: { email: true, profile: { select: { firstName: true, lastName: true } } } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.blogPost.count({ where }),
    ]);

    return ok({ data, total, page: Math.floor(skip / limit) + 1, limit });
  } catch (e) {
    if (e instanceof Response) return e;
    return err("No autenticado", 401);
  }
}
