"use client";

import { useState } from "react";
import Link from "next/link";
import { Package, Truck, CheckCircle, Clock, AlertTriangle, Search, ChevronRight } from "lucide-react";

const MOCK_ORDENES = [
  { id: "ORD-1042", fecha: "2026-06-10", total: 340000, items: 3, status: "en_camino", vendedor: "DistAgroMax SAS", entrega: "2026-06-13" },
  { id: "ORD-1038", fecha: "2026-06-05", total: 185000, items: 2, status: "entregado", vendedor: "AgroSuministros CO SAS", entrega: "2026-06-08" },
  { id: "ORD-1030", fecha: "2026-05-28", total: 520000, items: 5, status: "entregado", vendedor: "DistAgroMax SAS", entrega: "2026-06-02" },
  { id: "ORD-1021", fecha: "2026-05-15", total: 98000, items: 1, status: "entregado", vendedor: "DistAgroMax SAS", entrega: "2026-05-20" },
  { id: "ORD-1018", fecha: "2026-05-10", total: 275000, items: 4, status: "cancelado", vendedor: "AgroSuministros CO SAS", entrega: "—" },
];

const STATUS_CFG = {
  pendiente: { label: "Pendiente", icon: <Clock size={12} />, cls: "bg-yellow-100 text-yellow-700" },
  en_camino: { label: "En camino", icon: <Truck size={12} />, cls: "bg-blue-100 text-blue-700" },
  entregado: { label: "Entregado", icon: <CheckCircle size={12} />, cls: "bg-green-100 text-green-700" },
  cancelado: { label: "Cancelado", icon: <AlertTriangle size={12} />, cls: "bg-gray-100 text-gray-600" },
};

export default function CompradorOrdenesPage() {
  const [ordenes] = useState(MOCK_ORDENES);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("todas");

  const filtered = ordenes.filter(o => {
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) || o.vendedor.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "todas" || o.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-headline-md font-bold">Mis órdenes</h1>
        <p className="text-sm text-[var(--color-on-surface-variant)]">{ordenes.length} órdenes · {ordenes.filter(o => o.status === "en_camino").length} en camino</p>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar orden o vendedor..." className="w-full pl-9 pr-3 py-2 border border-[var(--color-border-subtle)] rounded-lg text-sm outline-none focus:border-[var(--color-primary)]" />
        </div>
        {["todas", "en_camino", "entregado", "cancelado"].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${filter === f ? "bg-[var(--color-primary)] text-white" : "bg-white border border-[var(--color-border-subtle)] text-[var(--color-on-surface-variant)]"}`}>
            {f === "todas" ? "Todas" : f === "en_camino" ? "En camino" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(o => {
          const scfg = STATUS_CFG[o.status as keyof typeof STATUS_CFG];
          return (
            <div key={o.id} className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-[var(--color-primary)]/8 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Package size={18} className="text-[var(--color-primary)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm text-[var(--color-primary)]">{o.id}</p>
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${scfg.cls}`}>
                        {scfg.icon} {scfg.label}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{o.vendedor} · {o.items} ítem(s) · Pedido: {o.fecha}</p>
                    {o.status === "en_camino" && <p className="text-xs text-blue-600 mt-0.5 font-medium">Entrega estimada: {o.entrega}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <p className="font-bold text-sm">${o.total.toLocaleString("es-CO")}</p>
                  <div className="flex gap-2">
                    {o.status === "en_camino" && (
                      <Link href="/tracking" className="text-xs flex items-center gap-1 border border-[var(--color-primary)] text-[var(--color-primary)] px-3 py-1.5 rounded-lg font-medium hover:bg-[var(--color-primary)]/5">
                        <Truck size={12} /> Rastrear
                      </Link>
                    )}
                    {o.status === "entregado" && (
                      <Link href="/reclamos" className="text-xs border border-[var(--color-border-subtle)] text-[var(--color-on-surface-variant)] px-3 py-1.5 rounded-lg hover:bg-gray-50">
                        Reclamar
                      </Link>
                    )}
                    <button className="p-1.5 hover:bg-gray-100 rounded-lg text-[var(--color-on-surface-variant)]"><ChevronRight size={14} /></button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
