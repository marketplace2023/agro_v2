"use client";

import { useState } from "react";
import {
  AlertCircle, Plus, Search, ChevronRight, Truck,
  Clock, CheckCircle2, XCircle, Package,
} from "lucide-react";
import Link from "next/link";

const INCIDENCIAS = [
  {
    id: "INC-001", tipo: "Daño en carga", envio: "RET-008", orden: "ORD-2026-118",
    empresa: "Tecnicaña S.A.", ruta: "Bogotá → Cali",
    fecha: "2026-06-10", horaReporte: "18:42",
    descripcion: "5 bultos de fertilizante con rotura en la costura. Humedad detectada en la parte inferior de la estiba.",
    estado: "En revisión", prioridad: "Alta",
    operador: "LogiCarga Colombia", asignadoA: "Carlos Jiménez",
    resolucion: null,
  },
  {
    id: "INC-002", tipo: "Demora en entrega", envio: "RET-005", orden: "ORD-2026-109",
    empresa: "Finca Las Palmas", ruta: "Medellín → Bucaramanga",
    fecha: "2026-06-08", horaReporte: "09:15",
    descripcion: "El vehículo llegó 6 horas después del plazo acordado sin notificación previa.",
    estado: "Resuelta", prioridad: "Media",
    operador: "Fletes Nacionales Ltda.", asignadoA: "Sandra Mora",
    resolucion: "Se aplicó descuento del 5% al flete según cláusula de garantía del contrato.",
  },
  {
    id: "INC-003", tipo: "Documentación incorrecta", envio: "RET-003", orden: "ORD-2026-101",
    empresa: "Cooperativa Boyacá Agro", ruta: "Bogotá → Tunja",
    fecha: "2026-06-05", horaReporte: "11:30",
    descripcion: "El manifiesto de carga no incluía la ficha técnica de productos agroquímicos requerida para el paso por puesto de control.",
    estado: "Resuelta", prioridad: "Baja",
    operador: "Transportes Andes S.A.S.", asignadoA: "Pedro López",
    resolucion: "Se enviaron documentos corregidos por correo. Sin impacto en entrega.",
  },
  {
    id: "INC-004", tipo: "Vehículo averiado", envio: "RET-010", orden: "ORD-2026-125",
    empresa: "AgroValle S.A.S.", ruta: "Bogotá → Valledupar",
    fecha: "2026-06-11", horaReporte: "07:08",
    descripcion: "Vehículo reportó falla mecánica en autopista a 250 km del destino. Carga detenida.",
    estado: "Crítica", prioridad: "Alta",
    operador: "Fletes Nacionales Ltda.", asignadoA: null,
    resolucion: null,
  },
  {
    id: "INC-005", tipo: "Pérdida parcial", envio: "RET-007", orden: "ORD-2026-114",
    empresa: "Palmas del Norte", ruta: "Barranquilla → Montería",
    fecha: "2026-06-09", horaReporte: "16:55",
    descripcion: "3 sacos no fueron entregados. Conductor alega que fueron retirados en punto de cargue por error.",
    estado: "En investigación", prioridad: "Alta",
    operador: "Transportadora Caribe", asignadoA: "Andrea Restrepo",
    resolucion: null,
  },
];

const TIPOS = ["Todos", "Daño en carga", "Demora en entrega", "Documentación incorrecta", "Vehículo averiado", "Pérdida parcial"];
const ESTADOS = ["Todos", "Crítica", "En revisión", "En investigación", "Resuelta"];

const ESTADO_COLOR: Record<string, string> = {
  Crítica: "bg-red-100 text-red-700",
  "En revisión": "bg-amber-100 text-amber-700",
  "En investigación": "bg-violet-100 text-violet-700",
  Resuelta: "bg-green-100 text-green-700",
};

const PRIORIDAD_COLOR: Record<string, string> = {
  Alta: "text-red-600",
  Media: "text-amber-600",
  Baja: "text-slate-500",
};

function EstadoIcon({ e }: { e: string }) {
  if (e === "Resuelta") return <CheckCircle2 size={14} className="text-green-500" />;
  if (e === "Crítica") return <XCircle size={14} className="text-red-600" />;
  return <AlertCircle size={14} className="text-amber-500" />;
}

