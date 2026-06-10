"use client";

import { useState } from "react";
import { Search, Download, CreditCard, CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";

type PayStatus = "completado" | "pendiente" | "fallido" | "reembolsado";
type PayMethod = "stripe" | "transferencia" | "pse" | "efectivo";

interface Payment {
  id: string; orderNum: string; date: string; amount: number; currency: string;
  method: PayMethod; status: PayStatus; vendor: string; buyer: string;
  reference: string; description: string;
}

const MOCK_PAYMENTS: Payment[] = [
  { id: "p1", orderNum: "ORD-2026-4521", date: "2026-06-10 09:42", amount: 4850.00, currency: "USD", method: "stripe", status: "completado", vendor: "DistAgroMax SAS", buyer: "Hacienda El Palmar SAS", reference: "pi_3ABC123...", description: "Herbicidas y fertilizantes Q2" },
  { id: "p2", orderNum: "ORD-2026-4498", date: "2026-06-09 14:20", amount: 2210.00, currency: "USD", method: "transferencia", status: "pendiente", vendor: "AgroSuministros CO", buyer: "Agroinsumos Norte SRL", reference: "TRF-20260609-007", description: "NPK 15-15-15 Fertilizante" },
  { id: "p3", orderNum: "ORD-2026-4490", date: "2026-06-08 11:05", amount: 1230.00, currency: "USD", method: "pse", status: "completado", vendor: "BioSolutions Corp", buyer: "Finca El Progreso", reference: "PSE-884932", description: "Biológicos entomopatógenos" },
  { id: "p4", orderNum: "ORD-2026-4455", date: "2026-06-07 16:33", amount: 890.00, currency: "USD", method: "stripe", status: "fallido", vendor: "DistAgroMax SAS", buyer: "MicroAgro Coop", reference: "pi_FAILED...", description: "Insecticidas línea básica" },
  { id: "p5", orderNum: "ORD-2026-4390", date: "2026-06-05 10:00", amount: 5600.00, currency: "USD", method: "transferencia", status: "completado", vendor: "AgroCaribe SAS", buyer: "Distribuciones Andinas", reference: "TRF-20260605-002", description: "Pedido corporativo mensual" },
  { id: "p6", orderNum: "ORD-2026-4310", date: "2026-06-01 08:45", amount: 320.00, currency: "USD", method: "stripe", status: "reembolsado", vendor: "NutriPlant Ltda", buyer: "Finca La Esperanza", reference: "pi_REFUND...", description: "Devolución por producto dañado" },
];

const STATUS_CFG: Record<PayStatus, { label: string; color: string; icon: React.ReactNode }> = {
  completado: { label: "Completado", color: "bg-green-100 text-green-700", icon: <CheckCircle size={11} /> },
  pendiente: { label: "Pendiente", color: "bg-yellow-100 text-yellow-700", icon: <Clock size={11} /> },
  fallido: { label: "Fallido", color: "bg-red-100 text-red-700", icon: <XCircle size={11} /> },
  reembolsado: { label: "Reembolsado", color: "bg-purple-100 text-purple-700", icon: <AlertCircle size={11} /> },
};

const METHOD_LABELS: Record<PayMethod, string> = { stripe: "Tarjeta (Stripe)", transferencia: "Transferencia bancaria", pse: "PSE", efectivo: "Efectivo" };

export default function PagosPage() {
  const [payments] = useState(MOCK_PAYMENTS);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<PayStatus | "todos">("todos");

  const filtered = payments.filter(p => {
    const q = p.orderNum.toLowerCase().includes(search.toLowerCase()) || p.buyer.toLowerCase().includes(search.toLowerCase()) || p.reference.toLowerCase().includes(search.toLowerCase());
    return q && (filterStatus === "todos" || p.status === filterStatus);
  });

  const totalCompleted = payments.filter(p => p.status === "completado").reduce((s, p) => s + p.amount, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div><h1 className="text-2xl font-bold">Mis pagos</h1><p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">Historial de transacciones y estados de pago</p></div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Completados", value: `$${totalCompleted.toLocaleString("es-CO", { minimumFractionDigits: 2 })}`, color: "text-green-600" },
          { label: "Transacciones", value: payments.filter(p => p.status === "completado").length, color: "text-[var(--color-primary)]" },
          { label: "Pendientes", value: payments.filter(p => p.status === "pendiente").length, color: "text-yellow-600" },
          { label: "Fallidos", value: payments.filter(p => p.status === "fallido").length, color: "text-red-600" },
        ].map(k => (
          <div key={k.label} className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4"><p className={`text-xl font-bold ${k.color}`}>{k.value}</p><p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{k.label}</p></div>
        ))}
      </div>

      <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] border border-[var(--color-border-subtle)] rounded-lg px-3 py-2"><Search size={14} className="text-[var(--color-on-surface-variant)]" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por orden, comprador o referencia..." className="text-sm flex-1 outline-none bg-transparent" /></div>
        <div className="flex gap-1">
          {(["todos", "completado", "pendiente", "fallido", "reembolsado"] as const).map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize ${filterStatus === s ? "bg-[var(--color-primary)] text-white" : "border border-[var(--color-border-subtle)] hover:bg-gray-50"}`}>{s === "todos" ? "Todos" : STATUS_CFG[s as PayStatus].label}</button>
          ))}
        </div>
        <button className="flex items-center gap-1.5 text-sm font-medium border border-[var(--color-border-subtle)] px-3 py-2 rounded-lg hover:bg-gray-50 ml-auto"><Download size={14} /> Exportar</button>
      </div>

      <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-container-low)]">
            {["Orden", "Descripción", "Comprador → Vendedor", "Método", "Monto", "Estado", "Fecha"].map(h => <th key={h} className="px-4 py-3 text-xs font-semibold text-[var(--color-on-surface-variant)] text-left">{h}</th>)}
          </tr></thead>
          <tbody>
            {filtered.map((p, i) => {
              const scfg = STATUS_CFG[p.status];
              return (
                <tr key={p.id} className={`border-b border-[var(--color-border-subtle)] last:border-0 ${i % 2 === 1 ? "bg-[#fafafa]" : ""}`}>
                  <td className="px-4 py-3 font-mono text-xs font-semibold">{p.orderNum}</td>
                  <td className="px-4 py-3"><p className="text-xs">{p.description}</p><p className="text-xs font-mono text-[var(--color-on-surface-variant)] mt-0.5">{p.reference.slice(0, 18)}...</p></td>
                  <td className="px-4 py-3 text-xs"><p>{p.buyer}</p><p className="text-[var(--color-on-surface-variant)]">→ {p.vendor}</p></td>
                  <td className="px-4 py-3 text-xs"><div className="flex items-center gap-1"><CreditCard size={11} />{METHOD_LABELS[p.method]}</div></td>
                  <td className="px-4 py-3 font-semibold">${p.amount.toLocaleString("es-CO", { minimumFractionDigits: 2 })} {p.currency}</td>
                  <td className="px-4 py-3"><span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${scfg.color}`}>{scfg.icon} {scfg.label}</span></td>
                  <td className="px-4 py-3 text-xs text-[var(--color-on-surface-variant)]">{p.date}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
