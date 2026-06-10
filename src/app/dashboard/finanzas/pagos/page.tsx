"use client";

import { useState } from "react";
import { CreditCard, CheckCircle, Clock, AlertTriangle, Download } from "lucide-react";

const MOCK_PAGOS = [
  { id: "pago-001", referencia: "TXN-2026-4521", tipo: "PSE", monto: 340000, orden: "ORD-1042", fecha: "2026-06-10 09:12", status: "aprobado" },
  { id: "pago-002", referencia: "TXN-2026-4520", tipo: "Tarjeta crédito", monto: 185000, orden: "ORD-1041", fecha: "2026-06-09 14:30", status: "aprobado" },
  { id: "pago-003", referencia: "TXN-2026-4519", tipo: "PSE", monto: 520000, orden: "ORD-1040", fecha: "2026-06-09 11:05", status: "fallido" },
  { id: "pago-004", referencia: "TXN-2026-4518", tipo: "Crédito B2B", monto: 2400000, orden: "ORD-1038", fecha: "2026-06-08 08:00", status: "pendiente" },
  { id: "pago-005", referencia: "TXN-2026-4517", tipo: "PSE", monto: 98000, orden: "ORD-1037", fecha: "2026-06-07 16:45", status: "aprobado" },
];

const STATUS_CFG = {
  aprobado: { label: "Aprobado", icon: <CheckCircle size={12} />, cls: "bg-green-100 text-green-700" },
  pendiente: { label: "Pendiente", icon: <Clock size={12} />, cls: "bg-yellow-100 text-yellow-700" },
  fallido: { label: "Fallido", icon: <AlertTriangle size={12} />, cls: "bg-red-100 text-red-700" },
};

export default function PagosPage() {
  const [pagos] = useState(MOCK_PAGOS);
  const [filter, setFilter] = useState("todos");

  const filtered = filter === "todos" ? pagos : pagos.filter(p => p.status === filter);
  const totalAprobado = pagos.filter(p => p.status === "aprobado").reduce((s, p) => s + p.monto, 0);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-headline-md font-bold">Transacciones de pago</h1>
        <p className="text-sm text-[var(--color-on-surface-variant)]">${totalAprobado.toLocaleString("es-CO")} aprobados hoy</p>
      </div>
      <div className="flex gap-2">
        {["todos", "aprobado", "pendiente", "fallido"].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === f ? "bg-[var(--color-primary)] text-white" : "bg-white border border-[var(--color-border-subtle)] text-[var(--color-on-surface-variant)]"}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
      <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--color-surface-container-low)] text-xs text-[var(--color-on-surface-variant)] uppercase tracking-wide">
            <tr>
              {["Referencia", "Tipo", "Orden", "Monto", "Fecha", "Estado", ""].map(h => (
                <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border-subtle)]">
            {filtered.map(p => {
              const scfg = STATUS_CFG[p.status as keyof typeof STATUS_CFG];
              return (
                <tr key={p.id} className="hover:bg-[var(--color-surface-container-low)]/50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs">{p.referencia}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5"><CreditCard size={13} className="text-[var(--color-on-surface-variant)]" /> {p.tipo}</span>
                  </td>
                  <td className="px-4 py-3 font-medium text-[var(--color-primary)]">{p.orden}</td>
                  <td className="px-4 py-3 font-bold">${p.monto.toLocaleString("es-CO")}</td>
                  <td className="px-4 py-3 text-[var(--color-on-surface-variant)]">{p.fecha}</td>
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
