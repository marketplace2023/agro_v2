"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload, Save, Plus, X } from "lucide-react";

const CATEGORIES = ["Fertilizantes", "Herbicidas", "Insecticidas", "Fungicidas", "Biológicos", "Semillas", "Coadyuvantes"];
const UNITS = ["kg", "lt", "50kg", "25kg", "1L", "5L", "unidad"];

interface Variant { sku: string; presentation: string; unit: string; basePrice: string }

export default function FabricanteNuevoProductoPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"general" | "tecnico" | "regulatorio" | "variantes">("general");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "", brand: "", category: "", isRegulated: true, isBiological: false,
    description: "", activeIngredient: "", concentration: "", formulation: "",
    applicationMethod: "", compatibility: "",
  });
  const [registros, setRegistros] = useState([{ country: "CO", authority: "ICA", number: "", expiry: "", status: "vigente" }]);
  const [variants, setVariants] = useState<Variant[]>([{ sku: "", presentation: "", unit: "", basePrice: "" }]);

  function set(field: string, value: string | boolean) { setForm(prev => ({ ...prev, [field]: value })); }

  function addRegistro() { setRegistros(prev => [...prev, { country: "", authority: "", number: "", expiry: "", status: "vigente" }]); }
  function removeRegistro(i: number) { setRegistros(prev => prev.filter((_, idx) => idx !== i)); }
  function setRegistro(i: number, field: string, value: string) { setRegistros(prev => prev.map((r, idx) => idx === i ? { ...r, [field]: value } : r)); }

  function addVariant() { setVariants(prev => [...prev, { sku: "", presentation: "", unit: "", basePrice: "" }]); }
  function removeVariant(i: number) { setVariants(prev => prev.filter((_, idx) => idx !== i)); }
  function setVariant(i: number, field: string, value: string) { setVariants(prev => prev.map((v, idx) => idx === i ? { ...v, [field]: value } : v)); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    await new Promise(r => setTimeout(r, 1200));
    router.push("/dashboard/fabricante");
  }

  const TABS = [{ k: "general", label: "General" }, { k: "tecnico", label: "Técnico" }, { k: "regulatorio", label: "Regulatorio" }, { k: "variantes", label: "Variantes / Precios" }] as const;

  return (
    <div className="max-w-3xl space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/fabricante" className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft size={16} /></Link>
        <div><h1 className="text-headline-md font-bold">Nuevo producto de fabricación</h1><p className="text-sm text-[var(--color-on-surface-variant)]">Alta de producto con registros sanitarios</p></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex border-b border-[var(--color-border-subtle)]">
          {TABS.map(t => <button key={t.k} type="button" onClick={() => setTab(t.k)} className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${tab === t.k ? "border-[var(--color-primary)] text-[var(--color-primary)]" : "border-transparent text-[var(--color-on-surface-variant)]"}`}>{t.label}</button>)}
        </div>

        {tab === "general" && (
          <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2"><label className="block text-sm font-medium mb-1.5">Nombre del producto *</label><input value={form.name} onChange={e => set("name", e.target.value)} placeholder="Nombre técnico y comercial completo" required className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)]" /></div>
              <div><label className="block text-sm font-medium mb-1.5">Marca / Línea</label><input value={form.brand} onChange={e => set("brand", e.target.value)} className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)]" /></div>
              <div><label className="block text-sm font-medium mb-1.5">Categoría *</label><select value={form.category} onChange={e => set("category", e.target.value)} className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none"><option value="">Seleccionar</option>{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
              <div className="md:col-span-2"><label className="block text-sm font-medium mb-1.5">Descripción</label><textarea value={form.description} onChange={e => set("description", e.target.value)} rows={3} className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] resize-none" /></div>
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.isRegulated} onChange={e => set("isRegulated", e.target.checked)} className="w-4 h-4 accent-[var(--color-primary)]" /><span className="text-sm font-medium">Producto regulado</span></label>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.isBiological} onChange={e => set("isBiological", e.target.checked)} className="w-4 h-4 accent-[var(--color-primary)]" /><span className="text-sm font-medium">Biológico / Orgánico</span></label>
            </div>
            <div className="border-2 border-dashed border-[var(--color-border-subtle)] rounded-xl p-6 text-center hover:border-[var(--color-primary)] cursor-pointer"><Upload size={20} className="mx-auto mb-2 text-[var(--color-on-surface-variant)]" /><p className="text-sm text-[var(--color-on-surface-variant)]">Imágenes del producto (máx. 8)</p></div>
          </div>
        )}

        {tab === "tecnico" && (
          <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-1.5">Ingrediente activo</label><input value={form.activeIngredient} onChange={e => set("activeIngredient", e.target.value)} className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)]" /></div>
              <div><label className="block text-sm font-medium mb-1.5">Concentración</label><input value={form.concentration} onChange={e => set("concentration", e.target.value)} placeholder="ej. 480 g/L" className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)]" /></div>
              <div><label className="block text-sm font-medium mb-1.5">Formulación</label><select value={form.formulation} onChange={e => set("formulation", e.target.value)} className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none"><option value="">Seleccionar</option>{["SL (Concentrado soluble)", "EC (Concentrado emulsionable)", "WP (Polvo mojable)", "SC (Suspensión concentrada)", "GR (Granulado)", "WG (Granulado dispersable)"].map(f => <option key={f} value={f}>{f}</option>)}</select></div>
              <div><label className="block text-sm font-medium mb-1.5">Método de aplicación</label><input value={form.applicationMethod} onChange={e => set("applicationMethod", e.target.value)} className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)]" /></div>
              <div className="md:col-span-2"><label className="block text-sm font-medium mb-1.5">Compatibilidad</label><input value={form.compatibility} onChange={e => set("compatibility", e.target.value)} className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)]" /></div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Documentos técnicos</p>
              <div className="grid grid-cols-2 gap-2">
                {["Ficha técnica", "Hoja de seguridad (SDS)", "Etiqueta autorizada", "Certificado de análisis"].map(doc => (
                  <div key={doc} className="border-2 border-dashed border-[var(--color-border-subtle)] rounded-lg p-3 text-center cursor-pointer hover:border-[var(--color-primary)] transition-colors">
                    <Upload size={14} className="mx-auto mb-1 text-[var(--color-on-surface-variant)]" />
                    <p className="text-xs text-[var(--color-on-surface-variant)]">{doc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "regulatorio" && (
          <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between"><p className="font-semibold text-sm">Registros por país</p><button type="button" onClick={addRegistro} className="flex items-center gap-1 text-sm text-[var(--color-primary)] font-medium"><Plus size={13} /> Agregar país</button></div>
            {registros.map((reg, i) => (
              <div key={i} className="border border-[var(--color-border-subtle)] rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between"><p className="text-sm font-medium">Registro #{i + 1}</p>{registros.length > 1 && <button type="button" onClick={() => removeRegistro(i)} className="text-red-500 hover:text-red-700"><X size={14} /></button>}</div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div><label className="block text-xs font-medium mb-1">País</label><select value={reg.country} onChange={e => setRegistro(i, "country", e.target.value)} className="w-full border border-[var(--color-border-subtle)] rounded-lg px-2 py-2 text-xs outline-none"><option value="CO">Colombia</option><option value="VE">Venezuela</option><option value="EC">Ecuador</option><option value="PE">Perú</option><option value="MX">México</option><option value="BR">Brasil</option></select></div>
                  <div><label className="block text-xs font-medium mb-1">Autoridad</label><input value={reg.authority} onChange={e => setRegistro(i, "authority", e.target.value)} placeholder="ej. ICA, SENASA" className="w-full border border-[var(--color-border-subtle)] rounded-lg px-2 py-2 text-xs outline-none focus:border-[var(--color-primary)]" /></div>
                  <div><label className="block text-xs font-medium mb-1">Número de registro</label><input value={reg.number} onChange={e => setRegistro(i, "number", e.target.value)} className="w-full border border-[var(--color-border-subtle)] rounded-lg px-2 py-2 text-xs outline-none font-mono focus:border-[var(--color-primary)]" /></div>
                  <div><label className="block text-xs font-medium mb-1">Vigencia hasta</label><input type="date" value={reg.expiry} onChange={e => setRegistro(i, "expiry", e.target.value)} className="w-full border border-[var(--color-border-subtle)] rounded-lg px-2 py-2 text-xs outline-none" /></div>
                  <div><label className="block text-xs font-medium mb-1">Estado</label><select value={reg.status} onChange={e => setRegistro(i, "status", e.target.value)} className="w-full border border-[var(--color-border-subtle)] rounded-lg px-2 py-2 text-xs outline-none"><option value="vigente">Vigente</option><option value="en_tramite">En trámite</option><option value="vencido">Vencido</option></select></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "variantes" && (
          <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between"><p className="font-semibold text-sm">Variantes y presentaciones</p><button type="button" onClick={addVariant} className="flex items-center gap-1 text-sm text-[var(--color-primary)] font-medium"><Plus size={13} /> Agregar variante</button></div>
            {variants.map((v, i) => (
              <div key={i} className="border border-[var(--color-border-subtle)] rounded-xl p-4">
                <div className="flex items-center justify-between mb-3"><p className="text-sm font-medium">Variante #{i + 1}</p>{variants.length > 1 && <button type="button" onClick={() => removeVariant(i)} className="text-red-500"><X size={14} /></button>}</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div><label className="block text-xs font-medium mb-1">SKU</label><input value={v.sku} onChange={e => setVariant(i, "sku", e.target.value.toUpperCase())} className="w-full border border-[var(--color-border-subtle)] rounded-lg px-2 py-2 text-xs outline-none font-mono" /></div>
                  <div><label className="block text-xs font-medium mb-1">Presentación</label><input value={v.presentation} onChange={e => setVariant(i, "presentation", e.target.value)} placeholder="ej. 5L, 50kg" className="w-full border border-[var(--color-border-subtle)] rounded-lg px-2 py-2 text-xs outline-none" /></div>
                  <div><label className="block text-xs font-medium mb-1">Unidad</label><select value={v.unit} onChange={e => setVariant(i, "unit", e.target.value)} className="w-full border border-[var(--color-border-subtle)] rounded-lg px-2 py-2 text-xs outline-none"><option value="">—</option>{UNITS.map(u => <option key={u} value={u}>{u}</option>)}</select></div>
                  <div><label className="block text-xs font-medium mb-1">Precio base (USD)</label><input type="number" value={v.basePrice} onChange={e => setVariant(i, "basePrice", e.target.value)} className="w-full border border-[var(--color-border-subtle)] rounded-lg px-2 py-2 text-xs outline-none" /></div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <Link href="/dashboard/fabricante" className="text-sm text-[var(--color-on-surface-variant)]">Cancelar</Link>
          <div className="flex gap-3">
            {tab !== "general" && <button type="button" onClick={() => setTab(tab === "tecnico" ? "general" : tab === "regulatorio" ? "tecnico" : "regulatorio")} className="border border-[var(--color-border-subtle)] text-sm font-medium px-4 py-2 rounded-lg">Anterior</button>}
            {tab !== "variantes"
              ? <button type="button" onClick={() => setTab(tab === "general" ? "tecnico" : tab === "tecnico" ? "regulatorio" : "variantes")} className="bg-[var(--color-primary)] text-white text-sm font-semibold px-5 py-2 rounded-lg hover:opacity-90">Siguiente</button>
              : <button type="submit" disabled={saving} className="flex items-center gap-2 bg-[var(--color-primary)] text-white text-sm font-semibold px-5 py-2 rounded-lg hover:opacity-90 disabled:opacity-60"><Save size={14} />{saving ? "Creando..." : "Crear producto"}</button>}
          </div>
        </div>
      </form>
    </div>
  );
}
