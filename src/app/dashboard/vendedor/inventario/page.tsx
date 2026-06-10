"use client";

import { useState } from "react";
import { Search, AlertTriangle, Plus, Edit3, Package } from "lucide-react";

interface StockItem {
  id: string; sku: string; name: string; category: string; unit: string;
  currentStock: number; minStock: number; pendingOrders: number;
  lastMovement: string; expiryDate?: string; lotNumber?: string;
}

const MOCK_INVENTORY: StockItem[] = [
  { id: "i1", sku: "HRB-GLF-480-5L", name: "Glifosato 480 SL Herbicida", category: "Herbicidas", unit: "Lt", currentStock: 240, minStock: 50, pendingOrders: 15, lastMovement: "2026-06-08", expiryDate: "2028-03-15", lotNumber: "LOT-2024-056" },
  { id: "i2", sku: "FRT-URE-46-50K", name: "Urea Granulada 46% Nitrógeno", category: "Fertilizantes", unit: "50kg", currentStock: 500, minStock: 100, pendingOrders: 30, lastMovement: "2026-06-09", lotNumber: "LOT-2024-089" },
  { id: "i3", sku: "BIO-TRI-HRZ-1K", name: "Trichoderma Harzianum Biocontrol", category: "Biológicos", unit: "kg", currentStock: 18, minStock: 25, pendingOrders: 5, lastMovement: "2026-06-05", expiryDate: "2026-09-01", lotNumber: "LOT-2024-102" },
  { id: "i4", sku: "FNG-MNZ-80-1K", name: "Mancozeb 80% WP Fungicida", category: "Fungicidas", unit: "kg", currentStock: 0, minStock: 30, pendingOrders: 8, lastMovement: "2026-05-20", expiryDate: "2027-12-31", lotNumber: "LOT-2023-445" },
  { id: "i5", sku: "INS-CLR-480-1L", name: "Clorpirifos 480 EC Insecticida", category: "Insecticidas", unit: "Lt", currentStock: 45, minStock: 20, pendingOrders: 0, lastMovement: "2026-06-01", expiryDate: "2026-08-15", lotNumber: "LOT-2024-033" },
];

interface AdjModal { item: StockItem; type: "entrada" | "salida" | "ajuste" }

