"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle, Clock, Package, RotateCcw } from "lucide-react";

const MOCK_RECLAMOS = [
  { id: "rec-001", orden: "ORD-1035", cliente: "AgroSoya del Meta", motivo: "Producto en mal estado", monto: 186000, status: "abierto", fecha: "2026-06-09" },
  { id: "rec-002", orden: "ORD-1028", cliente: "Frutas del Oriente", motivo: "Producto incorrecto recibido", monto: 95000, status: "en_proceso", fecha: "2026-06-07" },
  { id: "rec-003", orden: "ORD-1020", cliente: "Finca La Esperanza", motivo: "Cantidad incompleta", monto: 42000, status: "resuelto", fecha: "2026-05-28" },
];

const STATUS_CFG = {
  abierto: { label: "Abierto", icon: <AlertTriangle size={12} />, cls: "bg-red-100 text-red-700" },
  en_proceso: { label: "En proceso", icon: <Clock size={12} />, cls: "bg-yellow-100 text-yellow-700" },
  resuelto: { label: "Resuelto", icon: <CheckCircle size={12} />, cls: "bg-green-100 text-green-700" },
};

export default function SoporteReclamosPage() {
  const [items] = useState(MOCK_RECLAMOS);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-headline-md font-bold">Gestión de reclamos</h1>
        <p className="text-sm text-[var(--color-on-surface-variant)]">{items.filter(r => r.status !== "resuelto").length} reclamos activos</p>
      </div>
      <div className="space-y-3">
        {items.map(r => {
          const scfg = STATUS_CFG[r.status as keyof typeof STATUS_CFG];
          return (
            <div key={r.id} className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <RotateCcw size={16} className="text-red-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm text-[var(--color-primary)]">{r.orden}</p>
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${scfg.cls}`}>
                        {scfg.icon} {scfg.label}
                      </span>
                    </div>
                    <p className="text-sm mt-0.5">{r.cliente}</p>
                    <p className="text-xs text-[var(--color-on-surface-variant)]">{r.motivo} · {r.fecha}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-sm">${r.monto.toLocaleString("es-CO")}</p>
                  {r.status !== "resuelto" && (
                    <Link href={`/dashboard/soporte/tickets/tkt-001`} className="text-xs text-[var(--color-primary)] font-medium hover:underline">Gestionar</Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