export default function IncidenciasPage() {
  const [busqueda, setBusqueda] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("Todos");
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");
  const [showForm, setShowForm] = useState(false);
  const [formTipo, setFormTipo] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formEnvio, setFormEnvio] = useState("");

  const filtradas = INCIDENCIAS.filter((i) => {
    const texto = i.empresa.toLowerCase().includes(busqueda.toLowerCase()) ||
      i.id.toLowerCase().includes(busqueda.toLowerCase()) ||
      i.ruta.toLowerCase().includes(busqueda.toLowerCase());
    const tipo = tipoFiltro === "Todos" || i.tipo === tipoFiltro;
    const estado = estadoFiltro === "Todos" || i.estado === estadoFiltro;
    return texto && tipo && estado;
  });

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-md font-bold flex items-center gap-2">
            <AlertCircle size={22} /> Incidencias logísticas
          </h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">
            {INCIDENCIAS.filter(i => i.estado !== "Resuelta").length} activas · {INCIDENCIAS.length} total
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 text-sm bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus size={15} /> Reportar incidencia
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Críticas", valor: INCIDENCIAS.filter(i => i.estado === "Crítica").length, color: "text-red-600" },
          { label: "En revisión", valor: INCIDENCIAS.filter(i => ["En revisión", "En investigación"].includes(i.estado)).length, color: "text-amber-600" },
          { label: "Resueltas", valor: INCIDENCIAS.filter(i => i.estado === "Resuelta").length, color: "text-green-600" },
          { label: "Total este mes", valor: INCIDENCIAS.length, color: "text-[var(--color-primary)]" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-4">
            <p className={`text-2xl font-bold ${s.color}`}>{s.valor}</p>
            <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]" />
          <input
            type="text"
            placeholder="Buscar por empresa, ID o ruta..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-20"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {ESTADOS.map((e) => (
            <button key={e} onClick={() => setEstadoFiltro(e)}
              className={`text-xs px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${estadoFiltro === e ? "bg-[var(--color-primary)] text-white" : "border border-[var(--color-border-subtle)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)]"}`}>
              {e}
            </button>
          ))}
        </div>
      </div>

      {/* Lista */}
      <div className="space-y-3">
        {filtradas.map((inc) => (
          <div key={inc.id} className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-start gap-2">
                <EstadoIcon e={inc.estado} />
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="font-bold text-sm font-mono">{inc.id}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${ESTADO_COLOR[inc.estado]}`}>{inc.estado}</span>
                    <span className={`text-[10px] font-semibold ${PRIORIDAD_COLOR[inc.prioridad]}`}>● {inc.prioridad}</span>
                  </div>
                  <p className="text-xs font-medium text-[var(--color-on-surface-variant)]">{inc.tipo}</p>
                </div>
              </div>
              <div className="text-right shrink-0 text-[10px] text-[var(--color-on-surface-variant)]">
                <p>{inc.fecha}</p>
                <p>{inc.horaReporte}</p>
              </div>
            </div>

            <p className="text-xs text-[var(--color-on-surface-variant)] mb-3 line-clamp-2">{inc.descripcion}</p>

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-[var(--color-on-surface-variant)] mb-3">
              <span className="flex items-center gap-1"><Truck size={9} />{inc.operador}</span>
              <span className="flex items-center gap-1"><Package size={9} />{inc.envio} · {inc.orden}</span>
              <span>{inc.ruta}</span>
              {inc.asignadoA && <span className="flex items-center gap-1"><Clock size={9} />Asignado a {inc.asignadoA}</span>}
            </div>

            {inc.resolucion && (
              <div className="bg-green-50 border border-green-100 rounded-lg px-3 py-2 text-[10px] text-green-700 mb-3">
                <span className="font-semibold">Resolución:</span> {inc.resolucion}
              </div>
            )}

            <div className="flex justify-end">
              <button className="flex items-center gap-1 text-xs text-[var(--color-primary)] hover:underline">
                Ver detalle <ChevronRight size={12} />
              </button>
            </div>
          </div>
        ))}
        {filtradas.length === 0 && (
          <div className="py-10 text-center text-sm text-[var(--color-on-surface-variant)] bg-white rounded-xl border border-[var(--color-border-subtle)]">
            No hay incidencias con ese filtro
          </div>
        )}
      </div>

      {/* Modal form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-base">Reportar incidencia</h2>
              <button onClick={() => setShowForm(false)} className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors"><XCircle size={20} /></button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-[var(--color-on-surface-variant)] mb-1 block">ID de envío o retiro *</label>
                <input value={formEnvio} onChange={e => setFormEnvio(e.target.value)} placeholder="RET-001 o TRK-2026-..." className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-20" />
              </div>
              <div>
                <label className="text-xs text-[var(--color-on-surface-variant)] mb-1 block">Tipo de incidencia *</label>
                <select value={formTipo} onChange={e => setFormTipo(e.target.value)} className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-20">
                  <option value="">Seleccionar tipo...</option>
                  {TIPOS.filter(t => t !== "Todos").map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-[var(--color-on-surface-variant)] mb-1 block">Descripción detallada *</label>
                <textarea rows={3} value={formDesc} onChange={e => setFormDesc(e.target.value)} placeholder="Describe la incidencia con el mayor detalle posible..." className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-20" />
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowForm(false)} className="flex-1 border border-[var(--color-border-subtle)] rounded-lg py-2.5 text-sm text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)] transition-colors">
                Cancelar
              </button>
              <button
                disabled={!formTipo || !formDesc || !formEnvio}
                onClick={() => setShowForm(false)}
                className="flex-1 bg-[var(--color-primary)] text-white rounded-lg py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40"
              >
                Reportar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
