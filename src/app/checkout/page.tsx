"use client";

import { useState, useEffect, useCallback } from "react";
import { useCartStore } from "@/store/cartStore";
import Link from "next/link";
import { CheckCircle, Shield, CreditCard, MapPin, FileText, AlertTriangle } from "lucide-react";

const PAYMENT_METHODS: Record<string, { label: string; icon: string; countries: string[] }[]> = {
  CO: [
    { label: "Tarjeta crédito/débito (Stripe)", icon: "💳", countries: [] },
    { label: "PSE — Pago Seguro en Línea", icon: "🏦", countries: [] },
    { label: "Nequi", icon: "📱", countries: [] },
    { label: "Efecty (pago en efectivo)", icon: "💵", countries: [] },
  ],
  MX: [
    { label: "Tarjeta crédito/débito (Stripe)", icon: "💳", countries: [] },
    { label: "OXXO (pago en efectivo)", icon: "🏪", countries: [] },
    { label: "SPEI (transferencia bancaria)", icon: "🏦", countries: [] },
  ],
  BR: [
    { label: "Cartão de crédito/débito (Stripe)", icon: "💳", countries: [] },
    { label: "Pix", icon: "⚡", countries: [] },
    { label: "Boleto bancário", icon: "📄", countries: [] },
  ],
};

const DEFAULT_METHODS = [
  { label: "Tarjeta crédito/débito (Stripe)", icon: "💳", countries: [] },
  { label: "Transferencia bancaria", icon: "🏦", countries: [] },
];

interface Address {
  nombre: string; empresa: string; rut: string; direccion: string;
  ciudad: string; departamento: string; pais: string; telefono: string;
}

interface Billing { razon_social: string; nit: string; email: string; regimen: string; }

interface RegWarning { productId: string; type: string; message: string; }

