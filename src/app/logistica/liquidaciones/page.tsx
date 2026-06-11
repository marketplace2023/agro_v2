"use client";

import { useState } from "react";
import {
  DollarSign, Search, ChevronRight, Truck, CheckCircle2,
  Clock, AlertCircle, Download, Eye, Filter,
} from "lucide-react";

const LIQUIDACIONES = [
  {
    id: "LIQ-001", envio: "RET-001", orden: "ORD-2026-122",
    operador: "Transportes Andes S.A.S.", empresa: "Grupo Agroindustrial S.A.",
    ruta: "Bogotá → Valledupar",
    fechaEntrega: "2026-06-15", fechaLiquidacion: null,
    fleteBase: 1650000, descuento: 0, iva: 313500, total: 1963500,
    pagado: 0, saldo: 1963500,
    estado: "Pendiente pago", diasVencimiento: 3,
  },
  {
    id: "LIQ-002", envio: "RET-008", orden: "ORD-2026-118",
    operador: "LogiCarga Colombia", empresa: "Tecnicaña S.A.",
    ruta: "Bogotá → Cali",
    fechaEntrega: "2026-06-10", fechaLiquidacion: null,
    fleteBase: 1480000, descuento: 74000, iva: 268140, total: 1674140,
    pagado: 0, saldo: 1674140,
    estado: "En disputa", diasVencimiento: -1,
  },
  {
    id: "LIQ-003", envio: "RET-005", orden: "ORD-2026-109",
    operador: "Fletes Nacionales Ltda.", empresa: "Finca Las Palmas",
    ruta: "Medellín → Bucaramanga",
    fechaEntrega: "2026-06-08", fechaLiquidacion: "2026-06-09",
    fleteBase: 2100000, descuento: 105000, iva: 380190, total: 2375190,
    pagado: 2375190, saldo: 0,
    estado: "Pagada", diasVencimiento: 0,
  },
  {
    id: "LIQ-004", envio: "RET-003", orden: "ORD-2026-101",
    operador: "Transportes Andes S.A.S.", empresa: "Cooperativa Boyacá Agro",
    ruta: "Bogotá → Tunja",
    fechaEntrega: "2026-06-05", fechaLiquidacion: "2026-06-07",
    fleteBase: 750000, descuento: 0, iva: 142500, total: 892500,
    pagado: 892500, saldo: 0,
    estado: "Pagada", diasVencimiento: 0,
  },
  {
    id: "LIQ-005", envio: "RET-006", orden: "ORD-2026-112",
    operador: "Transportadora Caribe", empresa: "Palmas del Norte",
    ruta: "Barranquilla → Montería",
    fechaEntrega: "2026-06-12", fechaLiquidacion: null,
    fleteBase: 1200000, descuento: 0, iva: 228000, total: 1428000,
    pagado: 0, saldo: 1428000,
    estado: "En procesamiento", diasVencimiento: 5,
  },
];

const ESTADO_COLOR: Record<string, string> = {
  "Pendiente pago": "bg-amber-100 text-amber-700",
  "En procesamiento": "bg-blue-100 text-blue-600",
  "En disputa": "bg-red-100 text-red-700",
  Pagada: "bg-green-100 text-green-700",
};

const ESTADOS = ["Todas", "Pendiente pago", "En procesamiento", "En disputa", "Pagada"];

const fmt = (n: number) => `$${n.toLocaleString("es-CO")}`;

