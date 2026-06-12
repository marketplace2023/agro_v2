"use client";

import { useState } from "react";
import { Users, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const TIPOS_CARGA = [
  "Granel seco (sacos, bultos)",
  "Granel líquido (IBC, tanques)",
  "Paletizado",
  "Refrigerado / cadena de frío",
  "Carga peligrosa (agroquímicos)",
  "Maquinaria agrícola",
  "Mixto",
];

const TIPOS_VEHICULO = [
  "Camión sencillo (hasta 8 t)",
  "Camión doble troque (hasta 18 t)",
  "Tractomula (hasta 34 t)",
  "Furgón refrigerado",
  "Cualquier tipo compatible",
];

export default function NuevaSolicitudFletePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    origen: "Bogotá, Colombia",
    destino: "Valledupar, Cesar, Colombia",
    tipoCarga: "Carga peligrosa (agroquímicos)",
    pesoKg: "10000",
    volumenM3: "12",
    bultos: "200",
    tipoVehiculo: "Camión doble troque (hasta 18 t)",
    fechaRetiro: "2026-06-14",
    fechaEntrega: "2026-06-16",
    documentos: "Manifiesto de carga, factura, remisión",
    seguroReq: "si",
    condicionesEsp: "Productos agroquímicos — Clase 9. Requiere señalización. Temperatura ambiente.",
    observaciones: "",
  });

  const set = (k: string, v: string) => setForm((prev) => ({ ...prev, [k]: v }));

  const obligatorios = ["origen", "destino", "tipoCarga", "pesoKg", "tipoVehiculo", "fechaRetiro", "fechaEntrega"];
  const completo = obligatorios.every((k) => form[k as keyof typeof form].trim() !== "");

  return (
    <div className="min-h-screen bg-[var(--color-background-alt)]">
      <div className="max-w-2xl mx-auto py-8 px-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/checkout/logistica" className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2"><Users size={20} /> Solicitud de flete</h1>
            <p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">
              Orden ORD-2026-122 · Los operadores logísticos presentarán ofertas
            </p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
          <AlertCircle size={16} className="text-blue-600 shrink-0 mt-0.5" />
          <p className="text-xs text-blue-800">
            Una vez publicada la solicitud, los operadores logísticos compatibles recibirán una invitación. Podrás comparar ofertas en <strong>/logistica/solicitudes</strong> y seleccionar la mejor opción.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-6 space-y-5">
          {/* Origen / destino */}
          <div>
            <h2 className="font-semibold text-xs uppercase tracking-wide text-[var(--color-on-surface-variant)] mb-3">Origen y destino</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1.5">Origen *</label>
                <input type="text" value={form.origen} onChange={(e) => set("origen", e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-20" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5">Destino *</label>
                <input type="text" value={form.destino} onChange={(e) => set("destino", e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-20" />
              </div>
            </div>
          </div>

          {/* Carga */}
          <div className="border-t border-[var(--color-border-subtle)] pt-5">
            <h2 className="font-semibold text-xs uppercase tracking-wide text-[var(--color-on-surface-variant)] mb-3">Detalles de la carga</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1.5">Tipo de carga *</label>
                <select value={form.tipoCarga} onChange={(e) => set("tipoCarga", e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-20 bg-white">
                  {TIPOS_CARGA.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1.5">Peso (kg) *</label>
                  <input type="number" value={form.pesoKg} onChange={(e) => set("pesoKg", e.target.value)}
                    className="w-full px-4 py-2.5 text-sm border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-20" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5">Volumen (m³)</label>
                  <input type="number" value={form.volumenM3} onChange={(e) => set("volumenM3", e.target.value)}
                    className="w-full px-4 py-2.5 text-sm border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-20" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5">Bultos / unidades</label>
                  <input type="number" value={form.bultos} onChange={(e) => set("bultos", e.target.value)}
                    className="w-full px-4 py-2.5 text-sm border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-20" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5">Condiciones especiales</label>
                <input type="text" value={form.condicionesEsp} onChange={(e) => set("condicionesEsp", e.target.value)}
                  placeholder="Temperatura, precauciones, manejo especial..."
                  className="w-full px-4 py-2.5 text-sm border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-20" />
              </div>
            </div>
          </div>

          {/* Vehículo y fechas */}
          <div className="border-t border-[var(--color-border-subtle)] pt-5">
            <h2 className="font-semibold text-xs uppercase tracking-wide text-[var(--color-on-surface-variant)] mb-3">Vehículo y fechas</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1.5">Tipo de vehículo requerido *</label>
                <select value={form.tipoVehiculo} onChange={(e) => set("tipoVehiculo", e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-20 bg-white">
                  {TIPOS_VEHICULO.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5">Fecha de retiro *</label>
                  <input type="date" value={form.fechaRetiro} onChange={(e) => set("fechaRetiro", e.target.value)} min="2026-06-11"
                    className="w-full px-4 py-2.5 text-sm border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-20" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5">Fecha requerida de entrega *</label>
                  <input type="date" value={form.fechaEntrega} onChange={(e) => set("fechaEntrega", e.target.value)} min={form.fechaRetiro}
                    className="w-full px-4 py-2.5 text-sm border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-20" />
                </div>
              </div>
            </div>
          </div>

          {/* Documentos y seguro */}
          <div className="border-t border-[var(--color-border-subtle)] pt-5">
            <h2 className="font-semibold text-xs uppercase tracking-wide text-[var(--color-on-surface-variant)] mb-3">Documentos y seguro</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1.5">Documentos requeridos</label>
                <input type="text" value={form.documentos} onChange={(e) => set("documentos", e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-20" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-2">¿Se requiere seguro de carga? *</label>
                <div className="flex gap-3">
                  {["si", "no", "negociable"].map((op) => (
                    <button key={op} onClick={() => set("seguroReq", op)}
                      className={`px-4 py-2 text-xs rounded-lg border font-medium transition-colors capitalize ${form.seguroReq === op ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]" : "border-[var(--color-border-subtle)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)]"}`}>
                      {op === "si" ? "Sí" : op === "no" ? "No" : "Negociable"}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5">Observaciones adicionales</label>
                <textarea rows={3} value={form.observaciones} onChange={(e) => set("observaciones", e.target.value)}
                  placeholder="Instrucciones para los operadores, restricciones, referencias..."
                  className="w-full px-4 py-2.5 text-sm border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-20 resize-none" />
              </div>
            </div>
          </div>
        </div>

        {completo && (
          <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
            <CheckCircle2 size={16} /> La solicitud está lista para publicarse. Los operadores recibirán la invitación al confirmar.
          </div>
        )}

        <div className="flex gap-3">
          <Link href="/checkout/logistica" className="flex-1 text-center border border-[var(--color-border-subtle)] py-3 rounded-xl text-sm hover:bg-[var(--color-surface-container)] transition-colors text-[var(--color-on-surface-variant)]">
            Volver
          </Link>
          <button
            disabled={!completo}
            onClick={() => router.push("/logistica/solicitudes")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-opacity ${
              completo
                ? "bg-[var(--color-primary)] text-white hover:opacity-90"
                : "bg-[var(--color-border-subtle)] text-[var(--color-on-surface-variant)] cursor-not-allowed"
            }`}
          >
            Publicar solicitud <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
