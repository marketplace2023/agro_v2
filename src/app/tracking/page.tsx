"use client";

import { useState } from "react";
import { Search, Package, Truck, CheckCircle, MapPin, Clock, AlertCircle } from "lucide-react";

type TrackStatus = "procesando" | "en_preparacion" | "despachado" | "en_transito" | "en_entrega" | "entregado" | "incidencia";

interface TrackEvent { status: TrackStatus; description: string; location: string; timestamp: string; }
interface Shipment {
  trackingCode: string; orderNum: string; carrier: string; estimatedDelivery: string;
  origin: string; destination: string; currentStatus: TrackStatus;
  receiver: string; events: TrackEvent[];
}

const MOCK_SHIPMENT: Shipment = {
  trackingCode: "TRK-2026-AGR-00891",
  orderNum: "ORD-2026-4521",
  carrier: "LogiAgro Express",
  estimatedDelivery: "2026-06-12",
  origin: "Zona Industrial Bogotá, CO",
  destination: "Km 12 Vía Palmira, Valle del Cauca",
  currentStatus: "en_transito",
  receiver: "Jorge Martínez — Hacienda El Palmar SAS",
  events: [
    { status: "procesando", description: "Orden confirmada y en espera de despacho", location: "Bogotá, CO", timestamp: "2026-06-10 09:00" },
    { status: "en_preparacion", description: "Pedido siendo preparado en bodega", location: "Zona Industrial Bogotá", timestamp: "2026-06-10 11:30" },
    { status: "despachado", description: "Pedido recogido por LogiAgro Express", location: "Zona Industrial Bogotá", timestamp: "2026-06-10 15:45" },
    { status: "en_transito", description: "En tránsito hacia punto de entrega", location: "Autopista Sur Km 48, Cundinamarca", timestamp: "2026-06-11 08:22" },
  ],
};

const STATUS_CFG: Record<TrackStatus, { label: string; color: string; icon: React.ReactNode; done: boolean }> = {
  procesando: { label: "Procesando", color: "text-gray-500", icon: <Package size={16} />, done: false },
  en_preparacion: { label: "Preparando", color: "text-blue-500", icon: <Package size={16} />, done: false },
  despachado: { label: "Despachado", color: "text-purple-500", icon: <Truck size={16} />, done: false },
  en_transito: { label: "En tránsito", color: "text-orange-500", icon: <Truck size={16} />, done: false },
  en_entrega: { label: "En entrega", color: "text-blue-600", icon: <Truck size={16} />, done: false },
  entregado: { label: "Entregado", color: "text-green-600", icon: <CheckCircle size={16} />, done: true },
  incidencia: { label: "Incidencia", color: "text-red-500", icon: <AlertCircle size={16} />, done: false },
};

const TRACKING_STEPS: TrackStatus[] = ["procesando", "en_preparacion", "despachado", "en_transito", "en_entrega", "entregado"];

