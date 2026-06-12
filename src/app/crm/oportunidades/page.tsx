"use client";

import { useState } from "react";
import { TrendingUp, Search, Plus, Filter, ChevronRight, DollarSign, Calendar, User } from "lucide-react";
import Link from "next/link";

const OPORTUNIDADES = [
  { id: "OPP-2026-031", empresa: "Palmas del Norte", contacto: "Patricia Suárez", producto: "Fertilizantes NPK 20t", valor: "$44,000", etapa: "Negociación", prob: 70, fechaReq: "2026-07-15", vendedor: "María Gómez", pais: "Colombia", transporte: "Tercero" },
  { id: "OPP-2026-032", empresa: "Tecnicaña S.A.", contacto: "Carlos Herrera", producto: "Herbicidas selectivos 5t", valor: "$18,500", etapa: "Cotización enviada", prob: 50, fechaReq: "2026-07-01", vendedor: "Luis Pérez", pais: "Colombia", transporte: "Comprador" },
  { id: "OPP-2026-033", empresa: "Agrícola del Llano", contacto: "Diego Morales", producto: "Fungicidas sistémicos 2t", valor: "$9,800", etapa: "Contactado", prob: 30, fechaReq: "2026-08-01", vendedor: "Carlos Díaz", pais: "Colombia", transporte: "Pendiente" },
  { id: "OPP-2026-034", empresa: "Grupo Agroindustrial S.A.", contacto: "Mauricio Torres", producto: "Paquete insumos campaña", valor: "$142,000", etapa: "Validación logística", prob: 80, fechaReq: "2026-06-30", vendedor: "María Gómez", pais: "Colombia", transporte: "Vendedor" },
  { id: "OPP-2026-035", empresa: "Cooperativa Boyacá Agro", contacto: "Ricardo Ospina", producto: "Biológicos + foliares", valor: "$31,200", etapa: "Oferta en preparación", prob: 45, fechaReq: "2026-07-20", vendedor: "Luis Pérez", pais: "Colombia", transporte: "Pendiente" },
  { id: "OPP-2026-036", empresa: "AgroValle S.A.S.", contacto: "Juliana Ríos", producto: "Insecticidas 3t", valor: "$22,700", etapa: "Negociación", prob: 65, fechaReq: "2026-07-10", vendedor: "Carlos Díaz", pais: "Colombia", transporte: "Comprador" },
  { id: "OPP-2026-037", empresa: "Finca Las Palmas", contacto: "Sandra Molina", producto: "Fungicidas preventivos 1t", valor: "$7,400", etapa: "Aprobación del cliente", prob: 90, fechaReq: "2026-06-25", vendedor: "Luis Pérez", pais: "Colombia", transporte: "Vendedor" },
];

const ETAPA_COLOR: Record<string, string> = {
  "Contactado": "bg-slate-100 text-slate-600",
  "Necesidad identificada": "bg-blue-100 text-blue-700",
  "Oferta en preparación": "bg-sky-100 text-sky-700",
  "Cotización enviada": "bg-violet-100 text-violet-700",
  "Negociación": "bg-amber-100 text-amber-700",
  "Validación logística": "bg-orange-100 text-orange-700",
  "Aprobación del cliente": "bg-green-100 text-green-700",
  "Ganada": "bg-green-200 text-green-800",
  "Perdida": "bg-red-100 text-red-700",
};

const PROB_COLOR = (p: number) => {
  if (p >= 75) return "bg-green-500";
  if (p >= 50) return "bg-amber-400";
  return "bg-slate-300";
};

