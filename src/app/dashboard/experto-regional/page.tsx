"use client";

import { useState } from "react";
import { MapPin, Users, BookOpen, TrendingUp, Calendar, ChevronDown, ChevronRight, Leaf, AlertCircle } from "lucide-react";

const MOCK_REGION = {
  name: "Región Andina - Centro",
  countries: ["CO"],
  zones: ["Cundinamarca", "Boyacá", "Santander", "Tolima"],
  advisors: 8,
  activeClients: 142,
  pendingDiagnoses: 6,
};

const MOCK_REPORTS = [
  { id: "r1", title: "Presencia de Spodoptera frugiperda en maíz", zone: "Tolima", severity: "alta" as const, date: "2026-06-09", affectedArea: "2,400 ha", recommendation: "Aplicación de Beauveria bassiana + monitoreo intensivo", status: "activo" },
  { id: "r2", title: "Deficiencia de zinc en cultivos de papa", zone: "Boyacá", severity: "media" as const, date: "2026-06-07", affectedArea: "850 ha", recommendation: "Corrección foliar con sulfato de zinc 8%", status: "en_seguimiento" },
  { id: "r3", title: "Exceso de lluvia — riesgo de hongos foliares", zone: "Cundinamarca", severity: "media" as const, date: "2026-06-05", affectedArea: "Variable", recommendation: "Aplicaciones preventivas de fungicidas cúpricos", status: "activo" },
];

const MOCK_TRAINING = [
  { id: "t1", title: "Manejo integrado de plagas en arroz", date: "2026-06-15", attendees: 28, format: "Presencial", zone: "Tolima" },
  { id: "t2", title: "Uso eficiente de fertilizantes en papa", date: "2026-06-22", attendees: 35, format: "Virtual", zone: "Boyacá" },
  { id: "t3", title: "Certificación BPA — Taller práctico", date: "2026-07-05", attendees: 20, format: "Presencial", zone: "Cundinamarca" },
];

