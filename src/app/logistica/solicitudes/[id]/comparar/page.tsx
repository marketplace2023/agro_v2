"use client";

import { useParams } from "next/navigation";
import { ChevronLeft, Star, CheckCircle2, XCircle, Minus } from "lucide-react";
import Link from "next/link";

const OFERTAS = [
  {
    id: "OFR-001", operador: "Transportes Andes S.A.S.", operadorId: "OP-001",
    calificacion: 4.8, despachos: 234,
    precio: 1650000, tiempoEstimado: "1 día",
    vehiculo: "Camión doble troque 18t", placa: "XYZ-123",
    conductor: "Pedro Morales", conductorRating: 4.9,
    disponible: "2026-06-14", vigencia: "2026-06-13",
    seguro: "Póliza incluida $50M", garantia: "Entrega garantizada",
    gps: true, rastreo247: true, expertoAgroquimicos: true, flexibilidadHorario: false,
    recomendado: true,
  },
  {
    id: "OFR-002", operador: "LogiCarga Colombia", operadorId: "OP-002",
    calificacion: 4.6, despachos: 187,
    precio: 1480000, tiempoEstimado: "1.5 días",
    vehiculo: "Camión doble troque 16t", placa: "ABC-456",
    conductor: "Luis Castaño", conductorRating: 4.7,
    disponible: "2026-06-14", vigencia: "2026-06-13",
    seguro: "Seguro básico", garantia: "Sin garantía",
    gps: true, rastreo247: false, expertoAgroquimicos: false, flexibilidadHorario: true,
    recomendado: false,
  },
  {
    id: "OFR-003", operador: "Fletes Nacionales Ltda.", operadorId: "OP-003",
    calificacion: 4.4, despachos: 98,
    precio: 2100000, tiempoEstimado: "1 día",
    vehiculo: "Tractomula 30t", placa: "DEF-789",
    conductor: "Ramón García", conductorRating: 4.5,
    disponible: "2026-06-13", vigencia: "2026-06-12",
    seguro: "Todo riesgo $80M", garantia: "Descuento 5% si demora",
    gps: true, rastreo247: true, expertoAgroquimicos: true, flexibilidadHorario: true,
    recomendado: false,
  },
];

const fmt = (n: number) => `$${n.toLocaleString("es-CO")}`;

function Bool({ v }: { v: boolean }) {
  return v
    ? <CheckCircle2 size={15} className="text-green-500 mx-auto" />
    : <XCircle size={15} className="text-slate-300 mx-auto" />;
}

function Diff({ vals, format }: { vals: (number | string)[]; format?: (v: number) => string }) {
  const nums = vals.filter((v) => typeof v === "number") as number[];
  if (nums.length === 0) return null;
  const min = Math.min(...nums);
  const max = Math.max(...nums);
  return (
    <p className="text-[10px] text-[var(--color-on-surface-variant)] text-center mt-0.5">
      Dif: {format ? format(max - min) : `${max - min}`}
    </p>
  );
}

