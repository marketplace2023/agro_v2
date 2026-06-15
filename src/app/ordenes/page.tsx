"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search, Download, ChevronLeft, ChevronRight, Package } from "lucide-react";

interface OrderItem {
  product: { name: string };
  variant?: { presentation?: string | null; unit?: string | null } | null;
  quantity: number;
}

interface Order {
  id: string;
  status: string;
  createdAt: string;
  totalAmount: number;
  items: OrderItem[];
  vendor: { company: { name: string; commercialName?: string | null } };
}

const STATUS_TABS = [
  { key: "todas",     label: "Todas" },
  { key: "pendiente", label: "Pendiente" },
  { key: "confirmada",label: "Confirmada" },
  { key: "preparando",label: "Preparando" },
  { key: "despachada",label: "Despachada" },
  { key: "entregada", label: "Entregada" },
  { key: "cancelada", label: "Cancelada" },
];

const STATUS_STYLES: Record<string, string> = {
  pendiente:  "bg-yellow-100 text-yellow-700",
  confirmada: "bg-blue-100 text-blue-700",
  preparando: "bg-purple-100 text-purple-700",
  despachada: "bg-orange-100 text-orange-700",
  entregada:  "bg-green-100 text-green-700",
  cancelada:  "bg-gray-100 text-gray-600",
};

const PAGE_LIMIT = 10;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-CO", { year: "numeric", month: "2-digit", day: "2-digit" });
}

function getProductLabel(order: Order) {
  const first = order.items[0];
  if (!first) return "—";
  const pres = first.variant?.presentation ?? first.variant?.unit ?? "";
  return `${first.product.name}${pres ? ` (${pres})` : ""} × ${first.quantity}`;
}

function getVendorName(order: Order) {
  return order.vendor.company.commercialName ?? order.vendor.company.name;
}

export default function OrdenesPage() {
  const [activeTab, setActiveTab] = useState("todas");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      limit: String(PAGE_LIMIT),
      ...(activeTab !== "todas" && { status: activeTab }),
    });
    fetch(`/api/ordenes?${params}`)
      .then(r => r.json())
      .then(d => {
        setOrders(d.data ?? []);
        setTotal(d.total ?? 0);
      })
      .finally(() => setLoading(false));
  }, [activeTab, page]);

  useEffect(() => { load(); }, [load]);

  const filtered = search
    ? orders.filter(o => {
        const s = search.toLowerCase();
        return o.id.toLowerCase().includes(s) ||
          getProductLabel(o).toLowerCase().includes(s) ||
          getVendorName(o).toLowerCase().includes(s);
      })
    : orders;

  const pages = Math.ceil(total / PAGE_LIMIT);

  return (
    <div className="container-max py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-headline-md font-bold">Mis órdenes</h1>
        <button className="flex items-center gap-1.5 text-xs border border-[var(--color-border-subtle)] px-3 py-1.5 rounded-lg hover:bg-[var(--color-surface-container-low)]">
          <Download size={13} /> Exportar CSV
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-2 mb-4 border-b border-[var(--color-border-subtle)]">
        {STATUS_TABS.map(tab => (
          <button key={tab.key}
            onClick={() => { setActiveTab(tab.key); setPage(1); }}
            className={`shrink-0 px-3 py-2 text-xs font-medium rounded-t-lg transition-colors ${activeTab === tab.key ? "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)] -mb-px bg-white" : "text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]"}`}
          >
            {tab.label}
            {tab.key === "todas" && total > 0 && (
              <span className={`ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === tab.key ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)]"}`}>
                {total}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search bar */}
      <form
        className="flex gap-3 mb-4"
        onSubmit={e => { e.preventDefault(); setSearch(searchInput); setPage(1); }}
      >
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-2.5 text-[var(--color-on-surface-variant)]" />
          <input
            className="w-full pl-8 pr-3 py-2 text-sm border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
            placeholder="Buscar por ID, producto o vendedor..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
          />
        </div>
        <button type="submit" className="text-xs border border-[var(--color-border-subtle)] px-4 py-2 rounded-lg hover:bg-[var(--color-surface-container-low)]">
          Buscar
        </button>
        {search && (
          <button
            type="button"
            onClick={() => { setSearch(""); setSearchInput(""); }}
            className="text-xs text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] underline"
          >
            Limpiar
          </button>
        )}
      </form>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-[var(--color-on-surface-variant)]">
            <Package size={32} className="mx-auto mb-2 opacity-30 animate-pulse" />
            <p className="text-sm">Cargando órdenes...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[var(--color-surface-container-low)]">
                <tr>
                  {["Orden", "Fecha", "Producto", "Vendedor", "Estado", "Total", ""].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-medium text-[var(--color-on-surface-variant)]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-[var(--color-on-surface-variant)] text-sm">
                      Sin órdenes
                    </td>
                  </tr>
                ) : filtered.map((o, i) => (
                  <tr key={o.id} className={`border-t border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-container-lowest)] transition-colors ${i % 2 !== 0 ? "bg-[var(--color-surface-container-lowest)]" : ""}`}>
                    <td className="px-4 py-3 font-mono text-xs font-bold text-[var(--color-primary)]">
                      <Link href={`/ordenes/${o.id}`} className="hover:underline">{o.id.slice(0, 8)}…</Link>
                    </td>
                    <td className="px-4 py-3 text-xs text-[var(--color-on-surface-variant)]">{formatDate(o.createdAt)}</td>
                    <td className="px-4 py-3 text-xs max-w-[200px] truncate">{getProductLabel(o)}</td>
                    <td className="px-4 py-3 text-xs">{getVendorName(o)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[o.status] ?? "bg-gray-100 text-gray-600"}`}>
                        {o.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs font-bold">${o.totalAmount.toLocaleString("es-CO")}</td>
                    <td className="px-4 py-3">
                      <Link href={`/ordenes/${o.id}`} className="text-[10px] text-[var(--color-primary)] border border-[var(--color-primary)] px-2 py-0.5 rounded hover:bg-[var(--color-primary)] hover:text-white transition-colors">
                        Ver →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && pages > 1 && (
          <div className="px-4 py-3 border-t border-[var(--color-border-subtle)] flex items-center justify-between">
            <p className="text-xs text-[var(--color-on-surface-variant)]">
              {total} resultados · Página {page} de {pages}
            </p>
            <div className="flex gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="w-7 h-7 rounded border border-[var(--color-border-subtle)] flex items-center justify-center hover:bg-[var(--color-surface-container-low)] disabled:opacity-40">
                <ChevronLeft size={13} />
              </button>
              {Array.from({ length: Math.min(pages, 7) }, (_, i) => i + 1).map(n => (
                <button key={n} onClick={() => setPage(n)}
                  className={`w-7 h-7 rounded text-xs font-medium ${n === page ? "bg-[var(--color-primary)] text-white" : "border border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-container-low)]"}`}>
                  {n}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
                className="w-7 h-7 rounded border border-[var(--color-border-subtle)] flex items-center justify-center hover:bg-[var(--color-surface-container-low)] disabled:opacity-40">
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
