"use client";

import { useState } from "react";
import { MessageSquare, Search, Plus, Filter, Circle } from "lucide-react";
import Link from "next/link";

const CONVERSACIONES = [
  {
    id: "CONV-001", tipo: "Orden", ref: "ORD-2026-122", titulo: "Orden NPK 8t — Grupo Agroindustrial",
    participantes: ["Mauricio Torres", "María Gómez"], ultimoMensaje: "Perfecto, confirmamos el despacho para el lunes.",
    fecha: "Hace 5 min", noLeidos: 2, estado: "Abierta", avatar: "MA",
  },
  {
    id: "CONV-002", tipo: "RFQ", ref: "RFQ-2024-112", titulo: "RFQ Fertilizantes complejos 10t",
    participantes: ["Grupo Agroindustrial S.A.", "DistAgroMax"], ultimoMensaje: "¿Pueden incluir análisis de suelo en la oferta?",
    fecha: "Hace 1 h", noLeidos: 1, estado: "Abierta", avatar: "GA",
  },
  {
    id: "CONV-003", tipo: "Logística", ref: "ORD-2026-098", titulo: "Coordinación despacho — Cooperativa Boyacá",
    participantes: ["Ricardo Ospina", "Almacén Bogotá", "Transportes Andes"], ultimoMensaje: "El camión llega a las 7am. Confirmen puerta de carga.",
    fecha: "Hace 3 h", noLeidos: 0, estado: "En seguimiento", avatar: "CO",
  },
  {
    id: "CONV-004", tipo: "Oportunidad", ref: "OPP-2026-031", titulo: "Negociación Palmas del Norte",
    participantes: ["Patricia Suárez", "María Gómez"], ultimoMensaje: "Revisamos el descuento por volumen. Le escribo mañana.",
    fecha: "Ayer", noLeidos: 0, estado: "Esperando respuesta", avatar: "PN",
  },
  {
    id: "CONV-005", tipo: "Técnica", ref: "CONS-2026-018", titulo: "Consulta técnica — fungicidas en palma",
    participantes: ["Patricia Suárez", "Asesor Juan Reyes"], ultimoMensaje: "Recomendamos aplicación preventiva cada 21 días.",
    fecha: "Ayer", noLeidos: 0, estado: "Resuelta", avatar: "JR",
  },
  {
    id: "CONV-006", tipo: "Reclamo", ref: "REC-2026-007", titulo: "Reclamo producto dañado — Tecnicaña",
    participantes: ["Carlos Herrera", "Soporte", "Logística"], ultimoMensaje: "Adjuntamos evidencia fotográfica del embalaje.",
    fecha: "Hace 2 días", noLeidos: 3, estado: "Abierta", avatar: "TC",
  },
  {
    id: "CONV-007", tipo: "Interna", ref: null, titulo: "Equipo comercial — Planificación junio",
    participantes: ["María Gómez", "Luis Pérez", "Carlos Díaz"], ultimoMensaje: "Meta del mes: $120,000. Prioridad: Palmas y Grupo Agro.",
    fecha: "Hace 2 días", noLeidos: 0, estado: "Abierta", avatar: "EC",
  },
  {
    id: "CONV-008", tipo: "Orden", ref: "ORD-2026-089", titulo: "Seguimiento entrega — AgroValle",
    participantes: ["Juliana Ríos", "Luis Pérez"], ultimoMensaje: "La entrega se realizó sin novedad. Gracias.",
    fecha: "Hace 4 días", noLeidos: 0, estado: "Cerrada", avatar: "AV",
  },
];

const TIPO_COLOR: Record<string, string> = {
  Orden: "bg-blue-100 text-blue-700",
  RFQ: "bg-violet-100 text-violet-700",
  Logística: "bg-orange-100 text-orange-700",
  Oportunidad: "bg-green-100 text-green-700",
  Técnica: "bg-sky-100 text-sky-700",
  Reclamo: "bg-red-100 text-red-700",
  Interna: "bg-slate-100 text-slate-600",
};

const ESTADO_DOT: Record<string, string> = {
  Abierta: "text-green-500",
  "En seguimiento": "text-blue-500",
  "Esperando respuesta": "text-amber-500",
  Resuelta: "text-slate-400",
  Cerrada: "text-slate-300",
};

