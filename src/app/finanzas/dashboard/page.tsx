"use client";

import {
  DollarSign, TrendingUp, TrendingDown, Clock, CheckCircle2,
  AlertCircle, BarChart2, ArrowRight, FileText, RefreshCw,
} from "lucide-react";
import Link from "next/link";

const KPI = [
  { label: "Facturado este mes", valor: "$48,320,000", variacion: "+12%", positivo: true, icon: DollarSign },
  { label: "Cobrado", valor: "$39,840,000", variacion: "+8%", positivo: true, icon: CheckCircle2 },
  { label: "Por cobrar", valor: "$8,480,000", variacion: "-3%", positivo: false, icon: Clock },
  { label: "En disputa", valor: "$1,674,140", variacion: "+2 casos", positivo: false, icon: AlertCircle },
];

const CUENTAS_PAGAR = [
  { operador: "Transportes Andes S.A.S.", monto: "$1,963,500", vence: "2026-06-18", estado: "Por vencer" },
  { operador: "Fletes Nacionales Ltda.", monto: "$2,375,190", vence: "2026-06-14", estado: "Urgente" },
  { operador: "Transportadora Caribe", monto: "$1,428,000", vence: "2026-06-16", estado: "Por vencer" },
];

const FACTURAS_RECIENTES = [
  { id: "FAC-LOG-001", tipo: "Flete", empresa: "Grupo Agroindustrial", monto: "$1,963,500", estado: "Emitida", fecha: "2026-06-15" },
  { id: "FAC-LOG-002", tipo: "Flete + Seguro", empresa: "Tecnicaña S.A.", monto: "$1,674,140", estado: "En disputa", fecha: "2026-06-10" },
  { id: "FAC-COM-001", tipo: "Comisión", empresa: "Marketplace Agro", monto: "$196,350", estado: "Cobrada", fecha: "2026-06-15" },
  { id: "FAC-LOG-003", tipo: "Flete", empresa: "Finca Las Palmas", monto: "$2,375,190", estado: "Pagada", fecha: "2026-06-08" },
];

const MESES_BAR = [
  { mes: "Ene", v: 32 }, { mes: "Feb", v: 38 }, { mes: "Mar", v: 29 }, { mes: "Abr", v: 43 },
  { mes: "May", v: 41 }, { mes: "Jun", v: 48 },
];
const MAX_BAR = Math.max(...MESES_BAR.map(m => m.v));

const ESTADO_COLOR: Record<string, string> = {
  Emitida: "bg-blue-100 text-blue-700",
  Pagada: "bg-green-100 text-green-700",
  Cobrada: "bg-green-100 text-green-700",
  "En disputa": "bg-red-100 text-red-700",
  Pendiente: "bg-amber-100 text-amber-700",
};

