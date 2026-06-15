"use client";

import { useEffect, useState } from "react";
import { Search, CheckCircle, Truck, Clock, XCircle, ChevronDown, Eye, Package } from "lucide-react";

type OrderStatus = "pendiente" | "confirmada" | "preparando" | "despachada" | "entregada" | "cancelada";

interface Order {
  id: string;
  status: OrderStatus;
  totalAmount: number;
  currency: string;
  country: string;
  createdAt: string;
  buyer: {
    email: string;
    profile?: { firstName: string; lastName: string } | null;
    company?: { name: string; commercialName?: string | null; city?: string | null } | null;
  };
  items: {
    quantity: number;
    unitPrice: number;
    subtotal: number;
    product: { name: string; slug: string };
    variant: { presentation: string; unit: string };
  }[];
  tracking?: { status: string; estimatedDate?: string | null; carrier?: string | null } | null;
}

const STATUS_CFG: Record<OrderStatus, { label: string; color: string; icon: React.ReactNode }> = {
  pendiente:  { label: "Pendiente",  color: "bg-yellow-100 text-yellow-700",  icon: <Clock size={11} /> },
  confirmada: { label: "Confirmada", color: "bg-blue-100 text-blue-700",    icon: <CheckCircle size={11} /> },
  preparando: { label: "Preparando", color: "bg-purple-100 text-purple-700", icon: <Package size={11} /> },
  despachada: { label: "Despachada", color: "bg-indigo-100 text-indigo-700", icon: <Truck size={11} /> },
  entregada:  { label: "Entregada",  color: "bg-green-100 text-green-700",   icon: <CheckCircle size={11} /> },
  cancelada:  { label: "Cancelada",  color: "bg-red-100 text-red-700",       icon: <XCircle size={11} /> },
};

export default function DistribuidorOrdenesPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("todas");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/ordenes")
      .then((r) => r.json())
      .then((res) => setOrders(res.data ?? []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = orders.filter((o) => {
    const buyerName = o.buyer.profile
      ? `${o.buyer.profile.firstName} ${o.buyer.profile.lastName}`
      : o.buyer.email;
    const company = o.buyer.company?.commercialName ?? o.buyer.company?.name ?? "";
    const matchQ =
      !search ||
      buyerName.toLowerCase().includes(search.toLowerCase()) ||
      company.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase());
    const matchS = filterStatus === "todas" || o.status === filterStatus;
    return matchQ && matchS;
  });

  const counts = {
    todas: orders.length,
    pendiente: orders.filter((o) => o.status === "pendiente").length,
    confirmada: orders.filter((o) => o.status === "confirmada").length,
    preparando: orders.filter((o) => o.status === "preparando").length,
    despachada: orders.filter((o) => o.status === "despachada").length,
  };

  return (
    <div className="space-y-5 max-w-5xl">
      <div>
        <h1 className="text-headline-md font-bold">Mis Ventas</h1>
        <p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">Órdenes recibidas en tu territorio</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {Object.entries(counts).map(([k, v]) => (
          <button
            key={k}
            onClick={() => setFilterStatus(k)}
            className={`bg-white border rounded-xl p-3 text-left transition-colors ${filterStatus === k ? "border-[var(--color-primary)]" : "border-[var(--color-border-subtle)]"}`}
          >
            <p className="text-xl font-bold text-[var(--color-primary)]">{v}</p>
            <p className="text-xs text-[var(--color-on-surface-variant)] capitalize mt-0.5">{k}</p>
          </button>
        ))}
      </div>

      <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4">
        <div className="flex items-center gap-2 border border-[var(--color-border-subtle)] rounded-lg px-3 py-2">
          <Search size={14} className="text-[var(--color-on-surface-variant)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por cliente, empresa o ID..."
            className="text-sm flex-1 outline-none bg-transparent"
          />
        </div>
      </div>

      {loading && (
        <div className="text-center py-16 text-[var(--color-on-surface-variant)]">
          <Package size={32} className="mx-auto mb-2 opacity-30 animate-pulse" />
          <p className="text-sm">Cargando órdenes...</p>
        </div>
      )}

      {!loading && (
        <div className="space-y-3">
          {filtered.map((order) => {
            const cfg = STATUS_CFG[order.status];
            const buyerName = order.buyer.profile
              ? `${order.buyer.profile.firstName} ${order.buyer.profile.lastName}`
              : order.buyer.email;
            const company = order.buyer.company?.commercialName ?? order.buyer.company?.name ?? "—";
            const city = order.buyer.company?.city ?? order.country;
            const isExpanded = expanded === order.id;

            return (
              <div key={order.id} className="bg-white border border-[var(--color-border-subtle)] rounded-xl overflow-hidden">
                <div
                  className="px-5 py-4 flex items-center gap-4 cursor-pointer"
                  onClick={() => setExpanded(isExpanded ? null : order.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm font-mono">{order.id.slice(-8).toUpperCase()}</span>
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${cfg.color}`}>
                        {cfg.icon} {cfg.label}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">{company} · {buyerName}</p>
                    <p className="text-xs text-[var(--color-on-surface-variant)]">
                      {city} · {new Date(order.createdAt).toLocaleDateString("es-CO")}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-base">
                      {order.currency} {order.totalAmount.toLocaleString("es-CO", { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-[var(--color-on-surface-variant)]">{order.items.length} línea{order.items.length !== 1 ? "s" : ""}</p>
                  </div>
                  <ChevronDown size={16} className={`text-[var(--color-on-surface-variant)] transition-transform flex-shrink-0 ${isExpanded ? "rotate-180" : ""}`} />
                </div>

                {isExpanded && (
                  <div className="border-t border-[var(--color-border-subtle)] px-5 py-4 space-y-4">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-xs text-[var(--color-on-surface-variant)]">
                            <th className="text-left pb-2">Producto</th>
                            <th className="text-right pb-2">Qty</th>
                            <th className="text-right pb-2">Precio</th>
                            <th className="text-right pb-2">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.items.map((item, i) => (
                            <tr key={i} className="border-t border-[var(--color-border-subtle)]">
                              <td className="py-2 font-medium">
                                {item.product.name}
                                <span className="text-xs text-[var(--color-on-surface-variant)] ml-1">({item.variant.presentation} {item.variant.unit})</span>
                              </td>
                              <td className="py-2 text-right">{item.quantity}</td>
                              <td className="py-2 text-right">${item.unitPrice.toFixed(2)}</td>
                              <td className="py-2 text-right font-semibold">${item.subtotal.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {order.tracking && (
                      <div className="flex items-center gap-2 text-xs text-[var(--color-on-surface-variant)] bg-[var(--color-surface-container-low)] px-3 py-2 rounded-lg">
                        <Truck size={13} />
                        <span>{order.tracking.carrier ?? "Carrier"} · {order.tracking.status}</span>
                        {order.tracking.estimatedDate && (
                          <span>· ETA: {new Date(order.tracking.estimatedDate).toLocaleDateString("es-CO")}</span>
                        )}
                      </div>
                    )}
                    <div className="flex justify-end">
                      <button className="flex items-center gap-1 text-sm text-[var(--color-primary)] hover:underline">
                        <Eye size={13} /> Ver detalle completo
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-16 bg-white border border-[var(--color-border-subtle)] rounded-xl text-[var(--color-on-surface-variant)]">
              <Package size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No se encontraron órdenes</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
