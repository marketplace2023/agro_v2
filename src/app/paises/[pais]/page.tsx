import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { getProducts } from "@/lib/catalog/service";
import { ProductGrid } from "@/components/product/product-card";
import type { ProductCardProps } from "@/components/product/product-card";
import { Pagination } from "@/components/catalog/pagination";

export const revalidate = 3600;

const COUNTRY_META: Record<string, {
  name: string; flag: string; currency: string; authority: string;
  authorityFull: string; products: number; vendors: number;
  restrictions?: string[];
}> = {
  co: { name: "Colombia", flag: "🇨🇴", currency: "COP", authority: "ICA", authorityFull: "Instituto Colombiano Agropecuario", products: 834, vendors: 45, restrictions: ["Productos con restricción especial requieren licencia de uso"] },
  ve: { name: "Venezuela", flag: "🇻🇪", currency: "USD", authority: "SASA", authorityFull: "Servicio Autónomo de Sanidad Agropecuaria", products: 423, vendors: 18 },
  ec: { name: "Ecuador", flag: "🇪🇨", currency: "USD", authority: "AGROCALIDAD", authorityFull: "Agencia de Regulación y Control Fitosanitario", products: 512, vendors: 27 },
  mx: { name: "México", flag: "🇲🇽", currency: "MXN", authority: "SENASICA", authorityFull: "Servicio Nacional de Sanidad, Inocuidad y Calidad Agroalimentaria", products: 756, vendors: 38 },
  pe: { name: "Perú", flag: "🇵🇪", currency: "PEN", authority: "SENASA", authorityFull: "Servicio Nacional de Sanidad Agraria", products: 489, vendors: 22 },
  br: { name: "Brasil", flag: "🇧🇷", currency: "BRL", authority: "MAPA", authorityFull: "Ministério da Agricultura, Pecuária e Abastecimento", products: 923, vendors: 52 },
  ar: { name: "Argentina", flag: "🇦🇷", currency: "ARS", authority: "SENASA", authorityFull: "Servicio Nacional de Sanidad y Calidad Agroalimentaria", products: 678, vendors: 31 },
  cl: { name: "Chile", flag: "🇨🇱", currency: "CLP", authority: "SAG", authorityFull: "Servicio Agrícola y Ganadero", products: 345, vendors: 19 },
  bo: { name: "Bolivia", flag: "🇧🇴", currency: "BOB", authority: "SENASAG", authorityFull: "Servicio Nacional de Sanidad Agropecuaria e Inocuidad Alimentaria", products: 234, vendors: 12 },
  gt: { name: "Guatemala", flag: "🇬🇹", currency: "GTQ", authority: "MAGA", authorityFull: "Ministerio de Agricultura, Ganadería y Alimentación", products: 198, vendors: 9 },
};

interface CountryPageProps {
  params: Promise<{ pais: string }>;
  searchParams: Promise<{ pagina?: string; categoria?: string; orden?: string }>;
}

export async function generateMetadata({ params }: CountryPageProps): Promise<Metadata> {
  const { pais } = await params;
  const meta = COUNTRY_META[pais.toLowerCase()];
  if (!meta) return { title: "País no encontrado" };
  return {
    title: `Productos en ${meta.name} | Marketplace Agro`,
    description: `${meta.products} agroinsumos regulados disponibles en ${meta.name}. Autoridad regulatoria: ${meta.authority}.`,
  };
}

export default async function CountryPage({ params, searchParams }: CountryPageProps) {
  const { pais } = await params;
  const sp = await searchParams;
  const code = pais.toLowerCase();
  const meta = COUNTRY_META[code];
  if (!meta) notFound();

  const pagina = Math.max(1, parseInt(sp.pagina ?? "1", 10));
  const { items, total, paginas } = await getProducts({
    pais: code.toUpperCase(),
    categoriaSlug: sp.categoria,
    orden: sp.orden ?? "nuevos",
    pagina,
    limite: 24,
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
    if (sp.categoria) p.set("categoria", sp.categoria);
    if (sp.orden) p.set("orden", sp.orden);
    if (page > 1) p.set("pagina", String(page));
    return `/paises/${code}?${p.toString()}`;
  };

  return (
    <div className="container-max py-6">
      <nav className="flex items-center gap-1.5 text-xs text-[var(--color-on-surface-variant)] mb-4">
        <Link href="/" className="hover:text-[var(--color-primary)]">Inicio</Link>
        <span>/</span>
        <Link href="/paises" className="hover:text-[var(--color-primary)]">Países</Link>
        <span>/</span>
        <span className="text-[var(--color-on-surface)]">{meta.name}</span>
      </nav>

      {/* Country header */}
      <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-6 mb-6">
        <div className="flex items-center gap-4">
          <span className="text-5xl">{meta.flag}</span>
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-on-surface)]">{meta.name}</h1>
            <p className="text-sm text-[var(--color-on-surface-variant)]">
              Autoridad regulatoria: <strong>{meta.authority}</strong> — {meta.authorityFull}
            </p>
            <div className="flex gap-4 mt-2 text-sm">
              <span className="text-[var(--color-primary)] font-semibold">{meta.products.toLocaleString()} productos</span>
              <span className="text-[var(--color-on-surface-variant)]">|</span>
              <span className="text-[var(--color-primary)] font-semibold">{meta.vendors} vendedores activos</span>
              <span className="text-[var(--color-on-surface-variant)]">|</span>
              <span className="text-[var(--color-on-surface-variant)]">Moneda: {meta.currency}</span>
            </div>
          </div>
        </div>
        {meta.restrictions && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs font-medium text-amber-800 mb-1">⚠️ Restricciones regulatorias vigentes</p>
            {meta.restrictions.map((r) => (
              <p key={r} className="text-xs text-amber-700">{r}</p>
            ))}
          </div>
        )}
      </div>

      {/* Products */}
      <h2 className="text-lg font-semibold text-[var(--color-on-surface)] mb-4">
        Productos disponibles en {meta.name}
      </h2>
      {cards.length > 0 ? (
        <>
          <ProductGrid products={cards} />
          <Pagination pagina={pagina} paginas={paginas} buildHref={buildHref} />
        </>
      ) : (
        <div className="text-center py-16 text-[var(--color-on-surface-variant)]">
          <p className="text-lg font-semibold mb-2">No hay productos disponibles actualmente</p>
          <Link href="/buscar" className="text-sm text-[var(--color-primary)] hover:underline">
            Ver todos los productos →
          </Link>
        </div>
      )}
    </div>
  );
}
