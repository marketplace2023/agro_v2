"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Filter, Edit2, Trash2, Eye, EyeOff, Package, AlertTriangle, CheckCircle, Clock } from "lucide-react";

type ProductStatus = "aprobado" | "pendiente" | "rechazado" | "bloqueado";

interface VendorProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  brand: string;
  price: number;
  stock: number;
  unit: string;
  status: ProductStatus;
  regulatoryStatus: "vigente" | "por_vencer" | "vencido" | "sin_registro";
  active: boolean;
  sales30d: number;
  createdAt: string;
}

const MOCK_PRODUCTS: VendorProduct[] = [
  { id: "p1", name: "Glifosato 480 SL Herbicida", sku: "HRB-GLF-480-5L", category: "Herbicidas", brand: "AgroQuim", price: 45.0, stock: 240, unit: "Lt", status: "aprobado", regulatoryStatus: "vigente", active: true, sales30d: 85, createdAt: "2026-01-15" },
  { id: "p2", name: "Urea Granulada 46% Nitrógeno", sku: "FRT-URE-46-50K", category: "Fertilizantes", brand: "Fertiagro", price: 42.5, stock: 500, unit: "50kg", status: "aprobado", regulatoryStatus: "vigente", active: true, sales30d: 120, createdAt: "2026-01-10" },
  { id: "p3", name: "Trichoderma Harzianum Biocontrol", sku: "BIO-TRI-HRZ-1K", category: "Biológicos", brand: "BioSolutions", price: 35.0, stock: 18, unit: "kg", status: "aprobado", regulatoryStatus: "por_vencer", active: true, sales30d: 22, createdAt: "2026-02-01" },
  { id: "p4", name: "Mancozeb 80% WP Fungicida", sku: "FNG-MNZ-80-1K", category: "Fungicidas", brand: "CropProtect", price: 22.0, stock: 0, unit: "kg", status: "aprobado", regulatoryStatus: "vigente", active: false, sales30d: 0, createdAt: "2026-01-20" },
  { id: "p5", name: "NPK 15-15-15 Fertilizante Completo", sku: "FRT-NPK-151515-50K", category: "Fertilizantes", brand: "Fertiagro", price: 38.0, stock: 80, unit: "50kg", status: "pendiente", regulatoryStatus: "sin_registro", active: false, sales30d: 0, createdAt: "2026-06-01" },
  { id: "p6", name: "Clorpirifos 480 EC Insecticida", sku: "INS-CLR-480-1L", category: "Insecticidas", brand: "PestControl", price: 28.0, stock: 45, unit: "Lt", status: "rechazado", regulatoryStatus: "vencido", active: false, sales30d: 0, createdAt: "2025-12-10" },
];

const STATUS_CONFIG: Record<ProductStatus, { label: string; color: string; icon: React.ReactNode }> = {
  aprobado: { label: "Aprobado", color: "bg-green-100 text-green-700", icon: <CheckCircle size={11} /> },
  pendiente: { label: "En revisión", color: "bg-yellow-100 text-yellow-700", icon: <Clock size={11} /> },
  rechazado: { label: "Rechazado", color: "bg-red-100 text-red-700", icon: <AlertTriangle size={11} /> },
  bloqueado: { label: "Bloqueado", color: "bg-gray-100 text-gray-600", icon: <EyeOff size={11} /> },
};

const REG_CONFIG: Record<string, { label: string; color: string }> = {
  vigente: { label: "Reg. vigente", color: "text-green-700" },
  por_vencer: { label: "Por vencer", color: "text-orange-600" },
  vencido: { label: "Reg. vencido", color: "text-red-600" },
  sin_registro: { label: "Sin registro", color: "text-gray-500" },
};

