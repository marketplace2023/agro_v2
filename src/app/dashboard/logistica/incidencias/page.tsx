"use client";

import { useState } from "react";
import { AlertTriangle, Clock, CheckCircle, Truck } from "lucide-react";

const MOCK_INCIDENCIAS = [
  { id: "inc-001", orden: "ORD-1031", tipo: "Rechazo en destino", descripcion: "Cliente no disponible en dirección indicada", carrier: "Envia", fecha: "2026-06-07", status: "abierta" },
  { id: "inc-002", orden: "ORD-1025", tipo: "Daño en mercancía", descripcion: "Embalaje roto — producto de vidrio afectado", carrier: "Servientrega", fecha: "2026-06-05", status: "en_proceso" },
  { id: "inc-003", orden: "ORD-1018", tipo: "Retraso superior a 3 días", descripcion: "Retención en aduana departamental", carrier: "TCC", fecha: "2026-05-30", status: "resuelta" },
];

const STATUS_CFG = {
  abierta: { label: "Abierta", icon: <AlertTriangle size={12} />, cls: "bg-red-100 text-red-700" },
  en_proceso: { label: "En proceso", icon: <Clock size={12} />, cls: "bg-yellow-100 text-yellow-700" },
  resuelta: { label: "Resuelta", icon: <CheckCircle size={12} />, cls: "bg-green-100 text-green-700" },
};

export default function IncidenciasPage() {
  const [items] = useState(MOCK_INCIDENCIAS);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-headline-md font-bold">Incidencias logísticas</h1>
        <p className="text-sm text-[var(--color-on-surface-variant)]">{items.filter(i => i.status !== "resuelta").length} incidencias activas</p>
      </div>
      <div className="space-y-3">
        {items.map(inc => {
          const scfg = STATUS_CFG[inc.status as keyof typeof STATUS_CFG];
          return (
            <div key={inc.id} className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Truck size={16} className="text-orange-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm text-[var(--color-primary)]">{inc.orden}</p>
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${scfg.cls}`}>
                        {scfg.icon} {scfg.label}
                      </span>
                    </div>
                    <p className="font-medium text-sm mt-0.5">{inc.tipo}</p>
                    <p className="text-xs text-[var(--color-on-surface-variant)]">{inc.descripcion}</p>
                    <p className="text-xs text-[var(--color-on-surface-variant)] mt-1">{inc.carrier} · {inc.fecha}</p>
                  </div>
                </div>
                {inc.status !== "resuelta" && (
                  <button className="text-xs bg-[var(--color-primary)] text-white px-3 py-2 rounded-lg font-medium flex-shrink-0">Gestionar</button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
