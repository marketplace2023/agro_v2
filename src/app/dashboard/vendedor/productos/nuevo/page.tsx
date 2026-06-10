"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload, Plus, X, Save, AlertCircle, Info } from "lucide-react";

const CATEGORIES = ["Fertilizantes", "Herbicidas", "Insecticidas", "Fungicidas", "Biológicos", "Semillas", "Coadyuvantes", "Maquinaria"];
const BRANDS = ["AgroQuim", "Fertiagro", "BioSolutions", "CropProtect", "PestControl", "NutriPlant"];
const UNITS = ["kg", "lt", "50kg", "25kg", "1L", "5L", "unidad", "tonelada"];

interface FormData {
  name: string;
  sku: string;
  brand: string;
  category: string;
  unit: string;
  basePrice: string;
  stock: string;
  isRegulated: boolean;
  isBiological: boolean;
  description: string;
  technicalSpecs: string;
  activeIngredient: string;
  concentration: string;
  registroSanitario: string;
  registroExpiry: string;
  safetyInterval: string;
  countries: string[];
  images: string[];
}

const INITIAL: FormData = {
  name: "", sku: "", brand: "", category: "", unit: "", basePrice: "", stock: "",
  isRegulated: false, isBiological: false, description: "", technicalSpecs: "",
  activeIngredient: "", concentration: "", registroSanitario: "", registroExpiry: "",
  safetyInterval: "", countries: ["CO"], images: [],
};