export default function CompararPage() {
  const params = useParams();

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-3">
        <Link href={`/logistica/solicitudes/${params.id}/ofertas`} className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors">
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h1 className="text-headline-md font-bold">Comparador de ofertas</h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">SFL-001 · {OFERTAS.length} ofertas</p>
        </div>
      </div>

      {/* Tabla comparadora */}
      <div className="overflow-x-auto rounded-xl border border-[var(--color-border-subtle)]">
        <table className="w-full min-w-[640px] bg-white text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border-subtle)]">
              <th className="px-4 py-3 text-left text-xs text-[var(--color-on-surface-variant)] font-medium w-44">Criterio</th>
              {OFERTAS.map((o) => (
                <th key={o.id} className={`px-4 py-3 text-center w-48 ${o.recomendado ? "bg-[var(--color-primary)] bg-opacity-5" : ""}`}>
                  <p className="font-semibold text-xs leading-snug">{o.operador}</p>
                  {o.recomendado && <span className="text-[10px] text-[var(--color-primary)] font-medium">Recomendado</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border-subtle)]">
            {/* Precio */}
            <tr>
              <td className="px-4 py-3 text-xs text-[var(--color-on-surface-variant)] font-medium">Precio total</td>
              {OFERTAS.map((o) => (
                <td key={o.id} className={`px-4 py-3 text-center ${o.recomendado ? "bg-[var(--color-primary)] bg-opacity-5" : ""}`}>
                  <p className={`font-bold ${o.precio === Math.min(...OFERTAS.map(x => x.precio)) ? "text-green-600" : o.precio === Math.max(...OFERTAS.map(x => x.precio)) ? "text-red-600" : ""}`}>
                    {fmt(o.precio)}
                  </p>
                </td>
              ))}
            </tr>
            {/* Tiempo estimado */}
            <tr className="bg-[var(--color-surface-container)] bg-opacity-30">
              <td className="px-4 py-3 text-xs text-[var(--color-on-surface-variant)] font-medium">Tiempo estimado</td>
              {OFERTAS.map((o) => (
                <td key={o.id} className={`px-4 py-3 text-center text-xs ${o.recomendado ? "bg-[var(--color-primary)] bg-opacity-5" : ""}`}>
                  {o.tiempoEstimado}
                </td>
              ))}
            </tr>
            {/* Calificación operador */}
            <tr>
              <td className="px-4 py-3 text-xs text-[var(--color-on-surface-variant)] font-medium">Rating operador</td>
              {OFERTAS.map((o) => (
                <td key={o.id} className={`px-4 py-3 text-center ${o.recomendado ? "bg-[var(--color-primary)] bg-opacity-5" : ""}`}>
                  <div className="flex items-center justify-center gap-0.5">
                    <Star size={12} className="text-amber-400 fill-amber-400" />
                    <span className="font-semibold text-xs">{o.calificacion}</span>
                  </div>
                  <p className="text-[10px] text-[var(--color-on-surface-variant)]">{o.despachos} despachos</p>
                </td>
              ))}
            </tr>
            {/* Vehículo */}
            <tr className="bg-[var(--color-surface-container)] bg-opacity-30">
              <td className="px-4 py-3 text-xs text-[var(--color-on-surface-variant)] font-medium">Vehículo</td>
              {OFERTAS.map((o) => (
                <td key={o.id} className={`px-4 py-3 text-center text-xs ${o.recomendado ? "bg-[var(--color-primary)] bg-opacity-5" : ""}`}>
                  <p className="font-medium leading-snug">{o.vehiculo}</p>
                  <p className="font-mono text-[var(--color-on-surface-variant)]">{o.placa}</p>
                </td>
              ))}
            </tr>
            {/* Conductor */}
            <tr>
              <td className="px-4 py-3 text-xs text-[var(--color-on-surface-variant)] font-medium">Conductor</td>
              {OFERTAS.map((o) => (
                <td key={o.id} className={`px-4 py-3 text-center text-xs ${o.recomendado ? "bg-[var(--color-primary)] bg-opacity-5" : ""}`}>
                  <p>{o.conductor}</p>
                  <div className="flex items-center justify-center gap-0.5 mt-0.5">
                    <Star size={10} className="text-amber-400 fill-amber-400" />
                    <span className="font-semibold">{o.conductorRating}</span>
                  </div>
                </td>
              ))}
            </tr>
            {/* Disponible */}
            <tr className="bg-[var(--color-surface-container)] bg-opacity-30">
              <td className="px-4 py-3 text-xs text-[var(--color-on-surface-variant)] font-medium">Disponible desde</td>
              {OFERTAS.map((o) => (
                <td key={o.id} className={`px-4 py-3 text-center text-xs ${o.recomendado ? "bg-[var(--color-primary)] bg-opacity-5" : ""}`}>
                  {o.disponible}
                </td>
              ))}
            </tr>
            {/* Seguro */}
            <tr>
              <td className="px-4 py-3 text-xs text-[var(--color-on-surface-variant)] font-medium">Seguro</td>
              {OFERTAS.map((o) => (
                <td key={o.id} className={`px-4 py-3 text-center text-xs ${o.recomendado ? "bg-[var(--color-primary)] bg-opacity-5" : ""}`}>
                  {o.seguro}
                </td>
              ))}
            </tr>
            {/* Garantía */}
            <tr className="bg-[var(--color-surface-container)] bg-opacity-30">
              <td className="px-4 py-3 text-xs text-[var(--color-on-surface-variant)] font-medium">Garantía entrega</td>
              {OFERTAS.map((o) => (
                <td key={o.id} className={`px-4 py-3 text-center text-xs ${o.recomendado ? "bg-[var(--color-primary)] bg-opacity-5" : ""}`}>
                  {o.garantia}
                </td>
              ))}
            </tr>
            {/* GPS */}
            <tr>
              <td className="px-4 py-3 text-xs text-[var(--color-on-surface-variant)] font-medium">GPS tiempo real</td>
              {OFERTAS.map((o) => (
                <td key={o.id} className={`px-4 py-3 ${o.recomendado ? "bg-[var(--color-primary)] bg-opacity-5" : ""}`}>
                  <Bool v={o.gps} />
                </td>
              ))}
            </tr>
            {/* Rastreo 24/7 */}
            <tr className="bg-[var(--color-surface-container)] bg-opacity-30">
              <td className="px-4 py-3 text-xs text-[var(--color-on-surface-variant)] font-medium">Rastreo 24/7</td>
              {OFERTAS.map((o) => (
                <td key={o.id} className={`px-4 py-3 ${o.recomendado ? "bg-[var(--color-primary)] bg-opacity-5" : ""}`}>
                  <Bool v={o.rastreo247} />
                </td>
              ))}
            </tr>
            {/* Exp agroquímicos */}
            <tr>
              <td className="px-4 py-3 text-xs text-[var(--color-on-surface-variant)] font-medium">Exp. agroquímicos</td>
              {OFERTAS.map((o) => (
                <td key={o.id} className={`px-4 py-3 ${o.recomendado ? "bg-[var(--color-primary)] bg-opacity-5" : ""}`}>
                  <Bool v={o.expertoAgroquimicos} />
                </td>
              ))}
            </tr>
            {/* CTA */}
            <tr className="border-t-2 border-[var(--color-border-subtle)]">
              <td className="px-4 py-4" />
              {OFERTAS.map((o) => (
                <td key={o.id} className={`px-4 py-4 text-center ${o.recomendado ? "bg-[var(--color-primary)] bg-opacity-5" : ""}`}>
                  <Link
                    href="/logistica/reservas/RES-001"
                    className={`text-xs px-4 py-2 rounded-lg transition-opacity inline-block ${o.recomendado ? "bg-[var(--color-primary)] text-white hover:opacity-90" : "border border-[var(--color-border-subtle)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)]"}`}
                  >
                    {o.recomendado ? "Seleccionar" : "Elegir esta"}
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <Diff vals={OFERTAS.map(o => o.precio)} format={fmt} />

      <p className="text-[10px] text-[var(--color-on-surface-variant)] text-center">
        La recomendación se basa en calificación del operador, historial de despachos y cobertura de seguro.
      </p>
    </div>
  );
}
