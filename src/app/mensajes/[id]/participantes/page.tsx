"use client";

import { useParams } from "next/navigation";
import { Users, ChevronLeft, Plus, Shield, X, Building2 } from "lucide-react";
import Link from "next/link";

const PARTICIPANTES = [
  { id: "P1", nombre: "Mauricio Torres", empresa: "Grupo Agroindustrial S.A.", rol: "Comprador", avatar: "MT", activo: true, puede: ["leer", "escribir"] },
  { id: "P2", nombre: "María Gómez", empresa: "DistAgroMax", rol: "Vendedor", avatar: "MG", activo: true, puede: ["leer", "escribir", "notas privadas", "archivos"] },
  { id: "P3", nombre: "Almacén Bogotá", empresa: "DistAgroMax", rol: "Almacén", avatar: "AB", activo: true, puede: ["leer", "escribir"] },
];

const PERMISOS_LABEL: Record<string, string> = {
  leer: "Leer",
  escribir: "Escribir",
  "notas privadas": "Notas privadas",
  archivos: "Adjuntar archivos",
};

export default function ParticipantesPage() {
  const params = useParams();

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href={`/mensajes/${params.id}`} className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors">
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h1 className="text-headline-md font-bold flex items-center gap-2">
            <Users size={20} /> Participantes
          </h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">
            CONV-001 · Orden NPK 8t — Grupo Agroindustrial
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
        <div className="px-5 py-4 flex items-center justify-between border-b border-[var(--color-border-subtle)]">
          <h2 className="font-semibold text-sm">{PARTICIPANTES.length} participantes activos</h2>
          <button className="flex items-center gap-1.5 text-xs text-[var(--color-primary)] hover:underline">
            <Plus size={13} /> Agregar
          </button>
        </div>
        <div className="divide-y divide-[var(--color-border-subtle)]">
          {PARTICIPANTES.map((p) => (
            <div key={p.id} className="px-5 py-4 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] bg-opacity-10 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-[var(--color-primary)]">{p.avatar}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold">{p.nombre}</p>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full">{p.rol}</span>
                </div>
                <p className="text-xs text-[var(--color-on-surface-variant)] flex items-center gap-1 mt-0.5">
                  <Building2 size={10} /> {p.empresa}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {p.puede.map((perm) => (
                    <span key={perm} className="flex items-center gap-1 text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                      <Shield size={8} /> {PERMISOS_LABEL[perm]}
                    </span>
                  ))}
                </div>
              </div>
              <button className="p-1.5 rounded-lg text-[var(--color-on-surface-variant)] hover:bg-red-50 hover:text-red-500 transition-colors shrink-0 mt-0.5">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-xs font-semibold text-amber-800 mb-1">Regla de acceso</p>
        <p className="text-xs text-amber-700">
          Los mensajes internos (notas privadas) solo son visibles para participantes de DistAgroMax.
          Los participantes externos solo ven mensajes del tipo «Mensaje».
        </p>
      </div>

      <Link href={`/mensajes/${params.id}`} className="text-xs text-[var(--color-primary)] hover:underline flex items-center gap-1">
        <ChevronLeft size={11} /> Volver a la conversación
      </Link>
    </div>
  );
}
