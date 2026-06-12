"use client";

import { useState } from "react";
import { DollarSign, Clock, CheckCircle, XCircle, AlertTriangle, FileText, User, ChevronDown, ChevronRight, TrendingUp } from "lucide-react";

type AppStatus = "pendiente" | "aprobado" | "rechazado" | "en_revision" | "mas_info";

interface CreditApp {
  id: string; company: string; contact: string; country: string;
  requestedAmount: number; purpose: string; creditScore: number;
  annualRevenue: number; yearsInBusiness: number;
  status: AppStatus; submittedAt: string; assignedTo: string;
  documents: { name: string; status: "ok" | "missing" | "expired" }[];
}

const MOCK_APPS: CreditApp[] = [
  { id: "ca1", company: "AgroVentas SRL", contact: "Roberto Suárez", country: "VE", requestedAmount: 50000, purpose: "Capital de trabajo para inventario de temporada", creditScore: 72, annualRevenue: 280000, yearsInBusiness: 8, status: "en_revision", submittedAt: "2026-06-08", assignedTo: "Ana Crédito", documents: [{ name: "Estados financieros 2025", status: "ok" }, { name: "RUT/NIT", status: "ok" }, { name: "Referencias bancarias", status: "missing" }] },
  { id: "ca2", company: "Hacienda El Palmar SAS", contact: "Jorge Martínez", country: "CO", requestedAmount: 120000, purpose: "Adquisición de maquinaria agrícola", creditScore: 88, annualRevenue: 650000, yearsInBusiness: 15, status: "aprobado", submittedAt: "2026-06-01", assignedTo: "Ana Crédito", documents: [{ name: "Estados financieros 2025", status: "ok" }, { name: "RUT/NIT", status: "ok" }, { name: "Referencias bancarias", status: "ok" }, { name: "Declaración de renta", status: "ok" }] },
  { id: "ca3", company: "MicroAgro Coop", contact: "Carmen López", country: "EC", requestedAmount: 15000, purpose: "Compra de insumos para siembra de papas", creditScore: 54, annualRevenue: 45000, yearsInBusiness: 2, status: "pendiente", submittedAt: "2026-06-09", assignedTo: "Sin asignar", documents: [{ name: "RUT/NIT", status: "ok" }, { name: "Referencias bancarias", status: "expired" }] },
  { id: "ca4", company: "Distribuciones Andinas", contact: "Miguel Torres", country: "PE", requestedAmount: 80000, purpose: "Expansión de línea de distribución", creditScore: 61, annualRevenue: 320000, yearsInBusiness: 5, status: "rechazado", submittedAt: "2026-05-25", assignedTo: "Ana Crédito", documents: [{ name: "Estados financieros 2025", status: "ok" }, { name: "RUT/NIT", status: "ok" }] },
];

const STATUS_CFG: Record<AppStatus, { label: string; color: string; icon: React.ReactNode }> = {
  pendiente: { label: "Pendiente", color: "bg-gray-100 text-gray-600", icon: <Clock size={11} /> },
  en_revision: { label: "En revisión", color: "bg-blue-100 text-blue-700", icon: <FileText size={11} /> },
  aprobado: { label: "Aprobado", color: "bg-green-100 text-green-700", icon: <CheckCircle size={11} /> },
  rechazado: { label: "Rechazado", color: "bg-red-100 text-red-700", icon: <XCircle size={11} /> },
  mas_info: { label: "Más información", color: "bg-yellow-100 text-yellow-700", icon: <AlertTriangle size={11} /> },
};

function ScoreBar({ score }: { score: number }) {
  const color = score >= 80 ? "bg-green-500" : score >= 60 ? "bg-yellow-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-gray-100 rounded-full h-2"><div className={`h-2 rounded-full ${color}`} style={{ width: `${score}%` }} /></div>
      <span className={`text-xs font-bold ${score >= 80 ? "text-green-600" : score >= 60 ? "text-yellow-600" : "text-red-600"}`}>{score}</span>
    </div>
  );
}

