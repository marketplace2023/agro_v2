"use client";

import { useState } from "react";
import { CheckCircle, Circle, Package, MapPin, ClipboardList, Truck } from "lucide-react";

type PickStatus = "pendiente" | "en_proceso" | "completado";

interface PickItem { id: string; sku: string; product: string; quantity: number; unit: string; location: string; lotNum: string; picked: boolean; }
interface PickOrder { id: string; orderNum: string; vendor: string; priority: "normal" | "urgente"; status: PickStatus; assignedTo: string; items: PickItem[]; createdAt: string; }

const MOCK_ORDERS: PickOrder[] = [
  {
    id: "pk1", orderNum: "ORD-2026-4521", vendor: "Hacienda El Palmar SAS", priority: "urgente", status: "en_proceso", assignedTo: "Luis Álvarez", createdAt: "2026-06-10 08:00",
    items: [
      { id: "i1", sku: "HRB-GLF-480-5L", product: "Glifosato 480 SL 5L", quantity: 10, unit: "unidades", location: "Bodega A - Estante 12", lotNum: "LOT-2026-00145", picked: true },
      { id: "i2", sku: "FRT-NPK-151515-50K", product: "NPK 15-15-15 50Kg", quantity: 5, unit: "sacos", location: "Bodega B - Piso 2", lotNum: "LOT-2026-00132", picked: false },
      { id: "i3", sku: "ACA-ABA-18-1L", product: "Abamectina 1.8 EC 1L", quantity: 20, unit: "unidades", location: "Bodega A - Estante 8", lotNum: "LOT-2025-00789", picked: false },
    ]
  },
  {
    id: "pk2", orderNum: "ORD-2026-4498", vendor: "Agroinsumos Norte SRL", priority: "normal", status: "pendiente", assignedTo: "Sin asignar", createdAt: "2026-06-10 09:30",
    items: [
      { id: "i4", sku: "BIO-BEA-WP-1K", product: "Beauveria bassiana WP 1Kg", quantity: 8, unit: "frascos", location: "Bodega C - Refrigerado", lotNum: "LOT-2026-00098", picked: false },
      { id: "i5", sku: "FRT-SPO-50-25K", product: "Sulfato de Potasio 25Kg", quantity: 3, unit: "sacos", location: "Bodega B - Piso 1", lotNum: "LOT-2026-00178", picked: false },
    ]
  },
  {
    id: "pk3", orderNum: "ORD-2026-4390", vendor: "AgroCaribe SAS", priority: "normal", status: "completado", assignedTo: "María Rodríguez", createdAt: "2026-06-09 14:00",
    items: [
      { id: "i6", sku: "HRB-GLF-480-5L", product: "Glifosato 480 SL 5L", quantity: 6, unit: "unidades", location: "Bodega A - Estante 12", lotNum: "LOT-2026-00145", picked: true },
    ]
  },
];

const STATUS_CFG: Record<PickStatus, { label: string; color: string; bg: string }> = {
  pendiente: { label: "Pendiente", color: "text-yellow-700", bg: "bg-yellow-100" },
  en_proceso: { label: "En proceso", color: "text-blue-700", bg: "bg-blue-100" },
  completado: { label: "Completado", color: "text-green-700", bg: "bg-green-100" },
};

