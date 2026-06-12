"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { CheckSquare, ChevronLeft, Plus, Circle, CheckCircle2, Calendar, User } from "lucide-react";
import Link from "next/link";

const TAREAS = [
  { id: "T1", titulo: "Confirmar número de guía con transportista", asignado: "Almacén Bogotá", vence: "2026-06-12", completada: false, prioridad: "Alta" },
  { id: "T2", titulo: "Enviar factura definitiva al cliente", asignado: "María Gómez", vence: "2026-06-13", completada: false, prioridad: "Media" },
  { id: "T3", titulo: "Coordinar horario de recibo con encargado", asignado: "Mauricio Torres", vence: "2026-06-11", completada: true, prioridad: "Alta" },
  { id: "T4", titulo: "Verificar condiciones de almacenamiento en destino", asignado: "María Gómez", vence: "2026-06-15", completada: false, prioridad: "Baja" },
];

const PRIORIDAD_COLOR: Record<string, string> = {
  Alta: "text-red-600 bg-red-50",
  Media: "text-amber-600 bg-amber-50",
  Baja: "text-slate-500 bg-slate-100",
};

export default function TareasPage() {
  const params = useParams();
  const [tareas, setTareas] = useState(TAREAS);

  const toggleTarea = (id: string) => {
    setTareas((prev) => prev.map((t) => t.id === id ? { ...t, completada: !t.completada } : t));
  };

  const pendientes = tareas.filter((t) => !t.completada);
  const completadas = tareas.filter((t) => t.completada);

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href={`/mensajes/${params.id}`} className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors">
          <ChevronLeft size={20} />
        </Link>
        <div className="flex-1">
          <h1 className="text-headline-md font-bold flex items-center gap-2">
            <CheckSquare size={20} /> Tareas de conversación
          </h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">
            CONV-001 · {pendientes.length} pendientes · {completadas.length} completadas
          </p>
        </div>
        <button className="flex items-center gap-2 text-sm bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
          <Plus size={14} /> Nueva tarea
        </button>
      </div>

      {/* Pendientes */}
      {pendientes.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wide">Pendientes</h2>
          {pendientes.map((t) => (
            <div key={t.id} className="flex items-start gap-3 bg-white rounded-xl border border-[var(--color-border-subtle)] p-4">
              <button onClick={() => toggleTarea(t.id)} className="mt-0.5 shrink-0 text-[var(--color-border-subtle)] hover:text-[var(--color-primary)] transition-colors">
                <Circle size={18} />
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{t.titulo}</p>
                <div className="flex flex-wrap gap-3 mt-1.5 text-[10px] text-[var(--color-on-surface-variant)]">
                  <span className="flex items-center gap-1"><User size={10} /> {t.asignado}</span>
                  <span className="flex items-center gap-1"><Calendar size={10} /> {t.vence}</span>
                  <span className={`px-1.5 py-0.5 rounded-full font-medium ${PRIORIDAD_COLOR[t.prioridad]}`}>{t.prioridad}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Completadas */}
      {completadas.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wide">Completadas</h2>
          {completadas.map((t) => (
            <div key={t.id} className="flex items-start gap-3 bg-white rounded-xl border border-[var(--color-border-subtle)] p-4 opacity-60">
              <button onClick={() => toggleTarea(t.id)} className="mt-0.5 shrink-0 text-green-500">
                <CheckCircle2 size={18} />
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium line-through">{t.titulo}</p>
                <div className="flex flex-wrap gap-3 mt-1.5 text-[10px] text-[var(--color-on-surface-variant)]">
                  <span className="flex items-center gap-1"><User size={10} /> {t.asignado}</span>
                  <span className="flex items-center gap-1"><Calendar size={10} /> {t.vence}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Link href={`/mensajes/${params.id}`} className="text-xs text-[var(--color-primary)] hover:underline flex items-center gap-1">
        <ChevronLeft size={11} /> Volver a la conversación
      </Link>
    </div>
  );
}
