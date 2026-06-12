"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell, Package, Shield, DollarSign, Truck, AlertTriangle,
  CheckCircle, MessageSquare, ChevronRight, Settings, Trash2
} from "lucide-react";

type NotifType = "orden" | "regulatorio" | "pago" | "logistica" | "sistema" | "mensaje";

interface Notif {
  id: string;
  tipo: NotifType;
  titulo: string;
  descripcion: string;
  fecha: string;
  leida: boolean;
  href?: string;
}

const MOCK_NOTIFS: Notif[] = [
  { id: "n1", tipo: "orden", titulo: "Nuevo pedido recibido", descripcion: "Finca La Esperanza realizó el pedido #ORD-1042 por $340.000 COP.", fecha: "Hace 5 min", leida: false, href: "/dashboard/vendedor/ordenes" },
  { id: "n2", tipo: "regulatorio", titulo: "Documento próximo a vencer", descripcion: "El Registro ICA de Glifosato 480 SL vence en 35 días. Inicia la renovación.", fecha: "Hace 1 h", leida: false, href: "/dashboard/regulatorio/documentos" },
  { id: "n3", tipo: "pago", titulo: "Liquidación #LIQ-087 procesada", descripcion: "Se acreditaron $16.693.560 COP a tu cuenta. Revisa el detalle.", fecha: "Hace 3 h", leida: false, href: "/dashboard/finanzas/liquidaciones" },
  { id: "n4", tipo: "logistica", titulo: "Envío entregado — ORD-1039", descripcion: "Coordinadora confirmó la entrega a Agropecuaria Boyacá SAS. Guía: CO-4567890.", fecha: "Hace 5 h", leida: true, href: "/dashboard/logistica/despachos" },
  { id: "n5", tipo: "mensaje", titulo: "Nueva consulta en soporte", descripcion: "Carlos Comprador preguntó sobre el tiempo de entrega del pedido ORD-1042.", fecha: "Ayer 14:30", leida: true, href: "/dashboard/soporte/tickets" },
  { id: "n6", tipo: "sistema", titulo: "Mantenimiento programado", descripcion: "El sistema estará en mantenimiento el sábado 13 de junio de 02:00 a 04:00 AM.", fecha: "Ayer 09:00", leida: true },
  { id: "n7", tipo: "orden", titulo: "RFQ recibido de AgroSoya", descripcion: "Solicitud de cotización para 500 kg de Trichoderma WP y 200 lt de Abamectina.", fecha: "Hace 2 días", leida: true, href: "/dashboard/vendedor/rfq" },
  { id: "n8", tipo: "regulatorio", titulo: "Documento aprobado", descripcion: "El Certificado SENASICA de Mancozeb 80% WP fue aprobado por el equipo regulatorio.", fecha: "Hace 3 días", leida: true, href: "/dashboard/regulatorio/documentos" },
  { id: "n9", tipo: "pago", titulo: "Pago rechazado — ORD-1040", descripcion: "La transacción PSE TXN-2026-4519 fue rechazada. El cliente fue notificado.", fecha: "Hace 3 días", leida: true, href: "/dashboard/finanzas/pagos" },
  { id: "n10", tipo: "logistica", titulo: "Incidencia reportada", descripcion: "Envia reportó rechazo en destino para ORD-1031. Se requiere acción.", fecha: "Hace 4 días", leida: true, href: "/dashboard/logistica/incidencias" },
];

const TIPO_CFG: Record<NotifType, { icon: React.ReactNode; bg: string; iconColor: string }> = {
  orden:       { icon: <Package size={16} />,     bg: "bg-blue-100",   iconColor: "text-blue-600" },
  regulatorio: { icon: <Shield size={16} />,      bg: "bg-purple-100", iconColor: "text-purple-600" },
  pago:        { icon: <DollarSign size={16} />,  bg: "bg-green-100",  iconColor: "text-green-600" },
  logistica:   { icon: <Truck size={16} />,       bg: "bg-orange-100", iconColor: "text-orange-600" },
  sistema:     { icon: <Bell size={16} />,        bg: "bg-gray-100",   iconColor: "text-gray-600" },
  mensaje:     { icon: <MessageSquare size={16} />, bg: "bg-yellow-100", iconColor: "text-yellow-600" },
};

const TIPO_LABELS: Record<NotifType, string> = {
  orden: "Órdenes", regulatorio: "Regulatorio", pago: "Pagos",
  logistica: "Logística", sistema: "Sistema", mensaje: "Mensajes",
};