export default function CreditoDashboard() {
  const [apps, setApps] = useState(MOCK_APPS);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<AppStatus | "todos">("todos");

  const filtered = apps.filter(a => filterStatus === "todos" || a.status === filterStatus);

  function changeStatus(id: string, status: AppStatus) { setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a)); }

  return (
    <div className="space-y-5 max-w-7xl">
      <div><h1 className="text-headline-md font-bold">Analista de Crédito</h1><p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">Evaluación y gestión de solicitudes de crédito comercial</p></div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Solicitudes totales", value: apps.length, color: "text-[var(--color-primary)]" },
          { label: "En revisión", value: apps.filter(a => a.status === "en_revision").length, color: "text-blue-600" },
          { label: "Aprobadas (mes)", value: apps.filter(a => a.status === "aprobado").length, color: "text-green-600" },
          { label: "Monto aprobado", value: `$${apps.filter(a => a.status === "aprobado").reduce((s, a) => s + a.requestedAmount, 0).toLocaleString()}`, color: "text-green-700" },
        ].map(k => (
          <div key={k.label} className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4"><p className={`text-2xl font-bold ${k.color}`}>{k.value}</p><p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{k.label}</p></div>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        {(["todos", "pendiente", "en_revision", "aprobado", "rechazado"] as const).map(s => (
          <button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize ${filterStatus === s ? "bg-[var(--color-primary)] text-white" : "border border-[var(--color-border-subtle)] hover:bg-gray-50"}`}>{s === "todos" ? "Todas" : STATUS_CFG[s as AppStatus].label}</button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(app => {
          const scfg = STATUS_CFG[app.status];
          const missingDocs = app.documents.filter(d => d.status !== "ok").length;
          return (
            <div key={app.id} className="bg-white border border-[var(--color-border-subtle)] rounded-xl overflow-hidden">
              <div className="p-4 cursor-pointer" onClick={() => setExpanded(expanded === app.id ? null : app.id)}>
                <div className="flex items-start gap-3">
                  {expanded === app.id ? <ChevronDown size={16} className="mt-0.5 flex-shrink-0" /> : <ChevronRight size={16} className="mt-0.5 flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div><p className="font-bold text-sm">{app.company}</p><p className="text-xs text-[var(--color-on-surface-variant)]">{app.contact} · {app.country}</p></div>
                      <div className="text-right flex-shrink-0"><p className="text-base font-bold text-[var(--color-primary)]">${app.requestedAmount.toLocaleString()}</p><span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${scfg.color}`}>{scfg.icon} {scfg.label}</span></div>
                    </div>
                    <p className="text-xs text-[var(--color-on-surface-variant)] mt-1">{app.purpose}</p>
                    <div className="flex gap-4 mt-2">
                      <div className="flex-1"><p className="text-xs text-[var(--color-on-surface-variant)] mb-1">Score crediticio</p><ScoreBar score={app.creditScore} /></div>
                      {missingDocs > 0 && <div className="flex items-center gap-1 text-xs text-orange-600"><AlertTriangle size={11} />{missingDocs} doc{missingDocs > 1 ? "s" : ""} pendiente</div>}
                    </div>
                  </div>
                </div>
              </div>
              {expanded === app.id && (
                <div className="border-t border-[var(--color-border-subtle)] px-5 py-4 bg-[var(--color-surface-container-low)] space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[{ label: "Ingresos anuales", value: `$${app.annualRevenue.toLocaleString()}` }, { label: "Años en actividad", value: `${app.yearsInBusiness} años` }, { label: "Solicitud enviada", value: app.submittedAt }, { label: "Asignado a", value: app.assignedTo }].map(d => (
                      <div key={d.label}><p className="text-xs text-[var(--color-on-surface-variant)]">{d.label}</p><p className="text-sm font-medium">{d.value}</p></div>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs font-semibold mb-2">Documentos</p>
                    <div className="flex flex-wrap gap-2">
                      {app.documents.map((doc) => (
                        <div key={`${app.id}-${doc.name}`} className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg ${doc.status === "ok" ? "bg-green-50 text-green-700" : doc.status === "missing" ? "bg-orange-50 text-orange-700" : "bg-red-50 text-red-700"}`}>{doc.status === "ok" ? <CheckCircle size={10} /> : <AlertTriangle size={10} />} {doc.name}</div>
                      ))}
                    </div>
                  </div>
                  {app.status !== "aprobado" && app.status !== "rechazado" && (
                    <div className="flex gap-2">
                      <button onClick={() => changeStatus(app.id, "aprobado")} className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700"><CheckCircle size={14} /> Aprobar</button>
                      <button onClick={() => changeStatus(app.id, "rechazado")} className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700"><XCircle size={14} /> Rechazar</button>
                      <button onClick={() => changeStatus(app.id, "mas_info")} className="flex items-center gap-1 px-3 py-2 border border-[var(--color-border-subtle)] text-sm font-medium rounded-lg hover:bg-gray-50"><AlertTriangle size={14} /> Solicitar info</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
