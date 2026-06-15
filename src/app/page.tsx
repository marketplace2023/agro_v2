import type { Metadata } from "next";
import Script from "next/script";
import { HeroSection } from "@/components/home/hero-section";
import { CategoriesSection } from "@/components/home/categories-section";
import { ValuePropsSection } from "@/components/home/value-props-section";
import { CropsSection } from "@/components/home/crops-section";
import { CategoryNav } from "@/components/layout/category-nav";
import {
  ProductCarousel,
  type ProductCardProps,
} from "@/components/product/product-card";
import { getProducts, type ProductListItem } from "@/lib/catalog/service";
import { prisma } from "@/lib/db/prisma";

export const metadata: Metadata = {
  title: "Marketplace Agro",
  description:
    "Compra, cotiza y gestiona agroinsumos: fertilizantes, herbicidas, fungicidas, biológicos e insecticidas. Más de 5,000 productos regulados. Múltiples vendedores.",
};

function toCard(p: ProductListItem): ProductCardProps {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: p.brand?.name ?? "—",
    category: p.category.name,
    imageUrl: p.imageUrl ?? undefined,
    rating: p.rating,
    reviewCount: p.reviewCount,
    priceFrom: p.priceFrom,
    isRegulated: p.isRegulated,
    isBiological: p.isBiological,
    isNew: p.isNew,
  };
}

const SCHEMA_ORG = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://marketplaceagro.com/#organization",
      name: "Marketplace Agro",
      url: "https://marketplaceagro.com",
      description: "Plataforma B2B de agroinsumos regulados para Latinoamérica",
      sameAs: [],
    },
    {
      "@type": "WebSite",
      "@id": "https://marketplaceagro.com/#website",
      url: "https://marketplaceagro.com",
      name: "Marketplace Agro",
      publisher: { "@id": "https://marketplaceagro.com/#organization" },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate:
            "https://marketplaceagro.com/buscar?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default async function HomePage() {
  const [featured, newProducts, biological, vendors] = await Promise.all([
    getProducts({ limite: 8 }).catch(() => ({ items: [] })),
    getProducts({ orden: "nuevos", limite: 8 }).catch(() => ({ items: [] })),
    getProducts({ biologico: true, limite: 8 }).catch(() => ({ items: [] })),
    prisma.vendor.findMany({
      where: { verified: true },
      select: { company: { select: { name: true, commercialName: true } } },
      take: 6,
    }).catch(() => []),
  ]);

  const featuredCards = featured.items.map(toCard);
  const newCards = newProducts.items.map(toCard);
  const bioCards = biological.items.map(toCard);

  const vendorNames = vendors.length > 0
    ? vendors.map(v => v.company?.commercialName ?? v.company?.name ?? "—")
    : ["Fertiagro", "AgroQuim", "BioSolutions", "CropProtect", "PestControl", "NutriPlant"];

  return (
    <>
      <Script
        id="schema-org"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA_ORG) }}
      />
      <HeroSection />
      <CategoryNav variant="horizontal" />
      <div className="container-max py-4">
        <CategoriesSection />
        <ProductCarousel
          title="Productos destacados"
          products={featuredCards}
          viewAllHref="/productos"
        />
        <div className="my-12">
          <ValuePropsSection />
        </div>
        <CropsSection />
        <div className="mt-12">
          <ProductCarousel
            title="Nuevos productos"
            products={newCards}
            viewAllHref="/productos?orden=nuevos"
          />
        </div>
        <div className="my-12">
          <ProductCarousel
            title="Productos biológicos y orgánicos"
            products={bioCards}
            viewAllHref="/productos?biologico=1"
          />
        </div>
        <section className="py-10 border-t border-[var(--color-border-subtle)]">
          <div className="text-center mb-6">
            <h2 className="text-headline-md mb-2">Vendedores verificados</h2>
            <p className="text-sm text-[var(--color-on-surface-variant)]">
              Fabricantes y distribuidores con registros vigentes en múltiples
              países
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 grayscale hover:grayscale-0 transition-all">
            {vendorNames.map((v) => (
              <div
                key={v}
                className="w-28 h-14 rounded-lg border border-[var(--color-border-subtle)] bg-white flex items-center justify-center text-xs font-bold text-[var(--color-on-surface-variant)]"
              >
                {v}
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
