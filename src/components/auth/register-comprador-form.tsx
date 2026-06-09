"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff } from "lucide-react";

const COUNTRIES = [
  { code: "CO", name: "Colombia" }, { code: "VE", name: "Venezuela" },
  { code: "EC", name: "Ecuador" }, { code: "MX", name: "México" },
  { code: "PE", name: "Perú" }, { code: "BR", name: "Brasil" },
  { code: "AR", name: "Argentina" }, { code: "CL", name: "Chile" },
  { code: "BO", name: "Bolivia" }, { code: "GT", name: "Guatemala" },
];

const CROPS = ["Maíz", "Café", "Tomate", "Papa", "Banano", "Arroz", "Caña de azúcar", "Aguacate", "Cacao", "Soya"];

const VOLUME_OPTIONS = [
  { value: "less_500", label: "Menos de $500 USD" },
  { value: "500_5000", label: "$500 – $5,000 USD" },
  { value: "5000_50000", label: "$5,000 – $50,000 USD" },
  { value: "more_50000", label: "Más de $50,000 USD" },
];

export function RegisterCompradorForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "", lastName: "", email: "", phone: "", country: "CO",
    password: "", passwordConfirm: "",
    usageType: "personal", crops: [] as string[], volume: "500_5000",
  });

  function toggleCrop(crop: string) {
    setForm((f) => ({
      ...f,
      crops: f.crops.includes(crop) ? f.crops.filter((c) => c !== crop) : [...f.crops, crop],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.passwordConfirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, role: "comprador" }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Error al crear la cuenta.");
      } else {
        router.push("/login?verify=1");
      }
    } catch {
      setError("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  if (step === 1) {
    return (
      <div className="space-y-4">
        <p className="text-xs text-[var(--color-on-surface-variant)] font-medium uppercase tracking-wide">
          Paso 1 de 2 — Datos personales
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="name">Nombre *</Label>
            <Input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lastName">Apellido *</Label>
            <Input id="lastName" required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Correo electrónico *</Label>
          <Input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="grid grid-cols-[auto_1fr] gap-2">
          <div className="space-y-1.5">
            <Label htmlFor="country">País *</Label>
            <select
              id="country"
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              className="h-10 px-3 rounded-md border border-[var(--color-border-subtle)] text-sm bg-white"
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Teléfono / WhatsApp *</Label>
            <Input id="phone" type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+57 300 000 0000" />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Contraseña *</Label>
          <div className="relative">
            <Input id="password" type={showPwd ? "text" : "password"} required value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })} className="pr-10" />
            <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="passwordConfirm">Confirmar contraseña *</Label>
          <Input id="passwordConfirm" type="password" required value={form.passwordConfirm}
            onChange={(e) => setForm({ ...form, passwordConfirm: e.target.value })} />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="button"
          onClick={() => {
            if (!form.name || !form.email || !form.password || !form.phone) {
              setError("Completa todos los campos obligatorios.");
              return;
            }
            setError("");
            setStep(2);
          }}
          className="w-full py-2.5 bg-[var(--color-primary)] text-white font-medium rounded-lg hover:bg-[var(--color-primary-container)] transition-colors"
        >
          Continuar →
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-xs text-[var(--color-on-surface-variant)] font-medium uppercase tracking-wide">
        Paso 2 de 2 — Perfil de uso
      </p>
      <div className="space-y-2">
        <Label>¿Para qué usarás el marketplace?</Label>
        {[
          { value: "personal", label: "Para mi finca o negocio personal" },
          { value: "empresa", label: "Como representante de una empresa" },
          { value: "consultor", label: "Soy agrónomo o consultor" },
        ].map((opt) => (
          <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="usageType" value={opt.value} checked={form.usageType === opt.value}
              onChange={(e) => setForm({ ...form, usageType: e.target.value })} />
            <span className="text-sm">{opt.label}</span>
          </label>
        ))}
      </div>
      <div className="space-y-2">
        <Label>Cultivos principales</Label>
        <div className="flex flex-wrap gap-2">
          {CROPS.map((crop) => (
            <button
              key={crop}
              type="button"
              onClick={() => toggleCrop(crop)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                form.crops.includes(crop)
                  ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                  : "border-[var(--color-border-subtle)] hover:border-[var(--color-primary)]"
              }`}
            >
              {crop}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <Label>Volumen de compra mensual aproximado</Label>
        {VOLUME_OPTIONS.map((opt) => (
          <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="volume" value={opt.value} checked={form.volume === opt.value}
              onChange={(e) => setForm({ ...form, volume: e.target.value })} />
            <span className="text-sm">{opt.label}</span>
          </label>
        ))}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-3">
        <button type="button" onClick={() => setStep(1)}
          className="px-4 py-2.5 border border-[var(--color-border-subtle)] rounded-lg text-sm font-medium hover:bg-[var(--color-surface-container-low)] transition-colors">
          ← Anterior
        </button>
        <button type="submit" disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[var(--color-primary)] text-white font-medium rounded-lg hover:bg-[var(--color-primary-container)] transition-colors disabled:opacity-60">
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          Crear mi cuenta →
        </button>
      </div>
    </form>
  );
}
