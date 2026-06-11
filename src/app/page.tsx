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

export const metadata: Metadata = {
  title: "Marketplace Agro",
  description:
    "Compra, cotiza y gestiona agroinsumos: fertilizantes, herbicidas, fungicidas, biológicos e insecticidas. Más de 5,000 productos regulados. Múltiples vendedores.",
};

const FEATURED_PRODUCTS: ProductCardProps[] = [
  {
    id: "1",
    slug: "urea-granulada-46-nitrogeno",
    name: "Urea Granulada 46% Nitrógeno",
    brand: "Fertiagro",
    category: "Fertilizantes",
    rating: 4.8,
    reviewCount: 1240,
    priceFrom: 42.5,
    unit: "50kg",
    isRegulated: true,
  },
  {
    id: "2",
    slug: "glifosato-480-sl",
    name: "Glifosato 480 SL Herbicida No Selectivo",
    brand: "AgroQuim",
    category: "Herbicidas",
    rating: 4.7,
    reviewCount: 890,
    priceFrom: 18.9,
    unit: "lt",
    isRegulated: true,
  },
  {
    id: "3",
    slug: "trichoderma-harzianum-biocontrol",
    name: "Trichoderma Harzianum Biocontrol",
    brand: "BioSolutions",
    category: "Biológicos",
    rating: 4.9,
    reviewCount: 340,
    priceFrom: 35.0,
    unit: "kg",
    isRegulated: true,
    isBiological: true,
    isNew: true,
  },
  {
    id: "4",
    slug: "mancozeb-80-wp-fungicida",
    name: "Mancozeb 80% WP Fungicida Preventivo",
    brand: "CropProtect",
    category: "Fungicidas",
    rating: 4.6,
    reviewCount: 680,
    priceFrom: 22.0,
    unit: "kg",
    isRegulated: true,
  },
  {
    id: "5",
    slug: "chlorpyrifos-480-ec-insecticida",
    name: "Clorpirifos 480 EC Insecticida",
    brand: "PestControl",
    category: "Insecticidas",
    rating: 4.5,
    reviewCount: 520,
    priceFrom: 28.0,
    unit: "lt",
    isRegulated: true,
  },
  {
    id: "6",
    slug: "fosfato-diamonico-npk-18-46-0",
    name: "Fosfato Diamónico NPK 18-46-0",
    brand: "Fertiagro",
    category: "Fertilizantes",
    rating: 4.7,
    reviewCount: 760,
    priceFrom: 55.0,
    unit: "50kg",
    isRegulated: true,
    isPromo: true,
    promoPercent: 12,
  },
];

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

export default function HomePage() {
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
          title="Productos más vendidos"
          products={FEATURED_PRODUCTS}
          viewAllHref="/productos?orden=mas-vendidos"
        />
        <div className="my-12">
          <ValuePropsSection />
        </div>
        <CropsSection />
        <div className="mt-12">
          <ProductCarousel
            title="Nuevos productos"
            products={[
              ...FEATURED_PRODUCTS.filter((p) => p.isNew),
              ...FEATURED_PRODUCTS.slice(0, 4),
            ]}
            viewAllHref="/productos?orden=nuevos"
          />
        </div>
        <div className="my-12">
          <ProductCarousel
            title="Productos en promoción"
            products={[
              ...FEATURED_PRODUCTS.filter((p) => p.isPromo),
              ...FEATURED_PRODUCTS.slice(1, 5),
            ]}
            viewAllHref="/productos?orden=promocion"
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
            {[
              "Fertiagro",
              "AgroQuim",
              "BioSolutions",
              "CropProtect",
              "PestControl",
              "NutriPlant",
            ].map((v) => (
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
