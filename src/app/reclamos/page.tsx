"use client";

import { useState } from "react";
import { Plus, Search, MessageSquare, Clock, CheckCircle, AlertCircle, ChevronDown, ChevronRight, Send } from "lucide-react";

type ClaimStatus = "abierto" | "en_revision" | "resuelto" | "cerrado";
type ClaimType = "producto_dañado" | "entrega_incorrecta" | "entrega_tardía" | "producto_faltante" | "calidad" | "otro";

interface ClaimMessage { author: string; role: "comprador" | "vendedor" | "soporte"; content: string; timestamp: string; }
interface Claim {
  id: string; orderNum: string; type: ClaimType; vendor: string;
  product: string; status: ClaimStatus; createdAt: string; updatedAt: string;
  description: string; messages: ClaimMessage[];
}

const MOCK_CLAIMS: Claim[] = [
  {
    id: "cl1", orderNum: "ORD-2026-4390", type: "producto_dañado", vendor: "AgroCaribe SAS",
    product: "NPK 15-15-15 Fertilizante 50Kg x10", status: "en_revision", createdAt: "2026-06-08", updatedAt: "2026-06-09",
    description: "Recibí 3 sacos de fertilizante con el empaque roto. El producto estaba contaminado con humedad.",
    messages: [
      { author: "Carlos Comprador", role: "comprador", content: "Recibí 3 sacos de fertilizante con el empaque roto. El producto estaba contaminado con humedad.", timestamp: "2026-06-08 14:00" },
      { author: "AgroCaribe SAS", role: "vendedor", content: "Lamentamos el inconveniente. Vamos a investigar qué ocurrió con el despacho. ¿Puede enviarnos fotos del daño?", timestamp: "2026-06-09 09:30" },
    ]
  },
  {
    id: "cl2", orderNum: "ORD-2026-4150", type: "entrega_tardía", vendor: "BioSolutions Corp",
    product: "Beauveria bassiana WP 1Kg x5", status: "resuelto", createdAt: "2026-05-20", updatedAt: "2026-05-28",
    description: "El pedido llegó 8 días después de la fecha acordada. Ya pasó el período crítico de aplicación.",
    messages: [
      { author: "Finca El Progreso", role: "comprador", content: "El pedido llegó 8 días tarde. Perdí la ventana de aplicación.", timestamp: "2026-05-20 10:00" },
      { author: "BioSolutions Corp", role: "vendedor", content: "Pedimos disculpas. Hubo un problema con el transportista. Ofrecemos un descuento del 15% en su próxima compra.", timestamp: "2026-05-25 11:00" },
      { author: "Finca El Progreso", role: "comprador", content: "Acepto el descuento. Gracias por la respuesta.", timestamp: "2026-05-28 09:00" },
    ]
  },
];

const STATUS_CFG: Record<ClaimStatus, { label: string; color: string; icon: React.ReactNode }> = {
  abierto: { label: "Abierto", color: "bg-red-100 text-red-700", icon: <AlertCircle size={11} /> },
  en_revision: { label: "En revisión", color: "bg-blue-100 text-blue-700", icon: <Clock size={11} /> },
  resuelto: { label: "Resuelto", color: "bg-green-100 text-green-700", icon: <CheckCircle size={11} /> },
  cerrado: { label: "Cerrado", color: "bg-gray-100 text-gray-500", icon: <CheckCircle size={11} /> },
};

const TYPE_LABELS: Record<ClaimType, string> = {
  producto_dañado: "Producto dañado", entrega_incorrecta: "Entrega incorrecta", entrega_tardía: "Entrega tardía",
  producto_faltante: "Producto faltante", calidad: "Problema de calidad", otro: "Otro",
};

