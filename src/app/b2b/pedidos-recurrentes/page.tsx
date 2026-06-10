"use client";

import { useState } from "react";
import { RefreshCw, Plus, Edit2, Pause, Play, Trash2, Package, Calendar, DollarSign, CheckCircle, Clock, AlertCircle } from "lucide-react";

type Frequency = "semanal" | "quincenal" | "mensual" | "bimestral" | "trimestral";
type RecOrderStatus = "activo" | "pausado" | "cancelado";

interface RecurringItem { product: string; sku: string; quantity: number; unit: string; price: number; }
interface RecurringOrder {
  id: string; name: string; vendor: string; frequency: Frequency;
  status: RecOrderStatus; nextDate: string; lastDate?: string;
  items: RecurringItem[]; totalAmount: number; currency: string;
  autoApprove: boolean; createdAt: string;
}

const MOCK_RECURRING: RecurringOrder[] = [
  {
    id: "rec1", name: "Pedido mensual fertilizantes", vendor: "AgroSuministros CO SAS",
    frequency: "mensual", status: "activo", nextDate: "2026-07-01", lastDate: "2026-06-01",
    items: [
      { product: "NPK 15-15-15 Fertilizante", sku: "FRT-NPK-151515-50K", quantity: 10, unit: "sacos 50Kg", price: 22.10 },
      { product: "Urea 46% Gránulo", sku: "FRT-URE-46-50K", quantity: 5, unit: "sacos 50Kg", price: 31.80 },
    ],
    totalAmount: 380.00, currency: "USD", autoApprove: true, createdAt: "2026-01-15",
  },
  {
    id: "rec2", name: "Biológicos control integrado", vendor: "BioSolutions Corp",
    frequency: "quincenal", status: "activo", nextDate: "2026-06-22", lastDate: "2026-06-08",
    items: [
      { product: "Beauveria bassiana WP 1Kg", sku: "BIO-BEA-WP-1K", quantity: 4, unit: "frascos", price: 41.00 },
    ],
    totalAmount: 164.00, currency: "USD", autoApprove: false, createdAt: "2026-03-01",
  },
  {
    id: "rec3", name: "Herbicidas temporada alta", vendor: "DistAgroMax SAS",
    frequency: "trimestral", status: "pausado", nextDate: "2026-09-01", lastDate: "2026-06-01",
    items: [
      { product: "Glifosato 480 SL 5L", sku: "HRB-GLF-480-5L", quantity: 20, unit: "botellones", price: 48.50 },
    ],
    totalAmount: 970.00, currency: "USD", autoApprove: true, createdAt: "2025-09-01",
  },
];

const FREQ_LABELS: Record<Frequency, string> = {
  semanal: "Semanal", quincenal: "Cada 15 días", mensual: "Mensual",
  bimestral: "Bimestral", trimestral: "Trimestral",
};

const STATUS_CFG: Record<RecOrderStatus, { label: string; color: string; icon: React.ReactNode }> = {
  activo: { label: "Activo", color: "bg-green-100 text-green-700", icon: <CheckCircle size={11} /> },
  pausado: { label: "Pausado", color: "bg-yellow-100 text-yellow-700", icon: <Clock size={11} /> },
  cancelado: { label: "Cancelado", color: "bg-red-100 text-red-700", icon: <AlertCircle size={11} /> },
};

