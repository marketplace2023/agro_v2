import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Registro Fabricante | Marketplace Agro",
};

export default function RegistroFabricantePage() {
  return (
    <div className="min-h-screen bg-[var(--color-surface-container-low)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <Link href="/registro" className="inline-flex items-center gap-1 text-sm text-[var(--color-primary)] hover:underline mb-4">
            ← Volver a elegir tipo de cuenta
          </Link>
          <div className="text-4xl mb-2">🏭</div>
          <h1 className="text-2xl font-bold text-[var(--color-on-surface)]">Registro de fabricante</h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">
            El proceso de fabricante incluye los pasos del vendedor más la gestión de líneas de producto y registros sanitarios.
          </p>
        </div>
        <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] shadow-sm p-6 space-y-4">
          <div className="p-4 bg-[var(--color-surface-container-low)] rounded-lg text-sm text-[var(--color-on-surface-variant)]">
            El proceso de registro de fabricante incluye los mismos pasos que el vendedor, más:
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li>Listado de líneas de productos propios</li>
              <li>Upload de registros sanitarios por país</li>
              <li>Distribuidores autorizados</li>
              <li>Declaración de territorios y condiciones</li>
            </ul>
          </div>
          <Link
            href="/registro/vendedor"
            className="block w-full text-center py-2.5 bg-[var(--color-primary)] text-white font-medium rounded-lg hover:bg-[var(--color-primary-container)] transition-colors"
          >
            Comenzar registro como fabricante
          </Link>
          <p className="text-xs text-center text-[var(--color-on-surface-variant)]">
            Al completar el formulario, selecciona "Fabricante" como tipo de empresa
          </p>
        </div>
        <p className="mt-4 text-center text-sm text-[var(--color-on-surface-variant)]">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-[var(--color-primary)] font-medium hover:underline">Iniciar sesión</Link>
        </p>
      </div>
    </div>
  );
}
