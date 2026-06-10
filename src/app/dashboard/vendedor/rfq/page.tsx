"use client";

import { useState } from "react";
import { Search, Send, Clock, CheckCircle, XCircle, ChevronDown } from "lucide-react";

type RFQStatus = "nueva" | "respondida" | "aceptada" | "perdida" | "vencida";

interface RFQItem { product: string; qty: number; unit: string }
interface VendorRFQ {
  id: string; rfqNum: string; buyer: string; company: string;
  items: RFQItem[]; destCountry: string; destCity: string;
  deliveryDate: string; paymentTerms: string; status: RFQStatus;
  receivedAt: string; expiresAt: string; myOffer?: number; notes?: string;
}

const MOCK_RFQS: VendorRFQ[] = [
  { id: "r1", rfqNum: "RFQ-2026-0821", buyer: "Andrés Morales", company: "Finca Agroproductora SAS", items: [{ product: "Urea Granulada 46%", qty: 200, unit: "50kg" }, { product: "NPK 15-15-15", qty: 100, unit: "50kg" }], destCountry: "CO", destCity: "Bogotá", deliveryDate: "2026-06-25", paymentTerms: "30 días", status: "nueva", receivedAt: "2026-06-10", expiresAt: "2026-06-17" },
  { id: "r2", rfqNum: "RFQ-2026-0798", buyer: "Sandra López", company: "Agricorp Ecuador", items: [{ product: "Glifosato 480 SL", qty: 500, unit: "Lt" }], destCountry: "EC", destCity: "Guayaquil", deliveryDate: "2026-06-20", paymentTerms: "Contado", status: "respondida", receivedAt: "2026-06-08", expiresAt: "2026-06-15", myOffer: 21500 },
  { id: "r3", rfqNum: "RFQ-2026-0755", buyer: "Luis Castro", company: "Agroinsumos Venezuela", items: [{ product: "Trichoderma Harzianum", qty: 50, unit: "kg" }, { product: "Beauveria bassiana", qty: 30, unit: "kg" }], destCountry: "VE", destCity: "Valencia", deliveryDate: "2026-06-18", paymentTerms: "Crédito 60d", status: "aceptada", receivedAt: "2026-06-05", expiresAt: "2026-06-12", myOffer: 3110, notes: "Incluir certificados orgánicos" },
  { id: "r4", rfqNum: "RFQ-2026-0712", buyer: "Paola Vargas", company: "Distribuidora Agro Perú", items: [{ product: "Mancozeb 80% WP", qty: 1000, unit: "kg" }], destCountry: "PE", destCity: "Lima", deliveryDate: "2026-06-10", paymentTerms: "Contado", status: "perdida", receivedAt: "2026-06-01", expiresAt: "2026-06-08" },
];

const STATUS_CFG: Record<RFQStatus, { label: string; color: string; icon: React.ReactNode }> = {
  nueva: { label: "Nueva", color: "bg-blue-100 text-blue-700", icon: <Clock size={11} /> },
  respondida: { label: "Respondida", color: "bg-yellow-100 text-yellow-700", icon: <Send size={11} /> },
  aceptada: { label: "Aceptada", color: "bg-green-100 text-green-700", icon: <CheckCircle size={11} /> },
  perdida: { label: "Perdida", color: "bg-gray-100 text-gray-500", icon: <XCircle size={11} /> },
  vencida: { label: "Vencida", color: "bg-red-100 text-red-700", icon: <XCircle size={11} /> },
};

interface OfferModal { rfq: VendorRFQ }

