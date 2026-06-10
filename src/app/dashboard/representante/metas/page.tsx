"use client";

import { Target, TrendingUp, DollarSign, Users } from "lucide-react";

const METAS = [
  { label: "Ventas brutas junio", meta: 80000000, actual: 52300000 },
  { label: "Nuevos clientes Q2", meta: 5, actual: 3 },
  { label: "Visitas realizadas", meta: 20, actual: 14 },
  { label: "Conversión de cotizaciones", meta: 60, actual: 48, unit: "%" },
];

export default function MetasPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-headline-md font-bold">Mis metas comerciales</h1>
        <p className="text-sm text-[var(--color-on-surface-variant)]">Junio 2026 · Zona Centro-Occidente</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {METAS.map(m => {
          const pct = Math.min(Math.round((m.actual / m.meta) * 100), 100);
          const color = pct >= 80 ? "bg-green-500" : pct >= 50 ? "bg-[var(--color-primary)]" : "bg-orange-500";
          const fmtVal = (v: number) => m.unit === "%" ? `${v}%` : v > 999999 ? `$${(v / 1e6).toFixed(1)}M` : v.toString();
          return (
            <div key={m.label} className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm">{m.label}</p>
                <span className={`text-lg font-bold ${pct >= 80 ? "text-green-600" : pct >= 50 ? "text-[var(--color-primary)]" : "text-orange-500"}`}>{pct}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
              </div>
              <div className="flex justify-between text-xs text-[var(--color-on-surface-variant)]">
                <span>Actual: <strong className="text-[var(--color-on-surface)]">{fmtVal(m.actual)}</strong></span>
                <span>Meta: <strong className="text-[var(--color-on-surface)]">{fmtVal(m.meta)}</strong></span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-5">
        <h2 className="font-semibold text-sm mb-4">Ranking del mes</h2>
        <div className="space-y-3">
          {[
            { nombre: "Camila Representante", region: "Centro-Occidente", ventas: 52300000, pos: 1 },
            { nombre: "Andrés Comercial", region: "Costa Atlántica", ventas: 48100000, pos: 2 },
            { nombre: "Diana Ventas", region: "Eje Cafetero", ventas: 39800000, pos: 3 },
          ].map(r => (
            <div key={r.nombre} className="flex items-center gap-3">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${r.pos === 1 ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-600"}`}>#{r.pos}</span>
              <div className="flex-1">
                <p className="text-sm font-medium">{r.nombre}</p>
                <p className="text-xs text-[var(--color-on-surface-variant)]">{r.region}</p>
              </div>
              <p className="text-sm font-bold text-[var(--color-primary)]">${(r.ventas / 1e6).toFixed(1)}M</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
