import Link from "next/link";
import { ArrowRight } from "lucide-react";

const CROPS = [
  { label: "Maíz", href: "/cultivos/maiz", emoji: "🌽", products: "320+" },
  { label: "Café", href: "/cultivos/cafe", emoji: "☕", products: "280+" },
  {
    label: "Caña de azúcar",
    href: "/cultivos/cana-azucar",
    emoji: "🎋",
    products: "180+",
  },
  { label: "Tomate", href: "/cultivos/tomate", emoji: "🍅", products: "240+" },
  { label: "Papa", href: "/cultivos/papa", emoji: "🥔", products: "190+" },
  { label: "Banano", href: "/cultivos/banano", emoji: "🍌", products: "160+" },
  {
    label: "Aguacate",
    href: "/cultivos/aguacate",
    emoji: "🥑",
    products: "140+",
  },
  { label: "Cacao", href: "/cultivos/cacao", emoji: "🍫", products: "120+" },
];

export function CropsSection() {
  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-headline-md">Busca por cultivo</h2>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">
            Encuentra los insumos específicos para tu cultivo
          </p>
        </div>
        <Link
          href="/cultivos"
          className="flex items-center gap-1 text-sm text-[var(--color-primary)] hover:underline font-medium"
        >
          Todos los cultivos <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4">
        {CROPS.map((crop) => (
          <Link
            key={crop.href}
            href={crop.href}
            className="flex-shrink-0 flex flex-col items-center gap-2 w-28 p-4 rounded-xl border border-[var(--color-border-subtle)] bg-white hover:border-[var(--color-agri-green)] hover:shadow-md transition-all group"
          >
            <span className="text-4xl leading-none group-hover:scale-110 transition-transform">
              {crop.emoji}
            </span>
            <span className="text-sm font-semibold text-center text-[var(--color-on-surface)] leading-tight">
              {crop.label}
            </span>
            <span className="text-[10px] text-[var(--color-agri-green)] font-medium">
              {crop.products} productos
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
