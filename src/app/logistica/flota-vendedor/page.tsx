"use client";

import { useState } from "react";
import { Truck, ChevronLeft, ChevronRight, CheckCircle2, MapPin, Calendar, Weight, User, Star } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const VEHICULOS_DISPONIBLES = [
  {
    id: "VEH-001",
    placa: "UVW-456",
    tipo: "Camión doble troque",
    capacidad: "18 t",
    conductor: "Jorge Mena",
    calificacion: 4.8,
    zona: "Bogotá → Costa Atlántica",
    disponible: "2026-06-14",
    tarifa: "$1,850,000",
    seguro: "Póliza 2024-BR-001",
    estado: "Disponible",
  },
  {
    id: "VEH-002",
    placa: "XYZ-789",
    tipo: "Camión sencillo",
    capacidad: "8 t",
    conductor: "Carlos Betancur",
    calificacion: 4.6,
    zona: "Bogotá → Eje Cafetero / Sur",
    disponible: "2026-06-15",
    tarifa: "$1,200,000",
    seguro: "Póliza 2024-BR-002",
    estado: "Disponible",
  },
  {
    id: "VEH-003",
    placa: "RST-321",
    tipo: "Tractomula",
    capacidad: "34 t",
    conductor: "Hernán Cifuentes",
    calificacion: 4.9,
    zona: "Nacional — todas las rutas",
    disponible: "2026-06-16",
    tarifa: "$3,400,000",
    seguro: "Póliza 2024-BR-003",
    estado: "Disponible",
  },
];

export default function FlotaVendedorPage() {
  const router = useRouter();
  const [seleccion, setSeleccion] = useState<string | null>(null);
  const [fechaConfirmada, setFechaConfirmada] = useState("2026-06-14");

  const vehiculo = VEHICULOS_DISPONIBLES.find((v) => v.id === seleccion);

  return (
    <div className="min-h-screen bg-[var(--color-background-alt)]">
      <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/checkout/logistica" className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2"><Truck size={20} /> Flota del vendedor</h1>
            <p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">
              Orden ORD-2026-122 · Elige un vehículo disponible de DistAgroMax
            </p>
          </div>
        </div>

        {/* Resumen envío */}
        <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="flex items-start gap-1.5"><MapPin size={12} className="text-[var(--color-on-surface-variant)] mt-0.5 shrink-0" /><div><p className="text-[var(--color-on-surface-variant)]">Origen</p><p className="font-medium">Bogotá, Colombia</p></div></div>
            <div className="flex items-start gap-1.5"><MapPin size={12} className="text-[var(--color-on-surface-variant)] mt-0.5 shrink-0" /><div><p className="text-[var(--color-on-surface-variant)]">Destino</p><p className="font-medium">Valledupar, Cesar</p></div></div>
            <div className="flex items-start gap-1.5"><Weight size={12} className="text-[var(--color-on-surface-variant)] mt-0.5 shrink-0" /><div><p className="text-[var(--color-on-surface-variant)]">Carga</p><p className="font-medium">10 t · 12 m³</p></div></div>
            <div className="flex items-start gap-1.5"><Calendar size={12} className="text-[var(--color-on-surface-variant)] mt-0.5 shrink-0" /><div><p className="text-[var(--color-on-surface-variant)]">Fecha requerida</p><p className="font-medium">2026-06-16</p></div></div>
          </div>
        </div>

        {/* Vehículos disponibles */}
        <div className="space-y-3">
          <h2 className="font-semibold text-sm">Vehículos disponibles ({VEHICULOS_DISPONIBLES.length})</h2>
          {VEHICULOS_DISPONIBLES.map((v) => (
            <button
              key={v.id}
              onClick={() => setSeleccion(v.id)}
              className={`w-full text-left bg-white rounded-xl border-2 p-5 transition-all hover:shadow-sm ${
                seleccion === v.id
                  ? "border-[var(--color-primary)] ring-2 ring-[var(--color-primary)] ring-opacity-20"
                  : "border-[var(--color-border-subtle)]"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="font-bold text-sm font-mono">{v.placa}</span>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{v.tipo}</span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">{v.estado}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-[var(--color-on-surface-variant)]">
                    <div>
                      <p className="font-medium text-[var(--color-on-surface)]"><Weight size={10} className="inline mr-1" />{v.capacidad}</p>
                      <p>capacidad</p>
                    </div>
                    <div>
                      <p className="font-medium text-[var(--color-on-surface)] flex items-center gap-1">
                        <User size={10} /> {v.conductor}
                      </p>
                      <p className="flex items-center gap-0.5">
                        <Star size={9} className="text-amber-400 fill-amber-400" /> {v.calificacion}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-[var(--color-on-surface)]"><Calendar size={10} className="inline mr-1" />{v.disponible}</p>
                      <p>disponible desde</p>
                    </div>
                    <div>
                      <p className="font-medium text-[var(--color-on-surface)]">{v.zona}</p>
                      <p>zona de cobertura</p>
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-lg font-bold text-[var(--color-primary)]">{v.tarifa}</p>
                  <p className="text-[10px] text-[var(--color-on-surface-variant)]">costo de flete</p>
                  <div className={`mt-2 w-5 h-5 rounded-full border-2 flex items-center justify-center ml-auto ${
                    seleccion === v.id
                      ? "border-[var(--color-primary)] bg-[var(--color-primary)]"
                      : "border-[var(--color-border-subtle)]"
                  }`}>
                    {seleccion === v.id && <CheckCircle2 size={14} className="text-white" />}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Fecha de retiro */}
        {seleccion && (
          <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5 space-y-4">
            <h2 className="font-semibold text-sm">Confirmar fecha de retiro</h2>
            <div>
              <label className="block text-xs font-medium mb-1.5">Fecha de salida desde bodega *</label>
              <input
                type="date"
                value={fechaConfirmada}
                onChange={(e) => setFechaConfirmada(e.target.value)}
                min={vehiculo?.disponible}
                className="w-full px-4 py-2.5 text-sm border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-20"
              />
              {vehiculo && (
                <p className="text-[11px] text-[var(--color-on-surface-variant)] mt-1">
                  Disponible desde {vehiculo.disponible}. Tiempo estimado de tránsito: 1–2 días.
                </p>
              )}
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-xs text-green-800">
                <strong>Resumen:</strong> {vehiculo?.tipo} · {vehiculo?.placa} · Conductor {vehiculo?.conductor} · Salida {fechaConfirmada} · Costo {vehiculo?.tarifa}
              </p>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <Link href="/checkout/logistica" className="flex-1 text-center border border-[var(--color-border-subtle)] py-3 rounded-xl text-sm hover:bg-[var(--color-surface-container)] transition-colors text-[var(--color-on-surface-variant)]">
            Volver
          </Link>
          <button
            disabled={!seleccion}
            onClick={() => router.push("/ordenes/ORD-2026-122")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-opacity ${
              seleccion
                ? "bg-[var(--color-primary)] text-white hover:opacity-90"
                : "bg-[var(--color-border-subtle)] text-[var(--color-on-surface-variant)] cursor-not-allowed"
            }`}
          >
            Confirmar despacho <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