export default function PedidosRecurrentesPage() {
  const [orders, setOrders] = useState(MOCK_RECURRING);
  const [showForm, setShowForm] = useState(false);

  function toggleStatus(id: string) {
    setOrders(prev => prev.map(o => {
      if (o.id !== id) return o;
      return { ...o, status: o.status === "activo" ? "pausado" as RecOrderStatus : "activo" as RecOrderStatus };
    }));
  }

  const totalMonthly = orders.filter(o => o.status === "activo").reduce((s, o) => {
    const factor = o.frequency === "mensual" ? 1 : o.frequency === "quincenal" ? 2 : o.frequency === "semanal" ? 4 : o.frequency === "bimestral" ? 0.5 : 0.33;
    return s + (o.totalAmount * factor);
  }, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold flex items-center gap-2"><RefreshCw size={22} className="text-[var(--color-primary)]" /> Pedidos recurrentes</h1><p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">Automatiza tus compras habituales de insumos</p></div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-[var(--color-primary)] text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:opacity-90"><Plus size={15} /> Nuevo pedido recurrente</button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Pedidos activos", value: orders.filter(o => o.status === "activo").length, color: "text-green-600" },
          { label: "Gasto mensual estimado", value: `$${totalMonthly.toFixed(2)}`, color: "text-[var(--color-primary)]" },
          { label: "Proveedores vinculados", value: new Set(orders.map(o => o.vendor)).size, color: "text-blue-600" },
        ].map(k => (
          <div key={k.label} className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4"><p className={`text-2xl font-bold ${k.color}`}>{k.value}</p><p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{k.label}</p></div>
        ))}
      </div>

      <div className="space-y-4">
        {orders.map(order => {
          const scfg = STATUS_CFG[order.status];
          return (
            <div key={order.id} className={`bg-white border rounded-2xl overflow-hidden ${order.status === "pausado" ? "border-yellow-200 opacity-80" : "border-[var(--color-border-subtle)]"}`}>
              <div className="p-4 flex items-start gap-4">
                <div className="w-10 h-10 bg-[var(--color-primary)]/10 rounded-xl flex-shrink-0 flex items-center justify-center"><RefreshCw size={18} className="text-[var(--color-primary)]" /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-sm">{order.name}</p>
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${scfg.color}`}>{scfg.icon} {scfg.label}</span>
                      </div>
                      <p className="text-xs text-[var(--color-on-surface-variant)]">{order.vendor}</p>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button onClick={() => toggleStatus(order.id)} className={`p-1.5 rounded-lg ${order.status === "activo" ? "hover:bg-yellow-50 text-yellow-600" : "hover:bg-green-50 text-green-600"}`}>{order.status === "activo" ? <Pause size={14} /> : <Play size={14} />}</button>
                      <button className="p-1.5 hover:bg-gray-100 rounded-lg text-[var(--color-on-surface-variant)]"><Edit2 size={14} /></button>
                      <button className="p-1.5 hover:bg-red-50 rounded-lg text-red-400"><Trash2 size={14} /></button>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div className="flex items-center gap-1.5 text-xs"><Calendar size={12} className="text-[var(--color-primary)]" /><div><p className="text-[var(--color-on-surface-variant)]">Frecuencia</p><p className="font-medium">{FREQ_LABELS[order.frequency]}</p></div></div>
                    <div className="flex items-center gap-1.5 text-xs"><Calendar size={12} className="text-green-500" /><div><p className="text-[var(--color-on-surface-variant)]">Próximo pedido</p><p className="font-medium">{order.nextDate}</p></div></div>
                    <div className="flex items-center gap-1.5 text-xs"><DollarSign size={12} className="text-[var(--color-primary)]" /><div><p className="text-[var(--color-on-surface-variant)]">Monto por pedido</p><p className="font-medium">${order.totalAmount.toFixed(2)} {order.currency}</p></div></div>
                    <div className="flex items-center gap-1.5 text-xs"><CheckCircle size={12} className={order.autoApprove ? "text-green-500" : "text-gray-400"} /><div><p className="text-[var(--color-on-surface-variant)]">Auto-aprobar</p><p className="font-medium">{order.autoApprove ? "Sí" : "No"}</p></div></div>
                  </div>

                  <div className="mt-3 border-t border-[var(--color-border-subtle)] pt-3 space-y-1.5">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2"><Package size={10} className="text-[var(--color-on-surface-variant)]" /><span>{item.product}</span><span className="text-[var(--color-on-surface-variant)] font-mono">{item.sku}</span></div>
                        <div className="text-right"><span className="font-medium">{item.quantity} {item.unit}</span><span className="text-[var(--color-on-surface-variant)] ml-2">${(item.price * item.quantity).toFixed(2)}</span></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-bold text-base">Nuevo pedido recurrente</h3>
            <div className="space-y-3">
              <div><label className="block text-sm font-medium mb-1">Nombre del pedido</label><input className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]" /></div>
              <div><label className="block text-sm font-medium mb-1">Proveedor</label><input placeholder="Buscar proveedor..." className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]" /></div>
              <div><label className="block text-sm font-medium mb-1">Frecuencia</label><select className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 text-sm outline-none">{Object.entries(FREQ_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
              <div><label className="block text-sm font-medium mb-1">Primera fecha de pedido</label><input type="date" className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 text-sm outline-none" /></div>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="accent-[var(--color-primary)]" /><span className="text-sm">Aprobar automáticamente cada pedido</span></label>
            </div>
            <div className="flex gap-3"><button onClick={() => setShowForm(false)} className="flex-1 border border-[var(--color-border-subtle)] text-sm font-medium py-2 rounded-lg">Cancelar</button><button onClick={() => setShowForm(false)} className="flex-1 bg-[var(--color-primary)] text-white text-sm font-semibold py-2 rounded-lg">Crear pedido recurrente</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