export default function ExpertoRegionalDashboard() {
  const [tab, setTab] = useState<"alertas" | "capacitaciones" | "region">("alertas");
  const [expanded, setExpanded] = useState<string | null>(null);

  const SEVERITY_CFG = {
    alta: { label: "Alta", color: "bg-red-100 text-red-700", border: "border-red-200" },
    media: { label: "Media", color: "bg-orange-100 text-orange-700", border: "border-orange-200" },
    baja: { label: "Baja", color: "bg-yellow-100 text-yellow-700", border: "border-yellow-200" },
  };

  return (
    <div className="space-y-5 max-w-7xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-headline-md font-bold">Panel Experto Regional</h1>
          <div className="flex items-center gap-2 mt-1"><MapPin size={14} className="text-[var(--color-primary)]" /><p className="text-sm text-[var(--color-on-surface-variant)]">{MOCK_REGION.name} · {MOCK_REGION.zones.join(", ")}</p></div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Asesores en la región", value: MOCK_REGION.advisors, icon: <Users size={18} className="text-[var(--color-primary)]" />, color: "text-[var(--color-primary)]" },
          { label: "Productores activos", value: MOCK_REGION.activeClients, icon: <Leaf size={18} className="text-[var(--color-agri-green)]" />, color: "text-[var(--color-agri-green)]" },
          { label: "Alertas activas", value: MOCK_REPORTS.filter(r => r.status === "activo").length, icon: <AlertCircle size={18} className="text-red-500" />, color: "text-red-500" },
          { label: "Diagnósticos pendientes", value: MOCK_REGION.pendingDiagnoses, icon: <TrendingUp size={18} className="text-orange-500" />, color: "text-orange-500" },
        ].map(k => (
          <div key={k.label} className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">{k.icon}</div>
            <p className={`text-2xl font-bold ${k.color}`}>{k.value}</p>
            <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="flex border-b border-[var(--color-border-subtle)]">
        {[["alertas", "Alertas fitosanitarias"], ["capacitaciones", "Capacitaciones"], ["region", "Vista de región"]].map(([k, label]) => (
          <button key={k} onClick={() => setTab(k as typeof tab)} className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${tab === k ? "border-[var(--color-primary)] text-[var(--color-primary)]" : "border-transparent text-[var(--color-on-surface-variant)]"}`}>{label}</button>
        ))}
      </div>

      {tab === "alertas" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between"><p className="text-sm font-medium text-[var(--color-on-surface-variant)]">{MOCK_REPORTS.length} reportes fitosanitarios activos en la región</p><button className="text-sm font-semibold text-[var(--color-primary)] border border-[var(--color-primary)] px-3 py-1.5 rounded-lg hover:bg-[var(--color-primary)]/5">+ Nueva alerta</button></div>
          {MOCK_REPORTS.map(report => {
            const scfg = SEVERITY_CFG[report.severity];
            return (
              <div key={report.id} className={`bg-white border rounded-xl overflow-hidden ${scfg.border}`}>
                <div className="p-4 cursor-pointer" onClick={() => setExpanded(expanded === report.id ? null : report.id)}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {expanded === report.id ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      <div>
                        <div className="flex items-center gap-2 flex-wrap"><span className="font-semibold text-sm">{report.title}</span><span className={`text-xs font-medium px-2 py-0.5 rounded-full ${scfg.color}`}>{scfg.label}</span></div>
                        <div className="flex gap-3 mt-0.5 text-xs text-[var(--color-on-surface-variant)]">
                          <span className="flex items-center gap-1"><MapPin size={9} />{report.zone}</span>
                          <span>Área: {report.affectedArea}</span>
                          <span>{report.date}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${report.status === "activo" ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"}`}>{report.status === "activo" ? "Activo" : "En seguimiento"}</span>
                  </div>
                </div>
                {expanded === report.id && (
                  <div className="px-6 py-3 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-container-low)]">
                    <p className="text-sm"><span className="font-semibold">Recomendación: </span>{report.recommendation}</p>
                    <div className="flex gap-2 mt-3">
                      <button className="text-xs font-medium bg-[var(--color-primary)] text-white px-3 py-1.5 rounded-lg">Notificar asesores</button>
                      <button className="text-xs font-medium border border-[var(--color-border-subtle)] px-3 py-1.5 rounded-lg">Actualizar estado</button>
                      <button className="text-xs font-medium border border-[var(--color-border-subtle)] px-3 py-1.5 rounded-lg">Ver diagnósticos relacionados</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {tab === "capacitaciones" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between"><p className="text-sm font-medium text-[var(--color-on-surface-variant)]">Próximas capacitaciones y eventos</p><button className="text-sm font-semibold text-[var(--color-primary)] border border-[var(--color-primary)] px-3 py-1.5 rounded-lg hover:bg-[var(--color-primary)]/5">+ Programar</button></div>
          {MOCK_TRAINING.map(t => (
            <div key={t.id} className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4 flex items-start gap-4">
              <div className="w-12 h-12 bg-[var(--color-primary)]/10 rounded-xl flex-shrink-0 flex items-center justify-center"><BookOpen size={20} className="text-[var(--color-primary)]" /></div>
              <div className="flex-1">
                <p className="font-semibold text-sm">{t.title}</p>
                <div className="flex gap-4 mt-1 text-xs text-[var(--color-on-surface-variant)]">
                  <span className="flex items-center gap-1"><Calendar size={10} />{t.date}</span>
                  <span className="flex items-center gap-1"><Users size={10} />{t.attendees} inscritos</span>
                  <span className="flex items-center gap-1"><MapPin size={10} />{t.zone}</span>
                </div>
                <span className={`mt-1.5 inline-block text-xs px-2 py-0.5 rounded-full ${t.format === "Virtual" ? "bg-blue-50 text-blue-600" : "bg-green-50 text-green-600"}`}>{t.format}</span>
              </div>
              <button className="text-xs font-medium bg-[var(--color-primary)] text-white px-3 py-1.5 rounded-lg flex-shrink-0">Gestionar</button>
            </div>
          ))}
        </div>
      )}

      {tab === "region" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOCK_REGION.zones.map(zone => (
            <div key={zone} className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3"><MapPin size={14} className="text-[var(--color-primary)]" /><h3 className="font-semibold text-sm">{zone}</h3></div>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[{ v: Math.floor(Math.random() * 40) + 10, l: "Productores" }, { v: Math.floor(Math.random() * 3) + 1, l: "Asesores" }, { v: Math.floor(Math.random() * 4), l: "Alertas" }].map(s => (
                  <div key={s.l} className="bg-[var(--color-surface-container-low)] rounded-lg p-2"><p className="text-base font-bold text-[var(--color-primary)]">{s.v}</p><p className="text-xs text-[var(--color-on-surface-variant)]">{s.l}</p></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
