"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle, Bell, Clock, Package, Eye, XCircle } from "lucide-react";

type AlertType = "vencimiento_proximo" | "vencido" | "rechazado" | "por_renovar" | "aprobacion_pendiente";
type AlertStatus = "activa" | "atendida" | "ignorada";

interface RegAlert {
  id: string; type: AlertType; product: string; vendor: string; country: string;
  authority: string; docType: string; expiryDate: string; daysLeft: number;
  status: AlertStatus; createdAt: string;
}

const MOCK_ALERTS: RegAlert[] = [
  { id: "a1", type: "vencimiento_proximo", product: "Glifosato 480 SL Herbicida", vendor: "DistAgroMax SAS", country: "CO", authority: "ICA", docType: "Registro de venta", expiryDate: "2026-07-15", daysLeft: 35, status: "activa", createdAt: "2026-06-10" },
  { id: "a2", type: "vencimiento_proximo", product: "Beauveria bassiana WP", vendor: "BioSolutions Corp", country: "VE", authority: "SASA", docType: "Registro fitosanitario", expiryDate: "2026-07-01", daysLeft: 21, status: "activa", createdAt: "2026-06-10" },
  { id: "a3", type: "vencido", product: "Clorpirifos 480 EC", vendor: "PestControl SAS", country: "CO", authority: "ICA", docType: "Registro de venta", expiryDate: "2024-06-01", daysLeft: -374, status: "activa", createdAt: "2024-06-02" },
  { id: "a4", type: "rechazado", product: "Abamectina 1.8 EC", vendor: "DistAgroMax SAS", country: "EC", authority: "AGROCALIDAD", docType: "Certificado de registro", expiryDate: "—", daysLeft: 0, status: "activa", createdAt: "2026-05-28" },
  { id: "a5", type: "por_renovar", product: "NPK 15-15-15 Fertilizante", vendor: "AgroSuministros CO", country: "CO", authority: "ICA", docType: "Registro de venta", expiryDate: "2026-09-01", daysLeft: 83, status: "atendida", createdAt: "2026-05-15" },
  { id: "a6", type: "aprobacion_pendiente", product: "Sulfato de Potasio 50%", vendor: "NutriPlant Ltda", country: "PE", authority: "SENASA", docType: "Registro de importación", expiryDate: "—", daysLeft: 0, status: "activa", createdAt: "2026-06-01" },
];

const TYPE_CFG: Record<AlertType, { label: string; color: string; icon: React.ReactNode; severity: "error" | "warning" | "info" }> = {
  vencido: { label: "Registro vencido", color: "bg-red-100 text-red-700", icon: <XCircle size={14} />, severity: "error" },
  rechazado: { label: "Registro rechazado", color: "bg-red-100 text-red-700", icon: <XCircle size={14} />, severity: "error" },
  vencimiento_proximo: { label: "Próximo a vencer", color: "bg-orange-100 text-orange-700", icon: <AlertTriangle size={14} />, severity: "warning" },
  por_renovar: { label: "Renovación sugerida", color: "bg-yellow-100 text-yellow-700", icon: <Clock size={14} />, severity: "warning" },
  aprobacion_pendiente: { label: "Pendiente de aprobación", color: "bg-blue-100 text-blue-700", icon: <Clock size={14} />, severity: "info" },
};

