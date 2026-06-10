"use client";

import { useState } from "react";
import Link from "next/link";
import { Headphones, Clock, CheckCircle, AlertTriangle, User, MessageSquare } from "lucide-react";

const MOCK_TICKETS = [
  { id: "tkt-001", titulo: "Error en pago - tarjeta rechazada", usuario: "Carlos Comprador", email: "carlos@demo.com", tipo: "pago", prioridad: "alta", status: "abierto", fecha: "2026-06-10 09:15", mensajes: 3 },
  { id: "tkt-002", titulo: "Producto recibido en mal estado", usuario: "Finca La Esperanza", email: "finca@ejemplo.com", tipo: "reclamo", prioridad: "alta", status: "en_proceso", fecha: "2026-06-09 14:30", mensajes: 7 },
  { id: "tkt-003", titulo: "¿Cómo generar mi factura?", usuario: "Agropecuaria Boyacá SAS", email: "agro@boyaca.com", tipo: "consulta", prioridad: "baja", status: "resuelto", fecha: "2026-06-08 11:00", mensajes: 2 },
  { id: "tkt-004", titulo: "Retraso en entrega — guía SE-9876543", usuario: "AgroSoya del Meta", email: "soya@meta.co", tipo: "logistica", prioridad: "media", status: "abierto", fecha: "2026-06-10 08:45", mensajes: 1 },
  { id: "tkt-005", titulo: "Solicitud de devolución ORD-1031", usuario: "Frutas del Oriente", email: "frutas@oriente.co", tipo: "devolucion", prioridad: "media", status: "en_proceso", fecha: "2026-06-09 16:00", mensajes: 5 },
];

const PRIORIDAD_CFG = {
  alta: { label: "Alta", cls: "bg-red-100 text-red-700" },
  media: { label: "Media", cls: "bg-orange-100 text-orange-700" },
  baja: { label: "Baja", cls: "bg-gray-100 text-gray-600" },
};

const STATUS_CFG = {
  abierto: { label: "Abierto", icon: <AlertTriangle size={12} />, cls: "bg-yellow-100 text-yellow-700" },
  en_proceso: { label: "En proceso", icon: <Clock size={12} />, cls: "bg-blue-100 text-blue-700" },
  resuelto: { label: "Resuelto", icon: <CheckCircle size={12} />, cls: "bg-green-100 text-green-700" },
};

const TIPO_LABELS: Record<string, string> = {
  pago: "Pago", reclamo: "Reclamo", consulta: "Consulta", logistica: "Logística", devolucion: "Devolución",
};

export default function TicketsPage() {
  const [tickets] = useState(MOCK_TICKETS);
  const [filter, setFilter] = useState("todos");

  const filtered = filter === "todos" ? tickets : tickets.filter(t => t.status === filter);
  const pendientes = tickets.filter(t => t.status !== "resuelto").length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-headline-md font-bold">Cola de soporte</h1>
        <p className="text-sm text-[var(--color-on-surface-variant)]">{pendientes} tickets pendientes · {tickets.filter(t => t.prioridad === "alta").length} de alta prioridad</p>
      </div>

      <div className="flex gap-2">
        {["todos", "abierto", "en_proceso", "resuelto"].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === f ? "bg-[var(--color-primary)] text-white" : "bg-white border border-[var(--color-border-subtle)] text-[var(--color-on-surface-variant)]"}`}>
            {f === "todos" ? "Todos" : f === "en_proceso" ? "En proceso" : f.charAt(0).toUpperCase() + f.slice(1)}
            {f !== "todos" && ` (${tickets.filter(t => t.status === f).length})`}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(t => {
          const scfg = STATUS_CFG[t.status as keyof typeof STATUS_CFG];
          const pcfg = PRIORIDAD_CFG[t.prioridad as keyof typeof PRIORIDAD_CFG];
          return (
            <Link key={t.id} href={`/dashboard/soporte/tickets/${t.id}`} className="block bg-white border border-[var(--color-border-subtle)] rounded-xl p-4 hover:border-[var(--color-primary)]/40 hover:shadow-sm transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-9 h-9 bg-[var(--color-primary)]/8 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Headphones size={16} className="text-[var(--color-primary)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm">{t.titulo}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${pcfg.cls}`}>{pcfg.label}</span>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[var(--color-surface-container-low)] text-[var(--color-on-surface-variant)]">{TIPO_LABELS[t.tipo]}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-[var(--color-on-surface-variant)]">
                      <span className="flex items-center gap-1"><User size={10} /> {t.usuario}</span>
                      <span>{t.email}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${scfg.cls}`}>
                    {scfg.icon} {scfg.label}
                  </span>
                  <div className="flex items-center gap-3 text-xs text-[var(--color-on-surface-variant)]">
                    <span className="flex items-center gap-1"><MessageSquare size={10} /> {t.mensajes}</span>
                    <span>{t.fecha}</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
