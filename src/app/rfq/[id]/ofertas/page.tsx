"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronDown, ChevronUp, MessageSquare, CheckCircle, Clock } from "lucide-react";

const MOCK_RFQ = {
  id: "RFQ-2024-018",
  titulo: "Compra mensual fertilizantes junio 2026",
  producto: "Urea Granulada 46% × 50 sacos + NPK 15-15-15 × 40 sacos",
  pais: "CO",
  vence: "2026-06-12T23:59:00",
  estado: "con_ofertas",
};

const OFFERS = [
  { id: "OFR-001", vendedor: "DistAgroMax", pais: "CO", rating: 4.9, items: [
    { nombre: "Urea Granulada 46%", cantidad: 50, unidad: "sacos", precio_unitario: 41.50, total: 2075 },
    { nombre: "NPK 15-15-15", cantidad: 40, unidad: "sacos", precio_unitario: 36.80, total: 1472 },
  ], envio: 0, tiempo_entrega: "3-5 días", validez: "5 días", notas: "Disponibilidad inmediata. Transporte incluido a Cundinamarca.", total: 3547, recomendado: true },
  { id: "OFR-002", vendedor: "AgroSuministros CO", pais: "CO", rating: 4.7, items: [
    { nombre: "Urea Granulada 46%", cantidad: 50, unidad: "sacos", precio_unitario: 43.00, total: 2150 },
    { nombre: "NPK 15-15-15", cantidad: 40, unidad: "sacos", precio_unitario: 38.50, total: 1540 },
  ], envio: 45, tiempo_entrega: "5-7 días", validez: "3 días", notas: "Lote disponible en bodega Bogotá.", total: 3735, recomendado: false },
  { id: "OFR-003", vendedor: "AgroMex Colombia", pais: "MX", rating: 4.5, items: [
    { nombre: "Urea Granulada 46%", cantidad: 50, unidad: "sacos", precio_unitario: 39.90, total: 1995 },
    { nombre: "NPK 15-15-15", cantidad: 40, unidad: "sacos", precio_unitario: 35.00, total: 1400 },
  ], envio: 180, tiempo_entrega: "10-14 días", validez: "7 días", notas: "Importación directa. Requiere permiso ICA.", total: 3575, recomendado: false },
];

