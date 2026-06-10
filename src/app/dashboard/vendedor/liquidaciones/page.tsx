"use client";

import { useState } from "react";
import { DollarSign, TrendingUp, Clock, CheckCircle, Download, ChevronDown } from "lucide-react";

type LiqStatus = "pendiente" | "en_proceso" | "pagada";

interface Liquidacion {
  id: string; period: string; orders: number; grossSales: number;
  commission: number; commissionRate: number; taxes: number;
  adjustments: number; netAmount: number; status: LiqStatus;
  generatedAt: string; paidAt?: string; bankRef?: string;
}

const MOCK_LIQS: Liquidacion[] = [
  { id: "l1", period: "Mayo 2026", orders: 28, grossSales: 48500, commission: 3880, commissionRate: 8, taxes: 737.2, adjustments: -120, netAmount: 43762.8, status: "pagada", generatedAt: "2026-06-01", paidAt: "2026-06-03", bankRef: "TRANS-BNK-00445" },
  { id: "l2", period: "Abril 2026", orders: 22, grossSales: 38200, commission: 3056, commissionRate: 8, taxes: 580.64, adjustments: 0, netAmount: 34563.36, status: "pagada", generatedAt: "2026-05-01", paidAt: "2026-05-04", bankRef: "TRANS-BNK-00382" },
  { id: "l3", period: "Marzo 2026", orders: 31, grossSales: 55100, commission: 4408, commissionRate: 8, taxes: 837.52, adjustments: -250, netAmount: 49604.48, status: "pagada", generatedAt: "2026-04-01", paidAt: "2026-04-03", bankRef: "TRANS-BNK-00291" },
  { id: "l4", period: "Junio 2026 (parcial)", orders: 15, grossSales: 22400, commission: 1792, commissionRate: 8, taxes: 340.48, adjustments: 0, netAmount: 20267.52, status: "en_proceso", generatedAt: "2026-06-10" },
];

const STATUS_CFG: Record<LiqStatus, { label: string; color: string; icon: React.ReactNode }> = {
  pendiente: { label: "Pendiente", color: "bg-yellow-100 text-yellow-700", icon: <Clock size={11} /> },
  en_proceso: { label: "En proceso", color: "bg-blue-100 text-blue-700", icon: <Clock size={11} /> },
  pagada: { label: "Pagada", color: "bg-green-100 text-green-700", icon: <CheckCircle size={11} /> },
};

export default function LiquidacionesPage() {
  const [expanded, setExpanded] = useState<string | null>(null);

  const totalEarned = MOCK_LIQS.filter(l => l.status === "pagada").reduce((s, l) => s + l.netAmount, 0);
  const pending = MOCK_LIQS.filter(l => l.status !== "pagada").reduce((s, l) => s + l.netAmount, 0);

  return (
    <div className="space-y-5 max-w-4xl">
      <div><h1 className="text-headline-md font-bold">Liquidaciones</h1><p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">Historial de pagos del marketplace</p></div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total cobrado", value: `$${totalEarned.toLocaleString("es-CO", { maximumFractionDigits: 0 })}`, sub: "Todos los períodos pagados", color: "text-green-600", icon: <CheckCircle size={16} className="text-green-600" /> },
          { label: "Pendiente de cobro", value: `$${pending.toLocaleString("es-CO", { maximumFractionDigits: 0 })}`, sub: "En proceso o por liquidar", color: "text-blue-600", icon: <Clock size={16} className="text-blue-600" /> },
          { label: "Comisión promedio", value: "8%", sub: "Tasa marketplace actual", color: "text-[var(--color-primary)]", icon: <TrendingUp size={16} className="text-[var(--color-primary)]" /> },
        ].map(k => (
          <div key={k.label} className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">{k.icon}<p className="text-xs font-medium text-[var(--color-on-surface-variant)]">{k.label}</p></div>
            <p className={`text-2xl font-bold ${k.color}`}>{k.value}</p>
            <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {MOCK_LIQS.map(liq => {
          const cfg = STATUS_CFG[liq.status];
          const isExp = expanded === liq.id;
          return (
            <div key={liq.id} className="bg-white border border-[var(--color-border-subtle)] rounded-xl overflow-hidden">
              <div className="px-5 py-4 flex items-center gap-4 cursor-pointer" onClick={() => setExpanded(isExp ? null : liq.id)}>
                <div className="p-2 bg-[var(--color-surface-container-low)] rounded-lg flex-shrink-0"><DollarSign size={16} className="text-[var(--color-primary)]" /></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap"><span className="font-bold text-sm">{liq.period}</span><span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${cfg.color}`}>{cfg.icon} {cfg.label}</span></div>
                  <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{liq.orders} órdenes · Generada: {liq.generatedAt}{liq.paidAt ? ` · Pagada: ${liq.paidAt}` : ""}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-base text-green-700">${liq.netAmount.toLocaleString("es-CO", { maximumFractionDigits: 2 })}</p>
                  <p className="text-xs text-[var(--color-on-surface-variant)]">Neto a pagar</p>
                </div>
                <ChevronDown size={16} className={`text-[var(--color-on-surface-variant)] flex-shrink-0 transition-transform ${isExp ? "rotate-180" : ""}`} />
              </div>

              {isExp && (
                <div className="border-t border-[var(--color-border-subtle)] px-5 py-4 space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    {[
                      { label: "Ventas brutas", value: `$${liq.grossSales.toLocaleString("es-CO", { maximumFractionDigits: 2 })}` },
                      { label: `Comisión (${liq.commissionRate}%)`, value: `-$${liq.commission.toLocaleString("es-CO", { maximumFractionDigits: 2 })}`, neg: true },
                      { label: "Retención impuestos", value: `-$${liq.taxes.toLocaleString("es-CO", { maximumFractionDigits: 2 })}`, neg: true },
                      { label: "Ajustes", value: `$${liq.adjustments >= 0 ? "" : ""}${liq.adjustments.toLocaleString("es-CO", { maximumFractionDigits: 2 })}`, neg: liq.adjustments < 0 },
                    ].map(row => (
                      <div key={row.label} className="bg-[var(--color-surface-container-low)] rounded-lg p-3">
                        <p className="text-xs text-[var(--color-on-surface-variant)]">{row.label}</p>
                        <p className={`font-bold mt-0.5 ${row.neg ? "text-red-600" : "text-[var(--color-on-surface)]"}`}>{row.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    {liq.bankRef && <p className="text-xs text-[var(--color-on-surface-variant)]">Ref. bancaria: <span className="font-mono font-semibold">{liq.bankRef}</span></p>}
                    <button className="flex items-center gap-1.5 text-sm text-[var(--color-primary)] font-medium hover:underline ml-auto"><Download size={13} /> Descargar comprobante</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
