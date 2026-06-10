"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Plus, X, Truck, Package } from "lucide-react";

const PENDING_ORDERS = [
  { id: "o1", orderNum: "ORD-2026-4521", company: "Agro Finca La Esperanza", address: "Cra 45 #78-23, Bogotá, CO", items: 3, weight: "120kg" },
  { id: "o2", orderNum: "ORD-2026-4498", company: "Hacienda El Palmar SAS", address: "Km 12 Vía Palmira, Cali, CO", items: 2, weight: "50kg" },
  { id: "o3", orderNum: "ORD-2026-4445", company: "Agroinsumos Norte SRL", address: "Av. Industrial 45, Barranquilla, CO", items: 4, weight: "200kg" },
];

const CARRIERS = ["Servientrega", "Deprisa", "Coordinadora", "DHL Express", "FedEx", "TCC", "Transportes propios"];

export default function NuevoDespachoPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [form, setForm] = useState({
    carrier: "", trackingNum: "", driverName: "", driverPhone: "",
    vehiclePlate: "", dispatchDate: new Date().toISOString().slice(0, 10),
    estimatedDelivery: "", route: "", notes: "", requiresRefrigeration: false,
    requiresSignature: true, insuranceValue: "",
  });

  function set(field: string, value: string | boolean) { setForm(prev => ({ ...prev, [field]: value })); }
  function toggleOrder(id: string) { setSelectedOrders(prev => prev.includes(id) ? prev.filter(o => o !== id) : [...prev, id]); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (selectedOrders.length === 0) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 1200));
    router.push("/dashboard/logistica");
  }

  const selectedData = PENDING_ORDERS.filter(o => selectedOrders.includes(o.id));
  const totalWeight = selectedData.reduce((sum, o) => sum + parseInt(o.weight), 0);

  return (
    <div className="max-w-3xl space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/logistica" className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft size={16} /></Link>
        <div><h1 className="text-headline-md font-bold">Nuevo despacho</h1><p className="text-sm text-[var(--color-on-surface-variant)]">Crear guía de despacho para órdenes pendientes</p></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Select orders */}
        <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-5 space-y-4">
          <h2 className="font-semibold text-sm flex items-center gap-2"><Package size={14} className="text-[var(--color-primary)]" /> Seleccionar órdenes para despacho</h2>
          <div className="space-y-2">
            {PENDING_ORDERS.map(order => (
              <div key={order.id} onClick={() => toggleOrder(order.id)} className={`border rounded-xl p-4 cursor-pointer transition-colors ${selectedOrders.includes(order.id) ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5" : "border-[var(--color-border-subtle)] hover:border-[var(--color-primary)]/50"}`}>
                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={selectedOrders.includes(order.id)} readOnly className="w-4 h-4 accent-[var(--color-primary)] flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div><p className="font-semibold text-sm">{order.orderNum}</p><p className="text-xs text-[var(--color-on-surface-variant)]">{order.company}</p></div>
                      <div className="text-right text-xs text-[var(--color-on-surface-variant)]"><p>{order.items} ítems · {order.weight}</p></div>
                    </div>
                    <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{order.address}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {selectedOrders.length > 0 && (
            <div className="bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20 rounded-lg px-4 py-2 text-sm">
              <span className="font-semibold text-[var(--color-primary)]">{selectedOrders.length} orden{selectedOrders.length !== 1 ? "es" : ""}</span> seleccionada{selectedOrders.length !== 1 ? "s" : ""} · Peso total estimado: <span className="font-semibold">{totalWeight}kg</span>
            </div>
          )}
        </div>

        {/* Transport info */}
        <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-5 space-y-4">
          <h2 className="font-semibold text-sm flex items-center gap-2"><Truck size={14} className="text-[var(--color-primary)]" /> Datos de transporte</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1.5">Transportista *</label><select value={form.carrier} onChange={e => set("carrier", e.target.value)} required className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)]"><option value="">Seleccionar</option>{CARRIERS.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
            <div><label className="block text-sm font-medium mb-1.5">Número de guía / tracking</label><input value={form.trackingNum} onChange={e => set("trackingNum", e.target.value)} placeholder="ej. SRV-2026-994521" className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none font-mono focus:border-[var(--color-primary)]" /></div>
            <div><label className="block text-sm font-medium mb-1.5">Conductor</label><input value={form.driverName} onChange={e => set("driverName", e.target.value)} placeholder="Nombre completo" className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)]" /></div>
            <div><label className="block text-sm font-medium mb-1.5">Teléfono conductor</label><input value={form.driverPhone} onChange={e => set("driverPhone", e.target.value)} placeholder="+57 310..." className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)]" /></div>
            <div><label className="block text-sm font-medium mb-1.5">Placa vehículo</label><input value={form.vehiclePlate} onChange={e => set("vehiclePlate", e.target.value.toUpperCase())} placeholder="ej. ABC-123" className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none font-mono focus:border-[var(--color-primary)]" /></div>
            <div><label className="block text-sm font-medium mb-1.5">Valor declarado (USD)</label><input type="number" value={form.insuranceValue} onChange={e => set("insuranceValue", e.target.value)} className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)]" /></div>
            <div><label className="block text-sm font-medium mb-1.5">Fecha de despacho *</label><input type="date" value={form.dispatchDate} onChange={e => set("dispatchDate", e.target.value)} required className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)]" /></div>
            <div><label className="block text-sm font-medium mb-1.5">Entrega estimada *</label><input type="date" value={form.estimatedDelivery} onChange={e => set("estimatedDelivery", e.target.value)} required className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)]" /></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium mb-1.5">Ruta / instrucciones de entrega</label><input value={form.route} onChange={e => set("route", e.target.value)} placeholder="ej. Bogotá → Ibagué → Neiva" className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)]" /></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium mb-1.5">Observaciones</label><textarea value={form.notes} onChange={e => set("notes", e.target.value)} rows={2} className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] resize-none" /></div>
          </div>
          <div className="flex gap-4 flex-wrap">
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.requiresRefrigeration} onChange={e => set("requiresRefrigeration", e.target.checked)} className="w-4 h-4 accent-[var(--color-primary)]" /><span className="text-sm font-medium">Requiere refrigeración</span></label>
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.requiresSignature} onChange={e => set("requiresSignature", e.target.checked)} className="w-4 h-4 accent-[var(--color-primary)]" /><span className="text-sm font-medium">Requiere firma de recepción</span></label>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Link href="/dashboard/logistica" className="text-sm text-[var(--color-on-surface-variant)]">Cancelar</Link>
          <button type="submit" disabled={saving || selectedOrders.length === 0} className="flex items-center gap-2 bg-[var(--color-primary)] text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 disabled:opacity-60"><Save size={14} />{saving ? "Creando..." : "Crear despacho"}</button>
        </div>
      </form>
    </div>
  );
}
