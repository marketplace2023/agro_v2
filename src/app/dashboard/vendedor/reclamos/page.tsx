"use client";

import { useState } from "react";
import { AlertTriangle, MessageSquare, CheckCircle, Clock, Search, ChevronDown, Send } from "lucide-react";

type ReclamoStatus = "abierto" | "en_revision" | "resuelto" | "cerrado";
type ReclamoType = "calidad" | "entrega" | "faltante" | "dañado" | "otro";

interface Reclamo {
  id: string; ticketNum: string; orderNum: string; buyer: string;
  company: string; type: ReclamoType; description: string;
  status: ReclamoStatus; priority: "alta" | "media" | "baja";
  createdAt: string; updatedAt: string;
  messages: { from: "buyer" | "vendor" | "admin"; text: string; at: string }[];
}

const MOCK_RECLAMOS: Reclamo[] = [
  { id: "rc1", ticketNum: "TKT-2026-1234", orderNum: "ORD-2026-4380", buyer: "Ana Torres", company: "Distribuidora Agro Ecuador", type: "calidad", description: "El producto llegó con envases dañados, se derramó aproximadamente el 20% del contenido.", status: "en_revision", priority: "alta", createdAt: "2026-06-08", updatedAt: "2026-06-10", messages: [{ from: "buyer", text: "Adjunto fotos del daño. Solicito reposición o descuento.", at: "2026-06-08 10:23" }, { from: "vendor", text: "Revisamos el caso. Confirmaremos en 24h.", at: "2026-06-08 14:45" }] },
  { id: "rc2", ticketNum: "TKT-2026-1189", orderNum: "ORD-2026-4312", buyer: "Pedro Vargas", company: "Finca Productora Venezuela", type: "faltante", description: "Solo recibí 8 de los 10 bultos de NPK 15-15-15 pedidos.", status: "abierto", priority: "media", createdAt: "2026-06-06", updatedAt: "2026-06-06", messages: [{ from: "buyer", text: "Faltan 2 bultos de 50kg. Por favor enviar el complemento.", at: "2026-06-06 09:11" }] },
  { id: "rc3", ticketNum: "TKT-2026-1045", orderNum: "ORD-2026-4200", buyer: "Luis Mendez", company: "AgroTech Perú SA", type: "entrega", description: "La entrega se retrasó 5 días del plazo acordado, afectando el plan de aplicación.", status: "resuelto", priority: "baja", createdAt: "2026-05-25", updatedAt: "2026-05-30", messages: [{ from: "buyer", text: "El retraso causó pérdidas en el cultivo.", at: "2026-05-25 16:00" }, { from: "vendor", text: "Aplicamos descuento del 5% por demora. Adjunto nota de crédito.", at: "2026-05-28 11:30" }, { from: "buyer", text: "Aceptado, gracias.", at: "2026-05-30 09:00" }] },
];

const STATUS_CFG: Record<ReclamoStatus, { label: string; color: string; icon: React.ReactNode }> = {
  abierto: { label: "Abierto", color: "bg-red-100 text-red-700", icon: <AlertTriangle size={11} /> },
  en_revision: { label: "En revisión", color: "bg-yellow-100 text-yellow-700", icon: <Clock size={11} /> },
  resuelto: { label: "Resuelto", color: "bg-green-100 text-green-700", icon: <CheckCircle size={11} /> },
  cerrado: { label: "Cerrado", color: "bg-gray-100 text-gray-500", icon: <CheckCircle size={11} /> },
};

const PRIORITY_CFG = {
  alta: "text-red-600 font-semibold",
  media: "text-orange-500 font-medium",
  baja: "text-gray-500",
};

const TYPE_LABEL: Record<ReclamoType, string> = {
  calidad: "Calidad del producto", entrega: "Problema de entrega", faltante: "Producto faltante", dañado: "Producto dañado", otro: "Otro",
};