function useCountdown(target: string) {
  const [remaining, setRemaining] = useState("");
  useEffect(() => {
    function calc() {
      const diff = new Date(target).getTime() - Date.now();
      if (diff <= 0) { setRemaining("Vencida"); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setRemaining(`${h}h ${m}m restantes`);
    }
    calc();
    const t = setInterval(calc, 60000);
    return () => clearInterval(t);
  }, [target]);
  return remaining;
}

export default function RFQOfertasPage() {
  const { id } = useParams<{ id: string }>();
  const countdown = useCountdown(MOCK_RFQ.vence);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ "OFR-001": true });
  const [counterOffer, setCounterOffer] = useState<Record<string, Record<string, number>>>({});
  const [showCounter, setShowCounter] = useState<string | null>(null);
  const [accepted, setAccepted] = useState<string | null>(null);

  function initCounter(offerId: string) {
    const offer = OFFERS.find(o => o.id === offerId);
    if (!offer) return;
    const initial: Record<string, number> = {};
    offer.items.forEach(i => { initial[i.nombre] = i.precio_unitario; });
    setCounterOffer(p => ({ ...p, [offerId]: initial }));
    setShowCounter(offerId);
  }

  if (accepted) {
    const offer = OFFERS.find(o => o.id === accepted)!;
    return (
      <div className="container-max py-16 max-w-xl mx-auto text-center">
        <CheckCircle size={56} className="mx-auto text-[var(--color-agri-green)] mb-4" />
        <h1 className="text-headline-md font-bold mb-2">¡Oferta aceptada!</h1>
        <p className="text-sm text-[var(--color-on-surface-variant)] mb-1">Vendedor: <strong>{offer.vendedor}</strong></p>
        <p className="text-sm text-[var(--color-on-surface-variant)] mb-6">Total: <strong>${offer.total.toLocaleString()}</strong> · Entrega: {offer.tiempo_entrega}</p>
        <p className="text-xs text-[var(--color-on-surface-variant)] mb-6">Se creó una orden de compra. Notificamos al vendedor por email y WhatsApp.</p>
        <div className="flex gap-3 justify-center">
          <Link href="/ordenes" className="bg-[var(--color-primary)] text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:opacity-90">Ver mis órdenes</Link>
          <Link href="/carrito" className="border border-[var(--color-border-subtle)] px-6 py-2.5 rounded-lg font-medium text-sm">Volver</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-max py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <p className="text-xs text-[var(--color-on-surface-variant)] mb-1">
            <Link href="/rfq" className="hover:underline">Mis cotizaciones</Link> / {id}
          </p>
          <h1 className="text-headline-md font-bold">{MOCK_RFQ.titulo}</h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">{MOCK_RFQ.producto}</p>
        </div>
        <div className="shrink-0 text-right">
          <div className={`flex items-center gap-1.5 text-sm font-bold ${countdown === "Vencida" ? "text-[var(--color-secondary)]" : "text-amber-600"}`}>
            <Clock size={14} /> {countdown}
          </div>
          <p className="text-[10px] text-[var(--color-on-surface-variant)] mt-0.5">Cierre: {new Date(MOCK_RFQ.vence).toLocaleString("es-CO")}</p>
        </div>
      </div>

      {/* Tabla comparativa */}
      <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-[var(--color-border-subtle)]">
          <h2 className="font-semibold text-sm">{OFFERS.length} ofertas recibidas — Comparación</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-surface-container-low)]">
              <tr>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-[var(--color-on-surface-variant)]">Vendedor</th>
                <th className="text-right px-4 py-2.5 text-xs font-medium text-[var(--color-on-surface-variant)]">Total</th>
                <th className="text-center px-4 py-2.5 text-xs font-medium text-[var(--color-on-surface-variant)]">Envío</th>
                <th className="text-center px-4 py-2.5 text-xs font-medium text-[var(--color-on-surface-variant)]">Entrega</th>
                <th className="text-center px-4 py-2.5 text-xs font-medium text-[var(--color-on-surface-variant)]">Validez</th>
                <th className="text-center px-4 py-2.5 text-xs font-medium text-[var(--color-on-surface-variant)]">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {OFFERS.map(o => (
                <tr key={o.id} className={`border-t border-[var(--color-border-subtle)] ${o.recomendado ? "bg-green-50" : ""}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {o.recomendado && <span className="text-[10px] font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded uppercase">Mejor precio</span>}
                      <span className="font-medium">{o.vendedor}</span>
                      <span className="text-[10px] text-[var(--color-on-surface-variant)]">⭐ {o.rating}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-[var(--color-primary)]">${o.total.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center text-xs">
                    {o.envio === 0 ? <span className="text-[var(--color-agri-green)] font-medium">Gratis</span> : `$${o.envio}`}
                  </td>
                  <td className="px-4 py-3 text-center text-xs">{o.tiempo_entrega}</td>
                  <td className="px-4 py-3 text-center text-xs">{o.validez}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5 justify-center flex-wrap">
                      <button onClick={() => setExpanded(p => ({ ...p, [o.id]: !p[o.id] }))}
                        className="text-[10px] border border-[var(--color-border-subtle)] px-2 py-0.5 rounded flex items-center gap-0.5">
                        Detalle {expanded[o.id] ? <ChevronUp size={9} /> : <ChevronDown size={9} />}
                      </button>
                      <button onClick={() => initCounter(o.id)}
                        className="text-[10px] border border-[var(--color-primary)] text-[var(--color-primary)] px-2 py-0.5 rounded flex items-center gap-0.5">
                        <MessageSquare size={9} /> Contraoferta
                      </button>
                      <button onClick={() => setAccepted(o.id)}
                        className="text-[10px] bg-[var(--color-agri-green)] text-white px-2 py-0.5 rounded font-medium">
                        Aceptar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detalle de oferta expandida */}
      {OFFERS.filter(o => expanded[o.id]).map(o => (
        <div key={o.id} className="bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden mb-4">
          <div className="px-5 py-3 bg-[var(--color-surface-container-low)] border-b border-[var(--color-border-subtle)]">
            <p className="text-xs font-semibold">{o.vendedor} — Detalle de precios por ítem</p>
          </div>
          <table className="w-full text-xs">
            <thead className="bg-[var(--color-surface-container-lowest)]">
              <tr>
                {["Producto", "Cantidad", "Precio unitario", "Total", ""].map(h => (
                  <th key={h} className="text-left px-4 py-2 font-medium text-[var(--color-on-surface-variant)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {o.items.map(item => (
                <tr key={item.nombre} className="border-t border-[var(--color-border-subtle)]">
                  <td className="px-4 py-2.5 font-medium">{item.nombre}</td>
                  <td className="px-4 py-2.5">{item.cantidad} {item.unidad}</td>
                  <td className="px-4 py-2.5">
                    {showCounter === o.id ? (
                      <input type="number" step="0.01" min="0"
                        className="w-24 p-1 border border-[var(--color-primary)] rounded text-xs"
                        value={counterOffer[o.id]?.[item.nombre] ?? item.precio_unitario}
                        onChange={e => setCounterOffer(p => ({ ...p, [o.id]: { ...p[o.id], [item.nombre]: parseFloat(e.target.value) } }))}
                      />
                    ) : (
                      <span>${item.precio_unitario.toFixed(2)}/{item.unidad}</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 font-bold">
                    {showCounter === o.id
                      ? `$${((counterOffer[o.id]?.[item.nombre] ?? item.precio_unitario) * item.cantidad).toFixed(2)}`
                      : `$${item.total.toLocaleString()}`}
                  </td>
                  <td />
                </tr>
              ))}
            </tbody>
          </table>
          {o.notas && <div className="px-4 py-2 bg-[var(--color-surface-container-lowest)] border-t border-[var(--color-border-subtle)]">
            <p className="text-[10px] text-[var(--color-on-surface-variant)]">📝 {o.notas}</p>
          </div>}
          {showCounter === o.id && (
            <div className="px-4 py-3 border-t border-[var(--color-border-subtle)] flex gap-2">
              <button className="text-xs bg-[var(--color-primary)] text-white px-4 py-1.5 rounded-lg font-medium">Enviar contraoferta</button>
              <button onClick={() => setShowCounter(null)} className="text-xs border border-[var(--color-border-subtle)] px-4 py-1.5 rounded-lg">Cancelar</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
