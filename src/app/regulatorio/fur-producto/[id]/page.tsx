"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck, Clock, XCircle, AlertTriangle, Lock,
  ChevronDown, ChevronUp, Upload, FileText, History,
  CheckCircle, Leaf, Microscope, Globe, BookOpen,
} from "lucide-react";

type RegStatus = "aprobado" | "pendiente" | "rechazado" | "vencido" | "bloqueado";
type DocType = "ficha_tecnica" | "sds" | "etiqueta" | "certificado_calidad" | "certificado_origen" | "registro_sanitario";

interface CountryRecord {
  country: string; status: RegStatus; authority: string;
  registrationNum: string; issuedAt: string; expiresAt: string;
  restrictions: string;
}

interface DocumentEntry {
  id: string; type: DocType; title: string;
  version: number; status: RegStatus; uploadedBy: string;
  uploadedAt: string; fileUrl: string;
}

interface HistoryEntry {
  id: string; action: string; module: string;
  userId: string; userRole: string; ipAddress: string;
  fieldsBefore?: Record<string, string>; fieldsAfter?: Record<string, string>;
  createdAt: string;
}

// Mock product data
const MOCK_PRODUCT = {
  id: "p1",
  name: "Glifosato 480 SL Herbicida No Selectivo",
  technicalName: "N-(fosfonometil)glicina",
  activeIngredient: "Glifosato",
  concentration: "480 g/L",
  formulation: "SL — Solución concentrada",
  modeOfAction: "Inhibición de la EPSPS (Enolpiruvil shiquimato-fosfato sintasa)",
  chemicalGroup: "Glicinas",
  brand: "AgroQuim",
  category: "Herbicidas",
  description: "Herbicida sistémico de amplio espectro, no selectivo, que actúa por absorción foliar. Controla malezas anuales y perennes, gramíneas y de hoja ancha.",
  cropTypes: ["Maíz", "Soja", "Caña de azúcar", "Palma"],
  applicationMethods: ["Aspersión foliar", "Aplicación dirigida"],
  withdrawalPeriod: "30 días antes de cosecha",
  reentryInterval: "24 horas",
  compatible: ["Surfactantes no iónicos", "2,4-D amina"],
  incompatible: ["Mezclas con suelo o agua muy dura", "Productos catiónicos"],
  status: "aprobado" as RegStatus,
  publishedAt: "2024-01-15",
  isRegulated: true,
  isBiological: false,
};

const MOCK_REGULATORY: CountryRecord[] = [
  { country: "CO", status: "aprobado", authority: "ICA (Instituto Colombiano Agropecuario)", registrationNum: "ICA-0088-G", issuedAt: "2022-03-10", expiresAt: "2025-09-15", restrictions: "Prohibido uso aéreo en zonas de amortiguación de páramos" },
  { country: "MX", status: "pendiente", authority: "COFEPRIS / SENASICA", registrationNum: "", issuedAt: "", expiresAt: "", restrictions: "" },
  { country: "PE", status: "rechazado", authority: "SENASA Perú", registrationNum: "", issuedAt: "2023-08-01", expiresAt: "", restrictions: "Solicitud rechazada por falta de estudios de residuos locales" },
  { country: "EC", status: "vencido", authority: "AGROCALIDAD", registrationNum: "AGRO-EC-2019-045", issuedAt: "2019-05-01", expiresAt: "2024-05-01", restrictions: "Renovación en proceso" },
];

const MOCK_DOCS: DocumentEntry[] = [
  { id: "d1", type: "ficha_tecnica", title: "Ficha de Seguridad SDS v3", version: 3, status: "aprobado", uploadedBy: "María Regulatoria", uploadedAt: "2024-11-20", fileUrl: "#" },
  { id: "d2", type: "registro_sanitario", title: "Registro ICA Colombia 2022", version: 1, status: "aprobado", uploadedBy: "María Regulatoria", uploadedAt: "2022-03-10", fileUrl: "#" },
  { id: "d3", type: "etiqueta", title: "Etiqueta v4 — 480 SL", version: 4, status: "aprobado", uploadedBy: "Ana Analista", uploadedAt: "2024-09-05", fileUrl: "#" },
  { id: "d4", type: "certificado_calidad", title: "Certificado de Calidad Lote 2024", version: 2, status: "pendiente", uploadedBy: "Juan Vendedor", uploadedAt: "2024-12-01", fileUrl: "#" },
  { id: "d5", type: "sds", title: "Hoja Datos Seguridad v2", version: 2, status: "aprobado", uploadedBy: "María Regulatoria", uploadedAt: "2024-07-15", fileUrl: "#" },
];

