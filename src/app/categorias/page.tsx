import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Categorías de productos | Marketplace Agro",
  description: "Explora todas las categorías de agroinsumos: fertilizantes, herbicidas, fungicidas, insecticidas, biológicos, semillas y más.",
};

const CATEGORIES = [
  {
    slug: "fertilizantes", name: "Fertilizantes", emoji: "🌿", count: 420,
    description: "Nutrición vegetal para maximizar el rendimiento de tus cultivos",
    subcategories: ["Nitrogenados", "Fosfatados", "Potásicos", "NPK", "Solubles", "Micronutrientes"],
    color: "bg-green-50 border-green-200",
  },
  {
    slug: "biologicos", name: "Biológicos", emoji: "🦠", count: 98,
    description: "Alternativas biológicas sostenibles para la nutrición y protección",
    subcategories: ["Biofertilizantes", "Bioestimulantes", "Biopesticidas", "Microorganismos"],
    color: "bg-emerald-50 border-emerald-200",
  },
  {
    slug: "herbicidas", name: "Herbicidas", emoji: "🌾", count: 187,
    description: "Control efectivo de malezas en todos tus cultivos",
    subcategories: ["Sistémicos", "Contacto", "Preemergentes", "Selectivos"],
    color: "bg-yellow-50 border-yellow-200",
  },
  {
    slug: "insecticidas", name: "Insecticidas", emoji: "🐛", count: 156,
    description: "Protección eficaz contra plagas e insectos dañinos",
    subcategories: ["Organofosforados", "Piretroides", "Neonicotinoides", "Biológicos"],
    color: "bg-orange-50 border-orange-200",
  },
  {
    slug: "fungicidas", name: "Fungicidas", emoji: "🍄", count: 134,
    description: "Control de enfermedades fúngicas y bacterianas",
    subcategories: ["Preventivos", "Curativos", "Sistémicos", "Multisitio"],
    color: "bg-red-50 border-red-200",
  },
  {
    slug: "semillas", name: "Semillas", emoji: "🌱", count: 89,
    description: "Semillas de alta calidad para hortalizas, cereales y frutales",
    subcategories: ["Hortalizas", "Cereales", "Forrajes", "Frutales"],
    color: "bg-lime-50 border-lime-200",
  },
  {
    slug: "coadyuvantes", name: "Coadyuvantes", emoji: "💧", count: 67,
    description: "Mejoran la eficacia de los tratamientos fitosanitarios",
    subcategories: ["Adherentes", "Humectantes", "Reguladores pH", "Antiespumantes"],
    color: "bg-blue-50 border-blue-200",
  },
  {
    slug: "correctores-enmiendas", name: "Correctores y enmiendas", emoji: "🪨", count: 89,
    description: "Mejoran las características físicas y químicas del suelo",
    subcategories: ["Correctores de suelo", "Cal agrícola", "Yeso agrícola", "Enmiendas orgánicas"],
    color: "bg-amber-50 border-amber-200",
  },
  {
    slug: "maquinaria", name: "Maquinaria y equipos", emoji: "⚙️", count: 212,
    description: "Equipos para riego, fumigación y operaciones agrícolas",
    subcategories: ["Riego", "Fumigación", "Bombas", "Herramientas manuales"],
    color: "bg-gray-50 border-gray-200",
  },
  {
    slug: "servicios", name: "Servicios agrícolas", emoji: "🤝", count: 45,
    description: "Asesoría técnica, análisis de suelo, drones y servicios especializados",
    subcategories: ["Asesoría técnica", "Análisis de suelo", "Drones agrícolas", "Aplicación aérea"],
    color: "bg-purple-50 border-purple-200",
  },
];

export default function CategoriasPage() {
  return (
    <div className="container-max py-8">
      <div className="mb-8">
        <h1 className="text-headline-lg text-[var(--color-on-surface)]">Categorías de productos</h1>
        <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">
          Más de 1,500 productos regulados organizados por familia
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={`/categorias/${cat.slug}`}
            className={`group rounded-xl border p-5 hover:shadow-md transition-all ${cat.color}`}
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-3xl">{cat.emoji}</span>
              <span className="text-xs font-medium text-[var(--color-on-surface-variant)] bg-white/80 px-2 py-1 rounded-full border">
                {cat.count} productos
              </span>
            </div>
            <h2 className="text-lg font-semibold text-[var(--color-on-surface)] group-hover:text-[var(--color-primary)] transition-colors">
              {cat.name}
            </h2>
            <p className="text-xs text-[var(--color-on-surface-variant)] mt-1 mb-3">
              {cat.description}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {cat.subcategories.map((sub) => (
                <span key={sub} className="text-xs bg-white/60 border border-current/10 px-2 py-0.5 rounded-full text-[var(--color-on-surface-variant)]">
                  {sub}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
