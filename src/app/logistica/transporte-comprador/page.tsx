"use client";

import { useState } from "react";
import { Truck, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const TIPOS_VEHICULO = [
  "Camión sencillo (hasta 8 t)",
  "Camión doble troque (hasta 18 t)",
  "Tractomula (hasta 34 t)",
  "Furgón refrigerado",
  "Camioneta doble cabina",
  "Otro",
];

export default function TransporteCompradorPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    empresaTransportista: "",
    conductor: "",
    docConductor: "",
    placa: "",
    tipoVehiculo: "",
    capacidad: "",
    fechaRetiro: "",
    horaRetiro: "",
    telefono: "",
    seguro: "",
    observaciones: "",
  });

  const set = (k: string, v: string) => setForm((prev) => ({ ...prev, [k]: v }));

  const camposObligatorios = ["conductor", "docConductor", "placa", "tipoVehiculo", "fechaRetiro", "horaRetiro", "telefono"];
  const completo = camposObligatorios.every((c) => form[c as keyof typeof form].trim() !== "");

  return (
    <div className="min-h-screen bg-[var(--color-background-alt)]">
      <div className="max-w-2xl mx-auto py-8 px-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/checkout/logistica" className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2"><Truck size={20} /> Transporte propio</h1>
            <p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">
              Orden ORD-2026-122 · Registra los datos del retiro
            </p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
          <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800">
            La mercancía estará disponible para retiro en <strong>Bodega DistAgroMax — Bogotá</strong> en la fecha indicada. El transportista debe presentar este documento y el documento del conductor al llegar.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-6 space-y-5">
          <h2 className="font-semibold text-sm uppercase tracking-wide text-[var(--color-on-surface-variant)]">Datos del transportista</h2>

          <div>
            <label className="block text-xs font-medium mb-1.5">Empresa transportista (si aplica)</label>
            <input
              type="text"
              placeholder="Ej: Transportes Andes S.A.S."
              value={form.empresaTransportista}
              onChange={(e) => set("empresaTransportista", e.target.value)}
              className="w-full px-4 py-2.5 text-sm border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1.5">Nombre del conductor *</label>
              <input
                type="text"
                placeholder="Nombre completo"
                value={form.conductor}
                onChange={(e) => set("conductor", e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-20"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5">Documento del conductor *</label>
              <input
                type="text"
                placeholder="C.C. o pasaporte"
                value={form.docConductor}
                onChange={(e) => set("docConductor", e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1.5">Placa del vehículo *</label>
              <input
                type="text"
                placeholder="Ej: ABC-123"
                value={form.placa}
                onChange={(e) => set("placa", e.target.value.toUpperCase())}
                className="w-full px-4 py-2.5 text-sm border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-20 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5">Tipo de vehículo *</label>
              <select
                value={form.tipoVehiculo}
                onChange={(e) => set("tipoVehiculo", e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-20 bg-white"
              >
                <option value="">Seleccionar...</option>
                {TIPOS_VEHICULO.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5">Capacidad del vehículo</label>
            <input
              type="text"
              placeholder="Ej: 10 toneladas"
              value={form.capacidad}
              onChange={(e) => set("capacidad", e.target.value)}
              className="w-full px-4 py-2.5 text-sm border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-20"
            />
          </div>

          <div className="border-t border-[var(--color-border-subtle)] pt-5">
            <h2 className="font-semibold text-sm uppercase tracking-wide text-[var(--color-on-surface-variant)] mb-4">Fecha y hora de retiro</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1.5">Fecha de retiro *</label>
                <input
                  type="date"
                  value={form.fechaRetiro}
                  onChange={(e) => set("fechaRetiro", e.target.value)}
                  min="2026-06-11"
                  className="w-full px-4 py-2.5 text-sm border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-20"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5">Hora estimada de llegada *</label>
                <input
                  type="time"
                  value={form.horaRetiro}
                  onChange={(e) => set("horaRetiro", e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-20"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-[var(--color-border-subtle)] pt-5">
            <h2 className="font-semibold text-sm uppercase tracking-wide text-[var(--color-on-surface-variant)] mb-4">Datos adicionales</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1.5">Teléfono de contacto *</label>
                <input
                  type="tel"
                  placeholder="+57 310 000 0000"
                  value={form.telefono}
                  onChange={(e) => set("telefono", e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-20"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5">Número de póliza de seguro</label>
                <input
                  type="text"
                  placeholder="Opcional — requerido para cargas > 5t"
                  value={form.seguro}
                  onChange={(e) => set("seguro", e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-20"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5">Observaciones</label>
                <textarea
                  rows={3}
                  placeholder="Instrucciones especiales para el almacén..."
                  value={form.observaciones}
                  onChange={(e) => set("observaciones", e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-20 resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {completo && (
          <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
            <CheckCircle2 size={16} /> Todos los datos requeridos están completos.
          </div>
        )}

        <div className="flex gap-3">
          <Link href="/checkout/logistica" className="flex-1 text-center border border-[var(--color-border-subtle)] py-3 rounded-xl text-sm hover:bg-[var(--color-surface-container)] transition-colors text-[var(--color-on-surface-variant)]">
            Volver
          </Link>
          <button
            disabled={!completo}
            onClick={() => router.push("/ordenes/ORD-2026-122")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-opacity ${
              completo
                ? "bg-[var(--color-primary)] text-white hover:opacity-90"
                : "bg-[var(--color-border-subtle)] text-[var(--color-on-surface-variant)] cursor-not-allowed"
            }`}
          >
            Confirmar retiro <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