export default function ReclamosPage() {
  const [claims, setClaims] = useState(MOCK_CLAIMS);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const filtered = claims.filter(c => c.orderNum.toLowerCase().includes(search.toLowerCase()) || c.product.toLowerCase().includes(search.toLowerCase()) || c.vendor.toLowerCase().includes(search.toLowerCase()));

  function sendReply(claimId: string) {
    if (!reply.trim()) return;
    setClaims(prev => prev.map(c => c.id === claimId ? { ...c, messages: [...c.messages, { author: "Yo", role: "comprador" as const, content: reply, timestamp: new Date().toLocaleString("es-CO") }] } : c));
    setReply("");
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Mis reclamos</h1><p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">{claims.filter(c => c.status !== "resuelto" && c.status !== "cerrado").length} reclamos activos</p></div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-[var(--color-secondary)] text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:opacity-90"><Plus size={15} /> Nuevo reclamo</button>
      </div>

      <div className="flex items-center gap-2 border border-[var(--color-border-subtle)] rounded-xl px-3 py-2.5"><Search size={14} className="text-[var(--color-on-surface-variant)]" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por orden, producto o vendedor..." className="text-sm flex-1 outline-none bg-transparent" /></div>

      <div className="space-y-3">
        {filtered.map(claim => {
          const scfg = STATUS_CFG[claim.status];
          return (
            <div key={claim.id} className="bg-white border border-[var(--color-border-subtle)] rounded-2xl overflow-hidden">
              <div className="p-4 cursor-pointer" onClick={() => setExpanded(expanded === claim.id ? null : claim.id)}>
                <div className="flex items-start gap-3">
                  {expanded === claim.id ? <ChevronDown size={16} className="mt-0.5 flex-shrink-0" /> : <ChevronRight size={16} className="mt-0.5 flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold">{claim.orderNum}</span>
                        <span className="text-xs bg-[var(--color-surface-container-low)] px-2 py-0.5 rounded">{TYPE_LABELS[claim.type]}</span>
                      </div>
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${scfg.color}`}>{scfg.icon} {scfg.label}</span>
                    </div>
                    <p className="text-sm font-medium mt-1">{claim.product}</p>
                    <div className="flex gap-3 text-xs text-[var(--color-on-surface-variant)] mt-0.5">
                      <span>{claim.vendor}</span>
                      <span>Abierto: {claim.createdAt}</span>
                      <span className="flex items-center gap-1"><MessageSquare size={10} />{claim.messages.length} mensajes</span>
                    </div>
                  </div>
                </div>
              </div>
              {expanded === claim.id && (
                <div className="border-t border-[var(--color-border-subtle)]">
                  <div className="p-4 max-h-64 overflow-y-auto space-y-3">
                    {claim.messages.map((msg, i) => (
                      <div key={i} className={`flex gap-2 ${msg.role === "comprador" ? "flex-row-reverse" : ""}`}>
                        <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${msg.role === "comprador" ? "bg-[var(--color-primary)] text-white" : msg.role === "soporte" ? "bg-purple-600 text-white" : "bg-gray-200"}`}>{msg.author.slice(0, 1)}</div>
                        <div className={`max-w-[75%] ${msg.role === "comprador" ? "items-end" : ""} flex flex-col gap-0.5`}>
                          <div className={`rounded-2xl px-3 py-2 text-sm ${msg.role === "comprador" ? "bg-[var(--color-primary)] text-white rounded-tr-none" : "bg-[var(--color-surface-container-low)] rounded-tl-none"}`}>{msg.content}</div>
                          <p className="text-xs text-[var(--color-on-surface-variant)] px-1">{msg.author} · {msg.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {claim.status !== "resuelto" && claim.status !== "cerrado" && (
                    <div className="border-t border-[var(--color-border-subtle)] p-3 flex gap-2">
                      <input value={reply} onChange={e => setReply(e.target.value)} onKeyDown={e => e.key === "Enter" && sendReply(claim.id)} placeholder="Escribe tu mensaje..." className="flex-1 border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]" />
                      <button onClick={() => sendReply(claim.id)} disabled={!reply.trim()} className="p-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 disabled:opacity-50"><Send size={15} /></button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-bold text-base">Nuevo reclamo</h3>
            <div className="space-y-3">
              <div><label className="block text-sm font-medium mb-1">Número de orden</label><input className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]" /></div>
              <div><label className="block text-sm font-medium mb-1">Tipo de reclamo</label><select className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 text-sm outline-none">{Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
              <div><label className="block text-sm font-medium mb-1">Descripción del problema</label><textarea rows={3} className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)] resize-none" /></div>
            </div>
            <div className="flex gap-3"><button onClick={() => setShowForm(false)} className="flex-1 border border-[var(--color-border-subtle)] text-sm font-medium py-2 rounded-lg">Cancelar</button><button onClick={() => setShowForm(false)} className="flex-1 bg-[var(--color-secondary)] text-white text-sm font-semibold py-2 rounded-lg">Enviar reclamo</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