export default function NotificacionesPage() {
  const [notifs, setNotifs] = useState<Notif[]>(MOCK_NOTIFS);
  const [filter, setFilter] = useState<"todas" | NotifType>("todas");

  const unread = notifs.filter(n => !n.leida).length;

  const filtered = filter === "todas"
    ? notifs
    : notifs.filter(n => n.tipo === filter);

  function markAllRead() {
    setNotifs(prev => prev.map(n => ({ ...n, leida: true })));
  }

  function markRead(id: string) {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, leida: true } : n));
  }

  function deleteNotif(id: string) {
    setNotifs(prev => prev.filter(n => n.id !== id));
  }

  return (
    <div className="min-h-screen bg-[var(--color-background-alt)]">
      <div className="container-max py-8 max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-on-surface)] flex items-center gap-2.5">
              <Bell size={22} className="text-[var(--color-primary)]" />
              Notificaciones
              {unread > 0 && (
                <span className="text-sm font-semibold bg-[var(--color-secondary)] text-white px-2.5 py-0.5 rounded-full">
                  {unread} nuevas
                </span>
              )}
            </h1>
            <p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">{notifs.length} notificaciones en total</p>
          </div>
          <div className="flex items-center gap-2">
            {unread > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-primary)] hover:underline"
              >
                <CheckCircle size={13} /> Marcar todo leído
              </button>
            )}
            <Link href="/dashboard" className="p-2 hover:bg-white rounded-lg transition-colors text-[var(--color-on-surface-variant)]">
              <Settings size={16} />
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap mb-5">
          {(["todas", "orden", "regulatorio", "pago", "logistica", "mensaje", "sistema"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                filter === f
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-white border border-[var(--color-border-subtle)] text-[var(--color-on-surface-variant)] hover:border-[var(--color-primary)]/40"
              }`}
            >
              {f === "todas" ? "Todas" : TIPO_LABELS[f]}
              {f !== "todas" && (
                <span className="ml-1 opacity-70">({notifs.filter(n => n.tipo === f).length})</span>
              )}
            </button>
          ))}
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="bg-white border border-[var(--color-border-subtle)] rounded-2xl p-12 text-center">
            <Bell size={32} className="text-[var(--color-border-subtle)] mx-auto mb-3" />
            <p className="text-sm font-medium text-[var(--color-on-surface-variant)]">Sin notificaciones en esta categoría</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(notif => {
              const cfg = TIPO_CFG[notif.tipo];
              const Inner = (
                <div className={`flex items-start gap-3.5 flex-1 min-w-0`}>
                  {/* Icon */}
                  <div className={`w-10 h-10 ${cfg.bg} ${cfg.iconColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    {cfg.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm leading-snug ${notif.leida ? "font-normal text-[var(--color-on-surface-variant)]" : "font-semibold text-[var(--color-on-surface)]"}`}>
                        {notif.titulo}
                      </p>
                      <span className="text-[10px] text-[var(--color-on-surface-variant)] flex-shrink-0 mt-0.5">{notif.fecha}</span>
                    </div>
                    <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5 leading-relaxed">{notif.descripcion}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.iconColor} font-medium`}>
                        {TIPO_LABELS[notif.tipo]}
                      </span>
                      {!notif.leida && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] flex-shrink-0" />
                      )}
                    </div>
                  </div>
                </div>
              );

              return (
                <div
                  key={notif.id}
                  className={`group flex items-center gap-2 bg-white border rounded-xl px-4 py-3.5 transition-all hover:shadow-sm ${
                    notif.leida
                      ? "border-[var(--color-border-subtle)]"
                      : "border-[var(--color-primary)]/20 bg-[var(--color-primary)]/[0.02]"
                  }`}
                >
                  {notif.href ? (
                    <Link
                      href={notif.href}
                      onClick={() => markRead(notif.id)}
                      className="flex items-start gap-3.5 flex-1 min-w-0"
                    >
                      {Inner}
                      <ChevronRight size={14} className="flex-shrink-0 text-[var(--color-border-subtle)] mt-1 group-hover:text-[var(--color-primary)] transition-colors" />
                    </Link>
                  ) : (
                    <div className="flex items-start gap-3.5 flex-1 min-w-0" onClick={() => markRead(notif.id)}>
                      {Inner}
                    </div>
                  )}

                  {/* Delete */}
                  <button
                    onClick={() => deleteNotif(notif.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 hover:text-red-500 text-[var(--color-border-subtle)] rounded-lg transition-all flex-shrink-0"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        {notifs.length > 0 && (
          <div className="text-center mt-6">
            <button
              onClick={() => setNotifs([])}
              className="text-xs text-[var(--color-on-surface-variant)] hover:text-red-500 transition-colors"
            >
              Borrar todas las notificaciones
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
