"use client";

import { useState } from "react";
import { Plus, BarChart2, Users, Mail, MessageSquare, Play, Pause, Eye, Edit2, Trash2 } from "lucide-react";

type CampStatus = "borrador" | "activa" | "pausada" | "finalizada";
type CampType = "email" | "whatsapp" | "banner" | "mixta";

interface Campaign {
  id: string; name: string; type: CampType; status: CampStatus;
  target: string; startDate: string; endDate: string;
  sent: number; opened: number; clicked: number; converted: number;
  budget: number; spent: number;
}

const MOCK_CAMPAIGNS: Campaign[] = [
  { id: "c1", name: "Black Friday Agro 2026", type: "mixta", status: "activa", target: "Compradores activos CO+VE", startDate: "2026-11-25", endDate: "2026-11-28", sent: 4820, opened: 1930, clicked: 347, converted: 89, budget: 1500, spent: 680 },
  { id: "c2", name: "Campaña Fertilizantes Q2", type: "email", status: "finalizada", target: "Distribuidores certificados", startDate: "2026-04-01", endDate: "2026-06-30", sent: 2100, opened: 945, clicked: 210, converted: 48, budget: 800, spent: 800 },
  { id: "c3", name: "Onboarding Nuevos Vendedores", type: "email", status: "activa", target: "Vendedores pendientes de activación", startDate: "2026-01-01", endDate: "2026-12-31", sent: 320, opened: 298, clicked: 145, converted: 112, budget: 200, spent: 95 },
  { id: "c4", name: "WhatsApp Promo Biológicos", type: "whatsapp", status: "pausada", target: "Asesores y compradores biológicos", startDate: "2026-05-01", endDate: "2026-07-31", sent: 780, opened: 650, clicked: 280, converted: 62, budget: 400, spent: 210 },
  { id: "c5", name: "Banner Homepage Pesticidas", type: "banner", status: "borrador", target: "Todos los visitantes", startDate: "", endDate: "", sent: 0, opened: 0, clicked: 0, converted: 0, budget: 600, spent: 0 },
];

const TYPE_CFG: Record<CampType, { label: string; icon: React.ReactNode; color: string }> = {
  email: { label: "Email", icon: <Mail size={11} />, color: "bg-blue-100 text-blue-700" },
  whatsapp: { label: "WhatsApp", icon: <MessageSquare size={11} />, color: "bg-green-100 text-green-700" },
  banner: { label: "Banner", icon: <Eye size={11} />, color: "bg-purple-100 text-purple-700" },
  mixta: { label: "Mixta", icon: <BarChart2 size={11} />, color: "bg-orange-100 text-orange-700" },
};

const STATUS_CFG: Record<CampStatus, { label: string; color: string }> = {
  borrador: { label: "Borrador", color: "bg-gray-100 text-gray-600" },
  activa: { label: "Activa", color: "bg-green-100 text-green-700" },
  pausada: { label: "Pausada", color: "bg-yellow-100 text-yellow-700" },
  finalizada: { label: "Finalizada", color: "bg-blue-100 text-blue-600" },
};

