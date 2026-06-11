"use client";

import { useState } from "react";
import { TrendingUp, Search, Download, ChevronRight, BarChart2, DollarSign } from "lucide-react";

const COMISIONES = [
  {
    id: "COM-001", tipo: "Comisión logística", operacion: "Flete RET-001",
    empresa: "Transportes Andes S.A.S.", comprador: "Grupo Agroindustrial S.A.",
    montoBase: 1650000, porcentaje: 10, comision: 165000, iva: 31350, total: 196350,
    estado: "Cobrada", fecha: "2026-06-15", factura: "FAC-COM-001",
  },
  {
    id: "COM-002", tipo: "Comisión venta", operacion: "Orden ORD-2026-122",
    empresa: "DistAgroMax S.A.S.", comprador: "Grupo Agroindustrial S.A.",
    montoBase: 15600000, porcentaje: 2, comision: 312000, iva: 59280, total: 371280,
    estado: "Por cobrar", fecha: "2026-06-15", factura: null,
  },
  {
    id: "COM-003", tipo: "Comisión logística", operacion: "Flete RET-005",
    empresa: "Fletes Nacionales Ltda.", comprador: "Finca Las Palmas",
    montoBase: 2100000, porcentaje: 10, comision: 210000, iva: 39900, total: 249900,
    estado: "Cobrada", fecha: "2026-06-08", factura: "FAC-COM-003",
  },
  {
    id: "COM-004", tipo: "Comisión venta", operacion: "Orden ORD-2026-119",
    empresa: "Tecnicaña S.A.", comprador: "Cooperativa Boyacá Agro",
    montoBase: 8900000, porcentaje: 2, comision: 178000, iva: 33820, total: 211820,
    estado: "Por cobrar", fecha: "2026-06-10", factura: null,
  },
  {
    id: "COM-005", tipo: "Comisión logística", operacion: "Flete RET-003",
    empresa: "Transportes Andes S.A.S.", comprador: "Cooperativa Boyacá Agro",
    montoBase: 750000, porcentaje: 10, comision: 75000, iva: 14250, total: 89250,
    estado: "Cobrada", fecha: "2026-06-07", factura: "FAC-COM-005",
  },
];

const TIPOS = ["Todas", "Comisión logística", "Comisión venta"];
const ESTADOS = ["Todos", "Por cobrar", "Cobrada"];

const ESTADO_COLOR: Record<string, string> = {
  "Por cobrar": "bg-amber-100 text-amber-700",
  Cobrada: "bg-green-100 text-green-700",
};

const fmt = (n: number) => `$${n.toLocaleString("es-CO")}`;

const TASAS = [
  { concepto: "Comisión logística (operadores)", tasa: "10%", aplica: "Sobre valor del flete neto" },
  { concepto: "Comisión de venta (vendedor)", tasa: "2%", aplica: "Sobre valor de la orden sin IVA" },
  { concepto: "Comisión suscripción premium", tasa: "0.5%", aplica: "Adicional para suscriptores Premium" },
];

