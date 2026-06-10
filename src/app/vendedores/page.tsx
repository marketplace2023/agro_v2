import type { Metadata } from "next";
import Link from "next/link";
import { Star, MapPin, Package, ShieldCheck, Search, Filter, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Vendedores | Marketplace Agro",
  description: "Directorio de distribuidores y vendedores certificados de insumos agrícolas en Latinoamérica.",
};

const VENDORS = [
  {
    name: "DistAgroMax", slug: "distagromax", country: "Colombia", since: 2015,
    rating: 4.9, sales: 1245, compliance: 98,
    description: "Distribuidora líder en Colombia con más de 8 años en el sector agroindustrial. Registros vigentes en CO, VE y EC.",
    categories: ["Fertilizantes", "Herbicidas", "Fungicidas", "Biológicos"],
    territories: ["Antioquia", "Cundinamarca", "Valle del Cauca", "Eje Cafetero"],
    verified: true, featured: true,
  },
  {
    name: "AgroSuministros CO", slug: "agrosuministros-co", country: "Colombia", since: 2018,
    rating: 4.7, sales: 890, compliance: 94,
    description: "Especialistas en herbicidas y fertilizantes para papa y cereales. Presencia en Cundinamarca y Boyacá.",
    categories: ["Herbicidas", "Fertilizantes", "Correctores de suelo"],
    territories: ["Cundinamarca", "Boyacá", "Tolima"],
    verified: true, featured: false,
  },
  {
    name: "BioSolutions SA", slug: "biosolutions", country: "Ecuador", since: 2019,
    rating: 4.6, sales: 520, compliance: 96,
    description: "Líderes en bioinsumos agrícolas: bioestimulantes, biofertilizantes y biopesticidas registrados.",
    categories: ["Biológicos", "Bioestimulantes", "Biopesticidas"],
    territories: ["Pichincha", "Guayas", "Manabí"],
    verified: true, featured: false,
  },
  {
    name: "CropProtect MX", slug: "cropprotect", country: "México", since: 2016,
    rating: 4.8, sales: 1870, compliance: 97,
    description: "Distribuidor autorizado de fungicidas e insecticidas con registro SENASICA. Cobertura nacional.",
    categories: ["Fungicidas", "Insecticidas", "Coadyuvantes"],
    territories: ["Sinaloa", "Sonora", "Jalisco", "Guanajuato"],
    verified: true, featured: true,
  },
  {
    name: "AgroVerde PE", slug: "agroverde-pe", country: "Perú", since: 2020,
    rating: 4.4, sales: 310, compliance: 91,
    description: "Distribución de insumos orgánicos y convencionales certificados por SENASA para el agro peruano.",
    categories: ["Fertilizantes", "Biológicos", "Semillas"],
    territories: ["Lima", "Ica", "La Libertad", "Arequipa"],
    verified: false, featured: false,
  },
  {
    name: "NutriPlant BR", slug: "nutriplant", country: "Brasil", since: 2014,
    rating: 4.9, sales: 2340, compliance: 99,
    description: "Mayor distribuidor de fertilizantes foliares en Brasil. Registro MAPA y más de 10 años de experiencia.",
    categories: ["Fertilizantes", "Nutrición foliar", "Correctores"],
    territories: ["São Paulo", "Minas Gerais", "Paraná", "Mato Grosso"],
    verified: true, featured: true,
  },
];

const COUNTRY_FLAG: Record<string, string> = {
  Colombia: "🇨🇴", Ecuador: "🇪🇨", México: "🇲🇽", Perú: "🇵🇪", Brasil: "🇧🇷",
};

