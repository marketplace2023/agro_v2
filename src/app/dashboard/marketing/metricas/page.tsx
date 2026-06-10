"use client";

import { TrendingUp, Eye, Users, MousePointerClick, ShoppingCart, BarChart2 } from "lucide-react";

const METRICAS = [
  { label: "Visitas únicas", valor: "14,230", cambio: "+12%", positivo: true, icon: <Eye size={18} /> },
  { label: "Nuevos usuarios", valor: "1,847", cambio: "+8%", positivo: true, icon: <Users size={18} /> },
  { label: "CTR promedio", valor: "3.4%", cambio: "-0.3%", positivo: false, icon: <MousePointerClick size={18} /> },
  { label: "Conversión", valor: "2.1%", cambio: "+0.5%", positivo: true, icon: <ShoppingCart size={18} /> },
];

const CANALES = [
  { canal: "Búsqueda orgánica", sesiones: 6820, pct: 48 },
  { canal: "Directo", sesiones: 3540, pct: 25 },
  { canal: "Email marketing", sesiones: 1987, pct: 14 },
  { canal: "Redes sociales", sesiones: 1130, pct: 8 },
  { canal: "Pauta digital", sesiones: 753, pct: 5 },
];

export default function MetricasPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-headline-md font-bold">Métricas de marketing</h1>
        <p className="text-sm text-[var(--color-on-surface-variant)]">Resumen — Junio 2026</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {METRICAS.map(m => (
          <div key={m.label} className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 bg-[var(--color-primary)]/8 rounded-lg flex items-center justify-center text-[var(--color-primary)]">{m.icon}</div>
              <span className={`text-xs font-semibold ${m.positivo ? "text-green-600" : "text-red-500"}`}>{m.cambio}</span>
            </div>
            <p className="text-xl font-bold">{m.valor}</p>
            <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-5">
          <h2 className="font-semibold text-sm mb-4 flex items-center gap-2"><BarChart2 size={16} className="text-[var(--color-primary)]" /> Canales de adquisición</h2>
          <div className="space-y-3">
            {CANALES.map(c => (
              <div key={c.canal}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[var(--color-on-surface)]">{c.canal}</span>
                  <span className="font-semibold">{c.sesiones.toLocaleString()} <span className="text-[var(--color-on-surface-variant)] font-normal">({c.pct}%)</span></span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--color-primary)] rounded-full" style={{ width: `${c.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-5">
          <h2 className="font-semibold text-sm mb-4 flex items-center gap-2"><TrendingUp size={16} className="text-[var(--color-primary)]" /> Top páginas</h2>
          <div className="space-y-2.5">
            {[
              { page: "/productos/urea-granulada", vistas: 2340 },
              { page: "/blog/guia-fertilizacion-maiz", vistas: 1240 },
              { page: "/categorias/biologicos", vistas: 980 },
              { page: "/tienda/distagromax", vistas: 750 },
              { page: "/blog/control-biologico-plagas", vistas: 620 },
            ].map((p, i) => (
              <div key={p.page} className="flex items-center gap-3">
                <span className="w-5 text-xs text-[var(--color-on-surface-variant)] font-mono">{i + 1}</span>
                <span className="flex-1 text-xs font-medium truncate">{p.page}</span>
                <span className="text-xs font-bold text-[var(--color-primary)]">{p.vistas.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
