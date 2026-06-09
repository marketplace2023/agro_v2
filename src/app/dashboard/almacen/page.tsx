"use client";

import { useState } from "react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Warehouse, Package, AlertTriangle, ClipboardList } from "lucide-react";

const INVENTORY = [
  { sku: "UREA-46-50", nombre: "Urea Granulada 46% — Fertiagro", ubicacion: "A-01-C", stock: 420, unidad: "sacos", lotes: 3, min_stock: 50 },
  { sku: "NPK-151515-50", nombre: "NPK 15-15-15 — Fertiagro", ubicacion: "A-02-A", stock: 280, unidad: "sacos", lotes: 2, min_stock: 50 },
  { sku: "GLIFO-480-SL", nombre: "Glifosato 480 SL — AgroQuim", ubicacion: "B-01-D", stock: 85, unidad: "litros", lotes: 1, min_stock: 100 },
  { sku: "TRYCH-WP-KG", nombre: "Trichoderma Harzianum WP — BioSolutions", ubicacion: "C-03-B", stock: 45, unidad: "kg", lotes: 2, min_stock: 30 },
  { sku: "MANC-80-KG", nombre: "Mancozeb 80% WP — CropProtect", ubicacion: "B-02-A", stock: 12, unidad: "kg", lotes: 1, min_stock: 25 },
];

const LOTES = [
  { lote: "LOTE-A-2024-112", producto: "Urea Granulada 46%", cantidad: 180, unidad: "sacos", fabricacion: "2024-03-15", vencimiento: "2026-03-15", cert: "CERT-ICA-2024-001", ubicacion: "A-01-C", estado: "disponible" },
  { lote: "LOTE-A-2024-113", producto: "Urea Granulada 46%", cantidad: 200, unidad: "sacos", fabricacion: "2024-05-01", vencimiento: "2026-05-01", cert: "CERT-ICA-2024-002", ubicacion: "A-01-C", estado: "disponible" },
  { lote: "LOTE-B-2024-089", producto: "Glifosato 480 SL", cantidad: 85, unidad: "litros", fabricacion: "2024-04-20", vencimiento: "2026-04-20", cert: "CERT-ICA-2024-008", ubicacion: "B-01-D", estado: "en_cuarentena" },
  { lote: "LOTE-C-2024-201", producto: "Trichoderma Harzianum WP", cantidad: 45, unidad: "kg", fabricacion: "2025-01-10", vencimiento: "2026-01-10", cert: "CERT-ICA-2025-012", ubicacion: "C-03-B", estado: "por_vencer" },
];

const PICKING = [
  {
    orden: "ORD-2024-088",
    comprador: "Finca Las Palmas",
    items: [
      { producto: "Urea Granulada 46% × 20 sacos", lote: "LOTE-A-2024-112", sku: "UREA-46-50", ubicacion: "A-01-C", checkeado: false },
      { producto: "NPK 15-15-15 × 10 sacos", lote: "LOTE-2024-113", sku: "NPK-151515-50", ubicacion: "A-02-A", checkeado: false },
    ],
  },
];

