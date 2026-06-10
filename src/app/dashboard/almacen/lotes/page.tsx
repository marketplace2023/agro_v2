"use client";

import { useState } from "react";
import { Plus, Search, AlertTriangle, Package, Calendar, ChevronDown, ChevronRight } from "lucide-react";

type LoteStatus = "activo" | "cuarentena" | "vencido" | "agotado";

interface Lote {
  id: string; loteNum: string; product: string; sku: string; vendor: string;
  quantity: number; unitSize: string; manufacturingDate: string; expiryDate: string;
  entryDate: string; location: string; status: LoteStatus; temperature?: string;
  daysToExpiry: number;
}

const MOCK_LOTES: Lote[] = [
  { id: "l1", loteNum: "LOT-2026-00145", product: "Glifosato 480 SL", sku: "HRB-GLF-480-5L", vendor: "DistAgroMax SAS", quantity: 240, unitSize: "5L", manufacturingDate: "2026-01-15", expiryDate: "2028-01-15", entryDate: "2026-02-01", location: "Bodega A - Estante 12", status: "activo", daysToExpiry: 584 },
  { id: "l2", loteNum: "LOT-2026-00132", product: "NPK 15-15-15 Fertilizante", sku: "FRT-NPK-151515-50K", vendor: "AgroSuministros CO", quantity: 120, unitSize: "50Kg", manufacturingDate: "2026-03-01", expiryDate: "2027-03-01", entryDate: "2026-03-15", location: "Bodega B - Piso 2", status: "activo", daysToExpiry: 264 },
  { id: "l3", loteNum: "LOT-2026-00098", product: "Beauveria bassiana WP", sku: "BIO-BEA-WP-1K", vendor: "BioSolutions Corp", quantity: 50, unitSize: "1Kg", manufacturingDate: "2026-01-01", expiryDate: "2026-07-01", entryDate: "2026-01-20", location: "Bodega C - Refrigerado", status: "activo", temperature: "4-8°C", daysToExpiry: 21 },
  { id: "l4", loteNum: "LOT-2025-00789", product: "Abamectina 1.8 EC", sku: "ACA-ABA-18-1L", vendor: "DistAgroMax SAS", quantity: 0, unitSize: "1L", manufacturingDate: "2024-11-01", expiryDate: "2026-11-01", entryDate: "2024-11-15", location: "Bodega A - Estante 8", status: "agotado", daysToExpiry: 144 },
  { id: "l5", loteNum: "LOT-2024-00456", product: "Clorpirifos 480 EC", sku: "INS-CLR-480-1L", vendor: "PestControl SAS", quantity: 30, unitSize: "1L", manufacturingDate: "2022-06-01", expiryDate: "2024-06-01", entryDate: "2022-07-01", location: "Bodega A - Cuarentena", status: "vencido", daysToExpiry: -374 },
  { id: "l6", loteNum: "LOT-2026-00178", product: "Sulfato de Potasio 50%", sku: "FRT-SPO-50-25K", vendor: "NutriPlant Ltda", quantity: 80, unitSize: "25Kg", manufacturingDate: "2026-04-01", expiryDate: "2028-04-01", entryDate: "2026-04-10", location: "Bodega B - Piso 1", status: "cuarentena", daysToExpiry: 660 },
];

const STATUS_CFG: Record<LoteStatus, { label: string; color: string }> = {
  activo: { label: "Activo", color: "bg-green-100 text-green-700" },
  cuarentena: { label: "Cuarentena", color: "bg-yellow-100 text-yellow-700" },
  vencido: { label: "Vencido", color: "bg-red-100 text-red-700" },
  agotado: { label: "Agotado", color: "bg-gray-100 text-gray-500" },
};

