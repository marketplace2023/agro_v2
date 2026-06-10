"use client";

import { useState } from "react";
import { Search, CheckCircle, XCircle, AlertCircle, Download, RefreshCw } from "lucide-react";

type RecStatus = "conciliado" | "diferencia" | "pendiente" | "duplicado";

interface RecItem {
  id: string; orderNum: string; vendor: string; orderDate: string;
  orderAmount: number; systemAmount: number; bankAmount: number | null;
  status: RecStatus; diff: number; bankRef?: string;
}

const MOCK_ITEMS: RecItem[] = [
  { id: "r1", orderNum: "ORD-2026-4521", vendor: "DistAgroMax SAS", orderDate: "2026-06-01", orderAmount: 4850.00, systemAmount: 4850.00, bankAmount: 4850.00, status: "conciliado", diff: 0, bankRef: "TXN-20260601-001" },
  { id: "r2", orderNum: "ORD-2026-4498", vendor: "AgroSuministros CO", orderDate: "2026-06-02", orderAmount: 2210.00, systemAmount: 2210.00, bankAmount: 2190.00, status: "diferencia", diff: -20.00, bankRef: "TXN-20260602-007" },
  { id: "r3", orderNum: "ORD-2026-4490", vendor: "BioSolutions Corp", orderDate: "2026-06-03", orderAmount: 1230.00, systemAmount: 1230.00, bankAmount: null, status: "pendiente", diff: -1230.00 },
  { id: "r4", orderNum: "ORD-2026-4445", vendor: "DistAgroMax SAS", orderDate: "2026-06-04", orderAmount: 5600.00, systemAmount: 5600.00, bankAmount: 5600.00, status: "conciliado", diff: 0, bankRef: "TXN-20260604-002" },
  { id: "r5", orderNum: "ORD-2026-4402", vendor: "NutriPlant Ltda", orderDate: "2026-06-05", orderAmount: 880.00, systemAmount: 880.00, bankAmount: 880.00, status: "conciliado", diff: 0, bankRef: "TXN-20260605-015" },
  { id: "r6", orderNum: "ORD-2026-4390", vendor: "AgroCaribe SAS", orderDate: "2026-06-05", orderAmount: 1100.00, systemAmount: 1100.00, bankAmount: 2200.00, status: "duplicado", diff: 1100.00, bankRef: "TXN-20260605-016" },
];

const STATUS_CFG: Record<RecStatus, { label: string; color: string; icon: React.ReactNode }> = {
  conciliado: { label: "Conciliado", color: "bg-green-100 text-green-700", icon: <CheckCircle size={11} /> },
  diferencia: { label: "Diferencia", color: "bg-orange-100 text-orange-700", icon: <AlertCircle size={11} /> },
  pendiente: { label: "Sin pago", color: "bg-red-100 text-red-700", icon: <XCircle size={11} /> },
  duplicado: { label: "Duplicado", color: "bg-purple-100 text-purple-700", icon: <AlertCircle size={11} /> },
};