const MOCK_HISTORY: HistoryEntry[] = [
  { id: "h1", action: "aprobar_registro", module: "Regulatorio", userId: "u-reg1", userRole: "regulatorio", ipAddress: "190.24.55.12", fieldsBefore: { status: "pendiente" }, fieldsAfter: { status: "aprobado", registrationNum: "ICA-0088-G" }, createdAt: "2022-03-10T14:30:00Z" },
  { id: "h2", action: "upload_document", module: "Documentos", userId: "u-vend1", userRole: "vendedor", ipAddress: "190.12.44.88", fieldsBefore: {}, fieldsAfter: { docTitle: "Ficha de Seguridad SDS v3", version: "3" }, createdAt: "2024-11-20T09:15:00Z" },
  { id: "h3", action: "update_restrictions", module: "Regulatorio", userId: "u-reg1", userRole: "regulatorio", ipAddress: "190.24.55.12", fieldsBefore: { restrictions: "" }, fieldsAfter: { restrictions: "Prohibido uso aéreo en zonas de amortiguación de páramos" }, createdAt: "2024-06-05T11:00:00Z" },
  { id: "h4", action: "rechazar_registro", module: "Regulatorio", userId: "u-reg2", userRole: "regulatorio", ipAddress: "179.60.12.99", fieldsBefore: { country_PE_status: "pendiente" }, fieldsAfter: { country_PE_status: "rechazado", notes: "Falta estudios locales" }, createdAt: "2023-08-01T16:45:00Z" },
  { id: "h5", action: "upload_document", module: "Documentos", userId: "u-vend1", userRole: "vendedor", ipAddress: "190.12.44.88", fieldsBefore: {}, fieldsAfter: { docTitle: "Certificado de Calidad Lote 2024", version: "2" }, createdAt: "2024-12-01T10:00:00Z" },
];

const STATUS_CFG: Record<RegStatus, { label: string; color: string; bg: string; Icon: React.ElementType }> = {
  aprobado:  { label: "Aprobado",  color: "text-green-700",  bg: "bg-green-50 border-green-200",   Icon: ShieldCheck },
  pendiente: { label: "Pendiente", color: "text-amber-700",  bg: "bg-amber-50 border-amber-200",   Icon: Clock },
  rechazado: { label: "Rechazado", color: "text-red-700",    bg: "bg-red-50 border-red-200",       Icon: XCircle },
  vencido:   { label: "Vencido",   color: "text-orange-700", bg: "bg-orange-50 border-orange-200", Icon: AlertTriangle },
  bloqueado: { label: "Bloqueado", color: "text-slate-700",  bg: "bg-slate-100 border-slate-300",  Icon: Lock },
};

const DOC_LABELS: Record<DocType, string> = {
  ficha_tecnica: "Ficha Técnica", sds: "SDS / Hoja Seguridad",
  etiqueta: "Etiqueta oficial", certificado_calidad: "Cert. Calidad",
  certificado_origen: "Cert. Origen", registro_sanitario: "Registro Sanitario",
};

const TABS = [
  { id: "comercial",   label: "Comercial",       Icon: Leaf },
  { id: "tecnico",     label: "Técnico",          Icon: Microscope },
  { id: "regulatorio", label: "Reg. por país",    Icon: Globe },
  { id: "documentos",  label: "Documentos",       Icon: FileText },
  { id: "historial",   label: "Historial",        Icon: History },
];

