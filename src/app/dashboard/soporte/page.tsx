"use client";

import { useState } from "react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Headphones, Clock, CheckCircle, AlertTriangle } from "lucide-react";

const TICKETS = [
  { id: "TKT-2024-401", titulo: "Producto llegó dañado — Urea Granulada", tipo: "reclamo", prioridad: "alta", comprador: "Hernando Vargas", orden: "ORD-2024-088", sla: "2h restantes", estado: "abierto" },
  { id: "TKT-2024-402", titulo: "Error en factura electrónica — IVA mal calculado", tipo: "consulta", prioridad: "media", comprador: "Agro La Sabana", orden: "ORD-2024-089", sla: "4h restantes", estado: "en_atencion" },
  { id: "TKT-2024-403", titulo: "Solicitud devolución — Herbicida producto equivocado", tipo: "garantia", prioridad: "alta", comprador: "Cooperativa Boyacá", orden: "ORD-2024-090", sla: "¡Vencido!", estado: "abierto" },
  { id: "TKT-2024-404", titulo: "Consulta técnica aplicación Trichoderma", tipo: "tecnico", prioridad: "baja", comprador: "Finca El Roble", orden: "—", sla: "12h restantes", estado: "abierto" },
  { id: "TKT-2024-405", titulo: "Problema acceso a cuenta corporativa", tipo: "consulta", prioridad: "media", comprador: "Grupo Agroindustrial", orden: "—", sla: "6h restantes", estado: "abierto" },
];

const TICKET_HISTORY = [
  { hora: "09:15", autor: "Hernando Vargas (comprador)", mensaje: "El pedido llegó con 2 sacos perforados. Adjunto fotos del daño." },
  { hora: "09:45", autor: "Sistema", mensaje: "Ticket asignado a Soporte. SLA: 4 horas." },
  { hora: "10:20", autor: "Agente Soporte", mensaje: "Hola Hernando, lamentamos el inconveniente. Hemos contactado al transportista TCC para investigar. ¿Puede confirmar el número de guía?" },
  { hora: "10:45", autor: "Hernando Vargas (comprador)", mensaje: "Sí, guía TCC-884421. Los sacos dañados son lote B-2024-112." },
];

const SLA_COLOR: Record<string, string> = {
  "¡Vencido!": "text-red-600 font-bold bg-red-50",
  default: "text-[var(--color-on-surface-variant)]",
};

const PRIORITY_COLOR: Record<string, string> = {
  alta: "bg-red-100 text-red-700",
  media: "bg-yellow-100 text-yellow-700",
  baja: "bg-green-100 text-green-700",
  critica: "bg-red-200 text-red-900",
};

const TYPE_ICON: Record<string, string> = {
  reclamo: "📦", consulta: "💬", garantia: "🔄", tecnico: "🌿",
};

