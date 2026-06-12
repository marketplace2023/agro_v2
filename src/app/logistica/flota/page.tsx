"use client";

import { Truck, Plus, ChevronRight, Users, MapPin, Star, AlertTriangle } from "lucide-react";
import Link from "next/link";

const STATS = [
  { label: "Vehículos activos", valor: "6", color: "text-green-600" },
  { label: "Conductores disponibles", valor: "4", color: "text-blue-600" },
  { label: "Despachos este mes", valor: "18", color: "text-[var(--color-primary)]" },
  { label: "En tránsito ahora", valor: "2", color: "text-amber-600" },
];

const FLOTAS = [
  {
    id: "FLT-001",
    nombre: "Flota Regional Bogotá",
    zona: "Bogotá → Costa Atlántica, Llanos, Eje Cafetero",
    vehiculos: 4,
    conductores: 4,
    capacidadTotal: "68 t",
    despachosMes: 12,
    calificacion: 4.8,
    estado: "Activa",
  },
  {
    id: "FLT-002",
    nombre: "Flota Local Medellín",
    zona: "Antioquia y Eje Cafetero",
    vehiculos: 2,
    conductores: 2,
    capacidadTotal: "26 t",
    despachosMes: 6,
    calificacion: 4.7,
    estado: "Activa",
  },
];

const ALERTAS = [
  { tipo: "warning", msg: "Vehículo UVW-456 — SOAT vence en 18 días." },
  { tipo: "warning", msg: "Conductor Jorge Mena — Licencia vence en 32 días." },
  { tipo: "info", msg: "2 despachos programados para mañana 2026-06-12." },
];

export default function FlotaPage() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-md font-bold flex items-center gap-2">
            <Truck size={22} /> Flota propia
          </h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">DistAgroMax — gestión de vehículos y conductores propios</p>
        </div>
        <button className="flex items-center gap-2 text-sm bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
          <Plus size={15} /> Nueva flota
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-4">
            <p className={`text-2xl font-bold ${s.color}`}>{s.valor}</p>
            <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Alertas */}
      {ALERTAS.length > 0 && (
        <div className="space-y-2">
          {ALERTAS.map((a, i) => (
            <div key={i} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm ${a.tipo === "warning" ? "bg-amber-50 border border-amber-200 text-amber-800" : "bg-blue-50 border border-blue-200 text-blue-800"}`}>
              <AlertTriangle size={15} className="shrink-0" />
              {a.msg}
            </div>
          ))}
        </div>
      )}

      {/* Flotas */}
      <div className="space-y-4">
        <h2 className="font-semibold text-sm">Flotas registradas</h2>
        {FLOTAS.map((f) => (
          <div key={f.id} className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5 hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm">{f.nombre}</h3>
                  <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">{f.estado}</span>
                </div>
                <p className="text-xs text-[var(--color-on-surface-variant)] flex items-center gap-1 mt-1">
                  <MapPin size={10} /> {f.zona}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Star size={13} className="text-amber-400 fill-amber-400" />
                <span className="text-sm font-bold">{f.calificacion}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs mb-4">
              <div className="text-center p-3 bg-[var(--color-surface-container)] rounded-lg">
                <p className="text-xl font-bold text-[var(--color-primary)]">{f.vehiculos}</p>
                <p className="text-[var(--color-on-surface-variant)]">Vehículos</p>
              </div>
              <div className="text-center p-3 bg-[var(--color-surface-container)] rounded-lg">
                <p className="text-xl font-bold text-[var(--color-primary)]">{f.conductores}</p>
                <p className="text-[var(--color-on-surface-variant)]">Conductores</p>
              </div>
              <div className="text-center p-3 bg-[var(--color-surface-container)] rounded-lg">
                <p className="text-xl font-bold">{f.capacidadTotal}</p>
                <p className="text-[var(--color-on-surface-variant)]">Cap. total</p>
              </div>
              <div className="text-center p-3 bg-[var(--color-surface-container)] rounded-lg">
                <p className="text-xl font-bold">{f.despachosMes}</p>
                <p className="text-[var(--color-on-surface-variant)]">Despachos/mes</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href="/logistica/vehiculos" className="flex-1 text-center text-xs border border-[var(--color-border-subtle)] py-2 rounded-lg hover:bg-[var(--color-surface-container)] transition-colors flex items-center justify-center gap-1">
                <Truck size={12} /> Ver vehículos
              </Link>
              <Link href="/logistica/conductores" className="flex-1 text-center text-xs border border-[var(--color-border-subtle)] py-2 rounded-lg hover:bg-[var(--color-surface-container)] transition-colors flex items-center justify-center gap-1">
                <Users size={12} /> Ver conductores
              </Link>
              <button className="flex items-center gap-1 text-xs text-[var(--color-primary)] border border-[var(--color-primary)] border-opacity-40 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                Gestionar <ChevronRight size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Accesos rápidos */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Vehículos", href: "/logistica/vehiculos", icon: <Truck size={18} /> },
          { label: "Conductores", href: "/logistica/conductores", icon: <Users size={18} /> },
          { label: "Zonas de cobertura", href: "/logistica/flota", icon: <MapPin size={18} /> },
          { label: "Retiros programados", href: "/logistica/retiros/RET-001", icon: <ChevronRight size={18} /> },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-[var(--color-border-subtle)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors text-[var(--color-on-surface-variant)]"
          >
            {item.icon}
            <span className="text-xs font-medium text-center">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
