import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Star,
  ShoppingCart,
  FileText,
  ChevronRight,
  CheckCircle,
  MapPin,
  Truck,
  Package,
} from "lucide-react";
import { getProductBySlug } from "@/lib/catalog/service";
import { ProductTabs } from "@/components/catalog/product-tabs";
import { ProductCarousel } from "@/components/product/product-card";
import { getProducts } from "@/lib/catalog/service";
import type { ProductCardProps } from "@/components/product/product-card";

export const revalidate = 60;

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Producto no encontrado" };

  return {
    title: `${product.name} | Marketplace Agro`,
    description:
      product.description ??
      `Compra ${product.name}${product.brand ? ` de ${product.brand.name}` : ""}. Agroinsumo regulado disponible en múltiples países de Latinoamérica.`,
    openGraph: {
      title: product.name,
      description: product.description ?? "",
      type: "website",
    },
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  // Avg rating from loaded reviews
  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) /
        product.reviews.length
      : 0;

  const reviewCount = product._count.reviews;

  // Breadcrumb
  const breadcrumbs = [
    { label: "Inicio", href: "/" },
    { label: "Productos", href: "/productos" },
    ...(product.category.parent
      ? [
          {
            label: product.category.parent.name,
            href: `/categorias/${product.category.parent.slug}`,
          },
        ]
      : []),
    {
      label: product.category.name,
      href: `/categorias/${product.category.slug}`,
    },
    { label: product.name, href: "#" },
  ];

  // Related products (same category)
  const { items: relatedItems } = await getProducts({
    categoriaSlug: product.category.slug,
    limite: 6,
  });
  const related: ProductCardProps[] = relatedItems
    .filter((p) => p.slug !== slug)
    .slice(0, 5)
    .map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      brand: p.brand?.name ?? "",
      category: p.category.name,
      imageUrl: p.imageUrl,
      priceFrom: p.priceFrom,
      isRegulated: p.isRegulated,
      isBiological: p.isBiological,
      isNew: p.isNew,
      rating: p.rating,
      reviewCount: p.reviewCount,
    }));

  // Lowest price
  const priceFrom =
    product.variants.length > 0 ? product.variants[0].basePrice : 0;

  return (
    <div className="container-max py-6">
      {/* Breadcrumb */}
      <nav aria-label="Migas de pan" className="mb-6">
        <ol className="flex items-center gap-1 text-xs text-[var(--color-on-surface-variant)] flex-wrap">
          {breadcrumbs.map((crumb, i) => (
            <li key={i} className="flex items-center gap-1">
              {i < breadcrumbs.length - 1 ? (
                <>
                  <Link
                    href={crumb.href}
                    className="hover:text-[var(--color-primary)] transition-colors"
                  >
                    {crumb.label}
                  </Link>
                  <ChevronRight className="w-3 h-3" />
                </>
              ) : (
                <span className="text-[var(--color-on-surface)] font-medium line-clamp-1">
                  {crumb.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ── Left column: gallery + info + tabs ─────────────────────────── */}
        <div className="lg:col-span-8 space-y-6">
          {/* Product image placeholder */}
          <div className="bg-[var(--color-surface-container-low,#f5f5f5)] rounded-xl aspect-[4/3] max-h-[400px] flex items-center justify-center overflow-hidden border border-[var(--color-border-subtle)]">
            <div className="text-center">
              <div className="text-8xl opacity-20 mb-3">🌱</div>
              <p className="text-sm text-[var(--color-on-surface-variant)] opacity-60">
                Imagen no disponible
              </p>
            </div>
          </div>

          {/* Product header */}
          <div>
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-3">
              {product.isRegulated && (
                <span className="badge-regulated">REGULADO ✓</span>
              )}
              {product.isBiological && (
                <span className="badge-biological">BIOLÓGICO</span>
              )}
              {product.isOrganic && (
                <span className="badge-biological">ORGÁNICO</span>
              )}
              {product.status === "aprobado" && (
                <span
                  className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{
                    background: "#d4edda",
                    color: "var(--color-agri-green)",
                  }}
                >
                  <CheckCircle className="w-3 h-3" />
                  Verificado
                </span>
              )}
            </div>

            {/* Category */}
            <p className="text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-1">
              <Link
                href={`/categorias/${product.category.slug}`}
                className="hover:text-[var(--color-primary)] transition-colors"
              >
                {product.category.name}
              </Link>
            </p>

            {/* Name */}
            <h1
              className="text-headline-lg text-[var(--color-on-surface)] leading-tight mb-2"
              style={{ fontFamily: "var(--font-headline)" }}
            >
              {product.name}
            </h1>

            {/* Brand */}
            {product.brand && (
              <p className="text-sm text-[var(--color-on-surface-variant)] mb-3">
                Marca:{" "}
                <Link
                  href={`/buscar?marca=${product.brand.slug}`}
                  className="font-medium text-[var(--color-primary)] hover:underline"
                >
                  {product.brand.name}
                </Link>
              </p>
            )}

            {/* Rating summary */}
            {reviewCount > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= Math.round(avgRating)
                          ? "fill-[var(--color-rating-stars)] text-[var(--color-rating-stars)]"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold">
                  {avgRating.toFixed(1)}
                </span>
                <span className="text-sm text-[var(--color-on-surface-variant)]">
                  ({reviewCount.toLocaleString("es")} reseñas)
                </span>
              </div>
            )}
          </div>

          {/* Tabs: Descripción | Ficha Técnica | Regulatorio | Reseñas */}
          <ProductTabs
            tabs={[
              { id: "descripcion", label: "Descripción" },
              { id: "ficha", label: "Ficha Técnica" },
              {
                id: "regulatorio",
                label: `Registros regulatorios (${product.regulatoryRecords.length})`,
              },
              {
                id: "reviews",
                label: `Reseñas (${reviewCount})`,
              },
            ]}
            panels={{
              descripcion: (
                <div className="prose prose-sm max-w-none text-[var(--color-on-surface)]">
                  {product.description ? (
                    <p className="leading-relaxed">{product.description}</p>
                  ) : (
                    <p className="text-[var(--color-on-surface-variant)] italic">
                      Sin descripción disponible.
                    </p>
                  )}
                  {product.technicalDesc && (
                    <p className="mt-4 leading-relaxed">
                      {product.technicalDesc}
                    </p>
                  )}
                  {product.cropTypes.length > 0 && (
                    <div className="mt-4 not-prose">
                      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-on-surface-variant)] mb-2">
                        Cultivos objetivo
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {product.cropTypes.map((c) => (
                          <span
                            key={c}
                            className="px-2 py-1 text-xs bg-gray-100 rounded-full text-[var(--color-on-surface)]"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {product.targetPests.length > 0 && (
                    <div className="mt-4 not-prose">
                      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-on-surface-variant)] mb-2">
                        Plagas / enfermedades objetivo
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {product.targetPests.map((p) => (
                          <span
                            key={p}
                            className="px-2 py-1 text-xs bg-red-50 text-red-700 rounded-full"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ),

              ficha: (
                <div>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                    {[
                      {
                        label: "Ingrediente activo",
                        value: product.activeIngredient,
                      },
                      {
                        label: "Concentración",
                        value: product.concentration,
                      },
                      { label: "Formulación", value: product.formulation },
                      {
                        label: "Modo de acción",
                        value: product.modeOfAction,
                      },
                      { label: "Grupo químico", value: product.chemicalGroup },
                      {
                        label: "Período de carencia",
                        value: product.withdrawalPeriod,
                      },
                      {
                        label: "Intervalo de reingreso",
                        value: product.reentryInterval,
                      },
                    ]
                      .filter((item) => item.value)
                      .map(({ label, value }) => (
                        <div key={label}>
                          <dt className="text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-0.5">
                            {label}
                          </dt>
                          <dd className="text-sm text-[var(--color-on-surface)]">
                            {value}
                          </dd>
                        </div>
                      ))}
                  </dl>

                  {product.applicationMethods.length > 0 && (
                    <div className="mt-6">
                      <p className="text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-2">
                        Métodos de aplicación
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {product.applicationMethods.map((m) => (
                          <span
                            key={m}
                            className="px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded-full"
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {product.documents.length > 0 && (
                    <div className="mt-6">
                      <p className="text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-3">
                        Documentos disponibles
                      </p>
                      <div className="space-y-2">
                        {product.documents.map((doc) => (
                          <a
                            key={doc.id}
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-3 border border-[var(--color-border-subtle)] rounded-lg hover:bg-gray-50 transition-colors group"
                          >
                            <FileText className="w-4 h-4 text-[var(--color-primary)]" />
                            <span className="text-sm font-medium text-[var(--color-on-surface)] group-hover:text-[var(--color-primary)] transition-colors">
                              {doc.title}
                            </span>
                            <span className="ml-auto text-xs text-[var(--color-on-surface-variant)] uppercase">
                              {doc.type.replace("_", " ")}
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ),

              regulatorio: (
                <div>
                  {product.regulatoryRecords.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-[var(--color-border-subtle)]">
                            <th className="text-left py-2 pr-4 text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider">
                              País
                            </th>
                            <th className="text-left py-2 pr-4 text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider">
                              Autoridad
                            </th>
                            <th className="text-left py-2 pr-4 text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider">
                              N.° Registro
                            </th>
                            <th className="text-left py-2 pr-4 text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider">
                              Vence
                            </th>
                            <th className="text-left py-2 text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider">
                              Estado
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-border-subtle)]">
                          {product.regulatoryRecords.map((rec) => (
                            <tr key={rec.id}>
                              <td className="py-3 pr-4 font-medium">
                                {rec.country}
                              </td>
                              <td className="py-3 pr-4 text-[var(--color-on-surface-variant)]">
                                {rec.authority}
                              </td>
                              <td className="py-3 pr-4 font-mono text-xs">
                                {rec.registrationNum}
                              </td>
                              <td className="py-3 pr-4 text-[var(--color-on-surface-variant)]">
                                {new Date(rec.expiresAt).toLocaleDateString(
                                  "es",
                                )}
                              </td>
                              <td className="py-3">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                    rec.status === "aprobado"
                                      ? "badge-regulated"
                                      : rec.status === "vencido"
                                        ? "badge-danger"
                                        : "badge-warning"
                                  }`}
                                >
                                  {rec.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-10 text-[var(--color-on-surface-variant)]">
                      <p className="text-sm">
                        No hay registros regulatorios disponibles.
                      </p>
                    </div>
                  )}
                </div>
              ),

              reviews: (
                <div>
                  {product.reviews.length > 0 ? (
                    <div className="space-y-6">
                      {/* Rating summary */}
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="text-center">
                          <p className="text-4xl font-bold text-[var(--color-on-surface)]">
                            {avgRating.toFixed(1)}
                          </p>
                          <div className="flex justify-center mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-3 h-3 ${
                                  star <= Math.round(avgRating)
                                    ? "fill-[var(--color-rating-stars)] text-[var(--color-rating-stars)]"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-xs text-[var(--color-on-surface-variant)] mt-1">
                            {reviewCount} reseñas
                          </p>
                        </div>
                      </div>

                      {/* Review list */}
                      {product.reviews.map((review) => {
                        const name = review.buyer.profile
                          ? `${review.buyer.profile.firstName} ${review.buyer.profile.lastName[0]}.`
                          : "Usuario verificado";
                        return (
                          <div
                            key={review.id}
                            className="border-b border-[var(--color-border-subtle)] pb-5"
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-sm font-semibold shrink-0">
                                {name[0].toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-sm font-semibold text-[var(--color-on-surface)]">
                                    {name}
                                  </span>
                                  <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star
                                        key={star}
                                        className={`w-3 h-3 ${
                                          star <= review.rating
                                            ? "fill-[var(--color-rating-stars)] text-[var(--color-rating-stars)]"
                                            : "text-gray-300"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </div>
                                {review.cropUsed && (
                                  <p className="text-xs text-[var(--color-on-surface-variant)] mb-1">
                                    Usado en: {review.cropUsed}
                                  </p>
                                )}
                                {review.comment && (
                                  <p className="text-sm text-[var(--color-on-surface)] leading-relaxed">
                                    {review.comment}
                                  </p>
                                )}
                                <p className="text-xs text-[var(--color-on-surface-variant)] mt-1">
                                  {new Date(
                                    review.createdAt,
                                  ).toLocaleDateString("es")}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-[var(--color-on-surface-variant)]">
                      <Star className="w-8 h-8 mx-auto mb-3 opacity-30" />
                      <p className="text-sm">
                        Aún no hay reseñas para este producto.
                      </p>
                    </div>
                  )}
                </div>
              ),
            }}
          />
        </div>

        {/* ── Right column: price + vendors (sticky) ──────────────────────── */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 space-y-4">
            {/* Price card */}
            <div className="border border-[var(--color-border-subtle)] rounded-xl p-5 bg-white shadow-sm">
              {priceFrom > 0 ? (
                <>
                  <p className="text-xs text-[var(--color-on-surface-variant)] mb-1">
                    Precio desde:
                  </p>
                  <p
                    className="text-price text-[var(--color-on-surface)] leading-none mb-1"
                    style={{ fontFamily: "var(--font-headline)" }}
                  >
                    USD{" "}
                    {priceFrom.toLocaleString("es", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                  <p className="text-xs text-[var(--color-on-surface-variant)] mb-4">
                    /{product.variants[0]?.unit ?? "unidad"}
                  </p>
                </>
              ) : (
                <p className="text-sm text-[var(--color-on-surface-variant)] mb-4">
                  Consultar precio
                </p>
              )}

              {/* Variants */}
              {product.variants.length > 1 && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-2">
                    Presentaciones disponibles
                  </p>
                  <div className="space-y-1.5">
                    {product.variants.map((v) => (
                      <div
                        key={v.id}
                        className="flex items-center justify-between text-sm p-2 rounded-md border border-[var(--color-border-subtle)]"
                      >
                        <span>
                          {v.presentation} — {v.unit}
                        </span>
                        <span className="font-semibold">
                          USD{" "}
                          {v.basePrice.toLocaleString("es", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Volume pricing for first variant */}
              {product.variants[0]?.priceVolumes?.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-2">
                    Precios por volumen
                  </p>
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-[var(--color-on-surface-variant)]">
                        <th className="text-left pb-1">Cantidad</th>
                        <th className="text-right pb-1">Precio</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.variants[0].priceVolumes.map((pv) => (
                        <tr key={pv.id} className="border-t border-gray-100">
                          <td className="py-1 text-[var(--color-on-surface)]">
                            {pv.minQty}
                            {pv.maxQty ? `–${pv.maxQty}` : "+"}
                          </td>
                          <td className="py-1 text-right font-semibold text-[var(--color-primary)]">
                            USD{" "}
                            {pv.price.toLocaleString("es", {
                              minimumFractionDigits: 2,
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* CTA buttons */}
              <div className="space-y-2">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[var(--color-secondary)] text-white rounded-md font-semibold text-sm hover:opacity-90 transition-opacity">
                  <ShoppingCart className="w-4 h-4" />
                  Agregar al carrito
                </button>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-[var(--color-primary)] text-[var(--color-primary)] rounded-md font-semibold text-sm hover:bg-[var(--color-primary)] hover:text-white transition-colors">
                  <FileText className="w-4 h-4" />
                  Solicitar cotización (RFQ)
                </button>
              </div>

              {/* Trust signals */}
              <div className="mt-4 space-y-2 border-t border-[var(--color-border-subtle)] pt-4">
                <div className="flex items-center gap-2 text-xs text-[var(--color-on-surface-variant)]">
                  <CheckCircle className="w-3.5 h-3.5 text-[var(--color-agri-green)]" />
                  Producto verificado y regulado
                </div>
                <div className="flex items-center gap-2 text-xs text-[var(--color-on-surface-variant)]">
                  <Truck className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                  Envío disponible a múltiples países
                </div>
                <div className="flex items-center gap-2 text-xs text-[var(--color-on-surface-variant)]">
                  <Package className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                  Múltiples presentaciones disponibles
                </div>
              </div>
            </div>

            {/* Vendors card */}
            {product.vendorListings.length > 0 && (
              <div className="border border-[var(--color-border-subtle)] rounded-xl p-5 bg-white shadow-sm">
                <h2 className="text-sm font-semibold text-[var(--color-on-surface)] mb-3">
                  Vendedores ({product.vendorListings.length})
                </h2>
                <div className="space-y-3">
                  {product.vendorListings.map((listing) => (
                    <div
                      key={listing.id}
                      className="flex items-start gap-3 p-3 rounded-lg border border-[var(--color-border-subtle)] hover:border-[var(--color-primary)] transition-colors"
                    >
                      {/* Vendor info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <Link
                            href={`/vendedores/${listing.vendor.slug}`}
                            className="text-sm font-semibold text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors truncate"
                          >
                            {listing.vendor.company.name}
                          </Link>
                          {listing.vendor.verified && (
                            <CheckCircle className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[var(--color-on-surface-variant)]">
                          <MapPin className="w-3 h-3" />
                          {listing.vendor.company.country}
                          {listing.vendor.rating > 0 && (
                            <>
                              <span>·</span>
                              <Star className="w-3 h-3 fill-[var(--color-rating-stars)] text-[var(--color-rating-stars)]" />
                              {listing.vendor.rating.toFixed(1)}
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-xs text-[var(--color-on-surface-variant)]">
                          <Truck className="w-3 h-3" />
                          {listing.deliveryDays} días · Stock:{" "}
                          {listing.stock > 0 ? (
                            <span className="text-[var(--color-agri-green)] font-medium">
                              {listing.stock} disponibles
                            </span>
                          ) : (
                            <span className="text-[var(--color-secondary)]">
                              Sin stock
                            </span>
                          )}
                        </div>
                      </div>
                      {/* Price */}
                      <div className="text-right shrink-0">
                        <p
                          className="font-bold text-[var(--color-on-surface)]"
                          style={{
                            fontFamily: "var(--font-headline)",
                            fontSize: "1rem",
                          }}
                        >
                          USD{" "}
                          {listing.price.toLocaleString("es", {
                            minimumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div className="mt-12">
          <ProductCarousel
            title={`Más productos de ${product.category.name}`}
            products={related}
            viewAllHref={`/productos?categoria=${product.category.slug}`}
          />
        </div>
      )}
    </div>
  );
}
