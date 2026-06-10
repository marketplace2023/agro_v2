"use client";

import { useState } from "react";
import { CheckCircle, XCircle, DollarSign, Download } from "lucide-react";

const MOCK_HISTORIAL = [
  { id: "cred-002", empresa: "Finca El Palmar Ltda.", monto: 20000000, plazo: "60 días", aprobado: "2026-06-08", vence: "2026-08-07", saldo: 20000000, status: "vigente" },
  { id: "cred-005", empresa: "AgroSuministros Norte", monto: 40000000, plazo: "90 días", aprobado: "2026-04-15", vence: "2026-07-14", saldo: 12000000, status: "parcial" },
  { id: "cred-006", empresa: "Distribuciones Agro Sur", monto: 15000000, plazo: "30 días", aprobado: "2026-05-01", vence: "2026-05-31", saldo: 0, status: "pagado" },
  { id: "cred-007", empresa: "Hacienda Los Robles", monto: 25000000, plazo: "60 días", aprobado: "2026-03-10", vence: "2026-05-09", saldo: 8000000, status: "vencido" },
];

const STATUS_CFG = {
  vigente: { label: "Vigente", cls: "bg-green-100 text-green-700", icon: <CheckCircle size={12} /> },
  parcial: { label: "Pago parcial", cls: "bg-blue-100 text-blue-700", icon: <DollarSign size={12} /> },
  pagado: { label: "Pagado", cls: "bg-gray-100 text-gray-600", icon: <CheckCircle size={12} /> },
  vencido: { label: "Vencido", cls: "bg-red-100 text-red-700", icon: <XCircle size={12} /> },
};

export default function CreditoHistorialPage() {
  const [items] = useState(MOCK_HISTORIAL);
  const totalVigente = items.filter(i => i.status !== "pagado").reduce((s, i) => s + i.saldo, 0);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-headline-md font-bold">Historial de créditos aprobados</h1>
        <p className="text-sm text-[var(--color-on-surface-variant)]">{items.length} créditos · ${(totalVigente / 1e6).toFixed(1)}M en saldo vigente</p>
      </div>

      <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--color-surface-container-low)] text-xs text-[var(--color-on-surface-variant)] uppercase tracking-wide">
            <tr>
              {["Empresa", "Monto aprobado", "Saldo pendiente", "Plazo", "Vence", "Estado", ""].map(h => (
                <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border-subtle)]">
            {items.map(item => {
              const scfg = STATUS_CFG[item.status as keyof typeof STATUS_CFG];
              const pct = item.monto > 0 ? ((item.monto - item.saldo) / item.monto) * 100 : 100;
              return (
                <tr key={item.id} className="hover:bg-[var(--color-surface-container-low)]/50 transition-colors">
                  <td className="px-4 py-3 font-medium">{item.empresa}</td>
                  <td className="px-4 py-3 font-semibold">${(item.monto / 1e6).toFixed(0)}M</td>
                  <td className="px-4 py-3">
                    <p className={`font-bold ${item.saldo > 0 ? "text-orange-600" : "text-green-600"}`}>${(item.saldo / 1e6).toFixed(1)}M</p>
                    <div className="h-1 bg-gray-100 rounded-full mt-1 w-20">
                      <div className="h-full bg-[var(--color-primary)] rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-on-surface-variant)]">{item.plazo}</td>
                  <td className="px-4 py-3 text-[var(--color-on-surface-variant)]">{item.vence}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${scfg.cls}`}>
                      {scfg.icon} {scfg.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="p-1.5 hover:bg-gray-100 rounded-lg text-[var(--color-on-surface-variant)]"><Download size={14} /></button>
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
