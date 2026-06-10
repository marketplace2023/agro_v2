"use client";

import { useState } from "react";
import { Plus, Search, MapPin, Package, Edit2, Trash2, CheckCircle, Clock, XCircle } from "lucide-react";

type DistStatus = "activo" | "pendiente" | "suspendido";

interface Distribuidor {
  id: string; company: string; contact: string; country: string; city: string;
  territory: string[]; authorizedProducts: number; salesMonth: number;
  status: DistStatus; since: string; expiresAt: string;
}

const MOCK_DISTRIBUIDORES: Distribuidor[] = [
  { id: "d1", company: "AgroMax Distribuciones SAS", contact: "Carlos Ruiz · +57 310 555 0011", country: "CO", city: "Bogotá", territory: ["Bogotá D.C.", "Cundinamarca", "Boyacá"], authorizedProducts: 15, salesMonth: 45200, status: "activo", since: "2023-03-01", expiresAt: "2027-02-28" },
  { id: "d2", company: "Agroquímica del Pacífico", contact: "María Torres · +57 312 888 4455", country: "CO", city: "Cali", territory: ["Valle del Cauca", "Cauca", "Nariño"], authorizedProducts: 8, salesMonth: 28700, status: "activo", since: "2022-06-15", expiresAt: "2026-06-14" },
  { id: "d3", company: "Distribuidora Agro Ecuador SA", contact: "Luis Mora · +593 99 777 2233", country: "EC", city: "Guayaquil", territory: ["Costa ecuatoriana", "Sierra norte"], authorizedProducts: 12, salesMonth: 35000, status: "activo", since: "2024-01-10", expiresAt: "2027-01-09" },
  { id: "d4", company: "AgroInsumos Venezuela SRL", contact: "Ana Pérez · +58 412 444 6677", country: "VE", city: "Valencia", territory: ["Carabobo", "Aragua"], authorizedProducts: 6, salesMonth: 0, status: "suspendido", since: "2022-09-01", expiresAt: "2025-08-31" },
  { id: "d5", company: "AgroCorp Perú SAC", contact: "Pedro Vega · +51 994 123 456", country: "PE", city: "Lima", territory: ["Lima Metropolitana", "La Libertad"], authorizedProducts: 0, salesMonth: 0, status: "pendiente", since: "2026-06-01", expiresAt: "2029-05-31" },
];

const STATUS_CFG: Record<DistStatus, { label: string; color: string; icon: React.ReactNode }> = {
  activo: { label: "Activo", color: "bg-green-100 text-green-700", icon: <CheckCircle size={11} /> },
  pendiente: { label: "Pendiente", color: "bg-yellow-100 text-yellow-700", icon: <Clock size={11} /> },
  suspendido: { label: "Suspendido", color: "bg-red-100 text-red-700", icon: <XCircle size={11} /> },
};

