"use client";

import { useState } from "react";
import { Users, TrendingUp, DollarSign, ShoppingBag, Phone, Mail, MapPin, Target, Star } from "lucide-react";

const MOCK_CLIENTS = [
  { id: "c1", name: "Hacienda El Palmar SAS", contact: "Jorge Martínez", phone: "+57 311 234 5678", zone: "Valle del Cauca", lastOrder: "2026-06-08", totalSales: 28400, ordersCount: 12, status: "activo" as const },
  { id: "c2", name: "Agroinsumos Norte SRL", contact: "Luis Hernández", phone: "+57 315 876 5432", zone: "Atlántico", lastOrder: "2026-06-01", totalSales: 14200, ordersCount: 7, status: "activo" as const },
  { id: "c3", name: "Finca La Esperanza", contact: "Ana Gómez", phone: "+57 302 111 2233", zone: "Cundinamarca", lastOrder: "2026-05-15", totalSales: 8900, ordersCount: 5, status: "inactivo" as const },
  { id: "c4", name: "AgroCaribe SAS", contact: "Pedro Suárez", phone: "+57 318 444 5566", zone: "Bolívar", lastOrder: "2026-06-05", totalSales: 22100, ordersCount: 9, status: "activo" as const },
];

const MOCK_VISITS = [
  { id: "v1", client: "Hacienda El Palmar SAS", date: "2026-06-12", type: "Visita presencial", agenda: "Presentar nueva línea de biológicos Q3", status: "programada" as const },
  { id: "v2", client: "AgroCaribe SAS", date: "2026-06-10", type: "Llamada comercial", agenda: "Seguimiento cotización NPK", status: "hoy" as const },
  { id: "v3", client: "Agroinsumos Norte SRL", date: "2026-06-08", type: "Visita presencial", agenda: "Cierre de contrato anual", status: "completada" as const },
];