export default function AlertasRegulatoriasPage() {
  const [alerts, setAlerts] = useState(MOCK_ALERTS);
  const [filterType, setFilterType] = useState<AlertType | "todas">("todas");
  const [filterStatus, setFilterStatus] = useState<AlertStatus | "todas">("activa");

  const filtered = alerts.filter(a => {
    const t = filterType === "todas" || a.type === filterType;
    const s = filterStatus === "todas" || a.status === filterStatus;
    return t && s;
  });

  function attend(id: string) { setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: "atendida" as AlertStatus } : a)); }
  function ignore(id: string) { setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: "ignorada" as AlertStatus } : a)); }

  const errors = alerts.filter(a => TYPE_CFG[a.type].severity === "error" && a.status === "activa").length;
  const warnings = alerts.filter(a => TYPE_CFG[a.type].severity === "warning" && a.status === "activa").length;

  return (
    <div className="space-y-5 max-w-5xl">
      <div><h1 className="text-headline-md font-bold">Alertas regulatorias</h1><p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">{errors} críticas · {warnings} advertencias activas</p></div>

      {errors > 0 && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3">
          <XCircle size={16} className="flex-shrink-0" />
          <p className="text-sm font-medium">{errors} producto{errors > 1 ? "s" : ""} con registros vencidos o rechazados. Estos productos están suspendidos del catálogo hasta resolver la situación.</p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Críticas activas", value: errors, color: "text-red-600" },
          { label: "Advertencias", value: warnings, color: "text-orange-600" },
          { label: "Atendidas", value: alerts.filter(a => a.status === "atendida").length, color: "text-green-600" },
          { label: "Total alertas", value: alerts.length, color: "text-[var(--color-primary)]" },
        ].map(k => (
          <div key={k.label} className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4"><p className={`text-2xl font-bold ${k.color}`}>{k.value}</p><p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{k.label}</p></div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex gap-1">
          {(["activa", "atendida", "ignorada", "todas"] as const).map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize ${filterStatus === s ? "bg-[var(--color-primary)] text-white" : "border border-[var(--color-border-subtle)] hover:bg-gray-50"}`}>{s === "activa" ? "Activas" : s === "atendida" ? "Atendidas" : s === "ignorada" ? "Ignoradas" : "Todas"}</button>
          ))}
        </div>
        <div className="ml-auto">
          <select value={filterType} onChange={e => setFilterType(e.target.value as AlertType | "todas")} className="text-sm border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 outline-none">
            <option value="todas">Todos los tipos</option>
            {Object.entries(TYPE_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-10 text-center text-[var(--color-on-surface-variant)] text-sm"><CheckCircle size={32} className="mx-auto mb-2 text-green-500" />Sin alertas en este filtro</div>}
        {filtered.map(alert => {
          const tcfg = TYPE_CFG[alert.type];
          return (
            <div key={alert.id} className={`bg-white border rounded-xl p-4 ${alert.status !== "activa" ? "opacity-60" : tcfg.severity === "error" ? "border-red-200" : "border-[var(--color-border-subtle)]"}`}>
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg flex-shrink-0 ${tcfg.color}`}>{tcfg.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap"><span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tcfg.color}`}>{tcfg.label}</span><span className="text-xs text-[var(--color-on-surface-variant)]">{alert.country} · {alert.authority}</span></div>
                      <p className="font-semibold text-sm mt-1">{alert.product}</p>
                      <p className="text-xs text-[var(--color-on-surface-variant)]">{alert.vendor} · {alert.docType}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      {alert.daysLeft !== 0 && <p className={`text-sm font-bold ${alert.daysLeft < 0 ? "text-red-600" : alert.daysLeft <= 30 ? "text-orange-600" : "text-yellow-600"}`}>{alert.daysLeft < 0 ? `Vencido ${Math.abs(alert.daysLeft)}d` : `${alert.daysLeft}d`}</p>}
                      <p className="text-xs text-[var(--color-on-surface-variant)]">{alert.expiryDate !== "—" ? `Vence: ${alert.expiryDate}` : "Sin fecha"}</p>
                    </div>
                  </div>
                  {alert.status === "activa" && (
                    <div className="flex gap-2 mt-3">
                      <button className="flex items-center gap-1 text-xs font-medium bg-[var(--color-primary)] text-white px-2.5 py-1 rounded-lg hover:opacity-90"><Eye size={11} /> Ver producto</button>
                      <button onClick={() => attend(alert.id)} className="flex items-center gap-1 text-xs font-medium bg-green-100 text-green-700 px-2.5 py-1 rounded-lg hover:bg-green-200"><CheckCircle size={11} /> Marcar atendida</button>
                      <button onClick={() => ignore(alert.id)} className="flex items-center gap-1 text-xs font-medium text-[var(--color-on-surface-variant)] px-2.5 py-1 rounded-lg hover:bg-gray-100"><Bell size={11} /> Ignorar</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