export default function OportunidadesPage() {
  const [busqueda, setBusqueda] = useState("");

  const filtradas = OPORTUNIDADES.filter(
    (o) =>
      o.empresa.toLowerCase().includes(busqueda.toLowerCase()) ||
      o.producto.toLowerCase().includes(busqueda.toLowerCase()),
  );

  const valorTotal = filtradas.reduce((sum, o) => sum + parseFloat(o.valor.replace(/[$,]/g, "")), 0);

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-md font-bold flex items-center gap-2">
            <TrendingUp size={22} /> Oportunidades
          </h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">
            {OPORTUNIDADES.length} oportunidades · Valor total: <span className="font-semibold">${valorTotal.toLocaleString()}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/crm/pipeline" className="text-sm border border-[var(--color-border-subtle)] px-4 py-2 rounded-lg hover:bg-[var(--color-surface-container)] transition-colors text-[var(--color-on-surface-variant)]">
            Ver pipeline
          </Link>
          <button className="flex items-center gap-2 text-sm bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
            <Plus size={15} /> Nueva
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]" />
          <input
            type="text"
            placeholder="Buscar por empresa o producto..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-20"
          />
        </div>
        <button className="flex items-center gap-2 text-sm border border-[var(--color-border-subtle)] px-4 py-2 rounded-lg hover:bg-[var(--color-surface-container)] transition-colors text-[var(--color-on-surface-variant)]">
          <Filter size={14} /> Filtrar
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
        <div className="hidden lg:grid grid-cols-[1fr_140px_100px_100px_130px_80px_40px] px-5 py-3 text-[10px] font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-container)]">
          <span>Oportunidad</span>
          <span>Etapa</span>
          <span className="text-right">Valor</span>
          <span className="text-right">Fecha req.</span>
          <span>Vendedor</span>
          <span className="text-center">Prob.</span>
          <span />
        </div>
        <div className="divide-y divide-[var(--color-border-subtle)]">
          {filtradas.map((o) => (
            <Link
              key={o.id}
              href={`/crm/oportunidades/${o.id}`}
              className="flex flex-col lg:grid lg:grid-cols-[1fr_140px_100px_100px_130px_80px_40px] items-start lg:items-center px-5 py-4 gap-2 lg:gap-0 hover:bg-[var(--color-surface-container)] transition-colors"
            >
              <div className="min-w-0">
                <p className="text-xs font-semibold">{o.empresa}</p>
                <p className="text-[11px] text-[var(--color-on-surface-variant)] mt-0.5">{o.id} · {o.producto}</p>
                <p className="text-[10px] text-[var(--color-on-surface-variant)] flex items-center gap-1 mt-0.5">
                  <User size={10} /> {o.contacto}
                </p>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${ETAPA_COLOR[o.etapa] ?? "bg-slate-100 text-slate-600"}`}>
                {o.etapa}
              </span>
              <span className="text-xs font-bold lg:text-right flex items-center gap-1 lg:justify-end">
                <DollarSign size={10} className="shrink-0" />{o.valor.replace("$", "")}
              </span>
              <span className="text-[11px] text-[var(--color-on-surface-variant)] lg:text-right flex items-center gap-1 lg:justify-end">
                <Calendar size={10} /> {o.fechaReq}
              </span>
              <span className="text-[11px] text-[var(--color-on-surface-variant)]">{o.vendedor}</span>
              <div className="flex flex-col items-center gap-1 lg:mx-auto">
                <div className="w-12 h-1.5 bg-[var(--color-border-subtle)] rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${PROB_COLOR(o.prob)}`} style={{ width: `${o.prob}%` }} />
                </div>
                <span className="text-[10px] text-[var(--color-on-surface-variant)]">{o.prob}%</span>
              </div>
              <ChevronRight size={14} className="text-[var(--color-on-surface-variant)] lg:justify-self-end self-center" />
            </Link>
          ))}
          {filtradas.length === 0 && (
            <div className="px-5 py-10 text-center text-sm text-[var(--color-on-surface-variant)]">No se encontraron oportunidades</div>
          )}
        </div>
      </div>

      <div className="flex gap-4 text-xs">
        <Link href="/crm/pipeline" className="text-[var(--color-primary)] hover:underline flex items-center gap-1">
          <TrendingUp size={11} /> Ver pipeline Kanban
        </Link>
        <Link href="/crm/leads" className="text-[var(--color-primary)] hover:underline">Ver leads</Link>
        <Link href="/dashboard/crm" className="text-[var(--color-primary)] hover:underline">← Dashboard CRM</Link>
      </div>
    </div>
  );
}
