"use client";

import { useParams } from "next/navigation";
import {
  Truck, ChevronLeft, MapPin, Calendar, Package, User,
  CheckCircle2, Clock, AlertCircle, Phone, FileText,
} from "lucide-react";
import Link from "next/link";

const RETIRO = {
  id: "RET-001",
  orden: "ORD-2026-122",
  empresa: "Grupo Agroindustrial S.A.",
  contacto: "Mauricio Torres",
  telefonoDestino: "+57 310 123 4567",
  origen: "Bodega DistAgroMax — Calle 80 #68D-35, Bogotá",
  destino: "Finca Palmas del Norte — Vía Valledupar km 12, Cesar",
  distancia: "~850 km",
  vehiculo: "UVW-456 — Camión doble troque",
  conductor: "Jorge Mena",
  telefonoConductor: "+57 311 100 2233",
  fechaSalida: "2026-06-14",
  horaSalida: "05:00",
  fechaEntregaEst: "2026-06-15",
  pesoTotal: "10 t",
  volumen: "12 m³",
  bultos: "200 sacos",
  estado: "Programado",
  documentos: [
    { nombre: "Manifiesto de carga", estado: "Listo" },
    { nombre: "Factura de venta", estado: "Listo" },
    { nombre: "Remisión ORD-2026-122", estado: "Listo" },
    { nombre: "Ficha técnica productos", estado: "Pendiente" },
  ],
};

const CHECKLIST = [
  { id: 1, item: "Carga paletizada y verificada en bodega", completado: true },
  { id: 2, item: "Documentos de transporte generados", completado: true },
  { id: 3, item: "Conductor y vehículo confirmados", completado: true },
  { id: 4, item: "Ficha técnica de productos adjunta", completado: false },
  { id: 5, item: "Cliente notificado por WhatsApp", completado: false },
  { id: 6, item: "Guía de transporte asignada", completado: false },
];

const ESTADO_COLOR: Record<string, string> = {
  Programado: "bg-blue-100 text-blue-700",
  "En retiro": "bg-amber-100 text-amber-700",
  "En tránsito": "bg-violet-100 text-violet-700",
  Entregado: "bg-green-100 text-green-700",
};

