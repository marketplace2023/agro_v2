import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Productos por País | Marketplace Agro",
  description: "Encuentra agroinsumos disponibles y regulados en cada país de Latinoamérica: Colombia, Venezuela, Ecuador, México, Perú, Brasil y más.",
};

const COUNTRIES = [
  { code: "CO", name: "Colombia", flag: "🇨🇴", products: 834, vendors: 45, currency: "COP", authority: "ICA" },
  { code: "VE", name: "Venezuela", flag: "🇻🇪", products: 423, vendors: 18, currency: "USD", authority: "SASA" },
  { code: "EC", name: "Ecuador", flag: "🇪🇨", products: 512, vendors: 27, currency: "USD", authority: "AGROCALIDAD" },
  { code: "MX", name: "México", flag: "🇲🇽", products: 756, vendors: 38, currency: "MXN", authority: "SENASICA" },
  { code: "PE", name: "Perú", flag: "🇵🇪", products: 489, vendors: 22, currency: "PEN", authority: "SENASA" },
  { code: "BR", name: "Brasil", flag: "🇧🇷", products: 923, vendors: 52, currency: "BRL", authority: "MAPA" },
  { code: "AR", name: "Argentina", flag: "🇦🇷", products: 678, vendors: 31, currency: "ARS", authority: "SENASA" },
  { code: "CL", name: "Chile", flag: "🇨🇱", products: 345, vendors: 19, currency: "CLP", authority: "SAG" },
  { code: "BO", name: "Bolivia", flag: "🇧🇴", products: 234, vendors: 12, currency: "BOB", authority: "SENASAG" },
  { code: "GT", name: "Guatemala", flag: "🇬🇹", products: 198, vendors: 9, currency: "GTQ", authority: "MAGA" },
  { code: "HN", name: "Honduras", flag: "🇭🇳", products: 156, vendors: 8, currency: "HNL", authority: "SAG" },
  { code: "PA", name: "Panamá", flag: "🇵🇦", products: 134, vendors: 7, currency: "USD", authority: "MIDA" },
  { code: "CR", name: "Costa Rica", flag: "🇨🇷", products: 167, vendors: 9, currency: "CRC", authority: "SENASA-CR" },
  { code: "PY", name: "Paraguay", flag: "🇵🇾", products: 189, vendors: 11, currency: "PYG", authority: "SENAVE" },
  { code: "UY", name: "Uruguay", flag: "🇺🇾", products: 145, vendors: 8, currency: "UYU", authority: "MGAP" },
];

export default function PaisesPage() {
  return (
    <div className="container-max py-8">
      <div className="mb-8">
        <h1 className="text-headline-lg text-[var(--color-on-surface)]">Productos por país</h1>
        <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">
          Catálogo de agroinsumos regulados disponibles en cada mercado de Latinoamérica
        </p>
      </div>

      {/* Map placeholder */}
      <div className="mb-8 rounded-xl bg-[var(--color-surface-container-low)] border border-[var(--color-border-subtle)] p-8 text-center">
        <div className="text-4xl mb-2">🌎</div>
        <p className="text-sm text-[var(--color-on-surface-variant)]">
          Mapa interactivo de Latinoamérica — disponible con Leaflet en producción
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {COUNTRIES.map((country) => (
          <Link
            key={country.code}
            href={`/paises/${country.code.toLowerCase()}`}
            className="group bg-white rounded-xl border border-[var(--color-border-subtle)] p-4 hover:border-[var(--color-primary)] hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{country.flag}</span>
              <div>
                <h2 className="font-semibold text-[var(--color-on-surface)] group-hover:text-[var(--color-primary)] transition-colors">
                  {country.name}
                </h2>
                <p className="text-xs text-[var(--color-on-surface-variant)]">
                  Autoridad: {country.authority}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-[var(--color-surface-container-low)] rounded-lg p-2 text-center">
                <p className="font-semibold text-[var(--color-primary)]">{country.products.toLocaleString()}</p>
                <p className="text-xs text-[var(--color-on-surface-variant)]">productos</p>
              </div>
              <div className="bg-[var(--color-surface-container-low)] rounded-lg p-2 text-center">
                <p className="font-semibold text-[var(--color-primary)]">{country.vendors}</p>
                <p className="text-xs text-[var(--color-on-surface-variant)]">vendedores</p>
              </div>
            </div>
            <div className="mt-3 text-xs text-[var(--color-primary)] group-hover:underline">
              Ver productos en {country.name} →
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