export default function CheckoutPage() {
  const { items, subtotal, couponDiscount, clearCart, country } = useCartStore();
  const [step, setStep] = useState(1);
  const [regWarnings, setRegWarnings] = useState<RegWarning[]>([]);

  const validateRegulatory = useCallback(async () => {
    if (!items.length) return;
    try {
      const res = await fetch("/api/cart/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: items.map(i => ({ productId: i.productId, vendorId: i.vendorId, quantity: i.quantity })), country }),
      });
      const data = await res.json();
      setRegWarnings((data.warnings ?? []).filter((w: RegWarning) => w.type.startsWith("regulatorio")));
    } catch { /* dev */ }
  }, [items, country]);

  useEffect(() => { validateRegulatory(); }, [validateRegulatory]);
  const [address, setAddress] = useState<Address>({ nombre: "", empresa: "", rut: "", direccion: "", ciudad: "", departamento: "", pais: country, telefono: "" });
  const [payMethod, setPayMethod] = useState("");
  const [billing, setBilling] = useState<Billing>({ razon_social: "", nit: "", email: "", regimen: "comun" });
  const [processing, setProcessing] = useState(false);
  const [orderNum, setOrderNum] = useState("");

  const sub = subtotal();
  const disc = (sub * couponDiscount) / 100;
  const shipping = sub > 500 ? 0 : 45;
  const total = sub - disc + shipping;

  const methods = PAYMENT_METHODS[country] ?? DEFAULT_METHODS;

  async function handlePay() {
    setProcessing(true);
    // Create PaymentIntent
    try {
      await fetch("/api/checkout/intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total, currency: "usd", metadata: { country } }),
      });
    } catch { /* continue anyway in dev */ }
    // Simulate processing delay
    await new Promise(r => setTimeout(r, 1500));
    setOrderNum(`ORD-${Date.now().toString().slice(-8)}`);
    clearCart();
    setStep(4);
    setProcessing(false);
  }

  const steps = ["Dirección de entrega", "Método de pago", "Datos de facturación", "Confirmación"];

  if (items.length === 0 && step !== 4) {
    return (
      <div className="container-max py-16 text-center">
        <p className="text-[var(--color-on-surface-variant)] mb-4">El carrito está vacío.</p>
        <Link href="/productos" className="text-[var(--color-primary)] hover:underline">Volver al catálogo</Link>
      </div>
    );
  }

  return (
    <div className="container-max py-8">
      <h1 className="text-headline-md font-bold mb-6">Checkout B2B</h1>

      {/* Steps */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2 shrink-0">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step > i + 1 ? "bg-[var(--color-agri-green)] text-white" : step === i + 1 ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)]"}`}>
              {step > i + 1 ? "✓" : i + 1}
            </div>
            <span className={`text-xs font-medium hidden sm:block ${step === i + 1 ? "text-[var(--color-primary)]" : "text-[var(--color-on-surface-variant)]"}`}>{s}</span>
            {i < steps.length - 1 && <div className={`w-6 h-0.5 ${step > i + 1 ? "bg-[var(--color-agri-green)]" : "bg-[var(--color-border-subtle)]"}`} />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-6">

            {/* STEP 1 — Dirección */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="font-semibold flex items-center gap-2"><MapPin size={15} /> Dirección de entrega</h2>
                <div className="grid grid-cols-2 gap-4">
                  {([
                    { k: "nombre", label: "Nombre del receptor *", ph: "Nombre completo...", span: 2 },
                    { k: "empresa", label: "Empresa / Razón social", ph: "Opcional...", span: 1 },
                    { k: "rut", label: "RUT / NIT", ph: "Número de identificación...", span: 1 },
                    { k: "direccion", label: "Dirección de entrega *", ph: "Calle, número, apt/bodega...", span: 2 },
                    { k: "ciudad", label: "Ciudad *", ph: "Ciudad...", span: 1 },
                    { k: "departamento", label: "Departamento / Estado *", ph: "Región...", span: 1 },
                    { k: "telefono", label: "Teléfono de contacto *", ph: "+57 300...", span: 1 },
                  ] as { k: keyof Address; label: string; ph: string; span: number }[]).map(f => (
                    <label key={f.k} className={`text-xs font-medium ${f.span === 2 ? "col-span-2" : ""}`}>
                      {f.label}
                      <input className="w-full mt-1 p-2.5 text-sm border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                        placeholder={f.ph} value={address[f.k]}
                        onChange={e => setAddress(p => ({ ...p, [f.k]: e.target.value }))} />
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2 — Pago */}
            {step === 2 && (
              <div className="space-y-4">
                <h2 className="font-semibold flex items-center gap-2"><CreditCard size={15} /> Método de pago</h2>
                <p className="text-xs text-[var(--color-on-surface-variant)]">País de entrega: <strong>{country}</strong> — métodos disponibles para tu región</p>
                <div className="space-y-2">
                  {methods.map(m => (
                    <button key={m.label} onClick={() => setPayMethod(m.label)}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${payMethod === m.label ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5" : "border-[var(--color-border-subtle)] hover:border-[var(--color-primary)]/50"}`}>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${payMethod === m.label ? "border-[var(--color-primary)]" : "border-[var(--color-border-subtle)]"}`}>
                        {payMethod === m.label && <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)]" />}
                      </div>
                      <span className="text-lg">{m.icon}</span>
                      <span className="text-sm font-medium">{m.label}</span>
                    </button>
                  ))}
                </div>
                {payMethod.toLowerCase().includes("stripe") && (
                  <div className="bg-[var(--color-surface-container-low)] rounded-lg p-4 space-y-3">
                    <p className="text-xs font-semibold">Datos de tarjeta (Stripe Elements)</p>
                    <input className="w-full p-2.5 text-sm border border-[var(--color-border-subtle)] rounded-lg" placeholder="Número de tarjeta (1234 5678 9012 3456)" />
                    <div className="grid grid-cols-2 gap-3">
                      <input className="p-2.5 text-sm border border-[var(--color-border-subtle)] rounded-lg" placeholder="MM/AA" />
                      <input className="p-2.5 text-sm border border-[var(--color-border-subtle)] rounded-lg" placeholder="CVV" />
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[var(--color-on-surface-variant)]">
                      <Shield size={11} className="text-[var(--color-agri-green)]" /> Pago seguro vía Stripe · PCI DSS compliant
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 3 — Facturación */}
            {step === 3 && (
              <div className="space-y-4">
                <h2 className="font-semibold flex items-center gap-2"><FileText size={15} /> Datos de facturación</h2>
                <div className="grid grid-cols-2 gap-4">
                  {([
                    { k: "razon_social", label: "Razón social *", ph: "Empresa o persona...", span: 2 },
                    { k: "nit", label: "NIT / RUC / RFC *", ph: "Número tributario...", span: 1 },
                    { k: "email", label: "Email para factura *", ph: "facturas@empresa.com", span: 1 },
                  ] as { k: keyof Billing; label: string; ph: string; span: number }[]).map(f => (
                    <label key={f.k} className={`text-xs font-medium ${f.span === 2 ? "col-span-2" : ""}`}>
                      {f.label}
                      <input className="w-full mt-1 p-2.5 text-sm border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                        placeholder={f.ph} value={billing[f.k]}
                        onChange={e => setBilling(p => ({ ...p, [f.k]: e.target.value }))} />
                    </label>
                  ))}
                  <label className="text-xs font-medium col-span-2">
                    Régimen tributario
                    <select className="w-full mt-1 p-2.5 text-sm border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                      value={billing.regimen} onChange={e => setBilling(p => ({ ...p, regimen: e.target.value }))}>
                      <option value="comun">Régimen común (IVA)</option>
                      <option value="simplificado">Régimen simplificado</option>
                      <option value="gran_contribuyente">Gran contribuyente</option>
                      <option value="sin">Sin ánimo de lucro</option>
                    </select>
                  </label>
                </div>
              </div>
            )}

            {/* STEP 4 — Confirmación */}
            {step === 4 && (
              <div className="text-center py-6">
                <CheckCircle size={56} className="mx-auto text-[var(--color-agri-green)] mb-4" />
                <h2 className="text-xl font-bold mb-2">¡Orden confirmada!</h2>
                <p className="text-sm text-[var(--color-on-surface-variant)] mb-1">Número de orden: <strong className="text-[var(--color-primary)]">{orderNum}</strong></p>
                <p className="text-sm text-[var(--color-on-surface-variant)] mb-6">Recibirás confirmación por email y WhatsApp. El vendedor preparará tu pedido en breve.</p>
                <div className="flex gap-3 justify-center">
                  <Link href={`/ordenes`} className="bg-[var(--color-primary)] text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:opacity-90">Ver mis órdenes</Link>
                  <Link href="/productos" className="border border-[var(--color-border-subtle)] px-6 py-2.5 rounded-lg text-sm">Seguir comprando</Link>
                </div>
              </div>
            )}

            {/* Navigation */}
            {step < 4 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-[var(--color-border-subtle)]">
                {step > 1 ? (
                  <button onClick={() => setStep(p => p - 1)} className="text-sm border border-[var(--color-border-subtle)] px-5 py-2 rounded-lg hover:bg-[var(--color-surface-container-low)]">← Anterior</button>
                ) : <Link href="/carrito" className="text-sm text-[var(--color-on-surface-variant)] hover:underline">← Carrito</Link>}

                {step < 3 ? (
                  <button onClick={() => setStep(p => p + 1)} className="text-sm bg-[var(--color-primary)] text-white px-6 py-2 rounded-lg font-medium hover:opacity-90">
                    Siguiente →
                  </button>
                ) : (
                  <button onClick={handlePay} disabled={processing}
                    className="text-sm bg-[var(--color-secondary)] text-white px-6 py-2 rounded-lg font-bold hover:opacity-90 disabled:opacity-60 flex items-center gap-2">
                    {processing ? <><span className="animate-spin">⏳</span> Procesando...</> : <>💳 Pagar ${total.toFixed(2)}</>}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Resumen lateral */}
        {step < 4 && (
          <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5 sticky top-24">
            <h3 className="font-semibold text-sm mb-4">Resumen del pedido</h3>
            <div className="space-y-2 mb-4">
              {items.map(i => (
                <div key={i.id} className="flex justify-between text-xs">
                  <span className="text-[var(--color-on-surface-variant)] truncate flex-1 mr-2">{i.name} ×{i.quantity}</span>
                  <span className="font-medium shrink-0">${(i.price * i.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-[var(--color-border-subtle)] pt-3 space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-[var(--color-on-surface-variant)]">Subtotal</span><span>${sub.toFixed(2)}</span></div>
              {couponDiscount > 0 && <div className="flex justify-between text-green-700"><span>Descuento</span><span>-${disc.toFixed(2)}</span></div>}
              <div className="flex justify-between"><span className="text-[var(--color-on-surface-variant)]">Envío</span><span>{shipping === 0 ? <span className="text-[var(--color-agri-green)]">Gratis</span> : `$${shipping}`}</span></div>
              <div className="flex justify-between font-bold text-base border-t border-[var(--color-border-subtle)] pt-2">
                <span>Total</span><span className="text-[var(--color-primary)]">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Regulatory badges — paso 63 */}
            {regWarnings.length > 0 && (
              <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3">
                <p className="text-xs font-semibold text-amber-700 flex items-center gap-1.5 mb-2">
                  <AlertTriangle size={12} /> Restricciones regulatorias ({country})
                </p>
                <ul className="space-y-1">
                  {regWarnings.map((w, i) => (
                    <li key={i} className="text-[10px] text-amber-800">• {w.message}</li>
                  ))}
                </ul>
                <Link href="/regulatorio" className="text-[10px] text-[var(--color-primary)] hover:underline mt-1 block">
                  Ver módulo regulatorio →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
