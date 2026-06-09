import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Registrarse | Marketplace Agro",
  description: "Crea tu cuenta en el Marketplace Agro. Compra, vende o conecta como experto agronómico en Latinoamérica.",
};

const ACCOUNT_TYPES = [
  {
    key: "comprador",
    emoji: "🌱",
    title: "Comprar insumos",
    description: "Soy agricultor, finca o agrónomo que compra insumos para mis cultivos.",
    href: "/registro/comprador",
    color: "var(--color-agri-green)",
  },
  {
    key: "vendedor",
    emoji: "🏪",
    title: "Vender productos",
    description: "Soy distribuidor o tienda que vende agroinsumos a compradores.",
    href: "/registro/vendedor",
    color: "var(--color-primary)",
  },
  {
    key: "fabricante",
    emoji: "🏭",
    title: "Soy fabricante",
    description: "Produzco agroinsumos y quiero gestionar mi distribución en el marketplace.",
    href: "/registro/fabricante",
    color: "var(--color-tertiary)",
  },
  {
    key: "distribuidor",
    emoji: "🚚",
    title: "Soy distribuidor",
    description: "Distribuyo productos de fabricantes en mi territorio asignado.",
    href: "/registro/distribuidor",
    color: "var(--color-secondary)",
  },
];

export default function RegistroPage() {
  return (
    <div className="min-h-screen bg-[var(--color-surface-container-low)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)] flex items-center justify-center">
              <span className="text-white font-bold">MA</span>
            </div>
            <span className="text-xl font-bold text-[var(--color-primary)]" style={{ fontFamily: "var(--font-headline)" }}>
              Marketplace Agro
            </span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-[var(--color-on-surface)]">
            ¿Cómo quieres usar el Marketplace Agro?
          </h1>
          <p className="mt-1 text-sm text-[var(--color-on-surface-variant)]">
            Elige el tipo de cuenta que mejor describe tu rol
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ACCOUNT_TYPES.map((type) => (
            <Link
              key={type.key}
              href={type.href}
              className="group bg-white rounded-xl border border-[var(--color-border-subtle)] p-6 hover:border-[var(--color-primary)] hover:shadow-md transition-all"
            >
              <div className="text-4xl mb-3">{type.emoji}</div>
              <h2 className="text-lg font-semibold text-[var(--color-on-surface)] group-hover:text-[var(--color-primary)] transition-colors">
                {type.title}
              </h2>
              <p className="mt-1 text-sm text-[var(--color-on-surface-variant)]">
                {type.description}
              </p>
              <div className="mt-4 text-sm font-medium text-[var(--color-primary)] group-hover:underline">
                Continuar →
              </div>
            </Link>
          ))}
        </div>

        <p className="mt-6 text-center text-sm text-[var(--color-on-surface-variant)]">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-[var(--color-primary)] font-medium hover:underline">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
