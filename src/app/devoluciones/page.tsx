"use client";

import { useState } from "react";
import { Plus, Package, CheckCircle, Clock, XCircle, AlertCircle, ArrowLeft } from "lucide-react";

type ReturnStatus = "solicitada" | "aprobada" | "rechazada" | "en_proceso" | "completada";
type ReturnReason = "producto_dañado" | "producto_incorrecto" | "calidad_insuficiente" | "entrega_tardía" | "cambio_de_opinion";

interface Return {
  id: string; orderNum: string; product: string; quantity: number; vendor: string;
  reason: ReturnReason; status: ReturnStatus; refundAmount: number; currency: string;
  requestDate: string; processDate?: string; notes: string;
}

const MOCK_RETURNS: Return[] = [
  { id: "r1", orderNum: "ORD-2026-4310", product: "Sulfato de Potasio 50% 25Kg", quantity: 2, vendor: "NutriPlant Ltda", reason: "producto_dañado", status: "completada", refundAmount: 160.00, currency: "USD", requestDate: "2026-06-01", processDate: "2026-06-07", notes: "Sacos recibidos con humedad y producto apelmazado" },
  { id: "r2", orderNum: "ORD-2026-4455", product: "Glifosato 480 SL 5L", quantity: 5, vendor: "DistAgroMax SAS", reason: "producto_incorrecto", status: "aprobada", refundAmount: 225.00, currency: "USD", requestDate: "2026-06-08", notes: "Se enviaron botellones de 1L en lugar de 5L solicitados" },
  { id: "r3", orderNum: "ORD-2026-4222", product: "Beauveria bassiana WP 1Kg", quantity: 3, vendor: "BioSolutions Corp", reason: "calidad_insuficiente", status: "rechazada", refundAmount: 0, currency: "USD", requestDate: "2026-05-25", processDate: "2026-05-28", notes: "Producto con baja viabilidad de esporas según análisis" },
  { id: "r4", orderNum: "ORD-2026-4180", product: "NPK 15-15-15 50Kg", quantity: 1, vendor: "AgroSuministros CO", reason: "entrega_tardía", status: "solicitada", refundAmount: 89.00, currency: "USD", requestDate: "2026-06-09", notes: "Llegó 15 días tarde, ya compré con otro proveedor" },
];

const STATUS_CFG: Record<ReturnStatus, { label: string; color: string; icon: React.ReactNode }> = {
  solicitada: { label: "Solicitada", color: "bg-blue-100 text-blue-700", icon: <Clock size={11} /> },
  aprobada: { label: "Aprobada", color: "bg-green-100 text-green-700", icon: <CheckCircle size={11} /> },
  rechazada: { label: "Rechazada", color: "bg-red-100 text-red-700", icon: <XCircle size={11} /> },
  en_proceso: { label: "En proceso", color: "bg-yellow-100 text-yellow-700", icon: <Clock size={11} /> },
  completada: { label: "Completada", color: "bg-gray-100 text-gray-600", icon: <CheckCircle size={11} /> },
};

const REASON_LABELS: Record<ReturnReason, string> = {
  producto_dañado: "Producto dañado", producto_incorrecto: "Producto incorrecto",
  calidad_insuficiente: "Calidad insuficiente", entrega_tardía: "Entrega tardía", cambio_de_opinion: "Cambio de opinión",
};

export default function DevolucionesPage() {
  const [returns] = useState(MOCK_RETURNS);
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<ReturnStatus | "todas">("todas");

  const filtered = returns.filter(r => filterStatus === "todas" || r.status === filterStatus);
  const totalRefunded = returns.filter(r => r.status === "completada").reduce((s, r) => s + r.refundAmount, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Mis devoluciones</h1><p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">Gestión de retornos y reembolsos</p></div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-[var(--color-primary)] text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:opacity-90"><Plus size={15} /> Solicitar devolución</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total devoluciones", value: returns.length, color: "text-[var(--color-primary)]" },
          { label: "Aprobadas", value: returns.filter(r => r.status === "aprobada").length, color: "text-green-600" },
          { label: "En revisión", value: returns.filter(r => r.status === "solicitada").length, color: "text-blue-600" },
          { label: "Reembolsado", value: `$${totalRefunded.toFixed(2)}`, color: "text-green-700" },
        ].map(k => (
          <div key={k.label} className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4"><p className={`text-xl font-bold ${k.color}`}>{k.value}</p><p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{k.label}</p></div>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        {(["todas", "solicitada", "aprobada", "rechazada", "completada"] as const).map(s => (
          <button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize ${filterStatus === s ? "bg-[var(--color-primary)] text-white" : "border border-[var(--color-border-subtle)] hover:bg-gray-50"}`}>{s === "todas" ? "Todas" : STATUS_CFG[s as ReturnStatus].label}</button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(ret => {
          const scfg = STATUS_CFG[ret.status];
          return (
            <div key={ret.id} className="bg-white border border-[var(--color-border-subtle)] rounded-2xl p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2"><span className="font-mono text-xs font-bold">{ret.orderNum}</span><span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${scfg.color}`}>{scfg.icon} {scfg.label}</span></div>
                  <p className="font-semibold text-sm mt-1">{ret.product}</p>
                  <p className="text-xs text-[var(--color-on-surface-variant)]">{ret.vendor} · Cantidad: {ret.quantity} unidades · {REASON_LABELS[ret.reason]}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  {ret.refundAmount > 0 ? <><p className="text-base font-bold text-green-700">${ret.refundAmount.toFixed(2)}</p><p className="text-xs text-[var(--color-on-surface-variant)]">Reembolso</p></> : <p className="text-xs text-[var(--color-on-surface-variant)]">Sin reembolso</p>}
                </div>
              </div>
              <div className="bg-[var(--color-surface-container-low)] rounded-lg p-3 text-xs text-[var(--color-on-surface-variant)]">
                <p className="font-medium text-[var(--color-on-surface)] mb-0.5">Motivo:</p>
                {ret.notes}
              </div>
              <div className="flex items-center gap-4 text-xs text-[var(--color-on-surface-variant)]">
                <span>Solicitada: {ret.requestDate}</span>
                {ret.processDate && <span>Procesada: {ret.processDate}</span>}
              </div>
            </div>
          );
        })}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-bold text-base">Solicitar devolución</h3>
            <div className="space-y-3">
              <div><label className="block text-sm font-medium mb-1">Número de orden *</label><input className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]" /></div>
              <div><label className="block text-sm font-medium mb-1">Motivo de devolución *</label><select className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 text-sm outline-none">{Object.entries(REASON_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
              <div><label className="block text-sm font-medium mb-1">Cantidad a devolver</label><input type="number" min={1} className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]" /></div>
              <div><label className="block text-sm font-medium mb-1">Descripción detallada *</label><textarea rows={3} className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)] resize-none" placeholder="Describe el problema con el producto o pedido..." /></div>
            </div>
            <div className="flex gap-3"><button onClick={() => setShowForm(false)} className="flex-1 border border-[var(--color-border-subtle)] text-sm font-medium py-2 rounded-lg">Cancelar</button><button onClick={() => setShowForm(false)} className="flex-1 bg-[var(--color-primary)] text-white text-sm font-semibold py-2 rounded-lg">Enviar solicitud</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