export default function NuevoProductoPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(INITIAL);
  const [tab, setTab] = useState<"general" | "regulatorio" | "comercial">("general");
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function set(field: keyof FormData, value: string | boolean | string[]) {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => { const e = { ...prev }; delete e[field]; return e; });
  }

  function validate(): boolean {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.name.trim()) e.name = "El nombre es requerido";
    if (!form.sku.trim()) e.sku = "El SKU es requerido";
    if (!form.category) e.category = "Selecciona una categoría";
    if (!form.unit) e.unit = "Selecciona unidad";
    if (!form.basePrice || isNaN(Number(form.basePrice))) e.basePrice = "Precio inválido";
    if (!form.stock || isNaN(Number(form.stock))) e.stock = "Stock inválido";
    if (form.isRegulated && !form.registroSanitario.trim()) e.registroSanitario = "Registro sanitario requerido para productos regulados";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) { setTab("general"); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 1200));
    setSaving(false);
    setSaved(true);
    setTimeout(() => router.push("/dashboard/vendedor/productos"), 1500);
  }

  function toggleCountry(c: string) {
    set("countries", form.countries.includes(c)
      ? form.countries.filter(x => x !== c)
      : [...form.countries, c]);
  }

  const AVAILABLE_COUNTRIES = ["CO", "VE", "EC", "PE", "MX", "BR", "AR", "CL"];

  return (
    <div className="max-w-3xl space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard/vendedor/productos" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-headline-md font-bold">Agregar producto</h1>
          <p className="text-sm text-[var(--color-on-surface-variant)]">El producto quedará en revisión hasta ser aprobado por el equipo</p>
        </div>
      </div>

      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
          <AlertCircle size={14} /> Producto enviado a revisión. Redirigiendo...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Tabs */}
        <div className="flex border-b border-[var(--color-border-subtle)]">
          {(["general", "regulatorio", "comercial"] as const).map(t => (
            <button key={t} type="button" onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm font-medium capitalize border-b-2 transition-colors ${tab === t ? "border-[var(--color-primary)] text-[var(--color-primary)]" : "border-transparent text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]"}`}>
              {t === "general" ? "Información general" : t === "regulatorio" ? "Datos regulatorios" : "Comercialización"}
            </button>
          ))}
        </div>

        {/* GENERAL */}
        {tab === "general" && (
          <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1.5">Nombre del producto *</label>
                <input value={form.name} onChange={e => set("name", e.target.value)}
                  placeholder="ej. Glifosato 480 SL Herbicida No Selectivo"
                  className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] ${errors.name ? "border-red-400" : "border-[var(--color-border-subtle)]"}`} />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">SKU *</label>
                <input value={form.sku} onChange={e => set("sku", e.target.value.toUpperCase())}
                  placeholder="HRB-GLF-480-5L"
                  className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none font-mono focus:border-[var(--color-primary)] ${errors.sku ? "border-red-400" : "border-[var(--color-border-subtle)]"}`} />
                {errors.sku && <p className="text-xs text-red-500 mt-1">{errors.sku}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Marca</label>
                <select value={form.brand} onChange={e => set("brand", e.target.value)}
                  className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)]">
                  <option value="">Seleccionar marca</option>
                  {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Categoría *</label>
                <select value={form.category} onChange={e => set("category", e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] ${errors.category ? "border-red-400" : "border-[var(--color-border-subtle)]"}`}>
                  <option value="">Seleccionar categoría</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Unidad *</label>
                <select value={form.unit} onChange={e => set("unit", e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] ${errors.unit ? "border-red-400" : "border-[var(--color-border-subtle)]"}`}>
                  <option value="">Seleccionar unidad</option>
                  {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
                {errors.unit && <p className="text-xs text-red-500 mt-1">{errors.unit}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1.5">Descripción</label>
                <textarea value={form.description} onChange={e => set("description", e.target.value)}
                  rows={3} placeholder="Descripción del producto para compradores..."
                  className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] resize-none" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1.5">Especificaciones técnicas</label>
                <textarea value={form.technicalSpecs} onChange={e => set("technicalSpecs", e.target.value)}
                  rows={3} placeholder="Composición, modo de acción, dosis recomendadas..."
                  className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] resize-none" />
              </div>
            </div>

            {/* Type flags */}
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isRegulated} onChange={e => set("isRegulated", e.target.checked)}
                  className="w-4 h-4 accent-[var(--color-primary)]" />
                <span className="text-sm font-medium">Producto regulado</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isBiological} onChange={e => set("isBiological", e.target.checked)}
                  className="w-4 h-4 accent-[var(--color-primary)]" />
                <span className="text-sm font-medium">Biológico / Orgánico</span>
              </label>
            </div>

            {/* Image upload zone */}
            <div>
              <label className="block text-sm font-medium mb-1.5">Imágenes</label>
              <div className="border-2 border-dashed border-[var(--color-border-subtle)] rounded-xl p-8 text-center hover:border-[var(--color-primary)] transition-colors cursor-pointer">
                <Upload size={24} className="mx-auto mb-2 text-[var(--color-on-surface-variant)]" />
                <p className="text-sm text-[var(--color-on-surface-variant)]">Arrastra imágenes aquí o haz clic para seleccionar</p>
                <p className="text-xs text-[var(--color-on-surface-variant)] mt-1">PNG, JPG hasta 5MB. Máximo 8 imágenes.</p>
              </div>
            </div>
          </div>
        )}

        {/* REGULATORIO */}
        {tab === "regulatorio" && (
          <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-6 space-y-5">
            {!form.isRegulated && (
              <div className="flex items-start gap-2 bg-blue-50 text-blue-700 text-sm rounded-lg p-3">
                <Info size={14} className="mt-0.5 flex-shrink-0" />
                <p>El producto no está marcado como regulado. Marca "Producto regulado" en la pestaña General si aplica.</p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Ingrediente activo</label>
                <input value={form.activeIngredient} onChange={e => set("activeIngredient", e.target.value)}
                  placeholder="ej. Glifosato"
                  className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)]" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Concentración</label>
                <input value={form.concentration} onChange={e => set("concentration", e.target.value)}
                  placeholder="ej. 480 g/L"
                  className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)]" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Número de registro sanitario {form.isRegulated && <span className="text-red-500">*</span>}
                </label>
                <input value={form.registroSanitario} onChange={e => set("registroSanitario", e.target.value)}
                  placeholder="ej. ICA-REG-2021-00456"
                  className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] ${errors.registroSanitario ? "border-red-400" : "border-[var(--color-border-subtle)]"}`} />
                {errors.registroSanitario && <p className="text-xs text-red-500 mt-1">{errors.registroSanitario}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Vencimiento del registro</label>
                <input type="date" value={form.registroExpiry} onChange={e => set("registroExpiry", e.target.value)}
                  className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)]" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Intervalo de seguridad (días)</label>
                <input type="number" value={form.safetyInterval} onChange={e => set("safetyInterval", e.target.value)}
                  placeholder="ej. 21"
                  className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)]" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Documentos adjuntos (FDS, Etiqueta, Resolución)</label>
              <div className="border-2 border-dashed border-[var(--color-border-subtle)] rounded-xl p-6 text-center hover:border-[var(--color-primary)] transition-colors cursor-pointer">
                <Upload size={20} className="mx-auto mb-2 text-[var(--color-on-surface-variant)]" />
                <p className="text-sm text-[var(--color-on-surface-variant)]">Adjuntar PDF con documentos regulatorios</p>
              </div>
            </div>
          </div>
        )}

        {/* COMERCIAL */}
        {tab === "comercial" && (
          <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Precio base (USD) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--color-on-surface-variant)]">$</span>
                  <input type="number" step="0.01" value={form.basePrice} onChange={e => set("basePrice", e.target.value)}
                    placeholder="0.00"
                    className={`w-full border rounded-lg pl-7 pr-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] ${errors.basePrice ? "border-red-400" : "border-[var(--color-border-subtle)]"}`} />
                </div>
                {errors.basePrice && <p className="text-xs text-red-500 mt-1">{errors.basePrice}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Stock inicial *</label>
                <input type="number" value={form.stock} onChange={e => set("stock", e.target.value)}
                  placeholder="ej. 200"
                  className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] ${errors.stock ? "border-red-400" : "border-[var(--color-border-subtle)]"}`} />
                {errors.stock && <p className="text-xs text-red-500 mt-1">{errors.stock}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Países donde comercializar</label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_COUNTRIES.map(c => (
                  <button key={c} type="button" onClick={() => toggleCountry(c)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${form.countries.includes(c) ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]" : "border-[var(--color-border-subtle)] hover:border-[var(--color-primary)]"}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Link href="/dashboard/vendedor/productos"
            className="text-sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] flex items-center gap-1">
            <X size={14} /> Cancelar
          </Link>
          <div className="flex gap-3">
            {tab !== "general" && (
              <button type="button" onClick={() => setTab(tab === "comercial" ? "regulatorio" : "general")}
                className="border border-[var(--color-border-subtle)] text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50">
                Anterior
              </button>
            )}
            {tab !== "comercial" ? (
              <button type="button" onClick={() => setTab(tab === "general" ? "regulatorio" : "comercial")}
                className="bg-[var(--color-primary)] text-white text-sm font-semibold px-5 py-2 rounded-lg hover:opacity-90">
                Siguiente
              </button>
            ) : (
              <button type="submit" disabled={saving}
                className="flex items-center gap-2 bg-[var(--color-primary)] text-white text-sm font-semibold px-5 py-2 rounded-lg hover:opacity-90 disabled:opacity-60">
                <Save size={14} /> {saving ? "Enviando..." : "Enviar a revisión"}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
