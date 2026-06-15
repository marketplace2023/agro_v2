"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Plus, Search, Filter, Edit2, Eye, EyeOff,
  Package, AlertTriangle, CheckCircle, Clock,
  ChevronLeft, ChevronRight,
} from "lucide-react";

interface ProductVariant {
  id: string;
  sku: string;
  presentation: string;
  unit: string;
  basePrice: number;
  stock: number;
}

interface VendorListing {
  vendorId: string;
  price?: number | null;
  stock?: number | null;
  isActive?: boolean | null;
}

interface ApiProduct {
  id: string;
  name: string;
  slug: string;
  status: string;
  createdAt: string;
  isRegulated: boolean;
  isBiological: boolean;
  isOrganic: boolean;
  brand?: { name: string } | null;
  category?: { name: string; slug: string } | null;
  variants: ProductVariant[];
  vendorListings: VendorListing[];
}

function getPrice(p: ApiProduct) {
  return p.vendorListings[0]?.price ?? p.variants[0]?.basePrice ?? 0;
}

function getStock(p: ApiProduct) {
  const listingStock = p.vendorListings[0]?.stock;
  if (listingStock !== null && listingStock !== undefined) return listingStock;
  return p.variants.reduce((s, v) => s + v.stock, 0);
}

function getUnit(p: ApiProduct) {
  return p.variants[0]?.unit ?? "unid.";
}

function getSku(p: ApiProduct) {
  return p.variants[0]?.sku ?? "—";
}

function isListingActive(p: ApiProduct) {
  return p.vendorListings[0]?.isActive !== false;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  aprobado: { label: "Aprobado",    color: "bg-green-100 text-green-700",   icon: <CheckCircle size={11} /> },
  pendiente: { label: "En revisión", color: "bg-yellow-100 text-yellow-700", icon: <Clock size={11} /> },
  rechazado: { label: "Rechazado",   color: "bg-red-100 text-red-700",       icon: <AlertTriangle size={11} /> },
  bloqueado: { label: "Bloqueado",   color: "bg-gray-100 text-gray-600",     icon: <EyeOff size={11} /> },
};

const PAGE_LIMIT = 20;

