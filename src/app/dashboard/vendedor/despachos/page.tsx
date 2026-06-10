"use client";

import { useState } from "react";
import { Truck, MapPin, Phone, Package, CheckCircle, Clock, Search } from "lucide-react";
import Link from "next/link";

type DespachoStatus = "pendiente" | "en_ruta" | "entregado" | "incidencia";

interface Despacho {
  id: string; orderNum: string; buyer: string; address: string;
  city: string; country: string; phone: string; carrier: string;
  trackingCode: string; items: number; weight: string;
  status: DespachoStatus; dispatchDate: string; estimatedDelivery: string;
}

const MOCK_DESPACHOS: Despacho[] = [
  { id: "d1", orderNum: "ORD-2026-4498", buyer: "Hacienda El Palmar SAS", address: "Cra 45 #78-23, Zona Industrial", city: "Medellín", country: "CO", phone: "+57 310 555 1234", carrier: "Servientrega", trackingCode: "SRV-2026-994521", items: 2, weight: "50kg", status: "en_ruta", dispatchDate: "2026-06-09", estimatedDelivery: "2026-06-13" },
  { id: "d2", orderNum: "ORD-2026-4445", buyer: "Agroinsumos Norte SRL", address: "Av. Principal 123, Barrio Industria", city: "Cali", country: "CO", phone: "+57 315 444 5678", carrier: "Deprisa", trackingCode: "DEP-2026-778234", items: 3, weight: "80kg", status: "pendiente", dispatchDate: "2026-06-12", estimatedDelivery: "2026-06-16" },
  { id: "d3", orderNum: "ORD-2026-4312", buyer: "Finca Productora Venezuela", address: "Calle Los Árboles, Sector Norte", city: "Caracas", country: "VE", phone: "+58 412 888 9012", carrier: "DHL", trackingCode: "DHL-2026-556789", items: 1, weight: "500kg", status: "entregado", dispatchDate: "2026-05-30", estimatedDelivery: "2026-06-05" },
  { id: "d4", orderNum: "ORD-2026-4267", buyer: "AgroTech Ecuador", address: "Km 12 Vía Daule", city: "Guayaquil", country: "EC", phone: "+593 99 777 3456", carrier: "DHL", trackingCode: "DHL-2026-441023", items: 4, weight: "200kg", status: "incidencia", dispatchDate: "2026-06-04", estimatedDelivery: "2026-06-10" },
];

const STATUS_CFG: Record<DespachoStatus, { label: string; color: string; icon: React.ReactNode }> = {
  pendiente: { label: "Por despachar", color: "bg-yellow-100 text-yellow-700", icon: <Clock size={11} /> },
  en_ruta: { label: "En ruta", color: "bg-blue-100 text-blue-700", icon: <Truck size={11} /> },
  entregado: { label: "Entregado", color: "bg-green-100 text-green-700", icon: <CheckCircle size={11} /> },
  incidencia: { label: "Incidencia", color: "bg-red-100 text-red-700", icon: <Package size={11} /> },
};

export default function VendedorDespachosPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");

  const filtered = MOCK_DESPACHOS.filter(d => {
    const q = d.orderNum.includes(search) || d.buyer.toLowerCase().includes(search.toLowerCase());
    const s = filterStatus === "todos" || d.status === filterStatus;
    return q && s;
  });

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-center justify-between">
        <div><h1 className="text-headline-md font-bold">Despachos</h1><p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">Seguimiento de envíos a tus compradores</p></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {([["todos", "Total"], ["pendiente", "Por despachar"], ["en_ruta", "En ruta"], ["incidencia", "Incidencias"]] as const).map(([k, label]) => (
          <button key={k} onClick={() => setFilterStatus(k)} className={`bg-white border rounded-xl p-3 text-left transition-colors ${filterStatus === k ? "border-[var(--color-primary)]" : "border-[var(--color-border-subtle)]"}`}>
            <p className="text-xl font-bold text-[var(--color-primary)]">{k === "todos" ? MOCK_DESPACHOS.length : MOCK_DESPACHOS.filter(d => d.status === k).length}</p>
            <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{label}</p>
          </button>
        ))}
      </div>

      <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4 flex gap-3">
        <div className="flex items-center gap-2 flex-1 border border-[var(--color-border-subtle)] rounded-lg px-3 py-2">
          <Search size={14} className="text-[var(--color-on-surface-variant)]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar orden o destinatario..." className="text-sm flex-1 outline-none bg-transparent" />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map(d => {
          const cfg = STATUS_CFG[d.status];
          return (
            <div key={d.id} className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="font-bold text-sm">{d.orderNum}</span>
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${cfg.color}`}>{cfg.icon} {cfg.label}</span>
                  </div>
                  <p className="font-semibold text-sm">{d.buyer}</p>
                  <div className="flex items-start gap-1 mt-1">
                    <MapPin size={12} className="text-[var(--color-on-surface-variant)] mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-[var(--color-on-surface-variant)]">{d.address}, {d.city}, {d.country}</p>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Phone size={12} className="text-[var(--color-on-surface-variant)]" />
                    <p className="text-xs text-[var(--color-on-surface-variant)]">{d.phone}</p>
                  </div>
                </div>
                <div className="text-right text-sm space-y-1 flex-shrink-0">
                  <p className="text-xs text-[var(--color-on-surface-variant)]">Transportista</p>
                  <p className="font-semibold">{d.carrier}</p>
                  <p className="text-xs font-mono text-[var(--color-on-surface-variant)]">{d.trackingCode}</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-[var(--color-border-subtle)] flex items-center justify-between flex-wrap gap-2">
                <div className="flex gap-4 text-xs text-[var(--color-on-surface-variant)]">
                  <span>{d.items} ítem{d.items !== 1 ? "s" : ""} · {d.weight}</span>
                  <span>Despacho: {d.dispatchDate}</span>
                  <span>Entrega est.: {d.estimatedDelivery}</span>
                </div>
                <div className="flex gap-2">
                  {d.status === "en_ruta" && <span className="text-xs text-blue-600 font-medium">🔄 En tránsito</span>}
                  {d.status === "incidencia" && <button className="text-xs font-medium text-[var(--color-secondary)] border border-[var(--color-secondary)] px-3 py-1 rounded-lg hover:bg-red-50">Reportar incidencia</button>}
                  <button className="text-xs font-medium text-[var(--color-primary)] border border-[var(--color-primary)] px-3 py-1 rounded-lg hover:bg-[var(--color-primary)]/5">Ver tracking</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
