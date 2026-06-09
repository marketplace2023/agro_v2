"use client";

import { useEffect, useState, useCallback } from "react";
import { useCartStore } from "@/store/cartStore";
import Link from "next/link";
import { Trash2, Minus, Plus, ShoppingCart, AlertTriangle, Shield, Tag, ChevronRight } from "lucide-react";

interface Warning { productId: string; type: string; message: string; }

export default function CarritoPage() {
  const { items, removeItem, updateQuantity, clearCart, subtotal, itemCount, totalByVendor, country, coupon, couponDiscount, applyCoupon, removeCoupon } = useCartStore();
  const [warnings, setWarnings] = useState<Warning[]>([]);
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [validating, setValidating] = useState(false);

  const validate = useCallback(async () => {
    if (!items.length) return;
    setValidating(true);
    try {
      const res = await fetch("/api/cart/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: items.map(i => ({ productId: i.productId, vendorId: i.vendorId, quantity: i.quantity })), country }),
      });
      const data = await res.json();
      setWarnings(data.warnings ?? []);
    } catch { /* network error — skip validation */ }
    setValidating(false);
  }, [items, country]);

  useEffect(() => { validate(); }, [validate]);

  function applyCode() {
    const valid: Record<string, number> = { CAFE15: 15, NUEVO10: 10, FERT5: 8 };
    const disc = valid[couponInput.toUpperCase()];
    if (disc) { applyCoupon(couponInput.toUpperCase(), disc); setCouponError(""); }
    else setCouponError("Cupón inválido o vencido");
  }

  const sub = subtotal();
  const discountAmount = coupon ? (sub * couponDiscount) / 100 : 0;
  const shipping = sub > 500 ? 0 : 45;
  const total = sub - discountAmount + shipping;
  const byVendor = totalByVendor();

  if (items.length === 0) {
    return (
      <div className="container-max py-16 text-center">
        <ShoppingCart size={56} className="mx-auto text-[var(--color-border-subtle)] mb-4" />
        <h1 className="text-headline-md font-bold mb-2">Tu carrito está vacío</h1>
        <p className="text-sm text-[var(--color-on-surface-variant)] mb-6">Agrega productos desde el catálogo para cotizar o comprar.</p>
        <Link href="/productos" className="inline-block bg-[var(--color-primary)] text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:opacity-90">
          Explorar productos
        </Link>
      </div>
    );
  }

  return (
    <div className="container-max py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-headline-md font-bold">Carrito B2B <span className="text-base font-normal text-[var(--color-on-surface-variant)]">({itemCount()} productos)</span></h1>
        <button onClick={clearCart} className="text-xs text-[var(--color-secondary)] hover:underline flex items-center gap-1">
          <Trash2 size={12} /> Vaciar carrito
        </button>
      </div>

      {/* Validating indicator */}
      {validating && <p className="text-xs text-[var(--color-on-surface-variant)] mb-3 flex items-center gap-1.5">⏳ Validando disponibilidad y registros regulatorios...</p>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Items por vendedor */}
        <div className="lg:col-span-2 space-y-4">
          {Object.entries(byVendor).map(([vendorId, { vendorName }]) => {
            const vendorItems = items.filter(i => i.vendorId === vendorId);
            return (
              <div key={vendorId} className="bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
                <div className="px-5 py-3 bg-[var(--color-surface-container-low)] flex items-center justify-between border-b border-[var(--color-border-subtle)]">
                  <p className="text-xs font-semibold flex items-center gap-1.5">🏪 {vendorName}</p>
                  <p className="text-xs text-[var(--color-on-surface-variant)]">
                    Subtotal: <span className="font-bold text-[var(--color-on-surface)]">${byVendor[vendorId].subtotal.toFixed(2)}</span>
                  </p>
                </div>
                <div className="divide-y divide-[var(--color-border-subtle)]">
                  {vendorItems.map(item => {
                    const warn = warnings.filter(w => w.productId === item.productId);
                    return (
                      <div key={item.id} className={`p-4 ${warn.some(w => w.type === "regulatorio" || w.type === "inactivo") ? "bg-red-50" : ""}`}>
                        <div className="flex gap-4">
                          {/* Imagen placeholder */}
                          <div className="w-16 h-16 rounded-lg bg-[var(--color-surface-container)] flex items-center justify-center text-2xl shrink-0">
                            🌿
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <Link href={`/productos/${item.slug}`} className="text-sm font-medium hover:text-[var(--color-primary)] transition-colors line-clamp-2">
                                  {item.name}
                                </Link>
                                <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{item.brand} · {item.unit}</p>
                                {item.isRegulated && (
                                  <span className="inline-flex items-center gap-1 text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded mt-1">
                                    <Shield size={9} /> Regulado
                                  </span>
                                )}
                              </div>
                              <button onClick={() => removeItem(item.id)} className="p-1 hover:bg-red-100 rounded text-[var(--color-secondary)]">
                                <Trash2 size={14} />
                              </button>
                            </div>
                            <div className="flex items-center justify-between mt-3">
                              {/* Quantity control */}
                              <div className="flex items-center gap-2 border border-[var(--color-border-subtle)] rounded-lg overflow-hidden">
                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 hover:bg-[var(--color-surface-container)] transition-colors">
                                  <Minus size={13} />
                                </button>
                                <span className="px-3 py-1 text-sm font-semibold min-w-[2.5rem] text-center">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 hover:bg-[var(--color-surface-container)] transition-colors">
                                  <Plus size={13} />
                                </button>
                              </div>
                              <p className="text-base font-bold text-[var(--color-on-surface)]">
                                ${(item.price * item.quantity).toFixed(2)}
                                <span className="text-xs font-normal text-[var(--color-on-surface-variant)] ml-1">(${item.price}/{item.unit})</span>
                              </p>
                            </div>
                            {/* Warnings */}
                            {warn.map((w, i) => (
                              <div key={i} className="flex items-start gap-1.5 mt-2 text-xs text-amber-700 bg-amber-50 rounded-lg px-2 py-1.5 border border-amber-200">
                                <AlertTriangle size={12} className="mt-0.5 shrink-0" />
                                {w.message}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Resumen */}
        <div className="space-y-4 sticky top-24">
          <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
            <h2 className="font-semibold text-sm mb-4">Resumen del pedido</h2>

            {/* Cupón */}
            <div className="mb-4">
              {coupon ? (
                <div className="flex items-center justify-between p-2.5 bg-green-50 rounded-lg border border-green-200">
                  <span className="text-xs font-medium text-green-700 flex items-center gap-1.5"><Tag size={12} /> {coupon} aplicado (-{couponDiscount}%)</span>
                  <button onClick={removeCoupon} className="text-xs text-[var(--color-secondary)] hover:underline">Quitar</button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    value={couponInput}
                    onChange={e => { setCouponInput(e.target.value); setCouponError(""); }}
                    placeholder="Código de descuento"
                    className="flex-1 text-xs border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 focus:outline-none focus:border-[var(--color-primary)]"
                    onKeyDown={e => e.key === "Enter" && applyCode()}
                  />
                  <button onClick={applyCode} className="text-xs bg-[var(--color-primary)] text-white px-3 py-2 rounded-lg font-medium">Aplicar</button>
                </div>
              )}
              {couponError && <p className="text-[10px] text-[var(--color-secondary)] mt-1">{couponError}</p>}
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--color-on-surface-variant)]">Subtotal</span>
                <span className="font-medium">${sub.toFixed(2)}</span>
              </div>
              {coupon && (
                <div className="flex justify-between text-green-700">
                  <span>Descuento ({couponDiscount}%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-[var(--color-on-surface-variant)]">Envío estimado</span>
                <span className={shipping === 0 ? "text-[var(--color-agri-green)] font-medium" : ""}>{shipping === 0 ? "Gratis" : `$${shipping.toFixed(2)}`}</span>
              </div>
              {shipping > 0 && <p className="text-[10px] text-[var(--color-on-surface-variant)]">Envío gratis en pedidos &gt;$500</p>}
              <div className="border-t border-[var(--color-border-subtle)] pt-2 flex justify-between font-bold text-base">
                <span>Total estimado</span>
                <span className="text-[var(--color-primary)]">${total.toFixed(2)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full mt-4 flex items-center justify-center gap-2 bg-[var(--color-secondary)] text-white py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
            >
              Proceder al checkout <ChevronRight size={16} />
            </Link>
            <Link href="/rfq/nueva" className="w-full mt-2 flex items-center justify-center gap-2 border border-[var(--color-primary)] text-[var(--color-primary)] py-2.5 rounded-xl font-medium text-sm hover:bg-[var(--color-primary)] hover:text-white transition-colors">
              Solicitar cotización (RFQ)
            </Link>
          </div>

          {/* Advertencias regulatorias resumidas */}
          {warnings.filter(w => w.type === "regulatorio").length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-xs font-semibold text-amber-700 flex items-center gap-1.5 mb-2">
                <AlertTriangle size={13} /> Restricciones regulatorias detectadas
              </p>
              <p className="text-xs text-amber-600">
                {warnings.filter(w => w.type === "regulatorio").length} producto(s) tienen restricciones para {country.toUpperCase()}. Revisa los detalles arriba antes de continuar.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