export default function ComisionesPage() {
  const [busqueda, setBusqueda] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("Todas");
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");

  const filtradas = COMISIONES.filter((c) => {
    const texto = c.empresa.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.id.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.comprador.toLowerCase().includes(busqueda.toLowerCase());
    const tipo = tipoFiltro === "Todas" || c.tipo === tipoFiltro;
    const estado = estadoFiltro === "Todos" || c.estado === estadoFiltro;
    return texto && tipo && estado;
  });

  const totalComisiones = filtradas.reduce((s, c) => s + c.comision, 0);
  const totalCobrado = filtradas.filter(c => c.estado === "Cobrada").reduce((s, c) => s + c.total, 0);
  const totalPorCobrar = filtradas.filter(c => c.estado === "Por cobrar").reduce((s, c) => s + c.total, 0);

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-md font-bold flex items-center gap-2">
            <TrendingUp size={22} /> Comisiones
          </h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">
            Ingresos por comisiones de la plataforma · Junio 2026
          </p>
        </div>
        <button className="flex items-center gap-1.5 text-sm border border-[var(--color-border-subtle)] px-3 py-2 rounded-lg hover:bg-[var(--color-surface-container)] transition-colors text-[var(--color-on-surface-variant)]">
          <Download size={13} /> Exportar
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
          <div className="flex items-center gap-2 mb-2">
            <BarChart2 size={16} className="text-[var(--color-primary)]" />
            <p className="text-xs text-[var(--color-on-surface-variant)]">Total comisiones (base)</p>
          </div>
          <p className="text-2xl font-bold text-[var(--color-primary)]">{fmt(totalComisiones)}</p>
          <p className="text-[10px] text-[var(--color-on-surface-variant)] mt-0.5">{filtradas.length} operaciones</p>
        </div>
        <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={16} className="text-green-600" />
            <p className="text-xs text-[var(--color-on-surface-variant)]">Cobrado + IVA</p>
          </div>
          <p className="text-2xl font-bold text-green-600">{fmt(totalCobrado)}</p>
        </div>
        <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-amber-600" />
            <p className="text-xs text-[var(--color-on-surface-variant)]">Por cobrar + IVA</p>
          </div>
          <p className="text-2xl font-bold text-amber-600">{fmt(totalPorCobrar)}</p>
        </div>
      </div>

      {/* Tarifas de comisión */}
      <div className="bg-[var(--color-surface-container)] rounded-xl p-4">
        <p className="text-xs font-semibold mb-3">Tarifas de comisión vigentes</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {TASAS.map((t) => (
            <div key={t.concepto} className="bg-white rounded-lg p-3 text-xs">
              <p className="font-bold text-[var(--color-primary)] text-base mb-0.5">{t.tasa}</p>
              <p className="font-medium">{t.concepto}</p>
              <p className="text-[var(--color-on-surface-variant)]">{t.aplica}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]" />
          <input
            type="text"
            placeholder="Buscar por empresa, comprador o ID..."
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
        <div className="flex gap-2">
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
          <table className="w-full min-w-[700px] text-sm">
            <thead className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-container)]">
              <tr>
                {["ID", "Tipo / Operación", "Empresa", "Base", "%", "Comisión", "IVA", "Total", "Estado"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-on-surface-variant)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-subtle)]">
              {filtradas.map((c) => (
                <tr key={c.id} className="hover:bg-[var(--color-surface-container)] hover:bg-opacity-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-mono text-xs font-bold">{c.id}</p>
                    <p className="text-[10px] text-[var(--color-on-surface-variant)]">{c.fecha}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs font-medium">{c.tipo}</p>
                    <p className="text-[10px] text-[var(--color-on-surface-variant)]">{c.operacion}</p>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <p className="font-medium">{c.empresa}</p>
                    <p className="text-[var(--color-on-surface-variant)]">{c.comprador}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-right">{fmt(c.montoBase)}</td>
                  <td className="px-4 py-3 text-xs text-center font-semibold text-[var(--color-primary)]">{c.porcentaje}%</td>
                  <td className="px-4 py-3 text-xs text-right font-semibold">{fmt(c.comision)}</td>
                  <td className="px-4 py-3 text-xs text-right text-[var(--color-on-surface-variant)]">{fmt(c.iva)}</td>
                  <td className="px-4 py-3 text-right font-bold text-sm">{fmt(c.total)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${ESTADO_COLOR[c.estado]}`}>{c.estado}</span>
                      {c.estado === "Por cobrar" && (
                        <button className="text-[10px] text-[var(--color-primary)] hover:underline flex items-center gap-0.5">
                          Facturar <ChevronRight size={10} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtradas.length === 0 && (
                <tr><td colSpan={9} className="px-4 py-10 text-center text-sm text-[var(--color-on-surface-variant)]">Sin resultados</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-container)] flex justify-between text-xs">
          <span className="text-[var(--color-on-surface-variant)]">{filtradas.length} comisiones</span>
          <div className="flex gap-6 font-bold">
            <span>Base: {fmt(filtradas.reduce((s, c) => s + c.comision, 0))}</span>
            <span>Total + IVA: {fmt(filtradas.reduce((s, c) => s + c.total, 0))}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