const TIPOS = ["Todas", "Orden", "RFQ", "Logística", "Oportunidad", "Técnica", "Reclamo", "Interna"];

export default function MensajesPage() {
  const [busqueda, setBusqueda] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("Todas");

  const filtradas = CONVERSACIONES.filter((c) => {
    const coincide = c.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.ultimoMensaje.toLowerCase().includes(busqueda.toLowerCase());
    const tipoOk = tipoFiltro === "Todas" || c.tipo === tipoFiltro;
    return coincide && tipoOk;
  });

  const totalNoLeidos = CONVERSACIONES.reduce((s, c) => s + c.noLeidos, 0);

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-md font-bold flex items-center gap-2">
            <MessageSquare size={22} /> Mensajes
            {totalNoLeidos > 0 && (
              <span className="text-xs bg-[var(--color-primary)] text-white px-2 py-0.5 rounded-full font-bold">
                {totalNoLeidos}
              </span>
            )}
          </h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">
            {CONVERSACIONES.filter(c => c.estado === "Abierta").length} conversaciones abiertas
          </p>
        </div>
        <Link
          href="/mensajes/nueva"
          className="flex items-center gap-2 text-sm bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus size={15} /> Nueva
        </Link>
      </div>

      {/* Búsqueda */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]" />
          <input
            type="text"
            placeholder="Buscar conversaciones..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-20"
          />
        </div>
        <button className="flex items-center gap-2 text-sm border border-[var(--color-border-subtle)] px-4 py-2 rounded-lg hover:bg-[var(--color-surface-container)] transition-colors text-[var(--color-on-surface-variant)]">
          <Filter size={14} /> Filtrar
        </button>
      </div>

      {/* Tipos */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {TIPOS.map((t) => (
          <button
            key={t}
            onClick={() => setTipoFiltro(t)}
            className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              tipoFiltro === t
                ? "bg-[var(--color-primary)] text-white"
                : "border border-[var(--color-border-subtle)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Lista */}
      <div className="space-y-2">
        {filtradas.map((c) => (
          <Link
            key={c.id}
            href={`/mensajes/${c.id}`}
            className={`flex items-start gap-4 bg-white rounded-xl border p-4 hover:shadow-sm transition-all ${
              c.noLeidos > 0
                ? "border-[var(--color-primary)] border-opacity-30"
                : "border-[var(--color-border-subtle)]"
            }`}
          >
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] bg-opacity-10 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-[var(--color-primary)]">{c.avatar}</span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className={`text-sm ${c.noLeidos > 0 ? "font-bold" : "font-medium"} truncate`}>
                    {c.titulo}
                  </p>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${TIPO_COLOR[c.tipo]}`}>
                    {c.tipo}
                  </span>
                  {c.ref && (
                    <span className="text-[10px] text-[var(--color-on-surface-variant)]">{c.ref}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-[var(--color-on-surface-variant)]">{c.fecha}</span>
                  {c.noLeidos > 0 && (
                    <span className="text-[10px] bg-[var(--color-primary)] text-white w-5 h-5 rounded-full flex items-center justify-center font-bold">
                      {c.noLeidos}
                    </span>
                  )}
                </div>
              </div>
              <p className={`text-xs truncate ${c.noLeidos > 0 ? "text-[var(--color-on-surface)]" : "text-[var(--color-on-surface-variant)]"}`}>
                {c.ultimoMensaje}
              </p>
              <div className="flex items-center gap-3 mt-1.5">
                <span className={`flex items-center gap-1 text-[10px] font-medium ${ESTADO_DOT[c.estado]}`}>
                  <Circle size={7} className="fill-current" /> {c.estado}
                </span>
                <span className="text-[10px] text-[var(--color-on-surface-variant)]">
                  {c.participantes.length} participantes
                </span>
              </div>
            </div>
          </Link>
        ))}

        {filtradas.length === 0 && (
          <div className="py-12 text-center bg-white rounded-xl border border-[var(--color-border-subtle)]">
            <MessageSquare size={28} className="mx-auto text-[var(--color-border-subtle)] mb-2" />
            <p className="text-sm text-[var(--color-on-surface-variant)]">No hay conversaciones</p>
            <Link href="/mensajes/nueva" className="text-xs text-[var(--color-primary)] hover:underline mt-1 block">
              Iniciar una nueva conversación
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
