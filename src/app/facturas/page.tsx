"use client";

import { useState } from "react";
import { FileText, Download, Search, CheckCircle, Clock, XCircle } from "lucide-react";

type InvStatus = "pagada" | "pendiente" | "vencida" | "cancelada";

interface Invoice {
  id: string; number: string; orderNum: string; issueDate: string; dueDate: string;
  vendor: string; buyer: string; subtotal: number; taxes: number; total: number;
  status: InvStatus; currency: string;
}

const MOCK_INVOICES: Invoice[] = [
  { id: "i1", number: "FAC-2026-004521", orderNum: "ORD-2026-4521", issueDate: "2026-06-10", dueDate: "2026-07-10", vendor: "DistAgroMax SAS", buyer: "Hacienda El Palmar SAS", subtotal: 4080.67, taxes: 769.33, total: 4850.00, status: "pendiente", currency: "USD" },
  { id: "i2", number: "FAC-2026-004390", orderNum: "ORD-2026-4390", issueDate: "2026-06-05", dueDate: "2026-07-05", vendor: "AgroCaribe SAS", buyer: "Distribuciones Andinas", subtotal: 4705.88, taxes: 894.12, total: 5600.00, status: "pagada", currency: "USD" },
  { id: "i3", number: "FAC-2026-004290", orderNum: "ORD-2026-4290", issueDate: "2026-05-15", dueDate: "2026-06-15", vendor: "NutriPlant Ltda", buyer: "Finca El Progreso", subtotal: 756.30, taxes: 143.70, total: 900.00, status: "vencida", currency: "USD" },
  { id: "i4", number: "FAC-2026-004150", orderNum: "ORD-2026-4150", issueDate: "2026-05-01", dueDate: "2026-06-01", vendor: "BioSolutions Corp", buyer: "Agroinsumos Norte SRL", subtotal: 1033.61, taxes: 196.39, total: 1230.00, status: "pagada", currency: "USD" },
  { id: "i5", number: "FAC-2026-003980", orderNum: "ORD-2026-3980", issueDate: "2026-04-20", dueDate: "2026-05-20", vendor: "DistAgroMax SAS", buyer: "MicroAgro Coop", subtotal: 747.90, taxes: 142.10, total: 890.00, status: "cancelada", currency: "USD" },
];

const STATUS_CFG: Record<InvStatus, { label: string; color: string; icon: React.ReactNode }> = {
  pagada: { label: "Pagada", color: "bg-green-100 text-green-700", icon: <CheckCircle size={11} /> },
  pendiente: { label: "Pendiente", color: "bg-yellow-100 text-yellow-700", icon: <Clock size={11} /> },
  vencida: { label: "Vencida", color: "bg-red-100 text-red-700", icon: <XCircle size={11} /> },
  cancelada: { label: "Cancelada", color: "bg-gray-100 text-gray-500", icon: <XCircle size={11} /> },
};

export default function FacturasPage() {
  const [invoices] = useState(MOCK_INVOICES);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<InvStatus | "todos">("todos");

  const filtered = invoices.filter(i => {
    const q = i.number.toLowerCase().includes(search.toLowerCase()) || i.buyer.toLowerCase().includes(search.toLowerCase()) || i.vendor.toLowerCase().includes(search.toLowerCase());
    return q && (filterStatus === "todos" || i.status === filterStatus);
  });

  const totalPaid = invoices.filter(i => i.status === "pagada").reduce((s, i) => s + i.total, 0);
  const totalPending = invoices.filter(i => i.status === "pendiente").reduce((s, i) => s + i.total, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div><h1 className="text-2xl font-bold">Mis facturas</h1><p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">Documentos de facturación electrónica de tus compras y ventas</p></div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total facturado", value: `$${invoices.reduce((s, i) => s + i.total, 0).toLocaleString("es-CO", { minimumFractionDigits: 2 })}`, color: "text-[var(--color-primary)]" },
          { label: "Pagadas", value: `$${totalPaid.toLocaleString("es-CO", { minimumFractionDigits: 2 })}`, color: "text-green-600" },
          { label: "Por cobrar", value: `$${totalPending.toLocaleString("es-CO", { minimumFractionDigits: 2 })}`, color: "text-yellow-600" },
          { label: "Vencidas", value: invoices.filter(i => i.status === "vencida").length, color: "text-red-600" },
        ].map(k => (
          <div key={k.label} className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4"><p className={`text-xl font-bold ${k.color}`}>{k.value}</p><p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{k.label}</p></div>
        ))}
      </div>

      <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] border border-[var(--color-border-subtle)] rounded-lg px-3 py-2"><Search size={14} className="text-[var(--color-on-surface-variant)]" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por número, vendedor o comprador..." className="text-sm flex-1 outline-none bg-transparent" /></div>
        <div className="flex gap-1">
          {(["todos", "pendiente", "pagada", "vencida", "cancelada"] as const).map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize ${filterStatus === s ? "bg-[var(--color-primary)] text-white" : "border border-[var(--color-border-subtle)] hover:bg-gray-50"}`}>{s === "todos" ? "Todas" : STATUS_CFG[s as InvStatus].label}</button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map(inv => {
          const scfg = STATUS_CFG[inv.status];
          return (
            <div key={inv.id} className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-[var(--color-surface-container-low)] rounded-xl flex-shrink-0 flex items-center justify-center"><FileText size={18} className="text-[var(--color-primary)]" /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm font-mono">{inv.number}</span>
                  <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${scfg.color}`}>{scfg.icon} {scfg.label}</span>
                </div>
                <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{inv.buyer} ← {inv.vendor}</p>
                <div className="flex gap-4 mt-0.5 text-xs text-[var(--color-on-surface-variant)]">
                  <span>Emisión: {inv.issueDate}</span>
                  <span className={inv.status === "vencida" ? "text-red-600 font-medium" : ""}>Vence: {inv.dueDate}</span>
                  <span>Orden: {inv.orderNum}</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-base font-bold">${inv.total.toLocaleString("es-CO", { minimumFractionDigits: 2 })}</p>
                <p className="text-xs text-[var(--color-on-surface-variant)]">Subtotal: ${inv.subtotal.toLocaleString("es-CO", { minimumFractionDigits: 2 })}</p>
                <p className="text-xs text-[var(--color-on-surface-variant)]">IVA: ${inv.taxes.toLocaleString("es-CO", { minimumFractionDigits: 2 })}</p>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg text-[var(--color-on-surface-variant)] flex-shrink-0"><Download size={16} /></button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
