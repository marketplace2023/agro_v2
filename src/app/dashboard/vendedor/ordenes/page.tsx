"use client";

import { useState } from "react";
import { Search, CheckCircle, Truck, Clock, XCircle, ChevronDown, Eye, Package } from "lucide-react";

type OrderStatus = "pendiente" | "confirmada" | "preparando" | "despachada" | "entregada" | "cancelada";

interface VendorOrder {
  id: string; orderNum: string; buyer: string; company: string;
  items: { name: string; qty: number; unit: string; price: number }[];
  total: number; status: OrderStatus; paymentStatus: "pagado" | "pendiente" | "credito";
  deliveryDate: string; createdAt: string; city: string; country: string;
}

const MOCK_ORDERS: VendorOrder[] = [
  { id: "o1", orderNum: "ORD-2026-4521", buyer: "Juan Pérez", company: "Agro Finca La Esperanza", items: [{ name: "Glifosato 480 SL", qty: 20, unit: "Lt", price: 45 }, { name: "Urea Granulada", qty: 5, unit: "50kg", price: 42.5 }], total: 1112.5, status: "pendiente", paymentStatus: "pagado", deliveryDate: "2026-06-15", createdAt: "2026-06-10", city: "Bogotá", country: "CO" },
  { id: "o2", orderNum: "ORD-2026-4498", buyer: "María González", company: "Hacienda El Palmar SAS", items: [{ name: "Mancozeb 80% WP", qty: 50, unit: "kg", price: 22 }], total: 1100, status: "confirmada", paymentStatus: "pagado", deliveryDate: "2026-06-13", createdAt: "2026-06-08", city: "Medellín", country: "CO" },
  { id: "o3", orderNum: "ORD-2026-4445", buyer: "Carlos Ruiz", company: "Agroinsumos Norte SRL", items: [{ name: "Trichoderma Harzianum", qty: 10, unit: "kg", price: 35 }, { name: "Beauveria bassiana", qty: 5, unit: "kg", price: 32 }], total: 510, status: "preparando", paymentStatus: "credito", deliveryDate: "2026-06-12", createdAt: "2026-06-06", city: "Cali", country: "CO" },
  { id: "o4", orderNum: "ORD-2026-4380", buyer: "Ana Torres", company: "Distribuidora Agro Ecuador", items: [{ name: "Clorpirifos 480 EC", qty: 30, unit: "Lt", price: 28 }], total: 840, status: "despachada", paymentStatus: "pagado", deliveryDate: "2026-06-11", createdAt: "2026-06-04", city: "Quito", country: "EC" },
  { id: "o5", orderNum: "ORD-2026-4312", buyer: "Pedro Vargas", company: "Finca Productora Venezuela", items: [{ name: "NPK 15-15-15", qty: 10, unit: "50kg", price: 38 }], total: 380, status: "entregada", paymentStatus: "pagado", deliveryDate: "2026-06-05", createdAt: "2026-05-28", city: "Caracas", country: "VE" },
];

const STATUS_CFG: Record<OrderStatus, { label: string; color: string; icon: React.ReactNode; actions: string[] }> = {
  pendiente: { label: "Pendiente", color: "bg-yellow-100 text-yellow-700", icon: <Clock size={11} />, actions: ["Confirmar", "Rechazar"] },
  confirmada: { label: "Confirmada", color: "bg-blue-100 text-blue-700", icon: <CheckCircle size={11} />, actions: ["Iniciar preparación"] },
  preparando: { label: "Preparando", color: "bg-purple-100 text-purple-700", icon: <Package size={11} />, actions: ["Marcar despachada"] },
  despachada: { label: "Despachada", color: "bg-indigo-100 text-indigo-700", icon: <Truck size={11} />, actions: ["Confirmar entrega"] },
  entregada: { label: "Entregada", color: "bg-green-100 text-green-700", icon: <CheckCircle size={11} />, actions: [] },
  cancelada: { label: "Cancelada", color: "bg-red-100 text-red-700", icon: <XCircle size={11} />, actions: [] },
};

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  pendiente: "confirmada", confirmada: "preparando", preparando: "despachada", despachada: "entregada",
};

