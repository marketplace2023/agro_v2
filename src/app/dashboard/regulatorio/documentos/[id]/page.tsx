"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText, CheckCircle, XCircle, Download, MessageSquare, Clock, AlertTriangle } from "lucide-react";

const MOCK_DOC = {
  id: "doc-001",
  type: "Registro de venta ICA",
  product: "Glifosato 480 SL Herbicida",
  sku: "HRB-GLF-480-5L",
  vendor: "DistAgroMax SAS",
  country: "CO",
  authority: "ICA — Instituto Colombiano Agropecuario",
  registroNum: "ICA-CO-HRB-20240115",
  issueDate: "2024-01-15",
  expiryDate: "2026-07-15",
  daysLeft: 35,
  status: "pendiente_revision" as "pendiente_revision" | "aprobado" | "rechazado" | "vencido",
  uploadedAt: "2026-06-05 10:30",
  uploadedBy: "María Vendedora (DistAgroMax SAS)",
  fileSize: "2.4 MB",
  fileName: "ICA-HRB-GLF-480-2024.pdf",
  notes: [
    { author: "Sistema", content: "Documento cargado para revisión regulatoria", timestamp: "2026-06-05 10:30", role: "sistema" as const },
    { author: "Ana Regulatoria", content: "Revisión iniciada. Verificando formato y datos del documento.", timestamp: "2026-06-07 14:00", role: "revisor" as const },
  ],
};

