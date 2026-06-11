"use client";

import { useParams } from "next/navigation";
import {
  ChevronLeft, MapPin, Calendar, Weight, Truck, FileText,
  Users, ChevronRight, Clock, AlertCircle, ExternalLink,
} from "lucide-react";
import Link from "next/link";

const SOLICITUD = {
  id: "SFL-001",
  orden: "ORD-2026-122",
  empresa: "Grupo Agroindustrial S.A.",
  contacto: "Mauricio Torres",
  origen: "Bodega DistAgroMax — Calle 80 #68D-35, Bogotá",
  destino: "Finca Palmas del Norte — Vía Valledupar km 12, Cesar",
  distancia: "~850 km",
  tipoCarga: "Carga peligrosa (agroquímicos clase 9)",
  pesoKg: "10,000 kg",
  volumenM3: "12 m³",
  bultos: "200 sacos",
  condicionesEsp: "Requiere señalización clase 9. Temperatura ambiente. No apilar más de 4 sacos.",
  tipoVehiculo: "Camión doble troque (hasta 18 t)",
  fechaRetiro: "2026-06-14",
  fechaEntrega: "2026-06-16",
  documentos: "Manifiesto de carga, factura, remisión, ficha técnica",
  seguro: "Sí — obligatorio",
  estado: "Ofertas recibidas",
  publicada: "2026-06-11 08:30",
  ofertas: 3,
};

const OPERADORES_INVITADOS = [
  { nombre: "Transportes Andes S.A.S.", estado: "Oferta enviada", calificacion: 4.8 },
  { nombre: "LogiCarga Colombia", estado: "Oferta enviada", calificacion: 4.6 },
  { nombre: "Fletes Nacionales Ltda.", estado: "Oferta enviada", calificacion: 4.4 },
  { nombre: "Carga Segura S.A.", estado: "Sin respuesta", calificacion: 4.7 },
  { nombre: "Transportadora Caribe", estado: "Sin respuesta", calificacion: 4.5 },
];

const ESTADO_COLOR: Record<string, string> = {
  "Oferta enviada": "bg-green-100 text-green-700",
  "Sin respuesta": "bg-slate-100 text-slate-500",
  "Visto": "bg-blue-100 text-blue-600",
};

