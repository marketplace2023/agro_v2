"use client";

import { useState } from "react";
import Link from "next/link";
import { CreditCard, Clock, CheckCircle, XCircle, User, DollarSign, ChevronRight } from "lucide-react";

const MOCK_SOLICITUDES = [
  { id: "cred-001", empresa: "Agropecuaria Boyacá SAS", nit: "900.456.789-1", monto: 50000000, plazo: "90 días", fecha: "2026-06-09", score: 72, status: "pendiente" },
  { id: "cred-002", empresa: "Finca El Palmar Ltda.", nit: "800.123.456-2", monto: 20000000, plazo: "60 días", fecha: "2026-06-08", score: 85, status: "aprobado" },
  { id: "cred-003", empresa: "Frutas del Oriente SAS", nit: "901.234.567-3", monto: 30000000, plazo: "90 días", fecha: "2026-06-07", score: 45, status: "rechazado" },
  { id: "cred-004", empresa: "AgroSoya del Meta", nit: "802.345.678-4", monto: 75000000, plazo: "180 días", fecha: "2026-06-10", score: 68, status: "pendiente" },
];

const STATUS_CFG = {
  pendiente: { label: "En análisis", icon: <Clock size={12} />, cls: "bg-yellow-100 text-yellow-700" },
  aprobado: { label: "Aprobado", icon: <CheckCircle size={12} />, cls: "bg-green-100 text-green-700" },
  rechazado: { label: "Rechazado", icon: <XCircle size={12} />, cls: "bg-red-100 text-red-700" },
};

export default function CreditoSolicitudesPage() {
  const [items] = useState(MOCK_SOLICITUDES);
  const [filter, setFilter] = useState("todos");

  const filtered = filter === "todos" ? items : items.filter(s => s.status === filter);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-headline-md font-bold">Solicitudes de crédito B2B</h1>
        <p className="text-sm text-[var(--color-on-surface-variant)]">{items.filter(s => s.status === "pendiente").length} pendientes de análisis</p>
      </div>

      <div className="flex gap-2">
        {["todos", "pendiente", "aprobado", "rechazado"].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === f ? "bg-[var(--color-primary)] text-white" : "bg-white border border-[var(--color-border-subtle)] text-[var(--color-on-surface-variant)]"}`}>
            {f === "todos" ? "Todos" : f.charAt(0).toUpperCase() + f.slice(1)}
            {f !== "todos" && ` (${items.filter(s => s.status === f).length})`}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(sol => {
          const scfg = STATUS_CFG[sol.status as keyof typeof STATUS_CFG];
          const scoreColor = sol.score >= 70 ? "text-green-600" : sol.score >= 50 ? "text-yellow-600" : "text-red-600";
          return (
            <div key={sol.id} className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-5 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[var(--color-primary)]/8 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CreditCard size={18} className="text-[var(--color-primary)]" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{sol.empresa}</p>
                    <p className="text-xs text-[var(--color-on-surface-variant)]">NIT: {sol.nit} · Solicitado: {sol.fecha}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${scfg.cls}`}>
                  {scfg.icon} {scfg.label}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[var(--color-surface-container-low)] rounded-lg p-3">
                  <p className="text-xs text-[var(--color-on-surface-variant)]">Monto solicitado</p>
                  <p className="font-bold text-sm mt-0.5">${(sol.monto / 1e6).toFixed(0)}M COP</p>
                </div>
                <div className="bg-[var(--color-surface-container-low)] rounded-lg p-3">
                  <p className="text-xs text-[var(--color-on-surface-variant)]">Plazo</p>
                  <p className="font-bold text-sm mt-0.5">{sol.plazo}</p>
                </div>
                <div className="bg-[var(--color-surface-container-low)] rounded-lg p-3">
                  <p className="text-xs text-[var(--color-on-surface-variant)]">Score crediticio</p>
                  <p className={`font-bold text-lg mt-0.5 ${scoreColor}`}>{sol.score}</p>
                </div>
              </div>
              {sol.status === "pendiente" && (
                <div className="flex gap-2 pt-1">
                  <button className="flex-1 flex items-center justify-center gap-1.5 bg-green-600 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-green-700">
                    <CheckCircle size={14} /> Aprobar crédito
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1.5 border border-red-200 text-red-600 text-sm font-semibold py-2.5 rounded-xl hover:bg-red-50">
                    <XCircle size={14} /> Rechazar
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
