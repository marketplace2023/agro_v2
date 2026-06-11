"use client";

import {
  BarChart2, TrendingUp, Truck, DollarSign, Users,
  CheckCircle2, AlertCircle, Clock, ArrowRight, Target,
} from "lucide-react";
import Link from "next/link";

const KPI_GLOBAL = [
  { label: "Leads nuevos", valor: "48", cambio: "+18%", positivo: true, icon: Users },
  { label: "Tasa de cierre", valor: "34%", cambio: "+5 pp", positivo: true, icon: Target },
  { label: "Entregas a tiempo", valor: "96%", cambio: "+1 pp", positivo: true, icon: CheckCircle2 },
  { label: "Incidencias logísticas", valor: "5", cambio: "-3", positivo: true, icon: AlertCircle },
  { label: "Costo promedio flete", valor: "$1.48M", cambio: "-4%", positivo: true, icon: Truck },
  { label: "Pipeline activo", valor: "$342M", cambio: "+12%", positivo: true, icon: DollarSign },
  { label: "Tiempo resp. promedio", valor: "2.4h", cambio: "-0.8h", positivo: true, icon: Clock },
  { label: "Clientes recurrentes", valor: "62%", cambio: "+7 pp", positivo: true, icon: TrendingUp },
];

const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun"];

const VENTAS_DATA = [28, 34, 26, 42, 39, 48];
const LEADS_DATA = [35, 41, 30, 52, 47, 58];
const MAX_V = Math.max(...VENTAS_DATA, ...LEADS_DATA);

const TOP_CLIENTES = [
  { nombre: "Grupo Agroindustrial S.A.", compras: "$48.2M", ordenes: 12, crecimiento: "+22%" },
  { nombre: "Tecnicaña S.A.", compras: "$31.5M", ordenes: 8, crecimiento: "+15%" },
  { nombre: "Palmas del Norte", compras: "$24.8M", ordenes: 7, crecimiento: "+8%" },
  { nombre: "AgroValle S.A.S.", compras: "$19.1M", ordenes: 5, crecimiento: "+31%" },
];

const ALERTAS = [
  { tipo: "warning", msg: "3 oportunidades sin actividad en +7 días", link: "/crm/oportunidades" },
  { tipo: "error", msg: "Incidencia crítica RET-010 sin asignar", link: "/logistica/incidencias" },
  { tipo: "info", msg: "Conciliación de junio pendiente en 2 facturas", link: "/finanzas/conciliacion" },
];

export default function AnaliticaPage() {
  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-md font-bold flex items-center gap-2">
            <BarChart2 size={22} /> Analítica y optimización
          </h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">Resumen ejecutivo · Junio 2026</p>
        </div>
        <div className="flex gap-2">
          <Link href="/analitica/crm" className="text-sm border border-[var(--color-border-subtle)] px-4 py-2 rounded-lg hover:bg-[var(--color-surface-container)] transition-colors text-[var(--color-on-surface-variant)]">
            CRM
          </Link>
          <Link href="/analitica/logistica" className="text-sm bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
            Logística
          </Link>
        </div>
      </div>

      {/* Alertas */}
      {ALERTAS.length > 0 && (
        <div className="space-y-2">
          {ALERTAS.map((a, i) => (
            <Link key={i} href={a.link} className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-medium transition-opacity hover:opacity-90 ${a.tipo === "error" ? "bg-red-50 border border-red-200 text-red-700" : a.tipo === "warning" ? "bg-amber-50 border border-amber-200 text-amber-700" : "bg-blue-50 border border-blue-200 text-blue-700"}`}>
              <span className="flex items-center gap-2">
                {a.tipo === "error" ? <AlertCircle size={13} /> : a.tipo === "warning" ? <Clock size={13} /> : <CheckCircle2 size={13} />}
                {a.msg}
              </span>
              <ArrowRight size={12} />
            </Link>
          ))}
        </div>
      )}

      {/* KPIs globales */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {KPI_GLOBAL.map((k) => (
          <div key={k.label} className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-4">
            <div className="flex items-start justify-between mb-2">
              <k.icon size={16} className="text-[var(--color-on-surface-variant)]" />
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${k.positivo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {k.cambio}
              </span>
            </div>
            <p className="text-xl font-black">{k.valor}</p>
            <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ventas vs Leads */}
        <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-sm">Ventas vs Leads (M COP / unidades)</h2>
            <Link href="/analitica/crm" className="text-xs text-[var(--color-primary)] hover:underline flex items-center gap-1">Ver CRM <ArrowRight size={10} /></Link>
          </div>
          <div className="flex items-end gap-2 h-36">
            {MESES.map((mes, i) => (
              <div key={mes} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex gap-0.5 items-end" style={{ height: "100px" }}>
                  <div className="flex-1 rounded-t" style={{ height: `${(VENTAS_DATA[i] / MAX_V) * 100}px`, background: "var(--color-primary)" }} />
                  <div className="flex-1 rounded-t" style={{ height: `${(LEADS_DATA[i] / MAX_V) * 100}px`, background: "var(--color-border-subtle)" }} />
                </div>
                <span className="text-[10px] text-[var(--color-on-surface-variant)]">{mes}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-3 text-[10px]">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[var(--color-primary)] inline-block" />Ventas (M COP)</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[var(--color-border-subtle)] inline-block" />Leads (unidades)</span>
          </div>
        </div>

        {/* Top clientes */}
        <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--color-border-subtle)] flex items-center justify-between">
            <h2 className="font-semibold text-sm">Top clientes por valor</h2>
            <Link href="/crm/segmentos" className="text-xs text-[var(--color-primary)] hover:underline">Ver segmentos</Link>
          </div>
          <div className="divide-y divide-[var(--color-border-subtle)]">
            {TOP_CLIENTES.map((c, i) => (
              <div key={c.nombre} className="px-5 py-3 flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-[var(--color-primary)] bg-opacity-10 flex items-center justify-center text-[10px] font-bold text-[var(--color-primary)] shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{c.nombre}</p>
                  <p className="text-[10px] text-[var(--color-on-surface-variant)]">{c.ordenes} órdenes · {c.compras}</p>
                </div>
                <span className="text-[10px] font-semibold text-green-600 shrink-0">{c.crecimiento}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Accesos a módulos analíticos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/analitica/crm" className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5 hover:shadow-sm transition-shadow flex items-center justify-between group">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={18} className="text-[var(--color-primary)]" />
              <h3 className="font-semibold text-sm">Analítica CRM</h3>
            </div>
            <p className="text-xs text-[var(--color-on-surface-variant)]">Conversión, pipeline, tasa de cierre, ventas por representante, clientes recurrentes.</p>
          </div>
          <ArrowRight size={16} className="text-[var(--color-on-surface-variant)] group-hover:text-[var(--color-primary)] transition-colors shrink-0 ml-4" />
        </Link>
        <Link href="/analitica/logistica" className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5 hover:shadow-sm transition-shadow flex items-center justify-between group">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Truck size={18} className="text-[var(--color-primary)]" />
              <h3 className="font-semibold text-sm">Analítica logística</h3>
            </div>
            <p className="text-xs text-[var(--color-on-surface-variant)]">Costos de flete, entregas a tiempo, incidencias, desempeño de transportistas, rentabilidad por ruta.</p>
          </div>
          <ArrowRight size={16} className="text-[var(--color-on-surface-variant)] group-hover:text-[var(--color-primary)] transition-colors shrink-0 ml-4" />
        </Link>
      </div>
    </div>
  );
}
