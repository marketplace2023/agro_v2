import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth, userId, userRole, ok, err, paginate } from "@/lib/api/helpers";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    if (!["marketing", "admin"].includes(userRole(session))) return err("Sin permiso", 403);
    const { skip, limit } = paginate(req);
    const url = new URL(req.url);
    const status = url.searchParams.get("status") ?? undefined;

    const where = status ? { status: status as never } : {};

    const [data, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        include: { author: { select: { profile: { select: { firstName: true, lastName: true } } } } },
        orderBy: { publishedAt: "desc" },
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

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    const role = userRole(session);
    const uid = userId(session);
    if (!["marketing", "admin"].includes(role)) return err("Sin permiso", 403);

    const body = await req.json();
    const { title, slug, summary, content, coverImage, tags, publishedAt } = body;
    if (!title || !slug || !content) return err("title, slug y content son requeridos", 400);

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        summary,
        content,
        coverImage,
        tags: tags ?? [],
        authorId: uid,
        status: publishedAt ? "publicado" : "borrador",
        publishedAt: publishedAt ? new Date(publishedAt) : null,
      },
    });

    return ok(post, 201);
  } catch (e) {
    if (e instanceof Response) return e;
    return err("Error creando post", 500);
  }
}