export default function SoporteDashboard() {
  const [activeTicket, setActiveTicket] = useState<string | null>("TKT-2024-401");
  const [reply, setReply] = useState("");

  const ticket = TICKETS.find(t => t.id === activeTicket);

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-headline-md font-bold">Dashboard Atención al Cliente</h1>
        <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">Cola de soporte — SLA activo</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Tickets abiertos" value="18" icon={<Headphones size={20} />} color="primary" />
        <StatsCard title="En riesgo SLA" value="3" subtitle="1 vencido" icon={<AlertTriangle size={20} />} color="red" />
        <StatsCard title="Resueltos hoy" value="12" icon={<CheckCircle size={20} />} color="green" trend={{ value: "+4", up: true }} />
        <StatsCard title="Tiempo promedio" value="4.2h" subtitle="meta: 4h" icon={<Clock size={20} />} color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 min-h-[500px]">
        {/* Cola de tickets */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-[var(--color-border-subtle)]">
            <h2 className="font-semibold text-sm">Cola de tickets</h2>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-[var(--color-border-subtle)]">
            {TICKETS.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTicket(t.id)}
                className={`w-full text-left px-4 py-3 hover:bg-[var(--color-surface-container-lowest)] transition-colors ${activeTicket === t.id ? "bg-[var(--color-primary)]/5 border-l-2 border-[var(--color-primary)]" : ""}`}
              >
                <div className="flex items-start gap-2">
                  <span className="text-base mt-0.5">{TYPE_ICON[t.tipo]}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{t.titulo}</p>
                    <p className="text-[10px] text-[var(--color-on-surface-variant)] mt-0.5">{t.id} · {t.comprador}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${PRIORITY_COLOR[t.prioridad]}`}>{t.prioridad}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${t.sla === "¡Vencido!" ? "bg-red-100 text-red-700 font-bold" : "text-[var(--color-on-surface-variant)]"}`}>
                        ⏱ {t.sla}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Detalle del ticket */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden flex flex-col">
          {ticket ? (
            <>
              <div className="px-5 py-4 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-container-low)]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-[var(--color-primary)]">{ticket.id}</p>
                    <p className="text-sm font-semibold mt-0.5">{ticket.titulo}</p>
                    <div className="flex flex-wrap gap-2 mt-1.5">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${PRIORITY_COLOR[ticket.prioridad]}`}>{ticket.prioridad}</span>
                      <span className="text-[10px] bg-[var(--color-surface-container)] px-2 py-0.5 rounded-full">{ticket.tipo}</span>
                      <span className="text-[10px] text-[var(--color-on-surface-variant)]">Comprador: {ticket.comprador}</span>
                      {ticket.orden !== "—" && <span className="text-[10px] text-[var(--color-on-surface-variant)]">Orden: {ticket.orden}</span>}
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button className="text-[10px] bg-green-600 text-white px-2 py-1 rounded font-medium">Resolver</button>
                    <button className="text-[10px] bg-orange-500 text-white px-2 py-1 rounded font-medium">Escalar</button>
                    <button className="text-[10px] border border-[var(--color-border-subtle)] px-2 py-1 rounded text-[var(--color-on-surface-variant)]">Reembolso</button>
                    <button className="text-[10px] border border-[var(--color-border-subtle)] px-2 py-1 rounded text-[var(--color-on-surface-variant)]">Devolución</button>
                  </div>
                </div>
              </div>

              {/* Historial */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {TICKET_HISTORY.map(h => (
                  <div key={h.hora} className={`${h.autor === "Sistema" ? "text-center" : ""}`}>
                    {h.autor === "Sistema" ? (
                      <p className="text-[10px] text-[var(--color-on-surface-variant)] bg-[var(--color-surface-container)] px-3 py-1 rounded-full inline-block">{h.mensaje}</p>
                    ) : (
                      <div className={`max-w-[85%] ${h.autor.includes("(comprador)") ? "" : "ml-auto"}`}>
                        <p className="text-[10px] font-semibold text-[var(--color-on-surface-variant)] mb-1">{h.autor} · {h.hora}</p>
                        <div className={`p-3 rounded-xl text-xs ${h.autor.includes("(comprador)") ? "bg-[var(--color-surface-container-low)]" : "bg-[var(--color-primary)] text-white"}`}>
                          {h.mensaje}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Reply */}
              <div className="p-4 border-t border-[var(--color-border-subtle)]">
                <div className="flex gap-2">
                  <textarea
                    className="flex-1 p-2 text-xs border border-[var(--color-border-subtle)] rounded-lg resize-none focus:outline-none focus:border-[var(--color-primary)]"
                    rows={2}
                    placeholder="Escribe tu respuesta al comprador..."
                    value={reply}
                    onChange={e => setReply(e.target.value)}
                  />
                  <button className="text-xs bg-[var(--color-primary)] text-white px-4 rounded-lg font-medium hover:opacity-90 shrink-0">
                    Enviar
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-[var(--color-on-surface-variant)] text-sm">
              Selecciona un ticket de la cola
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
