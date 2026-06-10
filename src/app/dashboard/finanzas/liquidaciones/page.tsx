"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, DollarSign, CheckCircle, Clock, AlertTriangle, Download } from "lucide-react";

const MOCK_LIQUIDACIONES = [
  { id: "liq-001", num: "LIQ-2026-087", vendedor: "DistAgroMax SAS", periodo: "Mayo 2026", ventas: 18450000, comision: 1476000, iva: 280440, neto: 16693560, status: "pagada", fechaPago: "2026-06-05" },
  { id: "liq-002", num: "LIQ-2026-088", vendedor: "AgroSuministros CO SAS", periodo: "Mayo 2026", ventas: 9800000, comision: 784000, iva: 148960, neto: 8867040, status: "aprobada", fechaPago: null },
  { id: "liq-003", num: "LIQ-2026-089", vendedor: "DistAgroMax SAS", periodo: "Abr 2026", ventas: 22100000, comision: 1768000, iva: 336320, neto: 19995680, status: "pagada", fechaPago: "2026-05-07" },
  { id: "liq-004", num: "LIQ-2026-090", vendedor: "Bioagro SAS", periodo: "May 2026", ventas: 5600000, comision: 448000, iva: 85120, neto: 5066880, status: "pendiente", fechaPago: null },
];

const STATUS_CFG = {
  pagada: { label: "Pagada", icon: <CheckCircle size={12} />, cls: "bg-green-100 text-green-700" },
  aprobada: { label: "Aprobada", icon: <Clock size={12} />, cls: "bg-blue-100 text-blue-700" },
  pendiente: { label: "Pendiente revisión", icon: <AlertTriangle size={12} />, cls: "bg-yellow-100 text-yellow-700" },
};

export default function LiquidacionesPage() {
  const [items] = useState(MOCK_LIQUIDACIONES);
  const totalPendiente = items.filter(l => l.status !== "pagada").reduce((s, l) => s + l.neto, 0);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-md font-bold">Liquidaciones de vendedores</h1>
          <p className="text-sm text-[var(--color-on-surface-variant)]">{items.length} liquidaciones · {items.filter(l => l.status !== "pagada").length} pendientes de pago</p>
        </div>
        <Link href="/dashboard/finanzas/liquidaciones/nueva" className="flex items-center gap-2 bg-[var(--color-primary)] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90">
          <Plus size={16} /> Nueva liquidación
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: "Por pagar", value: `$${(totalPendiente / 1e6).toFixed(1)}M`, sub: "COP", color: "text-orange-600" },
          { label: "Liquidadas (mes)", value: items.filter(l => l.status === "pagada").length.toString(), sub: "este mes", color: "text-green-600" },
          { label: "Comisiones retenidas", value: `$${(items.reduce((s, l) => s + l.comision, 0) / 1e6).toFixed(2)}M`, sub: "total", color: "text-[var(--color-primary)]" },
        ].map(s => (
          <div key={s.label} className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-[var(--color-on-surface-variant)]">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--color-surface-container-low)] text-xs text-[var(--color-on-surface-variant)] uppercase tracking-wide">
            <tr>
              {["Liquidación", "Vendedor", "Período", "Ventas brutas", "Neto a pagar", "Estado", ""].map(h => (
                <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border-subtle)]">
            {items.map(liq => {
              const scfg = STATUS_CFG[liq.status as keyof typeof STATUS_CFG];
              return (
                <tr key={liq.id} className="hover:bg-[var(--color-surface-container-low)]/50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-[var(--color-primary)]">{liq.num}</p>
                    {liq.fechaPago && <p className="text-xs text-[var(--color-on-surface-variant)]">Pagado: {liq.fechaPago}</p>}
                  </td>
                  <td className="px-4 py-3 font-medium">{liq.vendedor}</td>
                  <td className="px-4 py-3 text-[var(--color-on-surface-variant)]">{liq.periodo}</td>
                  <td className="px-4 py-3 font-medium">${liq.ventas.toLocaleString("es-CO")}</td>
                  <td className="px-4 py-3">
                    <p className="font-bold text-[var(--color-agri-green)]">${liq.neto.toLocaleString("es-CO")}</p>
                    <p className="text-xs text-[var(--color-on-surface-variant)]">Com.: ${liq.comision.toLocaleString("es-CO")}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${scfg.cls}`}>
                      {scfg.icon} {scfg.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {liq.status !== "pagada" && (
                        <Link href={`/dashboard/finanzas/liquidaciones/nueva`} className="text-xs bg-[var(--color-primary)] text-white px-2.5 py-1.5 rounded-lg font-medium">Pagar</Link>
                      )}
                      <button className="p-1.5 hover:bg-gray-100 rounded-lg text-[var(--color-on-surface-variant)]"><Download size={14} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
