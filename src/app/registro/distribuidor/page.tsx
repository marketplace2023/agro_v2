import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Registro Distribuidor | Marketplace Agro",
};

export default function RegistroDistribuidorPage() {
  return (
    <div className="min-h-screen bg-[var(--color-surface-container-low)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <Link href="/registro" className="inline-flex items-center gap-1 text-sm text-[var(--color-primary)] hover:underline mb-4">
            ← Volver a elegir tipo de cuenta
          </Link>
          <div className="text-4xl mb-2">🚚</div>
          <h1 className="text-2xl font-bold text-[var(--color-on-surface)]">Registro de distribuidor</h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">
            Distribuye productos de fabricantes en tu territorio asignado
          </p>
        </div>
        <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] shadow-sm p-6 space-y-4">
          <div className="p-4 bg-[var(--color-surface-container-low)] rounded-lg text-sm text-[var(--color-on-surface-variant)]">
            El registro de distribuidor sigue el mismo proceso que vendedor. Al completar el formulario, selecciona
            <strong> "Distribuidor"</strong> como tipo de empresa.
          </div>
          <Link
            href="/registro/vendedor"
            className="block w-full text-center py-2.5 bg-[var(--color-primary)] text-white font-medium rounded-lg hover:bg-[var(--color-primary-container)] transition-colors"
          >
            Comenzar registro como distribuidor
          </Link>
        </div>
        <p className="mt-4 text-center text-sm text-[var(--color-on-surface-variant)]">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-[var(--color-primary)] font-medium hover:underline">Iniciar sesión</Link>
        </p>
      </div>
    </div>
  );
}
