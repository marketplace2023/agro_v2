import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

export const revalidate = 3600;

const POSTS_DATA: Record<string, {
  title: string; category: string; author: string; authorTitle: string;
  date: string; readTime: string; content: string;
  relatedProducts: { name: string; slug: string }[];
}> = {
  "tendencias-biologicos-2025": {
    title: "Biológicos 2025: el mercado que crece más rápido en Latinoamérica",
    category: "Biológicos", author: "Equipo Agro", authorTitle: "Editorial",
    date: "15 de mayo, 2025", readTime: "6 min",
    content: `
## El auge de los biológicos en Latinoamérica

El mercado de insumos biológicos en Latinoamérica registró un crecimiento del **28% en 2024**, superando los USD 1,400 millones según datos del mercado regional. Este dinamismo es impulsado por tres factores principales: la creciente demanda de alimentos sin residuos químicos, los requisitos de exportación hacia Europa y América del Norte, y el costo creciente de los agroquímicos convencionales.

## Categorías con mayor crecimiento

- **Biofungicidas** (Trichoderma, Bacillus): +35% en ventas regionales
- **Bioinsecticidas** (Beauveria, Metarhizium): +28%
- **Bioestimulantes** (aminoácidos, ácidos húmicos): +42%
- **Biofertilizantes** (rizobios, micorrizas): +22%

## Países líderes en adopción

**Brasil** lidera con el 45% del mercado regional, seguido por **México** (20%), **Colombia** (12%) y **Argentina** (8%). En Brasil, los biológicos ya representan más del 15% del total de defensivos agrícolas.

## Retos pendientes

La cadena de frío sigue siendo el principal cuello de botella en la distribución. Los biológicos son productos vivos que requieren temperaturas controladas, y la infraestructura logística en varios países de la región aún no está adaptada para este requerimiento.

## Conclusión

Los biológicos dejaron de ser una tendencia marginal para convertirse en un pilar de la agricultura moderna en Latinoamérica. Las empresas que construyan competencias técnicas en este segmento tendrán una ventaja competitiva significativa en los próximos años.
    `.trim(),
    relatedProducts: [
      { name: "Trichoderma Harzianum Biocontrol", slug: "trichoderma-harzianum-biocontrol" },
      { name: "Beauveria bassiana WP", slug: "beauveria-bassiana-wp" },
    ],
  },
};

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = POSTS_DATA[slug];
  if (!post) return { title: "Artículo no encontrado" };
  return {
    title: `${post.title} | Blog | Marketplace Agro`,
    description: post.content.slice(0, 160).replace(/[#*\n]/g, " ").trim(),
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = POSTS_DATA[slug];
  if (!post) notFound();

  const paragraphs = post.content.split("\n").filter(Boolean);

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
          <span className="text-xs font-medium text-[var(--color-primary)] bg-[var(--color-surface-container)] px-2.5 py-1 rounded-full">
            {post.category}
          </span>
          <h1 className="text-2xl font-bold text-[var(--color-on-surface)] mt-3 mb-2">{post.title}</h1>
          <div className="flex items-center gap-2 text-sm text-[var(--color-on-surface-variant)] mb-6">
            <span className="font-medium text-[var(--color-on-surface)]">{post.author}</span>
            <span>·</span><span>{post.authorTitle}</span>
            <span>·</span><span>{post.date}</span>
            <span>·</span><span>{post.readTime} lectura</span>
          </div>

          {/* Content rendered as styled paragraphs */}
          <div className="prose prose-sm max-w-none space-y-3 text-[var(--color-on-surface)]">
            {paragraphs.map((p, i) => {
              if (p.startsWith("## ")) return <h2 key={i} className="text-lg font-semibold mt-5 mb-2">{p.slice(3)}</h2>;
              if (p.startsWith("- ")) return <li key={i} className="ml-4 list-disc text-sm text-[var(--color-on-surface-variant)]">{p.slice(2).replace(/\*\*(.*?)\*\*/g, "$1")}</li>;
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
          {post.relatedProducts.length > 0 && (
            <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-4">
              <h3 className="font-semibold text-[var(--color-on-surface)] text-sm mb-3">Productos mencionados</h3>
              <ul className="space-y-2">
                {post.relatedProducts.map((p) => (
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
            <Link href="/expertos" className="block text-center py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-primary-container)] transition-colors">
              Consultar experto →
            </Link>
          </div>

          <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-4">
            <h3 className="font-semibold text-[var(--color-on-surface)] text-sm mb-3">Más artículos</h3>
            <ul className="space-y-2">
              <li><Link href="/blog/gestion-resistencia-herbicidas" className="text-xs text-[var(--color-primary)] hover:underline">Resistencia a herbicidas en maíz y soya</Link></li>
              <li><Link href="/blog/fertilizacion-precision-cafe" className="text-xs text-[var(--color-primary)] hover:underline">Fertilización de precisión en café</Link></li>
              <li><Link href="/blog/innovacion-drones-agricolas" className="text-xs text-[var(--color-primary)] hover:underline">Drones en aplicación de agroquímicos</Link></li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
