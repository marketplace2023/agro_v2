"use client";

import { useState } from "react";
import { Plus, Search, AlertTriangle, CheckCircle, Clock, XCircle, Upload, Filter } from "lucide-react";

type RegStatus = "vigente" | "por_vencer" | "vencido" | "en_tramite" | "rechazado";

interface Registro {
  id: string; product: string; country: string; authority: string;
  registroNum: string; status: RegStatus; issuedAt: string; expiresAt: string;
  documents: string[]; notes?: string;
}

const MOCK_REGISTROS: Registro[] = [
  { id: "rg1", product: "Glifosato 480 SL Herbicida", country: "CO", authority: "ICA", registroNum: "ICA-REG-2019-00234", status: "vigente", issuedAt: "2019-06-15", expiresAt: "2029-06-14", documents: ["Ficha técnica", "SDS", "Etiqueta"] },
  { id: "rg2", product: "Glifosato 480 SL Herbicida", country: "EC", authority: "AGROCALIDAD", registroNum: "AGC-2021-HRB-00567", status: "por_vencer", issuedAt: "2021-03-10", expiresAt: "2026-09-10", documents: ["Ficha técnica", "SDS"] },
  { id: "rg3", product: "Trichoderma Harzianum Biocontrol", country: "CO", authority: "ICA", registroNum: "ICA-BIO-2022-00089", status: "vigente", issuedAt: "2022-01-20", expiresAt: "2027-01-19", documents: ["Ficha técnica", "SDS", "Certificado orgánico"] },
  { id: "rg4", product: "Mancozeb 80% WP Fungicida", country: "VE", authority: "INSAI", registroNum: "INSAI-FNG-2018-00112", status: "vencido", issuedAt: "2018-05-01", expiresAt: "2024-04-30", documents: ["Ficha técnica"] },
  { id: "rg5", product: "Urea Granulada 46%", country: "PE", authority: "SENASA", registroNum: "", status: "en_tramite", issuedAt: "", expiresAt: "", documents: [], notes: "Expediente ingresado el 2026-03-15. Respuesta esperada: 90 días hábiles." },
  { id: "rg6", product: "Clorpirifos 480 EC", country: "EC", authority: "AGROCALIDAD", registroNum: "AGC-2023-INS-00890", status: "rechazado", issuedAt: "", expiresAt: "", documents: [], notes: "Rechazado por restricción de clorpirifos en Ecuador desde 2024." },
];

const STATUS_CFG: Record<RegStatus, { label: string; color: string; icon: React.ReactNode }> = {
  vigente: { label: "Vigente", color: "bg-green-100 text-green-700", icon: <CheckCircle size={11} /> },
  por_vencer: { label: "Por vencer", color: "bg-orange-100 text-orange-700", icon: <AlertTriangle size={11} /> },
  vencido: { label: "Vencido", color: "bg-red-100 text-red-700", icon: <XCircle size={11} /> },
  en_tramite: { label: "En trámite", color: "bg-blue-100 text-blue-700", icon: <Clock size={11} /> },
  rechazado: { label: "Rechazado", color: "bg-gray-100 text-gray-500", icon: <XCircle size={11} /> },
};

