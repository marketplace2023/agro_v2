"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Package, FileText, MapPin, CreditCard, MessageSquare,
  ChevronLeft, CheckCircle, Truck, Clock, AlertCircle, XCircle,
} from "lucide-react";

interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  product: { name: string; slug: string };
  variant?: { presentation?: string | null; unit?: string | null } | null;
}

interface TrackingEntry {
  id: string;
  status?: string | null;
  carrier?: string | null;
  trackingNumber?: string | null;
  estimatedDate?: string | null;
  updatedAt?: string | null;
}

interface OrderDetail {
  id: string;
  status: string;
  createdAt: string;
  totalAmount: number;
  items: OrderItem[];
  vendor: { company: { name: string; commercialName?: string | null; address?: string | null } };
  tracking: TrackingEntry[];
  payment?: {
    method?: string | null;
    status?: string | null;
    amount?: number | null;
    reference?: string | null;
    paidAt?: string | null;
  } | null;
  tickets: Array<{ id: string; status: string; type: string; subject: string }>;
}

const TABS = [
  { key: "productos",  label: "Productos",  icon: Package },
  { key: "tracking",   label: "Tracking",   icon: MapPin },
  { key: "pagos",      label: "Pagos",      icon: CreditCard },
  { key: "documentos", label: "Documentos", icon: FileText },
  { key: "reclamos",   label: "Reclamos",   icon: MessageSquare },
];

const STATUS_STEPS = ["pendiente", "confirmada", "preparando", "despachada", "entregada"] as const;

const STATUS_LABELS: Record<string, string> = {
  pendiente:  "Pendiente",
  confirmada: "Confirmada",
  preparando: "Preparando",
  despachada: "Despachada",
  entregada:  "Entregada",
  cancelada:  "Cancelada",
};

const STATUS_BADGES: Record<string, string> = {
  pendiente:  "bg-yellow-100 text-yellow-700",
  confirmada: "bg-blue-100 text-blue-700",
  preparando: "bg-purple-100 text-purple-700",
  despachada: "bg-orange-100 text-orange-700",
  entregada:  "bg-green-100 text-green-700",
  cancelada:  "bg-gray-100 text-gray-600",
};

const STEP_ICONS: Record<string, React.ReactNode> = {
  pendiente:  <Clock size={14} />,
  confirmada: <CheckCircle size={14} />,
  preparando: <Package size={14} />,
  despachada: <Truck size={14} />,
  entregada:  <CheckCircle size={14} />,
};

const STEP_COLORS: Record<string, string> = {
  pendiente:  "bg-yellow-500",
  confirmada: "bg-blue-500",
  preparando: "bg-purple-500",
  despachada: "bg-orange-500",
  entregada:  "bg-green-600",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-CO", { year: "numeric", month: "short", day: "numeric" });
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("es-CO", { dateStyle: "short", timeStyle: "short" });
}