export default function DocumentoDetailPage() {
  const params = useParams();
  const [doc, setDoc] = useState(MOCK_DOC);
  const [rejectReason, setRejectReason] = useState("");
  const [note, setNote] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [notes, setNotes] = useState<{ author: string; content: string; timestamp: string; role: "sistema" | "revisor" | "vendedor" }[]>(MOCK_DOC.notes);

  function approve() { setDoc(prev => ({ ...prev, status: "aprobado" as const })); addNote("Sistema", "Documento aprobado por el revisor regulatorio.", "sistema"); }
  function reject() {
    if (!rejectReason.trim()) return;
    setDoc(prev => ({ ...prev, status: "rechazado" as const }));
    addNote("Ana Regulatoria", `Documento rechazado. Motivo: ${rejectReason}`, "revisor");
    setShowRejectForm(false); setRejectReason("");
  }
  function addNote(author: string, content: string, role: "sistema" | "revisor" | "vendedor") {
    setNotes(prev => [...prev, { author, content, timestamp: new Date().toLocaleString("es-CO"), role }]);
  }
  function sendNote() {
    if (!note.trim()) return;
    addNote("Ana Regulatoria", note, "revisor");
    setNote("");
  }

  const STATUS_CFG = {
    pendiente_revision: { label: "Pendiente de revisión", color: "bg-yellow-100 text-yellow-700", icon: <Clock size={14} /> },
    aprobado: { label: "Aprobado", color: "bg-green-100 text-green-700", icon: <CheckCircle size={14} /> },
    rechazado: { label: "Rechazado", color: "bg-red-100 text-red-700", icon: <XCircle size={14} /> },
    vencido: { label: "Vencido", color: "bg-gray-100 text-gray-600", icon: <AlertTriangle size={14} /> },
  };

  const scfg = STATUS_CFG[doc.status];

  return (
    <div className="max-w-5xl space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/regulatorio" className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft size={16} /></Link>
        <div className="flex-1"><h1 className="text-headline-md font-bold">{doc.type}</h1><p className="text-sm text-[var(--color-on-surface-variant)]">{doc.product}</p></div>
        <span className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full ${scfg.color}`}>{scfg.icon} {scfg.label}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl overflow-hidden">
            <div className="bg-[var(--color-surface-container-low)] px-6 py-10 flex flex-col items-center justify-center gap-3 border-b border-[var(--color-border-subtle)]">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center"><FileText size={32} className="text-red-600" /></div>
              <div className="text-center"><p className="font-bold text-sm">{doc.fileName}</p><p className="text-xs text-[var(--color-on-surface-variant)]">{doc.fileSize} · PDF</p></div>
              <button className="flex items-center gap-1.5 text-sm font-medium bg-white border border-[var(--color-border-subtle)] px-4 py-2 rounded-lg hover:bg-gray-50"><Download size={14} /> Descargar</button>
            </div>
            {doc.daysLeft > 0 && doc.daysLeft <= 60 && (
              <div className="flex items-center gap-2 bg-orange-50 px-4 py-2.5 text-orange-700 text-sm"><AlertTriangle size={14} /> Este documento vence en <strong>{doc.daysLeft} días</strong>. Recordar al vendedor que inicie la renovación.</div>
            )}
            {doc.status === "pendiente_revision" && (
              <div className="p-4 flex gap-3">
                <button onClick={approve} className="flex-1 flex items-center justify-center gap-1.5 bg-green-600 text-white font-semibold py-2.5 rounded-xl hover:bg-green-700"><CheckCircle size={16} /> Aprobar documento</button>
                <button onClick={() => setShowRejectForm(true)} className="flex-1 flex items-center justify-center gap-1.5 bg-red-600 text-white font-semibold py-2.5 rounded-xl hover:bg-red-700"><XCircle size={16} /> Rechazar</button>
              </div>
            )}
            {showRejectForm && (
              <div className="px-4 pb-4 space-y-2">
                <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} rows={3} placeholder="Explica el motivo del rechazo (se notificará al vendedor)..." className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-400 resize-none" />
                <div className="flex gap-2"><button onClick={() => setShowRejectForm(false)} className="flex-1 border border-[var(--color-border-subtle)] text-sm py-2 rounded-lg">Cancelar</button><button onClick={reject} disabled={!rejectReason.trim()} className="flex-1 bg-red-600 text-white text-sm font-semibold py-2 rounded-lg disabled:opacity-50">Confirmar rechazo</button></div>
              </div>
            )}
          </div>

          <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4 space-y-3">
            <h3 className="font-semibold text-sm flex items-center gap-1.5"><MessageSquare size={14} className="text-[var(--color-primary)]" /> Historial de revisión</h3>
            <div className="space-y-3">
              {notes.map((n, i) => (
                <div key={i} className={n.role === "sistema" ? "text-center" : "flex gap-2"}>
                  {n.role === "sistema" ? (
                    <p className="text-xs text-[var(--color-on-surface-variant)] bg-[var(--color-surface-container-low)] px-3 py-1 rounded-full inline-block">{n.content}</p>
                  ) : (
                    <><div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${n.role === "revisor" ? "bg-[var(--color-primary)] text-white" : "bg-gray-200"}`}>{n.author.slice(0, 1)}</div>
                      <div className="flex-1"><div className="bg-[var(--color-surface-container-low)] rounded-xl px-3 py-2 text-sm">{n.content}</div><p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5 px-1">{n.author} · {n.timestamp}</p></div></>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-1">
              <input value={note} onChange={e => setNote(e.target.value)} onKeyDown={e => e.key === "Enter" && sendNote()} placeholder="Agregar nota de revisión..." className="flex-1 border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]" />
              <button onClick={sendNote} disabled={!note.trim()} className="px-3 py-2 bg-[var(--color-primary)] text-white text-sm rounded-lg hover:opacity-90 disabled:opacity-50">Enviar</button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4 space-y-3">
            <h3 className="font-semibold text-sm">Datos del registro</h3>
            {[
              { label: "N° de registro", value: doc.registroNum },
              { label: "Autoridad", value: doc.authority },
              { label: "País", value: doc.country },
              { label: "Fecha de emisión", value: doc.issueDate },
              { label: "Fecha de vencimiento", value: doc.expiryDate },
              { label: "Días restantes", value: doc.daysLeft > 0 ? `${doc.daysLeft} días` : "Vencido" },
            ].map(d => (
              <div key={d.label}>
                <p className="text-xs text-[var(--color-on-surface-variant)]">{d.label}</p>
                <p className="text-sm font-medium">{d.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4 space-y-3">
            <h3 className="font-semibold text-sm">Producto y vendedor</h3>
            {[{ label: "Producto", value: doc.product }, { label: "SKU", value: doc.sku }, { label: "Vendedor", value: doc.vendor }, { label: "Cargado por", value: doc.uploadedBy }, { label: "Fecha de carga", value: doc.uploadedAt }].map(d => (
              <div key={d.label}><p className="text-xs text-[var(--color-on-surface-variant)]">{d.label}</p><p className="text-sm font-medium">{d.value}</p></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
