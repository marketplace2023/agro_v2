"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import Link from "next/link";
import { Search, Plus, Trash2, CheckCircle } from "lucide-react";

const VENDORS_SUGGESTED = [
  { id: "v1", name: "DistAgroMax", pais: "CO", rating: 4.9, productos: 45 },
  { id: "v2", name: "AgroSuministros CO", pais: "CO", rating: 4.7, productos: 32 },
  { id: "v3", name: "BioSolutions EC", pais: "EC", rating: 4.8, productos: 18 },
  { id: "v4", name: "CropProtect MX", pais: "MX", rating: 4.6, productos: 27 },
];

const DOCS_REQUIRED = [
  { id: "ficha", label: "Ficha técnica del producto" },
  { id: "sds", label: "Hoja de seguridad (SDS)" },
  { id: "registro", label: "Registro sanitario por país" },
  { id: "etiqueta", label: "Etiqueta autorizada" },
  { id: "cert_calidad", label: "Certificado de calidad" },
];

interface RFQItem { id: string; nombre: string; cantidad: string; unidad: string; especificacion: string; }

export default function RFQNuevaPage() {
  const { items: cartItems } = useCartStore();
  const [step, setStep] = useState(1);
  const [info, setInfo] = useState({ titulo: "", pais_destino: "CO", fecha_requerida: "", descripcion: "" });
  const [rfqItems, setRFQItems] = useState<RFQItem[]>(
    cartItems.length > 0
      ? cartItems.map(i => ({ id: i.id, nombre: i.name, cantidad: String(i.quantity), unidad: i.unit, especificacion: "" }))
      : [{ id: "1", nombre: "", cantidad: "", unidad: "", especificacion: "" }]
  );
  const [docsReq, setDocsReq] = useState<string[]>(["ficha", "registro"]);
  const [vendorsSelected, setVendorsSelected] = useState<string[]>(["v1", "v2"]);
  const [submitted, setSubmitted] = useState(false);
  const rfqId = `RFQ-${Date.now().toString().slice(-6)}`;

  function addItem() {
    setRFQItems(p => [...p, { id: String(Date.now()), nombre: "", cantidad: "", unidad: "L", especificacion: "" }]);
  }
  function removeItem(id: string) {
    setRFQItems(p => p.filter(i => i.id !== id));
  }
  function toggleVendor(id: string) {
    setVendorsSelected(p => p.includes(id) ? p.filter(v => v !== id) : [...p, id]);
  }
  function toggleDoc(id: string) {
    setDocsReq(p => p.includes(id) ? p.filter(d => d !== id) : [...p, id]);
  }

  const steps = ["Información general", "Productos y especificaciones", "Vendedores sugeridos", "Revisión y envío"];

  if (submitted) {
    return (
      <div className="container-max py-16 max-w-xl mx-auto text-center">
        <CheckCircle size={56} className="mx-auto text-[var(--color-agri-green)] mb-4" />
        <h1 className="text-headline-md font-bold mb-2">¡RFQ enviada exitosamente!</h1>
        <p className="text-sm text-[var(--color-on-surface-variant)] mb-1">ID: <strong>{rfqId}</strong></p>
        <p className="text-sm text-[var(--color-on-surface-variant)] mb-6">
          Notificamos a {vendorsSelected.length} vendedor(es) por email y WhatsApp. Recibirás sus ofertas en las próximas 24–48 horas.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href={`/rfq/${rfqId}/ofertas`} className="bg-[var(--color-primary)] text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:opacity-90">Ver ofertas</Link>
          <Link href="/rfq" className="border border-[var(--color-border-subtle)] px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-[var(--color-surface-container-low)]">Mis cotizaciones</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-max py-8 max-w-3xl">
      <h1 className="text-headline-md font-bold mb-2">Nueva Solicitud de Cotización (RFQ)</h1>
      <p className="text-sm text-[var(--color-on-surface-variant)] mb-6">Compara ofertas de múltiples proveedores antes de comprar.</p>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2 shrink-0">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step > i + 1 ? "bg-[var(--color-agri-green)] text-white" : step === i + 1 ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)]"}`}>
              {step > i + 1 ? "✓" : i + 1}
            </div>
            <span className={`text-xs font-medium ${step === i + 1 ? "text-[var(--color-primary)]" : "text-[var(--color-on-surface-variant)]"}`}>{s}</span>
            {i < steps.length - 1 && <div className={`w-8 h-0.5 ${step > i + 1 ? "bg-[var(--color-agri-green)]" : "bg-[var(--color-border-subtle)]"}`} />}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-6">
        {/* STEP 1 — Información */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="font-semibold">Paso 1 — Información general</h2>
            <label className="text-xs font-medium block">
              Título de la RFQ *
              <input className="w-full mt-1 p-2.5 text-sm border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                placeholder="Ej: Compra mensual fertilizantes junio 2026"
                value={info.titulo} onChange={e => setInfo(p => ({ ...p, titulo: e.target.value }))} />
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="text-xs font-medium block">
                País de destino *
                <select className="w-full mt-1 p-2.5 text-sm border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                  value={info.pais_destino} onChange={e => setInfo(p => ({ ...p, pais_destino: e.target.value }))}>
                  {["CO", "VE", "EC", "MX", "PE", "BR", "AR", "CL"].map(c => <option key={c}>{c}</option>)}
                </select>
              </label>
              <label className="text-xs font-medium block">
                Fecha requerida de entrega *
                <input type="date" className="w-full mt-1 p-2.5 text-sm border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                  value={info.fecha_requerida} onChange={e => setInfo(p => ({ ...p, fecha_requerida: e.target.value }))} />
              </label>
            </div>
            <label className="text-xs font-medium block">
              Descripción adicional / condiciones especiales
              <textarea className="w-full mt-1 p-2.5 text-sm border border-[var(--color-border-subtle)] rounded-lg resize-none focus:outline-none focus:border-[var(--color-primary)]"
                rows={3} placeholder="Condiciones de pago, transporte, certificaciones requeridas..."
                value={info.descripcion} onChange={e => setInfo(p => ({ ...p, descripcion: e.target.value }))} />
            </label>
          </div>
        )}

        {/* STEP 2 — Productos */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="font-semibold">Paso 2 — Productos y especificaciones</h2>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-[var(--color-on-surface-variant)]" />
              <input className="w-full pl-8 p-2.5 text-sm border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                placeholder="Buscar producto del catálogo para agregar..." />
            </div>
            <div className="space-y-3">
              {rfqItems.map((item, idx) => (
                <div key={item.id} className="p-4 border border-[var(--color-border-subtle)] rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-[var(--color-on-surface-variant)]">Ítem {idx + 1}</span>
                    {rfqItems.length > 1 && (
                      <button onClick={() => removeItem(item.id)} className="text-[var(--color-secondary)] hover:bg-red-50 p-1 rounded"><Trash2 size={13} /></button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="text-xs font-medium col-span-2">
                      Nombre / Ingrediente activo
                      <input className="w-full mt-1 p-2 text-xs border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                        placeholder="Ej: Glifosato 480 SL / Urea granulada 46%..."
                        value={item.nombre} onChange={e => setRFQItems(p => p.map(i => i.id === item.id ? { ...i, nombre: e.target.value } : i))} />
                    </label>
                    <label className="text-xs font-medium">
                      Cantidad requerida
                      <input type="number" min="1" className="w-full mt-1 p-2 text-xs border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                        value={item.cantidad} onChange={e => setRFQItems(p => p.map(i => i.id === item.id ? { ...i, cantidad: e.target.value } : i))} />
                    </label>
                    <label className="text-xs font-medium">
                      Unidad
                      <select className="w-full mt-1 p-2 text-xs border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                        value={item.unidad} onChange={e => setRFQItems(p => p.map(i => i.id === item.id ? { ...i, unidad: e.target.value } : i))}>
                        {["L", "kg", "ton", "sacos", "galón", "unidades"].map(u => <option key={u}>{u}</option>)}
                      </select>
                    </label>
                    <label className="text-xs font-medium col-span-2">
                      Especificación técnica adicional
                      <input className="w-full mt-1 p-2 text-xs border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                        placeholder="Concentración, formulación, marca preferida..."
                        value={item.especificacion} onChange={e => setRFQItems(p => p.map(i => i.id === item.id ? { ...i, especificacion: e.target.value } : i))} />
                    </label>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={addItem} className="flex items-center gap-2 text-xs text-[var(--color-primary)] border border-dashed border-[var(--color-primary)] px-4 py-2 rounded-lg hover:bg-[var(--color-surface-container-low)] w-full justify-center">
              <Plus size={14} /> Agregar otro producto
            </button>
            <div>
              <p className="text-xs font-semibold mb-2">Documentos requeridos al vendedor:</p>
              <div className="flex flex-wrap gap-2">
                {DOCS_REQUIRED.map(d => (
                  <button key={d.id} onClick={() => toggleDoc(d.id)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${docsReq.includes(d.id) ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]" : "border-[var(--color-border-subtle)] hover:border-[var(--color-primary)]"}`}>
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3 — Vendedores */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="font-semibold">Paso 3 — Vendedores sugeridos</h2>
            <p className="text-xs text-[var(--color-on-surface-variant)]">Selecciona los vendedores a los que enviar la RFQ. Se les notificará por email y WhatsApp.</p>
            <div className="grid gap-3">
              {VENDORS_SUGGESTED.map(v => (
                <div key={v.id}
                  onClick={() => toggleVendor(v.id)}
                  className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${vendorsSelected.includes(v.id) ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5" : "border-[var(--color-border-subtle)] hover:border-[var(--color-primary)]/50"}`}
                >
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${vendorsSelected.includes(v.id) ? "bg-[var(--color-primary)] border-[var(--color-primary)]" : "border-[var(--color-border-subtle)]"}`}>
                    {vendorsSelected.includes(v.id) && <span className="text-white text-xs">✓</span>}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{v.name}</p>
                    <p className="text-xs text-[var(--color-on-surface-variant)]">{v.pais} · {v.productos} productos · ⭐ {v.rating}</p>
                  </div>
                  <Link href={`/vendedores/${v.name.toLowerCase().replace(/\s/g, "-")}`}
                    className="text-[10px] text-[var(--color-primary)] hover:underline"
                    onClick={e => e.stopPropagation()}>Ver perfil</Link>
                </div>
              ))}
            </div>
            <p className="text-xs text-[var(--color-on-surface-variant)]">{vendorsSelected.length} vendedor(es) seleccionado(s)</p>
          </div>
        )}

        {/* STEP 4 — Revisión */}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="font-semibold">Paso 4 — Revisión y envío</h2>
            <div className="space-y-3 text-sm">
              <div className="bg-[var(--color-surface-container-low)] rounded-lg p-4">
                <p className="text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase mb-2">Información general</p>
                <p><span className="text-[var(--color-on-surface-variant)]">Título:</span> {info.titulo || "(sin título)"}</p>
                <p><span className="text-[var(--color-on-surface-variant)]">País destino:</span> {info.pais_destino}</p>
                <p><span className="text-[var(--color-on-surface-variant)]">Fecha requerida:</span> {info.fecha_requerida || "(sin fecha)"}</p>
              </div>
              <div className="bg-[var(--color-surface-container-low)] rounded-lg p-4">
                <p className="text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase mb-2">Productos ({rfqItems.length})</p>
                {rfqItems.map((i, idx) => <p key={i.id} className="text-xs">{idx + 1}. {i.nombre || "(sin nombre)"} — {i.cantidad} {i.unidad}</p>)}
              </div>
              <div className="bg-[var(--color-surface-container-low)] rounded-lg p-4">
                <p className="text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase mb-2">Vendedores notificados ({vendorsSelected.length})</p>
                {VENDORS_SUGGESTED.filter(v => vendorsSelected.includes(v.id)).map(v => (
                  <p key={v.id} className="text-xs">{v.name} · {v.pais}</p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-[var(--color-border-subtle)]">
          {step > 1 ? (
            <button onClick={() => setStep(p => p - 1)} className="text-sm border border-[var(--color-border-subtle)] px-5 py-2 rounded-lg hover:bg-[var(--color-surface-container-low)]">← Anterior</button>
          ) : <Link href="/carrito" className="text-sm text-[var(--color-on-surface-variant)] hover:underline">← Volver al carrito</Link>}
          {step < 4 ? (
            <button onClick={() => setStep(p => p + 1)} disabled={step === 1 && !info.titulo} className="text-sm bg-[var(--color-primary)] text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 disabled:opacity-50">Siguiente →</button>
          ) : (
            <button onClick={() => setSubmitted(true)} className="text-sm bg-[var(--color-secondary)] text-white px-6 py-2 rounded-lg font-bold hover:opacity-90">
              Enviar RFQ a {vendorsSelected.length} vendedor(es)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