export default function RepresentanteDashboard() {
  const [tab, setTab] = useState<"clientes" | "visitas" | "metas">("clientes");

  const totalSales = MOCK_CLIENTS.reduce((s, c) => s + c.totalSales, 0);
  const metaSales = 120000;
  const salesPct = Math.round((totalSales / metaSales) * 100);

  return (
    <div className="space-y-5 max-w-7xl">
      <div><h1 className="text-headline-md font-bold">Panel del Representante Comercial</h1><p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">Gestión de cartera y seguimiento comercial</p></div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Clientes activos", value: MOCK_CLIENTS.filter(c => c.status === "activo").length, icon: <Users size={18} className="text-[var(--color-primary)]" />, color: "text-[var(--color-primary)]" },
          { label: "Ventas del mes", value: `$${totalSales.toLocaleString()}`, icon: <DollarSign size={18} className="text-green-600" />, color: "text-green-600" },
          { label: "Cumplimiento meta", value: `${salesPct}%`, icon: <Target size={18} className="text-blue-600" />, color: salesPct >= 80 ? "text-green-600" : "text-orange-600" },
          { label: "Visitas este mes", value: MOCK_VISITS.length, icon: <Star size={18} className="text-orange-500" />, color: "text-orange-500" },
        ].map(k => (
          <div key={k.label} className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">{k.icon}<TrendingUp size={12} className="text-green-500" /></div>
            <p className={`text-2xl font-bold ${k.color}`}>{k.value}</p>
            <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Meta progress */}
      <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div><p className="font-semibold text-sm">Meta mensual de ventas</p><p className="text-xs text-[var(--color-on-surface-variant)]">Junio 2026</p></div>
          <div className="text-right"><p className="text-xl font-bold text-[var(--color-primary)]">{salesPct}%</p><p className="text-xs text-[var(--color-on-surface-variant)]">${totalSales.toLocaleString()} / ${metaSales.toLocaleString()}</p></div>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3"><div className={`h-3 rounded-full ${salesPct >= 100 ? "bg-green-500" : salesPct >= 70 ? "bg-[var(--color-primary)]" : "bg-orange-400"}`} style={{ width: `${Math.min(100, salesPct)}%` }} /></div>
      </div>

      <div className="flex border-b border-[var(--color-border-subtle)]">
        {[["clientes", "Cartera de clientes"], ["visitas", "Visitas y actividades"], ["metas", "Metas por cliente"]].map(([k, label]) => (
          <button key={k} onClick={() => setTab(k as typeof tab)} className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${tab === k ? "border-[var(--color-primary)] text-[var(--color-primary)]" : "border-transparent text-[var(--color-on-surface-variant)]"}`}>{label}</button>
        ))}
      </div>

      {tab === "clientes" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOCK_CLIENTS.map(client => (
            <div key={client.id} className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between">
                <div><p className="font-bold text-sm">{client.name}</p><p className="text-xs text-[var(--color-on-surface-variant)]">{client.contact}</p></div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${client.status === "activo" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{client.status === "activo" ? "Activo" : "Inactivo"}</span>
              </div>
              <div className="mt-3 flex items-center gap-4 text-xs text-[var(--color-on-surface-variant)]">
                <span className="flex items-center gap-1"><MapPin size={10} />{client.zone}</span>
                <span className="flex items-center gap-1"><Phone size={10} />{client.phone}</span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div className="bg-[var(--color-surface-container-low)] rounded-lg p-2"><p className="text-sm font-bold text-[var(--color-primary)]">${client.totalSales.toLocaleString()}</p><p className="text-xs text-[var(--color-on-surface-variant)]">Ventas</p></div>
                <div className="bg-[var(--color-surface-container-low)] rounded-lg p-2"><p className="text-sm font-bold">{client.ordersCount}</p><p className="text-xs text-[var(--color-on-surface-variant)]">Órdenes</p></div>
                <div className="bg-[var(--color-surface-container-low)] rounded-lg p-2"><p className="text-sm font-bold">{client.lastOrder.slice(5)}</p><p className="text-xs text-[var(--color-on-surface-variant)]">Último pedido</p></div>
              </div>
              <div className="mt-3 flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-1 text-xs border border-[var(--color-border-subtle)] py-1.5 rounded-lg hover:bg-gray-50"><Phone size={11} /> Llamar</button>
                <button className="flex-1 flex items-center justify-center gap-1 text-xs border border-[var(--color-border-subtle)] py-1.5 rounded-lg hover:bg-gray-50"><Mail size={11} /> Email</button>
                <button className="flex-1 flex items-center justify-center gap-1 text-xs bg-[var(--color-primary)] text-white py-1.5 rounded-lg hover:opacity-90"><ShoppingBag size={11} /> Ver órdenes</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "visitas" && (
        <div className="space-y-3">
          {MOCK_VISITS.map(v => (
            <div key={v.id} className={`bg-white border rounded-xl p-4 ${v.status === "hoy" ? "border-[var(--color-primary)]" : "border-[var(--color-border-subtle)]"}`}>
              <div className="flex items-start justify-between">
                <div><p className="font-semibold text-sm">{v.client}</p><p className="text-xs text-[var(--color-on-surface-variant)]">{v.type} · {v.date}</p></div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${v.status === "hoy" ? "bg-blue-100 text-blue-700" : v.status === "programada" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>{v.status === "hoy" ? "Hoy" : v.status === "programada" ? "Programada" : "Completada"}</span>
              </div>
              <p className="text-sm mt-1.5 text-[var(--color-on-surface-variant)]">{v.agenda}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "metas" && (
        <div className="space-y-3">
          {MOCK_CLIENTS.map(c => {
            const pct = Math.round((c.totalSales / 30000) * 100);
            return (
              <div key={c.id} className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div><p className="font-medium text-sm">{c.name}</p><p className="text-xs text-[var(--color-on-surface-variant)]">Meta mensual: $30,000</p></div>
                  <p className={`text-sm font-bold ${pct >= 80 ? "text-green-600" : "text-orange-600"}`}>{pct}%</p>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2"><div className={`h-2 rounded-full ${pct >= 100 ? "bg-green-500" : pct >= 70 ? "bg-[var(--color-primary)]" : "bg-orange-400"}`} style={{ width: `${Math.min(100, pct)}%` }} /></div>
                <p className="text-xs text-[var(--color-on-surface-variant)] mt-1">${c.totalSales.toLocaleString()} vendido</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
