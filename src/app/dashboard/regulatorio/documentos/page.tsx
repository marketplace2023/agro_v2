"use client";

import { useState } from "react";
import Link from "next/link";
import { Shield, Clock, CheckCircle, XCircle, AlertTriangle, Filter } from "lucide-react";

const MOCK_DOCS = [
  { id: "doc-001", tipo: "Registro ICA", producto: "Glifosato 480 SL", vendedor: "DistAgroMax SAS", pais: "CO", vencimiento: "2026-07-15", diasRestantes: 35, status: "pendiente_revision" },
  { id: "doc-002", tipo: "Certificado SENASICA", producto: "Mancozeb 80% WP", vendedor: "AgroSuministros CO SAS", pais: "MX", vencimiento: "2027-01-20", diasRestantes: 224, status: "aprobado" },
  { id: "doc-003", tipo: "Registro AGROCALIDAD", producto: "Trichoderma Harzianum", vendedor: "BioSolutions SA", pais: "EC", vencimiento: "2025-12-01", diasRestantes: -191, status: "vencido" },
  { id: "doc-004", tipo: "Registro ICA", producto: "Clorpirifos 480 EC", vendedor: "PestControl SAS", pais: "CO", vencimiento: "2026-09-30", diasRestantes: 112, status: "rechazado" },
  { id: "doc-005", tipo: "Ficha técnica", producto: "Urea Granulada 46%", vendedor: "DistAgroMax SAS", pais: "CO", vencimiento: "2028-01-01", diasRestantes: 570, status: "aprobado" },
  { id: "doc-006", tipo: "Registro ICA", producto: "Abamectina 1.8 EC", vendedor: "Agroquim SAS", pais: "CO", vencimiento: "2026-06-20", diasRestantes: 10, status: "pendiente_revision" },
];

const STATUS_CFG = {
  pendiente_revision: { label: "En revisión", icon: <Clock size={12} />, cls: "bg-yellow-100 text-yellow-700" },
  aprobado: { label: "Aprobado", icon: <CheckCircle size={12} />, cls: "bg-green-100 text-green-700" },
  rechazado: { label: "Rechazado", icon: <XCircle size={12} />, cls: "bg-red-100 text-red-700" },
  vencido: { label: "Vencido", icon: <AlertTriangle size={12} />, cls: "bg-gray-100 text-gray-500" },
};

export default function DocumentosPage() {
  const [docs] = useState(MOCK_DOCS);
  const [filter, setFilter] = useState("todos");

  const filtered = filter === "todos" ? docs : docs.filter(d => d.status === filter);
  const pendientes = docs.filter(d => d.status === "pendiente_revision").length;
  const proximos = docs.filter(d => d.diasRestantes > 0 && d.diasRestantes <= 60).length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-headline-md font-bold">Cola de revisión regulatoria</h1>
        <p className="text-sm text-[var(--color-on-surface-variant)]">{pendientes} documentos en revisión · {proximos} vencen en menos de 60 días</p>
      </div>

      {/* Alerts */}
      {proximos > 0 && (
        <div className="flex items-center gap-2.5 bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 text-sm text-orange-800">
          <AlertTriangle size={16} className="text-orange-500 flex-shrink-0" />
          <span><strong>{proximos} documentos</strong> vencen en los próximos 60 días. Notificar a los vendedores correspondientes.</span>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {["todos", "pendiente_revision", "aprobado", "rechazado", "vencido"].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === f ? "bg-[var(--color-primary)] text-white" : "bg-white border border-[var(--color-border-subtle)] text-[var(--color-on-surface-variant)]"}`}>
            <Filter size={10} />
            {f === "todos" ? "Todos" : f === "pendiente_revision" ? "En revisión" : f.charAt(0).toUpperCase() + f.slice(1)}
            {f !== "todos" && ` (${docs.filter(d => d.status === f).length})`}
          </button>
        ))}
      </div>

      <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--color-surface-container-low)] text-xs text-[var(--color-on-surface-variant)] uppercase tracking-wide">
            <tr>
              {["Tipo", "Producto", "Vendedor", "País", "Vencimiento", "Estado", ""].map(h => (
                <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border-subtle)]">
            {filtered.map(doc => {
              const scfg = STATUS_CFG[doc.status as keyof typeof STATUS_CFG];
              const isUrgent = doc.diasRestantes > 0 && doc.diasRestantes <= 30;
              return (
                <tr key={doc.id} className={`hover:bg-[var(--color-surface-container-low)]/50 transition-colors ${isUrgent ? "bg-orange-50/40" : ""}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Shield size={14} className="text-[var(--color-primary)] flex-shrink-0" />
                      <span className="font-medium">{doc.tipo}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium">{doc.producto}</td>
                  <td className="px-4 py-3 text-[var(--color-on-surface-variant)]">{doc.vendedor}</td>
                  <td className="px-4 py-3"><span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{doc.pais}</span></td>
                  <td className="px-4 py-3">
                    <p className={isUrgent ? "text-orange-600 font-semibold" : ""}>{doc.vencimiento}</p>
                    {doc.diasRestantes > 0 ? (
                      <p className={`text-xs ${isUrgent ? "text-orange-500 font-medium" : "text-[var(--color-on-surface-variant)]"}`}>
                        {isUrgent && "⚠️ "}{doc.diasRestantes} días
                      </p>
                    ) : (
                      <p className="text-xs text-red-500 font-medium">Vencido</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${scfg.cls}`}>
                      {scfg.icon} {scfg.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/dashboard/regulatorio/documentos/${doc.id}`} className="text-xs text-[var(--color-primary)] font-medium hover:underline">
                      Revisar
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
