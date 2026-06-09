"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Filter, Download, ChevronLeft, ChevronRight } from "lucide-react";

const ALL_ORDERS = [
  { id: "ORD-2024-001", fecha: "2026-06-07", producto: "Urea Granulada 46% × 20 sacos", vendedor: "DistAgroMax", pais: "CO", estado: "en_transito", total: 850, metodo_pago: "Stripe" },
  { id: "ORD-2024-002", fecha: "2026-06-05", producto: "Mancozeb 80% WP × 100kg", vendedor: "AgroSuministros CO", pais: "CO", estado: "confirmada", total: 2200, metodo_pago: "PSE" },
  { id: "ORD-2024-003", fecha: "2026-06-01", producto: "NPK 15-15-15 × 40 sacos", vendedor: "DistAgroMax", pais: "CO", estado: "entregada", total: 1520, metodo_pago: "Stripe" },
  { id: "ORD-2024-004", fecha: "2026-05-28", producto: "Glifosato 480 SL × 50L", vendedor: "DistAgroMax", pais: "CO", estado: "entregada", total: 945, metodo_pago: "Nequi" },
  { id: "ORD-2024-005", fecha: "2026-05-20", producto: "Trichoderma Harzianum × 20kg", vendedor: "BioSolutions EC", pais: "EC", estado: "devuelta", total: 700, metodo_pago: "Transferencia" },
  { id: "ORD-2024-006", fecha: "2026-05-15", producto: "Abamectina 1.8 EC × 10L", vendedor: "DistAgroMax", pais: "CO", estado: "entregada", total: 450, metodo_pago: "Stripe" },
  { id: "ORD-2024-007", fecha: "2026-06-08", producto: "Fosfato Diamónico × 30 sacos", vendedor: "CropProtect MX", pais: "MX", estado: "pendiente", total: 1650, metodo_pago: "OXXO" },
  { id: "ORD-2024-008", fecha: "2026-06-06", producto: "Sulfato de Potasio × 10 sacos", vendedor: "NutriPlant BR", pais: "BR", estado: "en_preparacion", total: 680, metodo_pago: "Pix" },
  { id: "ORD-2024-009", fecha: "2026-05-10", producto: "Imidacloprid 350 SC × 5L", vendedor: "AgroSuministros CO", pais: "CO", estado: "cancelada", total: 190, metodo_pago: "PSE" },
  { id: "ORD-2024-010", fecha: "2026-06-09", producto: "Beauveria bassiana × 15kg", vendedor: "BioSolutions EC", pais: "PE", estado: "en_reclamo", total: 480, metodo_pago: "Transferencia" },
];

const STATUS_TABS = [
  { key: "todas", label: "Todas", count: ALL_ORDERS.length },
  { key: "pendiente", label: "Pendiente" },
  { key: "confirmada", label: "Confirmada" },
  { key: "en_preparacion", label: "En preparación" },
  { key: "en_transito", label: "En tránsito" },
  { key: "entregada", label: "Entregada" },
  { key: "en_reclamo", label: "En reclamo" },
  { key: "devuelta", label: "Devuelta" },
  { key: "cancelada", label: "Cancelada" },
];

const STATUS_STYLES: Record<string, string> = {
  pendiente: "bg-yellow-100 text-yellow-700",
  confirmada: "bg-blue-100 text-blue-700",
  en_preparacion: "bg-purple-100 text-purple-700",
  despachada: "bg-indigo-100 text-indigo-700",
  en_transito: "bg-orange-100 text-orange-700",
  entregada: "bg-green-100 text-green-700",
  cancelada: "bg-gray-100 text-gray-600",
  en_reclamo: "bg-red-100 text-red-700",
  devuelta: "bg-pink-100 text-pink-700",
};

const PAGE_SIZE = 5;