export default function VendedorReclamosPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [reclamos, setReclamos] = useState(MOCK_RECLAMOS);

  const filtered = reclamos.filter(r => {
    const q = r.ticketNum.includes(search) || r.buyer.toLowerCase().includes(search.toLowerCase()) || r.company.toLowerCase().includes(search.toLowerCase());
    const s = filterStatus === "todos" || r.status === filterStatus;
    return q && s;
  });

  function sendReply(id: string) {
    const text = replyText[id];
    if (!text?.trim()) return;
    setReclamos(prev => prev.map(r => r.id === id ? { ...r, messages: [...r.messages, { from: "vendor", text, at: new Date().toLocaleString("es-CO") }], updatedAt: new Date().toISOString().slice(0, 10), status: "en_revision" as ReclamoStatus } : r));
    setReplyText(prev => ({ ...prev, [id]: "" }));
  }

  return (
    <div className="space-y-5 max-w-4xl">
      <div><h1 className="text-headline-md font-bold">Reclamos</h1><p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">Gestión de incidencias con compradores</p></div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(["todos", "abierto", "en_revision", "resuelto"] as const).map(k => (
          <button key={k} onClick={() => setFilterStatus(k)} className={`bg-white border rounded-xl p-3 text-left transition-colors ${filterStatus === k ? "border-[var(--color-primary)]" : "border-[var(--color-border-subtle)]"}`}>
            <p className="text-xl font-bold text-[var(--color-primary)]">{k === "todos" ? reclamos.length : reclamos.filter(r => r.status === k).length}</p>
            <p className="text-xs text-[var(--color-on-surface-variant)] capitalize mt-0.5">{k === "todos" ? "Total" : STATUS_CFG[k].label}</p>
          </button>
        ))}
      </div>

      <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4 flex gap-3">
        <div className="flex items-center gap-2 flex-1 border border-[var(--color-border-subtle)] rounded-lg px-3 py-2">
          <Search size={14} className="text-[var(--color-on-surface-variant)]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar ticket, comprador, empresa..." className="text-sm flex-1 outline-none bg-transparent" />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map(r => {
          const cfg = STATUS_CFG[r.status];
          const isExp = expanded === r.id;
          return (
            <div key={r.id} className="bg-white border border-[var(--color-border-subtle)] rounded-xl overflow-hidden">
              <div className="px-5 py-4 flex items-start gap-4 cursor-pointer" onClick={() => setExpanded(isExp ? null : r.id)}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap"><span className="font-bold text-sm">{r.ticketNum}</span><span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${cfg.color}`}>{cfg.icon} {cfg.label}</span><span className={`text-xs ${PRIORITY_CFG[r.priority]}`}>Prioridad {r.priority}</span></div>
                  <p className="font-medium text-sm mt-0.5">{TYPE_LABEL[r.type]}</p>
                  <p className="text-xs text-[var(--color-on-surface-variant)]">{r.company} · {r.buyer} · Orden: {r.orderNum}</p>
                  <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{r.description.slice(0, 80)}...</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-[var(--color-on-surface-variant)]">Abierto: {r.createdAt}</p>
                  <div className="flex items-center gap-1 justify-end mt-1"><MessageSquare size={11} className="text-[var(--color-on-surface-variant)]" /><span className="text-xs text-[var(--color-on-surface-variant)]">{r.messages.length} mensajes</span></div>
                </div>
                <ChevronDown size={16} className={`text-[var(--color-on-surface-variant)] flex-shrink-0 mt-0.5 transition-transform ${isExp ? "rotate-180" : ""}`} />
              </div>

              {isExp && (
                <div className="border-t border-[var(--color-border-subtle)] px-5 py-4 space-y-4">
                  <div className="bg-[var(--color-surface-container-low)] rounded-xl p-3 text-sm"><p className="font-medium mb-1">Descripción completa</p><p className="text-[var(--color-on-surface-variant)]">{r.description}</p></div>
                  <div className="space-y-3">
                    {r.messages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.from === "vendor" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${msg.from === "vendor" ? "bg-[var(--color-primary)] text-white" : msg.from === "admin" ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-800"}`}>
                          <p className="text-xs font-semibold mb-0.5 opacity-70">{msg.from === "vendor" ? "Tú" : msg.from === "admin" ? "Admin" : "Comprador"}</p>
                          <p>{msg.text}</p>
                          <p className="text-xs opacity-60 mt-1 text-right">{msg.at}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {r.status !== "resuelto" && r.status !== "cerrado" && (
                    <div className="flex gap-2">
                      <input value={replyText[r.id] || ""} onChange={e => setReplyText(prev => ({ ...prev, [r.id]: e.target.value }))} placeholder="Escribe tu respuesta..." className="flex-1 border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]" onKeyDown={e => e.key === "Enter" && sendReply(r.id)} />
                      <button onClick={() => sendReply(r.id)} className="bg-[var(--color-primary)] text-white px-3 py-2 rounded-lg hover:opacity-90"><Send size={14} /></button>
                    </div>
                  )}
                  {(r.status === "abierto" || r.status === "en_revision") && (
                    <button onClick={() => setReclamos(prev => prev.map(x => x.id === r.id ? { ...x, status: "resuelto" as ReclamoStatus } : x))} className="text-sm text-green-700 font-medium hover:underline">Marcar como resuelto</button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
