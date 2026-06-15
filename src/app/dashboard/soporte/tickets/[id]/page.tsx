"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send, Clock, User, Package, AlertCircle, CheckCircle, Tag, Lock } from "lucide-react";

type TicketStatus = "abierto" | "en_atencion" | "resuelto" | "cerrado";
type TicketPriority = "baja" | "media" | "alta" | "critica";
type TicketType = "consulta" | "reclamo" | "garantia" | "tecnico";

interface TicketMessage {
  id: string;
  authorId: string;
  content: string;
  isInternal: boolean;
  createdAt: string;
}

interface TicketDetail {
  id: string;
  subject: string;
  type: TicketType;
  status: TicketStatus;
  priority: TicketPriority;
  slaHours: number;
  resolvedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  buyerId: string;
  orderId?: string | null;
  buyer: {
    email: string;
    profile?: { firstName: string; lastName: string; phone?: string | null } | null;
  };
  assignedTo?: {
    profile?: { firstName: string; lastName: string } | null;
  } | null;
  order?: { id: string; status: string; totalAmount: number } | null;
  messages: TicketMessage[];
}

const STATUS_CFG: Record<TicketStatus, { label: string; color: string }> = {
  abierto:     { label: "Abierto",     color: "bg-red-100 text-red-700" },
  en_atencion: { label: "En atención", color: "bg-blue-100 text-blue-700" },
  resuelto:    { label: "Resuelto",    color: "bg-green-100 text-green-700" },
  cerrado:     { label: "Cerrado",     color: "bg-gray-100 text-gray-600" },
};

const PRIORITY_CFG: Record<TicketPriority, { label: string; color: string }> = {
  baja:    { label: "Baja",    color: "text-gray-500" },
  media:   { label: "Media",   color: "text-blue-500" },
  alta:    { label: "Alta",    color: "text-orange-500" },
  critica: { label: "Crítica", color: "text-red-600" },
};

const TYPE_LABEL: Record<TicketType, string> = {
  consulta:  "Consulta",
  reclamo:   "Reclamo",
  garantia:  "Garantía",
  tecnico:   "Soporte técnico",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("es-CO", { dateStyle: "short", timeStyle: "short" });
}

