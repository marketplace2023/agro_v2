import type { Metadata } from "next";
import { Suspense } from "react";
import { getProducts } from "@/lib/catalog/service";
import { ProductGrid } from "@/components/product/product-card";
import type { ProductCardProps } from "@/components/product/product-card";
import { FilterSidebar } from "@/components/catalog/filter-sidebar";
import { CatalogToolbar } from "@/components/catalog/catalog-toolbar";
import { CategoryNav } from "@/components/layout/category-nav";
import { Pagination } from "@/components/catalog/pagination";
import { CampaignBanner } from "@/components/catalog/campaign-banner";
import { RecentlyViewed } from "@/components/catalog/recently-viewed";

export const metadata: Metadata = {
  title: "Catálogo de Productos | Marketplace Agro",
  description:
    "Explora más de 5,000 agroinsumos regulados: fertilizantes, herbicidas, fungicidas, insecticidas, biológicos y más. Compra B2B con múltiples vendedores.",
};

interface ProductosPageProps {
  searchParams: Promise<{
    categoria?: string;
    pais?: string;
    regulado?: string;
    biologico?: string;
    organico?: string;
    orden?: string;
    pagina?: string;
  }>;
}

export default async function ProductosPage({
  searchParams,
}: ProductosPageProps) {
  const sp = await searchParams;

  const categoriaSlug = sp.categoria || undefined;
  const pais = sp.pais || undefined;
  const regulado = sp.regulado === "1" ? true : undefined;
  const biologico = sp.biologico === "1" ? true : undefined;
  const organico = sp.organico === "1" ? true : undefined;
  const orden = sp.orden || "nuevos";
  const pagina = Math.max(1, parseInt(sp.pagina ?? "1", 10));

  const { items, total, paginas } = await getProducts({
    categoriaSlug,
    pais,
    regulado,
    biologico,
    organico,
    orden,
    pagina,
    limite: 24,
  });

  const cards: ProductCardProps[] = items.map((item) => ({
    id: item.id,
    slug: item.slug,
    name: item.name,
    brand: item.brand?.name ?? "",
    category: item.category.name,
    imageUrl: item.imageUrl,
    priceFrom: item.priceFrom,
    isRegulated: item.isRegulated,
    isBiological: item.isBiological,
    isNew: item.isNew,
    rating: item.rating,
    reviewCount: item.reviewCount,
  }));

  const buildHref = (page: number) => {
    const params = new URLSearchParams();
    if (categoriaSlug) params.set("categoria", categoriaSlug);
    if (pais) params.set("pais", pais);
    if (regulado) params.set("regulado", "1");
    if (biologico) params.set("biologico", "1");
    if (organico) params.set("organico", "1");
    if (orden !== "nuevos") params.set("orden", orden);
    if (page > 1) params.set("pagina", String(page));
    return `/productos?${params.toString()}`;
  };

  return (
    <>
      {/* Category navigation bar */}
      <CategoryNav variant="horizontal" />

      <div className="container-max py-6">
        <CampaignBanner />
        <RecentlyViewed />
        {/* Page header */}
        <div className="mb-6">
          <h1
            className="text-headline-md text-[var(--color-on-surface)]"
            style={{ fontFamily: "var(--font-headline)" }}
          >
            {categoriaSlug
              ? `Categoría: ${categoriaSlug.replace(/-/g, " ")}`
              : "Todos los productos"}
          </h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">
            Agroinsumos regulados para profesionales del agro en Latinoamérica
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6 items-start">
          {/* Sidebar — desktop */}
          <div className="hidden md:block">
            <div className="sticky top-24 border border-[var(--color-border-subtle)] rounded-lg p-4 bg-white">
              {/* Category list */}
              <p className="text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-3">
                Categorías
              </p>
              <CategoryNav variant="sidebar" className="mb-4" />
              <div className="border-t border-[var(--color-border-subtle)] pt-4">
                <Suspense fallback={<FilterSidebarSkeleton />}>
                  <FilterSidebar />
                </Suspense>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="min-w-0">
            {/* Mobile: category scroll + filter toggle */}
            <div className="md:hidden mb-4 space-y-3">
              <CategoryNav variant="horizontal" />
              <details className="border border-[var(--color-border-subtle)] rounded-lg p-3 bg-white">
                <summary className="text-sm font-semibold cursor-pointer select-none text-[var(--color-on-surface)]">
                  Filtros {(regulado || biologico || organico || pais) && "•"}
                </summary>
                <div className="mt-4">
                  <Suspense fallback={<FilterSidebarSkeleton />}>
                    <FilterSidebar />
                  </Suspense>
                </div>
              </details>
            </div>

            {/* Toolbar */}
            <Suspense
              fallback={
                <div className="h-12 bg-gray-100 rounded animate-pulse mb-4" />
              }
            >
              <CatalogToolbar total={total} />
            </Suspense>

            {/* Products grid */}
            <div className="mt-4">
              {cards.length > 0 ? (
                <>
                  <ProductGrid products={cards} />
                  <Pagination
                    pagina={pagina}
                    paginas={paginas}
                    buildHref={buildHref}
                  />
                </>
              ) : (
                <EmptyState />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-20 text-[var(--color-on-surface-variant)]">
      <div className="text-5xl mb-4">📦</div>
      <p className="text-lg font-semibold text-[var(--color-on-surface)] mb-2">
        No hay productos con estos filtros
      </p>
      <p className="text-sm mb-6">Prueba cambiando los filtros activos</p>
      <a
        href="/productos"
        className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
      >
        Ver todos los productos
      </a>
    </div>
  );
}

function FilterSidebarSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/2" />
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-5 bg-gray-200 rounded" />
        ))}
      </div>
      <div className="h-px bg-gray-200" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
      <div className="space-y-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-7 bg-gray-200 rounded" />
        ))}
      </div>
    </div>
  );
}