export default function TrackingPage() {
  const [trackingInput, setTrackingInput] = useState("");
  const [result, setResult] = useState<Shipment | null>(null);
  const [searched, setSearched] = useState(false);

  function search() {
    setSearched(true);
    if (trackingInput.trim().toLowerCase() === MOCK_SHIPMENT.trackingCode.toLowerCase() || trackingInput.trim() === MOCK_SHIPMENT.orderNum) {
      setResult(MOCK_SHIPMENT);
    } else {
      setResult(null);
    }
  }

  const currentStepIdx = result ? TRACKING_STEPS.indexOf(result.currentStatus) : -1;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-[var(--color-primary)]/10 rounded-2xl mb-2"><Truck size={28} className="text-[var(--color-primary)]" /></div>
        <h1 className="text-2xl font-bold">Rastrear envío</h1>
        <p className="text-sm text-[var(--color-on-surface-variant)]">Ingresa tu código de rastreo o número de orden para ver el estado de tu envío</p>
      </div>

      <div className="flex gap-2">
        <input value={trackingInput} onChange={e => setTrackingInput(e.target.value)} onKeyDown={e => e.key === "Enter" && search()} placeholder="TRK-2026-AGR-00891 o ORD-2026-4521" className="flex-1 border border-[var(--color-border-subtle)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--color-primary)] font-mono" />
        <button onClick={search} className="flex items-center gap-2 bg-[var(--color-primary)] text-white font-semibold px-5 py-3 rounded-xl hover:opacity-90"><Search size={16} /> Rastrear</button>
      </div>

      <p className="text-xs text-center text-[var(--color-on-surface-variant)]">Prueba con: <button onClick={() => { setTrackingInput("TRK-2026-AGR-00891"); }} className="text-[var(--color-primary)] font-mono hover:underline">TRK-2026-AGR-00891</button></p>

      {searched && !result && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 text-center space-y-2">
          <AlertCircle size={32} className="mx-auto text-orange-400" />
          <p className="font-medium text-sm">No se encontró un envío con ese código</p>
          <p className="text-xs text-[var(--color-on-surface-variant)]">Verifica el código o espera unos minutos si acabas de realizar tu pedido</p>
        </div>
      )}

      {result && (
        <div className="space-y-5">
          <div className="bg-white border border-[var(--color-border-subtle)] rounded-2xl p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div><p className="font-bold text-lg font-mono">{result.trackingCode}</p><p className="text-sm text-[var(--color-on-surface-variant)]">{result.orderNum} · {result.carrier}</p></div>
              <div className={`flex items-center gap-1.5 text-sm font-semibold ${STATUS_CFG[result.currentStatus].color}`}>{STATUS_CFG[result.currentStatus].icon} {STATUS_CFG[result.currentStatus].label}</div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-start gap-2"><MapPin size={14} className="text-[var(--color-on-surface-variant)] mt-0.5 flex-shrink-0" /><div><p className="text-xs text-[var(--color-on-surface-variant)]">Origen</p><p className="font-medium">{result.origin}</p></div></div>
              <div className="flex items-start gap-2"><MapPin size={14} className="text-[var(--color-primary)] mt-0.5 flex-shrink-0" /><div><p className="text-xs text-[var(--color-on-surface-variant)]">Destino</p><p className="font-medium">{result.destination}</p></div></div>
              <div className="flex items-start gap-2"><Clock size={14} className="text-green-500 mt-0.5 flex-shrink-0" /><div><p className="text-xs text-[var(--color-on-surface-variant)]">Entrega estimada</p><p className="font-semibold text-green-700">{result.estimatedDelivery}</p></div></div>
              <div className="flex items-start gap-2"><Package size={14} className="text-[var(--color-on-surface-variant)] mt-0.5 flex-shrink-0" /><div><p className="text-xs text-[var(--color-on-surface-variant)]">Receptor</p><p className="font-medium">{result.receiver}</p></div></div>
            </div>
          </div>

          <div className="bg-white border border-[var(--color-border-subtle)] rounded-2xl p-5">
            <h3 className="font-semibold text-sm mb-5">Progreso del envío</h3>
            <div className="flex items-center gap-0 overflow-x-auto pb-2">
              {TRACKING_STEPS.map((step, i) => {
                const cfg = STATUS_CFG[step];
                const isDone = i <= currentStepIdx;
                const isActive = i === currentStepIdx;
                return (
                  <div key={step} className="flex items-center flex-shrink-0">
                    <div className={`flex flex-col items-center w-20 ${isDone ? cfg.color : "text-gray-300"}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isActive ? `bg-current/10 ${cfg.color}` : isDone ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-300"}`}>{cfg.icon}</div>
                      <p className="text-xs font-medium text-center mt-1 leading-tight w-16">{cfg.label}</p>
                    </div>
                    {i < TRACKING_STEPS.length - 1 && <div className={`flex-1 h-0.5 w-8 mx-1 ${i < currentStepIdx ? "bg-green-400" : "bg-gray-200"}`} />}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white border border-[var(--color-border-subtle)] rounded-2xl p-5 space-y-3">
            <h3 className="font-semibold text-sm">Historial de eventos</h3>
            <div className="space-y-3">
              {[...result.events].reverse().map((ev, i) => {
                const cfg = STATUS_CFG[ev.status];
                return (
                  <div key={i} className="flex gap-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${i === 0 ? "bg-[var(--color-primary)]" : "bg-gray-300"}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{ev.description}</p>
                      <div className="flex gap-3 text-xs text-[var(--color-on-surface-variant)] mt-0.5">
                        <span className="flex items-center gap-1"><MapPin size={10} />{ev.location}</span>
                        <span className="flex items-center gap-1"><Clock size={10} />{ev.timestamp}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
