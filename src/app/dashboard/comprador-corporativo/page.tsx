"use client";

import { StatsCard } from "@/components/dashboard/stats-card";
import { SedeBarChart } from "@/components/dashboard/charts";
import { ClipboardList, DollarSign, FileText, AlertCircle, CheckCircle, XCircle, Clock } from "lucide-react";
import Link from "next/link";

const APPROVALS = [
  { id: "APROV-088", solicitante: "Carlos Mendez", monto: "$12,400", producto: "Urea Granulada 2t", sede: "Bogotá", fecha: "Hoy 09:14", urgente: true },
  { id: "APROV-089", solicitante: "Laura García", monto: "$5,800", producto: "Fungicida Mancozeb 500kg", sede: "Medellín", fecha: "Hoy 08:30", urgente: false },
  { id: "APROV-090", solicitante: "Pedro Torres", monto: "$28,900", producto: "NPK 15-15-15 5t + Delivery", sede: "Cali", fecha: "Ayer 16:45", urgente: true },
  { id: "APROV-091", solicitante: "Ana Romero", monto: "$3,200", producto: "Insecticida Abamectina", sede: "Barranquilla", fecha: "Ayer 11:20", urgente: false },
];

const CREDITS = [
  { label: "Cupo total aprobado", value: "$150,000", color: "bg-[var(--color-primary)]", w: 100 },
  { label: "Utilizado", value: "$75,000", color: "bg-[var(--color-secondary)]", w: 50 },
  { label: "Disponible", value: "$75,000", color: "bg-[var(--color-agri-green)]", w: 50 },
];

const CONTRACTS = [
  { id: "CONT-2025-001", vendedor: "DistAgroMax", productos: 18, monto: "$240,000/año", vence: "2026-12-31", estado: "activo" },
  { id: "CONT-2025-002", vendedor: "BioSolutions EC", productos: 6, monto: "$85,000/año", vence: "2026-09-30", estado: "activo" },
  { id: "CONT-2025-003", vendedor: "CropProtect MX", productos: 12, monto: "$120,000/año", vence: "2026-06-30", estado: "por_vencer" },
];

export default function CompradorCorporativoDashboard() {
  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-headline-md font-bold text-[var(--color-on-surface)]">Dashboard Corporativo</h1>
        <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">Panel de gestión empresarial · Agro Industrial S.A.S.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Aprobaciones pendientes" value="4" subtitle="2 urgentes" icon={<ClipboardList size={20} />} color="red" />
        <StatsCard title="Gasto mes" value="$48,500" subtitle="79% del presupuesto mensual" icon={<DollarSign size={20} />} color="primary" trend={{ value: "+12.4%", up: true }} />
        <StatsCard title="Crédito disponible" value="$75,000" subtitle="de $150,000 aprobados" icon={<DollarSign size={20} />} color="green" />
        <StatsCard title="Contratos activos" value="3" subtitle="1 por vencer en 21 días" icon={<FileText size={20} />} color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cola de aprobaciones */}
        <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
          <div className="px-5 py-4 flex items-center justify-between border-b border-[var(--color-border-subtle)]">
            <h2 className="font-semibold text-sm flex items-center gap-2"><ClipboardList size={14} /> Cola de aprobaciones</h2>
            <Link href="/b2b/aprobaciones" className="text-xs text-[var(--color-primary)] hover:underline">Ver todas →</Link>
          </div>
          <div className="divide-y divide-[var(--color-border-subtle)]">
            {APPROVALS.map(a => (
              <div key={a.id} className={`px-5 py-3 ${a.urgente ? "bg-red-50" : ""}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {a.urgente && <span className="text-[10px] font-bold bg-red-100 text-red-700 px-1.5 py-0.5 rounded uppercase">Urgente</span>}
                      <span className="text-xs font-medium text-[var(--color-on-surface)]">{a.solicitante}</span>
                      <span className="text-xs text-[var(--color-on-surface-variant)]">— {a.sede}</span>
                    </div>
                    <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5 truncate">{a.producto}</p>
                    <p className="text-[10px] text-[var(--color-on-surface-variant)]">{a.id} · {a.fecha}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-[var(--color-on-surface)]">{a.monto}</p>
                    <div className="flex gap-1.5 mt-1.5">
                      <button className="flex items-center gap-1 text-[10px] bg-green-600 text-white px-2 py-0.5 rounded font-medium hover:bg-green-700">
                        <CheckCircle size={10} /> Aprobar
                      </button>
                      <button className="flex items-center gap-1 text-[10px] bg-red-500 text-white px-2 py-0.5 rounded font-medium hover:bg-red-600">
                        <XCircle size={10} /> Rechazar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gasto por sede */}
        <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
          <h2 className="font-semibold text-sm mb-4 flex items-center gap-2">📊 Gasto por sede — Junio 2026</h2>
          <SedeBarChart />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Crédito */}
        <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
          <h2 className="font-semibold text-sm mb-4 flex items-center gap-2"><DollarSign size={14} /> Crédito corporativo</h2>
          <div className="space-y-3">
            {CREDITS.map(c => (
              <div key={c.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[var(--color-on-surface-variant)]">{c.label}</span>
                  <span className="font-semibold text-[var(--color-on-surface)]">{c.value}</span>
                </div>
                <div className="w-full bg-[var(--color-surface-container)] rounded-full h-2">
                  <div className={`h-2 rounded-full ${c.color}`} style={{ width: `${c.w}%` }} />
                </div>
              </div>
            ))}
            <div className="mt-3 p-3 bg-amber-50 rounded-lg">
              <p className="text-xs text-amber-700 flex items-center gap-1.5">
                <AlertCircle size={13} />
                Próximo vencimiento: $18,400 el 30 de junio
              </p>
            </div>
          </div>
        </div>

        {/* Contratos */}
        <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
          <div className="px-5 py-4 flex items-center justify-between border-b border-[var(--color-border-subtle)]">
            <h2 className="font-semibold text-sm">Contratos marco</h2>
            <Link href="/b2b/contratos" className="text-xs text-[var(--color-primary)] hover:underline">Ver todos →</Link>
          </div>
          <div className="divide-y divide-[var(--color-border-subtle)]">
            {CONTRACTS.map(c => (
              <div key={c.id} className="px-5 py-3 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-medium">{c.vendedor}</p>
                  <p className="text-[10px] text-[var(--color-on-surface-variant)]">{c.id} · {c.productos} productos · Vence: {c.vence}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold">{c.monto}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${c.estado === "activo" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                    {c.estado === "por_vencer" ? <><Clock size={10} className="inline mr-1" />Por vencer</> : "Activo"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
