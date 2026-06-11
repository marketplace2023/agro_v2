"use client";

import { useState } from "react";
import { ChevronLeft, Truck, CheckCircle2, AlertCircle, Star, DollarSign, MapPin } from "lucide-react";
import Link from "next/link";

const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun"];

const DESPACHOS_DATA = [22, 28, 19, 34, 31, 38];
const INCIDENCIAS_DATA = [4, 3, 5, 2, 3, 2];
const MAX_D = Math.max(...DESPACHOS_DATA);

const PUNTUALIDAD_DATA = [91, 93, 88, 95, 94, 96];

const OPERADORES_PERF = [
  { nombre: "Transportes Andes S.A.S.", despachos: 34, puntualidad: 97, incidencias: 0, costo_prom: "$1.65M", calificacion: 4.8, rango: "Élite" },
  { nombre: "LogiCarga Colombia", despachos: 21, puntualidad: 93, incidencias: 1, costo_prom: "$1.48M", calificacion: 4.6, rango: "Premium" },
  { nombre: "Fletes Nacionales Ltda.", despachos: 18, puntualidad: 89, incidencias: 2, costo_prom: "$2.10M", calificacion: 4.4, rango: "Estándar" },
  { nombre: "Transportadora Caribe", despachos: 12, puntualidad: 85, incidencias: 2, costo_prom: "$1.20M", calificacion: 4.2, rango: "Estándar" },
];

const RUTAS_RENT = [
  { ruta: "Bogotá → Valledupar", despachos: 12, costo_prom: "$1.65M", ingresos: "$18.9M", margen: "14%" },
  { ruta: "Bogotá → Cali", despachos: 9, costo_prom: "$1.48M", ingresos: "$13.3M", margen: "18%" },
  { ruta: "Medellín → Bucaramanga", despachos: 7, costo_prom: "$2.10M", ingresos: "$14.7M", margen: "10%" },
  { ruta: "Bogotá → Tunja", despachos: 6, costo_prom: "$0.75M", ingresos: "$5.4M", margen: "22%" },
  { ruta: "Barranquilla → Montería", despachos: 4, costo_prom: "$1.20M", ingresos: "$4.8M", margen: "11%" },
];

const RANGO_COLOR: Record<string, string> = {
  Élite: "bg-[var(--color-primary)] bg-opacity-10 text-[var(--color-primary)]",
  Premium: "bg-violet-100 text-violet-700",
  Estándar: "bg-slate-100 text-slate-600",
};

const PERIODOS = ["Último mes", "Q2 2026", "H1 2026", "2025"];

