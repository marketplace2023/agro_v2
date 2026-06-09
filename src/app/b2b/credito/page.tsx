"use client";

import { useState } from "react";
import {
  DollarSign, TrendingUp, TrendingDown, AlertTriangle,
  CheckCircle, Clock, Shield, ChevronRight, BarChart3,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Credit {
  id: string; companyName: string; totalLimit: number; usedAmount: number;
  paymentTermDays: number; status: "activo" | "suspendido" | "bloqueado";
  analystName: string | null; approvedAt: string | null; nextReview: string | null;
  guaranteeType: string | null; notes: string | null;
}

interface Vencimiento {
  invoiceId: string; amount: number; dueDate: string; daysOverdue: number;
}

interface ScoreMetric { label: string; value: string; score: number; max: number }

// ─── Mock data ───────────────────────────────────────────────────────────────

const MOCK_CREDIT: Credit = {
  id: "cr1",
  companyName: "AgroInversiones S.A.S",
  totalLimit: 200000,
  usedAmount: 85000,
  paymentTermDays: 30,
  status: "activo",
  analystName: "Luis Analista Finanzas",
  approvedAt: "2024-03-15",
  nextReview: "2025-09-15",
  guaranteeType: "Aval solidario + Pagaré en blanco",
  notes: "Cliente premium. Historial de pagos excelente. Pre-aprobado para ampliar cupo.",
};

const MOCK_VENCIMIENTOS: Vencimiento[] = [
  { invoiceId: "FAC-2024-0089", amount: 12500, dueDate: "2025-01-20", daysOverdue: 0 },
  { invoiceId: "FAC-2024-0092", amount: 8400, dueDate: "2025-02-05", daysOverdue: 0 },
  { invoiceId: "FAC-2024-0076", amount: 5200, dueDate: "2024-12-28", daysOverdue: 12 },
];

const MOCK_SCORE: ScoreMetric[] = [
  { label: "Historial de pagos",    value: "Excelente",  score: 95, max: 100 },
  { label: "Antigüedad cliente",    value: "3 años",     score: 80, max: 100 },
  { label: "Volumen de compras",    value: "$458K / año", score: 90, max: 100 },
  { label: "Saldo pendiente / cupo", value: "42.5%",     score: 75, max: 100 },
  { label: "Garantías",             value: "Aval+Pagaré", score: 85, max: 100 },
];

// ─── Components ──────────────────────────────────────────────────────────────

type ViewMode = "comprador" | "analista";

function ViewComprador({ credit }: { credit: Credit }) {
  const avail = credit.totalLimit - credit.usedAmount;
  const pct = (credit.usedAmount / credit.totalLimit) * 100;
  const overdueItems = MOCK_VENCIMIENTOS.filter(v => v.daysOverdue > 0);
  const overdueTotal = overdueItems.reduce((s, v) => s + v.amount, 0);

  return (
    <div className="space-y-6">
      {/* Alert: overdue > 10 days → block */}
      {overdueItems.some(v => v.daysOverdue > 10) && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle size={18} className="text-red-700 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-red-800">Crédito bloqueado — pagos vencidos &gt; 10 días</p>
            <p className="text-xs text-red-700 mt-0.5">Tienes {overdueItems.filter(v => v.daysOverdue > 10).length} factura(s) con más de 10 días de vencimiento. El crédito queda bloqueado hasta regularizar.</p>
          </div>
        </div>
      )}

      {/* Main credit card */}
      <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs text-[var(--color-on-surface-variant)]">Línea de crédito</p>
            <p className="text-2xl font-bold">${credit.totalLimit.toLocaleString()} USD</p>
            <p className="text-xs text-[var(--color-on-surface-variant)]">Plazo: {credit.paymentTermDays} días · Garantía: {credit.guaranteeType ?? "—"}</p>
          </div>
          <div className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
            credit.status === "activo" ? "bg-green-100 text-green-700" :
            credit.status === "suspendido" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
          }`}>{credit.status.charAt(0).toUpperCase() + credit.status.slice(1)}</div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          {[
            { label: "Cupo disponible", value: `$${avail.toLocaleString()}`, color: "text-[var(--color-agri-green)]", Icon: TrendingUp },
            { label: "Cupo usado", value: `$${credit.usedAmount.toLocaleString()}`, color: "text-[var(--color-primary)]", Icon: DollarSign },
            { label: "Vencido", value: overdueTotal > 0 ? `$${overdueTotal.toLocaleString()}` : "—", color: overdueTotal > 0 ? "text-red-700" : "text-[var(--color-on-surface-variant)]", Icon: TrendingDown },
          ].map(k => {
            const KIcon = k.Icon;
            return (
              <div key={k.label} className="text-center">
                <KIcon size={16} className={`mx-auto mb-1 ${k.color}`} />
                <p className={`text-lg font-bold ${k.color}`}>{k.value}</p>
                <p className="text-[10px] text-[var(--color-on-surface-variant)]">{k.label}</p>
              </div>
            );
          })}
        </div>

        <div className="mb-2 flex justify-between text-xs">
          <span className="text-[var(--color-on-surface-variant)]">Utilización del cupo</span>
          <span className={`font-bold ${pct > 90 ? "text-red-700" : pct > 70 ? "text-amber-700" : "text-[var(--color-agri-green)]"}`}>{pct.toFixed(1)}%</span>
        </div>
        <div className="h-3 bg-[var(--color-surface-container)] rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all ${pct > 90 ? "bg-red-500" : pct > 70 ? "bg-amber-500" : "bg-[var(--color-agri-green)]"}`}
            style={{ width: `${Math.min(100, pct)}%` }} />
        </div>
      </div>

      {/* Vencimientos */}
      <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-container-low)]">
          <p className="text-xs font-semibold">Próximos vencimientos</p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] text-[var(--color-on-surface-variant)] border-b border-[var(--color-border-subtle)]">
              <th className="text-left px-4 py-2 font-semibold">Factura</th>
              <th className="text-right px-4 py-2 font-semibold">Monto</th>
              <th className="text-center px-4 py-2 font-semibold">Vence</th>
              <th className="text-center px-4 py-2 font-semibold">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border-subtle)]">
            {MOCK_VENCIMIENTOS.map(v => (
              <tr key={v.invoiceId} className={v.daysOverdue > 0 ? "bg-red-50" : ""}>
                <td className="px-4 py-2.5 text-xs font-mono">{v.invoiceId}</td>
                <td className="px-4 py-2.5 text-xs text-right font-bold">${v.amount.toLocaleString()}</td>
                <td className="px-4 py-2.5 text-xs text-center">{new Date(v.dueDate).toLocaleDateString("es-CO")}</td>
                <td className="px-4 py-2.5 text-center">
                  {v.daysOverdue > 0 ? (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-red-700 bg-red-100 px-1.5 py-0.5 rounded">
                      <AlertTriangle size={9} />{v.daysOverdue} días vencida
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-green-700">
                      <CheckCircle size={9} />Al día
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ViewAnalista({ credit }: { credit: Credit }) {
  const [newLimit, setNewLimit] = useState(credit.totalLimit.toString());
  const [notes, setNotes] = useState(credit.notes ?? "");
  const [decision, setDecision] = useState<"aprobar" | "ampliar" | "suspender" | null>(null);

  const totalScore = MOCK_SCORE.reduce((s, m) => s + m.score, 0);
  const maxScore = MOCK_SCORE.reduce((s, m) => s + m.max, 0);
  const scoreGlobal = Math.round((totalScore / maxScore) * 100);

  return (
    <div className="space-y-6">
      {/* Score card */}
      <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold text-white ${scoreGlobal >= 80 ? "bg-[var(--color-agri-green)]" : scoreGlobal >= 60 ? "bg-amber-500" : "bg-red-500"}`}>
            {scoreGlobal}
          </div>
          <div>
            <p className="font-semibold">Score crediticio</p>
            <p className="text-xs text-[var(--color-on-surface-variant)]">{scoreGlobal >= 80 ? "Excelente" : scoreGlobal >= 60 ? "Bueno" : "Regular"} — basado en {MOCK_SCORE.length} métricas</p>
          </div>
        </div>

        <div className="space-y-2">
          {MOCK_SCORE.map(m => (
            <div key={m.label}>
              <div className="flex justify-between text-xs mb-0.5">
                <span>{m.label}</span>
                <span className="font-medium">{m.value} ({m.score}/{m.max})</span>
              </div>
              <div className="h-1.5 bg-[var(--color-surface-container)] rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${m.score >= 80 ? "bg-[var(--color-agri-green)]" : m.score >= 60 ? "bg-amber-500" : "bg-red-500"}`}
                  style={{ width: `${(m.score / m.max) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Decision form */}
      <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-5">
        <p className="text-sm font-semibold mb-4 flex items-center gap-2"><Shield size={15} />Decisión de crédito</p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-[10px] font-semibold text-[var(--color-on-surface-variant)]">Cupo actual</p>
            <p className="text-sm font-bold">${credit.totalLimit.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-[var(--color-on-surface-variant)]">Garantías</p>
            <p className="text-sm">{credit.guaranteeType ?? "Sin garantía"}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-[var(--color-on-surface-variant)]">Analista asignado</p>
            <p className="text-sm">{credit.analystName ?? "—"}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-[var(--color-on-surface-variant)]">Próxima revisión</p>
            <p className="text-sm">{credit.nextReview ? new Date(credit.nextReview).toLocaleDateString("es-CO") : "—"}</p>
          </div>
        </div>

        <label className="text-xs font-medium block mb-3">
          Nuevo cupo propuesto (USD)
          <input type="number" value={newLimit} onChange={e => setNewLimit(e.target.value)}
            className="w-full mt-1 p-2.5 text-sm border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]" />
        </label>
        <label className="text-xs font-medium block mb-4">
          Notas del analista
          <textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)}
            className="w-full mt-1 p-2.5 text-xs border border-[var(--color-border-subtle)] rounded-lg resize-none focus:outline-none focus:border-[var(--color-primary)]" />
        </label>

        {decision && (
          <div className="mb-4 p-3 bg-[var(--color-surface-container-low)] rounded-lg border border-[var(--color-border-subtle)]">
            <p className="text-xs font-semibold">Confirmar: {decision === "aprobar" ? "Aprobar/renovar cupo" : decision === "ampliar" ? "Ampliar cupo" : "Suspender crédito"}</p>
            <div className="flex gap-2 mt-2">
              <button onClick={() => setDecision(null)}
                className={`text-xs font-semibold px-4 py-2 rounded-lg text-white hover:opacity-90 ${decision === "suspender" ? "bg-[var(--color-secondary)]" : "bg-[var(--color-primary)]"}`}>
                Confirmar
              </button>
              <button onClick={() => setDecision(null)} className="text-xs border border-[var(--color-border-subtle)] px-3 py-2 rounded-lg">Cancelar</button>
            </div>
          </div>
        )}

        {!decision && (
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setDecision("aprobar")} className="flex items-center gap-1.5 text-xs font-semibold bg-[var(--color-agri-green)] text-white px-4 py-2 rounded-lg hover:opacity-90">
              <CheckCircle size={12} /> Aprobar / Renovar
            </button>
            <button onClick={() => setDecision("ampliar")} className="flex items-center gap-1.5 text-xs font-semibold bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg hover:opacity-90">
              <TrendingUp size={12} /> Ampliar cupo
            </button>
            <button onClick={() => setDecision("suspender")} className="flex items-center gap-1.5 text-xs font-semibold bg-[var(--color-secondary)] text-white px-4 py-2 rounded-lg hover:opacity-90">
              <AlertTriangle size={12} /> Suspender
            </button>
          </div>
        )}
      </div>

      {/* History placeholder */}
      <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-5">
        <p className="text-xs font-semibold mb-3 flex items-center gap-2"><BarChart3 size={13} />Historial de decisiones</p>
        {[
          { date: "2024-03-15", action: "Aprobación inicial", analyst: "Luis Analista", limit: 200000 },
          { date: "2023-09-01", action: "Renovación anual", analyst: "Luis Analista", limit: 150000 },
          { date: "2023-03-10", action: "Aprobación inicial", analyst: "Rosa Finanzas", limit: 100000 },
        ].map((h, i) => (
          <div key={i} className="flex items-center gap-3 py-2 border-b border-[var(--color-border-subtle)] last:border-0">
            <Clock size={12} className="text-[var(--color-on-surface-variant)] shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-medium">{h.action}</p>
              <p className="text-[10px] text-[var(--color-on-surface-variant)]">{new Date(h.date).toLocaleDateString("es-CO")} · {h.analyst}</p>
            </div>
            <span className="text-xs font-bold">${h.limit.toLocaleString()}</span>
            <ChevronRight size={12} className="text-[var(--color-on-surface-variant)]" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CreditoPage() {
  const [view, setView] = useState<ViewMode>("comprador");

  return (
    <div className="container-max py-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-headline-md font-bold">Crédito B2B</h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">AgroInversiones S.A.S · Línea de crédito corporativa</p>
        </div>
        {/* View switcher */}
        <div className="flex rounded-lg border border-[var(--color-border-subtle)] overflow-hidden">
          {(["comprador", "analista"] as const).map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`text-xs font-medium px-4 py-2 transition-colors ${view === v ? "bg-[var(--color-primary)] text-white" : "bg-white text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)]"}`}>
              Vista {v === "comprador" ? "Comprador" : "Analista"}
            </button>
          ))}
        </div>
      </div>

      {view === "comprador" ? <ViewComprador credit={MOCK_CREDIT} /> : <ViewAnalista credit={MOCK_CREDIT} />}
    </div>
  );
}
