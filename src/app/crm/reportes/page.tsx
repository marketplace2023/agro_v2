"use client";

import { BarChart2, TrendingUp, Users, Clock, DollarSign, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const KPI_VENDEDORES = [
  { nombre: "María Gómez", leads: 18, ganadas: 7, pipeline: "$234,500", tasa: "39%", tiempo: "3.2 días" },
  { nombre: "Luis Pérez", leads: 14, ganadas: 6, pipeline: "$182,000", tasa: "43%", tiempo: "2.8 días" },
  { nombre: "Carlos Díaz", leads: 11, ganadas: 4, pipeline: "$98,700", tasa: "36%", tiempo: "4.1 días" },
];

const CONVERSIONES_ETAPA = [
  { de: "Lead → Contactado", tasa: "84%", tiempo: "1.2 días" },
  { de: "Contactado → Necesidad ident.", tasa: "67%", tiempo: "3.5 días" },
  { de: "Necesidad → Cotización enviada", tasa: "78%", tiempo: "5.1 días" },
  { de: "Cotización → Negociación", tasa: "61%", tiempo: "4.2 días" },
  { de: "Negociación → Ganada", tasa: "72%", tiempo: "8.4 días" },
];

const PRODUCTOS_PIPELINE = [
  { producto: "Fertilizantes NPK", valor: "$186,000", opps: 6 },
  { producto: "Herbicidas selectivos", valor: "$74,500", opps: 4 },
  { producto: "Insecticidas biológicos", valor: "$58,200", opps: 5 },
  { producto: "Fungicidas sistémicos", valor: "$49,800", opps: 3 },
  { producto: "Foliares premium", valor: "$31,200", opps: 4 },
  { producto: "Biológicos varios", valor: "$18,400", opps: 7 },
];

const MESES = [
  { mes: "Ene", leads: 8, ganadas: 3, valor: "$42,000" },
  { mes: "Feb", leads: 11, ganadas: 5, valor: "$68,500" },
  { mes: "Mar", leads: 9, ganadas: 4, valor: "$55,200" },
  { mes: "Abr", leads: 14, ganadas: 6, valor: "$84,000" },
  { mes: "May", leads: 17, ganadas: 8, valor: "$112,300" },
  { mes: "Jun", leads: 12, ganadas: 3, valor: "$44,000" },
];

const maxValor = Math.max(...MESES.map(m => parseFloat(m.valor.replace(/[$,]/g, ""))));

export default function ReportesCRMPage() {
  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-md font-bold flex items-center gap-2">
            <BarChart2 size={22} /> Reportes CRM
          </h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">Enero — Junio 2026 · DistAgroMax</p>
        </div>
        <button className="text-sm border border-[var(--color-border-subtle)] px-4 py-2 rounded-lg hover:bg-[var(--color-surface-container)] transition-colors text-[var(--color-on-surface-variant)]">
          Exportar PDF
        </button>
      </div>

      {/* KPIs globales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Valor cerrado YTD", valor: "$406,000", icono: <DollarSign size={18} />, color: "text-[var(--color-primary)]" },
          { label: "Tasa de cierre", valor: "41%", icono: <CheckCircle2 size={18} />, color: "text-green-600" },
          { label: "Clientes nuevos", valor: "23", icono: <Users size={18} />, color: "text-blue-600" },
          { label: "Tiempo promedio ciclo", valor: "24 días", icono: <Clock size={18} />, color: "text-amber-600" },
        ].map((k) => (
          <div key={k.label} className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
            <div className={`mb-2 ${k.color}`}>{k.icono}</div>
            <p className={`text-2xl font-bold ${k.color}`}>{k.valor}</p>
            <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ventas por mes */}
        <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
          <h2 className="font-semibold text-sm mb-4 flex items-center gap-2"><TrendingUp size={14} /> Ventas cerradas por mes</h2>
          <div className="space-y-2">
            {MESES.map((m) => {
              const pct = (parseFloat(m.valor.replace(/[$,]/g, "")) / maxValor) * 100;
              return (
                <div key={m.mes} className="flex items-center gap-3">
                  <span className="text-xs text-[var(--color-on-surface-variant)] w-7 shrink-0">{m.mes}</span>
                  <div className="flex-1 bg-[var(--color-border-subtle)] rounded-full h-5 relative overflow-hidden">
                    <div
                      className="h-5 rounded-full bg-[var(--color-primary)] bg-opacity-80 flex items-center"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold w-20 text-right shrink-0">{m.valor}</span>
                  <span className="text-[10px] text-[var(--color-on-surface-variant)] w-12 text-right shrink-0">{m.ganadas} cer.</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Conversión por etapa */}
        <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
          <h2 className="font-semibold text-sm mb-4">Tasa de conversión por etapa</h2>
          <div className="space-y-3">
            {CONVERSIONES_ETAPA.map((c) => (
              <div key={c.de}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-[var(--color-on-surface)]">{c.de}</span>
                  <div className="flex gap-3 shrink-0">
                    <span className="text-[11px] font-bold">{c.tasa}</span>
                    <span className="text-[10px] text-[var(--color-on-surface-variant)]">{c.tiempo}</span>
                  </div>
                </div>
                <div className="h-1.5 bg-[var(--color-border-subtle)] rounded-full">
                  <div
                    className="h-1.5 rounded-full bg-[var(--color-primary)]"
                    style={{ width: c.tasa }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Desempeño por vendedor */}
        <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--color-border-subtle)]">
            <h2 className="font-semibold text-sm flex items-center gap-2"><Users size={14} /> Desempeño por vendedor</h2>
          </div>
          <div className="divide-y divide-[var(--color-border-subtle)]">
            <div className="grid grid-cols-[1fr_60px_60px_80px_50px] px-5 py-2 text-[10px] font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide">
              <span>Vendedor</span><span className="text-right">Leads</span><span className="text-right">Gan.</span><span className="text-right">Pipeline</span><span className="text-right">Tasa</span>
            </div>
            {KPI_VENDEDORES.map((v) => (
              <div key={v.nombre} className="grid grid-cols-[1fr_60px_60px_80px_50px] px-5 py-3 text-xs items-center">
                <span className="font-medium">{v.nombre}</span>
                <span className="text-right">{v.leads}</span>
                <span className="text-right text-green-600 font-semibold">{v.ganadas}</span>
                <span className="text-right font-bold">{v.pipeline}</span>
                <span className="text-right text-[var(--color-primary)] font-bold">{v.tasa}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline por producto */}
        <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--color-border-subtle)]">
            <h2 className="font-semibold text-sm flex items-center gap-2"><BarChart2 size={14} /> Pipeline por producto</h2>
          </div>
          <div className="p-5 space-y-3">
            {PRODUCTOS_PIPELINE.map((p) => {
              const maxP = 186000;
              const pct = (parseFloat(p.valor.replace(/[$,]/g, "")) / maxP) * 100;
              return (
                <div key={p.producto}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs">{p.producto}</span>
                    <div className="flex gap-3">
                      <span className="text-xs font-bold">{p.valor}</span>
                      <span className="text-[10px] text-[var(--color-on-surface-variant)]">{p.opps} opps</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-[var(--color-border-subtle)] rounded-full">
                    <div className="h-1.5 rounded-full bg-green-400" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex gap-4 text-xs">
        <Link href="/crm/segmentos" className="text-[var(--color-primary)] hover:underline">Ver segmentos</Link>
        <Link href="/crm/oportunidades" className="text-[var(--color-primary)] hover:underline">Ver oportunidades</Link>
        <Link href="/dashboard/crm" className="text-[var(--color-primary)] hover:underline">← Dashboard CRM</Link>
      </div>
    </div>
  );
}
