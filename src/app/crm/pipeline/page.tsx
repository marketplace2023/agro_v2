"use client";

import { TrendingUp, Plus, ChevronRight, DollarSign } from "lucide-react";
import Link from "next/link";

const ETAPAS = [
  { nombre: "Nuevo lead", color: "border-slate-300", badge: "bg-slate-100 text-slate-600" },
  { nombre: "Contactado", color: "border-blue-300", badge: "bg-blue-100 text-blue-700" },
  { nombre: "Necesidad identificada", color: "border-sky-300", badge: "bg-sky-100 text-sky-700" },
  { nombre: "Oferta en preparación", color: "border-violet-300", badge: "bg-violet-100 text-violet-700" },
  { nombre: "Cotización enviada", color: "border-amber-300", badge: "bg-amber-100 text-amber-700" },
  { nombre: "Negociación", color: "border-orange-300", badge: "bg-orange-100 text-orange-700" },
  { nombre: "Validación logística", color: "border-emerald-300", badge: "bg-emerald-100 text-emerald-700" },
  { nombre: "Aprobación del cliente", color: "border-green-400", badge: "bg-green-100 text-green-700" },
];

const TARJETAS = [
  { id: "OPP-2026-001", empresa: "Hacienda El Cedro", producto: "Fertilizantes NPK", valor: "$8,200", etapa: "Nuevo lead", prob: 15 },
  { id: "OPP-2026-005", empresa: "Campo Verde S.A.S.", producto: "Foliares", valor: "$7,100", etapa: "Nuevo lead", prob: 10 },
  { id: "LED-002", empresa: "Agropecuaria Simón", producto: "Herbicidas selectivos", valor: "$8,500", etapa: "Contactado", prob: 25 },
  { id: "LED-006", empresa: "Cultivos Orgánicos Nariño", producto: "Biológicos", valor: "$3,400", etapa: "Contactado", prob: 20 },
  { id: "LED-003", empresa: "Granjas del Sur", producto: "Insecticidas biológicos", valor: "$5,200", etapa: "Necesidad identificada", prob: 35 },
  { id: "LED-007", empresa: "Inv. Agro del Caribe", producto: "Nutrición foliar premium", valor: "$24,000", etapa: "Necesidad identificada", prob: 40 },
  { id: "OPP-2026-035", empresa: "Cooperativa Boyacá", producto: "Biológicos + foliares", valor: "$31,200", etapa: "Oferta en preparación", prob: 45 },
  { id: "LED-004", empresa: "Hacienda La Esperanza", producto: "Fungicidas sistémicos", valor: "$18,900", etapa: "Oferta en preparación", prob: 45 },
  { id: "OPP-2026-032", empresa: "Tecnicaña S.A.", producto: "Herbicidas selectivos 5t", valor: "$18,500", etapa: "Cotización enviada", prob: 50 },
  { id: "OPP-2026-036", empresa: "AgroValle S.A.S.", producto: "Insecticidas 3t", valor: "$22,700", etapa: "Negociación", prob: 65 },
  { id: "OPP-2026-031", empresa: "Palmas del Norte", producto: "Fertilizantes NPK 20t", valor: "$44,000", etapa: "Negociación", prob: 70 },
  { id: "OPP-2026-034", empresa: "Grupo Agroindustrial", producto: "Paquete campaña", valor: "$142,000", etapa: "Validación logística", prob: 80 },
  { id: "OPP-2026-033", empresa: "Agrícola del Llano", producto: "Fungicidas 2t", valor: "$9,800", etapa: "Contactado", prob: 30 },
  { id: "OPP-2026-037", empresa: "Finca Las Palmas", producto: "Fungicidas preventivos", valor: "$7,400", etapa: "Aprobación del cliente", prob: 90 },
];

export default function PipelinePage() {
  const tarjetasPorEtapa = (etapa: string) => TARJETAS.filter(t => t.etapa === etapa);

  const valorPorEtapa = (etapa: string) =>
    tarjetasPorEtapa(etapa).reduce((sum, t) => sum + parseFloat(t.valor.replace(/[$,]/g, "")), 0);

  return (
    <div className="space-y-4 max-w-[1600px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-md font-bold flex items-center gap-2">
            <TrendingUp size={22} /> Pipeline Kanban
          </h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">
            {TARJETAS.length} oportunidades activas
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/crm/oportunidades" className="text-sm border border-[var(--color-border-subtle)] px-4 py-2 rounded-lg hover:bg-[var(--color-surface-container)] transition-colors text-[var(--color-on-surface-variant)]">
            Vista lista
          </Link>
          <button className="flex items-center gap-2 text-sm bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
            <Plus size={15} /> Nuevo
          </button>
        </div>
      </div>

      {/* Kanban */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {ETAPAS.map((etapa) => {
            const tarjetas = tarjetasPorEtapa(etapa.nombre);
            const valor = valorPorEtapa(etapa.nombre);
            return (
              <div key={etapa.nombre} className="w-60 shrink-0">
                {/* Header columna */}
                <div className={`bg-white rounded-t-xl border-t-2 border-x border-[var(--color-border-subtle)] ${etapa.color} px-3 py-2.5`}>
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-semibold truncate pr-1">{etapa.nombre}</p>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold shrink-0 ${etapa.badge}`}>
                      {tarjetas.length}
                    </span>
                  </div>
                  {valor > 0 && (
                    <p className="text-[10px] text-[var(--color-on-surface-variant)] mt-0.5 flex items-center gap-0.5">
                      <DollarSign size={9} />{valor.toLocaleString()}
                    </p>
                  )}
                </div>

                {/* Tarjetas */}
                <div className={`bg-[var(--color-surface-container)] border-x border-b border-[var(--color-border-subtle)] rounded-b-xl min-h-32 p-2 space-y-2`}>
                  {tarjetas.map((t) => (
                    <Link
                      key={t.id}
                      href={`/crm/oportunidades/${t.id}`}
                      className="block bg-white rounded-lg border border-[var(--color-border-subtle)] p-3 hover:shadow-sm hover:border-[var(--color-primary)] transition-all"
                    >
                      <p className="text-[11px] font-semibold truncate">{t.empresa}</p>
                      <p className="text-[10px] text-[var(--color-on-surface-variant)] mt-0.5 truncate">{t.producto}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[11px] font-bold text-[var(--color-primary)]">{t.valor}</span>
                        <div className="flex items-center gap-1">
                          <div className="w-10 h-1 bg-[var(--color-border-subtle)] rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-[var(--color-primary)]"
                              style={{ width: `${t.prob}%` }}
                            />
                          </div>
                          <span className="text-[9px] text-[var(--color-on-surface-variant)]">{t.prob}%</span>
                        </div>
                      </div>
                      <p className="text-[9px] text-[var(--color-on-surface-variant)] mt-1">{t.id}</p>
                    </Link>
                  ))}
                  {tarjetas.length === 0 && (
                    <div className="py-4 text-center text-[10px] text-[var(--color-on-surface-variant)]">Sin registros</div>
                  )}
                  <button className="w-full text-[10px] text-[var(--color-on-surface-variant)] border border-dashed border-[var(--color-border-subtle)] rounded-lg py-2 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-colors flex items-center justify-center gap-1">
                    <Plus size={10} /> Añadir
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-4 text-xs">
        <Link href="/crm/oportunidades" className="text-[var(--color-primary)] hover:underline flex items-center gap-1">
          <ChevronRight size={11} /> Vista lista
        </Link>
        <Link href="/dashboard/crm" className="text-[var(--color-primary)] hover:underline">← Dashboard CRM</Link>
      </div>
    </div>
  );
}
