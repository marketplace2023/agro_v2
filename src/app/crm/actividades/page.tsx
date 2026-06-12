"use client";

import { useState } from "react";
import { Activity, Phone, Mail, Users, Clock, CheckCircle2, Plus, Filter, Calendar } from "lucide-react";
import Link from "next/link";

const ACTIVIDADES = [
  { id: "ACT-001", tipo: "Llamada", empresa: "Grupo Agroindustrial S.A.", contacto: "Mauricio Torres", opp: "OPP-2026-034", descripcion: "Llamada de seguimiento sobre validación logística.", fecha: "2026-06-11", hora: "09:00", vendedor: "María Gómez", completada: false, prioritaria: true },
  { id: "ACT-002", tipo: "Visita", empresa: "Cooperativa Boyacá Agro", contacto: "Ricardo Ospina", opp: "OPP-2026-035", descripcion: "Visita a instalaciones para presentar muestras de biológicos.", fecha: "2026-06-11", hora: "14:00", vendedor: "Luis Pérez", completada: false, prioritaria: false },
  { id: "ACT-003", tipo: "Email", empresa: "Finca Las Palmas", contacto: "Sandra Molina", opp: "OPP-2026-037", descripcion: "Enviar resumen de cotización con condiciones de entrega.", fecha: "2026-06-10", hora: "10:30", vendedor: "Luis Pérez", completada: true, prioritaria: false },
  { id: "ACT-004", tipo: "Seguimiento", empresa: "AgroValle S.A.S.", contacto: "Juliana Ríos", opp: "OPP-2026-036", descripcion: "Revisar aceptación de propuesta de insecticidas 3t.", fecha: "2026-06-12", hora: "11:00", vendedor: "Carlos Díaz", completada: false, prioritaria: true },
  { id: "ACT-005", tipo: "Llamada", empresa: "Tecnicaña S.A.", contacto: "Carlos Herrera", opp: "OPP-2026-032", descripcion: "Confirmar fecha de despacho de herbicidas selectivos.", fecha: "2026-06-12", hora: "16:00", vendedor: "Luis Pérez", completada: false, prioritaria: false },
  { id: "ACT-006", tipo: "Cotización", empresa: "Palmas del Norte", contacto: "Patricia Suárez", opp: "OPP-2026-031", descripcion: "Presentar cotización revisada con fletes incluidos.", fecha: "2026-06-09", hora: "15:30", vendedor: "María Gómez", completada: true, prioritaria: false },
  { id: "ACT-007", tipo: "Reunión", empresa: "Hacienda La Esperanza", contacto: "Andrés Lozano", opp: "LED-004", descripcion: "Reunión de apertura para presentar portafolio de fungicidas.", fecha: "2026-06-13", hora: "10:00", vendedor: "María Gómez", completada: false, prioritaria: false },
];

const TIPO_ICON: Record<string, React.ReactNode> = {
  Llamada: <Phone size={14} />,
  Email: <Mail size={14} />,
  Visita: <Users size={14} />,
  Seguimiento: <Clock size={14} />,
  Cotización: <Activity size={14} />,
  Reunión: <Calendar size={14} />,
};

const TIPO_COLOR: Record<string, string> = {
  Llamada: "bg-green-50 text-green-600",
  Email: "bg-blue-50 text-blue-600",
  Visita: "bg-violet-50 text-violet-600",
  Seguimiento: "bg-amber-50 text-amber-600",
  Cotización: "bg-sky-50 text-sky-600",
  Reunión: "bg-rose-50 text-rose-600",
};

const FILTROS = ["Todas", "Pendientes", "Completadas", "Hoy", "Próximos 3 días"];

