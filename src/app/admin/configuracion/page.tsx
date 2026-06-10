"use client";

import { useState } from "react";
import { Save, CheckCircle, Globe, DollarSign, Shield, Puzzle, Percent, Bell, Truck } from "lucide-react";

type Tab = "general" | "comisiones" | "regulatorio" | "integraciones";

export default function AdminConfigPage() {
  const [tab, setTab] = useState<Tab>("general");
  const [saved, setSaved] = useState(false);
  const [general, setGeneral] = useState({ platformName: "Marketplace Agro", supportEmail: "soporte@marketplaceagro.com", supportPhone: "+57 800 000 0001", currency: "USD", languages: ["es"], activeCountries: ["CO", "VE", "EC", "PE", "MX"], maintenanceMode: false, allowPublicRegistration: true });
  const [comisiones, setComisiones] = useState({ defaultRate: "8", b2bRate: "6", biologicalsRate: "5", minOrderFree: "2000", paymentDays: "15", autoLiquidation: true });
  const [regulatory, setRegulatory] = useState({ requireApproval: true, blockExpiredDocs: true, alertDaysBefore: "60", mandatoryDocs: ["ficha_tecnica", "sds"], autoAlert: true, requireRegistroByCountry: true });
  const [integrations, setIntegrations] = useState({ odooUrl: "", odooApiKey: "", stripeKey: "", whatsappToken: "", resendKey: "", googleMapsKey: "", inngestKey: "" });

  async function handleSave() {
    await new Promise(r => setTimeout(r, 800));
    setSaved(true); setTimeout(() => setSaved(false), 2500);
  }

  const TABS = [{ k: "general" as Tab, label: "General", icon: <Globe size={14} /> }, { k: "comisiones" as Tab, label: "Comisiones", icon: <Percent size={14} /> }, { k: "regulatorio" as Tab, label: "Regulatorio", icon: <Shield size={14} /> }, { k: "integraciones" as Tab, label: "Integraciones", icon: <Puzzle size={14} /> }];
  const COUNTRIES = [{ code: "CO", name: "Colombia" }, { code: "VE", name: "Venezuela" }, { code: "EC", name: "Ecuador" }, { code: "PE", name: "Perú" }, { code: "MX", name: "México" }, { code: "BR", name: "Brasil" }, { code: "AR", name: "Argentina" }];
  const MANDATORY_DOCS = [["ficha_tecnica", "Ficha técnica"], ["sds", "Hoja de seguridad (SDS)"], ["etiqueta", "Etiqueta autorizada"], ["certificado_calidad", "Certificado de calidad"]];

  function toggleCountry(c: string) { setGeneral(prev => ({ ...prev, activeCountries: prev.activeCountries.includes(c) ? prev.activeCountries.filter(x => x !== c) : [...prev.activeCountries, c] })); }
  function toggleDoc(d: string) { setRegulatory(prev => ({ ...prev, mandatoryDocs: prev.mandatoryDocs.includes(d) ? prev.mandatoryDocs.filter(x => x !== d) : [...prev.mandatoryDocs, d] })); }

  return (
    <div className="max-w-4xl space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-headline-md font-bold">Configuración del marketplace</h1><p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">Parámetros globales de la plataforma</p></div>
        {saved && <div className="flex items-center gap-2 text-green-700 text-sm font-medium bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg"><CheckCircle size={14} /> Guardado</div>}
      </div>

      <div className="flex border-b border-[var(--color-border-subtle)]">
        {TABS.map(t => <button key={t.k} onClick={() => setTab(t.k)} className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${tab === t.k ? "border-[var(--color-primary)] text-[var(--color-primary)]" : "border-transparent text-[var(--color-on-surface-variant)]"}`}>{t.icon} {t.label}</button>)}
      </div>

      {tab === "general" && (
        <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1.5">Nombre de la plataforma</label><input value={general.platformName} onChange={e => setGeneral(p => ({ ...p, platformName: e.target.value }))} className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)]" /></div>
            <div><label className="block text-sm font-medium mb-1.5">Moneda principal</label><select value={general.currency} onChange={e => setGeneral(p => ({ ...p, currency: e.target.value }))} className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none"><option value="USD">USD — Dólar americano</option><option value="EUR">EUR — Euro</option><option value="COP">COP — Peso colombiano</option></select></div>
            <div><label className="block text-sm font-medium mb-1.5">Email de soporte</label><input value={general.supportEmail} onChange={e => setGeneral(p => ({ ...p, supportEmail: e.target.value }))} className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)]" /></div>
            <div><label className="block text-sm font-medium mb-1.5">Teléfono de soporte</label><input value={general.supportPhone} onChange={e => setGeneral(p => ({ ...p, supportPhone: e.target.value }))} className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)]" /></div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Países activos en la plataforma</label>
            <div className="flex flex-wrap gap-2">{COUNTRIES.map(c => <button key={c.code} type="button" onClick={() => toggleCountry(c.code)} className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${general.activeCountries.includes(c.code) ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]" : "border-[var(--color-border-subtle)]"}`}>{c.code} — {c.name}</button>)}</div>
          </div>
          <div className="flex gap-6 flex-wrap">
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={general.maintenanceMode} onChange={e => setGeneral(p => ({ ...p, maintenanceMode: e.target.checked }))} className="w-4 h-4 accent-[var(--color-secondary)]" /><span className="text-sm font-medium">Modo mantenimiento</span></label>
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={general.allowPublicRegistration} onChange={e => setGeneral(p => ({ ...p, allowPublicRegistration: e.target.checked }))} className="w-4 h-4 accent-[var(--color-primary)]" /><span className="text-sm font-medium">Permitir registro público</span></label>
          </div>
        </div>
      )}

      {tab === "comisiones" && (
        <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-6 space-y-5">
          <div className="bg-blue-50 border border-blue-200 text-blue-700 text-sm rounded-lg px-4 py-3">Las comisiones se aplican sobre el valor neto de cada orden vendida. Los cambios aplican a nuevas órdenes.</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[["defaultRate", "Comisión estándar (%)", "Aplica a todos los vendedores por defecto"], ["b2bRate", "Comisión B2B (%)", "Para órdenes corporativas de alto volumen"], ["biologicalsRate", "Comisión biológicos (%)", "Tasa preferencial para productos biológicos"], ["minOrderFree", "Pedido mínimo exención (USD)", "Órdenes por encima de este monto tienen comisión diferenciada"], ["paymentDays", "Días de pago a vendedores", "Días hábiles desde confirmación de entrega"]].map(([field, label, desc]) => (
              <div key={field}><label className="block text-sm font-medium mb-0.5">{label}</label><p className="text-xs text-[var(--color-on-surface-variant)] mb-1.5">{desc}</p><input type="number" value={(comisiones as Record<string, unknown>)[field] as string} onChange={e => setComisiones(p => ({ ...p, [field]: e.target.value }))} className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)]" /></div>
            ))}
          </div>
          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={comisiones.autoLiquidation} onChange={e => setComisiones(p => ({ ...p, autoLiquidation: e.target.checked }))} className="w-4 h-4 accent-[var(--color-primary)]" /><span className="text-sm font-medium">Liquidación automática mensual</span></label>
        </div>
      )}

      {tab === "regulatorio" && (
        <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-6 space-y-5">
          <div className="space-y-3">
            {[[regulatory.requireApproval, "requireApproval", "Requerir aprobación regulatoria", "Los productos regulados deben ser aprobados antes de publicarse"], [regulatory.blockExpiredDocs, "blockExpiredDocs", "Bloquear productos con documentos vencidos", "Suspende automáticamente productos con registros o documentos expirados"], [regulatory.autoAlert, "autoAlert", "Alertas automáticas de vencimiento", "Notificar por email cuando documentos están próximos a vencer"], [regulatory.requireRegistroByCountry, "requireRegistroByCountry", "Requerir registro por país", "Los productos solo se muestran en países donde tienen registro vigente"]].map(([val, field, label, desc]) => (
              <div key={String(field)} className="flex items-start gap-3 p-4 border border-[var(--color-border-subtle)] rounded-xl">
                <input type="checkbox" checked={Boolean(val)} onChange={e => setRegulatory(p => ({ ...p, [String(field)]: e.target.checked }))} className="w-4 h-4 accent-[var(--color-primary)] mt-0.5 flex-shrink-0" />
                <div><p className="text-sm font-medium">{String(label)}</p><p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{String(desc)}</p></div>
              </div>
            ))}
          </div>
          <div><label className="block text-sm font-medium mb-1.5">Alertar con cuántos días de anticipación</label><input type="number" value={regulatory.alertDaysBefore} onChange={e => setRegulatory(p => ({ ...p, alertDaysBefore: e.target.value }))} className="w-32 border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)]" /></div>
          <div>
            <label className="block text-sm font-medium mb-2">Documentos obligatorios para publicación</label>
            <div className="space-y-2">{MANDATORY_DOCS.map(([k, label]) => (<label key={k} className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={regulatory.mandatoryDocs.includes(k)} onChange={() => toggleDoc(k)} className="w-4 h-4 accent-[var(--color-primary)]" /><span className="text-sm">{label}</span></label>))}</div>
          </div>
        </div>
      )}

      {tab === "integraciones" && (
        <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-6 space-y-5">
          {[{ title: "ERP / Odoo", icon: <Puzzle size={16} />, fields: [["odooUrl", "URL de Odoo", "text", "https://mycompany.odoo.com"], ["odooApiKey", "API Key Odoo", "password", "••••••••"]] }, { title: "Pagos (Stripe)", icon: <DollarSign size={16} />, fields: [["stripeKey", "Stripe Secret Key", "password", "sk_live_..."]] }, { title: "WhatsApp Business", icon: <Bell size={16} />, fields: [["whatsappToken", "Access Token", "password", "EAAl..."]] }, { title: "Email (Resend)", icon: <Bell size={16} />, fields: [["resendKey", "Resend API Key", "password", "re_..."]] }, { title: "Google Maps", icon: <Globe size={16} />, fields: [["googleMapsKey", "Maps API Key", "password", "AIzaSy..."]] }, { title: "Inngest (Jobs)", icon: <Truck size={16} />, fields: [["inngestKey", "Event Key", "password", "evt..."]] }].map(section => (
            <div key={section.title} className="border border-[var(--color-border-subtle)] rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 font-semibold text-sm">{section.icon} {section.title}</div>
              {section.fields.map(([field, label, type, placeholder]) => (
                <div key={field}><label className="block text-sm font-medium mb-1.5">{label}</label><input type={type} value={(integrations as Record<string, string>)[field]} onChange={e => setIntegrations(p => ({ ...p, [field]: e.target.value }))} placeholder={String(placeholder)} className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] font-mono" /></div>
              ))}
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end">
        <button onClick={handleSave} className="flex items-center gap-2 bg-[var(--color-primary)] text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:opacity-90"><Save size={14} /> Guardar cambios</button>
      </div>
    </div>
  );
}
