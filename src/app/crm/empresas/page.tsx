"use client";

import { useState } from "react";
import { Building2, Search, ChevronRight, Phone, Mail, MapPin, Plus, Filter } from "lucide-react";
import Link from "next/link";

const EMPRESAS = [
  { id: "EMP-001", nombre: "Grupo Agroindustrial S.A.", tipo: "Comprador corporativo", pais: "Colombia", ciudad: "Bogotá", contactos: 4, oportunidades: 3, valor: "$142,000", estado: "Activa" },
  { id: "EMP-002", nombre: "Finca Las Palmas", tipo: "Comprador", pais: "Colombia", ciudad: "Palmira", contactos: 1, oportunidades: 1, valor: "$18,500", estado: "Activa" },
  { id: "EMP-003", nombre: "Cooperativa Boyacá Agro", tipo: "Comprador corporativo", pais: "Colombia", ciudad: "Tunja", contactos: 3, oportunidades: 2, valor: "$67,200", estado: "Activa" },
  { id: "EMP-004", nombre: "Tecnicaña S.A.", tipo: "Comprador", pais: "Colombia", ciudad: "Cali", contactos: 2, oportunidades: 1, valor: "$44,800", estado: "Activa" },
  { id: "EMP-005", nombre: "AgroValle S.A.S.", tipo: "Distribuidor", pais: "Colombia", ciudad: "Bucaramanga", contactos: 2, oportunidades: 4, valor: "$98,300", estado: "Activa" },
  { id: "EMP-006", nombre: "Palmas del Norte", tipo: "Comprador", pais: "Colombia", ciudad: "Valledupar", contactos: 1, oportunidades: 2, valor: "$71,500", estado: "Activa" },
  { id: "EMP-007", nombre: "Agrícola del Llano", tipo: "Comprador", pais: "Colombia", ciudad: "Villavicencio", contactos: 2, oportunidades: 1, valor: "$22,400", estado: "Prospecto" },
  { id: "EMP-008", nombre: "Semillas Nacionales S.A.", tipo: "Proveedor", pais: "Colombia", ciudad: "Medellín", contactos: 3, oportunidades: 0, valor: "$0", estado: "Inactiva" },
];

const TIPO_COLOR: Record<string, string> = {
  "Comprador corporativo": "bg-blue-100 text-blue-700",
  "Comprador": "bg-green-100 text-green-700",
  "Distribuidor": "bg-violet-100 text-violet-700",
  "Proveedor": "bg-orange-100 text-orange-700",
};

const ESTADO_COLOR: Record<string, string> = {
  Activa: "bg-green-100 text-green-700",
  Prospecto: "bg-amber-100 text-amber-700",
  Inactiva: "bg-slate-100 text-slate-600",
};

export default function EmpresasPage() {
  const [busqueda, setBusqueda] = useState("");

  const empresasFiltradas = EMPRESAS.filter(
    (e) =>
      e.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      e.ciudad.toLowerCase().includes(busqueda.toLowerCase()),
  );

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-md font-bold flex items-center gap-2">
            <Building2 size={22} /> Empresas y cuentas
          </h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">{EMPRESAS.length} empresas registradas</p>
        </div>
        <button className="flex items-center gap-2 text-sm bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
          <Plus size={15} /> Nueva empresa
        </button>
      </div>

      {/* Búsqueda y filtros */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]" />
          <input
            type="text"
            placeholder="Buscar por nombre o ciudad..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-20"
          />
        </div>
        <button className="flex items-center gap-2 text-sm border border-[var(--color-border-subtle)] px-4 py-2 rounded-lg hover:bg-[var(--color-surface-container)] transition-colors text-[var(--color-on-surface-variant)]">
          <Filter size={14} /> Filtrar
        </button>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total", valor: EMPRESAS.length, color: "text-[var(--color-on-surface)]" },
          { label: "Activas", valor: EMPRESAS.filter(e => e.estado === "Activa").length, color: "text-green-600" },
          { label: "Prospectos", valor: EMPRESAS.filter(e => e.estado === "Prospecto").length, color: "text-amber-600" },
          { label: "Inactivas", valor: EMPRESAS.filter(e => e.estado === "Inactiva").length, color: "text-slate-400" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.valor}</p>
            <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
        <div className="hidden sm:grid grid-cols-[1fr_120px_120px_80px_80px_100px_80px_40px] px-5 py-3 text-[10px] font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-container)]">
          <span>Empresa</span>
          <span>Tipo</span>
          <span>Ciudad</span>
          <span className="text-right">Contactos</span>
          <span className="text-right">Opps</span>
          <span className="text-right">Valor total</span>
          <span className="text-center">Estado</span>
          <span />
        </div>
        <div className="divide-y divide-[var(--color-border-subtle)]">
          {empresasFiltradas.map((e) => (
            <Link
              key={e.id}
              href={`/crm/clientes/${e.id}/historial`}
              className="flex flex-col sm:grid sm:grid-cols-[1fr_120px_120px_80px_80px_100px_80px_40px] items-start sm:items-center px-5 py-3 gap-1 sm:gap-0 hover:bg-[var(--color-surface-container)] transition-colors"
            >
              <div className="min-w-0">
                <p className="text-xs font-semibold truncate">{e.nombre}</p>
                <p className="text-[10px] text-[var(--color-on-surface-variant)]">{e.id} · {e.pais}</p>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${TIPO_COLOR[e.tipo] ?? "bg-slate-100 text-slate-600"}`}>
                {e.tipo}
              </span>
              <span className="text-xs text-[var(--color-on-surface-variant)] flex items-center gap-1">
                <MapPin size={10} /> {e.ciudad}
              </span>
              <span className="text-xs text-right font-medium">{e.contactos}</span>
              <span className="text-xs text-right font-medium">{e.oportunidades}</span>
              <span className="text-xs text-right font-bold">{e.valor}</span>
              <div className="text-center">
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${ESTADO_COLOR[e.estado]}`}>{e.estado}</span>
              </div>
              <ChevronRight size={14} className="text-[var(--color-on-surface-variant)] justify-self-end" />
            </Link>
          ))}
          {empresasFiltradas.length === 0 && (
            <div className="px-5 py-10 text-center text-sm text-[var(--color-on-surface-variant)]">
              No se encontraron empresas
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4 text-xs text-[var(--color-on-surface-variant)]">
        <Link href="/crm/contactos" className="text-[var(--color-primary)] hover:underline flex items-center gap-1"><Phone size={11} /> Ver contactos</Link>
        <Link href="/crm/leads" className="text-[var(--color-primary)] hover:underline flex items-center gap-1"><Mail size={11} /> Ver leads</Link>
        <Link href="/dashboard/crm" className="text-[var(--color-primary)] hover:underline">← Dashboard CRM</Link>
      </div>
    </div>
  );
}