export default function ProgramacionRetiroPage() {
  useParams();
  const completados = CHECKLIST.filter((c) => c.completado).length;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link href="/logistica/vehiculos" className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors">
          <ChevronLeft size={20} />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-headline-md font-bold flex items-center gap-2">
            <Truck size={20} /> Programación de retiro
          </h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">
            {RETIRO.id} · Orden {RETIRO.orden} · {RETIRO.empresa}
          </p>
        </div>
        <span className={`text-[11px] px-3 py-1 rounded-full font-medium shrink-0 ${ESTADO_COLOR[RETIRO.estado]}`}>
          {RETIRO.estado}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna principal */}
        <div className="lg:col-span-2 space-y-4">
          {/* Ruta */}
          <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
            <h2 className="font-semibold text-sm mb-4">Detalles del despacho</h2>
            <div className="space-y-3">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-[var(--color-primary)] mt-0.5" />
                  <div className="w-0.5 flex-1 bg-[var(--color-border-subtle)] my-1" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <p className="text-[10px] text-[var(--color-on-surface-variant)] uppercase tracking-wide">Origen</p>
                    <p className="text-sm font-medium flex items-start gap-1"><MapPin size={13} className="mt-0.5 shrink-0 text-[var(--color-primary)]" />{RETIRO.origen}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[var(--color-on-surface-variant)] uppercase tracking-wide">Destino</p>
                    <p className="text-sm font-medium flex items-start gap-1"><MapPin size={13} className="mt-0.5 shrink-0 text-green-600" />{RETIRO.destino}</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-[var(--color-border-subtle)]">
                <div><p className="text-[10px] text-[var(--color-on-surface-variant)]">Distancia</p><p className="text-xs font-medium">{RETIRO.distancia}</p></div>
                <div><p className="text-[10px] text-[var(--color-on-surface-variant)]">Carga</p><p className="text-xs font-medium">{RETIRO.pesoTotal}</p></div>
                <div><p className="text-[10px] text-[var(--color-on-surface-variant)]">Salida</p><p className="text-xs font-medium">{RETIRO.fechaSalida} {RETIRO.horaSalida}</p></div>
                <div><p className="text-[10px] text-[var(--color-on-surface-variant)]">Entrega est.</p><p className="text-xs font-medium">{RETIRO.fechaEntregaEst}</p></div>
              </div>
            </div>
          </div>

          {/* Vehículo y conductor */}
          <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
            <h2 className="font-semibold text-sm mb-4">Vehículo y conductor asignados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-[var(--color-surface-container)] rounded-lg">
                <p className="text-[10px] text-[var(--color-on-surface-variant)] mb-1">Vehículo</p>
                <p className="text-sm font-semibold flex items-center gap-1"><Truck size={13} /> {RETIRO.vehiculo}</p>
              </div>
              <div className="p-3 bg-[var(--color-surface-container)] rounded-lg">
                <p className="text-[10px] text-[var(--color-on-surface-variant)] mb-1">Conductor</p>
                <p className="text-sm font-semibold flex items-center gap-1"><User size={13} /> {RETIRO.conductor}</p>
                <a href={`tel:${RETIRO.telefonoConductor}`} className="text-xs text-[var(--color-primary)] hover:underline flex items-center gap-1 mt-0.5">
                  <Phone size={10} /> {RETIRO.telefonoConductor}
                </a>
              </div>
            </div>
          </div>

          {/* Documentos */}
          <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
            <div className="px-5 py-4 border-b border-[var(--color-border-subtle)]">
              <h2 className="font-semibold text-sm flex items-center gap-2"><FileText size={14} /> Documentos</h2>
            </div>
            <div className="divide-y divide-[var(--color-border-subtle)]">
              {RETIRO.documentos.map((d, i) => (
                <div key={i} className="px-5 py-3 flex items-center justify-between">
                  <span className="text-sm">{d.nombre}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${d.estado === "Listo" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                    {d.estado}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Checklist */}
          <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
            <div className="px-5 py-4 border-b border-[var(--color-border-subtle)]">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-sm">Checklist pre-despacho</h2>
                <span className="text-xs font-bold text-[var(--color-primary)]">{completados}/{CHECKLIST.length}</span>
              </div>
              <div className="mt-2 h-1.5 bg-[var(--color-border-subtle)] rounded-full">
                <div className="h-1.5 rounded-full bg-[var(--color-primary)]" style={{ width: `${(completados / CHECKLIST.length) * 100}%` }} />
              </div>
            </div>
            <div className="divide-y divide-[var(--color-border-subtle)]">
              {CHECKLIST.map((c) => (
                <div key={c.id} className="px-5 py-3 flex items-start gap-3">
                  {c.completado
                    ? <CheckCircle2 size={15} className="text-green-500 shrink-0 mt-0.5" />
                    : <AlertCircle size={15} className="text-amber-400 shrink-0 mt-0.5" />
                  }
                  <p className={`text-xs ${c.completado ? "line-through text-[var(--color-on-surface-variant)]" : ""}`}>{c.item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Cliente destino */}
          <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
            <h2 className="font-semibold text-sm mb-3">Contacto en destino</h2>
            <p className="text-sm font-medium">{RETIRO.contacto}</p>
            <p className="text-xs text-[var(--color-on-surface-variant)]">{RETIRO.empresa}</p>
            <a href={`tel:${RETIRO.telefonoDestino}`} className="mt-2 flex items-center gap-1.5 text-xs text-[var(--color-primary)] hover:underline">
              <Phone size={11} /> {RETIRO.telefonoDestino}
            </a>
          </div>

          {/* Acción */}
          <button className="w-full flex items-center justify-center gap-2 py-3 bg-[var(--color-primary)] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
            <Clock size={15} /> Iniciar retiro
          </button>
          <Link href={`/tracking/RET-001`} className="w-full flex items-center justify-center gap-2 py-3 border border-[var(--color-border-subtle)] text-[var(--color-on-surface-variant)] rounded-xl text-sm hover:bg-[var(--color-surface-container)] transition-colors">
            <Package size={15} /> Ver tracking
          </Link>
        </div>
      </div>
    </div>
  );
}
