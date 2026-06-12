"use client";

import { useState } from "react";
import { Users, Plus, Search, Phone, Star, AlertTriangle, Truck, Calendar } from "lucide-react";
import Link from "next/link";

const CONDUCTORES = [
  { id: "CON-D01", nombre: "Jorge Mena", doc: "C.C. 1.020.345.678", telefono: "+57 311 100 2233", licencia: "C3 — Carga especial", licenciaVence: "2026-07-15", flota: "Flota Regional Bogotá", vehiculo: "UVW-456", estado: "Disponible", calificacion: 4.8, despachos: 34, kmRecorridos: "124,500" },
  { id: "CON-D02", nombre: "Carlos Betancur", doc: "C.C. 98.765.432", telefono: "+57 315 200 3344", licencia: "C2 — Camión sencillo", licenciaVence: "2027-03-20", flota: "Flota Regional Bogotá", vehiculo: "XYZ-789", estado: "En ruta", calificacion: 4.6, despachos: 21, kmRecorridos: "87,300" },
  { id: "CON-D03", nombre: "Hernán Cifuentes", doc: "C.C. 12.345.678", telefono: "+57 320 300 4455", licencia: "C3E — Tractomula", licenciaVence: "2026-12-01", flota: "Flota Regional Bogotá", vehiculo: "RST-321", estado: "Disponible", calificacion: 4.9, despachos: 58, kmRecorridos: "312,000" },
  { id: "CON-D04", nombre: "Ricardo Palomino", doc: "C.C. 71.234.567", telefono: "+57 316 400 5566", licencia: "C2 — Camión doble troque", licenciaVence: "2027-01-10", flota: "Flota Local Medellín", vehiculo: "PQR-987", estado: "En ruta", calificacion: 4.7, despachos: 29, kmRecorridos: "156,800" },
  { id: "CON-D05", nombre: "Gustavo Arenas", doc: "C.C. 34.567.890", telefono: "+57 313 500 6677", licencia: "C2 — Camión sencillo", licenciaVence: "2026-09-30", flota: "Flota Local Medellín", vehiculo: "DEF-147", estado: "Disponible", calificacion: 4.5, despachos: 12, kmRecorridos: "64,200" },
];

const ESTADO_COLOR: Record<string, string> = {
  Disponible: "bg-green-100 text-green-700",
  "En ruta": "bg-blue-100 text-blue-700",
  "Día libre": "bg-slate-100 text-slate-600",
  Inactivo: "bg-red-100 text-red-600",
};

function licenciaAlert(fecha: string) {
  const dias = Math.floor((new Date(fecha).getTime() - new Date("2026-06-11").getTime()) / 86400000);
  return dias <= 60;
}

export default function ConductoresPage() {
  const [busqueda, setBusqueda] = useState("");

  const filtrados = CONDUCTORES.filter(
    (c) =>
      c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.vehiculo.toLowerCase().includes(busqueda.toLowerCase()),
  );

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-md font-bold flex items-center gap-2">
            <Users size={22} /> Conductores
          </h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">{CONDUCTORES.length} conductores registrados</p>
        </div>
        <div className="flex gap-2">
          <Link href="/logistica/flota" className="text-sm border border-[var(--color-border-subtle)] px-4 py-2 rounded-lg hover:bg-[var(--color-surface-container)] transition-colors text-[var(--color-on-surface-variant)]">
            Ver flotas
          </Link>
          <button className="flex items-center gap-2 text-sm bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
            <Plus size={15} /> Nuevo conductor
          </button>
        </div>
      </div>

      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]" />
        <input
          type="text"
          placeholder="Buscar por nombre o placa asignada..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-20"
        />
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Disponibles", valor: CONDUCTORES.filter(c => c.estado === "Disponible").length, color: "text-green-600" },
          { label: "En ruta", valor: CONDUCTORES.filter(c => c.estado === "En ruta").length, color: "text-blue-600" },
          { label: "Total despachos", valor: CONDUCTORES.reduce((s, c) => s + c.despachos, 0), color: "text-[var(--color-primary)]" },
          { label: "Licencias por vencer", valor: CONDUCTORES.filter(c => licenciaAlert(c.licenciaVence)).length, color: "text-red-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-4">
            <p className={`text-2xl font-bold ${s.color}`}>{s.valor}</p>
            <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Cards conductores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtrados.map((c) => (
          <div key={c.id} className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] bg-opacity-10 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-[var(--color-primary)]">
                  {c.nombre.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-sm">{c.nombre}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${ESTADO_COLOR[c.estado]}`}>{c.estado}</span>
                </div>
                <p className="text-[11px] text-[var(--color-on-surface-variant)]">{c.doc}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Star size={12} className="text-amber-400 fill-amber-400" />
                <span className="text-xs font-bold">{c.calificacion}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-[var(--color-on-surface-variant)]">
                <Phone size={11} className="shrink-0" />
                <a href={`tel:${c.telefono}`} className="hover:text-[var(--color-on-surface)] transition-colors">{c.telefono}</a>
              </div>
              <div className="flex items-center gap-2 text-[var(--color-on-surface-variant)]">
                <Truck size={11} className="shrink-0" />
                <span>Vehículo asignado: <span className="font-medium text-[var(--color-on-surface)] font-mono">{c.vehiculo}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={11} className="shrink-0 text-[var(--color-on-surface-variant)]" />
                <span className={licenciaAlert(c.licenciaVence) ? "text-red-600 font-medium" : "text-[var(--color-on-surface-variant)]"}>
                  Licencia {c.licencia} · vence {c.licenciaVence}
                  {licenciaAlert(c.licenciaVence) && " ⚠️"}
                </span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-[var(--color-border-subtle)] flex justify-between text-xs text-[var(--color-on-surface-variant)]">
              <span>{c.despachos} despachos</span>
              <span>{c.kmRecorridos} km</span>
              <span>{c.flota}</span>
            </div>
          </div>
        ))}
        {filtrados.length === 0 && (
          <div className="col-span-full py-10 text-center text-sm text-[var(--color-on-surface-variant)] bg-white rounded-xl border border-[var(--color-border-subtle)]">
            No se encontraron conductores
          </div>
        )}
      </div>

      <Link href="/logistica/flota" className="text-xs text-[var(--color-primary)] hover:underline flex items-center gap-1">
        ← Volver a flotas
      </Link>
    </div>
  );
}
