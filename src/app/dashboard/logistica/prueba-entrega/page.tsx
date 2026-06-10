"use client";

import { useState } from "react";
import Link from "next/link";
import { ClipboardList, CheckCircle, Clock, Camera, AlertTriangle } from "lucide-react";

const MOCK_ENTREGAS = [
  { id: "des-001", orden: "ORD-1042", cliente: "Finca La Esperanza", conductor: "Carlos Pérez", fecha: "2026-06-10", status: "pendiente_pod" },
  { id: "des-002", orden: "ORD-1039", cliente: "Agropecuaria Boyacá SAS", conductor: "Luis García", fecha: "2026-06-09", status: "pod_ok" },
  { id: "des-003", orden: "ORD-1035", cliente: "AgroSoya del Meta", conductor: "María Torres", fecha: "2026-06-08", status: "pendiente_pod" },
  { id: "des-004", orden: "ORD-1031", cliente: "Frutas del Oriente", conductor: "Jhon Ríos", fecha: "2026-06-07", status: "rechazo" },
];

const STATUS_CFG = {
  pendiente_pod: { label: "Pendiente POD", icon: <Clock size={12} />, cls: "bg-yellow-100 text-yellow-700" },
  pod_ok: { label: "POD confirmado", icon: <CheckCircle size={12} />, cls: "bg-green-100 text-green-700" },
  rechazo: { label: "Rechazo en destino", icon: <AlertTriangle size={12} />, cls: "bg-red-100 text-red-700" },
};

export default function PruebaEntregaListPage() {
  const [items] = useState(MOCK_ENTREGAS);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-headline-md font-bold">Prueba de entrega (POD)</h1>
        <p className="text-sm text-[var(--color-on-surface-variant)]">{items.filter(i => i.status === "pendiente_pod").length} entregas pendientes de confirmación</p>
      </div>

      <div className="grid gap-3">
        {items.map(item => {
          const scfg = STATUS_CFG[item.status as keyof typeof STATUS_CFG];
          return (
            <div key={item.id} className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-[var(--color-primary)]/8 rounded-xl flex items-center justify-center flex-shrink-0">
                <ClipboardList size={18} className="text-[var(--color-primary)]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm">{item.orden}</p>
                  <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${scfg.cls}`}>
                    {scfg.icon} {scfg.label}
                  </span>
                </div>
                <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{item.cliente} · Conductor: {item.conductor}</p>
                <p className="text-xs text-[var(--color-on-surface-variant)]">{item.fecha}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                {item.status === "pendiente_pod" && (
                  <Link href={`/dashboard/logistica/prueba-entrega/${item.id}`} className="flex items-center gap-1.5 text-xs bg-[var(--color-primary)] text-white px-3 py-2 rounded-lg font-medium">
                    <Camera size={12} /> Registrar POD
                  </Link>
                )}
                <Link href={`/dashboard/logistica/prueba-entrega/${item.id}`} className="text-xs border border-[var(--color-border-subtle)] text-[var(--color-on-surface-variant)] px-3 py-2 rounded-lg hover:bg-gray-50">
                  Ver
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
