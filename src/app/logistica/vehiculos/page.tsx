"use client";

import { useState } from "react";
import { Truck, Plus, Search, Filter, ChevronRight, AlertTriangle, Calendar, Weight } from "lucide-react";
import Link from "next/link";

const VEHICULOS = [
  { id: "VEH-001", placa: "UVW-456", tipo: "Camión doble troque", capacidad: "18 t", flota: "Flota Regional Bogotá", estado: "Disponible", soatVence: "2026-06-29", tecnoVence: "2026-09-15", km: "124,500", ultimoDespacho: "2026-06-08", observaciones: "" },
  { id: "VEH-002", placa: "XYZ-789", tipo: "Camión sencillo", capacidad: "8 t", flota: "Flota Regional Bogotá", estado: "En tránsito", soatVence: "2026-11-20", tecnoVence: "2027-01-10", km: "87,300", ultimoDespacho: "2026-06-11", observaciones: "Ruta Bogotá → Cali — ETA 2026-06-12" },
  { id: "VEH-003", placa: "RST-321", tipo: "Tractomula", capacidad: "34 t", flota: "Flota Regional Bogotá", estado: "Disponible", soatVence: "2026-12-05", tecnoVence: "2027-02-28", km: "312,000", ultimoDespacho: "2026-06-05", observaciones: "" },
  { id: "VEH-004", placa: "MNO-654", tipo: "Camión sencillo", capacidad: "8 t", flota: "Flota Regional Bogotá", estado: "Mantenimiento", soatVence: "2026-08-14", tecnoVence: "2026-10-22", km: "203,100", ultimoDespacho: "2026-05-28", observaciones: "Revisión de frenos — regresa 2026-06-14" },
  { id: "VEH-005", placa: "PQR-987", tipo: "Camión doble troque", capacidad: "18 t", flota: "Flota Local Medellín", estado: "En tránsito", soatVence: "2026-10-30", tecnoVence: "2026-12-15", km: "156,800", ultimoDespacho: "2026-06-10", observaciones: "Ruta Medellín → Manizales — ETA 2026-06-11" },
  { id: "VEH-006", placa: "DEF-147", tipo: "Camión sencillo", capacidad: "8 t", flota: "Flota Local Medellín", estado: "Disponible", soatVence: "2026-07-18", tecnoVence: "2026-09-05", km: "64,200", ultimoDespacho: "2026-06-07", observaciones: "" },
];

const ESTADO_COLOR: Record<string, string> = {
  Disponible: "bg-green-100 text-green-700",
  "En tránsito": "bg-blue-100 text-blue-700",
  Mantenimiento: "bg-amber-100 text-amber-700",
  Inactivo: "bg-slate-100 text-slate-500",
};

const ESTADOS = ["Todos", "Disponible", "En tránsito", "Mantenimiento"];

function soatAlert(fecha: string) {
  const dias = Math.floor((new Date(fecha).getTime() - new Date("2026-06-11").getTime()) / 86400000);
  return dias <= 30;
}

export default function VehiculosPage() {
  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");

  const filtrados = VEHICULOS.filter((v) => {
    const coincide = v.placa.toLowerCase().includes(busqueda.toLowerCase()) || v.tipo.toLowerCase().includes(busqueda.toLowerCase());
    const estadoOk = estadoFiltro === "Todos" || v.estado === estadoFiltro;
    return coincide && estadoOk;
  });

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-md font-bold flex items-center gap-2">
            <Truck size={22} /> Vehículos
          </h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">{VEHICULOS.length} vehículos registrados</p>
        </div>
        <div className="flex gap-2">
          <Link href="/logistica/flota" className="text-sm border border-[var(--color-border-subtle)] px-4 py-2 rounded-lg hover:bg-[var(--color-surface-container)] transition-colors text-[var(--color-on-surface-variant)]">
            Ver flotas
          </Link>
          <button className="flex items-center gap-2 text-sm bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
            <Plus size={15} /> Nuevo vehículo
          </button>
        </div>
      </div>

      {/* Búsqueda y filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]" />
          <input
            type="text"
            placeholder="Buscar por placa o tipo..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-20"
          />
        </div>
        <div className="flex gap-2">
          {ESTADOS.map((e) => (
            <button
              key={e}
              onClick={() => setEstadoFiltro(e)}
              className={`text-xs px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${estadoFiltro === e ? "bg-[var(--color-primary)] text-white" : "border border-[var(--color-border-subtle)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)]"}`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Disponibles", valor: VEHICULOS.filter(v => v.estado === "Disponible").length, color: "text-green-600" },
          { label: "En tránsito", valor: VEHICULOS.filter(v => v.estado === "En tránsito").length, color: "text-blue-600" },
          { label: "Mantenimiento", valor: VEHICULOS.filter(v => v.estado === "Mantenimiento").length, color: "text-amber-600" },
          { label: "Docs por vencer", valor: VEHICULOS.filter(v => soatAlert(v.soatVence)).length, color: "text-red-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-4">
            <p className={`text-2xl font-bold ${s.color}`}>{s.valor}</p>
            <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Lista */}
      <div className="space-y-3">
        {filtrados.map((v) => (
          <div key={v.id} className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className="font-bold text-sm font-mono">{v.placa}</span>
                  <span className="text-xs text-[var(--color-on-surface-variant)]">{v.tipo}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${ESTADO_COLOR[v.estado]}`}>{v.estado}</span>
                  {soatAlert(v.soatVence) && (
                    <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded flex items-center gap-0.5 font-medium">
                      <AlertTriangle size={9} /> SOAT próximo a vencer
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-[var(--color-on-surface-variant)]">
                  <div className="flex items-center gap-1"><Weight size={10} /> {v.capacidad}</div>
                  <div className="flex items-center gap-1"><Truck size={10} /> {v.km} km</div>
                  <div className="flex items-center gap-1"><Calendar size={10} /> SOAT: {v.soatVence}</div>
                  <div className="flex items-center gap-1"><Calendar size={10} /> Tecno: {v.tecnoVence}</div>
                </div>
                <p className="text-xs text-[var(--color-on-surface-variant)] mt-1">{v.flota}</p>
                {v.observaciones && (
                  <p className="text-xs text-amber-700 mt-1 flex items-center gap-1">
                    <AlertTriangle size={11} /> {v.observaciones}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button className="text-xs border border-[var(--color-border-subtle)] px-3 py-1.5 rounded-lg hover:bg-[var(--color-surface-container)] transition-colors flex items-center gap-1">
                  Editar <ChevronRight size={11} />
                </button>
                {v.estado === "Disponible" && (
                  <Link href={`/logistica/retiros/RET-001`} className="text-xs bg-[var(--color-primary)] text-white px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity text-center">
                    Programar
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
        {filtrados.length === 0 && (
          <div className="py-10 text-center text-sm text-[var(--color-on-surface-variant)] bg-white rounded-xl border border-[var(--color-border-subtle)]">
            No se encontraron vehículos
          </div>
        )}
      </div>

      <Link href="/logistica/flota" className="text-xs text-[var(--color-primary)] hover:underline flex items-center gap-1">
        ← Volver a flotas
      </Link>
    </div>
  );
}
