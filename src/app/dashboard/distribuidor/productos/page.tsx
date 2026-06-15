"use client";

import { useEffect, useState } from "react";
import { Search, Filter, Eye, EyeOff, Package, CheckCircle, Clock, AlertTriangle } from "lucide-react";

type ProductStatus = "aprobado" | "pendiente" | "rechazado" | "bloqueado";

interface Product {
  id: string;
  name: string;
  slug: string;
  status: ProductStatus;
  brand?: { name: string } | null;
  category?: { name: string; slug: string } | null;
  variants: { id: string; sku: string; presentation: string; unit: string; basePrice: number; stock: number; isActive: boolean }[];
  vendorListings: { price: number; stock: number; isActive: boolean }[];
}

const STATUS_CFG: Record<ProductStatus, { label: string; color: string; icon: React.ReactNode }> = {
  aprobado:  { label: "Aprobado",    color: "bg-green-100 text-green-700",   icon: <CheckCircle size={11} /> },
  pendiente: { label: "En revisión", color: "bg-yellow-100 text-yellow-700", icon: <Clock size={11} /> },
  rechazado: { label: "Rechazado",   color: "bg-red-100 text-red-700",       icon: <AlertTriangle size={11} /> },
  bloqueado: { label: "Bloqueado",   color: "bg-gray-100 text-gray-600",     icon: <EyeOff size={11} /> },
};

export default function DistribuidorProductosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");

  useEffect(() => {
    fetch("/api/vendor/productos")
      .then((r) => r.json())
      .then((res) => setProducts(res.data ?? []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter((p) => {
    const matchQ =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.variants.some((v) => v.sku.toLowerCase().includes(search.toLowerCase()));
    const matchS = filterStatus === "todos" || p.status === filterStatus;
    return matchQ && matchS;
  });

  const totalStock = products.reduce((s, p) => {
    const listing = p.vendorListings[0];
    return s + (listing?.stock ?? p.variants.reduce((vs, v) => vs + v.stock, 0));
  }, 0);

  const lowStock = products.filter((p) => {
    const stock = p.vendorListings[0]?.stock ?? p.variants.reduce((s, v) => s + v.stock, 0);
    return stock > 0 && stock < 20;
  }).length;

  const noStock = products.filter((p) => {
    const stock = p.vendorListings[0]?.stock ?? p.variants.reduce((s, v) => s + v.stock, 0);
    return stock === 0;
  }).length;

  return (
    <div className="space-y-5 max-w-7xl">
      <div>
        <h1 className="text-headline-md font-bold">Mi Catálogo</h1>
        <p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">Productos que distribuyes bajo contrato marco</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total productos", value: products.length, color: "text-[var(--color-primary)]" },
          { label: "Aprobados",       value: products.filter((p) => p.status === "aprobado").length, color: "text-green-600" },
          { label: "Stock bajo (<20)", value: lowStock, color: "text-orange-600" },
          { label: "Sin stock",        value: noStock,  color: "text-red-600" },
        ].map((k) => (
          <div key={k.label} className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4">
            <p className={`text-2xl font-bold ${k.color}`}>{k.value}</p>
            <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] border border-[var(--color-border-subtle)] rounded-lg px-3 py-2">
          <Search size={14} className="text-[var(--color-on-surface-variant)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o SKU..."
            className="text-sm flex-1 outline-none bg-transparent"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={13} className="text-[var(--color-on-surface-variant)]" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-sm border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 outline-none"
          >
            <option value="todos">Todos los estados</option>
            <option value="aprobado">Aprobados</option>
            <option value="pendiente">En revisión</option>
            <option value="rechazado">Rechazados</option>
            <option value="bloqueado">Bloqueados</option>
          </select>
        </div>
      </div>

      {loading && (
        <div className="text-center py-16 text-[var(--color-on-surface-variant)]">
          <Package size={32} className="mx-auto mb-2 opacity-30 animate-pulse" />
          <p className="text-sm">Cargando catálogo...</p>
        </div>
      )}

      {!loading && (
        <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-container-low)]">
                  {["Producto", "Categoría", "Marca", "Variantes", "Stock", "Precio", "Estado"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-on-surface-variant)]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => {
                  const cfg = STATUS_CFG[p.status] ?? STATUS_CFG.bloqueado;
                  const listing = p.vendorListings[0];
                  const stock = listing?.stock ?? p.variants.reduce((s, v) => s + v.stock, 0);
                  const price = listing?.price ?? p.variants[0]?.basePrice ?? 0;
                  const unit = p.variants[0]?.unit ?? "";
                  return (
                    <tr
                      key={p.id}
                      className={`border-b border-[var(--color-border-subtle)] last:border-0 ${i % 2 === 1 ? "bg-[#fafafa]" : ""}`}
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium">{p.name}</p>
                        {p.variants[0] && (
                          <p className="text-xs text-[var(--color-on-surface-variant)]">{p.variants[0].sku}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--color-on-surface-variant)]">{p.category?.name ?? "—"}</td>
                      <td className="px-4 py-3 text-xs text-[var(--color-on-surface-variant)]">{p.brand?.name ?? "—"}</td>
                      <td className="px-4 py-3 text-sm text-center">{p.variants.length}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`font-semibold ${stock === 0 ? "text-red-600" : stock < 20 ? "text-orange-600" : "text-green-700"}`}>
                          {stock}
                        </span>
                        <span className="text-xs text-[var(--color-on-surface-variant)]"> {unit}</span>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold">
                        ${price.toFixed(2)}
                        <span className="text-xs font-normal text-[var(--color-on-surface-variant)]">/{unit}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${cfg.color}`}>
                          {cfg.icon} {cfg.label}
                        </span>
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
          {products.length > 0 && (
            <div className="px-4 py-3 border-t border-[var(--color-border-subtle)] text-xs text-[var(--color-on-surface-variant)]">
              {filtered.length} productos · Stock total: {totalStock.toLocaleString("es-CO")} unidades
            </div>
          )}
        </div>
      )}
    </div>
  );
}