export default function FabricanteDistribuidoresPage() {
  const [distribuidores, setDistribuidores] = useState(MOCK_DISTRIBUIDORES);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [showForm, setShowForm] = useState(false);

  const filtered = distribuidores.filter(d => {
    const q = d.company.toLowerCase().includes(search.toLowerCase()) || d.country.includes(search.toUpperCase());
    const s = filterStatus === "todos" || d.status === filterStatus;
    return q && s;
  });

  function toggleStatus(id: string, newStatus: DistStatus) { setDistribuidores(prev => prev.map(d => d.id === id ? { ...d, status: newStatus } : d)); }
  function remove(id: string) { setDistribuidores(prev => prev.filter(d => d.id !== id)); }

  return (
    <div className="space-y-5 max-w-6xl">
      <div className="flex items-center justify-between">
        <div><h1 className="text-headline-md font-bold">Distribuidores Autorizados</h1><p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">{distribuidores.filter(d => d.status === "activo").length} activos en {[...new Set(distribuidores.map(d => d.country))].length} países</p></div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-[var(--color-primary)] text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:opacity-90"><Plus size={15} /> Agregar distribuidor</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[{ label: "Total", value: distribuidores.length, color: "text-[var(--color-primary)]" }, { label: "Activos", value: distribuidores.filter(d => d.status === "activo").length, color: "text-green-600" }, { label: "Ventas mes", value: `$${(distribuidores.reduce((s, d) => s + d.salesMonth, 0) / 1000).toFixed(0)}k`, color: "text-blue-600" }, { label: "Países", value: [...new Set(distribuidores.map(d => d.country))].length, color: "text-orange-600" }].map(k => (
          <div key={k.label} className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4"><p className={`text-2xl font-bold ${k.color}`}>{k.value}</p><p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{k.label}</p></div>
        ))}
      </div>

      <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4 flex flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] border border-[var(--color-border-subtle)] rounded-lg px-3 py-2">
          <Search size={14} className="text-[var(--color-on-surface-variant)]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar empresa o país..." className="text-sm flex-1 outline-none bg-transparent" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="text-sm border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 outline-none">
          <option value="todos">Todos los estados</option>
          <option value="activo">Activos</option>
          <option value="pendiente">Pendientes</option>
          <option value="suspendido">Suspendidos</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(d => {
          const cfg = STATUS_CFG[d.status];
          return (
            <div key={d.id} className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <h3 className="font-bold text-sm">{d.company}</h3>
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${cfg.color}`}>{cfg.icon} {cfg.label}</span>
                  </div>
                  <p className="text-xs text-[var(--color-on-surface-variant)]">{d.contact}</p>
                  <div className="flex items-center gap-1 mt-0.5"><MapPin size={11} className="text-[var(--color-on-surface-variant)]" /><span className="text-xs text-[var(--color-on-surface-variant)]">{d.city}, {d.country}</span></div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button className="p-1.5 hover:bg-gray-100 rounded-lg text-[var(--color-primary)]"><Edit2 size={13} /></button>
                  <button onClick={() => remove(d.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-500"><Trash2 size={13} /></button>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {d.territory.map(t => <span key={t} className="text-xs bg-[var(--color-surface-container-low)] text-[var(--color-on-surface-variant)] px-2 py-0.5 rounded-full">{t}</span>)}
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-[var(--color-surface-container-low)] rounded-lg p-2"><p className="text-sm font-bold text-[var(--color-primary)]">{d.authorizedProducts}</p><p className="text-xs text-[var(--color-on-surface-variant)]">Productos</p></div>
                <div className="bg-[var(--color-surface-container-low)] rounded-lg p-2"><p className="text-sm font-bold text-green-700">{d.salesMonth > 0 ? `$${(d.salesMonth / 1000).toFixed(1)}k` : "—"}</p><p className="text-xs text-[var(--color-on-surface-variant)]">Ventas mes</p></div>
                <div className="bg-[var(--color-surface-container-low)] rounded-lg p-2"><p className="text-sm font-bold">{d.expiresAt.slice(0, 7)}</p><p className="text-xs text-[var(--color-on-surface-variant)]">Vence</p></div>
              </div>

              <div className="flex gap-2 pt-1">
                {d.status === "pendiente" && <button onClick={() => toggleStatus(d.id, "activo")} className="flex-1 bg-green-600 text-white text-xs font-semibold py-1.5 rounded-lg hover:bg-green-700">Activar</button>}
                {d.status === "activo" && <button onClick={() => toggleStatus(d.id, "suspendido")} className="flex-1 border border-orange-300 text-orange-600 text-xs font-medium py-1.5 rounded-lg hover:bg-orange-50">Suspender</button>}
                {d.status === "suspendido" && <button onClick={() => toggleStatus(d.id, "activo")} className="flex-1 border border-green-300 text-green-700 text-xs font-medium py-1.5 rounded-lg hover:bg-green-50">Reactivar</button>}
                <button className="flex items-center justify-center gap-1 border border-[var(--color-border-subtle)] text-xs font-medium py-1.5 px-3 rounded-lg hover:bg-gray-50"><Package size={11} /> Asignar productos</button>
              </div>
            </div>
          );
        })}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-bold text-base">Agregar distribuidor</h3>
            <div className="space-y-3">
              {[["Empresa", "text", "Nombre de la empresa"], ["Contacto", "text", "Nombre · teléfono"], ["País", "select", ""], ["Ciudad", "text", "Ciudad principal"], ["Fecha vencimiento contrato", "date", ""]].map(([label, type]) => (
                <div key={String(label)}><label className="block text-sm font-medium mb-1">{label}</label>{type === "select" ? <select className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 text-sm outline-none"><option value="CO">Colombia</option><option value="VE">Venezuela</option><option value="EC">Ecuador</option><option value="PE">Perú</option><option value="MX">México</option></select> : <input type={type} className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]" />}</div>
              ))}
            </div>
            <div className="flex gap-3"><button onClick={() => setShowForm(false)} className="flex-1 border border-[var(--color-border-subtle)] text-sm font-medium py-2 rounded-lg">Cancelar</button><button onClick={() => setShowForm(false)} className="flex-1 bg-[var(--color-primary)] text-white text-sm font-semibold py-2 rounded-lg hover:opacity-90">Agregar</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
