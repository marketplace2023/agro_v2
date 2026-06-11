"use client";

import { useState } from "react";
import {
  RefreshCw, CheckCircle2, AlertCircle, Clock,
  ChevronRight, Download, Filter, DollarSign,
} from "lucide-react";

const ITEMS = [
  {
    id: "CONC-001", tipo: "Pago flete", referencia: "LIQ-001",
    operador: "Transportes Andes S.A.S.", empresa: "Grupo Agroindustrial S.A.",
    montoFactura: 1963500, montoBanco: 1963500, diferencia: 0,
    fechaFactura: "2026-06-15", fechaPago: null,
    estado: "Pendiente pago", cuenta: "Bancolombia *4521",
  },
  {
    id: "CONC-002", tipo: "Pago flete", referencia: "LIQ-002",
    operador: "LogiCarga Colombia", empresa: "Tecnicaña S.A.",
    montoFactura: 1674140, montoBanco: null, diferencia: null,
    fechaFactura: "2026-06-10", fechaPago: null,
    estado: "En disputa", cuenta: "BBVA *9832",
  },
  {
    id: "CONC-003", tipo: "Pago flete", referencia: "LIQ-003",
    operador: "Fletes Nacionales Ltda.", empresa: "Finca Las Palmas",
    montoFactura: 2375190, montoBanco: 2375190, diferencia: 0,
    fechaFactura: "2026-06-08", fechaPago: "2026-06-09",
    estado: "Conciliada", cuenta: "Davivienda *7712",
  },
  {
    id: "CONC-004", tipo: "Comisión plataforma", referencia: "COM-001",
    operador: "Marketplace Agro", empresa: "Transportes Andes S.A.S.",
    montoFactura: 196350, montoBanco: 196350, diferencia: 0,
    fechaFactura: "2026-06-15", fechaPago: "2026-06-15",
    estado: "Conciliada", cuenta: "Nequi *3300",
  },
  {
    id: "CONC-005", tipo: "Pago flete", referencia: "LIQ-005",
    operador: "Transportadora Caribe", empresa: "Palmas del Norte",
    montoFactura: 1428000, montoBanco: 1200000, diferencia: 228000,
    fechaFactura: "2026-06-12", fechaPago: "2026-06-12",
    estado: "Diferencia detectada", cuenta: "Bancolombia *1198",
  },
  {
    id: "CONC-006", tipo: "Pago flete", referencia: "LIQ-004",
    operador: "Transportes Andes S.A.S.", empresa: "Cooperativa Boyacá Agro",
    montoFactura: 892500, montoBanco: 892500, diferencia: 0,
    fechaFactura: "2026-06-07", fechaPago: "2026-06-09",
    estado: "Conciliada", cuenta: "Bancolombia *4521",
  },
];

const ESTADOS_FILTER = ["Todos", "Pendiente pago", "Conciliada", "Diferencia detectada", "En disputa"];

const ESTADO_COLOR: Record<string, string> = {
  "Pendiente pago": "bg-amber-100 text-amber-700",
  Conciliada: "bg-green-100 text-green-700",
  "Diferencia detectada": "bg-red-100 text-red-700",
  "En disputa": "bg-red-200 text-red-800",
};

function EstadoIcon({ e }: { e: string }) {
  if (e === "Conciliada") return <CheckCircle2 size={13} className="text-green-500" />;
  if (e === "Diferencia detectada" || e === "En disputa") return <AlertCircle size={13} className="text-red-500" />;
  return <Clock size={13} className="text-amber-500" />;
}

const fmt = (n: number) => `$${n.toLocaleString("es-CO")}`;

