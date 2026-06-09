import type { Metadata } from "next";
import { Suspense } from "react";
import { Search } from "lucide-react";
import { getProducts } from "@/lib/catalog/service";
import { ProductGrid } from "@/components/product/product-card";
import type { ProductCardProps } from "@/components/product/product-card";
import { FilterSidebar } from "@/components/catalog/filter-sidebar";
import { CatalogToolbar } from "@/components/catalog/catalog-toolbar";
import { Pagination } from "@/components/catalog/pagination";

export const metadata: Metadata = {
  title: "Buscar Productos | Marketplace Agro",
  description:
    "Busca agroinsumos regulados: fertilizantes, herbicidas, fungicidas, insecticidas, biológicos y más. Filtra por país, tipo de producto y precio.",
};

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    categoria?: string;
    pais?: string;
    regulado?: string;
    biologico?: string;
    organico?: string;
    orden?: string;
    pagina?: string;
  }>;
}

export default async function BuscarPage({ searchParams }: SearchPageProps) {
  const sp = await searchParams;

  const q = sp.q?.trim() || undefined;
  const categoriaSlug = sp.categoria || undefined;
  const pais = sp.pais || undefined;
  const regulado = sp.regulado === "1" ? true : undefined;
  const biologico = sp.biologico === "1" ? true : undefined;
  const organico = sp.organico === "1" ? true : undefined;
  const orden = sp.orden || "nuevos";
  const pagina = Math.max(1, parseInt(sp.pagina ?? "1", 10));

  const { items, total, paginas } = await getProducts({
    q,
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

  // Build pagination URLs preserving current filters
  const buildHref = (page: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (categoriaSlug) params.set("categoria", categoriaSlug);
    if (pais) params.set("pais", pais);
    if (regulado) params.set("regulado", "1");
    if (biologico) params.set("biologico", "1");
    if (organico) params.set("organico", "1");
    if (orden !== "nuevos") params.set("orden", orden);
    if (page > 1) params.set("pagina", String(page));
    return `/buscar?${params.toString()}`;
  };

  return (
    <div className="container-max py-6">
      {/* Page header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Search className="w-5 h-5 text-[var(--color-primary)]" />
          <h1
            className="text-headline-md text-[var(--color-on-surface)]"
            style={{ fontFamily: "var(--font-headline)" }}
          >
            {q ? `Resultados para "${q}"` : "Buscar productos"}
          </h1>
        </div>
        {q && (
          <p className="text-sm text-[var(--color-on-surface-variant)]">
            Encuentra el mejor precio entre múltiples vendedores
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6 items-start">
        {/* Sidebar — desktop */}
        <div className="hidden md:block">
          <div className="sticky top-24 border border-[var(--color-border-subtle)] rounded-lg p-4 bg-white">
            <Suspense fallback={<FilterSidebarSkeleton />}>
              <FilterSidebar />
            </Suspense>
          </div>
        </div>

        {/* Main content */}
        <div className="min-w-0">
          {/* Mobile filter accordion */}
          <details className="md:hidden border border-[var(--color-border-subtle)] rounded-lg p-3 mb-4 bg-white">
            <summary className="text-sm font-semibold cursor-pointer select-none text-[var(--color-on-surface)]">
              Filtros {(regulado || biologico || organico || pais) && "•"}
            </summary>
            <div className="mt-4">
              <Suspense fallback={<FilterSidebarSkeleton />}>
                <FilterSidebar />
              </Suspense>
            </div>
          </details>

          {/* Toolbar */}
          <Suspense
            fallback={
              <div className="h-12 bg-gray-100 rounded animate-pulse mb-4" />
            }
          >
            <CatalogToolbar total={total} q={q} />
          </Suspense>

          {/* Results grid */}
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
              <EmptyState q={q} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ q }: { q?: string }) {
  return (
    <div className="text-center py-20 text-[var(--color-on-surface-variant)]">
      <div className="text-5xl mb-4">🔍</div>
      <p className="text-lg font-semibold text-[var(--color-on-surface)] mb-2">
        {q
          ? `No encontramos resultados para "${q}"`
          : "No hay productos con estos filtros"}
      </p>
      <p className="text-sm mb-6">
        Prueba con otros términos o quita algunos filtros
      </p>
      <a
        href="/buscar"
        className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-md text-sm font-medium hover:bg-[var(--color-primary-container)] transition-colors"
      >
        Limpiar búsqueda
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
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-7 bg-gray-200 rounded" />
        ))}
      </div>
    </div>
  );
}
