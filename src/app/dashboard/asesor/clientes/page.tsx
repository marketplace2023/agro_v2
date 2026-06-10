"use client";

import { useState } from "react";
import { Users, Leaf, MapPin, Phone, ChevronRight } from "lucide-react";

const MOCK_CLIENTES = [
  { id: "cl1", nombre: "Finca La Esperanza", responsable: "Don Carlos Pérez", cultivos: ["Maíz", "Yuca"], region: "Valle del Cauca", telefono: "+57 310 123 4567", diagnosticos: 2, planesActivos: 1 },
  { id: "cl2", nombre: "Agropecuaria Boyacá SAS", responsable: "Ing. Lucía Torres", cultivos: ["Papa", "Zanahoria"], region: "Boyacá", telefono: "+57 320 234 5678", diagnosticos: 1, planesActivos: 1 },
  { id: "cl3", nombre: "AgroSoya del Meta", responsable: "Sr. Rodrigo Vargas", cultivos: ["Soya"], region: "Meta", telefono: "+57 315 345 6789", diagnosticos: 1, planesActivos: 1 },
  { id: "cl4", nombre: "Frutas del Oriente", responsable: "Dra. Paola Ríos", cultivos: ["Aguacate Hass", "Mango Tommy"], region: "Antioquia", telefono: "+57 300 456 7890", diagnosticos: 1, planesActivos: 0 },
];

export default function AsesorClientesPage() {
  const [clientes] = useState(MOCK_CLIENTES);
  const [search, setSearch] = useState("");
  const filtered = clientes.filter(c => c.nombre.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-headline-md font-bold">Mis clientes</h1>
        <p className="text-sm text-[var(--color-on-surface-variant)]">{clientes.length} clientes asignados</p>
      </div>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar cliente..." className="w-full max-w-sm border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]" />
      <div className="grid gap-3 sm:grid-cols-2">
        {filtered.map(c => (
          <div key={c.id} className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-[var(--color-agri-green)]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Users size={16} className="text-[var(--color-agri-green)]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{c.nombre}</p>
                <p className="text-xs text-[var(--color-on-surface-variant)]">{c.responsable}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {c.cultivos.map(cult => (
                <span key={cult} className="flex items-center gap-1 text-xs bg-[var(--color-agri-green)]/8 text-[var(--color-agri-green)] px-2 py-0.5 rounded-full font-medium">
                  <Leaf size={9} /> {cult}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-xs text-[var(--color-on-surface-variant)]">
              <span className="flex items-center gap-1"><MapPin size={10} /> {c.region}</span>
              <span className="flex items-center gap-1"><Phone size={10} /> {c.telefono}</span>
              <span>{c.diagnosticos} diagnóstico(s)</span>
              <span>{c.planesActivos} plan(es) activo(s)</span>
            </div>
            <div className="flex gap-2">
              <a href={`/dashboard/asesor/diagnosticos`} className="flex-1 text-center text-xs bg-[var(--color-primary)]/5 text-[var(--color-primary)] py-2 rounded-lg font-medium hover:bg-[var(--color-primary)]/10">Ver diagnósticos</a>
              <a href={`/dashboard/asesor/planes`} className="flex-1 text-center text-xs border border-[var(--color-border-subtle)] text-[var(--color-on-surface-variant)] py-2 rounded-lg hover:bg-gray-50">Ver planes</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