export default function VendedorOrdenesPage() {
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("todas");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = orders.filter(o => {
    const q = o.orderNum.toLowerCase().includes(search.toLowerCase()) || o.buyer.toLowerCase().includes(search.toLowerCase()) || o.company.toLowerCase().includes(search.toLowerCase());
    const s = filterStatus === "todas" || o.status === filterStatus;
    return q && s;
  });

  function advance(id: string) {
    setOrders(prev => prev.map(o => {
      if (o.id !== id) return o;
      const next = NEXT_STATUS[o.status];
      return next ? { ...o, status: next } : o;
    }));
  }

  function cancel(id: string) { setOrders(prev => prev.map(o => o.id === id ? { ...o, status: "cancelada" } : o)); }

  const counts = { todas: orders.length, pendiente: orders.filter(o => o.status === "pendiente").length, confirmada: orders.filter(o => o.status === "confirmada").length, preparando: orders.filter(o => o.status === "preparando").length, despachada: orders.filter(o => o.status === "despachada").length };

  return (
    <div className="space-y-5 max-w-5xl">
      <div><h1 className="text-headline-md font-bold">Mis Órdenes</h1><p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">Gestiona y despacha tus pedidos</p></div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {Object.entries(counts).map(([k, v]) => (
          <button key={k} onClick={() => setFilterStatus(k)} className={`bg-white border rounded-xl p-3 text-left transition-colors ${filterStatus === k ? "border-[var(--color-primary)]" : "border-[var(--color-border-subtle)]"}`}>
            <p className="text-xl font-bold text-[var(--color-primary)]">{v}</p>
            <p className="text-xs text-[var(--color-on-surface-variant)] capitalize mt-0.5">{k}</p>
          </button>
        ))}
      </div>

      <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4 flex gap-3">
        <div className="flex items-center gap-2 flex-1 border border-[var(--color-border-subtle)] rounded-lg px-3 py-2">
          <Search size={14} className="text-[var(--color-on-surface-variant)]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por orden, comprador, empresa..." className="text-sm flex-1 outline-none bg-transparent" />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map(order => {
          const cfg = STATUS_CFG[order.status];
          const isExpanded = expanded === order.id;
          return (
            <div key={order.id} className="bg-white border border-[var(--color-border-subtle)] rounded-xl overflow-hidden">
              <div className="px-5 py-4 flex items-center gap-4 cursor-pointer" onClick={() => setExpanded(isExpanded ? null : order.id)}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm">{order.orderNum}</span>
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${cfg.color}`}>{cfg.icon} {cfg.label}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${order.paymentStatus === "pagado" ? "bg-green-50 text-green-600" : order.paymentStatus === "credito" ? "bg-blue-50 text-blue-600" : "bg-yellow-50 text-yellow-600"}`}>{order.paymentStatus}</span>
                  </div>
                  <p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">{order.company} · {order.buyer}</p>
                  <p className="text-xs text-[var(--color-on-surface-variant)]">{order.city}, {order.country} · Entrega: {order.deliveryDate}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-base">${order.total.toLocaleString("es-CO", { minimumFractionDigits: 2 })}</p>
                  <p className="text-xs text-[var(--color-on-surface-variant)]">{order.items.length} línea{order.items.length !== 1 ? "s" : ""}</p>
                </div>
                <ChevronDown size={16} className={`text-[var(--color-on-surface-variant)] transition-transform flex-shrink-0 ${isExpanded ? "rotate-180" : ""}`} />
              </div>

              {isExpanded && (
                <div className="border-t border-[var(--color-border-subtle)] px-5 py-4 space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead><tr className="text-xs text-[var(--color-on-surface-variant)]"><th className="text-left pb-2">Producto</th><th className="text-right pb-2">Qty</th><th className="text-right pb-2">Precio</th><th className="text-right pb-2">Subtotal</th></tr></thead>
                      <tbody>
                        {order.items.map((item, i) => (
                          <tr key={i} className="border-t border-[var(--color-border-subtle)]">
                            <td className="py-2 font-medium">{item.name}</td>
                            <td className="py-2 text-right">{item.qty} {item.unit}</td>
                            <td className="py-2 text-right">${item.price.toFixed(2)}</td>
                            <td className="py-2 text-right font-semibold">${(item.qty * item.price).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {cfg.actions.map(action => (
                        <button key={action} onClick={() => advance(order.id)} className="bg-[var(--color-primary)] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90">{action}</button>
                      ))}
                      {order.status === "pendiente" && (
                        <button onClick={() => cancel(order.id)} className="border border-red-300 text-red-600 text-sm font-medium px-4 py-2 rounded-lg hover:bg-red-50">Rechazar</button>
                      )}
                    </div>
                    <button className="flex items-center gap-1 text-sm text-[var(--color-primary)] hover:underline"><Eye size={13} /> Ver detalle completo</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && <div className="text-center py-16 bg-white border border-[var(--color-border-subtle)] rounded-xl text-[var(--color-on-surface-variant)]"><Package size={32} className="mx-auto mb-2 opacity-30" /><p className="text-sm">No se encontraron órdenes</p></div>}
      </div>
    </div>
  );
}