export default function OrdenDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [tab, setTab] = useState("productos");
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [reclamo, setReclamo] = useState("");
  const [reclamoSent, setReclamoSent] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/ordenes/${id}`)
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(setOrder)
      .catch(() => setFetchError("No se pudo cargar la orden."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="container-max py-16 text-center text-[var(--color-on-surface-variant)]">
        <Package size={36} className="mx-auto mb-3 opacity-30 animate-pulse" />
        <p className="text-sm">Cargando orden...</p>
      </div>
    );
  }

  if (fetchError || !order) {
    return (
      <div className="container-max py-16 text-center">
        <AlertCircle size={36} className="mx-auto mb-3 text-red-400" />
        <p className="text-sm font-medium">{fetchError ?? "Orden no encontrada"}</p>
        <Link href="/ordenes" className="mt-4 inline-block text-sm text-[var(--color-primary)] hover:underline">
          ← Volver a mis órdenes
        </Link>
      </div>
    );
  }

  const vendorName = order.vendor.company.commercialName ?? order.vendor.company.name;
  const currentStepIdx = STATUS_STEPS.indexOf(order.status as typeof STATUS_STEPS[number]);
  const isCancelled = order.status === "cancelada";
  const firstTracking = order.tracking[0];

  return (
    <div className="container-max py-8 max-w-5xl">
      {/* Breadcrumb + header */}
      <div className="mb-6">
        <Link href="/ordenes" className="flex items-center gap-1.5 text-xs text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] mb-3 w-fit">
          <ChevronLeft size={13} /> Mis órdenes
        </Link>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-headline-md font-bold">{order.id.slice(0, 16)}…</h1>
            <p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">
              {formatDate(order.createdAt)} · {vendorName}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${STATUS_BADGES[order.status] ?? "bg-gray-100 text-gray-600"}`}>
              {STATUS_LABELS[order.status] ?? order.status}
            </span>
            <span className="text-lg font-bold text-[var(--color-primary)]">
              ${order.totalAmount.toLocaleString("es-CO")}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Progress rail */}
        <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
          <h2 className="text-sm font-semibold mb-4">Estado de la orden</h2>

          {isCancelled ? (
            <div className="flex gap-3 items-center">
              <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white">
                <XCircle size={14} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Cancelada</p>
                <p className="text-xs text-[var(--color-on-surface-variant)]">{formatDate(order.createdAt)}</p>
              </div>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute left-3.5 top-3 bottom-3 w-0.5 bg-[var(--color-border-subtle)]" />
              <ul className="space-y-5 relative">
                {STATUS_STEPS.map((step, i) => {
                  const done = i <= currentStepIdx;
                  const active = i === currentStepIdx;
                  return (
                    <li key={step} className="flex gap-3 items-start">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white shrink-0 z-10 relative transition-colors ${done ? STEP_COLORS[step] : "bg-gray-200"}`}>
                        {done ? STEP_ICONS[step] : <span className="w-2 h-2 rounded-full bg-white/60" />}
                      </div>
                      <div className="pt-0.5">
                        <p className={`text-xs font-semibold ${active || done ? "text-[var(--color-on-surface)]" : "text-[var(--color-on-surface-variant)]"}`}>
                          {STATUS_LABELS[step]}
                        </p>
                        {active && (
                          <p className="text-[10px] text-[var(--color-on-surface-variant)] mt-0.5">
                            {formatDateTime(order.createdAt)}
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="mt-5 pt-4 border-t border-[var(--color-border-subtle)] space-y-2">
            <p className="text-[10px] font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide mb-1.5">Acciones</p>
            {order.status === "despachada" && (
              <button className="w-full text-xs bg-[var(--color-agri-green)] text-white py-2 rounded-lg font-medium hover:opacity-90">
                Confirmar entrega recibida
              </button>
            )}
            {(order.status === "pendiente" || order.status === "confirmada") && (
              <button className="w-full text-xs bg-red-50 text-red-600 border border-red-200 py-2 rounded-lg font-medium hover:bg-red-100">
                Cancelar orden
              </button>
            )}
            <button onClick={() => setTab("reclamos")} className="w-full text-xs border border-[var(--color-border-subtle)] py-2 rounded-lg hover:bg-[var(--color-surface-container-low)]">
              Solicitar soporte
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-[var(--color-border-subtle)] overflow-x-auto">
              {TABS.map(t => {
                const Icon = t.icon;
                return (
                  <button key={t.key} onClick={() => setTab(t.key)}
                    className={`flex items-center gap-1.5 px-4 py-3 text-xs font-medium shrink-0 border-b-2 transition-colors ${tab === t.key ? "border-[var(--color-primary)] text-[var(--color-primary)]" : "border-transparent text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]"}`}>
                    <Icon size={12} /> {t.label}
                  </button>
                );
              })}
            </div>

            <div className="p-5">
              {/* TAB: Productos */}
              {tab === "productos" && (
                <div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        {["Producto", "Cant.", "Precio unit.", "Subtotal"].map(h => (
                          <th key={h} className="text-left pb-2 text-xs font-medium text-[var(--color-on-surface-variant)]">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map(item => {
                        const pres = item.variant?.presentation ?? item.variant?.unit ?? "";
                        const label = `${item.product.name}${pres ? ` · ${pres}` : ""}`;
                        return (
                          <tr key={item.id} className="border-b border-[var(--color-border-subtle)]">
                            <td className="py-3 font-medium text-sm">{label}</td>
                            <td className="py-3 text-sm">{item.quantity}</td>
                            <td className="py-3 text-sm">${item.unitPrice.toLocaleString("es-CO")}</td>
                            <td className="py-3 text-sm font-bold">${item.subtotal.toLocaleString("es-CO")}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <div className="mt-4 flex justify-end">
                    <div className="text-base font-bold flex gap-6 border-t pt-2 border-[var(--color-border-subtle)]">
                      <span>Total</span>
                      <span className="text-[var(--color-primary)]">${order.totalAmount.toLocaleString("es-CO")}</span>
                    </div>
                  </div>
                  {order.vendor.company.address && (
                    <div className="mt-4 pt-4 border-t border-[var(--color-border-subtle)]">
                      <p className="text-xs text-[var(--color-on-surface-variant)]">
                        <strong>Vendedor:</strong> {vendorName} · {order.vendor.company.address}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB: Tracking */}
              {tab === "tracking" && (
                <div>
                  {order.tracking.length === 0 ? (
                    <div className="text-center py-10 text-[var(--color-on-surface-variant)]">
                      <Truck size={32} className="mx-auto mb-2 opacity-20" />
                      <p className="text-sm font-medium">Sin información de rastreo aún</p>
                      <p className="text-xs mt-1">El vendedor actualizará el estado del envío pronto.</p>
                    </div>
                  ) : (
                    <>
                      {firstTracking?.trackingNumber && (
                        <div className="bg-[var(--color-surface-container-low)] rounded-lg p-3 mb-4 text-xs">
                          <p className="font-medium">
                            Guía: <span className="text-[var(--color-primary)] font-bold">{firstTracking.trackingNumber}</span>
                          </p>
                          {firstTracking.carrier && (
                            <p className="text-[var(--color-on-surface-variant)] mt-0.5">{firstTracking.carrier}</p>
                          )}
                          {firstTracking.estimatedDate && (
                            <p className="text-[var(--color-on-surface-variant)] mt-0.5">
                              Entrega estimada: {formatDate(firstTracking.estimatedDate)}
                            </p>
                          )}
                        </div>
                      )}
                      <div className="space-y-3">
                        {order.tracking.map((t, i) => (
                          <div key={t.id ?? i} className="flex gap-3 items-start">
                            <div className="w-7 h-7 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white text-xs shrink-0">
                              {i + 1}
                            </div>
                            <div className="pt-0.5">
                              <p className="text-sm font-semibold capitalize">{(t.status ?? "actualización").replace(/_/g, " ")}</p>
                              {t.updatedAt && (
                                <p className="text-xs text-[var(--color-on-surface-variant)]">{formatDateTime(t.updatedAt)}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 bg-[var(--color-surface-container-low)] border border-[var(--color-border-subtle)] rounded-xl h-44 flex items-center justify-center">
                        <div className="text-center text-[var(--color-on-surface-variant)]">
                          <MapPin size={28} className="mx-auto mb-2 opacity-40" />
                          <p className="text-xs font-medium">Mapa de ruta en tiempo real</p>
                          <p className="text-[10px] mt-0.5">Disponible con GPS habilitado</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* TAB: Pagos */}
              {tab === "pagos" && (
                <div>
                  {!order.payment ? (
                    <div className="text-center py-10 text-[var(--color-on-surface-variant)]">
                      <CreditCard size={32} className="mx-auto mb-2 opacity-20" />
                      <p className="text-sm font-medium">Sin registro de pago</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-lg border border-[var(--color-border-subtle)]">
                        <div>
                          <p className="text-sm font-medium">Pago de orden</p>
                          {order.payment.reference && (
                            <p className="text-xs text-[var(--color-on-surface-variant)]">Ref: {order.payment.reference}</p>
                          )}
                          {order.payment.paidAt && (
                            <p className="text-xs text-[var(--color-on-surface-variant)]">{formatDate(order.payment.paidAt)}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-sm">
                            ${(order.payment.amount ?? order.totalAmount).toLocaleString("es-CO")}
                          </p>
                          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${order.payment.status === "pagado" || order.payment.status === "aprobado" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                            {order.payment.status ?? "pendiente"}
                          </span>
                        </div>
                      </div>
                      {order.payment.method && (
                        <div className="bg-[var(--color-surface-container-low)] rounded-lg p-3 text-xs">
                          <p className="font-medium">Método de pago: {order.payment.method}</p>
                          <p className="text-[var(--color-on-surface-variant)] mt-0.5">Pagos procesados de forma segura · PCI DSS</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB: Documentos */}
              {tab === "documentos" && (
                <div className="text-center py-10 text-[var(--color-on-surface-variant)]">
                  <FileText size={32} className="mx-auto mb-2 opacity-20" />
                  <p className="text-sm font-medium">Documentos de la orden</p>
                  <p className="text-xs mt-1 max-w-xs mx-auto">
                    La factura y documentos de despacho estarán disponibles una vez el vendedor los genere.
                  </p>
                  {order.tickets.length > 0 && (
                    <div className="mt-4 text-left space-y-2">
                      <p className="text-xs font-semibold text-center mb-2">Tickets relacionados</p>
                      {order.tickets.map(t => (
                        <div key={t.id} className="flex items-center justify-between p-3 rounded-lg border border-[var(--color-border-subtle)] bg-white">
                          <div>
                            <p className="text-sm font-medium">{t.subject}</p>
                            <p className="text-xs text-[var(--color-on-surface-variant)] capitalize">{t.type.replace(/_/g, " ")}</p>
                          </div>
                          <span className="text-xs bg-[var(--color-surface-container)] px-2 py-0.5 rounded-full">
                            {t.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB: Reclamos */}
              {tab === "reclamos" && (
                <div>
                  {reclamoSent ? (
                    <div className="text-center py-6">
                      <CheckCircle size={40} className="mx-auto text-[var(--color-agri-green)] mb-3" />
                      <p className="font-semibold">Reclamo enviado</p>
                      <p className="text-xs text-[var(--color-on-surface-variant)] mt-1">Nuestro equipo de soporte lo atenderá en menos de 48 horas hábiles.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm text-[var(--color-on-surface-variant)]">¿Tienes un problema con esta orden? Descríbelo y lo gestionaremos con el vendedor.</p>
                      <div>
                        <label className="text-xs font-medium block mb-1.5">Tipo de reclamo</label>
                        <select className="w-full p-2.5 text-sm border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]">
                          <option>Producto no llegó</option>
                          <option>Producto dañado / incompleto</option>
                          <option>No corresponde a lo pedido</option>
                          <option>Problema de calidad</option>
                          <option>Factura incorrecta</option>
                          <option>Otro</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-medium block mb-1.5">Descripción del problema *</label>
                        <textarea
                          rows={4}
                          className="w-full p-3 text-sm border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] resize-none"
                          placeholder="Describe el problema en detalle..."
                          value={reclamo}
                          onChange={e => setReclamo(e.target.value)}
                        />
                      </div>
                      <button
                        onClick={() => { if (reclamo.trim()) setReclamoSent(true); }}
                        disabled={!reclamo.trim()}
                        className="w-full py-2.5 text-sm font-bold bg-[var(--color-secondary)] text-white rounded-lg hover:opacity-90 disabled:opacity-40">
                        Enviar reclamo
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
