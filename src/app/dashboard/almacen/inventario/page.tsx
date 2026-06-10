"use client";

import { useState } from "react";
import { Warehouse, AlertTriangle, TrendingDown, Search } from "lucide-react";

const MOCK_INV = [
  { id: "i1", producto: "Urea Granulada 46%", sku: "FER-URE-46", lote: "L-2026-001", ubicacion: "Estante A-3", stock: 1200, minimo: 200, unidad: "50kg", vence: "2027-06-01" },
  { id: "i2", producto: "Glifosato 480 SL", sku: "HRB-GLF-480", lote: "L-2026-002", ubicacion: "Estante B-1", stock: 45, minimo: 100, unidad: "lt", vence: "2026-09-15" },
  { id: "i3", producto: "Trichoderma WP", sku: "BIO-TRI-WP", lote: "L-2026-003", ubicacion: "Refrigerado C-1", stock: 200, minimo: 50, unidad: "kg", vence: "2026-08-20" },
  { id: "i4", producto: "Mancozeb 80% WP", sku: "FUN-MAN-80", lote: "L-2026-004", ubicacion: "Estante A-5", stock: 15, minimo: 100, unidad: "kg", vence: "2027-03-10" },
  { id: "i5", producto: "NPK 15-15-15", sku: "FER-NPK-15", lote: "L-2026-005", ubicacion: "Estante A-1", stock: 850, minimo: 300, unidad: "50kg", vence: "2028-01-01" },
];

export default function AlmacenInventarioPage() {
  const [inv] = useState(MOCK_INV);
  const [search, setSearch] = useState("");

  const filtered = inv.filter(i => i.producto.toLowerCase().includes(search.toLowerCase()) || i.sku.toLowerCase().includes(search.toLowerCase()));
  const bajoMinimo = inv.filter(i => i.stock < i.minimo).length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-headline-md font-bold">Inventario general</h1>
        <p className="text-sm text-[var(--color-on-surface-variant)]">{inv.length} referencias · {bajoMinimo} bajo mínimo</p>
      </div>
      {bajoMinimo > 0 && (
        <div className="flex items-center gap-2.5 bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 text-sm text-orange-700">
          <AlertTriangle size={16} className="flex-shrink-0" />
          <span><strong>{bajoMinimo} referencias</strong> tienen stock por debajo del mínimo establecido.</span>
        </div>
      )}
      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar producto o SKU..." className="w-full pl-9 pr-3 py-2 border border-[var(--color-border-subtle)] rounded-lg text-sm outline-none focus:border-[var(--color-primary)]" />
      </div>
      <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--color-surface-container-low)] text-xs text-[var(--color-on-surface-variant)] uppercase tracking-wide">
            <tr>
              {["Producto / SKU", "Lote", "Ubicación", "Stock", "Mínimo", "Vence", ""].map(h => (
                <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border-subtle)]">
            {filtered.map(item => {
              const isLow = item.stock < item.minimo;
              return (
                <tr key={item.id} className={`hover:bg-[var(--color-surface-container-low)]/50 transition-colors ${isLow ? "bg-red-50/30" : ""}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Warehouse size={14} className="text-[var(--color-primary)] flex-shrink-0" />
                      <div>
                        <p className="font-medium">{item.producto}</p>
                        <p className="text-xs text-[var(--color-on-surface-variant)]">{item.sku} · {item.unidad}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{item.lote}</td>
                  <td className="px-4 py-3 text-[var(--color-on-surface-variant)]">{item.ubicacion}</td>
                  <td className="px-4 py-3">
                    <span className={`font-bold text-sm ${isLow ? "text-red-600" : "text-green-600"}`}>{item.stock}</span>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-on-surface-variant)]">{item.minimo}</td>
                  <td className="px-4 py-3 text-[var(--color-on-surface-variant)]">{item.vence}</td>
                  <td className="px-4 py-3">
                    {isLow && (
                      <span className="flex items-center gap-1 text-xs font-medium text-red-600"><TrendingDown size={12} /> Bajo</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