export default function AlmacenDashboard() {
  const [checkItems, setCheckItems] = useState<Record<string, boolean>>({});

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-headline-md font-bold">Dashboard Almacén</h1>
        <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">Centro de distribución Bogotá · Control de inventario y despachos</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="SKUs totales" value="892" subtitle="en 3 bodegas" icon={<Warehouse size={20} />} color="primary" />
        <StatsCard title="Lotes activos" value="234" subtitle="5 por vencer" icon={<Package size={20} />} color="green" />
        <StatsCard title="Despachos pendientes" value="8" subtitle="3 urgentes hoy" icon={<ClipboardList size={20} />} color="orange" />
        <StatsCard title="Alertas FIFO" value="5" subtitle="lotes sin rotación >30 días" icon={<AlertTriangle size={20} />} color="red" />
      </div>

      {/* Inventario */}
      <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--color-border-subtle)] flex items-center justify-between">
          <h2 className="font-semibold text-sm flex items-center gap-2"><Warehouse size={14} /> Inventario — Muestra</h2>
          <button className="text-xs bg-[var(--color-primary)] text-white px-3 py-1 rounded-full font-medium">Ver inventario completo</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-[var(--color-surface-container-low)]">
              <tr>
                {["SKU", "Producto", "Ubicación", "Stock", "Lotes", "Estado"].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 text-xs font-medium text-[var(--color-on-surface-variant)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {INVENTORY.map(item => {
                const critical = item.stock < item.min_stock;
                return (
                  <tr key={item.sku} className={`border-t border-[var(--color-border-subtle)] ${critical ? "bg-red-50" : ""}`}>
                    <td className="px-4 py-3 font-mono text-[10px] text-[var(--color-primary)]">{item.sku}</td>
                    <td className="px-4 py-3 font-medium">{item.nombre}</td>
                    <td className="px-4 py-3 font-mono text-[var(--color-on-surface-variant)]">{item.ubicacion}</td>
                    <td className="px-4 py-3">
                      <span className={`font-bold ${critical ? "text-[var(--color-secondary)]" : "text-[var(--color-agri-green)]"}`}>
                        {item.stock} {item.unidad}
                      </span>
                      {critical && <span className="ml-1 text-[10px] text-red-600">⚠️ Stock bajo</span>}
                    </td>
                    <td className="px-4 py-3 text-[var(--color-on-surface-variant)]">{item.lotes}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${critical ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                        {critical ? "Stock bajo" : "OK"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lotes FIFO */}
      <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--color-border-subtle)]">
          <h2 className="font-semibold text-sm flex items-center gap-2"><Package size={14} /> Lotes — Orden FIFO</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-[var(--color-surface-container-low)]">
              <tr>
                {["Lote", "Producto", "Cantidad", "Fabricación", "Vencimiento", "Certificado", "Ubicación", "Estado"].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 text-xs font-medium text-[var(--color-on-surface-variant)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {LOTES.map(l => (
                <tr key={l.lote} className={`border-t border-[var(--color-border-subtle)] ${l.estado === "en_cuarentena" ? "bg-yellow-50" : l.estado === "por_vencer" ? "bg-orange-50" : ""}`}>
                  <td className="px-4 py-3 font-mono text-[10px] font-medium">{l.lote}</td>
                  <td className="px-4 py-3">{l.producto}</td>
                  <td className="px-4 py-3 font-semibold">{l.cantidad} {l.unidad}</td>
                  <td className="px-4 py-3 text-[var(--color-on-surface-variant)]">{l.fabricacion}</td>
                  <td className="px-4 py-3 font-medium">{l.vencimiento}</td>
                  <td className="px-4 py-3 font-mono text-[10px]">{l.cert}</td>
                  <td className="px-4 py-3 font-mono text-[var(--color-on-surface-variant)]">{l.ubicacion}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      l.estado === "disponible" ? "bg-green-100 text-green-700" :
                      l.estado === "en_cuarentena" ? "bg-yellow-100 text-yellow-700" :
                      "bg-orange-100 text-orange-700"
                    }`}>
                      {l.estado.replace("_", " ")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Picking / Packing */}
      <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--color-border-subtle)]">
          <h2 className="font-semibold text-sm flex items-center gap-2"><ClipboardList size={14} /> Picking / Packing — Orden activa</h2>
        </div>
        <div className="p-5">
          {PICKING.map(p => (
            <div key={p.orden}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-bold text-[var(--color-primary)]">{p.orden}</p>
                  <p className="text-xs text-[var(--color-on-surface-variant)]">Comprador: {p.comprador}</p>
                </div>
                <button className="text-xs bg-[var(--color-agri-green)] text-white px-3 py-1.5 rounded-lg font-medium">
                  Marcar orden lista para despacho
                </button>
              </div>
              <div className="space-y-2">
                {p.items.map((item, idx) => {
                  const key = `${p.orden}-${idx}`;
                  const checked = checkItems[key] ?? false;
                  return (
                    <div
                      key={idx}
                      onClick={() => setCheckItems(prev => ({ ...prev, [key]: !prev[key] }))}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${checked ? "bg-green-50 border-green-200" : "border-[var(--color-border-subtle)] hover:border-[var(--color-primary)]"}`}
                    >
                      <div className={`w-5 h-5 rounded flex items-center justify-center border-2 shrink-0 ${checked ? "bg-green-500 border-green-500" : "border-[var(--color-border-subtle)]"}`}>
                        {checked && <span className="text-white text-xs">✓</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium">{item.producto}</p>
                        <p className="text-[10px] text-[var(--color-on-surface-variant)]">
                          Lote: {item.lote} · SKU: {item.sku} · Ubicación: <span className="font-mono font-bold">{item.ubicacion}</span>
                        </p>
                      </div>
                      {checked && <span className="text-[10px] text-green-600 font-bold shrink-0">✅ Recogido</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