export default function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [sending, setSending] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    if (!id) return;
    fetch(`/api/soporte/tickets/${id}`)
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(data => { setTicket(data); })
      .catch(() => setError("No se pudo cargar el ticket."))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => { scrollToBottom(); }, [ticket?.messages.length]);

  async function sendReply() {
    if (!reply.trim() || !ticket) return;
    setSending(true);
    try {
      const res = await fetch(`/api/soporte/tickets/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: reply, isInternal }),
      });
      if (res.ok) {
        // Reload ticket to get the new message
        const updated = await fetch(`/api/soporte/tickets/${id}`).then(r => r.json());
        setTicket(updated);
        setReply("");
      }
    } finally {
      setSending(false);
    }
  }

  async function changeStatus(s: TicketStatus) {
    if (!ticket) return;
    setTicket(prev => prev ? { ...prev, status: s } : prev);
    await fetch(`/api/soporte/tickets/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: s }),
    });
  }

  if (loading) {
    return (
      <div className="max-w-5xl py-16 text-center text-[var(--color-on-surface-variant)]">
        <AlertCircle size={32} className="mx-auto mb-2 opacity-30 animate-pulse" />
        <p className="text-sm">Cargando ticket...</p>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="max-w-5xl py-16 text-center">
        <AlertCircle size={32} className="mx-auto mb-2 text-red-400" />
        <p className="text-sm font-medium">{error ?? "Ticket no encontrado"}</p>
        <Link href="/dashboard/soporte" className="mt-4 inline-block text-sm text-[var(--color-primary)] hover:underline">
          ← Volver a soporte
        </Link>
      </div>
    );
  }

  const buyerName = ticket.buyer.profile
    ? `${ticket.buyer.profile.firstName} ${ticket.buyer.profile.lastName}`.trim() || ticket.buyer.email
    : ticket.buyer.email;

  const agentName = ticket.assignedTo?.profile
    ? `${ticket.assignedTo.profile.firstName} ${ticket.assignedTo.profile.lastName}`.trim()
    : "Sin asignar";

  const statusCfg = STATUS_CFG[ticket.status];
  const priorityCfg = PRIORITY_CFG[ticket.priority];

  return (
    <div className="max-w-5xl space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard/soporte" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={16} />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-sm text-[var(--color-on-surface-variant)]">{ticket.id.slice(0, 16)}…</span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusCfg.color}`}>{statusCfg.label}</span>
            <span className={`text-xs font-semibold ${priorityCfg.color}`}>▲ {priorityCfg.label}</span>
            <span className="text-xs text-[var(--color-on-surface-variant)]">{TYPE_LABEL[ticket.type]}</span>
          </div>
          <h1 className="font-bold text-base mt-0.5 line-clamp-1">{ticket.subject}</h1>
        </div>
        <select
          value={ticket.status}
          onChange={e => changeStatus(e.target.value as TicketStatus)}
          className="text-sm border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 outline-none"
        >
          {Object.entries(STATUS_CFG).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Conversación */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-[var(--color-border-subtle)] text-sm font-semibold flex items-center justify-between">
              <span>Conversación</span>
              <span className="text-[11px] text-[var(--color-on-surface-variant)] font-normal">
                {ticket.messages.length} mensaje{ticket.messages.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
              {ticket.messages.length === 0 && (
                <p className="text-center text-sm text-[var(--color-on-surface-variant)] py-8">Sin mensajes aún</p>
              )}
              {ticket.messages.map(msg => {
                const isBuyer = msg.authorId === ticket.buyerId;

                if (msg.isInternal) {
                  return (
                    <div key={msg.id} className="flex justify-center">
                      <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 text-xs px-3 py-1.5 rounded-full border border-amber-200">
                        <Lock size={10} /> Nota interna · {formatDate(msg.createdAt)}
                        <span className="ml-1 font-normal text-amber-600">{msg.content}</span>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={msg.id} className={`flex gap-3 ${!isBuyer ? "flex-row-reverse" : ""}`}>
                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${!isBuyer ? "bg-[var(--color-primary)] text-white" : "bg-gray-200 text-gray-600"}`}>
                      {isBuyer ? buyerName.charAt(0).toUpperCase() : "S"}
                    </div>
                    <div className={`max-w-[75%] flex flex-col gap-0.5 ${!isBuyer ? "items-end" : ""}`}>
                      <div className={`rounded-2xl px-4 py-2.5 text-sm ${!isBuyer ? "bg-[var(--color-primary)] text-white rounded-tr-none" : "bg-[var(--color-surface-container-low)] rounded-tl-none"}`}>
                        {msg.content}
                      </div>
                      <p className="text-xs text-[var(--color-on-surface-variant)] px-1">
                        {isBuyer ? buyerName : agentName} · {formatDate(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Reply box */}
            <div className="p-4 border-t border-[var(--color-border-subtle)]">
              <div className="flex gap-2">
                <textarea
                  value={reply}
                  onChange={e => setReply(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) sendReply(); }}
                  rows={3}
                  placeholder="Escribe tu respuesta… (Ctrl+Enter para enviar)"
                  className="flex-1 border border-[var(--color-border-subtle)] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] resize-none"
                />
                <button
                  onClick={sendReply}
                  disabled={!reply.trim() || sending}
                  className="self-end p-2.5 bg-[var(--color-primary)] text-white rounded-xl hover:opacity-90 disabled:opacity-50"
                >
                  <Send size={16} />
                </button>
              </div>
              <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
                <label className="flex items-center gap-1.5 text-xs cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isInternal}
                    onChange={e => setIsInternal(e.target.checked)}
                    className="rounded"
                  />
                  <Lock size={10} className="text-amber-500" />
                  <span className="text-amber-600">Nota interna (no visible al cliente)</span>
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => changeStatus("en_atencion")}
                    className="text-xs border border-[var(--color-border-subtle)] px-2.5 py-1 rounded-lg hover:bg-gray-50"
                  >
                    En atención
                  </button>
                  <button
                    onClick={() => changeStatus("resuelto")}
                    className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-lg hover:bg-green-200"
                  >
                    Marcar resuelto
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Usuario */}
          <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4 space-y-3">
            <h3 className="font-semibold text-sm flex items-center gap-1.5">
              <User size={14} className="text-[var(--color-primary)]" /> Usuario
            </h3>
            <div className="space-y-1.5 text-sm">
              <p className="font-medium">{buyerName}</p>
              <p className="text-xs text-[var(--color-on-surface-variant)]">{ticket.buyer.email}</p>
              {ticket.buyer.profile?.phone && (
                <p className="text-xs text-[var(--color-on-surface-variant)]">{ticket.buyer.profile.phone}</p>
              )}
            </div>
          </div>

          {/* Detalles */}
          <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4 space-y-3">
            <h3 className="font-semibold text-sm flex items-center gap-1.5">
              <AlertCircle size={14} className="text-[var(--color-primary)]" /> Detalles
            </h3>
            {[
              { label: "Tipo",       value: TYPE_LABEL[ticket.type],             icon: <Tag size={11} /> },
              { label: "Prioridad",  value: priorityCfg.label,                   icon: <AlertCircle size={11} /> },
              { label: "SLA",        value: `${ticket.slaHours}h`,               icon: <Clock size={11} /> },
              ...(ticket.orderId ? [{ label: "Orden", value: ticket.orderId.slice(0, 16) + "…", icon: <Package size={11} /> }] : []),
              { label: "Asignado a", value: agentName,                           icon: <User size={11} /> },
              { label: "Creado",     value: formatDate(ticket.createdAt),         icon: <Clock size={11} /> },
              { label: "Actualizado",value: formatDate(ticket.updatedAt),         icon: <Clock size={11} /> },
              ...(ticket.resolvedAt ? [{ label: "Resuelto", value: formatDate(ticket.resolvedAt), icon: <CheckCircle size={11} /> }] : []),
            ].map(d => (
              <div key={d.label} className="flex items-start justify-between gap-2">
                <span className="text-xs text-[var(--color-on-surface-variant)] flex items-center gap-1 shrink-0">
                  {d.icon} {d.label}
                </span>
                <span className="text-xs font-medium text-right break-all">{d.value}</span>
              </div>
            ))}
          </div>

          {/* Orden relacionada */}
          {ticket.order && (
            <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4 space-y-2">
              <h3 className="font-semibold text-sm flex items-center gap-1.5">
                <Package size={14} className="text-[var(--color-primary)]" /> Orden relacionada
              </h3>
              <p className="text-xs font-mono text-[var(--color-on-surface-variant)]">{ticket.order.id.slice(0, 16)}…</p>
              <p className="text-xs">Estado: <span className="font-medium capitalize">{ticket.order.status}</span></p>
              <p className="text-xs">Total: <span className="font-bold text-[var(--color-primary)]">${ticket.order.totalAmount.toLocaleString("es-CO")}</span></p>
              <Link href={`/ordenes/${ticket.order.id}`} className="text-xs text-[var(--color-primary)] hover:underline">
                Ver orden →
              </Link>
            </div>
          )}

          {/* Notas internas toggle */}
          <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm flex items-center gap-1.5">
                <Lock size={12} className="text-amber-500" /> Notas internas
              </h3>
              <button onClick={() => setShowNotes(!showNotes)} className="text-xs text-[var(--color-primary)]">
                {showNotes ? "Ocultar" : "Mostrar"}
              </button>
            </div>
            {showNotes && (
              <div className="space-y-2">
                {ticket.messages.filter(m => m.isInternal).length === 0 ? (
                  <p className="text-xs text-[var(--color-on-surface-variant)]">Sin notas internas</p>
                ) : (
                  ticket.messages.filter(m => m.isInternal).map(m => (
                    <div key={m.id} className="text-xs bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                      <p className="text-amber-700">{m.content}</p>
                      <p className="text-amber-500 mt-1">{formatDate(m.createdAt)}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
