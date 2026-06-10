"use client";

import { useState } from "react";
import { Upload, Search, FileText, Download, Eye, Trash2, Plus, CheckCircle, AlertTriangle, Clock } from "lucide-react";

type DocType = "ficha_tecnica" | "sds" | "etiqueta" | "certificado_calidad" | "certificado_origen" | "certificado_organico";
type DocStatus = "vigente" | "por_vencer" | "vencido" | "pendiente_aprobacion";

interface TechDocument {
  id: string; name: string; type: DocType; product: string;
  country: string; version: string; size: string;
  status: DocStatus; uploadedAt: string; expiresAt?: string;
}

const MOCK_DOCS: TechDocument[] = [
  { id: "dc1", name: "FT_Glifosato480_v3.pdf", type: "ficha_tecnica", product: "Glifosato 480 SL", country: "CO/EC/VE", version: "v3.0", size: "1.2 MB", status: "vigente", uploadedAt: "2026-01-15", expiresAt: "2029-01-14" },
  { id: "dc2", name: "SDS_Glifosato480_ES.pdf", type: "sds", product: "Glifosato 480 SL", country: "Todos", version: "v2.1", size: "3.4 MB", status: "vigente", uploadedAt: "2026-02-10" },
  { id: "dc3", name: "ETQ_Glifosato480_CO_2024.pdf", type: "etiqueta", product: "Glifosato 480 SL", country: "CO", version: "v4.2", size: "0.8 MB", status: "por_vencer", uploadedAt: "2024-06-01", expiresAt: "2026-08-30" },
  { id: "dc4", name: "FT_Trichoderma_Harzianum_v2.pdf", type: "ficha_tecnica", product: "Trichoderma Harzianum", country: "CO/PE", version: "v2.0", size: "2.1 MB", status: "vigente", uploadedAt: "2025-11-20" },
  { id: "dc5", name: "CERT_ORG_Trichoderma_BiolatinCert.pdf", type: "certificado_organico", product: "Trichoderma Harzianum", country: "Todos", version: "v1.0", size: "0.5 MB", status: "vigente", uploadedAt: "2025-08-15", expiresAt: "2027-08-14" },
  { id: "dc6", name: "ETQ_Mancozeb_EC_2026.pdf", type: "etiqueta", product: "Mancozeb 80% WP", country: "EC", version: "v1.0", size: "1.0 MB", status: "pendiente_aprobacion", uploadedAt: "2026-06-08" },
];

const TYPE_LABELS: Record<DocType, string> = {
  ficha_tecnica: "Ficha técnica", sds: "Hoja de seguridad", etiqueta: "Etiqueta autorizada",
  certificado_calidad: "Cert. calidad", certificado_origen: "Cert. origen", certificado_organico: "Cert. orgánico",
};

const STATUS_CFG: Record<DocStatus, { label: string; color: string; icon: React.ReactNode }> = {
  vigente: { label: "Vigente", color: "bg-green-100 text-green-700", icon: <CheckCircle size={11} /> },
  por_vencer: { label: "Por vencer", color: "bg-orange-100 text-orange-700", icon: <AlertTriangle size={11} /> },
  vencido: { label: "Vencido", color: "bg-red-100 text-red-700", icon: <AlertTriangle size={11} /> },
  pendiente_aprobacion: { label: "Pend. aprobación", color: "bg-blue-100 text-blue-700", icon: <Clock size={11} /> },
};

const TYPE_ICONS: Record<DocType, string> = { ficha_tecnica: "📋", sds: "⚠️", etiqueta: "🏷️", certificado_calidad: "✅", certificado_origen: "🌍", certificado_organico: "🌿" };

