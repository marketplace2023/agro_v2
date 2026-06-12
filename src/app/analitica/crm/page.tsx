"use client";

import { useState } from "react";
import { ChevronLeft, TrendingUp, Target, Users, Clock, DollarSign, Star } from "lucide-react";
import Link from "next/link";

const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun"];

const CONVERSIONES = [
  { etapa: "Nuevo lead", cantidad: 58, porcentaje: 100, color: "bg-[var(--color-primary)]" },
  { etapa: "Contactado", cantidad: 47, porcentaje: 81, color: "bg-blue-400" },
  { etapa: "Necesidad identificada", cantidad: 35, porcentaje: 60, color: "bg-violet-400" },
  { etapa: "Oferta en preparación", cantidad: 24, porcentaje: 41, color: "bg-amber-400" },
  { etapa: "Cotización enviada", cantidad: 18, porcentaje: 31, color: "bg-orange-400" },
  { etapa: "Negociación", cantidad: 11, porcentaje: 19, color: "bg-rose-400" },
  { etapa: "Ganada", cantidad: 20, porcentaje: 34, color: "bg-green-500" },
];

const REPRESENTANTES = [
  { nombre: "Ana Cardona", leads: 18, oportunidades: 12, ganadas: 8, perdidas: 2, valor: "$62.4M", tasa: "67%" },
  { nombre: "Carlos Vélez", leads: 14, oportunidades: 9, ganadas: 5, perdidas: 3, valor: "$48.1M", tasa: "56%" },
  { nombre: "Paola Ríos", leads: 16, oportunidades: 11, ganadas: 5, perdidas: 4, valor: "$44.8M", tasa: "45%" },
  { nombre: "David Muñoz", leads: 10, oportunidades: 6, ganadas: 2, perdidas: 2, valor: "$29.5M", tasa: "33%" },
];

const TIEMPO_RESP_DATA = [3.8, 3.2, 4.1, 2.9, 2.7, 2.4];
const PIPELINE_DATA = [210, 245, 198, 290, 315, 342];
const MAX_P = Math.max(...PIPELINE_DATA);

const SEGMENTOS_DATA = [
  { nombre: "Gran cuenta", valor: "$148M", clientes: 8, color: "bg-[var(--color-primary)]", pct: 43 },
  { nombre: "Cuenta mediana", valor: "$89M", clientes: 18, color: "bg-violet-500", pct: 26 },
  { nombre: "Cooperativa", valor: "$54M", clientes: 12, color: "bg-amber-400", pct: 16 },
  { nombre: "Pequeña cuenta", valor: "$32M", clientes: 27, color: "bg-green-400", pct: 9 },
  { nombre: "Distribuidor", valor: "$19M", clientes: 5, color: "bg-blue-300", pct: 6 },
];

const PERIODOS = ["Último mes", "Q2 2026", "H1 2026", "2025"];

