"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, DollarSign, Calculator } from "lucide-react";

const VENDORS = [
  { id: "v1", name: "DistAgroMax SAS", pendingOrders: 28, grossSales: 48500, defaultRate: 8 },
  { id: "v2", name: "AgroSuministros CO SAS", pendingOrders: 15, grossSales: 22100, defaultRate: 8 },
  { id: "v3", name: "BioSolutions Corp", pendingOrders: 9, grossSales: 12300, defaultRate: 5 },
];

export default function NuevaLiquidacionPage() {
  const router = useRouter();
  const [selectedVendor, setSelectedVendor] = useState("");
  const [commissionRate, setCommissionRate] = useState("");
  const [taxRate, setTaxRate] = useState("15.2");
  const [adjustments, setAdjustments] = useState("0");
  const [notes, setNotes] = useState("");
  const [period, setPeriod] = useState("Mayo 2026");
  const [saving, setSaving] = useState(false);

  const vendor = VENDORS.find(v => v.id === selectedVendor);
  const rate = parseFloat(commissionRate) || (vendor?.defaultRate || 8);
  const gross = vendor?.grossSales || 0;
  const commission = gross * rate / 100;
  const taxes = (gross - commission) * parseFloat(taxRate) / 100;
  const adj = parseFloat(adjustments) || 0;
  const net = gross - commission - taxes + adj;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    await new Promise(r => setTimeout(r, 1200));
    router.push("/dashboard/finanzas");
  }

  return (
    <div className="max-w-2xl space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/finanzas" className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft size={16} /></Link>
        <div><h1 className="text-headline-md font-bold">Nueva liquidación</h1><p className="text-sm text-[var(--color-on-surface-variant)]">Generar pago a vendedor</p></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-sm">Datos de la liquidación</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1.5">Vendedor *</label>
              <select value={selectedVendor} onChange={e => { setSelectedVendor(e.target.value); const v = VENDORS.find(x => x.id === e.target.value); if (v) setCommissionRate(String(v.defaultRate)); }} required className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)]">
                <option value="">Seleccionar vendedor</option>
                {VENDORS.map(v => <option key={v.id} value={v.id}>{v.name} — {v.pendingOrders} órdenes pendientes de liquidación</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Período</label>
              <input value={period} onChange={e => setPeriod(e.target.value)} className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)]" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Tasa de comisión (%)</label>
              <input type="number" step="0.1" value={commissionRate} onChange={e => setCommissionRate(e.target.value)} placeholder={vendor ? String(vendor.defaultRate) : "8"} className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)]" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Tasa retención impuesto (%)</label>
              <input type="number" step="0.1" value={taxRate} onChange={e => setTaxRate(e.target.value)} className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)]" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Ajustes (+ / -) USD</label>
              <input type="number" value={adjustments} onChange={e => setAdjustments(e.target.value)} placeholder="0" className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)]" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1.5">Notas / observaciones</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] resize-none" />
            </div>
          </div>
        </div>

        {/* Calculator */}
        {vendor && (
          <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-6 space-y-4">
            <h2 className="font-semibold text-sm flex items-center gap-2"><Calculator size={14} className="text-[var(--color-primary)]" /> Cálculo de la liquidación</h2>
            <div className="space-y-2">
              {[
                { label: "Ventas brutas del período", value: gross, color: "text-[var(--color-on-surface)]" },
                { label: `Comisión marketplace (${rate}%)`, value: -commission, color: "text-red-600" },
                { label: `Retención impuesto (${taxRate}%)`, value: -taxes, color: "text-red-600" },
                { label: `Ajustes`, value: adj, color: adj >= 0 ? "text-green-600" : "text-red-600" },
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between py-1.5 border-b border-[var(--color-border-subtle)] last:border-0">
                  <span className="text-sm text-[var(--color-on-surface-variant)]">{row.label}</span>
                  <span className={`text-sm font-semibold ${row.color}`}>{row.value >= 0 ? "" : "-"}${Math.abs(row.value).toLocaleString("es-CO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              ))}
              <div className="flex items-center justify-between pt-2">
                <span className="font-bold">Neto a pagar al vendedor</span>
                <span className="font-bold text-xl text-green-700">${net.toLocaleString("es-CO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
            <div className="bg-[var(--color-surface-container-low)] rounded-lg p-3 text-xs text-[var(--color-on-surface-variant)]">
              {vendor.pendingOrders} órdenes incluidas · Vendedor: {vendor.name}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <Link href="/dashboard/finanzas" className="text-sm text-[var(--color-on-surface-variant)]">Cancelar</Link>
          <button type="submit" disabled={saving || !selectedVendor} className="flex items-center gap-2 bg-[var(--color-primary)] text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 disabled:opacity-60"><DollarSign size={14} />{saving ? "Generando..." : "Generar liquidación"}</button>
        </div>
      </form>
    </div>
  );
}
