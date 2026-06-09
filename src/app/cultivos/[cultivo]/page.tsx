import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProducts } from "@/lib/catalog/service";
import { ProductGrid } from "@/components/product/product-card";
import type { ProductCardProps } from "@/components/product/product-card";

export const revalidate = 3600;

const CROPS_DATA: Record<string, {
  name: string; emoji: string; description: string;
  zones: string[];
  phenology: { stage: string; nutrients: string; products: string[] }[];
  pests: { name: string; damage: string; products: string[] }[];
  diseases: { name: string; symptoms: string; products: string[] }[];
}> = {
  maiz: {
    name: "Maíz", emoji: "🌽",
    description: "El maíz es el cereal de mayor producción en Latinoamérica, fundamental para la seguridad alimentaria y la industria de piensos.",
    zones: ["Valles tropicales", "Tierras medias", "Sabanas", "Zonas áridas con riego"],
    phenology: [
      { stage: "Germinación (0-10 días)", nutrients: "Fósforo (alta demanda)", products: ["Starter fosforado", "Biofertilizante arranque"] },
      { stage: "Crecimiento vegetativo (10-40 días)", nutrients: "Nitrógeno (alta), Fósforo (media)", products: ["Urea 46%", "NPK 18-46-0", "Sulfato amónico"] },
      { stage: "Floración (40-60 días)", nutrients: "Nitrógeno + Potasio (alta)", products: ["Nitrato de potasio", "NPK 15-15-15"] },
      { stage: "Llenado de grano (60-90 días)", nutrients: "Potasio + Micronutrientes", products: ["Sulfato de potasio", "Boro + Zinc foliar"] },
    ],
    pests: [
      { name: "Gusano cogollero (Spodoptera frugiperda)", damage: "Ataca el cogollo dejando hojas con perforaciones irregulares. Puede destruir el punto de crecimiento.", products: ["Clorpirifos 480 EC", "Emamectina benzoato", "Spinosad (bio)"] },
      { name: "Diabrótica (Diabrotica virgifera)", damage: "Larvas atacan raíces causando acame. Adultos dañan hojas y estigmas.", products: ["Bifentrina", "Teflutrina (suelo)"] },
      { name: "Pulgón del maíz (Rhopalosiphum maidis)", damage: "Colonias en la espiga, transmite virus y reduce el llenado de grano.", products: ["Imidacloprid", "Pimetrozina", "Jabón potásico (bio)"] },
    ],
    diseases: [
      { name: "Roya común (Puccinia sorghi)", symptoms: "Pústulas marrones en haz y envés de las hojas. Reduce fotosíntesis.", products: ["Tebuconazol", "Propiconazol", "Azoxistrobina + Ciproconazol"] },
      { name: "Tizón norteño (Exserohilum turcicum)", symptoms: "Lesiones elípticas grisáceas en hojas. Severo en clima húmedo.", products: ["Mancozeb 80 WP", "Clorotalonil", "Trifloxistrobina"] },
      { name: "Pudrición de mazorca (Fusarium spp.)", symptoms: "Podredumbre rosada o blanca en granos. Produce micotoxinas.", products: ["Captan", "Fludioxonil (tratamiento de semilla)"] },
    ],
  },
  cafe: {
    name: "Café", emoji: "☕",
    description: "El café es uno de los principales productos de exportación de Latinoamérica. Colombia, Brasil y Honduras son los mayores productores.",
    zones: ["Altiplanos tropicales 600-2200 msnm", "Zonas de montaña", "Valles cafeteros"],
    phenology: [
      { stage: "Establecimiento (0-12 meses)", nutrients: "Fósforo + Nitrógeno", products: ["DAP 18-46-0", "Cal dolomita"] },
      { stage: "Crecimiento vegetativo (12-24 meses)", nutrients: "Nitrógeno + Potasio", products: ["Urea", "Cloruro de potasio", "NPK 17-6-18"] },
      { stage: "Floración y cuaje", nutrients: "Boro + Calcio + Zinc", products: ["Boro soluble", "Calcio foliar"] },
      { stage: "Llenado de fruto", nutrients: "Potasio + Magnesio", products: ["Sulfato de potasio", "Sulfato de magnesio"] },
    ],
    pests: [
      { name: "Broca del café (Hypothenemus hampei)", damage: "La hembra perfora el grano y se reproduce dentro, destruyendo el fruto.", products: ["Beauveria bassiana (bio)", "Spinosad", "Clorpirifos"] },
      { name: "Minador de la hoja (Leucoptera coffeella)", damage: "Larvas minan el interior de las hojas causando manchas doradas.", products: ["Cipermetrina", "Lambdacialotrina"] },
    ],
    diseases: [
      { name: "Roya del café (Hemileia vastatrix)", symptoms: "Manchas amarillas en el haz y polvo naranja en el envés. Principal amenaza.", products: ["Triazoles + Estrobirulinas", "Oxicloruro de cobre", "Azoxistrobina"] },
      { name: "Ojo de gallo (Mycena citricolor)", symptoms: "Manchas circulares cafés con centro claro en hojas y frutos.", products: ["Cobre (hidróxido)", "Mancozeb", "Propiconazol"] },
    ],
  },
  tomate: {
    name: "Tomate", emoji: "🍅",
    description: "El tomate es la hortaliza más producida en el mundo. En Latinoamérica se cultiva tanto a campo abierto como bajo invernadero.",
    zones: ["Costa (campo abierto)", "Valles interandinos", "Bajo invernadero en cualquier altitud"],
    phenology: [
      { stage: "Trasplante y arraigo (0-15 días)", nutrients: "Fósforo + Calcio", products: ["Superfosfato triple", "Nitrato de calcio"] },
      { stage: "Crecimiento vegetativo (15-40 días)", nutrients: "Nitrógeno + Magnesio", products: ["Urea", "Sulfato de magnesio", "NPK 20-20-20"] },
      { stage: "Floración (40-65 días)", nutrients: "Boro + Calcio + Potasio", products: ["Boro soluble", "Calcio foliar", "Nitrato de potasio"] },
      { stage: "Fructificación y maduración (65-90 días)", nutrients: "Potasio + Calcio", products: ["SQM potasio", "Nitrato cálcico"] },
    ],
    pests: [
      { name: "Mosca blanca (Bemisia tabaci)", damage: "Transmite virus. Las ninfas succionan la savia y producen fumagina.", products: ["Imidacloprid", "Spiromesifen", "Aceite de nim (bio)"] },
      { name: "Trips (Frankliniella occidentalis)", damage: "Daño foliar y transmisión del virus del bronceado del tomate (TSWV).", products: ["Spinosad", "Abamectina", "Formetanato"] },
    ],
    diseases: [
      { name: "Tizón tardío (Phytophthora infestans)", symptoms: "Manchas acuosas en hojas y frutos que se necrosan rápidamente.", products: ["Metalaxil + Mancozeb", "Cimoxanil", "Fosetil aluminio"] },
      { name: "Botrytis / moho gris (Botrytis cinerea)", symptoms: "Pelusa gris en tallos, hojas y frutos. Favorecida por alta humedad.", products: ["Iprodione", "Fludioxonil", "Tiram"] },
    ],
  },
};