export default function FinanzasDashboardPage() {
  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-md font-bold flex items-center gap-2">
            <DollarSign size={22} /> Dashboard financiero
          </h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">Junio 2026 · Marketplace Agro</p>
        </div>
        <div className="flex gap-2">
          <Link href="/finanzas/conciliacion" className="flex items-center gap-1.5 text-sm border border-[var(--color-border-subtle)] px-3 py-2 rounded-lg hover:bg-[var(--color-surface-container)] transition-colors text-[var(--color-on-surface-variant)]">
            <RefreshCw size={13} /> Conciliar
          </Link>
          <Link href="/configuracion/erp" className="flex items-center gap-1.5 text-sm border border-[var(--color-border-subtle)] px-3 py-2 rounded-lg hover:bg-[var(--color-surface-container)] transition-colors text-[var(--color-on-surface-variant)]">
            ERP / Odoo
          </Link>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI.map((k) => (
          <div key={k.label} className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
            <div className="flex items-start justify-between mb-2">
              <k.icon size={18} className="text-[var(--color-on-surface-variant)]" />
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${k.positivo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {k.variacion}
              </span>
            </div>
            <p className="text-xl font-black">{k.valor}</p>
            <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfica facturación */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-sm flex items-center gap-2"><BarChart2 size={15} />Facturación mensual (M COP)</h2>
            <Link href="/finanzas/facturas" className="text-xs text-[var(--color-primary)] hover:underline flex items-center gap-1">Ver todas <ArrowRight size={11} /></Link>
          </div>
          <div className="flex items-end gap-3 h-32">
            {MESES_BAR.map((m) => (
              <div key={m.mes} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-[var(--color-on-surface-variant)]">{m.v}M</span>
                <div
                  className="w-full rounded-t-md"
                  style={{
                    height: `${(m.v / MAX_BAR) * 100}px`,
                    background: m.mes === "Jun" ? "var(--color-primary)" : "var(--color-border-subtle)",
                  }}
                />
                <span className="text-[10px] text-[var(--color-on-surface-variant)]">{m.mes}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-[var(--color-border-subtle)] grid grid-cols-3 gap-4 text-center text-xs">
            <div><p className="font-bold text-green-600">$39.8M</p><p className="text-[var(--color-on-surface-variant)]">Cobrado</p></div>
            <div><p className="font-bold text-amber-600">$8.4M</p><p className="text-[var(--color-on-surface-variant)]">Pendiente</p></div>
            <div><p className="font-bold text-[var(--color-primary)]">$1.3M</p><p className="text-[var(--color-on-surface-variant)]">Comisiones</p></div>
          </div>
        </div>

        {/* Cuentas por pagar urgentes */}
        <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--color-border-subtle)] flex items-center justify-between">
            <h2 className="font-semibold text-sm flex items-center gap-2"><TrendingDown size={14} />Cuentas por pagar</h2>
            <Link href="/finanzas/conciliacion" className="text-xs text-[var(--color-primary)] hover:underline">Ver todo</Link>
          </div>
          <div className="divide-y divide-[var(--color-border-subtle)]">
            {CUENTAS_PAGAR.map((c) => (
              <div key={c.operador} className="px-5 py-3">
                <div className="flex items-center justify-between mb-0.5">
                  <p className="text-xs font-medium">{c.operador}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${c.estado === "Urgente" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                    {c.estado}
                  </span>
                </div>
                <div className="flex justify-between text-[10px] text-[var(--color-on-surface-variant)]">
                  <span className="font-bold text-[var(--color-on-surface)]">{c.monto}</span>
                  <span>Vence {c.vence}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-[var(--color-border-subtle)]">
            <Link href="/finanzas/conciliacion" className="w-full flex items-center justify-center gap-1 text-xs bg-[var(--color-primary)] text-white px-3 py-2 rounded-lg hover:opacity-90 transition-opacity">
              Gestionar pagos <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>

      {/* Facturas recientes */}
      <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--color-border-subtle)] flex items-center justify-between">
          <h2 className="font-semibold text-sm flex items-center gap-2"><FileText size={14} />Facturas recientes</h2>
          <Link href="/finanzas/facturas" className="text-xs text-[var(--color-primary)] hover:underline flex items-center gap-1">
            Ver todas <ArrowRight size={11} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead className="border-b border-[var(--color-border-subtle)]">
              <tr>
                {["ID Factura", "Tipo", "Empresa", "Monto", "Estado", "Fecha"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-[var(--color-on-surface-variant)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-subtle)]">
              {FACTURAS_RECIENTES.map((f) => (
                <tr key={f.id} className="hover:bg-[var(--color-surface-container)] hover:bg-opacity-50 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs font-medium">{f.id}</td>
                  <td className="px-5 py-3 text-xs text-[var(--color-on-surface-variant)]">{f.tipo}</td>
                  <td className="px-5 py-3 text-xs">{f.empresa}</td>
                  <td className="px-5 py-3 text-xs font-semibold">{f.monto}</td>
                  <td className="px-5 py-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${ESTADO_COLOR[f.estado]}`}>{f.estado}</span>
                  </td>
                  <td className="px-5 py-3 text-xs text-[var(--color-on-surface-variant)]">{f.fecha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Accesos rápidos */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Facturas", href: "/finanzas/facturas", icon: FileText },
          { label: "Comisiones", href: "/finanzas/comisiones", icon: TrendingUp },
          { label: "Conciliación", href: "/finanzas/conciliacion", icon: RefreshCw },
          { label: "ERP / Odoo", href: "/configuracion/erp", icon: BarChart2 },
        ].map((a) => (
          <Link key={a.href} href={a.href} className="flex items-center gap-3 bg-white border border-[var(--color-border-subtle)] rounded-xl p-4 hover:shadow-sm transition-shadow text-sm font-medium">
            <a.icon size={16} className="text-[var(--color-primary)] shrink-0" />
            {a.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