export default function VendedorRFQPage() {
  const [rfqs, setRfqs] = useState(MOCK_RFQS);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("todas");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [offerModal, setOfferModal] = useState<OfferModal | null>(null);
  const [offerPrice, setOfferPrice] = useState("");
  const [offerNotes, setOfferNotes] = useState("");

  const filtered = rfqs.filter(r => {
    const q = r.rfqNum.includes(search) || r.company.toLowerCase().includes(search.toLowerCase()) || r.buyer.toLowerCase().includes(search.toLowerCase());
    const s = filterStatus === "todas" || r.status === filterStatus;
    return q && s;
  });

  function submitOffer() {
    if (!offerModal || !offerPrice) return;
    setRfqs(prev => prev.map(r => r.id === offerModal.rfq.id ? { ...r, status: "respondida" as RFQStatus, myOffer: parseFloat(offerPrice), notes: offerNotes } : r));
    setOfferModal(null); setOfferPrice(""); setOfferNotes("");
  }

  const newCount = rfqs.filter(r => r.status === "nueva").length;

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-center justify-between">
        <div><h1 className="text-headline-md font-bold">Solicitudes de Cotización (RFQ)</h1><p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">{newCount} nuevas sin responder</p></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[{ k: "todas", label: "Total" }, { k: "nueva", label: "Nuevas" }, { k: "respondida", label: "Respondidas" }, { k: "aceptada", label: "Aceptadas" }].map(({ k, label }) => (
          <button key={k} onClick={() => setFilterStatus(k)} className={`bg-white border rounded-xl p-3 text-left transition-colors ${filterStatus === k ? "border-[var(--color-primary)]" : "border-[var(--color-border-subtle)]"}`}>
            <p className="text-xl font-bold text-[var(--color-primary)]">{k === "todas" ? rfqs.length : rfqs.filter(r => r.status === k).length}</p>
            <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{label}</p>
          </button>
        ))}
      </div>

      <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4 flex gap-3">
        <div className="flex items-center gap-2 flex-1 border border-[var(--color-border-subtle)] rounded-lg px-3 py-2">
          <Search size={14} className="text-[var(--color-on-surface-variant)]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar RFQ, empresa, comprador..." className="text-sm flex-1 outline-none bg-transparent" />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map(rfq => {
          const cfg = STATUS_CFG[rfq.status];
          const isExp = expanded === rfq.id;
          const daysLeft = Math.ceil((new Date(rfq.expiresAt).getTime() - Date.now()) / 86400000);
          return (
            <div key={rfq.id} className="bg-white border border-[var(--color-border-subtle)] rounded-xl overflow-hidden">
              <div className="px-5 py-4 flex items-center gap-4 cursor-pointer" onClick={() => setExpanded(isExp ? null : rfq.id)}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm">{rfq.rfqNum}</span>
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${cfg.color}`}>{cfg.icon} {cfg.label}</span>
                    {rfq.status === "nueva" && daysLeft > 0 && <span className="text-xs text-orange-600 font-medium">Vence en {daysLeft}d</span>}
                  </div>
                  <p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">{rfq.company} · {rfq.buyer}</p>
                  <p className="text-xs text-[var(--color-on-surface-variant)]">{rfq.destCity}, {rfq.destCountry} · Entrega: {rfq.deliveryDate} · {rfq.paymentTerms}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-[var(--color-on-surface-variant)]">{rfq.items.length} producto{rfq.items.length !== 1 ? "s" : ""}</p>
                  {rfq.myOffer && <p className="font-bold text-sm text-green-700">${rfq.myOffer.toLocaleString("es-CO")}</p>}
                </div>
                <ChevronDown size={16} className={`text-[var(--color-on-surface-variant)] flex-shrink-0 transition-transform ${isExp ? "rotate-180" : ""}`} />
              </div>

              {isExp && (
                <div className="border-t border-[var(--color-border-subtle)] px-5 py-4 space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wide mb-2">Productos solicitados</p>
                    <div className="space-y-1">
                      {rfq.items.map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-sm py-1 border-b border-[var(--color-border-subtle)] last:border-0">
                          <span>{item.product}</span>
                          <span className="font-semibold">{item.qty} {item.unit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {rfq.notes && <div className="bg-blue-50 text-blue-700 text-sm rounded-lg px-3 py-2">Nota: {rfq.notes}</div>}
                  {rfq.myOffer && <div className="bg-green-50 text-green-700 text-sm rounded-lg px-3 py-2 font-medium">Tu oferta enviada: ${rfq.myOffer.toLocaleString("es-CO")} USD</div>}
                  <div className="flex gap-3">
                    {rfq.status === "nueva" && (
                      <button onClick={() => { setOfferModal({ rfq }); setOfferPrice(""); setOfferNotes(""); }} className="bg-[var(--color-primary)] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 flex items-center gap-1.5"><Send size={13} /> Responder oferta</button>
                    )}
                    {rfq.status === "respondida" && (
                      <button onClick={() => { setOfferModal({ rfq }); setOfferPrice(String(rfq.myOffer || "")); setOfferNotes(rfq.notes || ""); }} className="border border-[var(--color-primary)] text-[var(--color-primary)] text-sm font-medium px-4 py-2 rounded-lg hover:bg-[var(--color-primary)]/5">Modificar oferta</button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {offerModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div><h3 className="font-bold text-base">Responder oferta — {offerModal.rfq.rfqNum}</h3><p className="text-sm text-[var(--color-on-surface-variant)]">{offerModal.rfq.company}</p></div>
            <div className="bg-[var(--color-surface-container-low)] rounded-xl p-3 text-sm space-y-1">
              {offerModal.rfq.items.map((item, i) => <p key={i} className="flex justify-between"><span>{item.product}</span><span className="font-semibold">{item.qty} {item.unit}</span></p>)}
            </div>
            <div><label className="block text-sm font-medium mb-1.5">Precio total de oferta (USD) *</label>
              <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--color-on-surface-variant)]">$</span><input type="number" value={offerPrice} onChange={e => setOfferPrice(e.target.value)} placeholder="0.00" className="w-full border border-[var(--color-border-subtle)] rounded-lg pl-7 pr-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)]" /></div>
            </div>
            <div><label className="block text-sm font-medium mb-1.5">Condiciones / notas</label><textarea value={offerNotes} onChange={e => setOfferNotes(e.target.value)} rows={3} placeholder="Plazo de entrega, condiciones especiales, documentos incluidos..." className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] resize-none" /></div>
            <div className="flex gap-3">
              <button onClick={() => setOfferModal(null)} className="flex-1 border border-[var(--color-border-subtle)] text-sm font-medium py-2 rounded-lg hover:bg-gray-50">Cancelar</button>
              <button onClick={submitOffer} disabled={!offerPrice} className="flex-1 bg-[var(--color-primary)] text-white text-sm font-semibold py-2 rounded-lg hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-1.5"><Send size={13} /> Enviar oferta</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
