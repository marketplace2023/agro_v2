"use client";

import { useState } from "react";
import { Bell, ChevronLeft, Mail, MessageSquare, Smartphone } from "lucide-react";
import Link from "next/link";

const CATEGORIAS = [
  {
    id: "ordenes", nombre: "Órdenes y despachos",
    eventos: [
      { id: "orden_nueva", label: "Nueva orden recibida" },
      { id: "orden_despacho", label: "Orden lista para despacho" },
      { id: "orden_entregada", label: "Orden entregada" },
      { id: "orden_cancelada", label: "Orden cancelada" },
    ],
  },
  {
    id: "mensajes", nombre: "Mensajes y conversaciones",
    eventos: [
      { id: "msg_nuevo", label: "Nuevo mensaje en conversación" },
      { id: "msg_mencion", label: "Me mencionaron en un mensaje" },
      { id: "msg_tarea", label: "Nueva tarea asignada" },
    ],
  },
  {
    id: "crm", nombre: "CRM y oportunidades",
    eventos: [
      { id: "crm_lead", label: "Nuevo lead asignado" },
      { id: "crm_actividad", label: "Recordatorio de actividad" },
      { id: "crm_opp", label: "Cambio de etapa en oportunidad" },
    ],
  },
  {
    id: "logistica", nombre: "Logística",
    eventos: [
      { id: "log_flete", label: "Nueva oferta de flete recibida" },
      { id: "log_tracking", label: "Evento de tracking" },
      { id: "log_incidencia", label: "Incidencia logística" },
    ],
  },
  {
    id: "pagos", nombre: "Pagos y finanzas",
    eventos: [
      { id: "pago_recibido", label: "Pago recibido" },
      { id: "pago_rechazado", label: "Pago rechazado" },
      { id: "liquidacion", label: "Liquidación procesada" },
    ],
  },
  {
    id: "regulatorio", nombre: "Regulatorio",
    eventos: [
      { id: "reg_vence", label: "Documento próximo a vencer" },
      { id: "reg_aprobado", label: "Documento aprobado/rechazado" },
    ],
  },
];

type Canal = "email" | "push" | "whatsapp";

type Prefs = Record<string, Record<Canal, boolean>>;

const defaultPrefs = (): Prefs => {
  const prefs: Prefs = {};
  for (const cat of CATEGORIAS) {
    for (const ev of cat.eventos) {
      prefs[ev.id] = { email: true, push: true, whatsapp: false };
    }
  }
  return prefs;
};

export default function ConfigNotificacionesPage() {
  const [prefs, setPrefs] = useState<Prefs>(defaultPrefs);
  const [guardado, setGuardado] = useState(false);

  const toggle = (eventoId: string, canal: Canal) => {
    setPrefs((prev) => ({
      ...prev,
      [eventoId]: { ...prev[eventoId], [canal]: !prev[eventoId][canal] },
    }));
    setGuardado(false);
  };

  const guardar = () => {
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/notificaciones" className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h1 className="text-headline-md font-bold flex items-center gap-2">
              <Bell size={20} /> Preferencias de notificación
            </h1>
            <p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">Elige cómo y cuándo recibir alertas</p>
          </div>
        </div>
        <button
          onClick={guardar}
          className={`text-sm px-4 py-2 rounded-lg font-medium transition-all ${
            guardado
              ? "bg-green-500 text-white"
              : "bg-[var(--color-primary)] text-white hover:opacity-90"
          }`}
        >
          {guardado ? "¡Guardado!" : "Guardar"}
        </button>
      </div>

      {/* Leyenda canales */}
      <div className="flex gap-4 text-xs text-[var(--color-on-surface-variant)]">
        <span className="flex items-center gap-1.5"><Mail size={13} /> Email</span>
        <span className="flex items-center gap-1.5"><Smartphone size={13} /> Push</span>
        <span className="flex items-center gap-1.5"><MessageSquare size={13} /> WhatsApp</span>
      </div>

      <div className="space-y-4">
        {CATEGORIAS.map((cat) => (
          <div key={cat.id} className="bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
            <div className="px-5 py-3 bg-[var(--color-surface-container)] border-b border-[var(--color-border-subtle)]">
              <h2 className="font-semibold text-sm">{cat.nombre}</h2>
            </div>
            <div className="divide-y divide-[var(--color-border-subtle)]">
              {cat.eventos.map((ev) => (
                <div key={ev.id} className="flex items-center justify-between px-5 py-3 gap-4">
                  <span className="text-sm flex-1">{ev.label}</span>
                  <div className="flex items-center gap-4 shrink-0">
                    {(["email", "push", "whatsapp"] as Canal[]).map((canal) => (
                      <button
                        key={canal}
                        onClick={() => toggle(ev.id, canal)}
                        className={`w-9 h-5 rounded-full relative transition-colors ${
                          prefs[ev.id]?.[canal]
                            ? "bg-[var(--color-primary)]"
                            : "bg-[var(--color-border-subtle)]"
                        }`}
                        title={canal}
                      >
                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                          prefs[ev.id]?.[canal] ? "translate-x-4" : "translate-x-0.5"
                        }`} />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4 text-xs">
        <Link href="/notificaciones" className="text-[var(--color-primary)] hover:underline flex items-center gap-1">
          <ChevronLeft size={11} /> Ver notificaciones
        </Link>
      </div>
    </div>
  );
}