export default function PickingPage() {
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [active, setActive] = useState<string | null>("pk1");
  const [filterStatus, setFilterStatus] = useState<PickStatus | "todos">("todos");

  const filtered = orders.filter(o => filterStatus === "todos" || o.status === filterStatus);
  const activeOrder = orders.find(o => o.id === active);

  function toggleItem(orderId: string, itemId: string) {
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o;
      const updatedItems = o.items.map(i => i.id === itemId ? { ...i, picked: !i.picked } : i);
      const allPicked = updatedItems.every(i => i.picked);
      return { ...o, items: updatedItems, status: allPicked ? "completado" : "en_proceso" as PickStatus };
    }));
  }

  function startOrder(id: string) {
    setOrders(prev => prev.map(o => o.id === id && o.status === "pendiente" ? { ...o, status: "en_proceso" as PickStatus, assignedTo: "Yo (sesión actual)" } : o));
    setActive(id);
  }

  return (
    <div className="space-y-5 max-w-7xl">
      <div><h1 className="text-headline-md font-bold">Picking — Preparación de pedidos</h1><p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">{orders.filter(o => o.status === "pendiente").length} pendientes · {orders.filter(o => o.status === "en_proceso").length} en proceso</p></div>

      <div className="grid grid-cols-3 gap-3">
        {(["pendiente", "en_proceso", "completado"] as const).map(k => (
          <button key={k} onClick={() => setFilterStatus(filterStatus === k ? "todos" : k)} className={`bg-white border rounded-xl p-3 text-left transition-colors ${filterStatus === k ? "border-[var(--color-primary)]" : "border-[var(--color-border-subtle)]"}`}>
            <p className={`text-xl font-bold ${STATUS_CFG[k].color}`}>{orders.filter(o => o.status === k).length}</p>
            <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{STATUS_CFG[k].label}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="space-y-3">
          {filtered.map(order => {
            const cfg = STATUS_CFG[order.status];
            const pickedCount = order.items.filter(i => i.picked).length;
            return (
              <div key={order.id} onClick={() => setActive(order.id)} className={`bg-white border rounded-xl p-4 cursor-pointer transition-colors ${active === order.id ? "border-[var(--color-primary)] shadow-sm" : "border-[var(--color-border-subtle)] hover:border-gray-300"}`}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-mono text-xs font-bold">{order.orderNum}</span>
                      {order.priority === "urgente" && <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-medium">URGENTE</span>}
                    </div>
                    <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{order.vendor}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xs text-[var(--color-on-surface-variant)]">{pickedCount}/{order.items.length} ítems</p>
                  <div className="flex-1 mx-3 bg-gray-100 rounded-full h-1.5"><div className="h-1.5 rounded-full bg-[var(--color-primary)]" style={{ width: `${order.items.length > 0 ? (pickedCount / order.items.length) * 100 : 0}%` }} /></div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="lg:col-span-2">
          {activeOrder ? (
            <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-[var(--color-border-subtle)] flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2"><ClipboardList size={16} className="text-[var(--color-primary)]" /><span className="font-bold text-sm">{activeOrder.orderNum}</span>{activeOrder.priority === "urgente" && <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-medium">URGENTE</span>}</div>
                  <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{activeOrder.vendor} · Asignado a: {activeOrder.assignedTo}</p>
                </div>
                {activeOrder.status === "pendiente" && <button onClick={() => startOrder(activeOrder.id)} className="text-sm font-semibold bg-[var(--color-primary)] text-white px-3 py-2 rounded-lg hover:opacity-90">Iniciar picking</button>}
                {activeOrder.status === "completado" && <div className="flex items-center gap-1.5 text-green-700 text-sm font-semibold"><CheckCircle size={16} /> Completado</div>}
              </div>
              <div className="p-5 space-y-3">
                {activeOrder.items.map(item => (
                  <div key={item.id} className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${item.picked ? "border-green-200 bg-green-50" : "border-[var(--color-border-subtle)]"}`}>
                    <button onClick={() => toggleItem(activeOrder.id, item.id)} className={`mt-0.5 flex-shrink-0 ${item.picked ? "text-green-600" : "text-gray-300 hover:text-gray-500"}`}>
                      {item.picked ? <CheckCircle size={20} /> : <Circle size={20} />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div><p className={`text-sm font-semibold ${item.picked ? "line-through text-[var(--color-on-surface-variant)]" : ""}`}>{item.product}</p><p className="text-xs font-mono text-[var(--color-on-surface-variant)]">{item.sku}</p></div>
                        <div className="text-right flex-shrink-0"><p className="text-sm font-bold">{item.quantity} {item.unit}</p></div>
                      </div>
                      <div className="flex gap-4 mt-1.5">
                        <span className="text-xs text-[var(--color-on-surface-variant)] flex items-center gap-1"><MapPin size={10} /> {item.location}</span>
                        <span className="text-xs text-[var(--color-on-surface-variant)] flex items-center gap-1"><Package size={10} /> {item.lotNum}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {activeOrder.status === "completado" && (
                <div className="px-5 pb-5">
                  <button className="w-full flex items-center justify-center gap-2 bg-[var(--color-primary)] text-white font-semibold py-3 rounded-xl hover:opacity-90"><Truck size={16} /> Enviar a despacho</button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-12 flex flex-col items-center justify-center gap-3 text-[var(--color-on-surface-variant)]">
              <ClipboardList size={40} strokeWidth={1.5} />
              <p className="text-sm">Selecciona un pedido para ver sus ítems</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
