"use client";

import { useState } from "react";
import {
  FileText, Search, Download, Plus, Eye, Send,
  CheckCircle2, Clock, AlertCircle, ChevronRight,
} from "lucide-react";

const FACTURAS = [
  {
    id: "FAC-LOG-001", tipo: "Flete", concepto: "Transporte Bogotá → Valledupar",
    empresa: "Grupo Agroindustrial S.A.", operador: "Transportes Andes S.A.S.",
    envio: "RET-001", orden: "ORD-2026-122",
    subtotal: 1650000, iva: 313500, total: 1963500,
    estado: "Emitida", fecha: "2026-06-15", vence: "2026-06-18",
  },
  {
    id: "FAC-LOG-002", tipo: "Flete + Seguro", concepto: "Transporte Bogotá → Cali",
    empresa: "Tecnicaña S.A.", operador: "LogiCarga Colombia",
    envio: "RET-008", orden: "ORD-2026-118",
    subtotal: 1480000, iva: 194140, total: 1674140,
    estado: "En disputa", fecha: "2026-06-10", vence: "2026-06-13",
  },
  {
    id: "FAC-COM-001", tipo: "Comisión", concepto: "Comisión plataforma (10%) RET-001",
    empresa: "Marketplace Agro", operador: "Marketplace Agro",
    envio: "RET-001", orden: "ORD-2026-122",
    subtotal: 165000, iva: 31350, total: 196350,
    estado: "Cobrada", fecha: "2026-06-15", vence: "2026-06-15",
  },
  {
    id: "FAC-LOG-003", tipo: "Flete", concepto: "Transporte Medellín → Bucaramanga",
    empresa: "Finca Las Palmas", operador: "Fletes Nacionales Ltda.",
    envio: "RET-005", orden: "ORD-2026-109",
    subtotal: 2100000, iva: 275190, total: 2375190,
    estado: "Pagada", fecha: "2026-06-08", vence: "2026-06-11",
  },
  {
    id: "FAC-LOG-004", tipo: "Flete", concepto: "Transporte Bogotá → Tunja",
    empresa: "Cooperativa Boyacá Agro", operador: "Transportes Andes S.A.S.",
    envio: "RET-003", orden: "ORD-2026-101",
    subtotal: 750000, iva: 142500, total: 892500,
    estado: "Pagada", fecha: "2026-06-07", vence: "2026-06-10",
  },
  {
    id: "FAC-LOG-005", tipo: "Flete", concepto: "Transporte Barranquilla → Montería",
    empresa: "Palmas del Norte", operador: "Transportadora Caribe",
    envio: "RET-006", orden: "ORD-2026-112",
    subtotal: 1200000, iva: 228000, total: 1428000,
    estado: "Pendiente", fecha: "2026-06-12", vence: "2026-06-16",
  },
];

const TIPOS = ["Todas", "Flete", "Comisión", "Flete + Seguro"];
const ESTADOS = ["Todos", "Emitida", "Pendiente", "En disputa", "Pagada", "Cobrada"];

const ESTADO_COLOR: Record<string, string> = {
  Emitida: "bg-blue-100 text-blue-700",
  Pendiente: "bg-amber-100 text-amber-700",
  "En disputa": "bg-red-100 text-red-700",
  Pagada: "bg-green-100 text-green-700",
  Cobrada: "bg-green-100 text-green-700",
};

function EstadoIcon({ e }: { e: string }) {
  if (e === "Pagada" || e === "Cobrada") return <CheckCircle2 size={13} className="text-green-500" />;
  if (e === "En disputa") return <AlertCircle size={13} className="text-red-500" />;
  return <Clock size={13} className="text-amber-500" />;
}

const fmt = (n: number) => `$${n.toLocaleString("es-CO")}`;