export default function OrdenesPage() {
  const [activeTab, setActiveTab] = useState("todas");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let list = ALL_ORDERS;
    if (activeTab !== "todas") list = list.filter(o => o.estado === activeTab);
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(o => o.id.toLowerCase().includes(s) || o.producto.toLowerCase().includes(s) || o.vendedor.toLowerCase().includes(s));
    }
    return list;
  }, [activeTab, search]);

  const pages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function tabCount(key: string) {
    if (key === "todas") return ALL_ORDERS.length;
    return ALL_ORDERS.filter(o => o.estado === key).length;
  }

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
        {STATUS_TABS.map(tab => {
          const cnt = tabCount(tab.key);
          if (cnt === 0 && tab.key !== "todas") return null;
          return (
            <button key={tab.key}
              onClick={() => { setActiveTab(tab.key); setPage(1); }}
              className={`shrink-0 px-3 py-2 text-xs font-medium rounded-t-lg transition-colors relative ${activeTab === tab.key ? "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)] -mb-px bg-white" : "text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]"}`}
            >
              {tab.label}
              <span className={`ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === tab.key ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)]"}`}>
                {cnt}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search + filter bar */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-2.5 text-[var(--color-on-surface-variant)]" />
          <input
            className="w-full pl-8 pr-3 py-2 text-sm border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
            placeholder="Buscar por ID, producto o vendedor..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <button className="flex items-center gap-1.5 text-xs border border-[var(--color-border-subtle)] px-3 py-2 rounded-lg hover:bg-[var(--color-surface-container-low)]">
          <Filter size={13} /> Filtros
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-surface-container-low)]">
              <tr>
                {["Orden", "Fecha", "Producto", "Vendedor", "País", "Estado", "Total", "Pago", ""].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-[var(--color-on-surface-variant)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={9} className="px-4 py-12 text-center text-[var(--color-on-surface-variant)] text-sm">Sin órdenes con estos filtros</td></tr>
              ) : paginated.map((o, i) => (
                <tr key={o.id} className={`border-t border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-container-lowest)] transition-colors ${i % 2 !== 0 ? "bg-[var(--color-surface-container-lowest)]" : ""}`}>
                  <td className="px-4 py-3 font-mono text-xs font-bold text-[var(--color-primary)]">
                    <Link href={`/ordenes/${o.id}`} className="hover:underline">{o.id}</Link>
                  </td>
                  <td className="px-4 py-3 text-xs text-[var(--color-on-surface-variant)]">{o.fecha}</td>
                  <td className="px-4 py-3 text-xs max-w-[220px] truncate">{o.producto}</td>
                  <td className="px-4 py-3 text-xs">{o.vendedor}</td>
                  <td className="px-4 py-3 text-xs font-mono">{o.pais}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[o.estado] ?? "bg-gray-100 text-gray-600"}`}>
                      {o.estado.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs font-bold">${o.total.toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs text-[var(--color-on-surface-variant)]">{o.metodo_pago}</td>
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

        {/* Pagination */}
        {pages > 1 && (
          <div className="px-4 py-3 border-t border-[var(--color-border-subtle)] flex items-center justify-between">
            <p className="text-xs text-[var(--color-on-surface-variant)]">
              {filtered.length} resultados · Página {page} de {pages}
            </p>
            <div className="flex gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="w-7 h-7 rounded border border-[var(--color-border-subtle)] flex items-center justify-center hover:bg-[var(--color-surface-container-low)] disabled:opacity-40">
                <ChevronLeft size={13} />
              </button>
              {Array.from({ length: pages }, (_, i) => i + 1).map(n => (
                <button key={n} onClick={() => setPage(n)} className={`w-7 h-7 rounded text-xs font-medium ${n === page ? "bg-[var(--color-primary)] text-white" : "border border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-container-low)]"}`}>
                  {n}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} className="w-7 h-7 rounded border border-[var(--color-border-subtle)] flex items-center justify-center hover:bg-[var(--color-surface-container-low)] disabled:opacity-40">
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
