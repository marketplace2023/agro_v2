"use client";

import { useState } from "react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Truck, Package, AlertTriangle, CheckCircle } from "lucide-react";

const TODAY_SHIPMENTS = [
  { id: "DESP-2024-201", orden: "ORD-2024-088", destino: "Chía, Cundinamarca", bultos: 20, peso: "1,000kg", guia: "TCC-884421", estado: "pendiente", hora: "08:00" },
  { id: "DESP-2024-202", orden: "ORD-2024-089", destino: "Zipaquirá, Cundinamarca", bultos: 40, peso: "2,000kg", guia: "TCC-884422", estado: "en_ruta", hora: "09:30" },
  { id: "DESP-2024-203", orden: "ORD-2024-090", destino: "Tunja, Boyacá", bultos: 50, peso: "950kg", guia: "TCC-884423", estado: "entregado", hora: "07:00" },
  { id: "DESP-2024-204", orden: "ORD-2024-091", destino: "Duitama, Boyacá", bultos: 8, peso: "200kg", guia: "Pendiente asignar", estado: "por_despachar", hora: "14:00" },
];

const INCIDENTS = [
  { id: "INC-2024-042", despacho: "DESP-2024-198", tipo: "retraso", descripcion: "Cierre vial en autopista Norte km 24", estado: "en_gestion", fecha: "Hoy 11:30" },
  { id: "INC-2024-041", despacho: "DESP-2024-191", tipo: "daño", descripcion: "2 sacos con humedad — producto Urea", estado: "resuelto", fecha: "Ayer 16:00" },
];

const STATUS_COLORS: Record<string, string> = {
  pendiente: "bg-yellow-100 text-yellow-700",
  en_ruta: "bg-blue-100 text-blue-700",
  entregado: "bg-green-100 text-green-700",
  por_despachar: "bg-gray-100 text-gray-600",
};

const INCIDENT_COLORS: Record<string, string> = {
  retraso: "bg-orange-100 text-orange-700",
  daño: "bg-red-100 text-red-700",
  extravío: "bg-purple-100 text-purple-700",
};

