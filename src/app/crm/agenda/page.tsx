"use client";

import { useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, Phone, Mail, Users, Clock, Plus } from "lucide-react";
import Link from "next/link";

const DIAS_SEMANA = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

const EVENTOS = [
  { fecha: "2026-06-08", hora: "09:30", tipo: "Llamada", empresa: "AgroValle S.A.S.", duracion: "30 min", color: "bg-green-100 text-green-800 border-green-300" },
  { fecha: "2026-06-09", hora: "15:30", tipo: "Cotización", empresa: "Palmas del Norte", duracion: "1 h", color: "bg-sky-100 text-sky-800 border-sky-300" },
  { fecha: "2026-06-10", hora: "10:30", tipo: "Email", empresa: "Finca Las Palmas", duracion: "—", color: "bg-blue-100 text-blue-800 border-blue-300" },
  { fecha: "2026-06-11", hora: "09:00", tipo: "Llamada", empresa: "Grupo Agroindustrial", duracion: "30 min", color: "bg-green-100 text-green-800 border-green-300" },
  { fecha: "2026-06-11", hora: "14:00", tipo: "Visita", empresa: "Cooperativa Boyacá", duracion: "2 h", color: "bg-violet-100 text-violet-800 border-violet-300" },
  { fecha: "2026-06-12", hora: "11:00", tipo: "Seguimiento", empresa: "AgroValle S.A.S.", duracion: "20 min", color: "bg-amber-100 text-amber-800 border-amber-300" },
  { fecha: "2026-06-12", hora: "16:00", tipo: "Llamada", empresa: "Tecnicaña S.A.", duracion: "30 min", color: "bg-green-100 text-green-800 border-green-300" },
  { fecha: "2026-06-13", hora: "10:00", tipo: "Reunión", empresa: "Hacienda La Esperanza", duracion: "1.5 h", color: "bg-rose-100 text-rose-800 border-rose-300" },
  { fecha: "2026-06-15", hora: "09:00", tipo: "Llamada", empresa: "Agrícola del Llano", duracion: "30 min", color: "bg-green-100 text-green-800 border-green-300" },
  { fecha: "2026-06-17", hora: "11:30", tipo: "Visita", empresa: "Semillas Nacionales", duracion: "2 h", color: "bg-violet-100 text-violet-800 border-violet-300" },
];

const TIPO_ICON: Record<string, React.ReactNode> = {
  Llamada: <Phone size={11} />,
  Email: <Mail size={11} />,
  Visita: <Users size={11} />,
  Seguimiento: <Clock size={11} />,
  Reunión: <Calendar size={11} />,
  Cotización: <Clock size={11} />,
};

export default function AgendaPage() {
  const [semanaOffset, setSemanaOffset] = useState(0);

  const luneSemana = new Date("2026-06-08");
  luneSemana.setDate(luneSemana.getDate() + semanaOffset * 7);

  const diasSemana = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(luneSemana);
    d.setDate(d.getDate() + i);
    return d.toISOString().split("T")[0];
  });

  const mesAnio = luneSemana.toLocaleDateString("es-CO", { month: "long", year: "numeric" });

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-md font-bold flex items-center gap-2">
            <Calendar size={22} /> Agenda comercial
          </h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1 capitalize">{mesAnio}</p>
        </div>
        <button className="flex items-center gap-2 text-sm bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
          <Plus size={15} /> Nuevo evento
        </button>
      </div>

      {/* Navegación semana */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSemanaOffset(o => o - 1)}
          className="p-2 rounded-lg border border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-container)] transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-medium">
          {diasSemana[0]} — {diasSemana[6]}
        </span>
        <button
          onClick={() => setSemanaOffset(o => o + 1)}
          className="p-2 rounded-lg border border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-container)] transition-colors"
        >
          <ChevronRight size={16} />
        </button>
        <button
          onClick={() => setSemanaOffset(0)}
          className="text-xs text-[var(--color-primary)] border border-[var(--color-primary)] px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
        >
          Hoy
        </button>
      </div>

      {/* Grilla semanal */}
      <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
        {/* Header días */}
        <div className="grid grid-cols-7 border-b border-[var(--color-border-subtle)]">
          {diasSemana.map((fecha, i) => {
            const esHoy = fecha === "2026-06-11";
            const numerodia = parseInt(fecha.split("-")[2]);
            return (
              <div
                key={fecha}
                className={`p-3 text-center border-r last:border-r-0 border-[var(--color-border-subtle)] ${esHoy ? "bg-[var(--color-primary)] bg-opacity-5" : ""}`}
              >
                <p className={`text-[10px] font-medium ${esHoy ? "text-[var(--color-primary)]" : "text-[var(--color-on-surface-variant)]"}`}>
                  {DIAS_SEMANA[i]}
                </p>
                <p className={`text-lg font-bold mt-0.5 ${esHoy ? "text-[var(--color-primary)]" : ""}`}>{numerodia}</p>
              </div>
            );
          })}
        </div>

        {/* Celdas con eventos */}
        <div className="grid grid-cols-7 min-h-48">
          {diasSemana.map((fecha) => {
            const eventos = EVENTOS.filter(e => e.fecha === fecha);
            const esHoy = fecha === "2026-06-11";
            return (
              <div
                key={fecha}
                className={`p-2 border-r last:border-r-0 border-[var(--color-border-subtle)] min-h-48 ${esHoy ? "bg-[var(--color-primary)] bg-opacity-5" : "bg-white"}`}
              >
                <div className="space-y-1.5">
                  {eventos.map((ev, i) => (
                    <div
                      key={i}
                      className={`rounded-md border px-2 py-1.5 text-[10px] cursor-pointer hover:opacity-80 transition-opacity ${ev.color}`}
                    >
                      <div className="flex items-center gap-1 font-medium">
                        {TIPO_ICON[ev.tipo]}
                        <span className="truncate">{ev.tipo}</span>
                      </div>
                      <p className="truncate opacity-75 mt-0.5">{ev.empresa}</p>
                      <p className="opacity-60 mt-0.5">{ev.hora}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Próximas actividades listadas */}
      <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--color-border-subtle)]">
          <h2 className="font-semibold text-sm">Próximas actividades</h2>
        </div>
        <div className="divide-y divide-[var(--color-border-subtle)]">
          {EVENTOS.filter(e => e.fecha >= "2026-06-11").slice(0, 5).map((ev, i) => (
            <div key={i} className="px-5 py-3 flex items-center gap-4">
              <div className={`p-1.5 rounded-full ${ev.color}`}>
                {TIPO_ICON[ev.tipo]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium">{ev.tipo} — {ev.empresa}</p>
                <p className="text-[10px] text-[var(--color-on-surface-variant)]">{ev.fecha} · {ev.hora} · {ev.duracion}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4 text-xs">
        <Link href="/crm/actividades" className="text-[var(--color-primary)] hover:underline">Ver actividades</Link>
        <Link href="/dashboard/crm" className="text-[var(--color-primary)] hover:underline">← Dashboard CRM</Link>
      </div>
    </div>
  );
}