export default function ConciliacionPage() {
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");
  const [selected, setSelected] = useState<string[]>([]);

  const filtrados = ITEMS.filter((i) => estadoFiltro === "Todos" || i.estado === estadoFiltro);

  const toggleSelect = (id: string) =>
    setSelected((prev) => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const pendientePago = ITEMS.filter(i => i.estado === "Pendiente pago").reduce((s, i) => s + i.montoFactura, 0);
  const enDisputa = ITEMS.filter(i => ["En disputa", "Diferencia detectada"].includes(i.estado)).reduce((s, i) => s + i.montoFactura, 0);
  const conciliado = ITEMS.filter(i => i.estado === "Conciliada").reduce((s, i) => s + i.montoFactura, 0);

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-md font-bold flex items-center gap-2">
            <RefreshCw size={22} /> Conciliación y cuentas por pagar
          </h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">
            Reconciliación de pagos a operadores logísticos y comisiones
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 text-sm border border-[var(--color-border-subtle)] px-3 py-2 rounded-lg hover:bg-[var(--color-surface-container)] transition-colors text-[var(--color-on-surface-variant)]">
            <Download size={13} /> Exportar
          </button>
          <button className="flex items-center gap-2 text-sm bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
            <RefreshCw size={13} /> Conciliar selección
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
          <p className="text-xs text-[var(--color-on-surface-variant)] mb-1 flex items-center gap-1"><Clock size={11} />Pendiente de pago</p>
          <p className="text-2xl font-bold text-amber-600">{fmt(pendientePago)}</p>
          <p className="text-[10px] text-[var(--color-on-surface-variant)] mt-0.5">{ITEMS.filter(i => i.estado === "Pendiente pago").length} facturas</p>
        </div>
        <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
          <p className="text-xs text-[var(--color-on-surface-variant)] mb-1 flex items-center gap-1"><AlertCircle size={11} />Diferencias / En disputa</p>
          <p className="text-2xl font-bold text-red-600">{fmt(enDisputa)}</p>
          <p className="text-[10px] text-[var(--color-on-surface-variant)] mt-0.5">{ITEMS.filter(i => ["En disputa", "Diferencia detectada"].includes(i.estado)).length} ítems</p>
        </div>
        <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
          <p className="text-xs text-[var(--color-on-surface-variant)] mb-1 flex items-center gap-1"><CheckCircle2 size={11} />Conciliado este mes</p>
          <p className="text-2xl font-bold text-green-600">{fmt(conciliado)}</p>
          <p className="text-[10px] text-[var(--color-on-surface-variant)] mt-0.5">{ITEMS.filter(i => i.estado === "Conciliada").length} pagos</p>
        </div>
      </div>

      {/* Filtro y acciones */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-1 text-xs text-[var(--color-on-surface-variant)]">
          <Filter size={13} />
          <span>Estado:</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 flex-1">
          {ESTADOS_FILTER.map((e) => (
            <button key={e} onClick={() => setEstadoFiltro(e)}
              className={`text-xs px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${estadoFiltro === e ? "bg-[var(--color-primary)] text-white" : "border border-[var(--color-border-subtle)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)]"}`}>
              {e}
            </button>
          ))}
        </div>
        {selected.length > 0 && (
          <div className="flex gap-2 shrink-0">
            <span className="text-xs text-[var(--color-on-surface-variant)] py-2">{selected.length} seleccionados</span>
            <button className="text-xs bg-[var(--color-primary)] text-white px-3 py-2 rounded-lg hover:opacity-90 transition-opacity">
              Marcar pagadas
            </button>
          </div>
        )}
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-container)]">
              <tr>
                <th className="px-4 py-3 w-8">
                  <input type="checkbox" className="accent-[var(--color-primary)]"
                    onChange={(e) => setSelected(e.target.checked ? filtrados.map(i => i.id) : [])} />
                </th>
                {["Referencia", "Operador / Empresa", "Cuenta", "Monto factura", "Monto banco", "Diferencia", "Estado", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-on-surface-variant)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-subtle)]">
              {filtrados.map((i) => (
                <tr key={i.id} className="hover:bg-[var(--color-surface-container)] hover:bg-opacity-50 transition-colors">
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selected.includes(i.id)} onChange={() => toggleSelect(i.id)}
                      className="accent-[var(--color-primary)]" />
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-mono text-xs font-bold">{i.id}</p>
                    <p className="text-[10px] text-[var(--color-on-surface-variant)]">{i.referencia} · {i.tipo}</p>
                    <p className="text-[10px] text-[var(--color-on-surface-variant)]">{i.fechaFactura}</p>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <p className="font-medium">{i.operador}</p>
                    <p className="text-[var(--color-on-surface-variant)]">{i.empresa}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-[var(--color-on-surface-variant)]">{i.cuenta}</td>
                  <td className="px-4 py-3 text-right text-xs font-semibold">{fmt(i.montoFactura)}</td>
                  <td className="px-4 py-3 text-right text-xs">
                    {i.montoBanco != null ? <span className="font-semibold">{fmt(i.montoBanco)}</span> : <span className="text-[var(--color-on-surface-variant)]">—</span>}
                    {i.fechaPago && <p className="text-[10px] text-green-600">{i.fechaPago}</p>}
                  </td>
                  <td className="px-4 py-3 text-right text-xs">
                    {i.diferencia != null ? (
                      <span className={i.diferencia > 0 ? "text-red-600 font-bold" : "text-green-600"}>{i.diferencia > 0 ? `+${fmt(i.diferencia)}` : "✓ 0"}</span>
                    ) : <span className="text-[var(--color-on-surface-variant)]">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <EstadoIcon e={i.estado} />
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${ESTADO_COLOR[i.estado]}`}>{i.estado}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {i.estado === "Pendiente pago" && (
                      <button className="text-xs bg-[var(--color-primary)] text-white px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap">
                        Pagar
                      </button>
                    )}
                    {i.estado === "Diferencia detectada" && (
                      <button className="text-xs border border-red-300 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors whitespace-nowrap flex items-center gap-1">
                        Revisar <ChevronRight size={11} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filtrados.length === 0 && (
                <tr><td colSpan={9} className="px-4 py-10 text-center text-sm text-[var(--color-on-surface-variant)]">Sin resultados</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-container)] flex justify-between text-xs">
          <span className="text-[var(--color-on-surface-variant)]">{filtrados.length} ítems</span>
          <span className="font-bold flex items-center gap-1"><DollarSign size={11} />Total filtrado: {fmt(filtrados.reduce((s, i) => s + i.montoFactura, 0))}</span>
        </div>
      </div>
    </div>
  );
}