export default function VendedorProductosPage() {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("todos");
  const [filterCat, setFilterCat] = useState("todas");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filtered = products.filter(p => {
    const matchQ = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchS = filterStatus === "todos" || p.status === filterStatus || (filterStatus === "activo" && p.active) || (filterStatus === "inactivo" && !p.active);
    const matchC = filterCat === "todas" || p.category === filterCat;
    return matchQ && matchS && matchC;
  });

  function toggleActive(id: string) {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p));
  }

  function deleteProduct(id: string) {
    setProducts(prev => prev.filter(p => p.id !== id));
    setConfirmDelete(null);
  }

  const categories = [...new Set(MOCK_PRODUCTS.map(p => p.category))];

  return (
    <div className="space-y-5 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-md font-bold">Mis Productos</h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">
            {products.filter(p => p.active).length} activos · {products.filter(p => p.status === "pendiente").length} en revisión
          </p>
        </div>
        <Link href="/dashboard/vendedor/productos/nuevo"
          className="flex items-center gap-2 bg-[var(--color-primary)] text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:opacity-90">
          <Plus size={15} /> Agregar producto
        </Link>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total productos", value: products.length, color: "text-[var(--color-primary)]" },
          { label: "Activos", value: products.filter(p => p.active).length, color: "text-green-600" },
          { label: "Stock bajo (< 20)", value: products.filter(p => p.stock > 0 && p.stock < 20).length, color: "text-orange-600" },
          { label: "Sin stock", value: products.filter(p => p.stock === 0).length, color: "text-red-600" },
        ].map(k => (
          <div key={k.label} className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4">
            <p className={`text-2xl font-bold ${k.color}`}>{k.value}</p>
            <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] border border-[var(--color-border-subtle)] rounded-lg px-3 py-2">
          <Search size={14} className="text-[var(--color-on-surface-variant)]" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nombre o SKU..." className="text-sm flex-1 outline-none bg-transparent" />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={13} className="text-[var(--color-on-surface-variant)]" />
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="text-sm border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 outline-none">
            <option value="todos">Todos los estados</option>
            <option value="activo">Activos</option>
            <option value="inactivo">Inactivos</option>
            <option value="aprobado">Aprobados</option>
            <option value="pendiente">En revisión</option>
            <option value="rechazado">Rechazados</option>
          </select>
        </div>
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
          className="text-sm border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 outline-none">
          <option value="todas">Todas las categorías</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-container-low)]">
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-on-surface-variant)]">Producto</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-on-surface-variant)]">Categoría</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-[var(--color-on-surface-variant)]">Precio</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-[var(--color-on-surface-variant)]">Stock</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-[var(--color-on-surface-variant)]">Estado</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-[var(--color-on-surface-variant)]">Regulatorio</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-[var(--color-on-surface-variant)]">Ventas 30d</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-[var(--color-on-surface-variant)]">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => {
                const statusCfg = STATUS_CONFIG[p.status];
                const regCfg = REG_CONFIG[p.regulatoryStatus];
                return (
                  <tr key={p.id} className={`border-b border-[var(--color-border-subtle)] last:border-0 ${i % 2 === 1 ? "bg-[#fafafa]" : ""} ${!p.active ? "opacity-60" : ""}`}>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-sm">{p.name}</p>
                        <p className="text-xs text-[var(--color-on-surface-variant)]">{p.sku} · {p.brand}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-[var(--color-on-surface-variant)]">{p.category}</td>
                    <td className="px-4 py-3 text-right font-semibold">${p.price.toFixed(2)}<span className="text-xs font-normal text-[var(--color-on-surface-variant)]">/{p.unit}</span></td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-semibold ${p.stock === 0 ? "text-red-600" : p.stock < 20 ? "text-orange-600" : "text-green-700"}`}>
                        {p.stock}
                      </span>
                      <span className="text-xs text-[var(--color-on-surface-variant)]"> {p.unit}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${statusCfg.color}`}>
                        {statusCfg.icon} {statusCfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs font-medium ${regCfg.color}`}>{regCfg.label}</span>
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-semibold">{p.sales30d}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => toggleActive(p.id)}
                          className={`p-1.5 rounded-lg hover:bg-gray-100 transition-colors ${p.active ? "text-green-600" : "text-gray-400"}`}
                          title={p.active ? "Desactivar" : "Activar"}>
                          {p.active ? <Eye size={14} /> : <EyeOff size={14} />}
                        </button>
                        <Link href={`/dashboard/vendedor/productos/${p.id}/editar`}
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-[var(--color-primary)] transition-colors">
                          <Edit2 size={14} />
                        </Link>
                        <button onClick={() => setConfirmDelete(p.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors">
                          <Trash2 size={14} />
                        </button>
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
      </div>

      {/* Delete confirm modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="font-bold text-base mb-2">¿Eliminar producto?</h3>
            <p className="text-sm text-[var(--color-on-surface-variant)] mb-5">Esta acción no se puede deshacer. El producto se eliminará de tu catálogo.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)}
                className="flex-1 border border-[var(--color-border-subtle)] text-sm font-medium py-2 rounded-lg hover:bg-gray-50">Cancelar</button>
              <button onClick={() => deleteProduct(confirmDelete)}
                className="flex-1 bg-red-600 text-white text-sm font-medium py-2 rounded-lg hover:bg-red-700">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
