"use client";

import { useState } from "react";
import { Shield, Server, Database, Activity, AlertTriangle, CheckCircle, Users, DollarSign, Globe, Cpu, HardDrive, Zap } from "lucide-react";

const MOCK_METRICS = {
  activeUsers: 1247,
  totalOrders: 8934,
  revenue: 2840000,
  uptime: "99.97%",
  responseTime: "142ms",
  errorRate: "0.03%",
  dbConnections: 48,
  cacheHitRate: "94.2%",
};

const MOCK_EVENTS = [
  { id: "e1", type: "error" as const, message: "Rate limit exceeded — IP 192.168.1.45 (B2B API)", time: "08:42:13", resolved: false },
  { id: "e2", type: "warning" as const, message: "Slow query detectada — tabla orders (2.3s)", time: "07:15:44", resolved: true },
  { id: "e3", type: "info" as const, message: "Deploy completado — v2.8.1 en producción", time: "06:00:00", resolved: true },
  { id: "e4", type: "error" as const, message: "Fallo en webhook Stripe — Orden ORD-2026-4521", time: "05:38:22", resolved: true },
  { id: "e5", type: "info" as const, message: "Backup automático completado — 48 GB", time: "03:00:01", resolved: true },
];

const MOCK_TENANTS = [
  { id: "t1", name: "Colombia (CO)", users: 842, vendors: 98, orders: 5621, revenue: 1820000, status: "activo" as const },
  { id: "t2", name: "Venezuela (VE)", users: 243, vendors: 31, orders: 1842, revenue: 582000, status: "activo" as const },
  { id: "t3", name: "Ecuador (EC)", users: 108, vendors: 18, orders: 920, revenue: 298000, status: "activo" as const },
  { id: "t4", name: "Perú (PE)", users: 54, vendors: 11, orders: 551, revenue: 140000, status: "activo" as const },
];

