"use client";

import { useState } from "react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Leaf, Clock, CheckCircle, Calendar } from "lucide-react";

const DIAGNOSTICS_QUEUE = [
  {
    id: "DIAG-2024-118", comprador: "Hernando Vargas", cultivo: "Tomate", pais: "CO", region: "Cundinamarca",
    problema: "Manchas amarillas en hojas + caída de flores", urgencia: "alta", fecha: "Hoy 07:30",
    fotos: ["foto1.jpg", "foto2.jpg"],
    descripcion: "El agricultor reporta manchas cloróticas en hojas jóvenes con borde amarillo y centro necrótico. Caída de flores reciente. Última lluvia hace 12 días.",
    expanded: false,
  },
  {
    id: "DIAG-2024-119", comprador: "Ana Bermúdez", cultivo: "Café", pais: "CO", region: "Huila",
    problema: "Roya severa en etapa de llenado de grano", urgencia: "alta", fecha: "Hoy 09:15",
    fotos: ["foto1.jpg"],
    descripcion: "Roya anaranjada (Hemileia vastatrix) con defoliación del 40% en lotes 3 y 4. El productor aplicó Mancozeb hace 21 días sin efecto.",
    expanded: false,
  },
  {
    id: "DIAG-2024-120", comprador: "Luis Patiño", cultivo: "Maíz", pais: "CO", region: "Meta",
    problema: "Deficiencia nutricional generalizada + bajo vigor", urgencia: "media", fecha: "Ayer 15:00",
    fotos: [],
    descripcion: "Plantas con crecimiento retardado, hojas pálidas con rayas amarillas. Análisis de suelo pendiente. Siembra hace 35 días.",
    expanded: false,
  },
];

const ACTIVE_PLANS = [
  { id: "PLAN-2024-088", comprador: "Finca San Isidro", cultivo: "Tomate", etapa: "Seguimiento — día 15/30", proxima_accion: "Visita de campo — 2026-06-12" },
  { id: "PLAN-2024-089", comprador: "Cooperativa La Unión", cultivo: "Papa", etapa: "Tratamiento — día 8/21", proxima_accion: "Revisión fotográfica — 2026-06-10" },
];

const AGENDA = [
  { hora: "09:00", tipo: "Diagnóstico", descripcion: "DIAG-2024-118 — Tomate Cundinamarca", color: "bg-red-100 border-red-300" },
  { hora: "11:00", tipo: "Visita de campo", descripcion: "PLAN-2024-088 — Finca San Isidro", color: "bg-blue-100 border-blue-300" },
  { hora: "14:00", tipo: "Consulta", descripcion: "DIAG-2024-119 — Café Huila", color: "bg-red-100 border-red-300" },
  { hora: "16:30", tipo: "Seguimiento", descripcion: "PLAN-2024-089 — Papa Nariño", color: "bg-green-100 border-green-300" },
];

