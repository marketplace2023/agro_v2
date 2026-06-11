"use client";

import { Activity, Users, Plus, ChevronRight, TrendingUp } from "lucide-react";
import Link from "next/link";

const SEGMENTOS = [
  {
    id: "SEG-001", nombre: "Gran cuenta", descripcion: "Empresas con compras > $50,000/año",
    clientes: 8, valorTotal: "$642,000", crecimiento: "+18%", color: "bg-violet-100 border-violet-300",
    criterios: ["Compras > $50K/año", "Contrato B2B activo", "≥ 3 órdenes/año"],
  },
  {
    id: "SEG-002", nombre: "Cuenta mediana", descripcion: "Empresas con compras $10,000–$50,000/año",
    clientes: 15, valorTotal: "$312,500", crecimiento: "+12%", color: "bg-blue-100 border-blue-300",
    criterios: ["Compras $10K–$50K/año", "≥ 2 órdenes/año", "Registro verificado"],
  },
  {
    id: "SEG-003", nombre: "Cuenta pequeña", descripcion: "Fincas y productores individuales < $10,000/año",
    clientes: 34, valorTotal: "$128,400", crecimiento: "+5%", color: "bg-green-100 border-green-300",
    criterios: ["Compras < $10K/año", "Persona natural o empresa pequeña"],
  },
  {
    id: "SEG-004", nombre: "Cooperativa", descripcion: "Cooperativas agrícolas y asociaciones de productores",
    clientes: 6, valorTotal: "$198,700", crecimiento: "+22%", color: "bg-amber-100 border-amber-300",
    criterios: ["Tipo: cooperativa o asociación", "Compras grupales"],
  },
  {
    id: "SEG-005", nombre: "Distribuidor", descripcion: "Empresas que revenden insumos en su región",
    clientes: 9, valorTotal: "$445,200", crecimiento: "+31%", color: "bg-orange-100 border-orange-300",
    criterios: ["Tipo: distribuidor", "Descuento por volumen activo"],
  },
  {
    id: "SEG-006", nombre: "Prospecto frío", descripcion: "Leads sin actividad en los últimos 60 días",
    clientes: 22, valorTotal: "$0", crecimiento: "—", color: "bg-slate-100 border-slate-300",
    criterios: ["Sin compra", "Sin respuesta en 60 días", "Etapa: Nuevo lead o Contactado"],
  },
];

export default function SegmentosPage() {
  const totalClientes = SEGMENTOS.reduce((s, seg) => s + seg.clientes, 0);
  const totalValor = SEGMENTOS
    .filter(s => s.valorTotal !== "$0")
    .reduce((sum, s) => sum + parseFloat(s.valorTotal.replace(/[$,]/g, "")), 0);

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-md font-bold flex items-center gap-2">
            <Activity size={22} /> Segmentos de clientes
          </h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">
            {SEGMENTOS.length} segmentos · {totalClientes} clientes · ${totalValor.toLocaleString()} valor total
          </p>
        </div>
        <button className="flex items-center gap-2 text-sm bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
          <Plus size={15} /> Nuevo segmento
        </button>
      </div>

      {/* Mapa visual */}
      <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
        <h2 className="font-semibold text-sm mb-4">Distribución por segmento</h2>
        <div className="space-y-3">
          {SEGMENTOS.map((s) => (
            <div key={s.id} className="flex items-center gap-3">
              <span className="text-xs text-[var(--color-on-surface)] w-36 shrink-0 truncate">{s.nombre}</span>
              <div className="flex-1 bg-[var(--color-border-subtle)] rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${s.color.replace("border-", "bg-").split(" ")[0].replace("-100", "-400")}`}
                  style={{ width: `${(s.clientes / totalClientes) * 100}%` }}
                />
              </div>
              <span className="text-xs font-bold w-6 text-right shrink-0">{s.clientes}</span>
              <span className="text-xs text-[var(--color-on-surface-variant)] w-20 text-right shrink-0">{s.valorTotal}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SEGMENTOS.map((s) => (
          <div key={s.id} className={`bg-white rounded-xl border-2 ${s.color} p-5 hover:shadow-sm transition-shadow`}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-sm">{s.nombre}</h3>
                <p className="text-[11px] text-[var(--color-on-surface-variant)] mt-0.5">{s.descripcion}</p>
              </div>
              {s.crecimiento !== "—" && (
                <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium shrink-0 flex items-center gap-0.5">
                  <TrendingUp size={9} /> {s.crecimiento}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 text-sm font-bold">
                <Users size={14} className="text-[var(--color-on-surface-variant)]" />
                {s.clientes} clientes
              </div>
              <span className="text-sm font-bold text-[var(--color-primary)]">{s.valorTotal}</span>
            </div>
            <div className="border-t border-[var(--color-border-subtle)] pt-3 mb-3">
              <p className="text-[10px] text-[var(--color-on-surface-variant)] mb-1.5">Criterios:</p>
              <ul className="space-y-1">
                {s.criterios.map((c, i) => (
                  <li key={i} className="text-[10px] flex items-start gap-1.5">
                    <span className="text-[var(--color-primary)] mt-0.5">·</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <button className="w-full text-xs border border-[var(--color-border-subtle)] py-1.5 rounded-lg hover:bg-[var(--color-surface-container)] transition-colors flex items-center justify-center gap-1 text-[var(--color-on-surface-variant)]">
              Ver clientes <ChevronRight size={12} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-4 text-xs">
        <Link href="/crm/empresas" className="text-[var(--color-primary)] hover:underline">Ver todas las empresas</Link>
        <Link href="/crm/reportes" className="text-[var(--color-primary)] hover:underline">Ver reportes</Link>
        <Link href="/dashboard/crm" className="text-[var(--color-primary)] hover:underline">← Dashboard CRM</Link>
      </div>
    </div>
  );
}
