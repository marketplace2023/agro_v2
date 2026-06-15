import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";

export const metadata: Metadata = {
  title: "Blog | Marketplace Agro",
  description: "Noticias, guías técnicas y artículos sobre agroinsumos, mercado agro, innovación y cultivos en Latinoamérica.",
};

export const revalidate = 3600;

function authorName(post: {
  author: { profile: { firstName: string; lastName: string } | null } | null;
}): string {
  const p = post.author?.profile;
  if (!p) return "Equipo Agro";
  return `${p.firstName} ${p.lastName}`.trim() || "Equipo Agro";
}

function formatDate(iso: Date | string) {
  return new Date(iso).toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" });
}

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    take: 20,
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      category: true,
      publishedAt: true,
      createdAt: true,
      author: {
        select: {
          profile: { select: { firstName: true, lastName: true } },
        },
      },
    },
  }).catch(() => []);

  const categories = [
    "Todos",
    ...Array.from(new Set(posts.map(p => p.category).filter(Boolean) as string[])),
  ];

  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <div className="container-max py-8">
      <div className="mb-8">
        <h1 className="text-headline-lg text-[var(--color-on-surface)]">Blog</h1>
        <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">
          Análisis de mercado, guías técnicas y tendencias del sector agroindustrial
        </p>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <span key={cat} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${cat === "Todos" ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]" : "border-[var(--color-border-subtle)] text-[var(--color-on-surface-variant)]"}`}>
            {cat}
          </span>
        ))}
      </div>

      {posts.length === 0 ? (
        <div className="py-20 text-center text-[var(--color-on-surface-variant)]">
          <p className="text-4xl mb-3">📰</p>
          <p className="font-medium">Sin publicaciones aún</p>
          <p className="text-sm mt-1">Los artículos aparecerán aquí una vez publicados.</p>
        </div>
      ) : (
        <>
          {/* Featured */}
          {featured && (
            <Link
              href={`/blog/${featured.slug}`}
              className="group block mb-8 bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-container)] h-40 flex items-end p-6">
                {featured.category && (
                  <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">{featured.category}</span>
                )}
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold text-[var(--color-on-surface)] group-hover:text-[var(--color-primary)] transition-colors mb-2">
                  {featured.title}
                </h2>
                {featured.excerpt && (
                  <p className="text-sm text-[var(--color-on-surface-variant)] line-clamp-2 mb-4">{featured.excerpt}</p>
                )}
                <div className="flex items-center gap-3 text-xs text-[var(--color-on-surface-variant)]">
                  <span className="font-medium text-[var(--color-on-surface)]">{authorName(featured)}</span>
                  <span>·</span>
                  <span>{formatDate(featured.publishedAt ?? featured.createdAt)}</span>
                </div>
              </div>
            </Link>
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {rest.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="bg-[var(--color-surface-container)] h-28 flex items-end p-4">
                  {post.category && (
                    <span className="text-xs bg-white/80 text-[var(--color-primary)] font-medium px-2 py-1 rounded-full">{post.category}</span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-[var(--color-on-surface)] group-hover:text-[var(--color-primary)] transition-colors mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-xs text-[var(--color-on-surface-variant)] line-clamp-2 mb-3">{post.excerpt}</p>
                  )}
                  <div className="flex items-center gap-2 text-xs text-[var(--color-on-surface-variant)]">
                    <span>{authorName(post)}</span>
                    <span>·</span>
                    <span>{formatDate(post.publishedAt ?? post.createdAt)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
