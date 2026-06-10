"use client";

import { useState } from "react";
import { Search, CheckCircle, XCircle, Clock, Eye, AlertTriangle, Package, Filter } from "lucide-react";

type ProdStatus = "pendiente" | "aprobado" | "rechazado" | "bloqueado";

interface AdminProduct {
  id: string; name: string; sku: string; vendor: string; category: string;
  brand: string; isRegulated: boolean; isBiological: boolean;
  status: ProdStatus; submittedAt: string; reviewedAt?: string;
  regulatoryStatus: "ok" | "incompleto" | "vencido";
  docsCount: number; countries: string[];
}

const MOCK_PRODUCTS: AdminProduct[] = [
  { id: "p1", name: "Glifosato 480 SL Herbicida", sku: "HRB-GLF-480-5L", vendor: "DistAgroMax SAS", category: "Herbicidas", brand: "AgroQuim", isRegulated: true, isBiological: false, status: "aprobado", submittedAt: "2026-01-15", reviewedAt: "2026-01-17", regulatoryStatus: "ok", docsCount: 4, countries: ["CO", "VE", "EC"] },
  { id: "p2", name: "NPK 15-15-15 Fertilizante", sku: "FRT-NPK-151515-50K", vendor: "AgroSuministros CO", category: "Fertilizantes", brand: "Fertiagro", isRegulated: false, isBiological: false, status: "pendiente", submittedAt: "2026-06-08", regulatoryStatus: "ok", docsCount: 2, countries: ["CO"] },
  { id: "p3", name: "Beauveria bassiana WP Entomopatógeno", sku: "BIO-BEA-WP-1K", vendor: "BioSolutions Corp", category: "Biológicos", brand: "BioSolutions", isRegulated: true, isBiological: true, status: "pendiente", submittedAt: "2026-06-07", regulatoryStatus: "incompleto", docsCount: 1, countries: ["CO", "EC"] },
  { id: "p4", name: "Clorpirifos 480 EC Insecticida", sku: "INS-CLR-480-1L", vendor: "PestControl SAS", category: "Insecticidas", brand: "PestControl", isRegulated: true, isBiological: false, status: "rechazado", submittedAt: "2026-05-20", reviewedAt: "2026-05-22", regulatoryStatus: "vencido", docsCount: 3, countries: [] },
  { id: "p5", name: "Abamectina 1.8 EC Acaricida", sku: "ACA-ABA-18-1L", vendor: "DistAgroMax SAS", category: "Insecticidas", brand: "AgroQuim", isRegulated: true, isBiological: false, status: "bloqueado", submittedAt: "2026-04-10", reviewedAt: "2026-04-12", regulatoryStatus: "vencido", docsCount: 2, countries: ["CO"] },
  { id: "p6", name: "Sulfato de Potasio 50% K2O", sku: "FRT-SPO-50-25K", vendor: "NutriPlant Ltda", category: "Fertilizantes", brand: "NutriPlant", isRegulated: false, isBiological: false, status: "pendiente", submittedAt: "2026-06-09", regulatoryStatus: "ok", docsCount: 2, countries: ["CO", "VE", "PE"] },
];

const STATUS_CFG: Record<ProdStatus, { label: string; color: string; icon: React.ReactNode }> = {
  pendiente: { label: "En revisión", color: "bg-yellow-100 text-yellow-700", icon: <Clock size={11} /> },
  aprobado: { label: "Aprobado", color: "bg-green-100 text-green-700", icon: <CheckCircle size={11} /> },
  rechazado: { label: "Rechazado", color: "bg-red-100 text-red-700", icon: <XCircle size={11} /> },
  bloqueado: { label: "Bloqueado", color: "bg-gray-100 text-gray-600", icon: <AlertTriangle size={11} /> },
};

