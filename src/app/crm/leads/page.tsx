"use client";

import { useState } from "react";
import { AlertCircle, Search, Plus, Filter, ChevronRight, Phone, Calendar, User } from "lucide-react";
import Link from "next/link";

const LEADS = [
  { id: "LED-001", nombre: "Finca El Progreso", contacto: "Jorge Quintero", telefono: "+57 316 000 1111", origen: "WhatsApp", producto: "Fertilizantes NPK", valorEst: "$12,000", estado: "Nuevo lead", fecha: "2026-06-10", vendedor: "Luis Pérez", prioritario: true },
  { id: "LED-002", nombre: "Agropecuaria Simón", contacto: "Simón Restrepo", telefono: "+57 313 222 3333", origen: "Web", producto: "Herbicidas selectivos", valorEst: "$8,500", estado: "Contactado", fecha: "2026-06-09", vendedor: "Luis Pérez", prioritario: false },
  { id: "LED-003", nombre: "Granjas del Sur", contacto: "Olga Muñoz", telefono: "+57 318 444 5555", origen: "Referido", producto: "Insecticidas biológicos", valorEst: "$5,200", estado: "Necesidad identificada", fecha: "2026-06-08", vendedor: "María Gómez", prioritario: true },
  { id: "LED-004", nombre: "Hacienda La Esperanza", contacto: "Andrés Lozano", telefono: "+57 322 666 7777", origen: "Expo Agro", producto: "Fungicidas sistémicos", valorEst: "$18,900", estado: "Oferta en preparación", fecha: "2026-06-07", vendedor: "María Gómez", prioritario: false },
  { id: "LED-005", nombre: "Campo Verde S.A.S.", contacto: "Rosa Jiménez", telefono: "+57 319 888 9999", origen: "LinkedIn", producto: "Fertilizantes foliares", valorEst: "$7,100", estado: "Nuevo lead", fecha: "2026-06-11", vendedor: "Luis Pérez", prioritario: false },
  { id: "LED-006", nombre: "Cultivos Orgánicos Nariño", contacto: "Felipe Castro", telefono: "+57 314 012 3456", origen: "Web", producto: "Biológicos", valorEst: "$3,400", estado: "Contactado", fecha: "2026-06-06", vendedor: "Carlos Díaz", prioritario: false },
  { id: "LED-007", nombre: "Inversiones Agro del Caribe", contacto: "Luisa Vargas", telefono: "+57 320 345 6789", origen: "Referido", producto: "Nutrición foliar premium", valorEst: "$24,000", estado: "Necesidad identificada", fecha: "2026-06-05", vendedor: "María Gómez", prioritario: true },
];

const ESTADO_COLOR: Record<string, string> = {
  "Nuevo lead": "bg-slate-100 text-slate-600",
  "Contactado": "bg-blue-100 text-blue-700",
  "Necesidad identificada": "bg-violet-100 text-violet-700",
  "Oferta en preparación": "bg-amber-100 text-amber-700",
};

const ETAPAS = ["Todos", "Nuevo lead", "Contactado", "Necesidad identificada", "Oferta en preparación"];

export default function LeadsPage() {
  const [busqueda, setBusqueda] = useState("");
  const [etapa, setEtapa] = useState("Todos");

  const filtrados = LEADS.filter((l) => {
    const coincideBusqueda =
      l.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      l.contacto.toLowerCase().includes(busqueda.toLowerCase());
    const coincideEtapa = etapa === "Todos" || l.estado === etapa;
    return coincideBusqueda && coincideEtapa;
  });

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-md font-bold flex items-center gap-2">
            <AlertCircle size={22} /> Leads
          </h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">{LEADS.length} leads activos</p>
        </div>
        <button className="flex items-center gap-2 text-sm bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
          <Plus size={15} /> Nuevo lead
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]" />
          <input
            type="text"
            placeholder="Buscar por empresa o contacto..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-20"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {ETAPAS.map((e) => (
            <button
              key={e}
              onClick={() => setEtapa(e)}
              className={`text-xs px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
                etapa === e
                  ? "bg-[var(--color-primary)] text-white"
                  : "border border-[var(--color-border-subtle)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)]"
              }`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Valor total estimado", valor: "$79,100", sub: "todos los leads" },
          { label: "Nuevos esta semana", valor: "3", sub: "LED-005, LED-001, LED-002" },
          { label: "Prioritarios", valor: LEADS.filter(l => l.prioritario).length.toString(), sub: "requieren acción" },
          { label: "Tiempo promedio", valor: "4.2 días", sub: "para primer contacto" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-4">
            <p className="text-xl font-bold">{s.valor}</p>
            <p className="text-xs font-medium text-[var(--color-on-surface)] mt-0.5">{s.label}</p>
            <p className="text-[10px] text-[var(--color-on-surface-variant)] mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Lista */}
      <div className="space-y-3">
        {filtrados.map((l) => (
          <Link
            key={l.id}
            href={`/crm/oportunidades/${l.id}`}
            className="flex items-start gap-4 bg-white rounded-xl border border-[var(--color-border-subtle)] p-4 hover:shadow-sm transition-shadow"
          >
            {l.prioritario && (
              <div className="w-1 self-stretch bg-red-400 rounded-full shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <p className="text-sm font-semibold">{l.nombre}</p>
                {l.prioritario && (
                  <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-medium">Prioritario</span>
                )}
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${ESTADO_COLOR[l.estado]}`}>
                  {l.estado}
                </span>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[var(--color-on-surface-variant)]">
                <span className="flex items-center gap-1"><User size={10} /> {l.contacto}</span>
                <span className="flex items-center gap-1"><Phone size={10} /> {l.telefono}</span>
                <span className="flex items-center gap-1"><Calendar size={10} /> {l.fecha}</span>
                <span>Origen: {l.origen}</span>
                <span>Vendedor: {l.vendedor}</span>
              </div>
              <p className="text-xs mt-1.5">
                Producto: <span className="font-medium">{l.producto}</span>
                <span className="ml-3 font-bold text-[var(--color-primary)]">{l.valorEst}</span>
              </p>
            </div>
            <ChevronRight size={16} className="text-[var(--color-on-surface-variant)] mt-1 shrink-0" />
          </Link>
        ))}
        {filtrados.length === 0 && (
          <div className="py-10 text-center text-sm text-[var(--color-on-surface-variant)] bg-white rounded-xl border border-[var(--color-border-subtle)]">
            No se encontraron leads
          </div>
        )}
      </div>

      <div className="flex gap-4 text-xs">
        <Link href="/crm/oportunidades" className="text-[var(--color-primary)] hover:underline flex items-center gap-1">
          <ChevronRight size={11} /> Ver oportunidades
        </Link>
        <Link href="/crm/pipeline" className="text-[var(--color-primary)] hover:underline">Ver pipeline</Link>
        <Link href="/dashboard/crm" className="text-[var(--color-primary)] hover:underline">← Dashboard CRM</Link>
      </div>
    </div>
  );
}