interface CropPageProps {
  params: Promise<{ cultivo: string }>;
}

export async function generateMetadata({ params }: CropPageProps): Promise<Metadata> {
  const { cultivo } = await params;
  const crop = CROPS_DATA[cultivo];
  if (!crop) return { title: "Cultivo no encontrado" };
  return {
    title: `${crop.name} — Productos y guías técnicas | Marketplace Agro`,
    description: crop.description,
  };
}

export default async function CropPage({ params }: CropPageProps) {
  const { cultivo } = await params;
  const crop = CROPS_DATA[cultivo];
  if (!crop) notFound();

  const { items } = await getProducts({ q: crop.name, limite: 6, orden: "nuevos", pagina: 1 });
  const cards: ProductCardProps[] = items.map((item) => ({
    id: item.id, slug: item.slug, name: item.name,
    brand: item.brand?.name ?? "", category: item.category.name,
    imageUrl: item.imageUrl, priceFrom: item.priceFrom,
    isRegulated: item.isRegulated, isBiological: item.isBiological,
    isNew: item.isNew, rating: item.rating, reviewCount: item.reviewCount,
  }));

  return (
    <div className="container-max py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-[var(--color-on-surface-variant)] mb-4">
        <Link href="/" className="hover:text-[var(--color-primary)]">Inicio</Link>
        <span>/</span>
        <Link href="/cultivos" className="hover:text-[var(--color-primary)]">Cultivos</Link>
        <span>/</span>
        <span className="text-[var(--color-on-surface)]">{crop.name}</span>
      </nav>

      {/* Hero */}
      <div className="mb-8 p-6 rounded-xl bg-gradient-to-r from-[var(--color-agri-green)] to-emerald-600 text-white">
        <div className="flex items-center gap-4">
          <span className="text-5xl">{crop.emoji}</span>
          <div>
            <h1 className="text-2xl font-bold">{crop.name}</h1>
            <p className="text-sm text-white/80 mt-1">{crop.description}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {crop.zones.map((z) => (
                <span key={z} className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{z}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Phenology */}
          <section className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
            <h2 className="font-semibold text-[var(--color-on-surface)] mb-4">📅 Etapas fenológicas y nutrición</h2>
            <div className="space-y-4">
              {crop.phenology.map((phase, i) => (
                <div key={i} className="border-l-2 border-[var(--color-primary)] pl-4">
                  <p className="text-sm font-medium text-[var(--color-on-surface)]">{phase.stage}</p>
                  <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{phase.nutrients}</p>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {phase.products.map((p) => (
                      <Link key={p} href={`/buscar?q=${encodeURIComponent(p)}`}
                        className="text-xs bg-[var(--color-surface-container)] hover:bg-[var(--color-primary)] hover:text-white px-2 py-0.5 rounded-full transition-colors">
                        {p}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Pests */}
          <section className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
            <h2 className="font-semibold text-[var(--color-on-surface)] mb-4">🐛 Plagas frecuentes</h2>
            <div className="space-y-4">
              {crop.pests.map((pest, i) => (
                <details key={i} className="group border border-[var(--color-border-subtle)] rounded-lg">
                  <summary className="flex items-center justify-between p-3 cursor-pointer list-none text-sm font-medium text-[var(--color-on-surface)]">
                    {pest.name}
                    <span className="text-[var(--color-on-surface-variant)] group-open:rotate-180 transition-transform">▾</span>
                  </summary>
                  <div className="p-3 pt-0">
                    <p className="text-xs text-[var(--color-on-surface-variant)] mb-2">{pest.damage}</p>
                    <p className="text-xs font-medium text-[var(--color-on-surface)] mb-1">Productos recomendados:</p>
                    <div className="flex flex-wrap gap-1">
                      {pest.products.map((p) => (
                        <Link key={p} href={`/buscar?q=${encodeURIComponent(p)}`}
                          className="text-xs bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded-full hover:bg-red-100 transition-colors">
                          {p}
                        </Link>
                      ))}
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* Diseases */}
          <section className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
            <h2 className="font-semibold text-[var(--color-on-surface)] mb-4">🍄 Enfermedades frecuentes</h2>
            <div className="space-y-4">
              {crop.diseases.map((disease, i) => (
                <details key={i} className="group border border-[var(--color-border-subtle)] rounded-lg">
                  <summary className="flex items-center justify-between p-3 cursor-pointer list-none text-sm font-medium text-[var(--color-on-surface)]">
                    {disease.name}
                    <span className="text-[var(--color-on-surface-variant)] group-open:rotate-180 transition-transform">▾</span>
                  </summary>
                  <div className="p-3 pt-0">
                    <p className="text-xs text-[var(--color-on-surface-variant)] mb-2">{disease.symptoms}</p>
                    <p className="text-xs font-medium text-[var(--color-on-surface)] mb-1">Productos recomendados:</p>
                    <div className="flex flex-wrap gap-1">
                      {disease.products.map((p) => (
                        <Link key={p} href={`/buscar?q=${encodeURIComponent(p)}`}
                          className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full hover:bg-amber-100 transition-colors">
                          {p}
                        </Link>
                      ))}
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-4">
          {/* Recommended products */}
          {cards.length > 0 && (
            <section>
              <h2 className="font-semibold text-[var(--color-on-surface)] mb-3">Productos recomendados</h2>
              <div className="space-y-3">
                {cards.slice(0, 4).map((card) => (
                  <Link key={card.id} href={`/productos/${card.slug}`}
                    className="flex items-center gap-3 bg-white rounded-lg border border-[var(--color-border-subtle)] p-3 hover:border-[var(--color-primary)] transition-colors">
                    <div className="w-10 h-10 rounded bg-[var(--color-surface-container)] flex items-center justify-center text-lg">🌱</div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[var(--color-on-surface)] truncate">{card.name}</p>
                      <p className="text-xs text-[var(--color-on-surface-variant)]">{card.brand} · {card.category}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <Link href={`/buscar?q=${crop.name}`} className="block mt-3 text-center text-sm text-[var(--color-primary)] hover:underline">
                Ver todos los productos →
              </Link>
            </section>
          )}

          {/* Expert CTA */}
          <div className="bg-[var(--color-agri-green)] text-white rounded-xl p-5">
            <div className="text-2xl mb-2">🌱</div>
            <h3 className="font-semibold mb-1">¿Necesitas asesoría?</h3>
            <p className="text-xs text-white/80 mb-3">
              Conecta con un asesor agronómico especialista en {crop.name}
            </p>
            <Link href="/expertos" className="block text-center py-2 bg-white text-[var(--color-agri-green)] rounded-lg text-sm font-medium hover:bg-white/90 transition-colors">
              Ver expertos →
            </Link>
          </div>

          {/* Problem diagnosis CTA */}
          <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
            <h3 className="font-semibold text-[var(--color-on-surface)] mb-1">¿Tienes un problema?</h3>
            <p className="text-xs text-[var(--color-on-surface-variant)] mb-3">
              Describe los síntomas y encuentra el diagnóstico y tratamiento adecuado
            </p>
            <Link href={`/problemas-agricolas?cultivo=${cultivo}`} className="block text-center py-2 border border-[var(--color-primary)] text-[var(--color-primary)] rounded-lg text-sm font-medium hover:bg-[var(--color-surface-container-low)] transition-colors">
              Diagnosticar problema →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
