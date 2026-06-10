"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send, Clock, User, Package, AlertCircle, CheckCircle, Tag } from "lucide-react";

type TicketStatus = "abierto" | "en_progreso" | "esperando_usuario" | "resuelto" | "cerrado";
type Priority = "baja" | "media" | "alta" | "urgente";

interface Message { id: string; author: string; role: "usuario" | "soporte" | "sistema"; content: string; timestamp: string; }

const MOCK_TICKET = {
  id: "TKT-2026-0841",
  subject: "No puedo finalizar mi pedido — error en el pago con tarjeta Visa",
  status: "en_progreso" as TicketStatus,
  priority: "alta" as Priority,
  category: "Pagos",
  user: { name: "Carlos Comprador", email: "carlos@fincaelprogreso.com", company: "Finca El Progreso", country: "CO" },
  orderRef: "ORD-2026-4521",
  createdAt: "2026-06-08 14:32",
  updatedAt: "2026-06-09 09:15",
  assignedTo: "Ana Gómez (Soporte L2)",
  messages: [
    { id: "m1", author: "Carlos Comprador", role: "usuario" as const, content: "Hola, intenté realizar un pedido hace dos horas y al llegar al pago con tarjeta Visa, el sistema me devuelve un error genérico. El monto es de $1,450 USD y estoy seguro de que la tarjeta tiene fondos suficientes. Necesito urgentemente resolver esto porque el precio de los fertilizantes cambia mañana.", timestamp: "2026-06-08 14:32" },
    { id: "m2", author: "Sistema", role: "sistema" as const, content: "Ticket asignado automáticamente a: Ana Gómez (Soporte L2) — Categoría: Pagos / Alta prioridad", timestamp: "2026-06-08 14:33" },
    { id: "m3", author: "Ana Gómez", role: "soporte" as const, content: "Hola Carlos, gracias por contactarnos. Entendemos la urgencia. Hemos revisado el log de tu transacción y vemos que hubo un rechazo por el sistema antifraude de Stripe (código: card_declined_fraudulent_attempt). ¿Podrías confirmar si tienes habilitadas las compras internacionales en tu tarjeta? A veces los bancos colombianos bloquean transacciones en USD por defecto.", timestamp: "2026-06-08 15:10" },
    { id: "m4", author: "Carlos Comprador", role: "usuario" as const, content: "Acabo de llamar al banco y me confirmaron que la tarjeta sí tiene habilitadas las compras internacionales. Me dijeron que el banco no tiene ningún bloqueo por su parte.", timestamp: "2026-06-09 09:15" },
  ] as Message[],
};

const STATUS_CFG: Record<TicketStatus, { label: string; color: string }> = {
  abierto: { label: "Abierto", color: "bg-red-100 text-red-700" },
  en_progreso: { label: "En progreso", color: "bg-blue-100 text-blue-700" },
  esperando_usuario: { label: "Esperando usuario", color: "bg-yellow-100 text-yellow-700" },
  resuelto: { label: "Resuelto", color: "bg-green-100 text-green-700" },
  cerrado: { label: "Cerrado", color: "bg-gray-100 text-gray-600" },
};

const PRIORITY_CFG: Record<Priority, { label: string; color: string }> = {
  baja: { label: "Baja", color: "text-gray-500" },
  media: { label: "Media", color: "text-blue-500" },
  alta: { label: "Alta", color: "text-orange-500" },
  urgente: { label: "Urgente", color: "text-red-600" },
};