export default function FabricanteDocumentosPage() {
  const [docs, setDocs] = useState(MOCK_DOCS);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("todos");
  const [filterStatus, setFilterStatus] = useState("todos");

  const filtered = docs.filter(d => {
    const q = d.name.toLowerCase().includes(search.toLowerCase()) || d.product.toLowerCase().includes(search.toLowerCase());
    const t = filterType === "todos" || d.type === filterType;
    const s = filterStatus === "todos" || d.status === filterStatus;
    return q && t && s;
  });

  function remove(id: string) { setDocs(prev => prev.filter(d => d.id !== id)); }

  return (
    <div className="space-y-5 max-w-6xl">
      <div className="flex items-center justify-between">
        <div><h1 className="text-headline-md font-bold">Documentos Técnicos</h1><p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">Fichas, SDS, etiquetas y certificados de tus productos</p></div>
        <button className="flex items-center gap-2 bg-[var(--color-primary)] text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:opacity-90"><Upload size={15} /> Subir documento</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[{ label: "Total docs", value: docs.length, color: "text-[var(--color-primary)]" }, { label: "Vigentes", value: docs.filter(d => d.status === "vigente").length, color: "text-green-600" }, { label: "Por vencer", value: docs.filter(d => d.status === "por_vencer").length, color: "text-orange-600" }, { label: "Pend. aprobación", value: docs.filter(d => d.status === "pendiente_aprobacion").length, color: "text-blue-600" }].map(k => (
          <div key={k.label} className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4"><p className={`text-2xl font-bold ${k.color}`}>{k.value}</p><p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{k.label}</p></div>
        ))}
      </div>

      {/* Upload zone */}
      <div className="border-2 border-dashed border-[var(--color-border-subtle)] rounded-xl p-6 text-center hover:border-[var(--color-primary)] transition-colors cursor-pointer bg-white">
        <Upload size={24} className="mx-auto mb-2 text-[var(--color-on-surface-variant)]" />
        <p className="text-sm font-medium">Arrastra documentos aquí o haz clic para subir</p>
        <p className="text-xs text-[var(--color-on-surface-variant)] mt-1">PDF, DOC hasta 20MB por archivo</p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4 flex flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] border border-[var(--color-border-subtle)] rounded-lg px-3 py-2"><Search size={14} className="text-[var(--color-on-surface-variant)]" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar documento o producto..." className="text-sm flex-1 outline-none bg-transparent" /></div>
        <select value={filterType} onChange={e => setFilterType(e.target.value)} className="text-sm border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 outline-none"><option value="todos">Todos los tipos</option>{Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="text-sm border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 outline-none"><option value="todos">Todos los estados</option><option value="vigente">Vigentes</option><option value="por_vencer">Por vencer</option><option value="vencido">Vencidos</option><option value="pendiente_aprobacion">Pend. aprobación</option></select>
      </div>

      {/* Table */}
      <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-container-low)]">
              {["Documento", "Tipo", "Producto", "Países", "Versión", "Estado", "Subido", "Acciones"].map(h => <th key={h} className="px-4 py-3 text-xs font-semibold text-[var(--color-on-surface-variant)] text-left">{h}</th>)}
            </tr></thead>
            <tbody>
              {filtered.map((doc, i) => {
                const cfg = STATUS_CFG[doc.status];
                return (
                  <tr key={doc.id} className={`border-b border-[var(--color-border-subtle)] last:border-0 ${i % 2 === 1 ? "bg-[#fafafa]" : ""}`}>
                    <td className="px-4 py-3"><div className="flex items-center gap-2"><FileText size={14} className="text-[var(--color-on-surface-variant)] flex-shrink-0" /><div><p className="font-medium text-xs">{doc.name}</p><p className="text-xs text-[var(--color-on-surface-variant)]">{doc.size}</p></div></div></td>
                    <td className="px-4 py-3 text-xs">{TYPE_ICONS[doc.type]} {TYPE_LABELS[doc.type]}</td>
                    <td className="px-4 py-3 text-xs font-medium">{doc.product}</td>
                    <td className="px-4 py-3 text-xs text-[var(--color-on-surface-variant)]">{doc.country}</td>
                    <td className="px-4 py-3 text-xs font-mono">{doc.version}</td>
                    <td className="px-4 py-3"><span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${cfg.color}`}>{cfg.icon} {cfg.label}</span>{doc.expiresAt && <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">Vence: {doc.expiresAt}</p>}</td>
                    <td className="px-4 py-3 text-xs text-[var(--color-on-surface-variant)]">{doc.uploadedAt}</td>
                    <td className="px-4 py-3"><div className="flex gap-1"><button className="p-1.5 hover:bg-gray-100 rounded-lg text-blue-600"><Eye size={13} /></button><button className="p-1.5 hover:bg-gray-100 rounded-lg text-[var(--color-primary)]"><Download size={13} /></button><button onClick={() => remove(doc.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-500"><Trash2 size={13} /></button></div></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="text-center py-12 text-[var(--color-on-surface-variant)]"><FileText size={32} className="mx-auto mb-2 opacity-30" /><p className="text-sm">No se encontraron documentos</p></div>}
        </div>
      </div>
    </div>
  );
}
