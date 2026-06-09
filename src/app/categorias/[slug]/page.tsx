import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { getProducts } from "@/lib/catalog/service";
import { ProductGrid } from "@/components/product/product-card";
import type { ProductCardProps } from "@/components/product/product-card";
import { FilterSidebar } from "@/components/catalog/filter-sidebar";
import { CatalogToolbar } from "@/components/catalog/catalog-toolbar";
import { Pagination } from "@/components/catalog/pagination";

export const revalidate = 3600;

const CATEGORY_META: Record<string, {
  name: string; description: string; emoji: string;
  technicalGuide?: string; extraFilters?: string;
}> = {
  fertilizantes: {
    name: "Fertilizantes", emoji: "🌿",
    description: "Soluciones nutricionales para todos los cultivos. Encuentra fertilizantes nitrogenados, fosfatados, potásicos, NPK completos, solubles y micronutrientes de los principales fabricantes de Latinoamérica.",
    technicalGuide: "Guía de fertilización",
    extraFilters: "Tipo de nutriente, forma de presentación, método de aplicación",
  },
  biologicos: {
    name: "Biológicos", emoji: "🦠",
    description: "Biofertilizantes, bioestimulantes, biopesticidas y microorganismos beneficiosos. Alternativas sostenibles para la agricultura moderna.",
    technicalGuide: "Guía de biológicos",
  },
  herbicidas: {
    name: "Herbicidas", emoji: "🌾",
    description: "Control de malezas en pre y posemergencia. Herbicidas sistémicos y de contacto para todos los cultivos con registro vigente.",
    technicalGuide: "Guía de control de malezas",
    extraFilters: "Modo de acción, tipo de maleza, cultivo autorizado",
  },
  insecticidas: {
    name: "Insecticidas", emoji: "🐛",
    description: "Protección eficaz contra plagas e insectos en todos tus cultivos. Productos con registro ICA/SENASICA/SASA vigente.",
    technicalGuide: "Guía de control de plagas",
  },
  fungicidas: {
    name: "Fungicidas", emoji: "🍄",
    description: "Control preventivo y curativo de enfermedades fúngicas y bacterianas. Amplio portafolio de ingredientes activos y mecanismos de acción.",
    technicalGuide: "Guía de control de enfermedades",
  },
  semillas: {
    name: "Semillas", emoji: "🌱",
    description: "Semillas certificadas de alta calidad para hortalizas, cereales, pastos y frutales.",
  },
  coadyuvantes: {
    name: "Coadyuvantes", emoji: "💧",
    description: "Mejoran la eficacia, adherencia y penetración de los tratamientos fitosanitarios.",
  },
  "correctores-enmiendas": {
    name: "Correctores y enmiendas", emoji: "🪨",
    description: "Productos para mejorar las propiedades físicas, químicas y biológicas del suelo.",
  },
  maquinaria: {
    name: "Maquinaria y equipos", emoji: "⚙️",
    description: "Equipos para riego, fumigación, bombas y herramientas para la operación agrícola.",
  },
  servicios: {
    name: "Servicios agrícolas", emoji: "🤝",
    description: "Asesoría técnica, análisis de suelo, aplicación de drones y servicios especializados.",
  },
};

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ q?: string; pais?: string; orden?: string; pagina?: string; regulado?: string; biologico?: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const meta = CATEGORY_META[slug];
  if (!meta) return { title: "Categoría no encontrada" };
  return {
    title: `${meta.name} | Marketplace Agro`,
    description: meta.description,
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const sp = await searchParams;

  const meta = CATEGORY_META[slug];
  if (!meta) notFound();

  const pagina = Math.max(1, parseInt(sp.pagina ?? "1", 10));
  const { items, total, paginas } = await getProducts({
    categoriaSlug: slug,
    q: sp.q,
    pais: sp.pais,
    orden: sp.orden ?? "nuevos",
    pagina,
    limite: 24,
    regulado: sp.regulado === "1" ? true : undefined,
    biologico: sp.biologico === "1" ? true : undefined,
  });

  const cards: ProductCardProps[] = items.map((item) => ({
    id: item.id, slug: item.slug, name: item.name,
    brand: item.brand?.name ?? "", category: item.category.name,
    imageUrl: item.imageUrl, priceFrom: item.priceFrom,
    isRegulated: item.isRegulated, isBiological: item.isBiological,
    isNew: item.isNew, rating: item.rating, reviewCount: item.reviewCount,
  }));

  const buildHref = (page: number) => {
    const p = new URLSearchParams();
    if (sp.q) p.set("q", sp.q);
    if (sp.pais) p.set("pais", sp.pais);
    if (sp.regulado) p.set("regulado", "1");
    if (sp.biologico) p.set("biologico", "1");
    if (sp.orden) p.set("orden", sp.orden);
    if (page > 1) p.set("pagina", String(page));
    return `/categorias/${slug}?${p.toString()}`;
  };

  return (
    <div className="container-max py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-[var(--color-on-surface-variant)] mb-4">
        <Link href="/" className="hover:text-[var(--color-primary)]">Inicio</Link>
        <span>/</span>
        <Link href="/categorias" className="hover:text-[var(--color-primary)]">Categorías</Link>
        <span>/</span>
        <span className="text-[var(--color-on-surface)]">{meta.name}</span>
      </nav>

      {/* Banner */}
      <div className="mb-6 p-5 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-container)] text-white">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{meta.emoji}</span>
          <div>
            <h1 className="text-xl font-bold">{meta.name}</h1>
            <p className="text-sm text-white/80 mt-0.5">{meta.description}</p>
          </div>
        </div>
        {meta.technicalGuide && (
          <div className="mt-3 flex items-center gap-3">
            <Link href="/biblioteca" className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors">
              📄 {meta.technicalGuide}
            </Link>
            <Link href="/expertos" className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors">
              🌱 Consultar experto
            </Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6 items-start">
        <div className="hidden md:block sticky top-24">
          <div className="border border-[var(--color-border-subtle)] rounded-lg p-4 bg-white">
            <Suspense fallback={null}>
              <FilterSidebar />
            </Suspense>
          </div>
        </div>
        <div className="min-w-0">
          <CatalogToolbar total={total} />
          <div className="mt-4">
            {cards.length > 0 ? (
              <>
                <ProductGrid products={cards} />
                <Pagination pagina={pagina} paginas={paginas} buildHref={buildHref} />
              </>
            ) : (
              <div className="text-center py-16 text-[var(--color-on-surface-variant)]">
                <p className="text-lg font-semibold mb-2">Sin productos en esta categoría</p>
                <Link href="/buscar" className="text-sm text-[var(--color-primary)] hover:underline">
                  Ver todos los productos →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
