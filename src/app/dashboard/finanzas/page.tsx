"use client";

import { useState } from "react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { DollarSign, CheckCircle, Clock, FileText } from "lucide-react";

const PENDING_PAYMENTS = [
  { id: "PAY-2024-201", orden: "ORD-2024-088", comprador: "Finca Las Palmas", metodo: "PSE", monto: "$1,240", fecha: "Hoy 08:30", estado: "por_confirmar" },
  { id: "PAY-2024-202", orden: "ORD-2024-089", comprador: "Cooperativa Boyacá", metodo: "Transferencia", monto: "$8,900", fecha: "Hoy 09:15", estado: "por_confirmar" },
  { id: "PAY-2024-203", orden: "ORD-2024-090", comprador: "Agro del Valle", metodo: "PSE", monto: "$3,400", fecha: "Ayer 17:00", estado: "por_confirmar" },
  { id: "PAY-2024-204", orden: "ORD-2024-085", comprador: "Hacienda El Bosque", metodo: "Cheque", monto: "$12,500", fecha: "Ayer 14:00", estado: "en_revision" },
];

const SETTLEMENTS = [
  { id: "LIQ-2024-022", vendedor: "DistAgroMax", periodo: "1–15 Jun 2026", ventas: "$24,800", comision: "$1,736", descuentos: "$0", retencion: "$248", neto: "$22,816", estado: "pendiente" },
  { id: "LIQ-2024-023", vendedor: "AgroSuministros CO", periodo: "1–15 Jun 2026", ventas: "$15,200", comision: "$1,064", descuentos: "$200", retencion: "$152", neto: "$13,784", estado: "pendiente" },
  { id: "LIQ-2024-021", vendedor: "DistAgroMax", periodo: "16–31 May 2026", ventas: "$31,400", comision: "$2,198", descuentos: "$0", retencion: "$314", neto: "$28,888", estado: "pagado" },
];

