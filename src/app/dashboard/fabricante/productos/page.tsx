"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, FlaskConical, Edit, Eye, MoreVertical, CheckCircle, Clock, XCircle } from "lucide-react";

const MOCK_PRODUCTOS = [
  { id: "p1", name: "Urea Granulada 46% N", sku: "FER-URE-46", category: "Fertilizantes", presentations: 3, status: "aprobado", registros: 2, stock: 1200 },
  { id: "p2", name: "Glifosato 480 SL", sku: "HRB-GLF-480", category: "Herbicidas", presentations: 2, status: "aprobado", registros: 3, stock: 450 },
  { id: "p3", name: "Trichoderma Harzianum WP", sku: "BIO-TRI-WP", category: "Biológicos", presentations: 2, status: "pendiente", registros: 1, stock: 200 },
  { id: "p4", name: "Mancozeb 80% WP", sku: "FUN-MAN-80", category: "Fungicidas", presentations: 1, status: "aprobado", registros: 2, stock: 800 },
  { id: "p5", name: "Clorpirifos 480 EC", sku: "INS-CLO-480", category: "Insecticidas", presentations: 2, status: "rechazado", registros: 0, stock: 0 },
];

const STATUS_CFG = {
  aprobado: { label: "Aprobado", icon: <CheckCircle size={12} />, cls: "bg-green-100 text-green-700" },
  pendiente: { label: "En revisión", icon: <Clock size={12} />, cls: "bg-yellow-100 text-yellow-700" },
  rechazado: { label: "Rechazado", icon: <XCircle size={12} />, cls: "bg-red-100 text-red-700" },
};

export default function FabricanteProductosPage() {
  const [productos] = useState(MOCK_PRODUCTOS);
  const [search, setSearch] = useState("");

  const filtered = productos.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-md font-bold">Mis líneas de producto</h1>
          <p className="text-sm text-[var(--color-on-surface-variant)]">{productos.length} productos registrados</p>
        </div>
        <Link href="/dashboard/fabricante/productos/nuevo" className="flex items-center gap-2 bg-[var(--color-primary)] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90">
          <Plus size={16} /> Registrar producto
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total productos", value: productos.length, color: "text-[var(--color-primary)]" },
          { label: "Aprobados", value: productos.filter(p => p.status === "aprobado").length, color: "text-green-600" },
          { label: "En revisión", value: productos.filter(p => p.status === "pendiente").length, color: "text-yellow-600" },
          { label: "Rechazados", value: productos.filter(p => p.status === "rechazado").length, color: "text-red-600" },
        ].map(s => (
          <div key={s.label} className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl overflow-hidden">
        <div className="flex items-center gap-3 p-4 border-b border-[var(--color-border-subtle)]">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nombre o SKU..."
            className="flex-1 border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]"
          />
        </div>
        <table className="w-full text-sm">
          <thead className="bg-[var(--color-surface-container-low)] text-xs text-[var(--color-on-surface-variant)] uppercase tracking-wide">
            <tr>
              {["Producto", "Categoría", "Presentaciones", "Registros ICA", "Stock total", "Estado", ""].map(h => (
                <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border-subtle)]">
            {filtered.map(p => {
              const scfg = STATUS_CFG[p.status as keyof typeof STATUS_CFG];
              return (
                <tr key={p.id} className="hover:bg-[var(--color-surface-container-low)]/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-[var(--color-primary)]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FlaskConical size={14} className="text-[var(--color-primary)]" />
                      </div>
                      <div>
                        <p className="font-medium text-[var(--color-on-surface)]">{p.name}</p>
                        <p className="text-xs text-[var(--color-on-surface-variant)]">{p.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-on-surface-variant)]">{p.category}</td>
                  <td className="px-4 py-3 font-medium">{p.presentations}</td>
                  <td className="px-4 py-3">
                    <span className={p.registros > 0 ? "text-green-600 font-medium" : "text-red-500"}>{p.registros}</span>
                  </td>
                  <td className="px-4 py-3 font-medium">{p.stock > 0 ? `${p.stock.toLocaleString()} u.` : "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${scfg.cls}`}>
                      {scfg.icon} {scfg.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Link href={`/dashboard/fabricante/documentos`} className="p-1.5 hover:bg-gray-100 rounded-lg text-[var(--color-on-surface-variant)]"><Eye size={14} /></Link>
                      <Link href={`/dashboard/fabricante/productos/nuevo`} className="p-1.5 hover:bg-gray-100 rounded-lg text-[var(--color-on-surface-variant)]"><Edit size={14} /></Link>
                      <button className="p-1.5 hover:bg-gray-100 rounded-lg text-[var(--color-on-surface-variant)]"><MoreVertical size={14} /></button>
                    </div>
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
