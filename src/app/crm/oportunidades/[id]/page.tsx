"use client";

import { useParams } from "next/navigation";
import {
  TrendingUp, Building2, User, Phone, MapPin, Calendar, DollarSign,
  Truck, ChevronLeft, CheckCircle2, Clock, MessageSquare, FileText, Plus,
} from "lucide-react";
import Link from "next/link";

const OPORTUNIDAD = {
  id: "OPP-2026-031",
  empresa: "Palmas del Norte",
  empresaId: "EMP-006",
  contacto: "Patricia Suárez",
  cargo: "Gerente General",
  telefono: "+57 321 876 5432",
  producto: "Fertilizantes NPK 20t",
  descripcion: "Compra trimestral de fertilizantes NPK para ciclo productivo de palma africana. El cliente requiere entrega en su bodega en Valledupar.",
  valor: "$44,000",
  etapa: "Negociación",
  prob: 70,
  pais: "Colombia",
  ciudad: "Valledupar",
  fechaReq: "2026-07-15",
  vendedor: "María Gómez",
  transporte: "Tercero",
  creadaEl: "2026-05-20",
  proximaActividad: "Llamada de seguimiento — 2026-06-12",
};

const HISTORIAL = [
  { fecha: "2026-06-10", tipo: "Email", descripcion: "Se envió propuesta comercial actualizada con descuento por volumen del 5%.", usuario: "María Gómez" },
  { fecha: "2026-06-07", tipo: "Llamada", descripcion: "Llamada de 25 min. Cliente solicitó desglose de costos logísticos. Se compromete a responder antes del 15.", usuario: "María Gómez" },
  { fecha: "2026-06-03", tipo: "Cotización", descripcion: "Cotización #COT-2026-089 enviada por $44,000.", usuario: "Sistema" },
  { fecha: "2026-05-28", tipo: "Visita", descripcion: "Visita técnica en finca. Se identificó necesidad de formulación especial para suelos ácidos.", usuario: "Carlos Díaz" },
  { fecha: "2026-05-20", tipo: "Lead", descripcion: "Oportunidad creada desde referido de Cooperativa Boyacá.", usuario: "María Gómez" },
];

const TIPO_ICON: Record<string, React.ReactNode> = {
  Email: <MessageSquare size={13} />,
  Llamada: <Phone size={13} />,
  Cotización: <FileText size={13} />,
  Visita: <User size={13} />,
  Lead: <TrendingUp size={13} />,
};

const TIPO_COLOR: Record<string, string> = {
  Email: "bg-blue-50 text-blue-600",
  Llamada: "bg-green-50 text-green-600",
  Cotización: "bg-violet-50 text-violet-600",
  Visita: "bg-amber-50 text-amber-600",
  Lead: "bg-slate-50 text-slate-600",
};

const ETAPAS_PIPELINE = [
  "Nuevo lead", "Contactado", "Necesidad identificada", "Oferta en preparación",
  "Cotización enviada", "Negociación", "Validación logística", "Aprobación del cliente", "Ganada",
];