export default function AdminProductosPage() {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [filterCat, setFilterCat] = useState("todas");
  const [reviewModal, setReviewModal] = useState<{ product: AdminProduct; action: "aprobar" | "rechazar" } | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const filtered = products.filter(p => {
    const q = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()) || p.vendor.toLowerCase().includes(search.toLowerCase());
    const s = filterStatus === "todos" || p.status === filterStatus;
    const c = filterCat === "todas" || p.category === filterCat;
    return q && s && c;
  });

  const categories = [...new Set(MOCK_PRODUCTS.map(p => p.category))];

  function processReview() {
    if (!reviewModal) return;
    setProducts(prev => prev.map(p => p.id === reviewModal.product.id ? { ...p, status: reviewModal.action === "aprobar" ? "aprobado" as ProdStatus : "rechazado" as ProdStatus, reviewedAt: new Date().toISOString().slice(0, 10) } : p));
    setReviewModal(null); setRejectReason("");
  }

  return (
    <div className="space-y-5 max-w-7xl">
      <div><h1 className="text-headline-md font-bold">Moderación de catálogo</h1><p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">{products.filter(p => p.status === "pendiente").length} productos pendientes de revisión</p></div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(["todos", "pendiente", "aprobado", "rechazado"] as const).map(k => (
          <button key={k} onClick={() => setFilterStatus(k)} className={`bg-white border rounded-xl p-3 text-left transition-colors ${filterStatus === k ? "border-[var(--color-primary)]" : "border-[var(--color-border-subtle)]"}`}>
            <p className="text-xl font-bold text-[var(--color-primary)]">{k === "todos" ? products.length : products.filter(p => p.status === k).length}</p>
            <p className="text-xs text-[var(--color-on-surface-variant)] capitalize mt-0.5">{k === "todos" ? "Total" : STATUS_CFG[k].label}</p>
          </button>
        ))}
      </div>

      <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4 flex flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] border border-[var(--color-border-subtle)] rounded-lg px-3 py-2"><Search size={14} className="text-[var(--color-on-surface-variant)]" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar producto, SKU o vendedor..." className="text-sm flex-1 outline-none bg-transparent" /></div>
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="text-sm border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 outline-none"><option value="todas">Todas las categorías</option>{categories.map(c => <option key={c} value={c}>{c}</option>)}</select>
      </div>

      <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-container-low)]">
              {["Producto", "Vendedor", "Categoría", "Tipo", "Docs / Países", "Estado regulatorio", "Estado", "Acciones"].map(h => <th key={h} className="px-4 py-3 text-xs font-semibold text-[var(--color-on-surface-variant)] text-left">{h}</th>)}
            </tr></thead>
            <tbody>
              {filtered.map((p, i) => {
                const scfg = STATUS_CFG[p.status];
                const regBadge = p.regulatoryStatus === "ok" ? "text-green-700" : p.regulatoryStatus === "incompleto" ? "text-orange-600" : "text-red-600";
                return (
                  <tr key={p.id} className={`border-b border-[var(--color-border-subtle)] last:border-0 ${i % 2 === 1 ? "bg-[#fafafa]" : ""}`}>
                    <td className="px-4 py-3"><p className="font-medium text-sm">{p.name}</p><p className="text-xs font-mono text-[var(--color-on-surface-variant)]">{p.sku}</p></td>
                    <td className="px-4 py-3 text-xs">{p.vendor}</td>
                    <td className="px-4 py-3 text-xs text-[var(--color-on-surface-variant)]">{p.category}</td>
                    <td className="px-4 py-3"><div className="flex flex-col gap-0.5">{p.isRegulated && <span className="text-xs bg-red-50 text-red-600 px-1.5 py-0.5 rounded font-medium w-fit">Regulado</span>}{p.isBiological && <span className="text-xs bg-green-50 text-green-700 px-1.5 py-0.5 rounded font-medium w-fit">Biológico</span>}</div></td>
                    <td className="px-4 py-3 text-xs"><p>{p.docsCount} documentos</p><p className="text-[var(--color-on-surface-variant)]">{p.countries.length > 0 ? p.countries.join(", ") : "Sin países"}</p></td>
                    <td className="px-4 py-3"><span className={`text-xs font-semibold ${regBadge}`}>{p.regulatoryStatus === "ok" ? "✓ Completo" : p.regulatoryStatus === "incompleto" ? "⚠ Incompleto" : "✕ Vencido"}</span></td>
                    <td className="px-4 py-3"><span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${scfg.color}`}>{scfg.icon} {scfg.label}</span><p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">Enviado: {p.submittedAt}</p></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button className="p-1.5 hover:bg-gray-100 rounded-lg text-[var(--color-primary)]"><Eye size={13} /></button>
                        {p.status === "pendiente" && (<>
                          <button onClick={() => setReviewModal({ product: p, action: "aprobar" })} className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-lg hover:bg-green-200">Aprobar</button>
                          <button onClick={() => setReviewModal({ product: p, action: "rechazar" })} className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-lg hover:bg-red-200">Rechazar</button>
                        </>)}
                        {p.status === "aprobado" && <button onClick={() => setProducts(prev => prev.map(x => x.id === p.id ? { ...x, status: "bloqueado" as ProdStatus } : x))} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-200">Bloquear</button>}
                        {p.status === "bloqueado" && <button onClick={() => setProducts(prev => prev.map(x => x.id === p.id ? { ...x, status: "aprobado" as ProdStatus } : x))} className="px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-lg hover:bg-green-100">Restaurar</button>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {reviewModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <h3 className="font-bold text-base">{reviewModal.action === "aprobar" ? "Aprobar" : "Rechazar"} producto</h3>
            <p className="text-sm text-[var(--color-on-surface-variant)]">{reviewModal.product.name}</p>
            {reviewModal.action === "rechazar" && <div><label className="block text-sm font-medium mb-1.5">Motivo de rechazo</label><textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} rows={3} placeholder="Explica el motivo al vendedor..." className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] resize-none" /></div>}
            <div className="flex gap-3">
              <button onClick={() => setReviewModal(null)} className="flex-1 border border-[var(--color-border-subtle)] text-sm font-medium py-2 rounded-lg">Cancelar</button>
              <button onClick={processReview} className={`flex-1 text-white text-sm font-semibold py-2 rounded-lg ${reviewModal.action === "aprobar" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}>{reviewModal.action === "aprobar" ? "Aprobar" : "Rechazar"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
