"use client";

import { useState } from "react";
import { Users, Phone, MapPin, TrendingUp, Star } from "lucide-react";

const MOCK_CLIENTES = [
  { id: "c1", nombre: "Finca La Esperanza", contacto: "Don Carlos Pérez", telefono: "+57 310 123 4567", ciudad: "Palmira, Valle", ultimaCompra: "2026-06-05", totalAnual: 12400000, categoria: "A" },
  { id: "c2", nombre: "Agropecuaria Boyacá SAS", contacto: "Ing. Lucía Torres", telefono: "+57 320 234 5678", ciudad: "Tunja, Boyacá", ultimaCompra: "2026-06-02", totalAnual: 38500000, categoria: "A" },
  { id: "c3", nombre: "AgroSoya del Meta", contacto: "Sr. Rodrigo Vargas", telefono: "+57 315 345 6789", ciudad: "Villavicencio, Meta", ultimaCompra: "2026-05-28", totalAnual: 8200000, categoria: "B" },
  { id: "c4", nombre: "Frutas del Oriente", contacto: "Dra. Paola Ríos", telefono: "+57 300 456 7890", ciudad: "Medellín, Antioquia", ultimaCompra: "2026-05-15", totalAnual: 5600000, categoria: "B" },
  { id: "c5", nombre: "Hacienda Los Robles", contacto: "Sr. Ernesto Cárdenas", telefono: "+57 317 567 8901", ciudad: "Manizales, Caldas", ultimaCompra: "2026-04-20", totalAnual: 2100000, categoria: "C" },
];

const CAT_CFG: Record<string, { label: string; cls: string }> = {
  A: { label: "Cliente A", cls: "bg-yellow-100 text-yellow-700" },
  B: { label: "Cliente B", cls: "bg-blue-100 text-blue-700" },
  C: { label: "Cliente C", cls: "bg-gray-100 text-gray-600" },
};

export default function RepresentanteClientesPage() {
  const [clientes] = useState(MOCK_CLIENTES);
  const [search, setSearch] = useState("");

  const filtered = clientes.filter(c => c.nombre.toLowerCase().includes(search.toLowerCase()) || c.ciudad.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-headline-md font-bold">Mis clientes</h1>
        <p className="text-sm text-[var(--color-on-surface-variant)]">{clientes.length} clientes asignados</p>
      </div>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre o ciudad..." className="w-full max-w-sm border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]" />
      <div className="grid gap-3 sm:grid-cols-2">
        {filtered.map(c => {
          const catCfg = CAT_CFG[c.categoria];
          return (
            <div key={c.id} className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-[var(--color-primary)]/8 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Users size={16} className="text-[var(--color-primary)]" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{c.nombre}</p>
                    <p className="text-xs text-[var(--color-on-surface-variant)]">{c.contacto}</p>
                  </div>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${catCfg.cls}`}>{catCfg.label}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-[var(--color-on-surface-variant)]">
                <span className="flex items-center gap-1"><Phone size={10} /> {c.telefono}</span>
                <span className="flex items-center gap-1"><MapPin size={10} /> {c.ciudad}</span>
                <span className="flex items-center gap-1"><TrendingUp size={10} /> ${(c.totalAnual / 1e6).toFixed(1)}M / año</span>
                <span>Última compra: {c.ultimaCompra}</span>
              </div>
              <div className="flex gap-2 pt-0.5">
                <button className="flex-1 text-xs bg-[var(--color-primary)] text-white py-2 rounded-lg font-medium hover:opacity-90">Llamar</button>
                <button className="flex-1 text-xs border border-[var(--color-border-subtle)] text-[var(--color-on-surface-variant)] py-2 rounded-lg hover:bg-gray-50">Ver historial</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
