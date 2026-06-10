"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Trash2, AlertTriangle } from "lucide-react";

const MOCK_PRODUCT = {
  id: "p1",
  name: "Glifosato 480 SL Herbicida",
  sku: "HRB-GLF-480-5L",
  brand: "AgroQuim",
  category: "Herbicidas",
  unit: "Lt",
  basePrice: "45.00",
  stock: "240",
  isRegulated: true,
  isBiological: false,
  description: "Herbicida sistémico no selectivo de amplio espectro para control de malezas anuales y perennes.",
  technicalSpecs: "Ingrediente activo: Glifosato 480 g/L. Formulación: Concentrado soluble (SL). Modo de acción: Inhibidor de EPSPS.",
  activeIngredient: "Glifosato",
  concentration: "480 g/L",
  registroSanitario: "ICA-REG-2019-00234",
  registroExpiry: "2027-06-30",
  safetyInterval: "7",
  countries: ["CO", "VE", "EC"],
};

export default function EditarProductoPage() {
  const router = useRouter();
  const params = useParams();
  const [form, setForm] = useState({ ...MOCK_PRODUCT, basePrice: MOCK_PRODUCT.basePrice, stock: MOCK_PRODUCT.stock });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  function set(field: string, value: string | boolean | string[]) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await new Promise(r => setTimeout(r, 900));
    setSaving(false);
    setSaved(true);
    setTimeout(() => router.push("/dashboard/vendedor/productos"), 1200);
  }

  const COUNTRIES = ["CO", "VE", "EC", "PE", "MX", "BR", "AR", "CL"];
  function toggleCountry(c: string) {
    const countries = form.countries.includes(c)
      ? form.countries.filter(x => x !== c)
      : [...form.countries, c];
    set("countries", countries);
  }

  return (
    <div className="max-w-3xl space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/vendedor/productos" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-headline-md font-bold">Editar producto</h1>
          <p className="text-sm text-[var(--color-on-surface-variant)]">ID: {params.id}</p>
        </div>
      </div>

      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3">
          Cambios guardados. Redirigiendo...
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5">
        {/* Información general */}
        <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-sm text-[var(--color-on-surface-variant)] uppercase tracking-wide">Información general</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1.5">Nombre del producto</label>
              <input value={form.name} onChange={e => set("name", e.target.value)}
                className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)]" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">SKU</label>
              <input value={form.sku} onChange={e => set("sku", e.target.value.toUpperCase())}
                className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none font-mono focus:border-[var(--color-primary)]" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Marca</label>
              <input value={form.brand} onChange={e => set("brand", e.target.value)}
                className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)]" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Precio base (USD)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--color-on-surface-variant)]">$</span>
                <input type="number" step="0.01" value={form.basePrice} onChange={e => set("basePrice", e.target.value)}
                  className="w-full border border-[var(--color-border-subtle)] rounded-lg pl-7 pr-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)]" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Stock actual</label>
              <input type="number" value={form.stock} onChange={e => set("stock", e.target.value)}
                className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)]" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1.5">Descripción</label>
              <textarea value={form.description} onChange={e => set("description", e.target.value)}
                rows={3} className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] resize-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1.5">Especificaciones técnicas</label>
              <textarea value={form.technicalSpecs} onChange={e => set("technicalSpecs", e.target.value)}
                rows={3} className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] resize-none" />
            </div>
          </div>

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
        </div>

        {/* Datos regulatorios */}
        {form.isRegulated && (
          <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-6 space-y-4">
            <h2 className="font-semibold text-sm text-[var(--color-on-surface-variant)] uppercase tracking-wide">Datos regulatorios</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Ingrediente activo</label>
                <input value={form.activeIngredient} onChange={e => set("activeIngredient", e.target.value)}
                  className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)]" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Concentración</label>
                <input value={form.concentration} onChange={e => set("concentration", e.target.value)}
                  className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)]" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Registro sanitario</label>
                <input value={form.registroSanitario} onChange={e => set("registroSanitario", e.target.value)}
                  className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none font-mono focus:border-[var(--color-primary)]" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Vencimiento registro</label>
                <input type="date" value={form.registroExpiry} onChange={e => set("registroExpiry", e.target.value)}
                  className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)]" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Intervalo de seguridad (días)</label>
                <input type="number" value={form.safetyInterval} onChange={e => set("safetyInterval", e.target.value)}
                  className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)]" />
              </div>
            </div>
          </div>
        )}

        {/* Países */}
        <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-6">
          <h2 className="font-semibold text-sm text-[var(--color-on-surface-variant)] uppercase tracking-wide mb-3">Países donde comercializar</h2>
          <div className="flex flex-wrap gap-2">
            {COUNTRIES.map(c => (
              <button key={c} type="button" onClick={() => toggleCountry(c)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${form.countries.includes(c) ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]" : "border-[var(--color-border-subtle)] hover:border-[var(--color-primary)]"}`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button type="button" onClick={() => setConfirmDelete(true)}
            className="flex items-center gap-2 text-red-500 text-sm font-medium hover:bg-red-50 px-3 py-2 rounded-lg transition-colors">
            <Trash2 size={14} /> Eliminar producto
          </button>
          <div className="flex gap-3">
            <Link href="/dashboard/vendedor/productos"
              className="border border-[var(--color-border-subtle)] text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50">
              Cancelar
            </Link>
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 bg-[var(--color-primary)] text-white text-sm font-semibold px-5 py-2 rounded-lg hover:opacity-90 disabled:opacity-60">
              <Save size={14} /> {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </div>
      </form>

      {/* Delete modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg flex-shrink-0">
                <AlertTriangle size={16} className="text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-base">¿Eliminar este producto?</h3>
                <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">Se eliminará "{form.name}" de tu catálogo. Esta acción no se puede deshacer.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(false)}
                className="flex-1 border border-[var(--color-border-subtle)] text-sm font-medium py-2 rounded-lg hover:bg-gray-50">Cancelar</button>
              <button onClick={() => router.push("/dashboard/vendedor/productos")}
                className="flex-1 bg-red-600 text-white text-sm font-medium py-2 rounded-lg hover:bg-red-700">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