export default function VendedoresPage() {
  const featured = VENDORS.filter(v => v.featured);
  const rest = VENDORS.filter(v => !v.featured);

  return (
    <div className="container-max py-8 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-[var(--color-on-surface-variant)]">
        <Link href="/" className="hover:text-[var(--color-primary)] transition-colors">Inicio</Link>
        <ChevronRight size={12} />
        <span className="text-[var(--color-on-surface)] font-medium">Vendedores</span>
      </nav>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[var(--color-on-surface)]">Directorio de vendedores</h1>
        <p className="text-[var(--color-on-surface-variant)] mt-1.5">
          {VENDORS.length} distribuidores certificados en {[...new Set(VENDORS.map(v => v.country))].length} países
        </p>
      </div>

      {/* Search & filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-60">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]" />
          <input
            type="search"
            placeholder="Buscar vendedor o categoría..."
            className="w-full pl-9 pr-4 py-2.5 border border-[var(--color-border-subtle)] rounded-xl text-sm outline-none focus:border-[var(--color-primary)] bg-white"
          />
        </div>
        <select className="border border-[var(--color-border-subtle)] rounded-xl px-3 py-2.5 text-sm text-[var(--color-on-surface-variant)] bg-white outline-none focus:border-[var(--color-primary)] cursor-pointer">
          <option value="">Todos los países</option>
          <option>Colombia</option>
          <option>México</option>
          <option>Ecuador</option>
          <option>Perú</option>
          <option>Brasil</option>
        </select>
        <select className="border border-[var(--color-border-subtle)] rounded-xl px-3 py-2.5 text-sm text-[var(--color-on-surface-variant)] bg-white outline-none focus:border-[var(--color-primary)] cursor-pointer">
          <option value="">Todas las categorías</option>
          <option>Fertilizantes</option>
          <option>Herbicidas</option>
          <option>Fungicidas</option>
          <option>Biológicos</option>
          <option>Insecticidas</option>
        </select>
        <button className="flex items-center gap-2 border border-[var(--color-border-subtle)] rounded-xl px-4 py-2.5 text-sm text-[var(--color-on-surface-variant)] bg-white hover:bg-[var(--color-surface-container-low)] transition-colors">
          <Filter size={14} /> Más filtros
        </button>
      </div>

      {/* Featured vendors */}
      {featured.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-[var(--color-on-surface)]">Vendedores destacados</h2>
            <span className="text-xs bg-[var(--color-primary)] text-white px-2 py-0.5 rounded-full font-medium">Top</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map(vendor => (
              <VendorCard key={vendor.slug} vendor={vendor} featured />
            ))}
          </div>
        </section>
      )}

      {/* All vendors */}
      <section className="space-y-4">
        <h2 className="font-semibold text-[var(--color-on-surface)]">Todos los vendedores</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map(vendor => (
            <VendorCard key={vendor.slug} vendor={vendor} featured={false} />
          ))}
        </div>
      </section>

      {/* Stats bar */}
      <div className="bg-[var(--color-surface-container-low)] border border-[var(--color-border-subtle)] rounded-2xl p-6 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
        {[
          { label: "Vendedores activos", value: VENDORS.length.toString() },
          { label: "Países cubiertos", value: [...new Set(VENDORS.map(v => v.country))].length.toString() },
          { label: "Ventas completadas", value: VENDORS.reduce((s, v) => s + v.sales, 0).toLocaleString() },
          { label: "Calificación promedio", value: (VENDORS.reduce((s, v) => s + v.rating, 0) / VENDORS.length).toFixed(1) },
        ].map(s => (
          <div key={s.label}>
            <p className="text-2xl font-bold text-[var(--color-primary)]">{s.value}</p>
            <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* CTA register as vendor */}
      <div className="bg-[var(--color-primary)] text-white rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">¿Eres distribuidor o fabricante?</h2>
          <p className="text-white/80 mt-1 text-sm">Únete a nuestra red de vendedores y llega a compradores en toda Latinoamérica.</p>
        </div>
        <Link href="/registro/vendedor" className="flex-shrink-0 bg-white text-[var(--color-primary)] font-semibold px-6 py-3 rounded-xl hover:bg-white/90 transition-colors text-sm">
          Registrarse como vendedor →
        </Link>
      </div>
    </div>
  );
}

function VendorCard({ vendor, featured }: { vendor: typeof VENDORS[0]; featured: boolean }) {
  return (
    <Link
      href={`/vendedores/${vendor.slug}`}
      className={`group bg-white border rounded-xl p-5 hover:shadow-md transition-all space-y-4 ${featured ? "border-[var(--color-primary)]/30 shadow-sm" : "border-[var(--color-border-subtle)]"}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[var(--color-surface-container-low)] flex items-center justify-center text-lg font-bold text-[var(--color-primary)] flex-shrink-0">
            {vendor.name.slice(0, 2)}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-sm text-[var(--color-on-surface)] group-hover:text-[var(--color-primary)] transition-colors truncate">{vendor.name}</p>
            <p className="text-xs text-[var(--color-on-surface-variant)] flex items-center gap-1 mt-0.5">
              <MapPin size={10} /> {COUNTRY_FLAG[vendor.country]} {vendor.country} · Desde {vendor.since}
            </p>
          </div>
        </div>
        {vendor.verified && (
          <ShieldCheck size={16} className="text-green-500 flex-shrink-0" />
        )}
      </div>

      {/* Description */}
      <p className="text-xs text-[var(--color-on-surface-variant)] leading-relaxed line-clamp-2">{vendor.description}</p>

      {/* Categories */}
      <div className="flex flex-wrap gap-1.5">
        {vendor.categories.slice(0, 3).map(cat => (
          <span key={cat} className="text-[10px] bg-[var(--color-surface-container-low)] text-[var(--color-on-surface-variant)] px-2 py-0.5 rounded-full">
            {cat}
          </span>
        ))}
        {vendor.categories.length > 3 && (
          <span className="text-[10px] text-[var(--color-on-surface-variant)] px-1">+{vendor.categories.length - 3}</span>
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-xs border-t border-[var(--color-border-subtle)] pt-3">
        <span className="flex items-center gap-1">
          <Star size={11} className="fill-[var(--color-rating-stars)] text-[var(--color-rating-stars)]" />
          <span className="font-semibold">{vendor.rating}</span>
        </span>
        <span className="flex items-center gap-1 text-[var(--color-on-surface-variant)]">
          <Package size={11} /> {vendor.sales.toLocaleString()} ventas
        </span>
        <span className="ml-auto text-[var(--color-primary)] font-medium">Ver perfil →</span>
      </div>
    </Link>
  );
}
