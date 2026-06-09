"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

const COUNTRIES = [
  { code: "CO", name: "Colombia" }, { code: "VE", name: "Venezuela" },
  { code: "EC", name: "Ecuador" }, { code: "MX", name: "México" },
  { code: "PE", name: "Perú" }, { code: "BR", name: "Brasil" },
];
const CATEGORIES = ["Fertilizantes", "Herbicidas", "Fungicidas", "Insecticidas", "Biológicos", "Semillas", "Coadyuvantes", "Maquinaria"];
const COMPANY_TYPES = [
  { value: "distribuidor", label: "Distribuidor" },
  { value: "fabricante", label: "Fabricante" },
  { value: "importador", label: "Importador" },
  { value: "representante", label: "Representante" },
];

export function RegisterVendedorForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "", position: "", email: "", phone: "", country: "CO", password: "",
    companyName: "", tradeName: "", taxId: "", companyCountry: "CO",
    companyType: "distribuidor", address: "", city: "",
    categories: [] as string[], countries: [] as string[], brands: "",
    volume: "10000_100000",
  });

  function toggleItem(key: "categories" | "countries", val: string) {
    setForm((f) => ({
      ...f,
      [key]: f[key].includes(val) ? f[key].filter((x) => x !== val) : [...f[key], val],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, role: "vendedor" }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Error al crear la cuenta.");
      } else {
        router.push("/login?verify=1");
      }
    } catch {
      setError("Error de conexión.");
    } finally {
      setLoading(false);
    }
  }

  const stepLabels = ["Datos del representante", "Datos de la empresa", "Documentos"];

  return (
    <div className="space-y-4">
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-2">
        {stepLabels.map((label, i) => (
          <div key={i} className="flex items-center gap-1 flex-1">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i + 1 <= step ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)]"}`}>
              {i + 1}
            </div>
            <span className={`text-xs ${i + 1 === step ? "text-[var(--color-primary)] font-medium" : "text-[var(--color-on-surface-variant)]"}`}>{label}</span>
            {i < 2 && <div className="flex-1 h-px bg-[var(--color-border-subtle)] ml-1" />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label>Nombre completo *</Label>
              <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Cargo *</Label>
              <Input required value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} /></div>
          </div>
          <div className="space-y-1.5"><Label>Email corporativo *</Label>
            <Input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label>País *</Label>
              <select value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}
                className="h-10 w-full px-3 rounded-md border border-[var(--color-border-subtle)] text-sm bg-white">
                {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5"><Label>Teléfono *</Label>
              <Input type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          </div>
          <div className="space-y-1.5"><Label>Contraseña *</Label>
            <Input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="button" onClick={() => { if (!form.name || !form.email || !form.password) { setError("Completa los campos obligatorios."); return; } setError(""); setStep(2); }}
            className="w-full py-2.5 bg-[var(--color-primary)] text-white font-medium rounded-lg hover:bg-[var(--color-primary-container)] transition-colors">
            Continuar →
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label>Nombre de la empresa *</Label>
              <Input required value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Nombre comercial</Label>
              <Input value={form.tradeName} onChange={(e) => setForm({ ...form, tradeName: e.target.value })} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label>RIF / NIT / RFC *</Label>
              <Input required value={form.taxId} onChange={(e) => setForm({ ...form, taxId: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Tipo de empresa *</Label>
              <select value={form.companyType} onChange={(e) => setForm({ ...form, companyType: e.target.value })}
                className="h-10 w-full px-3 rounded-md border border-[var(--color-border-subtle)] text-sm bg-white">
                {COMPANY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label>Dirección *</Label>
              <Input required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Ciudad *</Label>
              <Input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
          </div>
          <div className="space-y-2"><Label>Categorías que maneja *</Label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button key={cat} type="button" onClick={() => toggleItem("categories", cat)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${form.categories.includes(cat) ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]" : "border-[var(--color-border-subtle)]"}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2"><Label>Países donde vende *</Label>
            <div className="flex flex-wrap gap-2">
              {COUNTRIES.map((c) => (
                <button key={c.code} type="button" onClick={() => toggleItem("countries", c.code)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${form.countries.includes(c.code) ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]" : "border-[var(--color-border-subtle)]"}`}>
                  {c.name}
                </button>
              ))}
            </div>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(1)} className="px-4 py-2.5 border border-[var(--color-border-subtle)] rounded-lg text-sm font-medium hover:bg-[var(--color-surface-container-low)]">← Anterior</button>
            <button type="button" onClick={() => { if (!form.companyName || !form.taxId) { setError("Completa los campos obligatorios."); return; } setError(""); setStep(3); }}
              className="flex-1 py-2.5 bg-[var(--color-primary)] text-white font-medium rounded-lg hover:bg-[var(--color-primary-container)] transition-colors">Continuar →</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <form onSubmit={handleSubmit} className="space-y-3">
          <p className="text-sm text-[var(--color-on-surface-variant)]">
            Para operar como vendedor, necesitamos validar tu empresa. Los documentos son revisados en 2–5 días hábiles.
          </p>
          <div className="space-y-3 border border-[var(--color-border-subtle)] rounded-lg p-4">
            <p className="text-sm font-medium">Documentos obligatorios</p>
            {[
              "RUT / Registro mercantil / Acta constitutiva",
              "Cédula o pasaporte del representante legal",
            ].map((doc) => (
              <div key={doc} className="flex items-center gap-3 text-sm">
                <div className="flex-1 text-[var(--color-on-surface-variant)]">{doc}</div>
                <span className="text-xs text-[var(--color-primary)] font-medium">Subir en el panel</span>
              </div>
            ))}
          </div>
          <label className="flex items-start gap-2 cursor-pointer">
            <input type="checkbox" required className="mt-0.5" />
            <span className="text-xs text-[var(--color-on-surface-variant)]">
              Acepto los{" "}
              <a href="#" className="text-[var(--color-primary)] hover:underline">Términos para vendedores</a>
              {" "}y el{" "}
              <a href="#" className="text-[var(--color-primary)] hover:underline">Acuerdo de comisiones</a>
            </span>
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(2)} className="px-4 py-2.5 border border-[var(--color-border-subtle)] rounded-lg text-sm font-medium hover:bg-[var(--color-surface-container-low)]">← Anterior</button>
            <button type="submit" disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[var(--color-primary)] text-white font-medium rounded-lg hover:bg-[var(--color-primary-container)] transition-colors disabled:opacity-60">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Enviar solicitud →
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