export default function DetalleSolicitudPage() {
  const params = useParams();

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link href="/logistica/solicitudes" className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors">
          <ChevronLeft size={20} />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-headline-md font-bold">{SOLICITUD.id}</h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">
            Orden {SOLICITUD.orden} · {SOLICITUD.empresa}
          </p>
        </div>
        <span className="text-[11px] bg-violet-100 text-violet-700 px-3 py-1 rounded-full font-medium shrink-0">
          {SOLICITUD.estado}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Detalles */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
            <h2 className="font-semibold text-sm mb-4">Detalles de la solicitud</h2>
            <div className="space-y-3">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-[var(--color-primary)]" />
                  <div className="w-0.5 flex-1 bg-[var(--color-border-subtle)] my-1" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <p className="text-[10px] text-[var(--color-on-surface-variant)] uppercase">Origen</p>
                    <p className="text-sm font-medium">{SOLICITUD.origen}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[var(--color-on-surface-variant)] uppercase">Destino</p>
                    <p className="text-sm font-medium">{SOLICITUD.destino}</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-[var(--color-border-subtle)] text-xs">
                <div><p className="text-[var(--color-on-surface-variant)] mb-0.5 flex items-center gap-1"><Weight size={10} />Peso</p><p className="font-medium">{SOLICITUD.pesoKg}</p></div>
                <div><p className="text-[var(--color-on-surface-variant)] mb-0.5">Volumen</p><p className="font-medium">{SOLICITUD.volumenM3}</p></div>
                <div><p className="text-[var(--color-on-surface-variant)] mb-0.5 flex items-center gap-1"><Calendar size={10} />Retiro</p><p className="font-medium">{SOLICITUD.fechaRetiro}</p></div>
                <div><p className="text-[var(--color-on-surface-variant)] mb-0.5 flex items-center gap-1"><Clock size={10} />Entrega</p><p className="font-medium">{SOLICITUD.fechaEntrega}</p></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5 space-y-3">
            <h2 className="font-semibold text-sm">Carga y condiciones</h2>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div><p className="text-[var(--color-on-surface-variant)] mb-0.5">Tipo de carga</p><p className="font-medium">{SOLICITUD.tipoCarga}</p></div>
              <div><p className="text-[var(--color-on-surface-variant)] mb-0.5 flex items-center gap-1"><Truck size={10} />Vehículo requerido</p><p className="font-medium">{SOLICITUD.tipoVehiculo}</p></div>
              <div><p className="text-[var(--color-on-surface-variant)] mb-0.5">Bultos</p><p className="font-medium">{SOLICITUD.bultos}</p></div>
              <div><p className="text-[var(--color-on-surface-variant)] mb-0.5">Seguro</p><p className="font-medium">{SOLICITUD.seguro}</p></div>
            </div>
            <div className="pt-2 border-t border-[var(--color-border-subtle)]">
              <p className="text-[10px] text-[var(--color-on-surface-variant)] mb-1">Condiciones especiales</p>
              <p className="text-xs flex items-start gap-1.5"><AlertCircle size={11} className="text-amber-500 mt-0.5 shrink-0" />{SOLICITUD.condicionesEsp}</p>
            </div>
            <div className="pt-2 border-t border-[var(--color-border-subtle)]">
              <p className="text-[10px] text-[var(--color-on-surface-variant)] mb-1 flex items-center gap-1"><FileText size={10} />Documentos requeridos</p>
              <p className="text-xs">{SOLICITUD.documentos}</p>
            </div>
          </div>

          {/* Operadores invitados */}
          <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
            <div className="px-5 py-4 flex items-center justify-between border-b border-[var(--color-border-subtle)]">
              <h2 className="font-semibold text-sm flex items-center gap-2"><Users size={14} /> Operadores invitados</h2>
              <span className="text-xs text-[var(--color-on-surface-variant)]">{OPERADORES_INVITADOS.length} invitados</span>
            </div>
            <div className="divide-y divide-[var(--color-border-subtle)]">
              {OPERADORES_INVITADOS.map((o, i) => (
                <div key={i} className="px-5 py-3 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium">{o.nombre}</p>
                    <p className="text-[10px] text-[var(--color-on-surface-variant)]">⭐ {o.calificacion}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${ESTADO_COLOR[o.estado]}`}>{o.estado}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar acciones */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
            <h2 className="font-semibold text-sm mb-3">Acciones</h2>
            <div className="space-y-2">
              <Link href={`/logistica/solicitudes/${params.id}/ofertas`}
                className="w-full flex items-center justify-between text-sm bg-[var(--color-primary)] text-white px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity">
                <span>Ver {SOLICITUD.ofertas} ofertas</span>
                <ChevronRight size={15} />
              </Link>
              <Link href={`/logistica/solicitudes/${params.id}/comparar`}
                className="w-full flex items-center justify-between text-sm border border-[var(--color-primary)] text-[var(--color-primary)] px-4 py-2.5 rounded-lg hover:bg-blue-50 transition-colors">
                <span>Comparar ofertas</span>
                <ChevronRight size={15} />
              </Link>
              <button className="w-full flex items-center justify-between text-sm border border-[var(--color-border-subtle)] px-4 py-2.5 rounded-lg hover:bg-[var(--color-surface-container)] transition-colors text-[var(--color-on-surface-variant)]">
                <span>Invitar más operadores</span>
                <ChevronRight size={15} />
              </button>
              <button className="w-full text-sm text-red-600 border border-red-200 px-4 py-2.5 rounded-lg hover:bg-red-50 transition-colors">
                Cancelar solicitud
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
            <h2 className="font-semibold text-sm mb-2">Info adicional</h2>
            <div className="space-y-1.5 text-xs text-[var(--color-on-surface-variant)]">
              <p>Publicada: {SOLICITUD.publicada}</p>
              <p>Distancia estimada: {SOLICITUD.distancia}</p>
              <Link href={`/ordenes/${SOLICITUD.orden}`} className="flex items-center gap-1 text-[var(--color-primary)] hover:underline">
                Ver orden {SOLICITUD.orden} <ExternalLink size={9} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