export default function FacturasPage() {
  const [busqueda, setBusqueda] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("Todas");
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");

  const filtradas = FACTURAS.filter((f) => {
    const texto = f.empresa.toLowerCase().includes(busqueda.toLowerCase()) ||
      f.id.toLowerCase().includes(busqueda.toLowerCase()) ||
      f.operador.toLowerCase().includes(busqueda.toLowerCase());
    const tipo = tipoFiltro === "Todas" || f.tipo === tipoFiltro;
    const estado = estadoFiltro === "Todos" || f.estado === estadoFiltro;
    return texto && tipo && estado;
  });

  const totalFiltrado = filtradas.reduce((s, f) => s + f.total, 0);

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-md font-bold flex items-center gap-2">
            <FileText size={22} /> Facturas de flete y comisiones
          </h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">
            {FACTURAS.filter(f => ["Emitida", "Pendiente"].includes(f.estado)).length} pendientes · {FACTURAS.length} total
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 text-sm border border-[var(--color-border-subtle)] px-3 py-2 rounded-lg hover:bg-[var(--color-surface-container)] transition-colors text-[var(--color-on-surface-variant)]">
            <Download size={13} /> Exportar
          </button>
          <button className="flex items-center gap-2 text-sm bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
            <Plus size={15} /> Nueva factura
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Emitidas", valor: FACTURAS.filter(f => f.estado === "Emitida").length, sub: fmt(FACTURAS.filter(f => f.estado === "Emitida").reduce((s, f) => s + f.total, 0)), color: "text-blue-600" },
          { label: "Pendientes", valor: FACTURAS.filter(f => f.estado === "Pendiente").length, sub: fmt(FACTURAS.filter(f => f.estado === "Pendiente").reduce((s, f) => s + f.total, 0)), color: "text-amber-600" },
          { label: "En disputa", valor: FACTURAS.filter(f => f.estado === "En disputa").length, sub: fmt(FACTURAS.filter(f => f.estado === "En disputa").reduce((s, f) => s + f.total, 0)), color: "text-red-600" },
          { label: "Pagadas/Cobradas", valor: FACTURAS.filter(f => ["Pagada", "Cobrada"].includes(f.estado)).length, sub: fmt(FACTURAS.filter(f => ["Pagada", "Cobrada"].includes(f.estado)).reduce((s, f) => s + f.total, 0)), color: "text-green-600" },
        ].map((k) => (
          <div key={k.label} className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-4">
            <p className={`text-2xl font-bold ${k.color}`}>{k.valor}</p>
            <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{k.label}</p>
            <p className="text-[10px] font-semibold mt-1">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]" />
          <input
            type="text"
            placeholder="Buscar por empresa, operador o ID..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-20"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {TIPOS.map((t) => (
            <button key={t} onClick={() => setTipoFiltro(t)}
              className={`text-xs px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${tipoFiltro === t ? "bg-[var(--color-primary)] text-white" : "border border-[var(--color-border-subtle)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)]"}`}>
              {t}
            </button>
          ))}
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

      {/* Tabla */}
      <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-container)]">
              <tr>
                {["Factura", "Concepto", "Empresa / Operador", "Subtotal", "IVA", "Total", "Estado", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-on-surface-variant)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-subtle)]">
              {filtradas.map((f) => (
                <tr key={f.id} className="hover:bg-[var(--color-surface-container)] hover:bg-opacity-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-mono text-xs font-bold">{f.id}</p>
                    <p className="text-[10px] text-[var(--color-on-surface-variant)]">{f.fecha}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs font-medium">{f.concepto}</p>
                    <p className="text-[10px] text-[var(--color-on-surface-variant)]">{f.orden} · {f.envio}</p>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <p className="font-medium">{f.empresa}</p>
                    <p className="text-[var(--color-on-surface-variant)]">{f.operador}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-right">{fmt(f.subtotal)}</td>
                  <td className="px-4 py-3 text-xs text-right text-[var(--color-on-surface-variant)]">{fmt(f.iva)}</td>
                  <td className="px-4 py-3 text-right">
                    <p className="text-sm font-bold">{fmt(f.total)}</p>
                    <p className="text-[10px] text-[var(--color-on-surface-variant)]">Vence {f.vence}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <EstadoIcon e={f.estado} />
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${ESTADO_COLOR[f.estado]}`}>{f.estado}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 justify-end">
                      <button className="p-1.5 rounded-lg hover:bg-[var(--color-surface-container)] transition-colors text-[var(--color-on-surface-variant)]" title="Ver">
                        <Eye size={13} />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-[var(--color-surface-container)] transition-colors text-[var(--color-on-surface-variant)]" title="Descargar">
                        <Download size={13} />
                      </button>
                      {f.estado === "Emitida" && (
                        <button className="p-1.5 rounded-lg hover:bg-[var(--color-surface-container)] transition-colors text-[var(--color-primary)]" title="Enviar">
                          <Send size={13} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtradas.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-10 text-center text-sm text-[var(--color-on-surface-variant)]">Sin resultados</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-container)] flex justify-between text-xs">
          <span className="text-[var(--color-on-surface-variant)]">{filtradas.length} facturas</span>
          <span className="font-bold">Total: {fmt(totalFiltrado)}</span>
        </div>
      </div>
    </div>
  );
}
