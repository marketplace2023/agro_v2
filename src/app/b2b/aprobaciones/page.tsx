"use client";

import { useState, useMemo } from "react";
import {
  ShieldCheck, XCircle, Sliders, Clock, DollarSign,
  AlertTriangle, CheckCircle, Plus, ChevronDown, ChevronUp,
} from "lucide-react";

type ApprovalStatus = "pendiente" | "aprobado" | "rechazado" | "ajuste_solicitado";

interface ApprovalRule {
  id: string; name: string;
  minAmount: number | null; isNewVendor: boolean;
  ccThreshold: number | null; approverId: string;
}

interface Approval {
  id: string; companyName: string; solicitante: string;
  amount: number; currency: string; orderId: string | null;
  status: ApprovalStatus; ruleApplied: string; comment: string | null;
  createdAt: string; items: { name: string; qty: number; price: number }[];
}

const MOCK_RULES: ApprovalRule[] = [
  { id: "r1", name: "Compras > $5.000", minAmount: 5000, isNewVendor: false, ccThreshold: null, approverId: "Diego Martínez" },
  { id: "r2", name: "Proveedor nuevo", minAmount: null, isNewVendor: true, ccThreshold: null, approverId: "Diego Martínez" },
  { id: "r3", name: "CC > 90% ejecutado", minAmount: null, isNewVendor: false, ccThreshold: 90, approverId: "Claudia Ríos" },
];

const MOCK_APPROVALS: Approval[] = [
  {
    id: "ap1", companyName: "AgroInversiones S.A.S", solicitante: "Jhon Torres",
    amount: 18450, currency: "USD", orderId: "ORD-20240901",
    status: "pendiente", ruleApplied: "Compras > $5.000", comment: null,
    createdAt: "2025-01-08T10:30:00Z",
    items: [
      { name: "Urea Granulada 46%", qty: 200, price: 42.5 },
      { name: "Glifosato 480 SL", qty: 50, price: 18.9 },
    ],
  },
  {
    id: "ap2", companyName: "AgroInversiones S.A.S", solicitante: "Claudia Ríos",
    amount: 7200, currency: "USD", orderId: "ORD-20240902",
    status: "pendiente", ruleApplied: "Proveedor nuevo", comment: null,
    createdAt: "2025-01-07T15:00:00Z",
    items: [
      { name: "Abamectina 1.8 EC", qty: 80, price: 45.0 },
      { name: "Trichoderma Harzianum", qty: 60, price: 35.0 },
    ],
  },
  {
    id: "ap3", companyName: "AgroInversiones S.A.S", solicitante: "Jhon Torres",
    amount: 3400, currency: "USD", orderId: "ORD-20240880",
    status: "aprobado", ruleApplied: "CC > 90% ejecutado", comment: "Aprobado urgente por campaña",
    createdAt: "2025-01-05T09:00:00Z",
    items: [{ name: "Fosfato Diamónico NPK", qty: 60, price: 55.0 }],
  },
  {
    id: "ap4", companyName: "Hacienda Los Robles", solicitante: "Andrés García",
    amount: 9800, currency: "USD", orderId: "ORD-20240875",
    status: "rechazado", ruleApplied: "Compras > $5.000", comment: "Presupuesto CC-003 insuficiente. Reducir pedido o esperar nuevo período.",
    createdAt: "2025-01-04T14:20:00Z",
    items: [{ name: "NPK 15-15-15", qty: 250, price: 38.0 }],
  },
  {
    id: "ap5", companyName: "AgroInversiones S.A.S", solicitante: "Claudia Ríos",
    amount: 12000, currency: "USD", orderId: "ORD-20240860",
    status: "ajuste_solicitado", ruleApplied: "Compras > $5.000", comment: "Por favor dividir en 2 órdenes de $6.000 máx para cada CC.",
    createdAt: "2025-01-03T11:00:00Z",
    items: [{ name: "Mancozeb 80% WP", qty: 300, price: 22.0 }, { name: "Azoxistrobina + Cipro.", qty: 100, price: 52.0 }],
  },
];

const STATUS_CFG: Record<ApprovalStatus, { label: string; color: string; bg: string; Icon: React.ElementType }> = {
  pendiente:          { label: "Pendiente",        color: "text-amber-700",  bg: "bg-amber-50 border-amber-200",   Icon: Clock },
  aprobado:           { label: "Aprobado",          color: "text-green-700",  bg: "bg-green-50 border-green-200",   Icon: CheckCircle },
  rechazado:          { label: "Rechazado",         color: "text-red-700",    bg: "bg-red-50 border-red-200",       Icon: XCircle },
  ajuste_solicitado:  { label: "Ajuste solicitado", color: "text-purple-700", bg: "bg-purple-50 border-purple-200", Icon: Sliders },
};

