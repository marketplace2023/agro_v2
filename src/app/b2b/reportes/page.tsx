"use client";

import { useState } from "react";
import { Download, BarChart3, Calendar, Building2, Loader2 } from "lucide-react";

const PERIODS = [
  { label: "Enero 2025", value: "2025-01" },
  { label: "Q1 2025 (Ene–Mar)", value: "2025-Q1" },
  { label: "Dic 2024", value: "2024-12" },
  { label: "Q4 2024 (Oct–Dic)", value: "2024-Q4" },
];

const COMPANIES = [
  { label: "AgroInversiones S.A.S", value: "agroinversiones" },
  { label: "Hacienda Los Robles", value: "robles" },
];

type ReportType = "completo" | "sede" | "cultivo" | "proveedor" | "cc";

const REPORT_TYPES: Array<{ key: ReportType; label: string; desc: string }> = [
  { key: "completo", label: "Reporte completo", desc: "Todas las dimensiones: sede, cultivo, proveedor y CC" },
  { key: "sede", label: "Por sede / finca", desc: "Gasto y compras desglosados por finca o punto de entrega" },
  { key: "cultivo", label: "Por cultivo", desc: "Insumos y costos asociados a cada cultivo" },
  { key: "proveedor", label: "Por proveedor", desc: "Evaluación de proveedores: volumen, precio y puntualidad" },
  { key: "cc", label: "Centros de costo", desc: "Ejecución presupuestal por centro de costo" },
];

export default function ReportesPage() {
  const [company, setCompany] = useState(COMPANIES[0].value);
  const [period, setPeriod] = useState(PERIODS[0].value);
  const [reportType, setReportType] = useState<ReportType>("completo");
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    setLoading(true);
    try {
      const url = `/api/b2b/reporte-pdf?companyId=${company}&period=${period}&type=${reportType}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Error generando reporte");
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `reporte-${company}-${period}.pdf`;
      a.click();
      URL.revokeObjectURL(a.href);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-max py-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-headline-md font-bold">Reportes Corporativos</h1>
        <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">
          Descarga reportes en PDF con el gasto por sede, cultivo, proveedor y período
        </p>
      </div>

      <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-6 space-y-6">
        {/* Company */}
        <div>
          <label className="text-xs font-semibold flex items-center gap-1.5 mb-2">
            <Building2 size={13} /> Empresa
          </label>
          <div className="flex flex-wrap gap-2">
            {COMPANIES.map(c => (
              <button key={c.value} onClick={() => setCompany(c.value)}
                className={`text-xs font-medium px-4 py-2 rounded-lg border transition-colors ${company === c.value ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]" : "bg-white border-[var(--color-border-subtle)] text-[var(--color-on-surface-variant)] hover:border-[var(--color-primary)]"}`}>
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Period */}
        <div>
          <label className="text-xs font-semibold flex items-center gap-1.5 mb-2">
            <Calendar size={13} /> Período
          </label>
          <div className="flex flex-wrap gap-2">
            {PERIODS.map(p => (
              <button key={p.value} onClick={() => setPeriod(p.value)}
                className={`text-xs font-medium px-4 py-2 rounded-lg border transition-colors ${period === p.value ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]" : "bg-white border-[var(--color-border-subtle)] text-[var(--color-on-surface-variant)] hover:border-[var(--color-primary)]"}`}>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Report type */}
        <div>
          <label className="text-xs font-semibold flex items-center gap-1.5 mb-2">
            <BarChart3 size={13} /> Tipo de reporte
          </label>
          <div className="space-y-2">
            {REPORT_TYPES.map(rt => (
              <button key={rt.key} onClick={() => setReportType(rt.key)}
                className={`w-full flex items-start gap-3 p-3 rounded-lg border text-left transition-colors ${reportType === rt.key ? "border-[var(--color-primary)] bg-[#e6f3f7]" : "border-[var(--color-border-subtle)] hover:border-[var(--color-primary)]"}`}>
                <div className={`w-4 h-4 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center ${reportType === rt.key ? "border-[var(--color-primary)]" : "border-[var(--color-border-subtle)]"}`}>
                  {reportType === rt.key && <div className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />}
                </div>
                <div>
                  <p className="text-xs font-semibold">{rt.label}</p>
                  <p className="text-[10px] text-[var(--color-on-surface-variant)] mt-0.5">{rt.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Summary + Download */}
        <div className="pt-4 border-t border-[var(--color-border-subtle)] flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold">
              {COMPANIES.find(c => c.value === company)?.label}
            </p>
            <p className="text-[10px] text-[var(--color-on-surface-variant)]">
              {PERIODS.find(p => p.value === period)?.label} · {REPORT_TYPES.find(r => r.key === reportType)?.label}
            </p>
          </div>
          <button onClick={handleDownload} disabled={loading}
            className="flex items-center gap-2 bg-[var(--color-primary)] text-white text-xs font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 disabled:opacity-50">
            {loading ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
            {loading ? "Generando..." : "Descargar PDF"}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="mt-4 p-4 bg-[var(--color-surface-container-low)] rounded-xl border border-[var(--color-border-subtle)]">
        <p className="text-xs font-semibold mb-1">¿Qué incluye el reporte completo?</p>
        <ul className="text-[10px] text-[var(--color-on-surface-variant)] space-y-0.5 list-disc list-inside">
          <li>KPIs: gasto total, órdenes, proveedores activos y productos adquiridos</li>
          <li>Gasto por sede / finca con barra de participación</li>
          <li>Gasto por cultivo e insumo</li>
          <li>Evaluación de proveedores con retraso promedio</li>
          <li>Ejecución presupuestal por centro de costo con alertas &gt;90%</li>
        </ul>
      </div>
    </div>
  );
}