export default function LiquidacionesPage() {
  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("Todas");

  const filtradas = LIQUIDACIONES.filter((l) => {
    const texto = l.operador.toLowerCase().includes(busqueda.toLowerCase()) ||
      l.empresa.toLowerCase().includes(busqueda.toLowerCase()) ||
      l.id.toLowerCase().includes(busqueda.toLowerCase());
    const estado = estadoFiltro === "Todas" || l.estado === estadoFiltro;
    return texto && estado;
  });

  const totalPendiente = LIQUIDACIONES.filter(l => l.saldo > 0 && l.estado !== "En disputa").reduce((s, l) => s + l.saldo, 0);
  const totalPagado = LIQUIDACIONES.filter(l => l.estado === "Pagada").reduce((s, l) => s + l.pagado, 0);
  const enDisputa = LIQUIDACIONES.filter(l => l.estado === "En disputa").reduce((s, l) => s + l.saldo, 0);

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-md font-bold flex items-center gap-2">
            <DollarSign size={22} /> Liquidaciones de flete
          </h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">
            {LIQUIDACIONES.filter(l => l.saldo > 0).length} con saldo pendiente · {LIQUIDACIONES.length} total
          </p>
        </div>
        <button className="flex items-center gap-2 text-sm border border-[var(--color-border-subtle)] px-4 py-2 rounded-lg hover:bg-[var(--color-surface-container)] transition-colors text-[var(--color-on-surface-variant)]">
          <Download size={15} /> Exportar
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
          <p className="text-xs text-[var(--color-on-surface-variant)] mb-1 flex items-center gap-1"><Clock size={11} />Saldo por pagar</p>
          <p className="text-2xl font-bold text-amber-600">{fmt(totalPendiente)}</p>
          <p className="text-[10px] text-[var(--color-on-surface-variant)] mt-0.5">{LIQUIDACIONES.filter(l => l.saldo > 0 && l.estado !== "En disputa").length} liquidaciones</p>
        </div>
        <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
          <p className="text-xs text-[var(--color-on-surface-variant)] mb-1 flex items-center gap-1"><CheckCircle2 size={11} />Pagado este mes</p>
          <p className="text-2xl font-bold text-green-600">{fmt(totalPagado)}</p>
          <p className="text-[10px] text-[var(--color-on-surface-variant)] mt-0.5">{LIQUIDACIONES.filter(l => l.estado === "Pagada").length} liquidaciones</p>
        </div>
        <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
          <p className="text-xs text-[var(--color-on-surface-variant)] mb-1 flex items-center gap-1"><AlertCircle size={11} />En disputa</p>
          <p className="text-2xl font-bold text-red-600">{fmt(enDisputa)}</p>
          <p className="text-[10px] text-[var(--color-on-surface-variant)] mt-0.5">{LIQUIDACIONES.filter(l => l.estado === "En disputa").length} liquidaciones</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]" />
          <input
            type="text"
            placeholder="Buscar por operador, empresa o ID..."
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

      {/* Tabla */}
      <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-[var(--color-surface-container)] border-b border-[var(--color-border-subtle)]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-on-surface-variant)]">Liquidación</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-on-surface-variant)]">Operador / Empresa</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-on-surface-variant)]">Ruta</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-[var(--color-on-surface-variant)]">Total</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-[var(--color-on-surface-variant)]">Saldo</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-[var(--color-on-surface-variant)]">Estado</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-subtle)]">
              {filtradas.map((l) => (
                <tr key={l.id} className="hover:bg-[var(--color-surface-container)] hover:bg-opacity-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-bold font-mono text-xs">{l.id}</p>
                    <p className="text-[10px] text-[var(--color-on-surface-variant)]">{l.orden} · {l.envio}</p>
                    <p className="text-[10px] text-[var(--color-on-surface-variant)]">Entrega: {l.fechaEntrega}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-start gap-1.5">
                      <Truck size={11} className="text-[var(--color-on-surface-variant)] mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-medium">{l.operador}</p>
                        <p className="text-[10px] text-[var(--color-on-surface-variant)]">{l.empresa}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-[var(--color-on-surface-variant)]">{l.ruta}</td>
                  <td className="px-4 py-3 text-right">
                    <p className="text-xs font-semibold">{fmt(l.total)}</p>
                    {l.descuento > 0 && <p className="text-[10px] text-green-600">−{fmt(l.descuento)} desc.</p>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <p className={`text-xs font-bold ${l.saldo > 0 ? "text-amber-600" : "text-green-600"}`}>
                      {l.saldo > 0 ? fmt(l.saldo) : "Saldada"}
                    </p>
                    {l.diasVencimiento > 0 && <p className="text-[10px] text-[var(--color-on-surface-variant)]">Vence en {l.diasVencimiento}d</p>}
                    {l.diasVencimiento < 0 && <p className="text-[10px] text-red-600">Vencida</p>}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${ESTADO_COLOR[l.estado]}`}>{l.estado}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 justify-end">
                      <button className="p-1.5 rounded-lg hover:bg-[var(--color-surface-container)] transition-colors text-[var(--color-on-surface-variant)]">
                        <Eye size={13} />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-[var(--color-surface-container)] transition-colors text-[var(--color-on-surface-variant)]">
                        <Download size={13} />
                      </button>
                      {["Pendiente pago", "En procesamiento"].includes(l.estado) && (
                        <button className="px-2 py-1 bg-[var(--color-primary)] text-white rounded-lg text-[10px] font-medium hover:opacity-90 transition-opacity whitespace-nowrap">
                          Pagar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtradas.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-[var(--color-on-surface-variant)]">
                    No hay liquidaciones con ese filtro
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resumen financiero */}
      <div className="bg-[var(--color-surface-container)] rounded-xl p-4">
        <div className="flex flex-wrap justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-[var(--color-on-surface-variant)]">
            <Filter size={11} />
            <span>Mostrando {filtradas.length} de {LIQUIDACIONES.length} liquidaciones</span>
          </div>
          <div className="flex gap-6 font-semibold">
            <span>Total filtrado: <span className="text-[var(--color-primary)]">{fmt(filtradas.reduce((s, l) => s + l.total, 0))}</span></span>
            <span>Saldo filtrado: <span className="text-amber-600">{fmt(filtradas.reduce((s, l) => s + l.saldo, 0))}</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}