export default function FinanzasDashboard() {
  const [showLiqForm, setShowLiqForm] = useState(false);
  const [liqForm, setLiqForm] = useState({ vendedor: "", periodo: "", banco: "", cuenta: "", comprobante: "" });

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-headline-md font-bold">Dashboard Analista Financiero</h1>
        <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">Ana Regulatoria · Módulo financiero — Junio 2026</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Por confirmar" value="$18,200" subtitle="3 pagos pendientes" icon={<Clock size={20} />} color="orange" />
        <StatsCard title="Liquidaciones" value="2" subtitle="pendientes de pago" icon={<FileText size={20} />} color="red" />
        <StatsCard title="Comisiones mes" value="$4,560" subtitle="7% promedio" icon={<DollarSign size={20} />} color="primary" trend={{ value: "+12.3%", up: true }} />
        <StatsCard title="Retenciones" value="$890" subtitle="aplicadas" icon={<CheckCircle size={20} />} color="green" />
      </div>

      {/* Pagos por confirmar */}
      <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--color-border-subtle)]">
          <h2 className="font-semibold text-sm flex items-center gap-2"><Clock size={14} /> Pagos por confirmar manualmente</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-surface-container-low)]">
              <tr>
                {["ID Pago", "Orden", "Comprador", "Método", "Monto", "Fecha/Hora", "Estado", "Acción"].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 text-xs font-medium text-[var(--color-on-surface-variant)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PENDING_PAYMENTS.map(p => (
                <tr key={p.id} className="border-t border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-container-lowest)]">
                  <td className="px-4 py-3 text-xs font-medium text-[var(--color-primary)]">{p.id}</td>
                  <td className="px-4 py-3 text-xs">{p.orden}</td>
                  <td className="px-4 py-3 text-xs">{p.comprador}</td>
                  <td className="px-4 py-3 text-xs">
                    <span className="bg-[var(--color-surface-container)] px-2 py-0.5 rounded text-[10px] font-mono">{p.metodo}</span>
                  </td>
                  <td className="px-4 py-3 text-xs font-bold">{p.monto}</td>
                  <td className="px-4 py-3 text-xs text-[var(--color-on-surface-variant)]">{p.fecha}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${p.estado === "por_confirmar" ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-700"}`}>
                      {p.estado.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button className="text-[10px] bg-green-600 text-white px-2 py-0.5 rounded font-medium">Confirmar</button>
                      <button className="text-[10px] border border-[var(--color-border-subtle)] px-2 py-0.5 rounded text-[var(--color-on-surface-variant)]">Rechazar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Liquidaciones */}
      <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--color-border-subtle)] flex items-center justify-between">
          <h2 className="font-semibold text-sm flex items-center gap-2"><FileText size={14} /> Liquidaciones a vendedores</h2>
          <button
            onClick={() => setShowLiqForm(!showLiqForm)}
            className="text-xs bg-[var(--color-primary)] text-white px-3 py-1 rounded-full font-medium"
          >
            + Nueva liquidación
          </button>
        </div>

        {showLiqForm && (
          <div className="px-5 py-4 bg-[var(--color-surface-container-low)] border-b border-[var(--color-border-subtle)]">
            <h3 className="text-xs font-semibold mb-3">Nueva liquidación</h3>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { k: "vendedor", label: "Vendedor", ph: "Nombre del vendedor..." },
                { k: "periodo", label: "Período", ph: "Ej: 1–15 Jun 2026" },
                { k: "banco", label: "Banco destino", ph: "Banco, entidad..." },
                { k: "cuenta", label: "Cuenta bancaria", ph: "Número de cuenta..." },
              ].map(f => (
                <label key={f.k} className="text-[10px] font-medium text-[var(--color-on-surface-variant)]">
                  {f.label}
                  <input className="w-full mt-1 p-2 text-xs border border-[var(--color-border-subtle)] rounded-lg bg-white focus:outline-none focus:border-[var(--color-primary)]" placeholder={f.ph}
                    value={(liqForm as Record<string, string>)[f.k]}
                    onChange={e => setLiqForm(p => ({ ...p, [f.k]: e.target.value }))}
                  />
                </label>
              ))}
              <label className="text-[10px] font-medium text-[var(--color-on-surface-variant)]">
                Comprobante de pago
                <div className="mt-1 border-2 border-dashed border-[var(--color-border-subtle)] rounded-lg p-3 text-center bg-white cursor-pointer hover:border-[var(--color-primary)]">
                  <p className="text-[10px] text-[var(--color-on-surface-variant)]">📎 Subir comprobante PDF</p>
                </div>
              </label>
            </div>
            <div className="flex gap-2 mt-3">
              <button className="text-xs bg-[var(--color-primary)] text-white px-4 py-1.5 rounded-lg font-medium">Registrar liquidación</button>
              <button onClick={() => setShowLiqForm(false)} className="text-xs border border-[var(--color-border-subtle)] px-4 py-1.5 rounded-lg text-[var(--color-on-surface-variant)]">Cancelar</button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-[var(--color-surface-container-low)]">
              <tr>
                {["ID", "Vendedor", "Período", "Ventas brutas", "Comisión (7%)", "Descuentos", "Retención", "Neto a pagar", "Estado"].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 text-xs font-medium text-[var(--color-on-surface-variant)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SETTLEMENTS.map(s => (
                <tr key={s.id} className="border-t border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-container-lowest)]">
                  <td className="px-4 py-3 font-medium text-[var(--color-primary)]">{s.id}</td>
                  <td className="px-4 py-3">{s.vendedor}</td>
                  <td className="px-4 py-3 text-[var(--color-on-surface-variant)]">{s.periodo}</td>
                  <td className="px-4 py-3 font-semibold">{s.ventas}</td>
                  <td className="px-4 py-3 text-[var(--color-secondary)]">-{s.comision}</td>
                  <td className="px-4 py-3 text-[var(--color-secondary)]">{s.descuentos !== "$0" ? `-${s.descuentos}` : "—"}</td>
                  <td className="px-4 py-3 text-orange-600">-{s.retencion}</td>
                  <td className="px-4 py-3 font-bold text-[var(--color-agri-green)]">{s.neto}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${s.estado === "pagado" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {s.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