export default function AsesorDashboard() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState<Record<string, { causa: string; productos: string; plan: string }>>({});

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-headline-md font-bold">Dashboard Asesor Agronómico</h1>
        <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">Ing. José Asesor · {new Date().toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" })}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Diagnósticos pendientes" value="3" subtitle="2 urgentes" icon={<Leaf size={20} />} color="red" />
        <StatsCard title="En proceso" value="2" subtitle="con respuesta enviada" icon={<Clock size={20} />} color="orange" />
        <StatsCard title="Completados este mes" value="18" subtitle="+6 vs mayo" icon={<CheckCircle size={20} />} color="green" trend={{ value: "+50%", up: true }} />
        <StatsCard title="Citas hoy" value="2" subtitle="campo + virtual" icon={<Calendar size={20} />} color="primary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cola de diagnósticos */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="font-semibold text-sm text-[var(--color-on-surface)]">Cola de diagnósticos</h2>
          {DIAGNOSTICS_QUEUE.map(d => {
            const isOpen = expanded[d.id];
            const fd = formData[d.id] ?? { causa: "", productos: "", plan: "" };
            return (
              <div key={d.id} className="bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
                <button
                  onClick={() => setExpanded(prev => ({ ...prev, [d.id]: !prev[d.id] }))}
                  className="w-full px-5 py-4 flex items-start justify-between gap-3 hover:bg-[var(--color-surface-container-lowest)] transition-colors text-left"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${d.urgencia === "alta" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {d.urgencia}
                      </span>
                      <span className="text-xs font-semibold">{d.id}</span>
                      <span className="text-xs text-[var(--color-on-surface-variant)]">{d.comprador}</span>
                      <span className="text-[10px] bg-[var(--color-surface-container)] px-1.5 py-0.5 rounded">{d.cultivo}</span>
                    </div>
                    <p className="text-xs mt-1 text-[var(--color-on-surface)]">{d.problema}</p>
                    <p className="text-[10px] text-[var(--color-on-surface-variant)] mt-0.5">{d.region}, {d.pais} · {d.fecha} · {d.fotos.length} foto(s)</p>
                  </div>
                  <span className="text-[var(--color-on-surface-variant)] text-lg">{isOpen ? "▲" : "▼"}</span>
                </button>
                {isOpen && (
                  <div className="border-t border-[var(--color-border-subtle)] px-5 py-4 space-y-4">
                    <div>
                      <p className="text-xs font-medium mb-1">Descripción del agricultor:</p>
                      <p className="text-xs text-[var(--color-on-surface-variant)] bg-[var(--color-surface-container-low)] p-3 rounded-lg">{d.descripcion}</p>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      <label className="text-xs font-medium">
                        Diagnóstico — Causa probable:
                        <textarea
                          className="w-full mt-1 p-2 text-xs border border-[var(--color-border-subtle)] rounded-lg resize-none focus:outline-none focus:border-[var(--color-primary)]"
                          rows={2} placeholder="Ej: Deficiencia de Magnesio + posible Alternaria..."
                          value={fd.causa}
                          onChange={e => setFormData(prev => ({ ...prev, [d.id]: { ...fd, causa: e.target.value } }))}
                        />
                      </label>
                      <label className="text-xs font-medium">
                        Productos recomendados (del catálogo):
                        <input
                          className="w-full mt-1 p-2 text-xs border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                          placeholder="Ej: Mancozeb 80% WP, Sulfato de Magnesio, Trichoderma..."
                          value={fd.productos}
                          onChange={e => setFormData(prev => ({ ...prev, [d.id]: { ...fd, productos: e.target.value } }))}
                        />
                      </label>
                      <label className="text-xs font-medium">
                        Plan técnico / indicaciones:
                        <textarea
                          className="w-full mt-1 p-2 text-xs border border-[var(--color-border-subtle)] rounded-lg resize-none focus:outline-none focus:border-[var(--color-primary)]"
                          rows={3} placeholder="Pasos de aplicación, dosis, frecuencia, condiciones..."
                          value={fd.plan}
                          onChange={e => setFormData(prev => ({ ...prev, [d.id]: { ...fd, plan: e.target.value } }))}
                        />
                      </label>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-xs bg-[var(--color-primary)] text-white px-4 py-1.5 rounded-lg font-medium hover:opacity-90">
                        Enviar diagnóstico al comprador
                      </button>
                      <button className="text-xs border border-[var(--color-border-subtle)] px-4 py-1.5 rounded-lg text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)]">
                        Solicitar visita de campo
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Agenda + Planes activos */}
        <div className="space-y-4">
          {/* Agenda hoy */}
          <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-4">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><Calendar size={14} /> Agenda de hoy</h3>
            <div className="space-y-2">
              {AGENDA.map(a => (
                <div key={a.hora} className={`flex gap-3 p-2.5 rounded-lg border ${a.color}`}>
                  <span className="text-[10px] font-mono font-bold shrink-0 pt-0.5">{a.hora}</span>
                  <div>
                    <p className="text-[10px] font-semibold uppercase text-[var(--color-on-surface-variant)]">{a.tipo}</p>
                    <p className="text-xs">{a.descripcion}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Planes activos */}
          <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-4">
            <h3 className="font-semibold text-sm mb-3">Planes en seguimiento</h3>
            <div className="space-y-3">
              {ACTIVE_PLANS.map(p => (
                <div key={p.id} className="p-3 rounded-lg border border-[var(--color-border-subtle)]">
                  <p className="text-xs font-medium">{p.comprador}</p>
                  <p className="text-[10px] text-[var(--color-on-surface-variant)] mt-0.5">{p.cultivo} · {p.id}</p>
                  <p className="text-[10px] mt-1 text-[var(--color-primary)]">{p.etapa}</p>
                  <p className="text-[10px] text-[var(--color-on-surface-variant)]">📅 {p.proxima_accion}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
