import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Star, MapPin, Package, ShieldCheck } from "lucide-react";

export const revalidate = 3600;

// In production this would come from the DB; here we use static demo data
const VENDORS: Record<string, {
  name: string; slug: string; country: string; since: number;
  rating: number; sales: number; compliance: number;
  description: string; categories: string[]; logo?: string;
  email: string; phone: string; territories: string[];
  certifications: string[]; policies: { delivery: string; returns: string; payment: string };
}> = {
  "distagromax": {
    name: "DistAgroMax", slug: "distagromax", country: "Colombia", since: 2015,
    rating: 4.9, sales: 1245, compliance: 98,
    description: "Distribuidora líder en Colombia con más de 8 años en el sector agroindustrial. Representamos a las principales marcas de fertilizantes y agroquímicos con registros vigentes en Colombia, Venezuela y Ecuador.",
    categories: ["Fertilizantes", "Herbicidas", "Fungicidas", "Biológicos"],
    email: "ventas@distagromax.co", phone: "+57 315 000 0000",
    territories: ["Antioquia", "Cundinamarca", "Valle del Cauca", "Eje Cafetero"],
    certifications: ["ISO 9001:2015", "BPA Certificado", "FENALCO miembro"],
    policies: {
      delivery: "Entrega en 3-5 días hábiles para Colombia. Costo de flete calculado por peso y destino. Envíos internacionales disponibles con costo adicional.",
      returns: "Aceptamos devoluciones dentro de los 15 días siguientes a la entrega. El producto debe estar en su embalaje original y sin abrir.",
      payment: "Tarjeta de crédito/débito, transferencia bancaria, PSE (Colombia) y crédito para clientes calificados.",
    },
  },
  "agrosuministros-co": {
    name: "AgroSuministros CO", slug: "agrosuministros-co", country: "Colombia", since: 2018,
    rating: 4.7, sales: 890, compliance: 94,
    description: "Distribuidor con presencia en Cundinamarca y Boyacá. Especialistas en herbicidas y fertilizantes para cultivos de papa y cereales.",
    categories: ["Herbicidas", "Fertilizantes", "Correctores de suelo"],
    email: "info@agrosuministros.co", phone: "+57 312 000 0000",
    territories: ["Cundinamarca", "Boyacá", "Tolima"],
    certifications: ["CAMACOL miembro"],
    policies: {
      delivery: "Entrega en 2-4 días para el centro del país.",
      returns: "Devoluciones en 10 días con producto sin abrir.",
      payment: "Transferencia, efectivo y tarjeta débito.",
    },
  },
};

interface VendorPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: VendorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const vendor = VENDORS[slug];
  if (!vendor) return { title: "Vendedor no encontrado" };
  return {
    title: `${vendor.name} | Vendedores | Marketplace Agro`,
    description: vendor.description,
  };
}

