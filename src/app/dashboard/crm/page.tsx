"use client";

import { StatsCard } from "@/components/dashboard/stats-card";
import {
  Users, TrendingUp, Activity, DollarSign, Clock, CheckCircle2,
  Phone, Mail, Calendar, ChevronRight, AlertCircle,
} from "lucide-react";
import Link from "next/link";

const PIPELINE_SUMMARY = [
  { etapa: "Nuevo lead", cantidad: 12, valor: "$48,200", color: "bg-slate-400" },
  { etapa: "Contactado", cantidad: 8, valor: "$72,500", color: "bg-blue-400" },
  { etapa: "Oferta enviada", cantidad: 5, valor: "$134,000", color: "bg-violet-400" },
  { etapa: "Negociación", cantidad: 3, valor: "$98,700", color: "bg-amber-400" },
  { etapa: "Ganada", cantidad: 7, valor: "$221,300", color: "bg-green-500" },
];

const ACTIVIDADES_HOY = [
  { tipo: "Llamada", empresa: "Grupo Agroindustrial S.A.", contacto: "Mauricio Torres", hora: "09:00", completada: false },
  { tipo: "Email", empresa: "Finca Las Palmas", contacto: "Sandra Molina", hora: "10:30", completada: true },
  { tipo: "Visita", empresa: "Cooperativa Boyacá", contacto: "Ricardo Ospina", hora: "14:00", completada: false },
  { tipo: "Seguimiento", empresa: "AgroValle S.A.S.", contacto: "Juliana Ríos", hora: "16:00", completada: false },
];

const OPORTUNIDADES_RECIENTES = [
  { id: "OPP-2026-031", empresa: "Palmas del Norte", producto: "Fertilizantes NPK 20t", valor: "$44,000", etapa: "Negociación", prob: 70 },
  { id: "OPP-2026-032", empresa: "Tecnicaña S.A.", producto: "Herbicidas selectivos 5t", valor: "$18,500", etapa: "Oferta enviada", prob: 50 },
  { id: "OPP-2026-033", empresa: "Agrícola del Llano", producto: "Fungicidas sistémicos 2t", valor: "$9,800", etapa: "Contactado", prob: 30 },
];

const TIPO_ICON: Record<string, React.ReactNode> = {
  Llamada: <Phone size={12} />,
  Email: <Mail size={12} />,
  Visita: <Users size={12} />,
  Seguimiento: <Clock size={12} />,
};

