"use client";

import { useState } from "react";
import { Plus, MapPin, Truck, Clock, Package, CheckCircle, Edit2, Route } from "lucide-react";

interface Stop { address: string; orderNum: string; company: string; estimatedTime: string; status: "pendiente" | "completado" | "en_camino" }
interface Route { id: string; name: string; driver: string; vehicle: string; date: string; stops: Stop[]; status: "planificada" | "en_progreso" | "completada" }

const MOCK_ROUTES: Route[] = [
  {
    id: "r1", name: "Ruta Sabana - Occidente", driver: "Jhon García", vehicle: "JMK-456 (Camión 5T)", date: "2026-06-10", status: "en_progreso",
    stops: [
      { address: "Cra 45 #78-23, Zona Industrial, Bogotá", orderNum: "ORD-2026-4521", company: "Agro Finca La Esperanza", estimatedTime: "09:00", status: "completado" },
      { address: "Km 12 Vía Palmira, Cali", orderNum: "ORD-2026-4498", company: "Hacienda El Palmar SAS", estimatedTime: "14:00", status: "en_camino" },
      { address: "Av. Industrial 45, Barranquilla", orderNum: "ORD-2026-4445", company: "Agroinsumos Norte SRL", estimatedTime: "18:00", status: "pendiente" },
    ]
  },
  {
    id: "r2", name: "Ruta Costa Atlántica", driver: "María Suárez", vehicle: "HJK-789 (Camioneta 2T)", date: "2026-06-11", status: "planificada",
    stops: [
      { address: "Calle 50 #34-12, Cartagena", orderNum: "ORD-2026-4390", company: "AgroCaribe SAS", estimatedTime: "08:30", status: "pendiente" },
      { address: "Vía Principal Km 8, Santa Marta", orderNum: "ORD-2026-4401", company: "Frutas del Caribe", estimatedTime: "13:00", status: "pendiente" },
    ]
  },
];

export default function RutasPage() {
  const [routes, setRoutes] = useState(MOCK_ROUTES);
  const [showForm, setShowForm] = useState(false);

  const STATUS_CFG = {
    planificada: { label: "Planificada", color: "bg-blue-100 text-blue-700" },
    en_progreso: { label: "En progreso", color: "bg-yellow-100 text-yellow-700" },
    completada: { label: "Completada", color: "bg-green-100 text-green-700" },
  };

  const STOP_CFG = {
    pendiente: { label: "Pendiente", color: "text-gray-400", bg: "bg-gray-100" },
    en_camino: { label: "En camino", color: "text-blue-600", bg: "bg-blue-100" },
    completado: { label: "Completado", color: "text-green-700", bg: "bg-green-100" },
  };

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-center justify-between">
        <div><h1 className="text-headline-md font-bold">Rutas de Despacho</h1><p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">Planificación y seguimiento de rutas</p></div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-[var(--color-primary)] text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:opacity-90"><Plus size={15} /> Nueva ruta</button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[{ label: "Rutas hoy", value: routes.filter(r => r.date === "2026-06-10").length, color: "text-[var(--color-primary)]" }, { label: "En progreso", value: routes.filter(r => r.status === "en_progreso").length, color: "text-yellow-600" }, { label: "Paradas totales", value: routes.reduce((s, r) => s + r.stops.length, 0), color: "text-blue-600" }].map(k => (
          <div key={k.label} className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4"><p className={`text-2xl font-bold ${k.color}`}>{k.value}</p><p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{k.label}</p></div>
        ))}
      </div>

      <div className="space-y-4">
        {routes.map(route => {
          const cfg = STATUS_CFG[route.status];
          const completed = route.stops.filter(s => s.status === "completado").length;
          return (
            <div key={route.id} className="bg-white border border-[var(--color-border-subtle)] rounded-xl overflow-hidden">
              <div className="px-5 py-4 flex items-center gap-4 border-b border-[var(--color-border-subtle)]">
                <div className="p-2 bg-[var(--color-surface-container-low)] rounded-lg flex-shrink-0"><Route size={16} className="text-[var(--color-primary)]" /></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap"><span className="font-bold text-sm">{route.name}</span><span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cfg.color}`}>{cfg.label}</span></div>
                  <div className="flex gap-4 mt-0.5 text-xs text-[var(--color-on-surface-variant)]">
                    <span className="flex items-center gap-1"><Truck size={11} />{route.driver}</span>
                    <span className="flex items-center gap-1"><Package size={11} />{route.vehicle}</span>
                    <span className="flex items-center gap-1"><Clock size={11} />{route.date}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold">{completed}/{route.stops.length}</p>
                  <p className="text-xs text-[var(--color-on-surface-variant)]">paradas</p>
                </div>
                <button className="p-1.5 hover:bg-gray-100 rounded-lg text-[var(--color-primary)]"><Edit2 size={14} /></button>
              </div>
              <div className="px-5 py-3">
                <div className="space-y-2">
                  {route.stops.map((stop, i) => {
                    const scfg = STOP_CFG[stop.status];
                    return (
                      <div key={i} className="flex items-start gap-3">
                        <div className="flex flex-col items-center flex-shrink-0 mt-0.5">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${scfg.bg} ${scfg.color}`}>{i + 1}</div>
                          {i < route.stops.length - 1 && <div className="w-px h-6 bg-[var(--color-border-subtle)]" />}
                        </div>
                        <div className="flex-1 min-w-0 pb-2">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-xs font-semibold">{stop.company}</p>
                              <p className="text-xs text-[var(--color-on-surface-variant)]">{stop.orderNum}</p>
                              <div className="flex items-center gap-1 mt-0.5"><MapPin size={10} className="text-[var(--color-on-surface-variant)] flex-shrink-0" /><p className="text-xs text-[var(--color-on-surface-variant)] truncate">{stop.address}</p></div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="text-xs font-medium">{stop.estimatedTime}</p>
                              <span className={`text-xs font-medium ${scfg.color}`}>{scfg.label}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <h3 className="font-bold text-base">Nueva ruta</h3>
            <div className="space-y-3">
              {[["Nombre de la ruta", "text"], ["Conductor asignado", "text"], ["Vehículo / placa", "text"], ["Fecha", "date"]].map(([label, type]) => (
                <div key={String(label)}><label className="block text-sm font-medium mb-1">{label}</label><input type={type} className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]" /></div>
              ))}
            </div>
            <div className="flex gap-3"><button onClick={() => setShowForm(false)} className="flex-1 border border-[var(--color-border-subtle)] text-sm font-medium py-2 rounded-lg">Cancelar</button><button onClick={() => setShowForm(false)} className="flex-1 bg-[var(--color-primary)] text-white text-sm font-semibold py-2 rounded-lg">Crear</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
