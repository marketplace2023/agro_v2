"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Leaf, Clock, CheckCircle, AlertTriangle, ChevronRight } from "lucide-react";

const MOCK_DIAGNOSTICOS = [
  { id: "diag-001", cultivo: "Maíz amarillo", cliente: "Finca La Esperanza", region: "Valle del Cauca", fecha: "2026-06-05", problema: "Manchas foliares + amarillamiento", urgencia: "alta", status: "abierto" },
  { id: "diag-002", cultivo: "Papa criolla", cliente: "Agropecuaria Boyacá SAS", region: "Boyacá", fecha: "2026-06-03", problema: "Tizón tardío (Phytophthora infestans)", urgencia: "critica", status: "en_proceso" },
  { id: "diag-003", cultivo: "Arroz", cliente: "Finca El Palmar", region: "Tolima", fecha: "2026-05-28", problema: "Presencia de piricularia", urgencia: "media", status: "cerrado" },
  { id: "diag-004", cultivo: "Aguacate Hass", cliente: "Frutas del Oriente", region: "Antioquia", fecha: "2026-05-20", problema: "Fitophthora cinnamomi en raíces", urgencia: "alta", status: "cerrado" },
  { id: "diag-005", cultivo: "Soya", cliente: "Agro del Llano", region: "Meta", fecha: "2026-06-08", problema: "Defoliación severa por lepidópteros", urgencia: "alta", status: "abierto" },
];

const URGENCIA_CFG = {
  critica: { label: "Crítica", cls: "bg-red-100 text-red-700" },
  alta: { label: "Alta", cls: "bg-orange-100 text-orange-700" },
  media: { label: "Media", cls: "bg-yellow-100 text-yellow-700" },
  baja: { label: "Baja", cls: "bg-green-100 text-green-700" },
};

const STATUS_CFG = {
  abierto: { label: "Abierto", icon: <AlertTriangle size={12} />, cls: "text-orange-600" },
  en_proceso: { label: "En proceso", icon: <Clock size={12} />, cls: "text-blue-600" },
  cerrado: { label: "Cerrado", icon: <CheckCircle size={12} />, cls: "text-green-600" },
};

export default function DiagnosticosPage() {
  const [items] = useState(MOCK_DIAGNOSTICOS);
  const [filter, setFilter] = useState<"todos" | "abierto" | "en_proceso" | "cerrado">("todos");

  const filtered = filter === "todos" ? items : items.filter(d => d.status === filter);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-md font-bold">Diagnósticos agronómicos</h1>
          <p className="text-sm text-[var(--color-on-surface-variant)]">{items.filter(d => d.status !== "cerrado").length} casos activos</p>
        </div>
        <Link href="/dashboard/asesor/planes/nuevo" className="flex items-center gap-2 bg-[var(--color-primary)] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90">
          <Plus size={16} /> Nuevo plan
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(["todos", "abierto", "en_proceso", "cerrado"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === f ? "bg-[var(--color-primary)] text-white" : "bg-white border border-[var(--color-border-subtle)] text-[var(--color-on-surface-variant)] hover:border-[var(--color-primary)]/50"}`}
          >
            {f === "todos" ? "Todos" : f === "en_proceso" ? "En proceso" : f.charAt(0).toUpperCase() + f.slice(1)} {f !== "todos" && `(${items.filter(d => d.status === f).length})`}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.map(d => {
          const ucfg = URGENCIA_CFG[d.urgencia as keyof typeof URGENCIA_CFG];
          const scfg = STATUS_CFG[d.status as keyof typeof STATUS_CFG];
          return (
            <Link key={d.id} href={`/dashboard/asesor/diagnosticos/${d.id}`} className="block bg-white border border-[var(--color-border-subtle)] rounded-xl p-4 hover:border-[var(--color-primary)]/40 hover:shadow-sm transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-9 h-9 bg-[var(--color-agri-green)]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Leaf size={16} className="text-[var(--color-agri-green)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm">{d.cultivo}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ucfg.cls}`}>{ucfg.label}</span>
                    </div>
                    <p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">{d.problema}</p>
                    <p className="text-xs text-[var(--color-on-surface-variant)] mt-1">{d.cliente} · {d.region}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className={`flex items-center gap-1 text-xs font-medium ${scfg.cls}`}>{scfg.icon} {scfg.label}</span>
                  <p className="text-xs text-[var(--color-on-surface-variant)]">{d.fecha}</p>
                  <ChevronRight size={14} className="text-[var(--color-on-surface-variant)]" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
