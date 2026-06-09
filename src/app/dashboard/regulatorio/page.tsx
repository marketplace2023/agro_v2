"use client";

import { useState } from "react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Shield, AlertTriangle, CheckCircle, XCircle, Clock } from "lucide-react";

const REVIEW_QUEUE = [
  { id: "REG-2024-088", producto: "Imidacloprid 350 SC — CropProtect", tipo: "Registro sanitario CO", vendedor: "DistAgroMax", subido: "Hoy 08:15", estado: "pendiente", docs: 3, urgencia: false },
  { id: "REG-2024-089", producto: "Azoxistrobina + Ciproconazol — AgroQuim", tipo: "Renovación registro VE", vendedor: "AgroSuministros CO", subido: "Hoy 09:40", estado: "pendiente", docs: 4, urgencia: true },
  { id: "REG-2024-090", producto: "Glifosato 480 SL — AgroQuim", tipo: "Actualización etiqueta MX", vendedor: "AgroMex S.A.", subido: "Ayer 15:30", estado: "revision", docs: 2, urgencia: false },
  { id: "REG-2024-091", producto: "Beauveria bassiana WP — BioSolutions", tipo: "Registro sanitario EC", vendedor: "Agro Ecuador", subido: "Ayer 10:00", estado: "pendiente", docs: 5, urgencia: false },
  { id: "REG-2024-092", producto: "Sulfato de Potasio 50% — NutriPlant", tipo: "Ficha técnica PE", vendedor: "Agri Peru", subido: "Hace 3 días", estado: "con_observaciones", docs: 2, urgencia: false },
];

const ALERTS = [
  { producto: "Trichoderma Harzianum WP — BioSolutions", tipo: "Vencimiento", mensaje: "Registro ICA Colombia vence en 23 días (30/06/2026)", nivel: "critico" },
  { producto: "Glifosato 480 SL — AgroQuim", tipo: "Restricción", mensaje: "Nueva resolución VE restringe uso en 3 cultivos desde Jul 2026", nivel: "alerta" },
  { producto: "Clorpirifos 480 EC — PestControl", tipo: "Bloqueo", mensaje: "Pendiente nueva evaluación SENASICA. Bloqueado para MX", nivel: "bloqueado" },
];

const STATUS_ICONS: Record<string, React.ReactNode> = {
  pendiente: <Clock size={13} className="text-yellow-500" />,
  revision: <Shield size={13} className="text-blue-500" />,
  con_observaciones: <AlertTriangle size={13} className="text-orange-500" />,
};

export default function RegulatorioDashboard() {
  const [selected, setSelected] = useState<string | null>(null);
  const [decision, setDecision] = useState<Record<string, { paises: string; comentario: string }>>({});

  const sel = REVIEW_QUEUE.find(r => r.id === selected);

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-headline-md font-bold">Dashboard Analista Regulatorio</h1>
        <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">Ana Regulatoria · Módulo de control documental</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="En cola" value="5" subtitle="2 urgentes" icon={<Clock size={20} />} color="orange" />
        <StatsCard title="Aprobados hoy" value="3" icon={<CheckCircle size={20} />} color="green" />
        <StatsCard title="Con alertas activas" value="3" subtitle="1 crítico" icon={<AlertTriangle size={20} />} color="red" />
        <StatsCard title="Bloqueados" value="1" icon={<XCircle size={20} />} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cola de revisión */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--color-border-subtle)]">
            <h2 className="font-semibold text-sm">Cola de revisión documental</h2>
          </div>
          <div className="divide-y divide-[var(--color-border-subtle)]">
            {REVIEW_QUEUE.map(r => (
              <div
                key={r.id}
                className={`px-5 py-3 cursor-pointer hover:bg-[var(--color-surface-container-lowest)] transition-colors ${selected === r.id ? "bg-[var(--color-primary)]/5 border-l-2 border-[var(--color-primary)]" : ""} ${r.urgencia ? "bg-red-50" : ""}`}
                onClick={() => setSelected(selected === r.id ? null : r.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-2">
                    {STATUS_ICONS[r.estado]}
                    <div>
                      {r.urgencia && <span className="text-[10px] font-bold bg-red-100 text-red-700 px-1.5 py-0.5 rounded uppercase mr-1.5">Urgente</span>}
                      <span className="text-xs font-semibold">{r.id}</span>
                      <p className="text-xs mt-0.5">{r.producto}</p>
                      <p className="text-[10px] text-[var(--color-on-surface-variant)] mt-0.5">{r.tipo} · {r.vendedor} · {r.docs} docs · {r.subido}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 font-medium ${
                    r.estado === "pendiente" ? "bg-yellow-100 text-yellow-700" :
                    r.estado === "revision" ? "bg-blue-100 text-blue-700" :
                    "bg-orange-100 text-orange-700"
                  }`}>
                    {r.estado.replace("_", " ")}
                  </span>
                </div>

                {selected === r.id && (
                  <div className="mt-4 space-y-3 border-t border-[var(--color-border-subtle)] pt-3" onClick={e => e.stopPropagation()}>
                    <label className="text-xs font-medium block">
                      Países aprobados (editables):
                      <input
                        className="w-full mt-1 p-2 text-xs border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                        placeholder="CO, VE, EC, MX, PE..."
                        value={decision[r.id]?.paises ?? ""}
                        onChange={e => setDecision(prev => ({ ...prev, [r.id]: { ...prev[r.id], paises: e.target.value } }))}
                      />
                    </label>
                    <label className="text-xs font-medium block">
                      Comentario / Observaciones:
                      <textarea
                        className="w-full mt-1 p-2 text-xs border border-[var(--color-border-subtle)] rounded-lg resize-none focus:outline-none focus:border-[var(--color-primary)]"
                        rows={2}
                        placeholder="Motivo de aprobación, restricciones, observaciones..."
                        value={decision[r.id]?.comentario ?? ""}
                        onChange={e => setDecision(prev => ({ ...prev, [r.id]: { ...prev[r.id], comentario: e.target.value } }))}
                      />
                    </label>
                    <div className="flex gap-2">
                      <button className="flex items-center gap-1.5 text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-green-700">
                        <CheckCircle size={12} /> Aprobar
                      </button>
                      <button className="flex items-center gap-1.5 text-xs bg-orange-500 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-orange-600">
                        <AlertTriangle size={12} /> Con observaciones
                      </button>
                      <button className="flex items-center gap-1.5 text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-red-700">
                        <XCircle size={12} /> Rechazar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Alertas */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
            <div className="px-5 py-4 border-b border-[var(--color-border-subtle)]">
              <h2 className="font-semibold text-sm flex items-center gap-2"><AlertTriangle size={14} /> Alertas regulatorias</h2>
            </div>
            <div className="divide-y divide-[var(--color-border-subtle)]">
              {ALERTS.map(a => (
                <div key={a.producto} className={`px-4 py-3 ${
                  a.nivel === "critico" ? "bg-red-50" :
                  a.nivel === "bloqueado" ? "bg-gray-50" : "bg-amber-50"
                }`}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                      a.nivel === "critico" ? "bg-red-100 text-red-700" :
                      a.nivel === "bloqueado" ? "bg-gray-200 text-gray-700" : "bg-amber-100 text-amber-700"
                    }`}>{a.tipo}</span>
                  </div>
                  <p className="text-xs font-medium">{a.producto}</p>
                  <p className="text-[10px] text-[var(--color-on-surface-variant)] mt-0.5">{a.mensaje}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