export default function ConciliacionPage() {
  const [items, setItems] = useState(MOCK_ITEMS);
  const [filterStatus, setFilterStatus] = useState<RecStatus | "todos">("todos");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = items.filter(i => {
    const q = i.orderNum.toLowerCase().includes(search.toLowerCase()) || i.vendor.toLowerCase().includes(search.toLowerCase());
    const s = filterStatus === "todos" || i.status === filterStatus;
    return q && s;
  });

  const totalOrders = items.reduce((s, i) => s + i.orderAmount, 0);
  const totalBank = items.reduce((s, i) => s + (i.bankAmount || 0), 0);
  const totalDiff = totalBank - totalOrders;
  const issues = items.filter(i => i.status !== "conciliado").length;

  function toggleSelect(id: string) { setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]); }
  function markResolved() { setItems(prev => prev.map(i => selected.includes(i.id) ? { ...i, status: "conciliado" as RecStatus, diff: 0 } : i)); setSelected([]); }

  return (
    <div className="space-y-5 max-w-7xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-headline-md font-bold">Conciliación bancaria</h1><p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">Período: Junio 2026 · {issues} items con inconsistencias</p></div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 border border-[var(--color-border-subtle)] text-sm font-medium px-3 py-2 rounded-lg hover:bg-gray-50"><RefreshCw size={14} /> Importar extracto</button>
          <button className="flex items-center gap-1.5 border border-[var(--color-border-subtle)] text-sm font-medium px-3 py-2 rounded-lg hover:bg-gray-50"><Download size={14} /> Exportar</button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total sistema", value: `$${totalOrders.toLocaleString("es-CO", { minimumFractionDigits: 2 })}`, color: "text-[var(--color-primary)]" },
          { label: "Total banco", value: `$${totalBank.toLocaleString("es-CO", { minimumFractionDigits: 2 })}`, color: "text-blue-600" },
          { label: "Diferencia neta", value: `${totalDiff >= 0 ? "+" : ""}$${totalDiff.toLocaleString("es-CO", { minimumFractionDigits: 2 })}`, color: totalDiff === 0 ? "text-green-600" : "text-red-600" },
          { label: "Items con error", value: String(issues), color: issues === 0 ? "text-green-600" : "text-orange-600" },
        ].map(k => (
          <div key={k.label} className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4"><p className={`text-xl font-bold ${k.color}`}>{k.value}</p><p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{k.label}</p></div>
        ))}
      </div>

      <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 flex-1 min-w-[180px] border border-[var(--color-border-subtle)] rounded-lg px-3 py-2"><Search size={14} className="text-[var(--color-on-surface-variant)]" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar orden o vendedor..." className="text-sm flex-1 outline-none bg-transparent" /></div>
        <div className="flex gap-1">
          {(["todos", "conciliado", "diferencia", "pendiente", "duplicado"] as const).map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors capitalize ${filterStatus === s ? "bg-[var(--color-primary)] text-white" : "border border-[var(--color-border-subtle)] hover:bg-gray-50"}`}>{s === "todos" ? "Todos" : STATUS_CFG[s].label}</button>
          ))}
        </div>
        {selected.length > 0 && <button onClick={markResolved} className="ml-auto text-sm font-semibold bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700">Marcar {selected.length} como resuelto</button>}
      </div>

      <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-container-low)]">
              <th className="px-4 py-3 w-10"><input type="checkbox" onChange={e => setSelected(e.target.checked ? filtered.map(i => i.id) : [])} checked={selected.length === filtered.length && filtered.length > 0} className="accent-[var(--color-primary)]" /></th>
              {["Orden", "Vendedor", "Fecha", "Monto sistema", "Monto banco", "Diferencia", "Ref. bancaria", "Estado"].map(h => <th key={h} className="px-4 py-3 text-xs font-semibold text-[var(--color-on-surface-variant)] text-left">{h}</th>)}
            </tr></thead>
            <tbody>
              {filtered.map((item, i) => {
                const cfg = STATUS_CFG[item.status];
                return (
                  <tr key={item.id} className={`border-b border-[var(--color-border-subtle)] last:border-0 ${i % 2 === 1 ? "bg-[#fafafa]" : ""} ${selected.includes(item.id) ? "bg-blue-50" : ""}`}>
                    <td className="px-4 py-3"><input type="checkbox" checked={selected.includes(item.id)} onChange={() => toggleSelect(item.id)} className="accent-[var(--color-primary)]" /></td>
                    <td className="px-4 py-3 font-mono text-xs font-semibold">{item.orderNum}</td>
                    <td className="px-4 py-3 text-xs text-[var(--color-on-surface-variant)]">{item.vendor}</td>
                    <td className="px-4 py-3 text-xs">{item.orderDate}</td>
                    <td className="px-4 py-3 text-sm font-semibold">${item.orderAmount.toLocaleString("es-CO", { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-3 text-sm">{item.bankAmount !== null ? `$${item.bankAmount.toLocaleString("es-CO", { minimumFractionDigits: 2 })}` : <span className="text-[var(--color-on-surface-variant)]">—</span>}</td>
                    <td className="px-4 py-3 text-sm font-semibold">
                      <span className={item.diff === 0 ? "text-green-600" : "text-red-600"}>{item.diff === 0 ? "✓" : `${item.diff > 0 ? "+" : ""}$${item.diff.toLocaleString("es-CO", { minimumFractionDigits: 2 })}`}</span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-[var(--color-on-surface-variant)]">{item.bankRef || "—"}</td>
                    <td className="px-4 py-3"><span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${cfg.color}`}>{cfg.icon} {cfg.label}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