export default function FabricanteRegistrosPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [filterCountry, setFilterCountry] = useState("todos");
  const [showForm, setShowForm] = useState(false);

  const filtered = MOCK_REGISTROS.filter(r => {
    const q = r.product.toLowerCase().includes(search.toLowerCase()) || r.registroNum.includes(search);
    const s = filterStatus === "todos" || r.status === filterStatus;
    const c = filterCountry === "todos" || r.country === filterCountry;
    return q && s && c;
  });

  const countries = [...new Set(MOCK_REGISTROS.map(r => r.country))];

  return (
    <div className="space-y-5 max-w-6xl">
      <div className="flex items-center justify-between">
        <div><h1 className="text-headline-md font-bold">Registros por País</h1><p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">Control de permisos de comercialización</p></div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-[var(--color-primary)] text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:opacity-90"><Plus size={15} /> Nuevo registro</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {(["todos", "vigente", "por_vencer", "vencido", "en_tramite"] as const).map(k => (
          <button key={k} onClick={() => setFilterStatus(k)} className={`bg-white border rounded-xl p-3 text-left transition-colors ${filterStatus === k ? "border-[var(--color-primary)]" : "border-[var(--color-border-subtle)]"}`}>
            <p className="text-xl font-bold text-[var(--color-primary)]">{k === "todos" ? MOCK_REGISTROS.length : MOCK_REGISTROS.filter(r => r.status === k).length}</p>
            <p className="text-xs text-[var(--color-on-surface-variant)] capitalize mt-0.5">{k === "todos" ? "Total" : STATUS_CFG[k].label}</p>
          </button>
        ))}
      </div>

      <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4 flex flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] border border-[var(--color-border-subtle)] rounded-lg px-3 py-2"><Search size={14} className="text-[var(--color-on-surface-variant)]" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar producto o número de registro..." className="text-sm flex-1 outline-none bg-transparent" /></div>
        <select value={filterCountry} onChange={e => setFilterCountry(e.target.value)} className="text-sm border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 outline-none"><option value="todos">Todos los países</option>{countries.map(c => <option key={c} value={c}>{c}</option>)}</select>
      </div>

      <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-container-low)]">
              {["Producto", "País / Autoridad", "Número registro", "Estado", "Emisión / Vence", "Documentos", ""].map(h => <th key={h} className="px-4 py-3 text-xs font-semibold text-[var(--color-on-surface-variant)] text-left">{h}</th>)}
            </tr></thead>
            <tbody>
              {filtered.map((r, i) => {
                const cfg = STATUS_CFG[r.status];
                const daysLeft = r.expiresAt ? Math.ceil((new Date(r.expiresAt).getTime() - Date.now()) / 86400000) : null;
                return (
                  <tr key={r.id} className={`border-b border-[var(--color-border-subtle)] last:border-0 ${i % 2 === 1 ? "bg-[#fafafa]" : ""}`}>
                    <td className="px-4 py-3 font-medium max-w-[200px]"><p className="truncate">{r.product}</p></td>
                    <td className="px-4 py-3"><p className="font-semibold">{r.country}</p><p className="text-xs text-[var(--color-on-surface-variant)]">{r.authority}</p></td>
                    <td className="px-4 py-3 font-mono text-xs">{r.registroNum || <span className="text-[var(--color-on-surface-variant)]">—</span>}</td>
                    <td className="px-4 py-3"><span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${cfg.color}`}>{cfg.icon} {cfg.label}</span>{r.status === "por_vencer" && daysLeft && <p className="text-xs text-orange-600 mt-0.5">{daysLeft}d restantes</p>}</td>
                    <td className="px-4 py-3 text-xs text-[var(--color-on-surface-variant)]">{r.issuedAt && <p>Emitido: {r.issuedAt}</p>}{r.expiresAt && <p>Vence: {r.expiresAt}</p>}{r.notes && <p className="text-blue-600 mt-0.5 max-w-[150px] truncate">{r.notes}</p>}</td>
                    <td className="px-4 py-3"><div className="flex flex-wrap gap-1">{r.documents.map(d => <span key={d} className="text-xs bg-[var(--color-surface-container-low)] px-1.5 py-0.5 rounded">{d}</span>)}</div></td>
                    <td className="px-4 py-3"><div className="flex gap-1">
                      <button className="p-1.5 hover:bg-gray-100 rounded-lg text-[var(--color-primary)]" title="Subir documento"><Upload size={13} /></button>
                      {r.status === "vencido" && <button className="text-xs font-medium text-blue-600 border border-blue-200 px-2 py-0.5 rounded-lg hover:bg-blue-50">Renovar</button>}
                    </div></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-bold text-base">Nuevo registro sanitario</h3>
            <div className="space-y-3">
              {[["Producto", "text"], ["País", "select"], ["Autoridad regulatoria", "text"], ["Número de registro", "text"], ["Fecha de emisión", "date"], ["Fecha de vencimiento", "date"]].map(([label, type]) => (
                <div key={String(label)}><label className="block text-sm font-medium mb-1">{label}</label>{type === "select" ? <select className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 text-sm outline-none"><option>Colombia</option><option>Venezuela</option><option>Ecuador</option><option>Perú</option></select> : <input type={type} className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]" />}</div>
              ))}
            </div>
            <div className="flex gap-3"><button onClick={() => setShowForm(false)} className="flex-1 border border-[var(--color-border-subtle)] text-sm font-medium py-2 rounded-lg">Cancelar</button><button onClick={() => setShowForm(false)} className="flex-1 bg-[var(--color-primary)] text-white text-sm font-semibold py-2 rounded-lg">Guardar</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