export default function AnaliticaLogisticaPage() {
  const [periodo, setPeriodo] = useState("Último mes");

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center gap-3">
        <Link href="/analitica" className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors">
          <ChevronLeft size={20} />
        </Link>
        <div className="flex-1">
          <h1 className="text-headline-md font-bold flex items-center gap-2">
            <Truck size={22} /> Analítica logística
          </h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">Costos, cumplimiento y desempeño de transportistas</p>
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
          { label: "Despachos este mes", valor: "38", sub: "+7 vs mayo", icon: Truck, color: "text-[var(--color-primary)]" },
          { label: "Entregas a tiempo", valor: "96%", sub: "+1 pp vs mayo", icon: CheckCircle2, color: "text-green-600" },
          { label: "Incidencias activas", valor: "3", sub: "-2 vs mayo", icon: AlertCircle, color: "text-amber-600" },
          { label: "Costo promedio flete", valor: "$1.48M", sub: "-4% vs mayo", icon: DollarSign, color: "text-violet-600" },
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
        {/* Despachos e incidencias */}
        <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
          <h2 className="font-semibold text-sm mb-5">Despachos vs incidencias por mes</h2>
          <div className="flex items-end gap-2 h-36">
            {MESES.map((mes, i) => (
              <div key={mes} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex gap-0.5 items-end" style={{ height: "100px" }}>
                  <div className="flex-1 rounded-t" style={{ height: `${(DESPACHOS_DATA[i] / MAX_D) * 100}px`, background: "var(--color-primary)" }} />
                  <div className="flex-1 rounded-t bg-red-300" style={{ height: `${(INCIDENCIAS_DATA[i] / MAX_D) * 100}px` }} />
                </div>
                <span className="text-[10px] text-[var(--color-on-surface-variant)]">{mes}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-3 text-[10px]">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[var(--color-primary)] inline-block" />Despachos</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-red-300 inline-block" />Incidencias</span>
          </div>
        </div>

        {/* Puntualidad */}
        <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
          <h2 className="font-semibold text-sm mb-5">Tasa de puntualidad mensual (%)</h2>
          <div className="flex items-end gap-3 h-36">
            {MESES.map((mes, i) => {
              const val = PUNTUALIDAD_DATA[i];
              const normalized = ((val - 80) / 20) * 100;
              return (
                <div key={mes} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-[var(--color-on-surface-variant)]">{val}%</span>
                  <div
                    className="w-full rounded-t-md"
                    style={{
                      height: `${normalized}px`,
                      background: val >= 95 ? "rgb(34 197 94)" : val >= 90 ? "rgb(251 191 36)" : "rgb(239 68 68)",
                    }}
                  />
                  <span className="text-[10px] text-[var(--color-on-surface-variant)]">{mes}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-[var(--color-border-subtle)] grid grid-cols-3 gap-3 text-center text-[10px]">
            <div className="flex items-center gap-1 justify-center"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" />≥95% Objetivo</div>
            <div className="flex items-center gap-1 justify-center"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />90–94% Aceptable</div>
            <div className="flex items-center gap-1 justify-center"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" />&lt;90% Crítico</div>
          </div>
        </div>
      </div>

      {/* Desempeño de operadores */}
      <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--color-border-subtle)]">
          <h2 className="font-semibold text-sm flex items-center gap-2"><Star size={14} />Desempeño de operadores logísticos</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-sm">
            <thead className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-container)]">
              <tr>
                {["Operador", "Despachos", "Puntualidad", "Incidencias", "Costo prom.", "Calificación", "Rango"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-on-surface-variant)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-subtle)]">
              {OPERADORES_PERF.map((o) => (
                <tr key={o.nombre} className="hover:bg-[var(--color-surface-container)] hover:bg-opacity-50 transition-colors">
                  <td className="px-4 py-3 text-xs font-medium">{o.nombre}</td>
                  <td className="px-4 py-3 text-xs text-center font-semibold">{o.despachos}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1.5 bg-[var(--color-border-subtle)] rounded-full">
                        <div className={`h-1.5 rounded-full ${o.puntualidad >= 95 ? "bg-green-500" : o.puntualidad >= 90 ? "bg-amber-400" : "bg-red-400"}`} style={{ width: `${o.puntualidad}%` }} />
                      </div>
                      <span className="text-xs font-bold">{o.puntualidad}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-center">
                    <span className={o.incidencias === 0 ? "text-green-600 font-bold" : "text-amber-600 font-bold"}>{o.incidencias}</span>
                  </td>
                  <td className="px-4 py-3 text-xs font-medium">{o.costo_prom}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Star size={11} className="text-amber-400 fill-amber-400" />
                      <span className="text-xs font-bold">{o.calificacion}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${RANGO_COLOR[o.rango]}`}>{o.rango}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rentabilidad por ruta */}
      <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--color-border-subtle)]">
          <h2 className="font-semibold text-sm flex items-center gap-2"><MapPin size={14} />Rentabilidad por ruta</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[540px] text-sm">
            <thead className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-container)]">
              <tr>
                {["Ruta", "Despachos", "Costo prom. flete", "Ingresos generados", "Margen logístico"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-on-surface-variant)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-subtle)]">
              {RUTAS_RENT.map((r) => {
                const margenNum = parseInt(r.margen);
                return (
                  <tr key={r.ruta} className="hover:bg-[var(--color-surface-container)] hover:bg-opacity-50 transition-colors">
                    <td className="px-4 py-3 text-xs font-medium flex items-center gap-1.5"><MapPin size={10} className="text-[var(--color-on-surface-variant)] shrink-0" />{r.ruta}</td>
                    <td className="px-4 py-3 text-xs text-center font-semibold">{r.despachos}</td>
                    <td className="px-4 py-3 text-xs">{r.costo_prom}</td>
                    <td className="px-4 py-3 text-xs font-semibold text-[var(--color-primary)]">{r.ingresos}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 bg-[var(--color-border-subtle)] rounded-full">
                          <div className={`h-1.5 rounded-full ${margenNum >= 20 ? "bg-green-500" : margenNum >= 12 ? "bg-[var(--color-primary)]" : "bg-amber-400"}`} style={{ width: `${Math.min(margenNum * 3, 100)}%` }} />
                        </div>
                        <span className={`text-xs font-bold ${margenNum >= 20 ? "text-green-600" : margenNum >= 12 ? "text-[var(--color-primary)]" : "text-amber-600"}`}>{r.margen}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-container)] flex justify-between text-xs">
          <span className="text-[var(--color-on-surface-variant)]">5 rutas activas</span>
          <span className="font-bold">Ingresos totales: $57.2M</span>
        </div>
      </div>
    </div>
  );
}