export default function CRMDashboard() {
  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-md font-bold">CRM Comercial</h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">Junio 2026 — DistAgroMax</p>
        </div>
        <Link
          href="/crm/leads"
          className="text-sm bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
        >
          + Nuevo lead
        </Link>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Valor del pipeline" value="$574,700" icon={<DollarSign size={20} />} color="primary" trend={{ value: "+22%", up: true }} />
        <StatsCard title="Leads activos" value="35" subtitle="12 nuevos esta semana" icon={<Users size={20} />} color="green" />
        <StatsCard title="Tasa de cierre" value="46%" subtitle="vs 38% mes anterior" icon={<TrendingUp size={20} />} color="orange" trend={{ value: "+8pp", up: true }} />
        <StatsCard title="Actividades hoy" value="4" subtitle="1 completada" icon={<Activity size={20} />} color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline por etapa */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-sm">Pipeline por etapa</h2>
            <Link href="/crm/pipeline" className="text-xs text-[var(--color-primary)] hover:underline">Ver Kanban →</Link>
          </div>
          <div className="space-y-3">
            {PIPELINE_SUMMARY.map((e) => (
              <div key={e.etapa} className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${e.color}`} />
                <span className="text-xs text-[var(--color-on-surface)] w-36 shrink-0">{e.etapa}</span>
                <div className="flex-1 bg-[var(--color-border-subtle)] rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${e.color}`}
                    style={{ width: `${(e.cantidad / 12) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-medium w-6 text-right shrink-0">{e.cantidad}</span>
                <span className="text-xs text-[var(--color-on-surface-variant)] w-20 text-right shrink-0">{e.valor}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-[var(--color-border-subtle)] flex gap-4">
            <Link href="/crm/oportunidades" className="text-xs text-[var(--color-primary)] hover:underline">Ver oportunidades</Link>
            <Link href="/crm/leads" className="text-xs text-[var(--color-primary)] hover:underline">Ver leads</Link>
            <Link href="/crm/reportes" className="text-xs text-[var(--color-primary)] hover:underline">Ver reportes</Link>
          </div>
        </div>

        {/* Actividades de hoy */}
        <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
          <div className="px-5 py-4 flex items-center justify-between border-b border-[var(--color-border-subtle)]">
            <h2 className="font-semibold text-sm flex items-center gap-2"><Calendar size={14} /> Actividades de hoy</h2>
            <Link href="/crm/actividades" className="text-xs text-[var(--color-primary)] hover:underline">Ver todas →</Link>
          </div>
          <div className="divide-y divide-[var(--color-border-subtle)]">
            {ACTIVIDADES_HOY.map((a, i) => (
              <div key={i} className={`px-5 py-3 flex items-start gap-3 ${a.completada ? "opacity-50" : ""}`}>
                <div className={`mt-0.5 p-1.5 rounded-full shrink-0 ${a.completada ? "bg-green-100 text-green-600" : "bg-blue-50 text-blue-600"}`}>
                  {a.completada ? <CheckCircle2 size={12} /> : TIPO_ICON[a.tipo]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{a.empresa}</p>
                  <p className="text-[10px] text-[var(--color-on-surface-variant)]">{a.tipo} · {a.contacto}</p>
                </div>
                <span className="text-[10px] text-[var(--color-on-surface-variant)] shrink-0">{a.hora}</span>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-[var(--color-border-subtle)]">
            <Link href="/crm/agenda" className="text-xs text-[var(--color-primary)] hover:underline flex items-center gap-1">
              Ver agenda completa <ChevronRight size={12} />
            </Link>
          </div>
        </div>
      </div>

      {/* Oportunidades recientes */}
      <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
        <div className="px-5 py-4 flex items-center justify-between border-b border-[var(--color-border-subtle)]">
          <h2 className="font-semibold text-sm">Oportunidades activas</h2>
          <Link href="/crm/oportunidades" className="text-xs text-[var(--color-primary)] hover:underline">Ver todas →</Link>
        </div>
        <div className="divide-y divide-[var(--color-border-subtle)]">
          {OPORTUNIDADES_RECIENTES.map((o) => (
            <Link key={o.id} href={`/crm/oportunidades/${o.id}`} className="flex items-center px-5 py-3 gap-4 hover:bg-[var(--color-surface-container)] transition-colors">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{o.empresa}</p>
                <p className="text-[10px] text-[var(--color-on-surface-variant)]">{o.id} · {o.producto}</p>
              </div>
              <span className="text-xs font-bold shrink-0">{o.valor}</span>
              <span className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full shrink-0">{o.etapa}</span>
              <div className="flex items-center gap-1.5 shrink-0 w-20">
                <div className="flex-1 bg-[var(--color-border-subtle)] rounded-full h-1">
                  <div className="h-1 rounded-full bg-[var(--color-primary)]" style={{ width: `${o.prob}%` }} />
                </div>
                <span className="text-[10px] text-[var(--color-on-surface-variant)]">{o.prob}%</span>
              </div>
              <ChevronRight size={14} className="text-[var(--color-on-surface-variant)] shrink-0" />
            </Link>
          ))}
        </div>
      </div>

      {/* Accesos rápidos */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Empresas", href: "/crm/empresas", icon: <Users size={18} /> },
          { label: "Contactos", href: "/crm/contactos", icon: <Phone size={18} /> },
          { label: "Leads", href: "/crm/leads", icon: <AlertCircle size={18} /> },
          { label: "Pipeline", href: "/crm/pipeline", icon: <TrendingUp size={18} /> },
          { label: "Segmentos", href: "/crm/segmentos", icon: <Activity size={18} /> },
          { label: "Reportes", href: "/crm/reportes", icon: <DollarSign size={18} /> },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-[var(--color-border-subtle)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors text-[var(--color-on-surface-variant)]"
          >
            {item.icon}
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