function StatusBadge({ status }: { status: RegStatus }) {
  const cfg = STATUS_CFG[status];
  const Icon = cfg.Icon;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color}`}>
      <Icon size={11} />{cfg.label}
    </span>
  );
}

function TabComercial() {
  const p = MOCK_PRODUCT;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Field label="Nombre comercial" value={p.name} />
          <Field label="Nombre técnico" value={p.technicalName} />
          <Field label="Marca" value={p.brand} />
          <Field label="Categoría" value={p.category} />
        </div>
        <div className="space-y-3">
          <Field label="Estado regulatorio" value={<StatusBadge status={p.status} />} />
          <Field label="Producto regulado" value={p.isRegulated ? "Sí" : "No"} />
          <Field label="Biológico" value={p.isBiological ? "Sí" : "No"} />
          <Field label="Publicado" value={new Date(p.publishedAt).toLocaleDateString("es-CO")} />
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold text-[var(--color-on-surface-variant)] mb-1">Descripción</p>
        <p className="text-sm bg-[var(--color-surface-container-low)] rounded-lg p-3">{p.description}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-semibold text-[var(--color-on-surface-variant)] mb-2">Cultivos objetivo</p>
          <div className="flex flex-wrap gap-1">
            {p.cropTypes.map(c => <span key={c} className="text-xs bg-[var(--color-surface-container)] px-2 py-0.5 rounded-full">{c}</span>)}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-[var(--color-on-surface-variant)] mb-2">Métodos de aplicación</p>
          <div className="flex flex-wrap gap-1">
            {p.applicationMethods.map(m => <span key={m} className="text-xs bg-[var(--color-surface-container)] px-2 py-0.5 rounded-full">{m}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}

function TabTecnico() {
  const p = MOCK_PRODUCT;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Ingrediente activo" value={p.activeIngredient} />
        <Field label="Concentración" value={p.concentration} />
        <Field label="Formulación" value={p.formulation} />
        <Field label="Grupo químico" value={p.chemicalGroup} />
        <Field label="Modo de acción" value={p.modeOfAction} />
        <Field label="Período de carencia" value={p.withdrawalPeriod} />
        <Field label="Intervalo de reingreso" value={p.reentryInterval} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-semibold text-[var(--color-on-surface-variant)] mb-2">Compatibilidades</p>
          <ul className="space-y-1">
            {p.compatible.map(c => (
              <li key={c} className="text-xs flex items-center gap-1.5 text-green-700">
                <CheckCircle size={11} />{c}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold text-[var(--color-on-surface-variant)] mb-2">Incompatibilidades</p>
          <ul className="space-y-1">
            {p.incompatible.map(c => (
              <li key={c} className="text-xs flex items-center gap-1.5 text-red-700">
                <XCircle size={11} />{c}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function TabRegulatorio() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [approving, setApproving] = useState<string | null>(null);
  const [form, setForm] = useState({ registrationNum: "", authority: "", issuedAt: "", expiresAt: "", notes: "" });

  async function handleApprove(country: string) {
    setApproving(country);
    try {
      await fetch(`/api/regulatorio/p1/aprobar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country, ...form }),
      });
    } catch { /* dev */ }
    setApproving(null);
    setExpanded(null);
    setForm({ registrationNum: "", authority: "", issuedAt: "", expiresAt: "", notes: "" });
  }

  async function handleReject(country: string) {
    try {
      await fetch(`/api/regulatorio/p1/rechazar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country, notes: form.notes || "Rechazado por analista" }),
      });
    } catch { /* dev */ }
    setExpanded(null);
  }

  return (
    <div className="space-y-3">
      {MOCK_REGULATORY.map(rec => {
        const cfg = STATUS_CFG[rec.status];
        const Icon = cfg.Icon;
        const isOpen = expanded === rec.country;
        return (
          <div key={rec.country} className={`border rounded-xl overflow-hidden ${cfg.bg}`}>
            <button
              onClick={() => setExpanded(prev => prev === rec.country ? null : rec.country)}
              className="w-full flex items-center justify-between px-4 py-3 text-left"
            >
              <div className="flex items-center gap-3">
                <span className={`text-sm font-bold ${cfg.color}`}>{rec.country}</span>
                <StatusBadge status={rec.status} />
                {rec.authority && (
                  <span className="text-xs text-[var(--color-on-surface-variant)] hidden sm:block">{rec.authority}</span>
                )}
              </div>
              {isOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>

            {isOpen && (
              <div className="px-4 pb-4 border-t border-current/10 bg-white/70">
                {rec.registrationNum && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-3">
                    <Field label="N° Registro" value={rec.registrationNum} />
                    <Field label="Emitido" value={rec.issuedAt ? new Date(rec.issuedAt).toLocaleDateString("es-CO") : "—"} />
                    <Field label="Vence" value={rec.expiresAt ? new Date(rec.expiresAt).toLocaleDateString("es-CO") : "—"} />
                    <Field label="Autoridad" value={rec.authority || "—"} />
                  </div>
                )}
                {rec.restrictions && (
                  <div className="mb-3">
                    <p className="text-[10px] font-semibold text-[var(--color-on-surface-variant)] mb-1">Restricciones</p>
                    <p className="text-xs bg-amber-50 text-amber-800 border border-amber-200 rounded-lg p-2">{rec.restrictions}</p>
                  </div>
                )}

                {/* Approval form for pending/vencido/rechazado */}
                {(rec.status === "pendiente" || rec.status === "vencido" || rec.status === "rechazado") && (
                  <div className="border-t border-[var(--color-border-subtle)] pt-3 mt-3">
                    <p className="text-xs font-semibold mb-3">Formulario de aprobación — {rec.country}</p>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <label className="text-xs font-medium">
                        N° Registro oficial
                        <input className="w-full mt-1 p-2 text-xs border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                          value={form.registrationNum} onChange={e => setForm(p => ({ ...p, registrationNum: e.target.value }))} />
                      </label>
                      <label className="text-xs font-medium">
                        Autoridad regulatoria
                        <input className="w-full mt-1 p-2 text-xs border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                          value={form.authority} onChange={e => setForm(p => ({ ...p, authority: e.target.value }))} />
                      </label>
                      <label className="text-xs font-medium">
                        Fecha emisión
                        <input type="date" className="w-full mt-1 p-2 text-xs border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                          value={form.issuedAt} onChange={e => setForm(p => ({ ...p, issuedAt: e.target.value }))} />
                      </label>
                      <label className="text-xs font-medium">
                        Fecha vencimiento
                        <input type="date" className="w-full mt-1 p-2 text-xs border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                          value={form.expiresAt} onChange={e => setForm(p => ({ ...p, expiresAt: e.target.value }))} />
                      </label>
                      <label className="text-xs font-medium col-span-2">
                        Notas del analista
                        <textarea rows={2} className="w-full mt-1 p-2 text-xs border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] resize-none"
                          value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
                      </label>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(rec.country)}
                        disabled={approving === rec.country}
                        className="flex items-center gap-1.5 text-xs font-semibold bg-[var(--color-agri-green)] text-white px-4 py-2 rounded-lg hover:opacity-90 disabled:opacity-60"
                      >
                        <ShieldCheck size={12} />
                        {approving === rec.country ? "Aprobando..." : "Aprobar registro"}
                      </button>
                      <button
                        onClick={() => handleReject(rec.country)}
                        className="flex items-center gap-1.5 text-xs font-semibold bg-[var(--color-secondary)] text-white px-4 py-2 rounded-lg hover:opacity-90"
                      >
                        <XCircle size={12} /> Rechazar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function TabDocumentos() {
  const grouped = MOCK_DOCS.reduce<Record<DocType, DocumentEntry[]>>((acc, d) => {
    if (!acc[d.type]) acc[d.type] = [];
    acc[d.type].push(d);
    return acc;
  }, {} as Record<DocType, DocumentEntry[]>);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button className="flex items-center gap-2 bg-[var(--color-primary)] text-white text-xs font-medium px-4 py-2 rounded-lg hover:opacity-90">
          <Upload size={13} /> Subir documento
        </button>
      </div>

      {(Object.entries(grouped) as [DocType, DocumentEntry[]][]).map(([type, docs]) => (
        <div key={type} className="bg-white border border-[var(--color-border-subtle)] rounded-xl overflow-hidden">
          <div className="px-4 py-2.5 bg-[var(--color-surface-container-low)] border-b border-[var(--color-border-subtle)]">
            <p className="text-xs font-semibold">{DOC_LABELS[type]}</p>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="text-[10px] text-[var(--color-on-surface-variant)] border-b border-[var(--color-border-subtle)]">
                <th className="text-left px-4 py-2">Título</th>
                <th className="text-center px-3 py-2">Ver.</th>
                <th className="text-center px-3 py-2">Estado</th>
                <th className="text-left px-4 py-2 hidden sm:table-cell">Subido por</th>
                <th className="text-left px-4 py-2 hidden md:table-cell">Fecha</th>
                <th className="text-right px-4 py-2">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-subtle)]">
              {docs.map(doc => (
                <tr key={doc.id} className="hover:bg-[var(--color-surface-container-lowest)]">
                  <td className="px-4 py-2.5 font-medium">{doc.title}</td>
                  <td className="px-3 py-2.5 text-center">
                    <span className="bg-[var(--color-surface-container)] px-1.5 py-0.5 rounded text-[10px]">v{doc.version}</span>
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <StatusBadge status={doc.status} />
                  </td>
                  <td className="px-4 py-2.5 hidden sm:table-cell text-[var(--color-on-surface-variant)]">{doc.uploadedBy}</td>
                  <td className="px-4 py-2.5 hidden md:table-cell text-[var(--color-on-surface-variant)]">
                    {new Date(doc.uploadedAt).toLocaleDateString("es-CO")}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <a href={doc.fileUrl} className="text-[var(--color-primary)] hover:underline">Descargar</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

function TabHistorial() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <BookOpen size={14} className="text-amber-700 shrink-0" />
        <p className="text-xs text-amber-800">El historial es inmutable — cada acción queda registrada permanentemente con IP, usuario y diferencias de campos.</p>
      </div>
      <div className="space-y-2">
        {MOCK_HISTORY.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(entry => (
          <div key={entry.id} className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-xs font-bold bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-2 py-0.5 rounded">{entry.action}</span>
                  <span className="text-xs text-[var(--color-on-surface-variant)]">módulo: {entry.module}</span>
                  <span className="text-xs text-[var(--color-on-surface-variant)]">·</span>
                  <span className="text-xs text-[var(--color-on-surface-variant)]">rol: {entry.userRole}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-[var(--color-on-surface-variant)]">
                  <span>IP: {entry.ipAddress}</span>
                  <span>·</span>
                  <span>{new Date(entry.createdAt).toLocaleString("es-CO")}</span>
                </div>
              </div>
            </div>
            {(entry.fieldsBefore && Object.keys(entry.fieldsBefore).length > 0) && (
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="bg-red-50 border border-red-100 rounded-lg p-2.5">
                  <p className="text-[10px] font-semibold text-red-700 mb-1">Antes</p>
                  {Object.entries(entry.fieldsBefore).map(([k, v]) => (
                    <p key={k} className="text-[10px] text-red-800"><span className="font-medium">{k}:</span> {v}</p>
                  ))}
                </div>
                <div className="bg-green-50 border border-green-100 rounded-lg p-2.5">
                  <p className="text-[10px] font-semibold text-green-700 mb-1">Después</p>
                  {Object.entries(entry.fieldsAfter ?? {}).map(([k, v]) => (
                    <p key={k} className="text-[10px] text-green-800"><span className="font-medium">{k}:</span> {v}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wide">{label}</p>
      <p className="text-sm mt-0.5">{value ?? "—"}</p>
    </div>
  );
}

export default function FURPage() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("comercial");

  const status = MOCK_PRODUCT.status;
  const cfg = STATUS_CFG[status];
  const Icon = cfg.Icon;

  return (
    <div className="container-max py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[var(--color-on-surface-variant)] mb-6">
        <Link href="/regulatorio" className="hover:text-[var(--color-primary)]">Módulo Regulatorio</Link>
        <span>/</span>
        <span>FUR — {id}</span>
      </div>

      {/* Header */}
      <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-5 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <StatusBadge status={status} />
              <span className="text-xs text-[var(--color-on-surface-variant)]">{MOCK_PRODUCT.category}</span>
            </div>
            <h1 className="text-lg font-bold">{MOCK_PRODUCT.name}</h1>
            <p className="text-sm text-[var(--color-on-surface-variant)]">{MOCK_PRODUCT.brand} · {MOCK_PRODUCT.technicalName}</p>
          </div>
          <div className={`shrink-0 p-3 rounded-xl ${cfg.bg}`}>
            <Icon size={24} className={cfg.color} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl overflow-hidden">
        <div className="flex border-b border-[var(--color-border-subtle)] overflow-x-auto">
          {TABS.map(tab => {
            const TIcon = tab.Icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-medium shrink-0 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                    : "border-transparent text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]"
                }`}
              >
                <TIcon size={14} />{tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {activeTab === "comercial"   && <TabComercial />}
          {activeTab === "tecnico"     && <TabTecnico />}
          {activeTab === "regulatorio" && <TabRegulatorio />}
          {activeTab === "documentos"  && <TabDocumentos />}
          {activeTab === "historial"   && <TabHistorial />}
        </div>
      </div>
    </div>
  );
}