export default function InventarioPage() {
  const [inventory, setInventory] = useState(MOCK_INVENTORY);
  const [search, setSearch] = useState("");
  const [filterAlert, setFilterAlert] = useState(false);
  const [modal, setModal] = useState<AdjModal | null>(null);
  const [adjQty, setAdjQty] = useState("");
  const [adjReason, setAdjReason] = useState("");

  const filtered = inventory.filter(i => {
    const matchQ = i.name.toLowerCase().includes(search.toLowerCase()) || i.sku.toLowerCase().includes(search.toLowerCase());
    return matchQ && (!filterAlert || i.currentStock <= i.minStock);
  });

  function applyAdj() {
    if (!modal || !adjQty) return;
    const qty = parseInt(adjQty);
    setInventory(prev => prev.map(i => {
      if (i.id !== modal.item.id) return i;
      const newStock = modal.type === "entrada" ? i.currentStock + qty : modal.type === "salida" ? Math.max(0, i.currentStock - qty) : qty;
      return { ...i, currentStock: newStock, lastMovement: new Date().toISOString().slice(0, 10) };
    }));
    setModal(null); setAdjQty(""); setAdjReason("");
  }

  const alerts = inventory.filter(i => i.currentStock <= i.minStock).length;
  const expiring = inventory.filter(i => i.expiryDate && (new Date(i.expiryDate).getTime() - Date.now()) / 86400000 <= 90).length;

  return (
    <div className="space-y-5 max-w-7xl">
      <div className="flex items-center justify-between">
        <div><h1 className="text-headline-md font-bold">Inventario</h1><p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">Gestión de stock y lotes</p></div>
        <button className="flex items-center gap-2 bg-[var(--color-primary)] text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:opacity-90"><Plus size={15} /> Entrada de stock</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[{ label: "Total SKUs", value: inventory.length, color: "text-[var(--color-primary)]" }, { label: "Alertas stock", value: alerts, color: "text-red-600" }, { label: "Por vencer (<90d)", value: expiring, color: "text-orange-600" }, { label: "Pedidos pendientes", value: inventory.reduce((s, i) => s + i.pendingOrders, 0), color: "text-blue-600" }].map(k => (
          <div key={k.label} className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4">
            <p className={`text-2xl font-bold ${k.color}`}>{k.value}</p>
            <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] border border-[var(--color-border-subtle)] rounded-lg px-3 py-2">
          <Search size={14} className="text-[var(--color-on-surface-variant)]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar producto o SKU..." className="text-sm flex-1 outline-none bg-transparent" />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={filterAlert} onChange={e => setFilterAlert(e.target.checked)} className="w-4 h-4 accent-[var(--color-secondary)]" />
          <span className="text-sm font-medium flex items-center gap-1"><AlertTriangle size={13} className="text-orange-500" /> Solo alertas</span>
        </label>
      </div>

      <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-container-low)]">
              {["Producto", "Stock actual", "Mínimo", "Pedidos", "Estado", "Lote / Vence", "Acciones"].map(h => (
                <th key={h} className="px-4 py-3 text-xs font-semibold text-[var(--color-on-surface-variant)] text-left">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map((item, i) => {
                const bad = item.currentStock === 0; const warn = !bad && item.currentStock < item.minStock;
                const expiringS = item.expiryDate && (new Date(item.expiryDate).getTime() - Date.now()) / 86400000 <= 90;
                return (
                  <tr key={item.id} className={`border-b border-[var(--color-border-subtle)] last:border-0 ${i % 2 === 1 ? "bg-[#fafafa]" : ""}`}>
                    <td className="px-4 py-3"><p className="font-medium">{item.name}</p><p className="text-xs text-[var(--color-on-surface-variant)]">{item.sku} · {item.category}</p></td>
                    <td className="px-4 py-3"><span className={`font-bold ${bad ? "text-red-600" : warn ? "text-orange-600" : "text-green-700"}`}>{item.currentStock}</span><span className="text-xs text-[var(--color-on-surface-variant)]"> {item.unit}</span></td>
                    <td className="px-4 py-3 text-sm text-[var(--color-on-surface-variant)]">{item.minStock} {item.unit}</td>
                    <td className="px-4 py-3"><span className={item.pendingOrders > 0 ? "font-semibold text-[var(--color-primary)]" : "text-[var(--color-on-surface-variant)]"}>{item.pendingOrders || "—"}</span></td>
                    <td className="px-4 py-3"><span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${bad ? "bg-red-100 text-red-700" : warn ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"}`}>{bad ? "Sin stock" : warn ? "Stock bajo" : "OK"}</span></td>
                    <td className="px-4 py-3">
                      {item.lotNumber && <p className="text-xs font-mono text-[var(--color-on-surface-variant)]">{item.lotNumber}</p>}
                      {item.expiryDate && <p className={`text-xs ${expiringS ? "text-orange-600 font-semibold" : "text-[var(--color-on-surface-variant)]"}`}>{expiringS && "⚠ "}Vence: {item.expiryDate}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => { setModal({ item, type: "entrada" }); setAdjQty(""); }} className="px-2 py-1 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-lg">+ Entrada</button>
                        <button onClick={() => { setModal({ item, type: "salida" }); setAdjQty(""); }} className="px-2 py-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg">- Salida</button>
                        <button onClick={() => { setModal({ item, type: "ajuste" }); setAdjQty(String(item.currentStock)); }} className="p-1.5 hover:bg-gray-100 rounded-lg text-[var(--color-on-surface-variant)]"><Edit3 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="text-center py-12 text-[var(--color-on-surface-variant)]"><Package size={32} className="mx-auto mb-2 opacity-30" /><p className="text-sm">No se encontraron ítems</p></div>}
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div><h3 className="font-bold text-base capitalize">{modal.type === "entrada" ? "Entrada de stock" : modal.type === "salida" ? "Salida de stock" : "Ajuste manual"}</h3><p className="text-sm text-[var(--color-on-surface-variant)]">{modal.item.name}</p><p className="text-xs text-[var(--color-on-surface-variant)]">Stock actual: <strong>{modal.item.currentStock} {modal.item.unit}</strong></p></div>
            <div><label className="block text-sm font-medium mb-1.5">{modal.type === "ajuste" ? "Nuevo total" : "Cantidad"} ({modal.item.unit})</label><input type="number" value={adjQty} onChange={e => setAdjQty(e.target.value)} min={0} className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)]" /></div>
            <div><label className="block text-sm font-medium mb-1.5">Motivo</label>
              <select value={adjReason} onChange={e => setAdjReason(e.target.value)} className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none">
                <option value="">Seleccionar...</option>
                {(modal.type === "entrada" ? ["Compra proveedor", "Devolución cliente", "Transferencia"] : modal.type === "salida" ? ["Venta confirmada", "Vencido", "Daño"] : ["Conteo físico", "Corrección"]).map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setModal(null)} className="flex-1 border border-[var(--color-border-subtle)] text-sm font-medium py-2 rounded-lg hover:bg-gray-50">Cancelar</button>
              <button onClick={applyAdj} disabled={!adjQty} className="flex-1 bg-[var(--color-primary)] text-white text-sm font-medium py-2 rounded-lg hover:opacity-90 disabled:opacity-60">Aplicar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
