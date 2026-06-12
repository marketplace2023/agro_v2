"use client";

import { useParams } from "next/navigation";
import { ChevronLeft, Star, Truck, Clock, Shield, ChevronRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const OFERTAS = [
  {
    id: "OFR-001", operador: "Transportes Andes S.A.S.", operadorId: "OP-001",
    calificacion: 4.8, despachos: 234, cobertura: "Nacional",
    vehiculo: "Camión doble troque 18t", placa: "XYZ-123",
    conductor: "Pedro Morales", precio: "$1,650,000", precioNum: 1650000,
    tiempoEstimado: "1 día", fechaDisponible: "2026-06-14",
    seguro: "Póliza incluida hasta $50M", garantia: "Entrega garantizada",
    estado: "Enviada", vigencia: "2026-06-13",
    observaciones: "Contamos con GPS en tiempo real y experiencia en transporte de agroquímicos clase 9.",
  },
  {
    id: "OFR-002", operador: "LogiCarga Colombia", operadorId: "OP-002",
    calificacion: 4.6, despachos: 187, cobertura: "Costa Atlántica + interior",
    vehiculo: "Camión doble troque 16t", placa: "ABC-456",
    conductor: "Luis Castaño", precio: "$1,480,000", precioNum: 1480000,
    tiempoEstimado: "1.5 días", fechaDisponible: "2026-06-14",
    seguro: "Seguro básico incluido", garantia: "Sin garantía de tiempo",
    estado: "Enviada", vigencia: "2026-06-13",
    observaciones: "Precio más bajo del mercado. Ruta directa Bogotá–Valledupar sin paradas intermedias.",
  },
  {
    id: "OFR-003", operador: "Fletes Nacionales Ltda.", operadorId: "OP-003",
    calificacion: 4.4, despachos: 98, cobertura: "Costa Atlántica",
    vehiculo: "Tractomula 30t", placa: "DEF-789",
    conductor: "Ramón García", precio: "$2,100,000", precioNum: 2100000,
    tiempoEstimado: "1 día", fechaDisponible: "2026-06-13",
    seguro: "Póliza todo riesgo hasta $80M", garantia: "Entrega en fecha o descuento 5%",
    estado: "Enviada", vigencia: "2026-06-12",
    observaciones: "Vehículo más grande que el requerido, carga segura y capacidad adicional para retorno.",
  },
];

export default function OfertasPage() {
  const params = useParams();

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link href={`/logistica/solicitudes/${params.id}`} className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors">
          <ChevronLeft size={20} />
        </Link>
        <div className="flex-1">
          <h1 className="text-headline-md font-bold">Ofertas logísticas</h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">
            SFL-001 · {OFERTAS.length} ofertas recibidas
          </p>
        </div>
        <Link
          href={`/logistica/solicitudes/${params.id}/comparar`}
          className="flex items-center gap-2 text-sm bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
        >
          Comparar →
        </Link>
      </div>

      <div className="space-y-4">
        {OFERTAS.map((o, i) => (
          <div key={o.id} className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5 hover:shadow-sm transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="font-bold text-sm">{o.operador}</p>
                  {i === 1 && <span className="text-[10px] bg-green-600 text-white px-2 py-0.5 rounded-full font-medium">Precio más bajo</span>}
                  {i === 0 && <span className="text-[10px] bg-[var(--color-primary)] text-white px-2 py-0.5 rounded-full font-medium">Mejor valorado</span>}
                </div>
                <div className="flex items-center gap-3 text-xs text-[var(--color-on-surface-variant)]">
                  <span className="flex items-center gap-0.5"><Star size={11} className="text-amber-400 fill-amber-400" />{o.calificacion}</span>
                  <span>{o.despachos} despachos</span>
                  <span>{o.cobertura}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xl font-bold text-[var(--color-primary)]">{o.precio}</p>
                <p className="text-[10px] text-[var(--color-on-surface-variant)]">costo total de flete</p>
              </div>
            </div>

            {/* Detalles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 text-xs">
              <div className="p-2.5 bg-[var(--color-surface-container)] rounded-lg">
                <p className="text-[var(--color-on-surface-variant)] mb-0.5 flex items-center gap-1"><Truck size={10} />Vehículo</p>
                <p className="font-medium leading-snug">{o.vehiculo}</p>
                <p className="font-mono text-[var(--color-on-surface-variant)]">{o.placa}</p>
              </div>
              <div className="p-2.5 bg-[var(--color-surface-container)] rounded-lg">
                <p className="text-[var(--color-on-surface-variant)] mb-0.5 flex items-center gap-1"><Clock size={10} />Tiempo est.</p>
                <p className="font-medium">{o.tiempoEstimado}</p>
                <p className="text-[var(--color-on-surface-variant)]">Disp. {o.fechaDisponible}</p>
              </div>
              <div className="p-2.5 bg-[var(--color-surface-container)] rounded-lg">
                <p className="text-[var(--color-on-surface-variant)] mb-0.5 flex items-center gap-1"><Shield size={10} />Seguro</p>
                <p className="font-medium leading-snug">{o.seguro}</p>
              </div>
              <div className="p-2.5 bg-[var(--color-surface-container)] rounded-lg">
                <p className="text-[var(--color-on-surface-variant)] mb-0.5 flex items-center gap-1"><CheckCircle2 size={10} />Garantía</p>
                <p className="font-medium leading-snug">{o.garantia}</p>
              </div>
            </div>

            <p className="text-xs text-[var(--color-on-surface-variant)] mb-4 italic">"{o.observaciones}"</p>

            <div className="flex items-center justify-between gap-3">
              <div className="text-[10px] text-[var(--color-on-surface-variant)]">
                Vigencia oferta: {o.vigencia} · {o.id}
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/logistica/operadores/${o.operadorId}/reviews`}
                  className="text-xs border border-[var(--color-border-subtle)] px-3 py-1.5 rounded-lg hover:bg-[var(--color-surface-container)] transition-colors text-[var(--color-on-surface-variant)]"
                >
                  Ver reputación
                </Link>
                <Link
                  href={`/logistica/reservas/RES-001`}
                  className="flex items-center gap-1 text-xs bg-[var(--color-primary)] text-white px-4 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Aceptar oferta <ChevronRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Link href={`/logistica/solicitudes/${params.id}/comparar`} className="text-xs text-[var(--color-primary)] hover:underline flex items-center gap-1">
        Ver comparador detallado →
      </Link>
    </div>
  );
}