export default function CampanasPage() {
  const [campaigns, setCampaigns] = useState(MOCK_CAMPAIGNS);
  const [filterStatus, setFilterStatus] = useState<CampStatus | "todas">("todas");
  const [showForm, setShowForm] = useState(false);

  const filtered = campaigns.filter(c => filterStatus === "todas" || c.status === filterStatus);

  function toggleStatus(id: string) {
    setCampaigns(prev => prev.map(c => {
      if (c.id !== id) return c;
      if (c.status === "activa") return { ...c, status: "pausada" as CampStatus };
      if (c.status === "pausada") return { ...c, status: "activa" as CampStatus };
      return c;
    }));
  }

  const totalSent = campaigns.reduce((s, c) => s + c.sent, 0);
  const totalConverted = campaigns.reduce((s, c) => s + c.converted, 0);
  const avgCR = totalSent > 0 ? ((totalConverted / totalSent) * 100).toFixed(1) : "0.0";

  return (
    <div className="space-y-5 max-w-7xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-headline-md font-bold">Campañas de marketing</h1><p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">{campaigns.filter(c => c.status === "activa").length} activas · {campaigns.filter(c => c.status === "borrador").length} en borrador</p></div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-[var(--color-primary)] text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:opacity-90"><Plus size={15} /> Nueva campaña</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Campañas activas", value: campaigns.filter(c => c.status === "activa").length, color: "text-green-600" },
          { label: "Mensajes enviados", value: totalSent.toLocaleString(), color: "text-[var(--color-primary)]" },
          { label: "Conversiones totales", value: totalConverted.toLocaleString(), color: "text-blue-600" },
          { label: "Tasa de conversión", value: `${avgCR}%`, color: "text-orange-600" },
        ].map(k => (
          <div key={k.label} className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4"><p className={`text-2xl font-bold ${k.color}`}>{k.value}</p><p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{k.label}</p></div>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        {(["todas", "activa", "pausada", "borrador", "finalizada"] as const).map(s => (
          <button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors capitalize ${filterStatus === s ? "bg-[var(--color-primary)] text-white" : "border border-[var(--color-border-subtle)] hover:bg-gray-50"}`}>{s === "todas" ? "Todas" : STATUS_CFG[s as CampStatus]?.label ?? s}</button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(camp => {
          const tcfg = TYPE_CFG[camp.type];
          const scfg = STATUS_CFG[camp.status];
          const openRate = camp.sent > 0 ? ((camp.opened / camp.sent) * 100).toFixed(1) : "0.0";
          const clickRate = camp.sent > 0 ? ((camp.clicked / camp.sent) * 100).toFixed(1) : "0.0";
          const convRate = camp.sent > 0 ? ((camp.converted / camp.sent) * 100).toFixed(1) : "0.0";
          const budgetPct = camp.budget > 0 ? Math.min(100, Math.round((camp.spent / camp.budget) * 100)) : 0;
          return (
            <div key={camp.id} className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-5">
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-sm">{camp.name}</h3>
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${tcfg.color}`}>{tcfg.icon} {tcfg.label}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${scfg.color}`}>{scfg.label}</span>
                  </div>
                  <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5 flex items-center gap-1"><Users size={10} /> {camp.target}</p>
                  {camp.startDate && <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{camp.startDate} → {camp.endDate}</p>}
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  {(camp.status === "activa" || camp.status === "pausada") && (
                    <button onClick={() => toggleStatus(camp.id)} className={`p-1.5 rounded-lg ${camp.status === "activa" ? "hover:bg-yellow-50 text-yellow-600" : "hover:bg-green-50 text-green-600"}`}>{camp.status === "activa" ? <Pause size={14} /> : <Play size={14} />}</button>
                  )}
                  <button className="p-1.5 hover:bg-gray-100 rounded-lg text-[var(--color-primary)]"><Edit2 size={14} /></button>
                  <button className="p-1.5 hover:bg-red-50 rounded-lg text-red-500"><Trash2 size={14} /></button>
                </div>
              </div>

              {camp.sent > 0 && (
                <div className="mt-4 grid grid-cols-4 gap-3">
                  {[{ label: "Enviados", value: camp.sent.toLocaleString(), sub: "" }, { label: "Abiertos", value: camp.opened.toLocaleString(), sub: `${openRate}%` }, { label: "Clicks", value: camp.clicked.toLocaleString(), sub: `${clickRate}%` }, { label: "Convertidos", value: camp.converted.toLocaleString(), sub: `${convRate}%` }].map(m => (
                    <div key={m.label} className="bg-[var(--color-surface-container-low)] rounded-lg p-2.5 text-center">
                      <p className="text-base font-bold text-[var(--color-on-surface)]">{m.value}</p>
                      <p className="text-xs text-[var(--color-on-surface-variant)]">{m.label}</p>
                      {m.sub && <p className="text-xs font-semibold text-[var(--color-primary)] mt-0.5">{m.sub}</p>}
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-3 flex items-center gap-3">
                <p className="text-xs text-[var(--color-on-surface-variant)] flex-shrink-0">Presupuesto: ${camp.spent.toLocaleString()} / ${camp.budget.toLocaleString()}</p>
                <div className="flex-1 bg-gray-100 rounded-full h-1.5"><div className="h-1.5 rounded-full bg-[var(--color-primary)]" style={{ width: `${budgetPct}%` }} /></div>
                <p className="text-xs font-semibold text-[var(--color-on-surface-variant)] flex-shrink-0">{budgetPct}%</p>
              </div>
            </div>
          );
        })}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-bold text-base">Nueva campaña</h3>
            <div className="space-y-3">
              <div><label className="block text-sm font-medium mb-1">Nombre</label><input className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]" /></div>
              <div><label className="block text-sm font-medium mb-1">Tipo</label><select className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 text-sm outline-none">{Object.entries(TYPE_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select></div>
              <div><label className="block text-sm font-medium mb-1">Audiencia objetivo</label><input placeholder="Describe el segmento..." className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]" /></div>
              <div className="grid grid-cols-2 gap-2">
                <div><label className="block text-sm font-medium mb-1">Fecha inicio</label><input type="date" className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 text-sm outline-none" /></div>
                <div><label className="block text-sm font-medium mb-1">Fecha fin</label><input type="date" className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 text-sm outline-none" /></div>
              </div>
              <div><label className="block text-sm font-medium mb-1">Presupuesto (USD)</label><input type="number" className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]" /></div>
            </div>
            <div className="flex gap-3"><button onClick={() => setShowForm(false)} className="flex-1 border border-[var(--color-border-subtle)] text-sm font-medium py-2 rounded-lg">Cancelar</button><button onClick={() => setShowForm(false)} className="flex-1 bg-[var(--color-primary)] text-white text-sm font-semibold py-2 rounded-lg">Crear campaña</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