export default function SuperAdminDashboard() {
  const [tab, setTab] = useState<"overview" | "tenants" | "logs" | "system">("overview");
  const [events, setEvents] = useState(MOCK_EVENTS);

  const EVENT_CFG = {
    error: { color: "bg-red-100 text-red-700", icon: <AlertTriangle size={12} /> },
    warning: { color: "bg-orange-100 text-orange-700", icon: <AlertTriangle size={12} /> },
    info: { color: "bg-blue-100 text-blue-700", icon: <CheckCircle size={12} /> },
  };

  return (
    <div className="space-y-5 max-w-7xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2"><Shield size={20} className="text-[var(--color-primary)]" /><div><h1 className="text-headline-md font-bold">Superadministrador</h1><p className="text-sm text-[var(--color-on-surface-variant)]">Control total de la plataforma Marketplace Agro</p></div></div>
        <div className="flex items-center gap-2 text-green-700 text-sm font-medium bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Todos los sistemas operativos</div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Usuarios activos", value: MOCK_METRICS.activeUsers.toLocaleString(), icon: <Users size={16} className="text-[var(--color-primary)]" />, color: "text-[var(--color-primary)]" },
          { label: "Revenue total", value: `$${(MOCK_METRICS.revenue / 1000000).toFixed(2)}M`, icon: <DollarSign size={16} className="text-green-600" />, color: "text-green-600" },
          { label: "Uptime del mes", value: MOCK_METRICS.uptime, icon: <Activity size={16} className="text-blue-600" />, color: "text-blue-600" },
          { label: "Tasa de errores", value: MOCK_METRICS.errorRate, icon: <AlertTriangle size={16} className="text-orange-500" />, color: "text-orange-500" },
        ].map(k => (
          <div key={k.label} className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">{k.icon}</div>
            <p className={`text-2xl font-bold ${k.color}`}>{k.value}</p>
            <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="flex border-b border-[var(--color-border-subtle)]">
        {[["overview", "Resumen global"], ["tenants", "Tenants / Países"], ["logs", "Logs del sistema"], ["system", "Infraestructura"]].map(([k, label]) => (
          <button key={k} onClick={() => setTab(k as typeof tab)} className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${tab === k ? "border-[var(--color-primary)] text-[var(--color-primary)]" : "border-transparent text-[var(--color-on-surface-variant)]"}`}>{label}</button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-5 space-y-4">
            <h3 className="font-semibold text-sm">Métricas de rendimiento</h3>
            {[{ label: "Tiempo de respuesta promedio", value: MOCK_METRICS.responseTime, icon: <Zap size={14} className="text-yellow-500" /> }, { label: "Conexiones DB activas", value: `${MOCK_METRICS.dbConnections}/100`, icon: <Database size={14} className="text-blue-500" /> }, { label: "Cache hit rate", value: MOCK_METRICS.cacheHitRate, icon: <Cpu size={14} className="text-green-500" /> }, { label: "Total órdenes plataforma", value: MOCK_METRICS.totalOrders.toLocaleString(), icon: <Activity size={14} className="text-purple-500" /> }].map(m => (
              <div key={m.label} className="flex items-center justify-between">
                <span className="text-sm text-[var(--color-on-surface-variant)] flex items-center gap-2">{m.icon} {m.label}</span>
                <span className="text-sm font-bold">{m.value}</span>
              </div>
            ))}
          </div>
          <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-5 space-y-3">
            <h3 className="font-semibold text-sm">Últimos eventos del sistema</h3>
            {events.slice(0, 4).map(ev => {
              const cfg = EVENT_CFG[ev.type];
              return (
                <div key={ev.id} className="flex items-start gap-2">
                  <span className={`inline-flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5 ${cfg.color}`}>{cfg.icon}</span>
                  <div className="flex-1 min-w-0"><p className="text-xs font-medium truncate">{ev.message}</p><p className="text-xs text-[var(--color-on-surface-variant)]">{ev.time} {ev.resolved ? "· resuelto" : ""}</p></div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === "tenants" && (
        <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-container-low)]">
              {["País / Tenant", "Usuarios", "Vendedores", "Órdenes", "Revenue", "Estado", "Acciones"].map(h => <th key={h} className="px-4 py-3 text-xs font-semibold text-[var(--color-on-surface-variant)] text-left">{h}</th>)}
            </tr></thead>
            <tbody>
              {MOCK_TENANTS.map((t, i) => (
                <tr key={t.id} className={`border-b border-[var(--color-border-subtle)] last:border-0 ${i % 2 === 1 ? "bg-[#fafafa]" : ""}`}>
                  <td className="px-4 py-3 font-medium flex items-center gap-2"><Globe size={14} className="text-[var(--color-primary)]" />{t.name}</td>
                  <td className="px-4 py-3 text-xs">{t.users.toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs">{t.vendors}</td>
                  <td className="px-4 py-3 text-xs">{t.orders.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-green-700">${t.revenue.toLocaleString()}</td>
                  <td className="px-4 py-3"><span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Activo</span></td>
                  <td className="px-4 py-3"><button className="text-xs text-[var(--color-primary)] font-medium hover:underline">Gestionar</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "logs" && (
        <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-[var(--color-border-subtle)] flex items-center justify-between">
            <p className="text-sm font-semibold">Registro de eventos del sistema — Hoy</p>
            <div className="flex gap-2">{(["error", "warning", "info"] as const).map(type => <span key={type} className={`text-xs px-2 py-0.5 rounded ${EVENT_CFG[type].color}`}>{events.filter(e => e.type === type).length} {type}</span>)}</div>
          </div>
          <div className="divide-y divide-[var(--color-border-subtle)]">
            {events.map(ev => {
              const cfg = EVENT_CFG[ev.type];
              return (
                <div key={ev.id} className="px-4 py-3 flex items-start gap-3">
                  <span className={`inline-flex items-center gap-0.5 text-xs px-2 py-1 rounded font-mono flex-shrink-0 ${cfg.color}`}>{ev.type.toUpperCase()}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-mono">{ev.message}</p>
                    <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{ev.time} · {ev.resolved ? <span className="text-green-600">Resuelto</span> : <span className="text-red-600">Sin resolver</span>}</p>
                  </div>
                  {!ev.resolved && <button onClick={() => setEvents(prev => prev.map(e => e.id === ev.id ? { ...e, resolved: true } : e))} className="text-xs font-medium bg-green-100 text-green-700 px-2.5 py-1 rounded-lg flex-shrink-0">Resolver</button>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === "system" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: "Base de datos (NeonDB)", icon: <Database size={18} className="text-blue-600" />, metrics: [{ k: "Conexiones activas", v: `${MOCK_METRICS.dbConnections}/100` }, { k: "Tamaño BD", v: "48.3 GB" }, { k: "Queries/seg", v: "342" }, { k: "P99 latencia", v: "28ms" }] },
            { title: "Caché (Redis)", icon: <Zap size={18} className="text-red-500" />, metrics: [{ k: "Hit rate", v: MOCK_METRICS.cacheHitRate }, { k: "Memoria usada", v: "2.8 GB / 8 GB" }, { k: "Keys activas", v: "18,421" }, { k: "Evictions/hr", v: "12" }] },
            { title: "Almacenamiento (S3)", icon: <HardDrive size={18} className="text-green-600" />, metrics: [{ k: "Total almacenado", v: "128 GB" }, { k: "Docs regulatorios", v: "4,821 archivos" }, { k: "Transferencia/mes", v: "24 GB" }, { k: "Costo estimado", v: "$18/mes" }] },
            { title: "API Gateway", icon: <Server size={18} className="text-purple-600" />, metrics: [{ k: "Requests/min", v: "1,842" }, { k: "Tiempo respuesta", v: MOCK_METRICS.responseTime }, { k: "Tasa error", v: MOCK_METRICS.errorRate }, { k: "Webhooks/día", v: "892" }] },
          ].map(section => (
            <div key={section.title} className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 font-semibold text-sm">{section.icon} {section.title}</div>
              {section.metrics.map(m => (
                <div key={m.k} className="flex items-center justify-between">
                  <span className="text-xs text-[var(--color-on-surface-variant)]">{m.k}</span>
                  <span className="text-xs font-bold font-mono">{m.v}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
