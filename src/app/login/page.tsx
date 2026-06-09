import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Iniciar sesión | Marketplace Agro",
  description: "Accede a tu cuenta del Marketplace Agro. Compra, vende y gestiona agroinsumos regulados en Latinoamérica.",
};

interface LoginPageProps {
  searchParams: Promise<{ callbackUrl?: string; verify?: string; error?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const sp = await searchParams;
  return (
    <div className="min-h-screen bg-[var(--color-surface-container-low)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
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
            Iniciar sesión
          </h1>
          <p className="mt-1 text-sm text-[var(--color-on-surface-variant)]">
            Accede a tu cuenta para comprar, cotizar y gestionar
          </p>
        </div>

        {sp.verify && (
          <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-sm text-green-800">
            Te enviamos un email de verificación. Revisa tu bandeja de entrada.
          </div>
        )}
        {sp.error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-800">
            {sp.error === "CredentialsSignin"
              ? "Email o contraseña incorrectos."
              : "Ocurrió un error al iniciar sesión. Inténtalo de nuevo."}
          </div>
        )}

        <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] shadow-sm p-6">
          <LoginForm callbackUrl={sp.callbackUrl} />

          <div className="mt-4 text-center">
            <Link
              href="/recuperar-contrasena"
              className="text-sm text-[var(--color-primary)] hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <div className="mt-4 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--color-border-subtle)]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-[var(--color-on-surface-variant)]">
                O inicia sesión con
              </span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <OAuthButton provider="google" label="Google" />
            <OAuthButton provider="microsoft" label="Microsoft" />
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-[var(--color-on-surface-variant)]">
          ¿No tienes cuenta?{" "}
          <Link href="/registro" className="text-[var(--color-primary)] font-medium hover:underline">
            Regístrate gratis
          </Link>
        </p>
      </div>
    </div>
  );
}

function OAuthButton({ provider, label }: { provider: string; label: string }) {
  const icons: Record<string, string> = {
    google: "G",
    microsoft: "M",
  };
  return (
    <form action={`/api/auth/signin/${provider}`} method="POST">
      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--color-border-subtle)] text-sm font-medium hover:bg-[var(--color-surface-container-low)] transition-colors"
      >
        <span className="font-bold text-[var(--color-primary)]">{icons[provider]}</span>
        {label}
      </button>
    </form>
  );
}