export default function ActividadesPage() {
  const [filtro, setFiltro] = useState("Todas");

  const hoy = "2026-06-11";
  const filtradas = ACTIVIDADES.filter((a) => {
    if (filtro === "Pendientes") return !a.completada;
    if (filtro === "Completadas") return a.completada;
    if (filtro === "Hoy") return a.fecha === hoy;
    if (filtro === "Próximos 3 días") return a.fecha >= hoy && a.fecha <= "2026-06-14";
    return true;
  });

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-md font-bold flex items-center gap-2">
            <Activity size={22} /> Actividades
          </h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">
            {ACTIVIDADES.filter(a => !a.completada).length} pendientes · {ACTIVIDADES.filter(a => a.completada).length} completadas
          </p>
        </div>
        <button className="flex items-center gap-2 text-sm bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
          <Plus size={15} /> Nueva actividad
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {FILTROS.map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={`text-xs px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
              filtro === f
                ? "bg-[var(--color-primary)] text-white"
                : "border border-[var(--color-border-subtle)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Métricas rápidas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Pendientes hoy", valor: ACTIVIDADES.filter(a => a.fecha === hoy && !a.completada).length, color: "text-red-500" },
          { label: "Prioritarias", valor: ACTIVIDADES.filter(a => a.prioritaria && !a.completada).length, color: "text-amber-500" },
          { label: "Esta semana", valor: ACTIVIDADES.filter(a => a.fecha >= "2026-06-08" && a.fecha <= "2026-06-14").length, color: "text-blue-500" },
          { label: "Completadas", valor: ACTIVIDADES.filter(a => a.completada).length, color: "text-green-500" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-4">
            <p className={`text-2xl font-bold ${s.color}`}>{s.valor}</p>
            <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Lista agrupada por fecha */}
      <div className="space-y-4">
        {["2026-06-11", "2026-06-12", "2026-06-13", "2026-06-09", "2026-06-10"].map((fecha) => {
          const acts = filtradas.filter(a => a.fecha === fecha);
          if (acts.length === 0) return null;
          const esFutura = fecha > hoy;
          const esHoy = fecha === hoy;
          return (
            <div key={fecha}>
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={13} className="text-[var(--color-on-surface-variant)]" />
                <span className={`text-xs font-semibold ${esHoy ? "text-[var(--color-primary)]" : "text-[var(--color-on-surface-variant)]"}`}>
                  {esHoy ? "Hoy — " : esFutura ? "Próximo — " : "Anterior — "}{fecha}
                </span>
              </div>
              <div className="space-y-2">
                {acts.map((a) => (
                  <div
                    key={a.id}
                    className={`flex gap-4 bg-white rounded-xl border border-[var(--color-border-subtle)] p-4 ${a.completada ? "opacity-60" : ""}`}
                  >
                    {a.prioritaria && !a.completada && (
                      <div className="w-1 self-stretch bg-red-400 rounded-full shrink-0" />
                    )}
                    <div className={`p-2 rounded-full h-fit shrink-0 ${TIPO_COLOR[a.tipo]}`}>
                      {TIPO_ICON[a.tipo]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold">{a.tipo}</span>
                        <span className="text-[10px] text-[var(--color-on-surface-variant)]">{a.hora}</span>
                        {a.prioritaria && !a.completada && (
                          <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-medium">Prioritaria</span>
                        )}
                        {a.completada && (
                          <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5">
                            <CheckCircle2 size={10} /> Completada
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-medium mt-0.5">{a.empresa} · {a.contacto}</p>
                      <p className="text-[11px] text-[var(--color-on-surface-variant)] mt-0.5">{a.descripcion}</p>
                      <div className="flex gap-3 mt-1.5 text-[10px] text-[var(--color-on-surface-variant)]">
                        <Link href={`/crm/oportunidades/${a.opp}`} className="text-[var(--color-primary)] hover:underline">{a.opp}</Link>
                        <span>Vendedor: {a.vendedor}</span>
                      </div>
                    </div>
                    {!a.completada && (
                      <button className="text-[10px] border border-[var(--color-border-subtle)] px-3 py-1 rounded-lg hover:bg-[var(--color-surface-container)] transition-colors shrink-0 self-start text-[var(--color-on-surface-variant)]">
                        Completar
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {filtradas.length === 0 && (
          <div className="py-10 text-center text-sm text-[var(--color-on-surface-variant)] bg-white rounded-xl border border-[var(--color-border-subtle)]">
            No hay actividades para este filtro
          </div>
        )}
      </div>

      <div className="flex gap-4 text-xs">
        <Link href="/crm/agenda" className="text-[var(--color-primary)] hover:underline">Ver agenda</Link>
        <Link href="/dashboard/crm" className="text-[var(--color-primary)] hover:underline">← Dashboard CRM</Link>
      </div>
    </div>
  );
}
