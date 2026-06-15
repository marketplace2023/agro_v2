import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";

export const revalidate = 3600;

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

function authorName(user: {
  profile: { firstName: string; lastName: string } | null;
} | null): string {
  const p = user?.profile;
  if (!p) return "Equipo Agro";
  return `${p.firstName} ${p.lastName}`.trim() || "Equipo Agro";
}

function formatDate(iso: Date | string) {
  return new Date(iso).toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" });
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug, published: true },
    select: { title: true, excerpt: true, metaTitle: true, metaDescription: true },
  }).catch(() => null);
  if (!post) return { title: "Artículo no encontrado" };
  return {
    title: `${post.metaTitle ?? post.title} | Blog | Marketplace Agro`,
    description: post.metaDescription ?? post.excerpt ?? undefined,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  const [post, recentPosts] = await Promise.all([
    prisma.blogPost.findUnique({
      where: { slug, published: true },
      include: {
        author: {
          select: { profile: { select: { firstName: true, lastName: true } } },
        },
      },
    }).catch(() => null),
    prisma.blogPost.findMany({
      where: { published: true, slug: { not: slug } },
      orderBy: { publishedAt: "desc" },
      take: 3,
      select: { slug: true, title: true },
    }).catch(() => []),
  ]);

  if (!post) notFound();

  const relatedProducts = post.mentionedProductIds.length > 0
    ? await prisma.product.findMany({
        where: { id: { in: post.mentionedProductIds } },
        select: { id: true, name: true, slug: true },
      }).catch(() => [])
    : [];

  const paragraphs = post.content.split("\n").filter(Boolean);
  const author = authorName(post.author);

  return (
    <div className="container-max py-6">
      <nav className="flex items-center gap-1.5 text-xs text-[var(--color-on-surface-variant)] mb-4">
        <Link href="/" className="hover:text-[var(--color-primary)]">Inicio</Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-[var(--color-primary)]">Blog</Link>
        <span>/</span>
        <span className="text-[var(--color-on-surface)] truncate max-w-[200px]">{post.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <article className="lg:col-span-2">
          {post.category && (
            <span className="text-xs font-medium text-[var(--color-primary)] bg-[var(--color-surface-container)] px-2.5 py-1 rounded-full">
              {post.category}
            </span>
          )}
          <h1 className="text-2xl font-bold text-[var(--color-on-surface)] mt-3 mb-2">{post.title}</h1>
          <div className="flex items-center gap-2 text-sm text-[var(--color-on-surface-variant)] mb-6 flex-wrap">
            <span className="font-medium text-[var(--color-on-surface)]">{author}</span>
            <span>·</span>
            <span>{formatDate(post.publishedAt ?? post.createdAt)}</span>
            {post.tags.length > 0 && (
              <>
                <span>·</span>
                <span>{post.tags.slice(0, 3).join(", ")}</span>
              </>
            )}
          </div>

          {/* Content */}
          <div className="prose prose-sm max-w-none space-y-3 text-[var(--color-on-surface)]">
            {paragraphs.map((p, i) => {
              if (p.startsWith("## ")) return <h2 key={i} className="text-lg font-semibold mt-5 mb-2">{p.slice(3)}</h2>;
              if (p.startsWith("# "))  return <h1 key={i} className="text-xl font-bold mt-6 mb-2">{p.slice(2)}</h1>;
              if (p.startsWith("- "))  return <li key={i} className="ml-4 list-disc text-sm text-[var(--color-on-surface-variant)]">{p.slice(2).replace(/\*\*(.*?)\*\*/g, "$1")}</li>;
              return <p key={i} className="text-sm leading-relaxed text-[var(--color-on-surface-variant)]">{p.replace(/\*\*(.*?)\*\*/g, "$1")}</p>;
            })}
          </div>

          {/* Share */}
          <div className="mt-8 pt-4 border-t border-[var(--color-border-subtle)] flex items-center gap-3">
            <span className="text-sm text-[var(--color-on-surface-variant)]">Compartir:</span>
            <button className="text-xs px-3 py-1.5 border border-[var(--color-border-subtle)] rounded-full hover:bg-[var(--color-surface-container-low)] transition-colors">LinkedIn</button>
            <button className="text-xs px-3 py-1.5 border border-[var(--color-border-subtle)] rounded-full hover:bg-[var(--color-surface-container-low)] transition-colors">WhatsApp</button>
            <button className="text-xs px-3 py-1.5 border border-[var(--color-border-subtle)] rounded-full hover:bg-[var(--color-surface-container-low)] transition-colors">Copiar enlace</button>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="space-y-5">
          {relatedProducts.length > 0 && (
            <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-4">
              <h3 className="font-semibold text-[var(--color-on-surface)] text-sm mb-3">Productos mencionados</h3>
              <ul className="space-y-2">
                {relatedProducts.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/productos/${p.slug}`} className="text-sm text-[var(--color-primary)] hover:underline">
                      🌱 {p.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-[var(--color-surface-container-low)] rounded-xl border border-[var(--color-border-subtle)] p-4">
            <h3 className="font-semibold text-[var(--color-on-surface)] text-sm mb-2">¿Tienes dudas técnicas?</h3>
            <p className="text-xs text-[var(--color-on-surface-variant)] mb-3">
              Nuestros asesores agronómicos pueden ayudarte a aplicar lo que lees aquí
            </p>
            <Link
              href="/expertos"
              className="block text-center py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Consultar experto →
            </Link>
          </div>

          {recentPosts.length > 0 && (
            <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-4">
              <h3 className="font-semibold text-[var(--color-on-surface)] text-sm mb-3">Más artículos</h3>
              <ul className="space-y-2">
                {recentPosts.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/blog/${p.slug}`} className="text-xs text-[var(--color-primary)] hover:underline line-clamp-2">
                      {p.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
