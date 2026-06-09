"use client";

import { StatsCard } from "@/components/dashboard/stats-card";
import { SalesLineChart } from "@/components/dashboard/charts";
import { DollarSign, Package, FileText, Users, AlertTriangle, Clock } from "lucide-react";
import Link from "next/link";

const URGENT_ORDERS = [
  { id: "ORD-2024-088", comprador: "Finca Las Palmas", producto: "Urea 46% × 20 sacos", monto: "$850", vence: "Despachar hoy", urgente: true },
  { id: "ORD-2024-089", comprador: "Agroinsumos Cundinamarca", producto: "NPK 15-15-15 × 40 sacos", monto: "$1,520", vence: "Mañana", urgente: true },
  { id: "ORD-2024-090", comprador: "Cooperativa Boyacá", producto: "Glifosato 480 SL × 50L", monto: "$945", vence: "3 días", urgente: false },
  { id: "ORD-2024-091", comprador: "Agro del Valle S.A.", producto: "Mancozeb 80% × 100kg", monto: "$2,200", vence: "4 días", urgente: false },
];

const RFQS = [
  { id: "RFQ-2024-112", comprador: "Grupo Agroindustrial S.A.", producto: "Fertilizantes complejos 10t", monto_max: "$48,000", vence: "2026-06-11", ofertas: 0 },
  { id: "RFQ-2024-113", comprador: "Finca Canaveral", producto: "Insecticidas variados 200L", monto_max: "$8,400", vence: "2026-06-14", ofertas: 1 },
  { id: "RFQ-2024-114", comprador: "Palmas del Norte", producto: "Herbicidas selectivos 5t", monto_max: "$22,000", vence: "2026-06-18", ofertas: 0 },
];

const INVENTORY_ALERTS = [
  { producto: "Glifosato 480 SL", stock: 8, min: 20, unidad: "L" },
  { producto: "Clorpirifos 480 EC", stock: 5, min: 15, unidad: "L" },
  { producto: "Beauveria bassiana WP", stock: 12, min: 25, unidad: "kg" },
];

export default function VendedorDashboard() {
  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-headline-md font-bold">Panel de Vendedor</h1>
        <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">DistAgroMax — Junio 2026</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Ventas del mes" value="$28,400" icon={<DollarSign size={20} />} color="primary" trend={{ value: "+18.3%", up: true }} />
        <StatsCard title="Órdenes pendientes" value="7" subtitle="2 urgentes hoy" icon={<Package size={20} />} color="red" />
        <StatsCard title="RFQs recibidas" value="4" subtitle="3 sin oferta aún" icon={<FileText size={20} />} color="orange" />
        <StatsCard title="Clientes activos" value="34" subtitle="este mes" icon={<Users size={20} />} color="green" trend={{ value: "+3", up: true }} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico ventas 30 días */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
          <h2 className="font-semibold text-sm mb-4 flex items-center justify-between">
            📈 Ventas — últimos 30 días
            <span className="text-xs text-[var(--color-on-surface-variant)] font-normal">Total: $28,400 USD</span>
          </h2>
          <SalesLineChart />
        </div>

        {/* Alertas inventario */}
        <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
          <h2 className="font-semibold text-sm mb-4 flex items-center gap-2 text-amber-700">
            <AlertTriangle size={14} /> Stock bajo
          </h2>
          <div className="space-y-3">
            {INVENTORY_ALERTS.map(a => (
              <div key={a.producto} className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                <p className="text-xs font-medium text-[var(--color-on-surface)]">{a.producto}</p>
                <div className="flex items-center justify-between mt-1.5">
                  <div className="flex-1 bg-amber-200 rounded-full h-1.5 mr-2">
                    <div className="h-1.5 rounded-full bg-amber-500" style={{ width: `${Math.min((a.stock / a.min) * 100, 100)}%` }} />
                  </div>
                  <span className="text-xs text-amber-700 font-medium shrink-0">{a.stock}/{a.min} {a.unidad}</span>
                </div>
              </div>
            ))}
            <button className="w-full text-xs text-[var(--color-primary)] border border-[var(--color-primary)] rounded-lg py-2 hover:bg-[var(--color-primary)] hover:text-white transition-colors">
              Actualizar inventario
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Órdenes urgentes */}
        <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
          <div className="px-5 py-4 flex items-center justify-between border-b border-[var(--color-border-subtle)]">
            <h2 className="font-semibold text-sm flex items-center gap-2"><Clock size={14} /> Órdenes urgentes</h2>
            <Link href="/ordenes" className="text-xs text-[var(--color-primary)] hover:underline">Ver todas →</Link>
          </div>
          <div className="divide-y divide-[var(--color-border-subtle)]">
            {URGENT_ORDERS.map(o => (
              <div key={o.id} className={`px-5 py-3 ${o.urgente ? "bg-red-50" : ""}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    {o.urgente && <span className="text-[10px] font-bold bg-red-100 text-red-700 px-1.5 py-0.5 rounded uppercase mr-1.5">⚡ Urgente</span>}
                    <span className="text-xs font-medium">{o.comprador}</span>
                    <p className="text-[10px] text-[var(--color-on-surface-variant)] mt-0.5">{o.producto}</p>
                    <p className="text-[10px] text-[var(--color-on-surface-variant)]">{o.id} · Plazo: {o.vence}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold">{o.monto}</p>
                    <div className="flex gap-1 mt-1">
                      <button className="text-[10px] bg-[var(--color-primary)] text-white px-2 py-0.5 rounded font-medium">Preparar</button>
                      <button className="text-[10px] border border-[var(--color-border-subtle)] px-2 py-0.5 rounded text-[var(--color-on-surface-variant)]">Ver</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RFQs recibidas */}
        <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
          <div className="px-5 py-4 flex items-center justify-between border-b border-[var(--color-border-subtle)]">
            <h2 className="font-semibold text-sm">RFQs pendientes de oferta</h2>
            <Link href="/rfq" className="text-xs text-[var(--color-primary)] hover:underline">Ver todas →</Link>
          </div>
          <div className="divide-y divide-[var(--color-border-subtle)]">
            {RFQS.map(r => (
              <div key={r.id} className="px-5 py-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{r.producto}</p>
                    <p className="text-[10px] text-[var(--color-on-surface-variant)] mt-0.5">{r.id} · {r.comprador}</p>
                    <p className="text-[10px] text-[var(--color-on-surface-variant)]">Cierre: {r.vence} · Presupuesto máx: {r.monto_max}</p>
                  </div>
                  <button className={`text-[10px] font-medium px-3 py-1 rounded-full shrink-0 ${r.ofertas === 0 ? "bg-[var(--color-primary)] text-white" : "bg-green-100 text-green-700"}`}>
                    {r.ofertas === 0 ? "Cotizar" : "Ver oferta"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