export default function AnaliticaCRMPage() {
  const [periodo, setPeriodo] = useState("Último mes");

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center gap-3">
        <Link href="/analitica" className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors">
          <ChevronLeft size={20} />
        </Link>
        <div className="flex-1">
          <h1 className="text-headline-md font-bold flex items-center gap-2">
            <TrendingUp size={22} /> Analítica CRM
          </h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">Conversión, pipeline y desempeño comercial</p>
        </div>
        <div className="flex gap-2">
          {PERIODOS.map((p) => (
            <button key={p} onClick={() => setPeriodo(p)}
              className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${periodo === p ? "bg-[var(--color-primary)] text-white" : "border border-[var(--color-border-subtle)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)]"}`}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Leads nuevos", valor: "58", sub: "+18% vs mes ant.", icon: Users, color: "text-[var(--color-primary)]" },
          { label: "Tasa de cierre", valor: "34%", sub: "+5 pp vs mes ant.", icon: Target, color: "text-green-600" },
          { label: "Tiempo de respuesta", valor: "2.4h", sub: "-0.8h vs mes ant.", icon: Clock, color: "text-amber-600" },
          { label: "Valor pipeline", valor: "$342M", sub: "+12% vs mes ant.", icon: DollarSign, color: "text-violet-600" },
        ].map((k) => (
          <div key={k.label} className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
            <k.icon size={16} className={`mb-2 ${k.color}`} />
            <p className={`text-2xl font-black ${k.color}`}>{k.valor}</p>
            <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{k.label}</p>
            <p className="text-[10px] text-green-600 mt-1">{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Embudo de conversión */}
        <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
          <h2 className="font-semibold text-sm mb-5">Embudo de conversión</h2>
          <div className="space-y-2">
            {CONVERSIONES.map((c) => (
              <div key={c.etapa}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[var(--color-on-surface-variant)]">{c.etapa}</span>
                  <div className="flex gap-3">
                    <span className="font-semibold">{c.cantidad}</span>
                    <span className="text-[var(--color-on-surface-variant)]">{c.porcentaje}%</span>
                  </div>
                </div>
                <div className="h-5 bg-[var(--color-surface-container)] rounded">
                  <div className={`h-5 rounded ${c.color} flex items-center justify-end pr-2`} style={{ width: `${c.porcentaje}%` }}>
                    {c.porcentaje > 15 && <span className="text-[10px] text-white font-bold">{c.cantidad}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-[var(--color-border-subtle)] grid grid-cols-3 gap-3 text-center text-xs">
            <div><p className="font-bold text-green-600">34%</p><p className="text-[var(--color-on-surface-variant)]">Tasa cierre</p></div>
            <div><p className="font-bold text-amber-600">12</p><p className="text-[var(--color-on-surface-variant)]">Días prom.</p></div>
            <div><p className="font-bold text-[var(--color-primary)]">20</p><p className="text-[var(--color-on-surface-variant)]">Ganadas</p></div>
          </div>
        </div>

        {/* Pipeline histórico */}
        <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
          <h2 className="font-semibold text-sm mb-5">Evolución del pipeline (M COP)</h2>
          <div className="flex items-end gap-3 h-36">
            {MESES.map((mes, i) => (
              <div key={mes} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-[var(--color-on-surface-variant)]">{PIPELINE_DATA[i]}M</span>
                <div className="w-full rounded-t-md" style={{ height: `${(PIPELINE_DATA[i] / MAX_P) * 100}px`, background: mes === "Jun" ? "var(--color-primary)" : "var(--color-border-subtle)" }} />
                <span className="text-[10px] text-[var(--color-on-surface-variant)]">{mes}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-[var(--color-border-subtle)]">
            <h3 className="text-xs font-semibold mb-3">Tiempo de respuesta promedio (horas)</h3>
            <div className="flex items-center gap-2 h-8">
              {MESES.map((mes, i) => (
                <div key={mes} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full bg-violet-100 rounded" style={{ height: `${(TIEMPO_RESP_DATA[i] / 5) * 28}px` }}>
                    <div className="w-full bg-violet-500 rounded" style={{ height: `${(TIEMPO_RESP_DATA[i] / 5) * 28}px` }} />
                  </div>
                  <span className="text-[9px] text-[var(--color-on-surface-variant)]">{TIEMPO_RESP_DATA[i]}h</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Desempeño representantes */}
      <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--color-border-subtle)]">
          <h2 className="font-semibold text-sm flex items-center gap-2"><Star size={14} />Desempeño por representante</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-container)]">
              <tr>
                {["Representante", "Leads", "Oportunidades", "Ganadas", "Perdidas", "Valor total", "Tasa cierre"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-on-surface-variant)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-subtle)]">
              {REPRESENTANTES.map((r, i) => (
                <tr key={r.nombre} className="hover:bg-[var(--color-surface-container)] hover:bg-opacity-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[var(--color-primary)] bg-opacity-10 flex items-center justify-center text-[10px] font-bold text-[var(--color-primary)] shrink-0">{i + 1}</span>
                      <span className="text-xs font-medium">{r.nombre}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-center">{r.leads}</td>
                  <td className="px-4 py-3 text-xs text-center">{r.oportunidades}</td>
                  <td className="px-4 py-3 text-xs text-center font-semibold text-green-600">{r.ganadas}</td>
                  <td className="px-4 py-3 text-xs text-center text-red-500">{r.perdidas}</td>
                  <td className="px-4 py-3 text-xs font-semibold">{r.valor}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-[var(--color-border-subtle)] rounded-full max-w-16">
                        <div className="h-1.5 bg-green-500 rounded-full" style={{ width: r.tasa }} />
                      </div>
                      <span className="text-xs font-bold text-green-600">{r.tasa}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Distribución por segmento */}
      <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
        <h2 className="font-semibold text-sm mb-4">Valor de ventas por segmento de cliente</h2>
        <div className="space-y-3">
          {SEGMENTOS_DATA.map((s) => (
            <div key={s.nombre} className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-sm shrink-0 ${s.color}`} />
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium">{s.nombre}</span>
                  <div className="flex gap-4">
                    <span className="text-[var(--color-on-surface-variant)]">{s.clientes} clientes</span>
                    <span className="font-bold">{s.valor}</span>
                    <span className="text-[var(--color-on-surface-variant)]">{s.pct}%</span>
                  </div>
                </div>
                <div className="h-2 bg-[var(--color-surface-container)] rounded-full">
                  <div className={`h-2 rounded-full ${s.color}`} style={{ width: `${s.pct}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