export default function LotesPage() {
  const [lotes, setLotes] = useState(MOCK_LOTES);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<LoteStatus | "todos">("todos");
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = lotes.filter(l => {
    const q = l.loteNum.toLowerCase().includes(search.toLowerCase()) || l.product.toLowerCase().includes(search.toLowerCase()) || l.sku.toLowerCase().includes(search.toLowerCase());
    const s = filterStatus === "todos" || l.status === filterStatus;
    return q && s;
  });

  const expiringSoon = lotes.filter(l => l.daysToExpiry > 0 && l.daysToExpiry <= 60 && l.status === "activo").length;

  return (
    <div className="space-y-5 max-w-7xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-headline-md font-bold">Gestión de lotes</h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">{lotes.filter(l => l.status === "activo").length} lotes activos · {expiringSoon} próximos a vencer</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-[var(--color-primary)] text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:opacity-90"><Plus size={15} /> Registrar lote</button>
      </div>

      {expiringSoon > 0 && (
        <div className="flex items-center gap-3 bg-orange-50 border border-orange-200 text-orange-700 rounded-xl px-4 py-3">
          <AlertTriangle size={16} className="flex-shrink-0" />
          <p className="text-sm font-medium">{expiringSoon} lote{expiringSoon > 1 ? "s" : ""} vence{expiringSoon === 1 ? "" : "n"} en los próximos 60 días. Revisa y programa liquidación.</p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {([["activo", "Activos"], ["cuarentena", "Cuarentena"], ["vencido", "Vencidos"], ["agotado", "Agotados"]] as const).map(([k, label]) => (
          <button key={k} onClick={() => setFilterStatus(filterStatus === k ? "todos" : k)} className={`bg-white border rounded-xl p-3 text-left transition-colors ${filterStatus === k ? "border-[var(--color-primary)]" : "border-[var(--color-border-subtle)]"}`}>
            <p className={`text-xl font-bold ${STATUS_CFG[k].color.split(" ")[1]}`}>{lotes.filter(l => l.status === k).length}</p>
            <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{label}</p>
          </button>
        ))}
      </div>

      <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4 flex gap-3">
        <div className="flex items-center gap-2 flex-1 border border-[var(--color-border-subtle)] rounded-lg px-3 py-2"><Search size={14} className="text-[var(--color-on-surface-variant)]" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por lote, producto o SKU..." className="text-sm flex-1 outline-none bg-transparent" /></div>
      </div>

      <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-container-low)]">
            {["", "Lote", "Producto / SKU", "Proveedor", "Cantidad", "Vencimiento", "Ubicación", "Estado"].map(h => <th key={h} className="px-4 py-3 text-xs font-semibold text-[var(--color-on-surface-variant)] text-left">{h}</th>)}
          </tr></thead>
          <tbody>
            {filtered.map((lote, i) => {
              const cfg = STATUS_CFG[lote.status];
              const isExpiring = lote.daysToExpiry > 0 && lote.daysToExpiry <= 60;
              return (
                <>
                  <tr key={lote.id} className={`border-b border-[var(--color-border-subtle)] last:border-0 cursor-pointer hover:bg-[#fafafa] ${i % 2 === 1 ? "bg-[#fafafa]" : ""}`} onClick={() => setExpanded(expanded === lote.id ? null : lote.id)}>
                    <td className="px-4 py-3 text-[var(--color-on-surface-variant)]">{expanded === lote.id ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</td>
                    <td className="px-4 py-3 font-mono text-xs font-semibold">{lote.loteNum}</td>
                    <td className="px-4 py-3"><p className="font-medium text-sm">{lote.product}</p><p className="text-xs text-[var(--color-on-surface-variant)] font-mono">{lote.sku}</p></td>
                    <td className="px-4 py-3 text-xs text-[var(--color-on-surface-variant)]">{lote.vendor}</td>
                    <td className="px-4 py-3"><p className="font-semibold">{lote.quantity.toLocaleString()}</p><p className="text-xs text-[var(--color-on-surface-variant)]">{lote.unitSize}/ud.</p></td>
                    <td className="px-4 py-3">
                      <p className={`text-sm font-medium ${lote.daysToExpiry < 0 ? "text-red-600" : isExpiring ? "text-orange-600" : ""}`}>{lote.expiryDate}</p>
                      <p className={`text-xs ${lote.daysToExpiry < 0 ? "text-red-500" : isExpiring ? "text-orange-500" : "text-[var(--color-on-surface-variant)]"}`}>{lote.daysToExpiry < 0 ? `Vencido hace ${Math.abs(lote.daysToExpiry)}d` : isExpiring ? <span className="flex items-center gap-0.5"><AlertTriangle size={9} /> {lote.daysToExpiry}d restantes</span> : `${lote.daysToExpiry}d restantes`}</p>
                    </td>
                    <td className="px-4 py-3 text-xs">{lote.location}{lote.temperature && <p className="text-[var(--color-on-surface-variant)]">{lote.temperature}</p>}</td>
                    <td className="px-4 py-3"><span className={`inline-flex text-xs font-medium px-2 py-0.5 rounded-full ${cfg.color}`}>{cfg.label}</span></td>
                  </tr>
                  {expanded === lote.id && (
                    <tr key={`${lote.id}-expand`} className="bg-blue-50 border-b border-[var(--color-border-subtle)]">
                      <td colSpan={8} className="px-6 py-3">
                        <div className="flex gap-6 flex-wrap text-xs">
                          <div><p className="text-[var(--color-on-surface-variant)]">Fabricación</p><p className="font-medium">{lote.manufacturingDate}</p></div>
                          <div><p className="text-[var(--color-on-surface-variant)]">Ingreso al almacén</p><p className="font-medium">{lote.entryDate}</p></div>
                          <div className="flex gap-2 ml-auto">
                            <button className="px-2.5 py-1 bg-white border border-[var(--color-border-subtle)] rounded-lg text-xs font-medium hover:bg-gray-50">Mover ubicación</button>
                            <button onClick={() => setLotes(prev => prev.map(l => l.id === lote.id ? { ...l, status: "cuarentena" as LoteStatus } : l))} className="px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-xs font-medium hover:bg-yellow-200">Poner en cuarentena</button>
                            <button className="px-2.5 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100">Dar de baja</button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-bold text-base">Registrar nuevo lote</h3>
            <div className="space-y-3">
              {[["Número de lote", "text"], ["Producto / SKU", "text"], ["Proveedor", "text"], ["Cantidad", "number"], ["Fecha de fabricación", "date"], ["Fecha de vencimiento", "date"], ["Ubicación en almacén", "text"]].map(([label, type]) => (
                <div key={String(label)}><label className="block text-sm font-medium mb-1">{label}</label><input type={type} className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]" /></div>
              ))}
            </div>
            <div className="flex gap-3"><button onClick={() => setShowForm(false)} className="flex-1 border border-[var(--color-border-subtle)] text-sm font-medium py-2 rounded-lg">Cancelar</button><button onClick={() => setShowForm(false)} className="flex-1 bg-[var(--color-primary)] text-white text-sm font-semibold py-2 rounded-lg">Registrar</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