export default function OportunidadDetallePage() {
  const params = useParams();
  const etapaIdx = ETAPAS_PIPELINE.indexOf(OPORTUNIDAD.etapa);

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-3">
        <Link href="/crm/oportunidades" className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors">
          <ChevronLeft size={20} />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-headline-md font-bold truncate">{OPORTUNIDAD.empresa}</h1>
          <p className="text-sm text-[var(--color-on-surface-variant)]">{OPORTUNIDAD.id} · {OPORTUNIDAD.producto}</p>
        </div>
        <span className="text-[11px] bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-medium">{OPORTUNIDAD.etapa}</span>
      </div>

      {/* Barra de progreso pipeline */}
      <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-4">
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {ETAPAS_PIPELINE.map((e, i) => (
            <div key={e} className="flex items-center gap-1 shrink-0">
              <div className={`flex flex-col items-center gap-1`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  i < etapaIdx ? "bg-[var(--color-primary)] text-white" :
                  i === etapaIdx ? "bg-[var(--color-primary)] text-white ring-2 ring-[var(--color-primary)] ring-offset-2" :
                  "bg-[var(--color-border-subtle)] text-[var(--color-on-surface-variant)]"
                }`}>
                  {i < etapaIdx ? <CheckCircle2 size={12} /> : i + 1}
                </div>
                <span className={`text-[9px] text-center leading-tight max-w-12 ${i === etapaIdx ? "font-bold text-[var(--color-primary)]" : "text-[var(--color-on-surface-variant)]"}`}>
                  {e}
                </span>
              </div>
              {i < ETAPAS_PIPELINE.length - 1 && (
                <div className={`h-0.5 w-8 shrink-0 mb-4 ${i < etapaIdx ? "bg-[var(--color-primary)]" : "bg-[var(--color-border-subtle)]"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Datos principales */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
            <h2 className="font-semibold text-sm mb-4">Información de la oportunidad</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-[10px] text-[var(--color-on-surface-variant)] uppercase tracking-wide mb-0.5">Empresa</p>
                <Link href={`/crm/clientes/${OPORTUNIDAD.empresaId}/historial`} className="flex items-center gap-1 text-[var(--color-primary)] hover:underline font-medium">
                  <Building2 size={13} /> {OPORTUNIDAD.empresa}
                </Link>
              </div>
              <div>
                <p className="text-[10px] text-[var(--color-on-surface-variant)] uppercase tracking-wide mb-0.5">Contacto</p>
                <p className="flex items-center gap-1 font-medium"><User size={13} /> {OPORTUNIDAD.contacto}</p>
                <p className="text-[11px] text-[var(--color-on-surface-variant)]">{OPORTUNIDAD.cargo}</p>
              </div>
              <div>
                <p className="text-[10px] text-[var(--color-on-surface-variant)] uppercase tracking-wide mb-0.5">Teléfono</p>
                <a href={`tel:${OPORTUNIDAD.telefono}`} className="flex items-center gap-1 text-[var(--color-primary)] hover:underline">
                  <Phone size={13} /> {OPORTUNIDAD.telefono}
                </a>
              </div>
              <div>
                <p className="text-[10px] text-[var(--color-on-surface-variant)] uppercase tracking-wide mb-0.5">Ubicación</p>
                <p className="flex items-center gap-1"><MapPin size={13} /> {OPORTUNIDAD.ciudad}, {OPORTUNIDAD.pais}</p>
              </div>
              <div>
                <p className="text-[10px] text-[var(--color-on-surface-variant)] uppercase tracking-wide mb-0.5">Fecha requerida</p>
                <p className="flex items-center gap-1"><Calendar size={13} /> {OPORTUNIDAD.fechaReq}</p>
              </div>
              <div>
                <p className="text-[10px] text-[var(--color-on-surface-variant)] uppercase tracking-wide mb-0.5">Transporte</p>
                <p className="flex items-center gap-1"><Truck size={13} /> {OPORTUNIDAD.transporte}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-[var(--color-border-subtle)]">
              <p className="text-[10px] text-[var(--color-on-surface-variant)] uppercase tracking-wide mb-1">Descripción</p>
              <p className="text-sm text-[var(--color-on-surface)]">{OPORTUNIDAD.descripcion}</p>
            </div>
          </div>

          {/* Historial de actividades */}
          <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
            <div className="px-5 py-4 flex items-center justify-between border-b border-[var(--color-border-subtle)]">
              <h2 className="font-semibold text-sm">Historial de actividades</h2>
              <button className="flex items-center gap-1 text-xs text-[var(--color-primary)] hover:underline">
                <Plus size={12} /> Registrar actividad
              </button>
            </div>
            <div className="divide-y divide-[var(--color-border-subtle)]">
              {HISTORIAL.map((h, i) => (
                <div key={i} className="px-5 py-3 flex gap-3">
                  <div className={`p-1.5 rounded-full h-fit shrink-0 ${TIPO_COLOR[h.tipo]}`}>
                    {TIPO_ICON[h.tipo]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold">{h.tipo}</span>
                      <span className="text-[10px] text-[var(--color-on-surface-variant)] shrink-0">{h.fecha}</span>
                    </div>
                    <p className="text-xs text-[var(--color-on-surface)] mt-0.5">{h.descripcion}</p>
                    <p className="text-[10px] text-[var(--color-on-surface-variant)] mt-0.5">Por: {h.usuario}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Valor y probabilidad */}
          <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
            <h2 className="font-semibold text-sm mb-3">Estimación</h2>
            <div className="text-3xl font-bold text-[var(--color-primary)] mb-1">{OPORTUNIDAD.valor}</div>
            <p className="text-xs text-[var(--color-on-surface-variant)]">{OPORTUNIDAD.producto}</p>
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[var(--color-on-surface-variant)]">Probabilidad</span>
                <span className="font-bold">{OPORTUNIDAD.prob}%</span>
              </div>
              <div className="h-2 bg-[var(--color-border-subtle)] rounded-full">
                <div
                  className="h-2 rounded-full bg-[var(--color-primary)]"
                  style={{ width: `${OPORTUNIDAD.prob}%` }}
                />
              </div>
            </div>
          </div>

          {/* Próxima actividad */}
          <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
            <h2 className="font-semibold text-sm mb-3 flex items-center gap-2"><Clock size={14} /> Próxima actividad</h2>
            <p className="text-sm">{OPORTUNIDAD.proximaActividad}</p>
            <p className="text-xs text-[var(--color-on-surface-variant)] mt-1">Responsable: {OPORTUNIDAD.vendedor}</p>
            <button className="mt-3 w-full text-xs bg-[var(--color-primary)] text-white py-2 rounded-lg hover:opacity-90 transition-opacity">
              Marcar completada
            </button>
          </div>

          {/* Acciones */}
          <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5 space-y-2">
            <h2 className="font-semibold text-sm mb-3">Acciones</h2>
            {[
              { label: "Crear cotización", icon: <FileText size={13} /> },
              { label: "Enviar mensaje", icon: <MessageSquare size={13} /> },
              { label: "Avanzar etapa", icon: <TrendingUp size={13} /> },
              { label: "Marcar como ganada", icon: <CheckCircle2 size={13} /> },
            ].map((a) => (
              <button
                key={a.label}
                className="w-full flex items-center gap-2 text-xs border border-[var(--color-border-subtle)] px-3 py-2 rounded-lg hover:bg-[var(--color-surface-container)] transition-colors text-[var(--color-on-surface)]"
              >
                {a.icon} {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
