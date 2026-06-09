import Link from "next/link";
import { ArrowRight } from "lucide-react";

const CATEGORIES = [
  {
    label: "Fertilizantes",
    href: "/categorias/fertilizantes",
    icon: "🌱",
    count: "1,240+",
  },
  {
    label: "Biológicos",
    href: "/categorias/biologicos",
    icon: "🔬",
    count: "380+",
  },
  {
    label: "Herbicidas",
    href: "/categorias/herbicidas",
    icon: "🌿",
    count: "860+",
  },
  {
    label: "Insecticidas",
    href: "/categorias/insecticidas",
    icon: "🐛",
    count: "620+",
  },
  {
    label: "Fungicidas",
    href: "/categorias/fungicidas",
    icon: "🍄",
    count: "540+",
  },
  {
    label: "Semillas",
    href: "/categorias/semillas",
    icon: "🌾",
    count: "290+",
  },
  {
    label: "Coadyuvantes",
    href: "/categorias/coadyuvantes",
    icon: "⚗️",
    count: "180+",
  },
  {
    label: "Maquinaria",
    href: "/categorias/equipos",
    icon: "🚜",
    count: "95+",
  },
  {
    label: "Servicios agro",
    href: "/categorias/servicios",
    icon: "🛠️",
    count: "40+",
  },
];

export function CategoriesSection() {
  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-headline-md">Categorías principales</h2>
        <Link
          href="/categorias"
          className="flex items-center gap-1 text-sm text-[var(--color-primary)] hover:underline font-medium"
        >
          Ver todas <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-9 gap-3">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.href}
            href={cat.href}
            className="flex flex-col items-center gap-2 p-3 rounded-lg border border-[var(--color-border-subtle)] bg-white hover:border-[var(--color-primary)] hover:shadow-md transition-all group text-center"
          >
            <span className="text-3xl leading-none group-hover:scale-110 transition-transform">
              {cat.icon}
            </span>
            <span className="text-xs font-semibold text-[var(--color-on-surface)] leading-tight">
              {cat.label}
            </span>
            <span className="text-[10px] text-[var(--color-on-surface-variant)]">
              {cat.count}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
