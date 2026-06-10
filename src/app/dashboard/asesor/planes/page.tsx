"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, ClipboardList, CheckCircle, Clock, User } from "lucide-react";

const MOCK_PLANES = [
  { id: "plan-001", titulo: "Plan de fertilización Maíz — Fase 1", cliente: "Finca La Esperanza", cultivo: "Maíz amarillo", fechaInicio: "2026-06-01", duracion: "90 días", progreso: 35, status: "activo" },
  { id: "plan-002", titulo: "Manejo integrado Tizón Papa", cliente: "Agropecuaria Boyacá SAS", cultivo: "Papa criolla", fechaInicio: "2026-05-15", duracion: "45 días", progreso: 60, status: "activo" },
  { id: "plan-003", titulo: "Nutrición foliar Aguacate Hass", cliente: "Frutas del Oriente", cultivo: "Aguacate Hass", fechaInicio: "2026-04-01", duracion: "60 días", progreso: 100, status: "completado" },
  { id: "plan-004", titulo: "Control biológico Plagas Soya", cliente: "Agro del Llano", cultivo: "Soya", fechaInicio: "2026-06-08", duracion: "30 días", progreso: 10, status: "activo" },
];

export default function PlanesPage() {
  const [planes] = useState(MOCK_PLANES);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-md font-bold">Planes agronómicos</h1>
          <p className="text-sm text-[var(--color-on-surface-variant)]">{planes.filter(p => p.status === "activo").length} planes activos</p>
        </div>
        <Link href="/dashboard/asesor/planes/nuevo" className="flex items-center gap-2 bg-[var(--color-primary)] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90">
          <Plus size={16} /> Nuevo plan
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {planes.map(p => (
          <div key={p.id} className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-5 space-y-4 hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{p.titulo}</p>
                <div className="flex items-center gap-1.5 mt-1 text-xs text-[var(--color-on-surface-variant)]">
                  <User size={11} /> {p.cliente}
                </div>
              </div>
              <span className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${p.status === "completado" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                {p.status === "completado" ? <CheckCircle size={11} /> : <Clock size={11} />}
                {p.status === "completado" ? "Completado" : "Activo"}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-[var(--color-on-surface-variant)]">
              <span className="flex items-center gap-1"><ClipboardList size={11} /> {p.cultivo}</span>
              <span>· Inicio: {p.fechaInicio}</span>
              <span>· {p.duracion}</span>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-[var(--color-on-surface-variant)]">Progreso</span>
                <span className="font-semibold text-[var(--color-primary)]">{p.progreso}%</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${p.progreso === 100 ? "bg-green-500" : "bg-[var(--color-primary)]"}`} style={{ width: `${p.progreso}%` }} />
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <Link href={`/dashboard/asesor/planes/nuevo`} className="flex-1 text-center text-xs border border-[var(--color-border-subtle)] py-2 rounded-lg hover:bg-gray-50 transition-colors text-[var(--color-on-surface-variant)]">Ver plan</Link>
              <Link href={`/dashboard/asesor/diagnosticos`} className="flex-1 text-center text-xs bg-[var(--color-primary)]/5 text-[var(--color-primary)] py-2 rounded-lg hover:bg-[var(--color-primary)]/10 transition-colors font-medium">Diagnóstico</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