export default function LogisticaDashboard() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ orden: "", operador: "", guia: "", peso: "", temperatura: "", instrucciones: "" });

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-headline-md font-bold">Dashboard Operador Logístico</h1>
        <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">Centro de distribución Bogotá · {new Date().toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" })}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Despachos hoy" value="8" subtitle="4 completados" icon={<Truck size={20} />} color="primary" />
        <StatsCard title="En tránsito" value="24" subtitle="en 3 departamentos" icon={<Package size={20} />} color="green" />
        <StatsCard title="Incidencias abiertas" value="2" subtitle="1 en gestión" icon={<AlertTriangle size={20} />} color="red" />
        <StatsCard title="Entregados hoy" value="6" subtitle="100% sin novedad" icon={<CheckCircle size={20} />} color="orange" />
      </div>

      {/* Despachos del día */}
      <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--color-border-subtle)] flex items-center justify-between">
          <h2 className="font-semibold text-sm flex items-center gap-2"><Truck size={14} /> Despachos del día</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="text-xs bg-[var(--color-primary)] text-white px-3 py-1 rounded-full font-medium"
          >
            + Nuevo despacho
          </button>
        </div>

        {/* Formulario nuevo despacho */}
        {showForm && (
          <div className="px-5 py-4 bg-[var(--color-surface-container-low)] border-b border-[var(--color-border-subtle)]">
            <h3 className="text-xs font-semibold mb-3">Registrar nuevo despacho</h3>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { k: "orden", label: "# Orden", ph: "ORD-2024-..." },
                { k: "operador", label: "Operador logístico", ph: "TCC, Servientrega..." },
                { k: "guia", label: "Guía de transporte", ph: "Número de guía" },
                { k: "peso", label: "Peso total (kg)", ph: "Ej: 500" },
                { k: "temperatura", label: "Temperatura control", ph: "Ambiente / 2-8°C..." },
              ].map(f => (
                <label key={f.k} className="text-[10px] font-medium text-[var(--color-on-surface-variant)]">
                  {f.label}
                  <input
                    className="w-full mt-1 p-2 text-xs border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] bg-white"
                    placeholder={f.ph}
                    value={(form as Record<string, string>)[f.k]}
                    onChange={e => setForm(p => ({ ...p, [f.k]: e.target.value }))}
                  />
                </label>
              ))}
              <label className="text-[10px] font-medium text-[var(--color-on-surface-variant)] col-span-2 lg:col-span-3">
                Instrucciones especiales
                <input
                  className="w-full mt-1 p-2 text-xs border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] bg-white"
                  placeholder="Manejo especial, documentos adjuntos..."
                  value={form.instrucciones}
                  onChange={e => setForm(p => ({ ...p, instrucciones: e.target.value }))}
                />
              </label>
            </div>
            <div className="flex gap-2 mt-3">
              <button className="text-xs bg-[var(--color-primary)] text-white px-4 py-1.5 rounded-lg font-medium">Registrar despacho</button>
              <button onClick={() => setShowForm(false)} className="text-xs border border-[var(--color-border-subtle)] px-4 py-1.5 rounded-lg text-[var(--color-on-surface-variant)]">Cancelar</button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-surface-container-low)]">
              <tr>
                {["ID Despacho", "Orden", "Destino", "Bultos", "Peso", "Guía", "Hora", "Estado", "Acción"].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 text-xs font-medium text-[var(--color-on-surface-variant)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TODAY_SHIPMENTS.map((s, i) => (
                <tr key={s.id} className={`border-t border-[var(--color-border-subtle)] ${i % 2 === 0 ? "" : "bg-[var(--color-surface-container-lowest)]"}`}>
                  <td className="px-4 py-3 text-xs font-medium text-[var(--color-primary)]">{s.id}</td>
                  <td className="px-4 py-3 text-xs">{s.orden}</td>
                  <td className="px-4 py-3 text-xs">{s.destino}</td>
                  <td className="px-4 py-3 text-xs">{s.bultos}</td>
                  <td className="px-4 py-3 text-xs">{s.peso}</td>
                  <td className="px-4 py-3 text-xs font-mono text-[10px]">{s.guia}</td>
                  <td className="px-4 py-3 text-xs">{s.hora}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[s.estado]}`}>
                      {s.estado.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-[10px] text-[var(--color-primary)] border border-[var(--color-primary)] px-2 py-0.5 rounded hover:bg-[var(--color-primary)] hover:text-white transition-colors">
                      {s.estado === "por_despachar" ? "Despachar" : "Ver"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Incidencias + Prueba de entrega */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Incidencias */}
        <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--color-border-subtle)] flex items-center justify-between">
            <h2 className="font-semibold text-sm flex items-center gap-2 text-amber-700"><AlertTriangle size={14} /> Incidencias activas</h2>
            <button className="text-xs text-[var(--color-primary)] border border-[var(--color-primary)] px-3 py-1 rounded-full">Reportar incidencia</button>
          </div>
          <div className="divide-y divide-[var(--color-border-subtle)]">
            {INCIDENTS.map(inc => (
              <div key={inc.id} className="px-5 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${INCIDENT_COLORS[inc.tipo]}`}>{inc.tipo}</span>
                      <span className="text-xs font-medium">{inc.id}</span>
                    </div>
                    <p className="text-xs text-[var(--color-on-surface)]">{inc.descripcion}</p>
                    <p className="text-[10px] text-[var(--color-on-surface-variant)] mt-1">Despacho: {inc.despacho} · {inc.fecha}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 ${inc.estado === "resuelto" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                    {inc.estado.replace("_", " ")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prueba de entrega */}
        <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
          <h2 className="font-semibold text-sm mb-4 flex items-center gap-2"><CheckCircle size={14} /> Registrar prueba de entrega</h2>
          <div className="space-y-3">
            <input className="w-full p-2 text-xs border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]" placeholder="Número de despacho..." />
            <input className="w-full p-2 text-xs border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]" placeholder="Cédula del receptor..." />
            <input className="w-full p-2 text-xs border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]" placeholder="Nombre del receptor..." />
            <div className="border-2 border-dashed border-[var(--color-border-subtle)] rounded-lg p-6 text-center">
              <p className="text-xs text-[var(--color-on-surface-variant)]">📷 Adjuntar foto de entrega</p>
              <p className="text-[10px] text-[var(--color-on-surface-variant)] mt-1">o arrastrar imagen aquí</p>
            </div>
            <div className="border-2 border-dashed border-[var(--color-border-subtle)] rounded-lg p-6 text-center">
              <p className="text-xs text-[var(--color-on-surface-variant)]">✍️ Firma digital del receptor</p>
              <p className="text-[10px] text-[var(--color-on-surface-variant)] mt-1">Canvas para firma (disponible en app móvil)</p>
            </div>
            <button className="w-full text-sm bg-[var(--color-primary)] text-white py-2 rounded-lg font-medium hover:opacity-90">
              Confirmar entrega
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
