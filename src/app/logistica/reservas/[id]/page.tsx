"use client";

import { useParams } from "next/navigation";
import {
  ChevronLeft, CheckCircle2, Truck, MapPin, Calendar,
  Shield, Star, Phone, FileText, ChevronRight, Clock,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const RESERVA = {
  id: "RES-001",
  solicitud: "SFL-001",
  orden: "ORD-2026-122",
  empresa: "Grupo Agroindustrial S.A.",
  operador: "Transportes Andes S.A.S.",
  operadorId: "OP-001",
  calificacion: 4.8,
  despachos: 234,
  conductor: "Pedro Morales",
  conductorTel: "+57 311 500 6699",
  vehiculo: "Camión doble troque 18t",
  placa: "XYZ-123",
  origen: "Bodega DistAgroMax — Calle 80 #68D-35, Bogotá",
  destino: "Finca Palmas del Norte — Vía Valledupar km 12, Cesar",
  distancia: "~850 km",
  fechaSalida: "2026-06-14",
  horaSalida: "05:00",
  fechaEntrega: "2026-06-15",
  precio: "$1,650,000",
  seguro: "Póliza incluida hasta $50M",
  garantia: "Entrega garantizada",
  estado: "Pendiente confirmación",
  vigenciaOferta: "2026-06-13",
  terminosAdicionales: "El operador confirmará disponibilidad en máximo 2 horas. El pago se liberará una vez el cliente confirme recepción.",
};

const PASOS = [
  { id: 1, label: "Solicitud publicada", done: true },
  { id: 2, label: "Ofertas recibidas", done: true },
  { id: 3, label: "Oferta aceptada", done: true },
  { id: 4, label: "Reserva confirmada", done: false, active: true },
  { id: 5, label: "En tránsito", done: false },
  { id: 6, label: "Entregado", done: false },
];

export default function ReservaPage() {
  useParams();
  const [aceptado, setAceptado] = useState(false);
  const [terminos, setTerminos] = useState(false);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link href="/logistica/solicitudes/SFL-001/ofertas" className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors">
          <ChevronLeft size={20} />
        </Link>
        <div className="flex-1">
          <h1 className="text-headline-md font-bold">Confirmación de reserva</h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">
            {RESERVA.id} · Solicitud {RESERVA.solicitud}
          </p>
        </div>
        <span className="text-[11px] bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-medium shrink-0">
          {RESERVA.estado}
        </span>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
        <div className="flex items-center gap-0">
          {PASOS.map((p, i) => (
            <div key={p.id} className="flex items-center flex-1 min-w-0">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold
                ${p.done ? "bg-green-500 text-white" : p.active ? "bg-[var(--color-primary)] text-white ring-4 ring-[var(--color-primary)] ring-opacity-20" : "bg-[var(--color-border-subtle)] text-[var(--color-on-surface-variant)]"}`}>
                {p.done ? <CheckCircle2 size={13} /> : p.id}
              </div>
              <div className="flex-1 px-1 min-w-0 hidden sm:block">
                <p className={`text-[10px] truncate ${p.active ? "font-semibold text-[var(--color-primary)]" : p.done ? "text-green-600" : "text-[var(--color-on-surface-variant)]"}`}>
                  {p.label}
                </p>
              </div>
              {i < PASOS.length - 1 && (
                <div className={`h-0.5 w-4 shrink-0 ${p.done ? "bg-green-500" : "bg-[var(--color-border-subtle)]"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Operador seleccionado */}
          <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
            <h2 className="font-semibold text-sm mb-4 flex items-center gap-2"><Truck size={15} />Operador seleccionado</h2>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)] bg-opacity-10 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-[var(--color-primary)]">TA</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-bold">{RESERVA.operador}</p>
                  <div className="flex items-center gap-0.5">
                    <Star size={12} className="text-amber-400 fill-amber-400" />
                    <span className="text-xs font-semibold">{RESERVA.calificacion}</span>
                  </div>
                </div>
                <p className="text-xs text-[var(--color-on-surface-variant)]">{RESERVA.despachos} despachos completados</p>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                  <div><p className="text-[var(--color-on-surface-variant)] mb-0.5">Conductor</p><p className="font-medium">{RESERVA.conductor}</p></div>
                  <div><p className="text-[var(--color-on-surface-variant)] mb-0.5">Vehículo</p><p className="font-medium font-mono">{RESERVA.placa}</p></div>
                </div>
                <a href={`tel:${RESERVA.conductorTel}`} className="mt-1.5 text-xs text-[var(--color-primary)] hover:underline flex items-center gap-1">
                  <Phone size={10} /> {RESERVA.conductorTel}
                </a>
              </div>
              <Link href={`/logistica/operadores/${RESERVA.operadorId}/reviews`} className="text-xs text-[var(--color-primary)] hover:underline shrink-0">
                Ver reputación
              </Link>
            </div>
          </div>

          {/* Ruta */}
          <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
            <h2 className="font-semibold text-sm mb-4 flex items-center gap-2"><MapPin size={15} />Ruta y fechas</h2>
            <div className="flex gap-4 mb-4">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-[var(--color-primary)]" />
                <div className="w-0.5 flex-1 bg-[var(--color-border-subtle)] my-1" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <p className="text-[10px] text-[var(--color-on-surface-variant)] uppercase">Origen</p>
                  <p className="text-sm font-medium">{RESERVA.origen}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[var(--color-on-surface-variant)] uppercase">Destino</p>
                  <p className="text-sm font-medium">{RESERVA.destino}</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-2 bg-[var(--color-surface-container)] rounded-lg">
                <p className="text-[var(--color-on-surface-variant)] mb-0.5 flex items-center gap-1"><Calendar size={10} />Salida</p>
                <p className="font-medium">{RESERVA.fechaSalida}</p>
                <p className="text-[var(--color-on-surface-variant)]">{RESERVA.horaSalida}</p>
              </div>
              <div className="p-2 bg-[var(--color-surface-container)] rounded-lg">
                <p className="text-[var(--color-on-surface-variant)] mb-0.5 flex items-center gap-1"><Clock size={10} />Entrega est.</p>
                <p className="font-medium">{RESERVA.fechaEntrega}</p>
              </div>
              <div className="p-2 bg-[var(--color-surface-container)] rounded-lg">
                <p className="text-[var(--color-on-surface-variant)] mb-0.5">Distancia</p>
                <p className="font-medium">{RESERVA.distancia}</p>
              </div>
            </div>
          </div>

          {/* Términos */}
          <div className="bg-[var(--color-surface-container)] rounded-xl p-4 text-xs text-[var(--color-on-surface-variant)] space-y-2">
            <p className="font-semibold text-[var(--color-on-surface)] flex items-center gap-1.5"><FileText size={13} />Términos adicionales</p>
            <p>{RESERVA.terminosAdicionales}</p>
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={terminos} onChange={(e) => setTerminos(e.target.checked)} className="mt-0.5 accent-[var(--color-primary)]" />
            <span className="text-xs text-[var(--color-on-surface-variant)]">
              He leído y acepto los términos y condiciones de la reserva, la política de cancelación y las condiciones de seguro indicadas.
            </span>
          </label>

          <button
            onClick={() => setAceptado(true)}
            disabled={!terminos || aceptado}
            className="w-full py-3 bg-[var(--color-primary)] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {aceptado ? <><CheckCircle2 size={16} /> Reserva confirmada</> : "Confirmar reserva"}
          </button>
          {aceptado && (
            <Link href="/tracking/RES-001" className="w-full py-3 border border-[var(--color-primary)] text-[var(--color-primary)] rounded-xl text-sm font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
              Ver tracking en vivo <ChevronRight size={14} />
            </Link>
          )}
        </div>

        {/* Sidebar resumen */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5 sticky top-4">
            <h2 className="font-semibold text-sm mb-4">Resumen económico</h2>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-[var(--color-on-surface-variant)]">Flete base</span><span className="font-medium">{RESERVA.precio}</span></div>
              <div className="flex justify-between"><span className="text-[var(--color-on-surface-variant)]">Seguro</span><span className="font-medium text-green-600">Incluido</span></div>
              <div className="flex justify-between"><span className="text-[var(--color-on-surface-variant)]">IVA (19%)</span><span className="font-medium">$313,500</span></div>
              <div className="border-t border-[var(--color-border-subtle)] pt-2 flex justify-between font-bold text-sm">
                <span>Total</span><span className="text-[var(--color-primary)]">$1,963,500</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-[var(--color-border-subtle)] space-y-1.5 text-xs text-[var(--color-on-surface-variant)]">
              <div className="flex items-center gap-1.5"><Shield size={11} className="shrink-0" />{RESERVA.seguro}</div>
              <div className="flex items-center gap-1.5"><CheckCircle2 size={11} className="shrink-0 text-green-500" />{RESERVA.garantia}</div>
              <p className="text-[10px] mt-1">Vigencia oferta: {RESERVA.vigenciaOferta}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
