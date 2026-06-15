"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Package, Truck, CheckCircle, Clock, AlertTriangle, Search, ChevronRight } from "lucide-react";

interface OrderItem {
  product: { name: string };
  quantity: number;
}

interface TrackingEntry {
  estimatedDate?: string | null;
  carrier?: string | null;
}

interface Order {
  id: string;
  status: string;
  createdAt: string;
  totalAmount: number;
  items: OrderItem[];
  vendor: { company: { name: string; commercialName?: string | null } };
  tracking: TrackingEntry[];
}

const STATUS_CFG: Record<string, { label: string; icon: React.ReactNode; cls: string }> = {
  pendiente:  { label: "Pendiente",  icon: <Clock size={12} />,         cls: "bg-yellow-100 text-yellow-700" },
  confirmada: { label: "Confirmada", icon: <CheckCircle size={12} />,   cls: "bg-blue-100 text-blue-700" },
  preparando: { label: "Preparando", icon: <Package size={12} />,       cls: "bg-purple-100 text-purple-700" },
  despachada: { label: "En camino",  icon: <Truck size={12} />,         cls: "bg-orange-100 text-orange-700" },
  entregada:  { label: "Entregado",  icon: <CheckCircle size={12} />,   cls: "bg-green-100 text-green-700" },
  cancelada:  { label: "Cancelado",  icon: <AlertTriangle size={12} />, cls: "bg-gray-100 text-gray-600" },
};

const FILTER_BUTTONS = [
  { key: "todas",     label: "Todas" },
  { key: "despachada",label: "En camino" },
  { key: "entregada", label: "Entregado" },
  { key: "cancelada", label: "Cancelado" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-CO", { year: "numeric", month: "2-digit", day: "2-digit" });
}

export default function CompradorOrdenesPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("todas");

  useEffect(() => {
    fetch("/api/ordenes?limit=50")
      .then(r => r.json())
      .then(d => setOrders(d.data ?? []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = orders.filter(o => {
    const vendorName = o.vendor.company.commercialName ?? o.vendor.company.name;
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) ||
      vendorName.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "todas" || o.status === filter;
    return matchSearch && matchFilter;
  });

  const enCamino = orders.filter(o => o.status === "despachada").length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-headline-md font-bold">Mis órdenes</h1>
        {loading ? (
          <p className="text-sm text-[var(--color-on-surface-variant)]">Cargando...</p>
        ) : (
          <p className="text-sm text-[var(--color-on-surface-variant)]">
            {orders.length} órdenes · {enCamino} en camino
          </p>
        )}
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar orden o vendedor..."
            className="w-full pl-9 pr-3 py-2 border border-[var(--color-border-subtle)] rounded-lg text-sm outline-none focus:border-[var(--color-primary)]"
          />
        </div>
        {FILTER_BUTTONS.map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${filter === f.key ? "bg-[var(--color-primary)] text-white" : "bg-white border border-[var(--color-border-subtle)] text-[var(--color-on-surface-variant)]"}`}>
            {f.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="text-center py-16 text-[var(--color-on-surface-variant)]">
          <Package size={32} className="mx-auto mb-2 opacity-30 animate-pulse" />
          <p className="text-sm">Cargando órdenes...</p>
        </div>
      )}

      {!loading && (
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 bg-white border border-[var(--color-border-subtle)] rounded-xl text-[var(--color-on-surface-variant)]">
              <Package size={32} className="mx-auto mb-2 opacity-20" />
              <p className="text-sm font-medium">Sin órdenes</p>
            </div>
          ) : filtered.map(o => {
            const scfg = STATUS_CFG[o.status] ?? STATUS_CFG.pendiente;
            const vendorName = o.vendor.company.commercialName ?? o.vendor.company.name;
            const tracking = o.tracking[0];
            const estimatedDate = tracking?.estimatedDate
              ? formatDate(tracking.estimatedDate)
              : null;

            return (
              <div key={o.id} className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 bg-[var(--color-primary)]/8 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Package size={18} className="text-[var(--color-primary)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-sm text-[var(--color-primary)]">{o.id.slice(0, 10)}…</p>
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${scfg.cls}`}>
                          {scfg.icon} {scfg.label}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">
                        {vendorName} · {o.items.length} ítem(s) · Pedido: {formatDate(o.createdAt)}
                      </p>
                      {o.status === "despachada" && estimatedDate && (
                        <p className="text-xs text-orange-600 mt-0.5 font-medium">Entrega estimada: {estimatedDate}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <p className="font-bold text-sm">${o.totalAmount.toLocaleString("es-CO")}</p>
                    <div className="flex gap-2">
                      {o.status === "despachada" && (
                        <Link href="/tracking" className="text-xs flex items-center gap-1 border border-[var(--color-primary)] text-[var(--color-primary)] px-3 py-1.5 rounded-lg font-medium hover:bg-[var(--color-primary)]/5">
                          <Truck size={12} /> Rastrear
                        </Link>
                      )}
                      {o.status === "entregada" && (
                        <Link href="/reclamos" className="text-xs border border-[var(--color-border-subtle)] text-[var(--color-on-surface-variant)] px-3 py-1.5 rounded-lg hover:bg-gray-50">
                          Reclamar
                        </Link>
                      )}
                      <Link href={`/ordenes/${o.id}`} className="p-1.5 hover:bg-gray-100 rounded-lg text-[var(--color-on-surface-variant)]">
                        <ChevronRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
