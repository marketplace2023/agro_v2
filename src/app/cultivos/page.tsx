import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";

export const metadata: Metadata = {
  title: "Cultivos | Marketplace Agro",
  description: "Encuentra productos agronómicos específicos para cada cultivo: maíz, café, tomate, papa, banano, aguacate, caña de azúcar y más.",
};

const CROPS_META = [
  { slug: "maiz",          name: "Maíz",            emoji: "🌽", description: "Cereal de alta demanda en Latinoamérica" },
  { slug: "cafe",          name: "Café",             emoji: "☕", description: "Cultivo de exportación y alto valor" },
  { slug: "cana-de-azucar",name: "Caña de azúcar",  emoji: "🎋", description: "Agroindustria azucarera y biocombustibles" },
  { slug: "tomate",        name: "Tomate",           emoji: "🍅", description: "Horticultura intensiva de alto rendimiento" },
  { slug: "papa",          name: "Papa",             emoji: "🥔", description: "Cultivo andino de consumo masivo" },
  { slug: "banano",        name: "Banano",           emoji: "🍌", description: "Principal producto de exportación tropical" },
  { slug: "aguacate",      name: "Aguacate",         emoji: "🥑", description: "Fruta premium en expansión global" },
  { slug: "arroz",         name: "Arroz",            emoji: "🌾", description: "Alimento básico de Latinoamérica" },
  { slug: "soya",          name: "Soya",             emoji: "🫘", description: "Oleaginosa para aceite y proteína" },
  { slug: "cacao",         name: "Cacao",            emoji: "🍫", description: "Producto de exportación y alta demanda" },
  { slug: "citricos",      name: "Cítricos",         emoji: "🍊", description: "Naranja, limón, mandarina y pomelo" },
  { slug: "hortalizas",    name: "Hortalizas",       emoji: "🥬", description: "Lechuga, espinaca, zanahoria y más" },
  { slug: "pastos",        name: "Pastos y forrajes", emoji: "🌿", description: "Alimentación ganadera y cobertura vegetal" },
  { slug: "platano",       name: "Plátano",          emoji: "🍌", description: "Musaceae de consumo regional" },
  { slug: "trigo",         name: "Trigo",            emoji: "🌾", description: "Cereal para panificación y pastas" },
  { slug: "frutales",      name: "Frutales varios",  emoji: "🍇", description: "Uva, mango, fresa, maracuyá y más" },
];

export default async function CultivosPage() {
  const counts = await Promise.all(
    CROPS_META.map(c =>
      prisma.product.count({
        where: { cropTypes: { has: c.slug }, status: "aprobado" },
      }).catch(() => 0)
    )
  );
  const CROPS = CROPS_META.map((c, i) => ({ ...c, products: counts[i] }));
  return (
    <div className="container-max py-8">
      <div className="mb-8">
        <h1 className="text-headline-lg text-[var(--color-on-surface)]">Cultivos</h1>
        <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">
          Encuentra productos recomendados, guías técnicas y expertos para cada cultivo
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {CROPS.map((crop) => (
          <Link
            key={crop.slug}
            href={`/cultivos/${crop.slug}`}
            className="group bg-white rounded-xl border border-[var(--color-border-subtle)] p-4 hover:border-[var(--color-primary)] hover:shadow-md transition-all text-center"
          >
            <div className="text-4xl mb-2">{crop.emoji}</div>
            <h2 className="font-semibold text-[var(--color-on-surface)] group-hover:text-[var(--color-primary)] transition-colors">
              {crop.name}
            </h2>
            <p className="text-xs text-[var(--color-on-surface-variant)] mt-1">{crop.description}</p>
            <div className="mt-2 text-xs text-[var(--color-primary)] font-medium">
              {crop.products} productos →
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
