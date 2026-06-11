"use client";

import { useState } from "react";
import { Users, Plus, Search, ChevronRight, MapPin, Calendar, Weight, Clock } from "lucide-react";
import Link from "next/link";

const SOLICITUDES = [
  { id: "SFL-001", orden: "ORD-2026-122", empresa: "Grupo Agroindustrial S.A.", origen: "Bogotá", destino: "Valledupar", peso: "10 t", tipoCarga: "Agroquímicos clase 9", fechaRetiro: "2026-06-14", fechaEntrega: "2026-06-16", ofertas: 3, estado: "Ofertas recibidas", publicada: "2026-06-11" },
  { id: "SFL-002", orden: "ORD-2026-119", empresa: "Tecnicaña S.A.", origen: "Bogotá", destino: "Cali", peso: "5 t", tipoCarga: "Granel seco", fechaRetiro: "2026-06-15", fechaEntrega: "2026-06-16", ofertas: 1, estado: "Operadores invitados", publicada: "2026-06-10" },
  { id: "SFL-003", orden: "ORD-2026-115", empresa: "Cooperativa Boyacá Agro", origen: "Bogotá", destino: "Tunja", peso: "3 t", tipoCarga: "Paletizado", fechaRetiro: "2026-06-13", fechaEntrega: "2026-06-13", ofertas: 0, estado: "Publicada", publicada: "2026-06-11" },
  { id: "SFL-004", orden: "ORD-2026-108", empresa: "Palmas del Norte", origen: "Bogotá", destino: "Valledupar", peso: "18 t", tipoCarga: "Agroquímicos clase 9", fechaRetiro: "2026-06-10", fechaEntrega: "2026-06-11", ofertas: 4, estado: "Oferta seleccionada", publicada: "2026-06-08" },
  { id: "SFL-005", orden: "ORD-2026-099", empresa: "AgroValle S.A.S.", origen: "Medellín", destino: "Bucaramanga", peso: "6 t", tipoCarga: "Granel seco", fechaRetiro: "2026-06-05", fechaEntrega: "2026-06-06", ofertas: 2, estado: "Reservada", publicada: "2026-06-04" },
  { id: "SFL-006", orden: "ORD-2026-090", empresa: "Finca Las Palmas", origen: "Bogotá", destino: "Palmira", peso: "2 t", tipoCarga: "Paletizado", fechaRetiro: "2026-05-28", fechaEntrega: "2026-05-29", ofertas: 3, estado: "Entregada", publicada: "2026-05-27" },
];

const ESTADO_COLOR: Record<string, string> = {
  Borrador: "bg-slate-100 text-slate-600",
  Publicada: "bg-blue-100 text-blue-700",
  "Operadores invitados": "bg-sky-100 text-sky-700",
  "Ofertas recibidas": "bg-violet-100 text-violet-700",
  "En comparación": "bg-amber-100 text-amber-700",
  "Oferta seleccionada": "bg-orange-100 text-orange-700",
  Reservada: "bg-green-100 text-green-700",
  "En tránsito": "bg-blue-200 text-blue-800",
  Entregada: "bg-green-200 text-green-800",
  Cerrada: "bg-slate-200 text-slate-700",
  Cancelada: "bg-red-100 text-red-700",
};

const ESTADOS = ["Todas", "Publicada", "Ofertas recibidas", "Oferta seleccionada", "Reservada", "Entregada"];

export default function SolicitudesPage() {
  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("Todas");

  const filtradas = SOLICITUDES.filter((s) => {
    const coincide =
      s.empresa.toLowerCase().includes(busqueda.toLowerCase()) ||
      s.id.toLowerCase().includes(busqueda.toLowerCase()) ||
      s.destino.toLowerCase().includes(busqueda.toLowerCase());
    const estadoOk = estadoFiltro === "Todas" || s.estado === estadoFiltro;
    return coincide && estadoOk;
  });

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-md font-bold flex items-center gap-2">
            <Users size={22} /> Solicitudes de flete
          </h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">
            {SOLICITUDES.filter(s => ["Publicada", "Operadores invitados", "Ofertas recibidas"].includes(s.estado)).length} activas · {SOLICITUDES.length} total
          </p>
        </div>
        <Link
          href="/logistica/solicitudes/nueva"
          className="flex items-center gap-2 text-sm bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus size={15} /> Nueva solicitud
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]" />
          <input
            type="text"
            placeholder="Buscar por empresa, ID o destino..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-20"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {ESTADOS.map((e) => (
            <button
              key={e}
              onClick={() => setEstadoFiltro(e)}
              className={`text-xs px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${estadoFiltro === e ? "bg-[var(--color-primary)] text-white" : "border border-[var(--color-border-subtle)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)]"}`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Con ofertas pendientes", valor: SOLICITUDES.filter(s => s.estado === "Ofertas recibidas").length, color: "text-violet-600" },
          { label: "Sin ofertas aún", valor: SOLICITUDES.filter(s => ["Publicada", "Operadores invitados"].includes(s.estado)).length, color: "text-amber-600" },
          { label: "Reservadas", valor: SOLICITUDES.filter(s => s.estado === "Reservada").length, color: "text-green-600" },
          { label: "Cerradas este mes", valor: SOLICITUDES.filter(s => s.estado === "Entregada").length, color: "text-slate-500" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-4">
            <p className={`text-2xl font-bold ${s.color}`}>{s.valor}</p>
            <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Lista */}
      <div className="space-y-3">
        {filtradas.map((s) => (
          <Link
            key={s.id}
            href={`/logistica/solicitudes/${s.id}`}
            className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white rounded-xl border border-[var(--color-border-subtle)] p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <span className="font-bold text-sm font-mono">{s.id}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${ESTADO_COLOR[s.estado]}`}>{s.estado}</span>
                {s.ofertas > 0 && (
                  <span className="text-[10px] bg-[var(--color-primary)] bg-opacity-10 text-[var(--color-primary)] px-2 py-0.5 rounded-full font-medium">
                    {s.ofertas} oferta{s.ofertas !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
              <p className="text-xs font-medium">{s.empresa}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-[11px] text-[var(--color-on-surface-variant)]">
                <span className="flex items-center gap-1"><MapPin size={10} /> {s.origen} → {s.destino}</span>
                <span className="flex items-center gap-1"><Weight size={10} /> {s.peso}</span>
                <span className="flex items-center gap-1"><Calendar size={10} /> Retiro {s.fechaRetiro}</span>
                <span className="flex items-center gap-1"><Clock size={10} /> Entrega {s.fechaEntrega}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              {["Ofertas recibidas", "En comparación"].includes(s.estado) && (
                <Link
                  href={`/logistica/solicitudes/${s.id}/comparar`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs bg-[var(--color-primary)] text-white px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Comparar ofertas
                </Link>
              )}
              <ChevronRight size={16} className="text-[var(--color-on-surface-variant)]" />
            </div>
          </Link>
        ))}
        {filtradas.length === 0 && (
          <div className="py-10 text-center text-sm text-[var(--color-on-surface-variant)] bg-white rounded-xl border border-[var(--color-border-subtle)]">
            No hay solicitudes con ese filtro
          </div>
        )}
      </div>
    </div>
  );
}
