"use client";

import { useState } from "react";
import { MapPin, Clock, CheckCircle, Plus, User, Calendar } from "lucide-react";

const MOCK_VISITAS = [
  { id: "v1", cliente: "Finca La Esperanza", contacto: "Don Carlos Pérez", ciudad: "Palmira, Valle", fecha: "2026-06-12", hora: "10:00", tipo: "seguimiento", status: "programada" },
  { id: "v2", cliente: "Agropecuaria Boyacá SAS", contacto: "Ing. Lucía Torres", ciudad: "Tunja, Boyacá", fecha: "2026-06-10", hora: "09:00", tipo: "presentacion", status: "realizada" },
  { id: "v3", cliente: "AgroSoya del Meta", contacto: "Sr. Rodrigo Vargas", ciudad: "Villavicencio, Meta", fecha: "2026-06-14", hora: "14:00", tipo: "cierre", status: "programada" },
  { id: "v4", cliente: "Hacienda Los Robles", contacto: "Sr. Ernesto Cárdenas", ciudad: "Manizales, Caldas", fecha: "2026-06-08", hora: "11:00", tipo: "seguimiento", status: "realizada" },
];

const TIPO_LABELS: Record<string, string> = {
  seguimiento: "Seguimiento", presentacion: "Presentación", cierre: "Cierre de negocio",
};

export default function VisitasPage() {
  const [visitas] = useState(MOCK_VISITAS);
  const [tab, setTab] = useState<"programadas" | "realizadas">("programadas");
  const filtered = visitas.filter(v => (tab === "programadas" ? v.status === "programada" : v.status === "realizada"));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-md font-bold">Visitas comerciales</h1>
          <p className="text-sm text-[var(--color-on-surface-variant)]">{visitas.filter(v => v.status === "programada").length} visitas programadas esta semana</p>
        </div>
        <button className="flex items-center gap-2 bg-[var(--color-primary)] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90">
          <Plus size={16} /> Agendar visita
        </button>
      </div>

      <div className="flex gap-2">
        {(["programadas", "realizadas"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? "bg-[var(--color-primary)] text-white" : "bg-white border border-[var(--color-border-subtle)] text-[var(--color-on-surface-variant)]"}`}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(v => (
          <div key={v.id} className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${v.status === "realizada" ? "bg-green-100" : "bg-blue-100"}`}>
                  {v.status === "realizada" ? <CheckCircle size={16} className="text-green-600" /> : <Clock size={16} className="text-blue-600" />}
                </div>
                <div>
                  <p className="font-semibold text-sm">{v.cliente}</p>
                  <p className="text-xs text-[var(--color-on-surface-variant)] flex items-center gap-1 mt-0.5"><User size={10} /> {v.contacto}</p>
                  <p className="text-xs text-[var(--color-on-surface-variant)] flex items-center gap-1"><MapPin size={10} /> {v.ciudad}</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-primary)] justify-end">
                  <Calendar size={11} /> {v.fecha}
                </div>
                <p className="text-xs text-[var(--color-on-surface-variant)]">{v.hora}</p>
                <span className="text-xs bg-[var(--color-surface-container-low)] px-2 py-0.5 rounded-full mt-1 inline-block">{TIPO_LABELS[v.tipo]}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