function ApprovalCard({ ap, onAction }: { ap: Approval; onAction: (id: string, action: "aprobar" | "rechazar" | "ajustar", comment: string) => void }) {
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [action, setAction] = useState<"aprobar" | "rechazar" | "ajustar" | null>(null);

  const cfg = STATUS_CFG[ap.status];
  const Icon = cfg.Icon;

  return (
    <div className={`bg-white border rounded-xl overflow-hidden ${ap.status === "pendiente" ? "border-amber-200" : "border-[var(--color-border-subtle)]"}`}>
      <button onClick={() => setOpen(p => !p)}
        className="w-full flex items-start gap-4 px-4 py-4 text-left hover:bg-[var(--color-surface-container-lowest)]">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color}`}>
              <Icon size={10} />{cfg.label}
            </span>
            <span className="text-xs text-[var(--color-on-surface-variant)] bg-[var(--color-surface-container)] px-1.5 py-0.5 rounded">{ap.ruleApplied}</span>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-sm font-bold text-[var(--color-primary)]">${ap.amount.toLocaleString()} {ap.currency}</p>
            <p className="text-xs text-[var(--color-on-surface-variant)]">por {ap.solicitante}</p>
            {ap.orderId && <p className="text-xs font-mono text-[var(--color-on-surface-variant)]">{ap.orderId}</p>}
          </div>
          <p className="text-[10px] text-[var(--color-on-surface-variant)] mt-0.5">
            {new Date(ap.createdAt).toLocaleString("es-CO")} · {ap.items.length} producto(s)
          </p>
        </div>
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {open && (
        <div className="px-4 pb-4 border-t border-[var(--color-border-subtle)]">
          {/* Items */}
          <div className="mt-3 mb-3">
            <p className="text-[10px] font-semibold text-[var(--color-on-surface-variant)] mb-2">Detalle del pedido</p>
            <table className="w-full text-xs">
              <thead>
                <tr className="text-[10px] text-[var(--color-on-surface-variant)] border-b border-[var(--color-border-subtle)]">
                  <th className="text-left pb-1">Producto</th>
                  <th className="text-center pb-1">Cant.</th>
                  <th className="text-right pb-1">P. Unit.</th>
                  <th className="text-right pb-1">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border-subtle)]">
                {ap.items.map((it, i) => (
                  <tr key={i}>
                    <td className="py-1.5">{it.name}</td>
                    <td className="py-1.5 text-center">{it.qty}</td>
                    <td className="py-1.5 text-right">${it.price}</td>
                    <td className="py-1.5 text-right font-semibold">${(it.qty * it.price).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {ap.comment && (
            <div className="mb-3 p-3 bg-[var(--color-surface-container-low)] rounded-lg border border-[var(--color-border-subtle)]">
              <p className="text-[10px] font-semibold text-[var(--color-on-surface-variant)] mb-0.5">Comentario del aprobador</p>
              <p className="text-xs italic">"{ap.comment}"</p>
            </div>
          )}

          {ap.status === "pendiente" && (
            <div className="space-y-2">
              {action && (
                <div className="space-y-2">
                  <label className="text-xs font-medium">
                    {action === "rechazar" ? "Motivo (obligatorio) *" : "Comentario (opcional)"}
                    <textarea rows={2} value={comment} onChange={e => setComment(e.target.value)}
                      placeholder={action === "rechazar" ? "Explica el motivo del rechazo..." : "Nota para el comprador..."}
                      className="w-full mt-1 p-2 text-xs border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] resize-none" />
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { if (action === "rechazar" && !comment.trim()) return; onAction(ap.id, action, comment); setAction(null); setComment(""); }}
                      className={`text-xs font-semibold px-4 py-2 rounded-lg text-white hover:opacity-90 ${action === "aprobar" ? "bg-[var(--color-agri-green)]" : action === "rechazar" ? "bg-[var(--color-secondary)]" : "bg-purple-600"}`}>
                      Confirmar {action === "aprobar" ? "aprobación" : action === "rechazar" ? "rechazo" : "ajuste"}
                    </button>
                    <button onClick={() => { setAction(null); setComment(""); }} className="text-xs border border-[var(--color-border-subtle)] px-3 py-2 rounded-lg">Cancelar</button>
                  </div>
                </div>
              )}
              {!action && (
                <div className="flex gap-2">
                  <button onClick={() => setAction("aprobar")} className="flex items-center gap-1.5 text-xs font-semibold bg-[var(--color-agri-green)] text-white px-4 py-2 rounded-lg hover:opacity-90">
                    <CheckCircle size={12} /> Aprobar
                  </button>
                  <button onClick={() => setAction("rechazar")} className="flex items-center gap-1.5 text-xs font-semibold bg-[var(--color-secondary)] text-white px-4 py-2 rounded-lg hover:opacity-90">
                    <XCircle size={12} /> Rechazar
                  </button>
                  <button onClick={() => setAction("ajustar")} className="flex items-center gap-1.5 text-xs font-semibold bg-purple-600 text-white px-4 py-2 rounded-lg hover:opacity-90">
                    <Sliders size={12} /> Solicitar ajuste
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AprobacionesPage() {
  const [approvals, setApprovals] = useState(MOCK_APPROVALS);
  const [statusFilter, setStatusFilter] = useState<ApprovalStatus | "todos">("todos");
  const [showRules, setShowRules] = useState(false);

  const pending = useMemo(() => approvals.filter(a => a.status === "pendiente"), [approvals]);
  const filtered = useMemo(() => statusFilter === "todos" ? approvals : approvals.filter(a => a.status === statusFilter), [approvals, statusFilter]);

  function handleAction(id: string, action: "aprobar" | "rechazar" | "ajustar", comment: string) {
    const statusMap = { aprobar: "aprobado" as const, rechazar: "rechazado" as const, ajustar: "ajuste_solicitado" as const };
    setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: statusMap[action], comment } : a));
  }

  return (
    <div className="container-max py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-headline-md font-bold">Aprobaciones B2B</h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">Cola de aprobación corporativa con reglas configurables</p>
        </div>
        <button onClick={() => setShowRules(p => !p)}
          className="flex items-center gap-2 border border-[var(--color-border-subtle)] text-xs font-medium px-4 py-2 rounded-lg hover:bg-[var(--color-surface-container-low)]">
          <Sliders size={13} /> Reglas de aprobación
        </button>
      </div>

      {/* Pending alert */}
      {pending.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <AlertTriangle size={18} className="text-amber-700 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-800">{pending.length} solicitud(es) pendiente(s) de aprobación</p>
            <p className="text-xs text-amber-700">Monto total: <strong>${pending.reduce((s, a) => s + a.amount, 0).toLocaleString()}</strong> USD</p>
          </div>
        </div>
      )}

      {/* Rules panel */}
      {showRules && (
        <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold">Reglas de aprobación configuradas</p>
            <button className="flex items-center gap-1.5 text-xs bg-[var(--color-primary)] text-white px-3 py-1.5 rounded-lg hover:opacity-90">
              <Plus size={12} /> Nueva regla
            </button>
          </div>
          <div className="space-y-2">
            {MOCK_RULES.map(rule => (
              <div key={rule.id} className="flex items-center gap-4 p-3 bg-[var(--color-surface-container-low)] rounded-lg">
                <div className="flex-1">
                  <p className="text-xs font-semibold">{rule.name}</p>
                  <div className="flex gap-2 mt-0.5">
                    {rule.minAmount && <span className="text-[10px] text-[var(--color-on-surface-variant)]"><DollarSign size={9} className="inline" /> Monto &gt; ${rule.minAmount.toLocaleString()}</span>}
                    {rule.isNewVendor && <span className="text-[10px] text-[var(--color-on-surface-variant)]">Proveedor nuevo</span>}
                    {rule.ccThreshold && <span className="text-[10px] text-[var(--color-on-surface-variant)]">CC &gt; {rule.ccThreshold}%</span>}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-[var(--color-on-surface-variant)]">Aprobador</p>
                  <p className="text-xs font-medium">{rule.approverId}</p>
                </div>
                <button className="p-1 hover:bg-[var(--color-surface-container)] rounded"><Sliders size={13} className="text-[var(--color-on-surface-variant)]" /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Status filter tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {(["todos", "pendiente", "aprobado", "rechazado", "ajuste_solicitado"] as const).map(s => {
          const cfg = s !== "todos" ? STATUS_CFG[s] : null;
          const count = s === "todos" ? approvals.length : approvals.filter(a => a.status === s).length;
          return (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`shrink-0 flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${statusFilter === s ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]" : "bg-white border-[var(--color-border-subtle)] text-[var(--color-on-surface-variant)] hover:border-[var(--color-primary)]"}`}>
              {cfg && (() => { const Icon = cfg.Icon; return <Icon size={11} />; })()}
              {s === "todos" ? "Todas" : cfg!.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Approval cards */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-10 text-[var(--color-on-surface-variant)] text-sm bg-white border border-[var(--color-border-subtle)] rounded-xl">
            Sin solicitudes con los filtros actuales
          </div>
        )}
        {filtered.map(ap => <ApprovalCard key={ap.id} ap={ap} onAction={handleAction} />)}
      </div>
    </div>
  );
}
