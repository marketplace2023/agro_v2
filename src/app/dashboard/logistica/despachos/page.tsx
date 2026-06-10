"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Truck, MapPin, Clock, CheckCircle, AlertTriangle, Package } from "lucide-react";

const MOCK_DESPACHOS = [
  { id: "des-001", orden: "ORD-1042", cliente: "Finca La Esperanza", destino: "Palmira, Valle", carrier: "Servientrega", guia: "SE-9876543", fecha: "2026-06-10", items: 3, peso: "120 kg", status: "en_ruta" },
  { id: "des-002", orden: "ORD-1039", cliente: "Agropecuaria Boyacá SAS", destino: "Tunja, Boyacá", carrier: "Coordinadora", guia: "CO-4567890", fecha: "2026-06-09", items: 1, peso: "50 kg", status: "entregado" },
  { id: "des-003", orden: "ORD-1035", cliente: "AgroSoya del Meta", destino: "Villavicencio, Meta", carrier: "TCC", guia: "TC-1234567", fecha: "2026-06-08", items: 5, peso: "300 kg", status: "preparando" },
  { id: "des-004", orden: "ORD-1031", cliente: "Frutas del Oriente", destino: "Medellín, Antioquia", carrier: "Envia", guia: "Pendiente", fecha: "2026-06-07", items: 2, peso: "80 kg", status: "incidencia" },
  { id: "des-005", orden: "ORD-1028", cliente: "Distribuciones Agro Norte", destino: "Barranquilla, Atlántico", carrier: "Interrapidísimo", guia: "IR-9012345", fecha: "2026-06-06", items: 4, peso: "200 kg", status: "entregado" },
];

const STATUS_CFG = {
  preparando: { label: "Preparando", icon: <Package size={12} />, cls: "bg-yellow-100 text-yellow-700" },
  en_ruta: { label: "En ruta", icon: <Truck size={12} />, cls: "bg-blue-100 text-blue-700" },
  entregado: { label: "Entregado", icon: <CheckCircle size={12} />, cls: "bg-green-100 text-green-700" },
  incidencia: { label: "Incidencia", icon: <AlertTriangle size={12} />, cls: "bg-red-100 text-red-700" },
};

export default function DespachosPage() {
  const [despachos] = useState(MOCK_DESPACHOS);
  const [filter, setFilter] = useState("todos");

  const filtered = filter === "todos" ? despachos : despachos.filter(d => d.status === filter);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-md font-bold">Despachos</h1>
          <p className="text-sm text-[var(--color-on-surface-variant)]">{despachos.filter(d => d.status === "en_ruta").length} en ruta · {despachos.filter(d => d.status === "incidencia").length} con incidencia</p>
        </div>
        <Link href="/dashboard/logistica/despachos/nuevo" className="flex items-center gap-2 bg-[var(--color-primary)] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90">
          <Plus size={16} /> Nuevo despacho
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {["todos", "preparando", "en_ruta", "entregado", "incidencia"].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === f ? "bg-[var(--color-primary)] text-white" : "bg-white border border-[var(--color-border-subtle)] text-[var(--color-on-surface-variant)]"}`}>
            {f === "todos" ? "Todos" : f === "en_ruta" ? "En ruta" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--color-surface-container-low)] text-xs text-[var(--color-on-surface-variant)] uppercase tracking-wide">
            <tr>
              {["Orden / Guía", "Destino", "Transportador", "Fecha", "Items / Peso", "Estado", "Acciones"].map(h => (
                <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border-subtle)]">
            {filtered.map(d => {
              const scfg = STATUS_CFG[d.status as keyof typeof STATUS_CFG];
              return (
                <tr key={d.id} className="hover:bg-[var(--color-surface-container-low)]/50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-[var(--color-primary)]">{d.orden}</p>
                    <p className="text-xs text-[var(--color-on-surface-variant)]">{d.guia}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{d.cliente}</p>
                    <p className="text-xs text-[var(--color-on-surface-variant)] flex items-center gap-1"><MapPin size={10} /> {d.destino}</p>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-on-surface-variant)]">{d.carrier}</td>
                  <td className="px-4 py-3 text-[var(--color-on-surface-variant)]">
                    <span className="flex items-center gap-1"><Clock size={11} /> {d.fecha}</span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{d.items} ítem(s)</p>
                    <p className="text-xs text-[var(--color-on-surface-variant)]">{d.peso}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${scfg.cls}`}>
                      {scfg.icon} {scfg.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/dashboard/logistica/prueba-entrega/${d.id}`} className="text-xs text-[var(--color-primary)] hover:underline font-medium">Ver detalle</Link>
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
