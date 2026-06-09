import Link from "next/link";
import { ShoppingBag, FileText, CreditCard, CheckCircle2 } from "lucide-react";

const VALUE_PROPS = [
  {
    icon: ShoppingBag,
    title: "Compra directa",
    description:
      "Más de 5,000 productos regulados disponibles de fabricantes y distribuidores verificados.",
    highlight: "5,000+ productos",
    color: "var(--color-primary)",
    bg: "#d9f3ff",
  },
  {
    icon: FileText,
    title: "Cotización por volumen",
    description:
      "Solicita RFQ a múltiples vendedores simultáneamente y compara ofertas en un solo lugar.",
    highlight: "RFQ multi-vendedor",
    color: "var(--color-tertiary)",
    bg: "#e0e0ff",
  },
  {
    icon: CreditCard,
    title: "Crédito comprador",
    description:
      "Financiamiento hasta 90 días para empresas calificadas. Cupos automáticos basados en historial.",
    highlight: "Hasta 90 días",
    color: "var(--color-agri-green)",
    bg: "#d4edda",
  },
  {
    icon: CheckCircle2,
    title: "Regulatorio garantizado",
    description:
      "Ningún producto se vende sin registro vigente por país. Fichas técnicas y SDS disponibles.",
    highlight: "100% regulado",
    color: "var(--color-secondary)",
    bg: "#ffdad5",
  },
];

export function ValuePropsSection() {
  return (
    <section className="py-12 bg-[var(--color-background-alt)] -mx-4 px-4 md:-mx-12 md:px-12 lg:-mx-0 lg:px-0 lg:rounded-xl">
      <div className="container-max">
        <h2 className="text-headline-md text-center mb-8">
          ¿Por qué Marketplace Agro?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {VALUE_PROPS.map(
            ({ icon: Icon, title, description, highlight, color, bg }) => (
              <div
                key={title}
                className="bg-white rounded-lg border border-[var(--color-border-subtle)] p-5 flex flex-col gap-3 hover:shadow-md transition-shadow"
              >
                <div
                  className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: bg }}
                >
                  <Icon className="w-6 h-6" style={{ color }} />
                </div>
                <div>
                  <p
                    className="text-xs font-bold uppercase tracking-wider mb-1"
                    style={{ color, fontFamily: "var(--font-label)" }}
                  >
                    {highlight}
                  </p>
                  <h3 className="font-bold text-[var(--color-on-surface)] mb-1.5">
                    {title}
                  </h3>
                  <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