export default function VendedorProductosPage() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [filterCat, setFilterCat] = useState("todas");

  const load = useCallback(() => {
    setLoading(true);
    const serverStatus = !["todos", "activo", "inactivo"].includes(filterStatus) ? filterStatus : undefined;
    const params = new URLSearchParams({
      page: String(page),
      limit: String(PAGE_LIMIT),
      ...(search && { q: search }),
      ...(serverStatus && { status: serverStatus }),
    });
    fetch(`/api/vendor/productos?${params}`)
      .then(r => r.json())
      .then(d => {
        setProducts(d.data ?? []);
        setTotal(d.total ?? 0);
      })
      .finally(() => setLoading(false));
  }, [page, search, filterStatus]);

  useEffect(() => { load(); }, [load]);

  const allCategories = [...new Set(products.map(p => p.category?.name).filter(Boolean))] as string[];

  const filtered = products.filter(p => {
    const matchCat = filterCat === "todas" || p.category?.name === filterCat;
    const active = isListingActive(p);
    const matchActive = filterStatus === "activo" ? active : filterStatus === "inactivo" ? !active : true;
    return matchCat && matchActive;
  });

  const pages = Math.ceil(total / PAGE_LIMIT);
  const aprobados = products.filter(p => p.status === "aprobado").length;
  const enRevision = products.filter(p => p.status === "pendiente").length;
  const stockBajo = products.filter(p => { const s = getStock(p); return s > 0 && s < 20; }).length;
  const sinStock = products.filter(p => getStock(p) === 0).length;

  return (
    <div className="space-y-5 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-md font-bold">Mis Productos</h1>
          {!loading && (
            <p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">
              {aprobados} aprobados · {enRevision} en revisión
            </p>
          )}
        </div>
        <Link href="/dashboard/vendedor/productos/nuevo"
          className="flex items-center gap-2 bg-[var(--color-primary)] text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:opacity-90">
          <Plus size={15} /> Agregar producto
        </Link>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total productos",   value: total,     color: "text-[var(--color-primary)]" },
          { label: "Aprobados",         value: aprobados, color: "text-green-600" },
          { label: "Stock bajo (< 20)", value: stockBajo, color: "text-orange-600" },
          { label: "Sin stock",         value: sinStock,  color: "text-red-600" },
        ].map(k => (
          <div key={k.label} className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4">
            <p className={`text-2xl font-bold ${k.color}`}>{loading ? "—" : k.value}</p>
            <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4 flex flex-wrap gap-3 items-center">
        <form
          className="flex items-center gap-2 flex-1 min-w-[200px] border border-[var(--color-border-subtle)] rounded-lg px-3 py-2"
          onSubmit={e => { e.preventDefault(); setSearch(searchInput); setPage(1); }}
        >
          <Search size={14} className="text-[var(--color-on-surface-variant)] shrink-0" />
          <input
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder="Buscar por nombre o SKU..."
            className="text-sm flex-1 outline-none bg-transparent"
          />
          <button type="submit" className="text-xs font-medium text-[var(--color-primary)] hover:underline shrink-0">
            Buscar
          </button>
        </form>
        <div className="flex items-center gap-2">
          <Filter size={13} className="text-[var(--color-on-surface-variant)]" />
          <select
            value={filterStatus}
            onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
            className="text-sm border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 outline-none"
          >
            <option value="todos">Todos los estados</option>
            <option value="activo">Activos</option>
            <option value="inactivo">Inactivos</option>
            <option value="aprobado">Aprobados</option>
            <option value="pendiente">En revisión</option>
            <option value="rechazado">Rechazados</option>
            <option value="bloqueado">Bloqueados</option>
          </select>
        </div>
        <select
          value={filterCat}
          onChange={e => setFilterCat(e.target.value)}
          className="text-sm border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 outline-none"
        >
          <option value="todas">Todas las categorías</option>
          {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {(search || filterCat !== "todas" || filterStatus !== "todos") && (
          <button
            onClick={() => { setSearch(""); setSearchInput(""); setFilterStatus("todos"); setFilterCat("todas"); setPage(1); }}
            className="text-xs text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] underline"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-[var(--color-on-surface-variant)]">
            <Package size={32} className="mx-auto mb-2 opacity-30 animate-pulse" />
            <p className="text-sm">Cargando productos...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-container-low)]">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-on-surface-variant)]">Producto</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-on-surface-variant)]">Categoría</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-[var(--color-on-surface-variant)]">Precio</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-[var(--color-on-surface-variant)]">Stock</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-[var(--color-on-surface-variant)]">Estado</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-[var(--color-on-surface-variant)]">Tipo</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-[var(--color-on-surface-variant)]">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => {
                  const statusCfg = STATUS_CONFIG[p.status] ?? STATUS_CONFIG.pendiente;
                  const stock = getStock(p);
                  const price = getPrice(p);
                  const unit = getUnit(p);
                  const sku = getSku(p);
                  const active = isListingActive(p);
                  return (
                    <tr
                      key={p.id}
                      className={`border-b border-[var(--color-border-subtle)] last:border-0 ${i % 2 === 1 ? "bg-[#fafafa]" : ""} ${!active ? "opacity-60" : ""}`}
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium text-sm">{p.name}</p>
                        <p className="text-xs text-[var(--color-on-surface-variant)]">{sku} · {p.brand?.name ?? "—"}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--color-on-surface-variant)]">{p.category?.name ?? "—"}</td>
                      <td className="px-4 py-3 text-right font-semibold">
                        {price > 0 ? `$${price.toLocaleString("es-CO")}` : "—"}
                        <span className="text-xs font-normal text-[var(--color-on-surface-variant)]">/{unit}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`font-semibold ${stock === 0 ? "text-red-600" : stock < 20 ? "text-orange-600" : "text-green-700"}`}>
                          {stock}
                        </span>
                        <span className="text-xs text-[var(--color-on-surface-variant)]"> {unit}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${statusCfg.color}`}>
                          {statusCfg.icon} {statusCfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex flex-wrap gap-1 justify-center">
                          {p.isRegulated   && <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-600">Regulado</span>}
                          {p.isBiological  && <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-50 text-green-600">Biológico</span>}
                          {p.isOrganic     && <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600">Orgánico</span>}
                          {!p.isRegulated && !p.isBiological && !p.isOrganic && (
                            <span className="text-[10px] text-[var(--color-on-surface-variant)]">Convencional</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <span
                            className={`p-1.5 rounded-lg ${active ? "text-green-600" : "text-gray-400"}`}
                            title={active ? "Activo" : "Inactivo"}
                          >
                            {active ? <Eye size={14} /> : <EyeOff size={14} />}
                          </span>
                          <Link
                            href={`/dashboard/vendedor/productos/${p.id}/editar`}
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-[var(--color-primary)] transition-colors"
                          >
                            <Edit2 size={14} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-[var(--color-on-surface-variant)]">
                <Package size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">No se encontraron productos</p>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {!loading && pages > 1 && (
          <div className="px-4 py-3 border-t border-[var(--color-border-subtle)] flex items-center justify-between">
            <p className="text-xs text-[var(--color-on-surface-variant)]">
              {total} productos · Página {page} de {pages}
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-7 h-7 rounded border border-[var(--color-border-subtle)] flex items-center justify-center hover:bg-[var(--color-surface-container-low)] disabled:opacity-40"
              >
                <ChevronLeft size={13} />
              </button>
              {Array.from({ length: Math.min(pages, 5) }, (_, i) => i + 1).map(n => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`w-7 h-7 rounded text-xs font-medium ${n === page ? "bg-[var(--color-primary)] text-white" : "border border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-container-low)]"}`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(pages, p + 1))}
                disabled={page === pages}
                className="w-7 h-7 rounded border border-[var(--color-border-subtle)] flex items-center justify-center hover:bg-[var(--color-surface-container-low)] disabled:opacity-40"
              >
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
