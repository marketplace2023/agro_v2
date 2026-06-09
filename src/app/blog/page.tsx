import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog | Marketplace Agro",
  description: "Noticias, guías técnicas y artículos sobre agroinsumos, mercado agro, innovación y cultivos en Latinoamérica.",
};

const CATEGORIES = ["Todos", "Fertilizantes", "Biológicos", "Fitosanidad", "Mercado", "Innovación", "Crédito", "Logística"];

const POSTS = [
  { slug: "tendencias-biologicos-2025", category: "Biológicos", title: "Biológicos 2025: el mercado que crece más rápido en Latinoamérica", excerpt: "El mercado de biológicos registró un crecimiento del 28% en la región durante 2024. Analizamos las categorías con mayor demanda y los países que lideran la adopción.", author: "Equipo Agro", authorTitle: "Editorial", date: "2025-05-15", readTime: "6 min", featured: true },
  { slug: "gestion-resistencia-herbicidas", category: "Fitosanidad", title: "Cómo gestionar la resistencia a herbicidas en maíz y soya", excerpt: "La resistencia al glifosato ya afecta a más de 40 biotipos en 15 países de América Latina. Estrategias prácticas para el manejo integrado.", author: "Ing. Carlos Pérez", authorTitle: "Agrónomo", date: "2025-05-08", readTime: "8 min", featured: false },
  { slug: "credito-b2b-agro-colombia", category: "Crédito", title: "Crédito B2B para agroinsumos: guía para empresas en Colombia", excerpt: "Condiciones, requisitos y mejores prácticas para acceder a crédito de compras de insumos agrícolas en Colombia.", author: "Ana Martínez", authorTitle: "Analista Financiera", date: "2025-04-28", readTime: "5 min", featured: false },
  { slug: "fertilizacion-precision-cafe", category: "Fertilizantes", title: "Fertilización de precisión en café: del análisis de suelo al plan nutricional", excerpt: "Implementar un plan de fertilización basado en análisis de suelo puede reducir costos hasta un 25% sin sacrificar rendimiento.", author: "Dra. Laura Méndez", authorTitle: "Edafóloga", date: "2025-04-20", readTime: "10 min", featured: false },
  { slug: "logistica-agroquimicos-latam", category: "Logística", title: "Logística de agroquímicos en Latinoamérica: retos y soluciones 2025", excerpt: "Transporte de materiales peligrosos, cadena de frío y regulaciones aduaneras: cómo las empresas están resolviendo los cuellos de botella.", author: "Equipo Agro", authorTitle: "Editorial", date: "2025-04-12", readTime: "7 min", featured: false },
  { slug: "innovacion-drones-agricolas", category: "Innovación", title: "Drones en la aplicación de agroquímicos: experiencias reales en Colombia", excerpt: "Tres empresas colombianas comparten sus resultados después de un año usando drones para aplicación de fitosanitarios.", author: "Equipo Agro", authorTitle: "Editorial", date: "2025-04-05", readTime: "6 min", featured: false },
];

export default function BlogPage() {
  const featured = POSTS[0];
  const rest = POSTS.slice(1);

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
        {CATEGORIES.map((cat) => (
          <button key={cat} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${cat === "Todos" ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]" : "border-[var(--color-border-subtle)] hover:border-[var(--color-primary)]"}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Featured */}
      <Link href={`/blog/${featured.slug}`} className="group block mb-8 bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden hover:shadow-md transition-shadow">
        <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-container)] h-40 flex items-end p-6">
          <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">{featured.category}</span>
        </div>
        <div className="p-6">
          <h2 className="text-xl font-bold text-[var(--color-on-surface)] group-hover:text-[var(--color-primary)] transition-colors mb-2">
            {featured.title}
          </h2>
          <p className="text-sm text-[var(--color-on-surface-variant)] line-clamp-2 mb-4">{featured.excerpt}</p>
          <div className="flex items-center gap-3 text-xs text-[var(--color-on-surface-variant)]">
            <span className="font-medium text-[var(--color-on-surface)]">{featured.author}</span>
            <span>·</span>
            <span>{featured.authorTitle}</span>
            <span>·</span>
            <span>{featured.date}</span>
            <span>·</span>
            <span>{featured.readTime} lectura</span>
          </div>
        </div>
      </Link>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {rest.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="group bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden hover:shadow-md transition-shadow">
            <div className="bg-[var(--color-surface-container)] h-28 flex items-end p-4">
              <span className="text-xs bg-white/80 text-[var(--color-primary)] font-medium px-2 py-1 rounded-full">{post.category}</span>
            </div>
            <div className="p-4">
              <h3 className="text-sm font-semibold text-[var(--color-on-surface)] group-hover:text-[var(--color-primary)] transition-colors mb-2 line-clamp-2">
                {post.title}
              </h3>
              <p className="text-xs text-[var(--color-on-surface-variant)] line-clamp-2 mb-3">{post.excerpt}</p>
              <div className="flex items-center gap-2 text-xs text-[var(--color-on-surface-variant)]">
                <span>{post.author}</span>
                <span>·</span>
                <span>{post.date}</span>
                <span>·</span>
                <span>{post.readTime}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