export default async function VendorPage({ params }: VendorPageProps) {
  const { slug } = await params;
  const vendor = VENDORS[slug];
  if (!vendor) notFound();

  const tabs = ["Catálogo", "Sobre nosotros", "Políticas", "Reputación"];

  return (
    <div className="container-max py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-[var(--color-on-surface-variant)] mb-4">
        <Link href="/" className="hover:text-[var(--color-primary)]">Inicio</Link>
        <span>/</span>
        <span className="text-[var(--color-on-surface)]">{vendor.name}</span>
      </nav>

      {/* Header */}
      <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-xl bg-[var(--color-surface-container)] flex items-center justify-center text-xl font-bold text-[var(--color-primary)]">
            {vendor.name.slice(0, 2)}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between flex-wrap gap-2">
              <div>
                <h1 className="text-xl font-bold text-[var(--color-on-surface)]">{vendor.name}</h1>
                <div className="flex items-center gap-3 mt-1 text-sm text-[var(--color-on-surface-variant)]">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{vendor.country}</span>
                  <span>Desde {vendor.since}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <a href={`mailto:${vendor.email}`} className="px-4 py-2 border border-[var(--color-border-subtle)] rounded-lg text-sm font-medium hover:bg-[var(--color-surface-container-low)] transition-colors">
                  Contactar
                </a>
                <Link href="/rfq/nueva" className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-primary-container)] transition-colors">
                  Solicitar cotización
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-3 flex-wrap">
              <div className="flex items-center gap-1 text-sm">
                <Star className="w-4 h-4 fill-[var(--color-rating-stars)] text-[var(--color-rating-stars)]" />
                <span className="font-semibold">{vendor.rating}</span>
                <span className="text-[var(--color-on-surface-variant)]">promedio</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Package className="w-4 h-4 text-[var(--color-primary)]" />
                <span className="font-semibold">{vendor.sales.toLocaleString()}</span>
                <span className="text-[var(--color-on-surface-variant)]">ventas</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <ShieldCheck className="w-4 h-4 text-green-600" />
                <span className="font-semibold">{vendor.compliance}%</span>
                <span className="text-[var(--color-on-surface-variant)]">cumplimiento</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {vendor.categories.map((cat) => (
                  <span key={cat} className="text-xs bg-[var(--color-surface-container)] px-2 py-0.5 rounded-full">{cat}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[var(--color-border-subtle)] mb-6">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((tab, i) => (
            <button key={tab} className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${i === 0 ? "border-[var(--color-primary)] text-[var(--color-primary)]" : "border-transparent text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]"}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* About section (default visible) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
            <h2 className="font-semibold text-[var(--color-on-surface)] mb-3">Sobre {vendor.name}</h2>
            <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">{vendor.description}</p>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-[var(--color-on-surface)]">Territorios de operación</p>
                <ul className="mt-1 space-y-1 text-[var(--color-on-surface-variant)]">
                  {vendor.territories.map((t) => <li key={t}>• {t}</li>)}
                </ul>
              </div>
              <div>
                <p className="font-medium text-[var(--color-on-surface)]">Certificaciones</p>
                <ul className="mt-1 space-y-1 text-[var(--color-on-surface-variant)]">
                  {vendor.certifications.map((c) => <li key={c}>• {c}</li>)}
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
            <h2 className="font-semibold text-[var(--color-on-surface)] mb-3">Políticas</h2>
            {[
              { title: "Entrega", content: vendor.policies.delivery },
              { title: "Devoluciones", content: vendor.policies.returns },
              { title: "Métodos de pago", content: vendor.policies.payment },
            ].map((p) => (
              <div key={p.title} className="mb-4">
                <p className="text-sm font-medium text-[var(--color-on-surface)]">{p.title}</p>
                <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">{p.content}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {/* Rating breakdown */}
          <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
            <h2 className="font-semibold text-[var(--color-on-surface)] mb-3">Calificación</h2>
            {[
              { label: "Calidad del producto", score: 4.9 },
              { label: "Tiempo de respuesta", score: 4.7 },
              { label: "Cumplimiento de entrega", score: 4.8 },
              { label: "Documentación", score: 4.6 },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 mb-2 text-sm">
                <span className="flex-1 text-[var(--color-on-surface-variant)] text-xs">{item.label}</span>
                <span className="font-semibold text-[var(--color-on-surface)]">{item.score}</span>
                <Star className="w-3.5 h-3.5 fill-[var(--color-rating-stars)] text-[var(--color-rating-stars)]" />
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="bg-[var(--color-surface-container-low)] rounded-xl border border-[var(--color-border-subtle)] p-5 text-sm">
            <p className="font-medium text-[var(--color-on-surface)] mb-2">¿Listo para comprar?</p>
            <p className="text-[var(--color-on-surface-variant)] mb-3">Explora el catálogo completo de {vendor.name}</p>
            <Link href={`/buscar?vendedor=${vendor.slug}`} className="block w-full text-center py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-primary-container)] transition-colors">
              Ver catálogo →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
