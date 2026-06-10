"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, RefreshCw } from "lucide-react";

const MOCK_MOVIMIENTOS = [
  { id: "m1", tipo: "entrada", producto: "Urea Granulada 46%", sku: "FER-URE-46", cantidad: 500, unidad: "50kg", fecha: "2026-06-10 08:30", usuario: "Pedro Almacén", referencia: "OC-2026-112" },
  { id: "m2", tipo: "salida", producto: "Glifosato 480 SL", sku: "HRB-GLF-480", cantidad: 30, unidad: "lt", fecha: "2026-06-10 09:45", usuario: "Pedro Almacén", referencia: "ORD-1042" },
  { id: "m3", tipo: "ajuste", producto: "Mancozeb 80% WP", sku: "FUN-MAN-80", cantidad: -10, unidad: "kg", fecha: "2026-06-09 15:00", usuario: "Pedro Almacén", referencia: "AJ-2026-008" },
  { id: "m4", tipo: "salida", producto: "NPK 15-15-15", sku: "FER-NPK-15", cantidad: 80, unidad: "50kg", fecha: "2026-06-09 11:20", usuario: "Pedro Almacén", referencia: "ORD-1039" },
  { id: "m5", tipo: "entrada", producto: "Trichoderma WP", sku: "BIO-TRI-WP", cantidad: 100, unidad: "kg", fecha: "2026-06-08 07:00", usuario: "Pedro Almacén", referencia: "OC-2026-110" },
];

const TIPO_CFG = {
  entrada: { label: "Entrada", icon: <ArrowDown size={12} />, cls: "bg-green-100 text-green-700" },
  salida: { label: "Salida", icon: <ArrowUp size={12} />, cls: "bg-red-100 text-red-700" },
  ajuste: { label: "Ajuste", icon: <RefreshCw size={12} />, cls: "bg-yellow-100 text-yellow-700" },
};

export default function MovimientosPage() {
  const [items] = useState(MOCK_MOVIMIENTOS);
  const [filter, setFilter] = useState("todos");

  const filtered = filter === "todos" ? items : items.filter(m => m.tipo === filter);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-headline-md font-bold">Movimientos de inventario</h1>
        <p className="text-sm text-[var(--color-on-surface-variant)]">Historial de entradas, salidas y ajustes</p>
      </div>
      <div className="flex gap-2">
        {["todos", "entrada", "salida", "ajuste"].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === f ? "bg-[var(--color-primary)] text-white" : "bg-white border border-[var(--color-border-subtle)] text-[var(--color-on-surface-variant)]"}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
      <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--color-surface-container-low)] text-xs text-[var(--color-on-surface-variant)] uppercase tracking-wide">
            <tr>
              {["Tipo", "Producto", "Cantidad", "Fecha", "Referencia", "Usuario"].map(h => (
                <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border-subtle)]">
            {filtered.map(m => {
              const tcfg = TIPO_CFG[m.tipo as keyof typeof TIPO_CFG];
              return (
                <tr key={m.id} className="hover:bg-[var(--color-surface-container-low)]/50 transition-colors">
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${tcfg.cls}`}>
                      {tcfg.icon} {tcfg.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{m.producto}</p>
                    <p className="text-xs text-[var(--color-on-surface-variant)]">{m.sku}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-bold ${m.cantidad < 0 ? "text-red-600" : m.tipo === "salida" ? "text-orange-600" : "text-green-600"}`}>
                      {m.tipo === "salida" ? "-" : m.cantidad < 0 ? "" : "+"}{Math.abs(m.cantidad)} {m.unidad}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-on-surface-variant)]">{m.fecha}</td>
                  <td className="px-4 py-3 font-mono text-xs">{m.referencia}</td>
                  <td className="px-4 py-3 text-[var(--color-on-surface-variant)]">{m.usuario}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
