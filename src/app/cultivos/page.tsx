import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cultivos | Marketplace Agro",
  description: "Encuentra productos agronómicos específicos para cada cultivo: maíz, café, tomate, papa, banano, aguacate, caña de azúcar y más.",
};

const CROPS = [
  { slug: "maiz", name: "Maíz", emoji: "🌽", products: 312, description: "Cereal de alta demanda en Latinoamérica" },
  { slug: "cafe", name: "Café", emoji: "☕", products: 256, description: "Cultivo de exportación y alto valor" },
  { slug: "cana-de-azucar", name: "Caña de azúcar", emoji: "🎋", products: 189, description: "Agroindustria azucarera y biocombustibles" },
  { slug: "tomate", name: "Tomate", emoji: "🍅", products: 198, description: "Horticultura intensiva de alto rendimiento" },
  { slug: "papa", name: "Papa", emoji: "🥔", products: 167, description: "Cultivo andino de consumo masivo" },
  { slug: "banano", name: "Banano", emoji: "🍌", products: 145, description: "Principal producto de exportación tropical" },
  { slug: "aguacate", name: "Aguacate", emoji: "🥑", products: 134, description: "Fruta premium en expansión global" },
  { slug: "arroz", name: "Arroz", emoji: "🌾", products: 178, description: "Alimento básico de Latinoamérica" },
  { slug: "soya", name: "Soya", emoji: "🫘", products: 123, description: "Oleaginosa para aceite y proteína" },
  { slug: "cacao", name: "Cacao", emoji: "🍫", products: 112, description: "Producto de exportación y alta demanda" },
  { slug: "citricos", name: "Cítricos", emoji: "🍊", products: 134, description: "Naranja, limón, mandarina y pomelo" },
  { slug: "hortalizas", name: "Hortalizas", emoji: "🥬", products: 245, description: "Lechuga, espinaca, zanahoria y más" },
  { slug: "pastos", name: "Pastos y forrajes", emoji: "🌿", products: 89, description: "Alimentación ganadera y cobertura vegetal" },
  { slug: "platano", name: "Plátano", emoji: "🫘", products: 98, description: "Musaceae de consumo regional" },
  { slug: "trigo", name: "Trigo", emoji: "🌾", products: 78, description: "Cereal para panificación y pastas" },
  { slug: "frutales", name: "Frutales varios", emoji: "🍇", products: 156, description: "Uva, mango, fresa, maracuyá y más" },
];

export default function CultivosPage() {
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