export default function TicketDetailPage() {
  const params = useParams();
  const [ticket, setTicket] = useState(MOCK_TICKET);
  const [reply, setReply] = useState("");
  const [notes, setNotes] = useState("");
  const [showNotes, setShowNotes] = useState(false);

  function sendReply() {
    if (!reply.trim()) return;
    const newMsg: Message = { id: `m${ticket.messages.length + 1}`, author: "Ana Gómez", role: "soporte", content: reply, timestamp: new Date().toLocaleString("es-CO") };
    setTicket(prev => ({ ...prev, messages: [...prev.messages, newMsg], status: "esperando_usuario", updatedAt: newMsg.timestamp }));
    setReply("");
  }

  function changeStatus(s: TicketStatus) { setTicket(prev => ({ ...prev, status: s })); }

  return (
    <div className="max-w-5xl space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/soporte" className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft size={16} /></Link>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-sm text-[var(--color-on-surface-variant)]">{ticket.id}</span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_CFG[ticket.status].color}`}>{STATUS_CFG[ticket.status].label}</span>
            <span className={`text-xs font-semibold ${PRIORITY_CFG[ticket.priority].color}`}>▲ {PRIORITY_CFG[ticket.priority].label}</span>
          </div>
          <h1 className="font-bold text-base mt-0.5 line-clamp-1">{ticket.subject}</h1>
        </div>
        <div className="flex gap-1">
          <select value={ticket.status} onChange={e => changeStatus(e.target.value as TicketStatus)} className="text-sm border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 outline-none">
            {Object.entries(STATUS_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-[var(--color-border-subtle)] text-sm font-semibold">Conversación</div>
            <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
              {ticket.messages.map(msg => (
                <div key={msg.id} className={`${msg.role === "sistema" ? "text-center" : ""}`}>
                  {msg.role === "sistema" ? (
                    <div className="inline-flex items-center gap-1 bg-[var(--color-surface-container-low)] text-xs text-[var(--color-on-surface-variant)] px-3 py-1 rounded-full">{msg.content}</div>
                  ) : (
                    <div className={`flex gap-3 ${msg.role === "soporte" ? "flex-row-reverse" : ""}`}>
                      <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${msg.role === "soporte" ? "bg-[var(--color-primary)] text-white" : "bg-gray-200 text-gray-600"}`}>{msg.author.slice(0, 1)}</div>
                      <div className={`max-w-[75%] ${msg.role === "soporte" ? "items-end" : ""} flex flex-col gap-0.5`}>
                        <div className={`rounded-2xl px-4 py-2.5 text-sm ${msg.role === "soporte" ? "bg-[var(--color-primary)] text-white rounded-tr-none" : "bg-[var(--color-surface-container-low)] rounded-tl-none"}`}>{msg.content}</div>
                        <p className="text-xs text-[var(--color-on-surface-variant)] px-1">{msg.author} · {msg.timestamp}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-[var(--color-border-subtle)]">
              <div className="flex gap-2">
                <textarea value={reply} onChange={e => setReply(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) sendReply(); }} rows={3} placeholder="Escribe tu respuesta... (Ctrl+Enter para enviar)" className="flex-1 border border-[var(--color-border-subtle)] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] resize-none" />
                <button onClick={sendReply} disabled={!reply.trim()} className="self-end p-2.5 bg-[var(--color-primary)] text-white rounded-xl hover:opacity-90 disabled:opacity-50"><Send size={16} /></button>
              </div>
              <div className="flex gap-2 mt-2">
                <button onClick={() => changeStatus("esperando_usuario")} className="text-xs border border-[var(--color-border-subtle)] px-2.5 py-1 rounded-lg hover:bg-gray-50">Marcar: Esperando usuario</button>
                <button onClick={() => changeStatus("resuelto")} className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-lg hover:bg-green-200">Marcar como resuelto</button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4 space-y-3">
            <h3 className="font-semibold text-sm flex items-center gap-1.5"><User size={14} className="text-[var(--color-primary)]" /> Usuario</h3>
            <div className="space-y-1.5">
              <p className="text-sm font-medium">{ticket.user.name}</p>
              <p className="text-xs text-[var(--color-on-surface-variant)]">{ticket.user.email}</p>
              <p className="text-xs text-[var(--color-on-surface-variant)]">{ticket.user.company} · {ticket.user.country}</p>
            </div>
          </div>

          <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4 space-y-3">
            <h3 className="font-semibold text-sm flex items-center gap-1.5"><AlertCircle size={14} className="text-[var(--color-primary)]" /> Detalles del ticket</h3>
            {[{ label: "Categoría", value: ticket.category, icon: <Tag size={11} /> }, { label: "Prioridad", value: PRIORITY_CFG[ticket.priority].label, icon: <AlertCircle size={11} /> }, { label: "Orden relacionada", value: ticket.orderRef, icon: <Package size={11} /> }, { label: "Asignado a", value: ticket.assignedTo, icon: <User size={11} /> }, { label: "Creado", value: ticket.createdAt, icon: <Clock size={11} /> }, { label: "Actualizado", value: ticket.updatedAt, icon: <Clock size={11} /> }].map(d => (
              <div key={d.label} className="flex items-start justify-between gap-2">
                <span className="text-xs text-[var(--color-on-surface-variant)] flex items-center gap-1">{d.icon} {d.label}</span>
                <span className="text-xs font-medium text-right">{d.value}</span>
              </div>
            ))}
          </div>

          <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between"><h3 className="font-semibold text-sm">Notas internas</h3><button onClick={() => setShowNotes(!showNotes)} className="text-xs text-[var(--color-primary)]">{showNotes ? "Ocultar" : "Mostrar"}</button></div>
            {showNotes && (<><textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Notas solo visibles para el equipo de soporte..." className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)] resize-none" /><button className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-200 flex items-center gap-1"><CheckCircle size={11} /> Guardar nota</button></>)}
          </div>
        </div>
      </div>
    </div>
  );
}
