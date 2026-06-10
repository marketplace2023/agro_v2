"use client";

import { useState } from "react";
import { Save, Upload, Star, Globe, Phone, Mail, MapPin, CheckCircle } from "lucide-react";

interface StoreForm {
  name: string; commercialName: string; description: string; country: string;
  city: string; phone: string; email: string; website: string;
  categories: string[]; certifications: string; returnPolicy: string;
  minOrder: string; paymentTerms: string[]; deliveryDays: string;
}

const CATEGORIES = ["Fertilizantes", "Herbicidas", "Insecticidas", "Fungicidas", "Biológicos", "Semillas", "Coadyuvantes", "Maquinaria"];
const PAYMENT_TERMS = ["Contado", "30 días", "60 días", "90 días", "Crédito aprobado", "Transferencia previa"];

export default function TiendaProfilePage() {
  const [form, setForm] = useState<StoreForm>({
    name: "DistAgroMax SAS", commercialName: "DistAgroMax",
    description: "Distribuidora líder en Colombia con más de 8 años de experiencia en el sector agroindustrial. Especializados en fertilizantes, herbicidas y fungicidas para cultivos de alto rendimiento.",
    country: "CO", city: "Bogotá", phone: "+57 300 123 4567", email: "ventas@distagromax.com.co", website: "www.distagromax.com.co",
    categories: ["Fertilizantes", "Herbicidas", "Fungicidas"], certifications: "ISO 9001:2015, Cámara de Comercio Bogotá, DIAN activo",
    returnPolicy: "Aceptamos devoluciones en 15 días por defecto de calidad o error en el despacho. El producto debe estar sin abrir en su empaque original.",
    minOrder: "USD 500", paymentTerms: ["Contado", "30 días", "60 días"], deliveryDays: "5-8 días hábiles para Colombia, 15-20 días para exportación",
  });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  function set(field: keyof StoreForm, value: string | string[]) { setForm(prev => ({ ...prev, [field]: value })); }

  function toggleCat(c: string) {
    set("categories", form.categories.includes(c) ? form.categories.filter(x => x !== c) : [...form.categories, c]);
  }
  function togglePayment(p: string) {
    set("paymentTerms", form.paymentTerms.includes(p) ? form.paymentTerms.filter(x => x !== p) : [...form.paymentTerms, p]);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    await new Promise(r => setTimeout(r, 900));
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="max-w-3xl space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-headline-md font-bold">Mi Tienda</h1><p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">Perfil público de tu negocio en el marketplace</p></div>
        {saved && <div className="flex items-center gap-2 text-green-700 text-sm font-medium bg-green-50 px-3 py-1.5 rounded-lg"><CheckCircle size={14} /> Guardado</div>}
      </div>

      {/* Preview card */}
      <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-[var(--color-primary)] rounded-xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
            {form.commercialName.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-bold text-base">{form.commercialName || form.name}</h2>
              <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full">Vendedor verificado</span>
            </div>
            <div className="flex items-center gap-1 mt-0.5"><Star size={13} className="text-yellow-500 fill-yellow-500" /><span className="text-sm font-semibold">4.9</span><span className="text-xs text-[var(--color-on-surface-variant)]">(124 reseñas)</span></div>
            <p className="text-sm text-[var(--color-on-surface-variant)] mt-1 line-clamp-2">{form.description}</p>
            <div className="flex gap-3 mt-2 flex-wrap">
              <span className="flex items-center gap-1 text-xs text-[var(--color-on-surface-variant)]"><MapPin size={11} />{form.city}, {form.country}</span>
              <span className="flex items-center gap-1 text-xs text-[var(--color-on-surface-variant)]"><Globe size={11} />{form.website}</span>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Logo */}
        <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-sm text-[var(--color-on-surface-variant)] uppercase tracking-wide">Logo y marca</h2>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-[var(--color-primary)] rounded-xl flex items-center justify-center text-white font-bold text-2xl">{form.commercialName.slice(0, 2).toUpperCase()}</div>
            <div>
              <button type="button" className="flex items-center gap-2 border border-[var(--color-border-subtle)] text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50"><Upload size={13} /> Cambiar logo</button>
              <p className="text-xs text-[var(--color-on-surface-variant)] mt-1">PNG, JPG hasta 2MB. Mínimo 200×200px.</p>
            </div>
          </div>
        </div>

        {/* Datos básicos */}
        <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-sm text-[var(--color-on-surface-variant)] uppercase tracking-wide">Datos del negocio</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1.5">Razón social</label><input value={form.name} onChange={e => set("name", e.target.value)} className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)]" /></div>
            <div><label className="block text-sm font-medium mb-1.5">Nombre comercial</label><input value={form.commercialName} onChange={e => set("commercialName", e.target.value)} className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)]" /></div>
            <div><label className="block text-sm font-medium mb-1.5">País</label><select value={form.country} onChange={e => set("country", e.target.value)} className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none"><option value="CO">Colombia</option><option value="VE">Venezuela</option><option value="EC">Ecuador</option><option value="PE">Perú</option><option value="MX">México</option></select></div>
            <div><label className="block text-sm font-medium mb-1.5">Ciudad</label><input value={form.city} onChange={e => set("city", e.target.value)} className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)]" /></div>
            <div><label className="block text-sm font-medium mb-1.5">Teléfono</label><div className="flex items-center gap-2 border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5"><Phone size={13} className="text-[var(--color-on-surface-variant)] flex-shrink-0" /><input value={form.phone} onChange={e => set("phone", e.target.value)} className="text-sm outline-none flex-1 bg-transparent" /></div></div>
            <div><label className="block text-sm font-medium mb-1.5">Email comercial</label><div className="flex items-center gap-2 border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5"><Mail size={13} className="text-[var(--color-on-surface-variant)] flex-shrink-0" /><input value={form.email} onChange={e => set("email", e.target.value)} className="text-sm outline-none flex-1 bg-transparent" /></div></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium mb-1.5">Sitio web</label><div className="flex items-center gap-2 border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5"><Globe size={13} className="text-[var(--color-on-surface-variant)] flex-shrink-0" /><input value={form.website} onChange={e => set("website", e.target.value)} className="text-sm outline-none flex-1 bg-transparent" /></div></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium mb-1.5">Descripción del negocio</label><textarea value={form.description} onChange={e => set("description", e.target.value)} rows={3} className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] resize-none" /></div>
          </div>
        </div>

        {/* Categorías */}
        <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-sm text-[var(--color-on-surface-variant)] uppercase tracking-wide">Categorías que manejas</h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(c => (<button key={c} type="button" onClick={() => toggleCat(c)} className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${form.categories.includes(c) ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]" : "border-[var(--color-border-subtle)] hover:border-[var(--color-primary)]"}`}>{c}</button>))}
          </div>
        </div>

        {/* Condiciones comerciales */}
        <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-sm text-[var(--color-on-surface-variant)] uppercase tracking-wide">Condiciones comerciales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1.5">Pedido mínimo</label><input value={form.minOrder} onChange={e => set("minOrder", e.target.value)} placeholder="ej. USD 500" className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)]" /></div>
            <div><label className="block text-sm font-medium mb-1.5">Plazo de entrega habitual</label><input value={form.deliveryDays} onChange={e => set("deliveryDays", e.target.value)} className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)]" /></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium mb-2">Formas de pago aceptadas</label><div className="flex flex-wrap gap-2">{PAYMENT_TERMS.map(p => (<button key={p} type="button" onClick={() => togglePayment(p)} className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${form.paymentTerms.includes(p) ? "bg-[var(--color-agri-green)] text-white border-[var(--color-agri-green)]" : "border-[var(--color-border-subtle)] hover:border-[var(--color-agri-green)]"}`}>{p}</button>))}</div></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium mb-1.5">Política de devoluciones</label><textarea value={form.returnPolicy} onChange={e => set("returnPolicy", e.target.value)} rows={3} className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] resize-none" /></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium mb-1.5">Certificaciones</label><input value={form.certifications} onChange={e => set("certifications", e.target.value)} className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)]" /></div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="flex items-center gap-2 bg-[var(--color-primary)] text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 disabled:opacity-60"><Save size={14} />{saving ? "Guardando..." : "Guardar cambios"}</button>
        </div>
      </form>
    </div>
  );
}
