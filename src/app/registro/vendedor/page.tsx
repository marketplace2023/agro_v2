import type { Metadata } from "next";
import Link from "next/link";
import { RegisterVendedorForm } from "@/components/auth/register-vendedor-form";

export const metadata: Metadata = {
  title: "Registro Vendedor | Marketplace Agro",
  description: "Registra tu empresa y empieza a vender agroinsumos en el Marketplace Agro.",
};

export default function RegistroVendedorPage() {
  return (
    <div className="min-h-screen bg-[var(--color-surface-container-low)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <Link href="/registro" className="inline-flex items-center gap-1 text-sm text-[var(--color-primary)] hover:underline mb-4">
            ← Volver a elegir tipo de cuenta
          </Link>
          <div className="text-4xl mb-2">🏪</div>
          <h1 className="text-2xl font-bold text-[var(--color-on-surface)]">Registrar empresa vendedora</h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">
            Tu empresa será revisada en 2–5 días hábiles antes de activarse
          </p>
        </div>
        <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] shadow-sm p-6">
          <RegisterVendedorForm />
        </div>
        <p className="mt-4 text-center text-sm text-[var(--color-on-surface-variant)]">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-[var(--color-primary)] font-medium hover:underline">Iniciar sesión</Link>
        </p>
      </div>
    </div>
  );
}
