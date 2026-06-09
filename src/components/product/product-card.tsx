import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingCart, FileText, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  imageUrl?: string | null;
  rating: number;
  reviewCount: number;
  priceFrom: number;
  currency?: string;
  unit?: string;
  isNew?: boolean;
  isRegulated?: boolean;
  isBiological?: boolean;
  isPromo?: boolean;
  promoPercent?: number;
  className?: string;
}

export function ProductCard({
  slug,
  name,
  brand,
  category,
  imageUrl,
  rating,
  reviewCount,
  priceFrom,
  currency = "USD",
  unit = "kg",
  isNew,
  isRegulated,
  isBiological,
  isPromo,
  promoPercent,
  className,
}: ProductCardProps) {
  return (
    <article
      className={cn(
        "card-product group flex flex-col overflow-hidden",
        className,
      )}
    >
      {/* Image */}
      <Link
        href={`/productos/${slug}`}
        className="relative block bg-[var(--color-surface-container-low)] aspect-square overflow-hidden"
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 640px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl opacity-30">
            🌱
          </div>
        )}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isNew && <span className="badge-regulated text-[10px]">NUEVO</span>}
          {isRegulated && (
            <span className="badge-regulated text-[10px]">REGULADO ✓</span>
          )}
          {isBiological && (
            <span className="badge-biological text-[10px]">BIO</span>
          )}
          {isPromo && promoPercent && (
            <span className="badge-danger text-[10px]">-{promoPercent}%</span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3 gap-1.5">
        <p
          className="text-[10px] font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider"
          style={{ fontFamily: "var(--font-label)" }}
        >
          {category}
        </p>
        <Link href={`/productos/${slug}`}>
          <h3 className="text-sm font-semibold text-[var(--color-on-surface)] line-clamp-2 leading-snug hover:text-[var(--color-primary)] transition-colors">
            {name}
          </h3>
        </Link>
        <p className="text-xs text-[var(--color-on-surface-variant)]">
          {brand}
        </p>
        <div className="flex items-center gap-1">
          <Star className="w-3 h-3 fill-[var(--color-rating-stars)] text-[var(--color-rating-stars)]" />
          <span className="text-xs font-semibold">{rating.toFixed(1)}</span>
          <span className="text-xs text-[var(--color-on-surface-variant)]">
            ({reviewCount.toLocaleString()})
          </span>
        </div>
        <div className="mt-auto pt-1.5">
          <p className="text-[10px] text-[var(--color-on-surface-variant)]">
            Precio desde:
          </p>
          <p
            className="leading-none font-bold text-[var(--color-on-surface)]"
            style={{ fontFamily: "var(--font-headline)", fontSize: "1.25rem" }}
          >
            {currency}{" "}
            {priceFrom.toLocaleString("es", { minimumFractionDigits: 2 })}
            <span className="text-xs font-normal text-[var(--color-on-surface-variant)] ml-1">
              / {unit}
            </span>
          </p>
        </div>
        <div className="flex gap-2 mt-2">
          <button className="flex-1 flex items-center justify-center gap-1 h-8 rounded text-xs font-medium bg-[var(--color-primary)] hover:bg-[var(--color-primary-container)] text-white transition-colors">
            <ShoppingCart className="w-3 h-3" /> Agregar
          </button>
          <Link
            href={`/rfq/nueva?producto=${slug}`}
            title="Solicitar cotización"
            className="h-8 w-8 flex items-center justify-center rounded border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-colors"
          >
            <FileText className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("card-product overflow-hidden animate-pulse", className)}
    >
      <div className="aspect-square bg-[var(--color-surface-container-high)]" />
      <div className="p-3 space-y-2">
        <div className="h-2 w-1/3 bg-[var(--color-surface-container-high)] rounded" />
        <div className="h-3 w-full bg-[var(--color-surface-container-high)] rounded" />
        <div className="h-3 w-2/3 bg-[var(--color-surface-container-high)] rounded" />
        <div className="h-2 w-1/4 bg-[var(--color-surface-container-high)] rounded" />
        <div className="h-5 w-1/2 bg-[var(--color-surface-container-high)] rounded mt-2" />
        <div className="flex gap-2 mt-2">
          <div className="h-8 flex-1 bg-[var(--color-surface-container-high)] rounded" />
          <div className="h-8 w-8 bg-[var(--color-surface-container-high)] rounded" />
        </div>
      </div>
    </div>
  );
}

export function ProductGrid({
  products,
  loading,
  skeletonCount = 8,
  className,
}: {
  products: ProductCardProps[];
  loading?: boolean;
  skeletonCount?: number;
  className?: string;
}) {
  if (loading) {
    return (
      <div
        className={cn(
          "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4",
          className,
        )}
      >
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }
  return (
    <div
      className={cn(
        "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4",
        className,
      )}
    >
      {products.map((p) => (
        <ProductCard key={p.id} {...p} />
      ))}
    </div>
  );
}

export function ProductCarousel({
  products,
  title,
  viewAllHref,
  loading,
}: {
  products: ProductCardProps[];
  title: string;
  viewAllHref: string;
  loading?: boolean;
}) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-headline-md">{title}</h2>
        <Link
          href={viewAllHref}
          className="flex items-center gap-1 text-sm text-[var(--color-primary)] hover:underline font-medium"
        >
          Ver todos <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-none -mx-4 px-4">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <ProductCardSkeleton
                key={i}
                className="w-48 sm:w-52 flex-shrink-0"
              />
            ))
          : products.map((p) => (
              <ProductCard
                key={p.id}
                {...p}
                className="w-48 sm:w-52 flex-shrink-0"
              />
            ))}
      </div>
    </section>
  );
}
