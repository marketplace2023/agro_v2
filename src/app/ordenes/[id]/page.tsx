"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Package, FileText, MapPin, CreditCard, MessageSquare, ChevronLeft, Download, CheckCircle, Truck, Clock, AlertCircle, XCircle } from "lucide-react";

const MOCK_ORDER = {
  id: "ORD-2024-001",
  estado: "en_transito",
  fecha: "2026-06-07",
  vendedor: "DistAgroMax",
  vendedor_email: "ventas@distagromax.com.co",
  comprador: "Agroproductos SA",
  pais: "CO",
  total: 850,
  metodo_pago: "Stripe",
  moneda: "USD",
  items: [
    { nombre: "Urea Granulada 46%", cantidad: 20, unidad: "sacos 50kg", precio: 34, total: 680 },
    { nombre: "Soporte técnico aplicación", cantidad: 1, unidad: "visita", precio: 170, total: 170 },
  ],
  direccion: "Bodega 12A, Vía Principal km 5, Funza, Cundinamarca, CO",
  timeline: [
    { estado: "pendiente", fecha: "2026-06-07 09:12", actor: "Sistema", descripcion: "Orden creada por el comprador" },
    { estado: "confirmada", fecha: "2026-06-07 10:45", actor: "DistAgroMax", descripcion: "Vendedor confirmó disponibilidad de stock" },
    { estado: "en_preparacion", fecha: "2026-06-07 14:30", actor: "DistAgroMax", descripcion: "Productos siendo alistados en bodega" },
    { estado: "en_transito", fecha: "2026-06-08 08:00", actor: "Transportes Andinos SAS", descripcion: "Guía TRK-2024-9871 — Salida de bodega Bogotá" },
  ],
  tracking: [
    { hito: "Origen", lugar: "Bodega Bogotá, CO", fecha: "Jun 8, 08:00", done: true },
    { hito: "Checkpoint 1", lugar: "Peaje Siberia", fecha: "Jun 8, 09:45", done: true },
    { hito: "En camino", lugar: "Ruta Funza - Cundinamarca", fecha: "En curso", done: false },
    { hito: "Destino final", lugar: "Bodega 12A, Funza", fecha: "Estimado Jun 9", done: false },
  ],
  documentos: [
    { tipo: "Factura comercial", num: "FAC-2024-4521", fecha: "2026-06-07", disponible: true },
    { tipo: "Remisión de despacho", num: "REM-2024-0087", fecha: "2026-06-08", disponible: true },
    { tipo: "Certificado de calidad", num: "CERT-URE-221", fecha: "2026-06-07", disponible: true },
    { tipo: "Hoja de seguridad (SDS)", num: "SDS-UREA-01", fecha: "2026-01-01", disponible: true },
    { tipo: "Certificado ICA", num: "Pendiente", fecha: "—", disponible: false },
  ],
  pagos: [
    { concepto: "Pago inicial 60%", monto: 510, fecha: "2026-06-07", estado: "confirmado", referencia: "pi_mock_1234" },
    { concepto: "Saldo 40%", monto: 340, fecha: "2026-06-09 (estimado)", estado: "pendiente", referencia: "—" },
  ],
};

const TABS = [
  { key: "productos", label: "Productos", icon: Package },
  { key: "documentos", label: "Documentos PDF", icon: FileText },
  { key: "tracking", label: "Tracking", icon: MapPin },
  { key: "pagos", label: "Pagos", icon: CreditCard },
  { key: "reclamos", label: "Reclamos", icon: MessageSquare },
];

const TIMELINE_ICONS: Record<string, React.ReactNode> = {
  pendiente: <Clock size={14} />,
  confirmada: <CheckCircle size={14} />,
  en_preparacion: <Package size={14} />,
  en_transito: <Truck size={14} />,
  entregada: <CheckCircle size={14} />,
  cancelada: <XCircle size={14} />,
  en_reclamo: <AlertCircle size={14} />,
};

const TIMELINE_COLORS: Record<string, string> = {
  pendiente: "bg-yellow-500",
  confirmada: "bg-blue-500",
  en_preparacion: "bg-purple-500",
  en_transito: "bg-orange-500",
  entregada: "bg-green-600",
  cancelada: "bg-gray-400",
  en_reclamo: "bg-red-500",
};

const STATUS_BADGES: Record<string, string> = {
  pendiente: "bg-yellow-100 text-yellow-700",
  confirmada: "bg-blue-100 text-blue-700",
  en_preparacion: "bg-purple-100 text-purple-700",
  en_transito: "bg-orange-100 text-orange-700",
  entregada: "bg-green-100 text-green-700",
  cancelada: "bg-gray-100 text-gray-600",
  en_reclamo: "bg-red-100 text-red-700",
};

export default function OrdenDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [tab, setTab] = useState("productos");
  const [reclamo, setReclamo] = useState("");
  const [reclamoSent, setReclamoSent] = useState(false);

  const order = MOCK_ORDER;

  return (
    <div className="container-max py-8 max-w-5xl">
      {/* Breadcrumb + header */}
      <div className="mb-6">
        <Link href="/ordenes" className="flex items-center gap-1.5 text-xs text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] mb-3 w-fit">
          <ChevronLeft size={13} /> Mis órdenes
        </Link>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-headline-md font-bold">{id ?? order.id}</h1>
            <p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">{order.fecha} · {order.vendedor} · {order.pais}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${STATUS_BADGES[order.estado]}`}>
              {order.estado.replace(/_/g, " ")}
            </span>
            <span className="text-lg font-bold text-[var(--color-primary)]">${order.total.toLocaleString()} {order.moneda}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Timeline — left rail */}
        <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
          <h2 className="text-sm font-semibold mb-4">Historial de la orden</h2>
          <div className="relative">
            <div className="absolute left-3 top-3 bottom-3 w-0.5 bg-[var(--color-border-subtle)]" />
            <ul className="space-y-4 relative">
              {order.timeline.map((t, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white shrink-0 z-10 relative ${TIMELINE_COLORS[t.estado] ?? "bg-gray-400"}`}>
                    {TIMELINE_ICONS[t.estado]}
                  </div>
                  <div>
                    <p className="text-xs font-semibold capitalize">{t.estado.replace(/_/g, " ")}</p>
                    <p className="text-[11px] text-[var(--color-on-surface-variant)]">{t.descripcion}</p>
                    <p className="text-[10px] text-[var(--color-on-surface-variant)] mt-0.5">{t.actor} · {t.fecha}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Role actions */}
          <div className="mt-5 pt-4 border-t border-[var(--color-border-subtle)] space-y-2">
            <p className="text-[10px] font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide mb-1.5">Acciones</p>
            {order.estado === "en_transito" && (
              <button className="w-full text-xs bg-[var(--color-agri-green)] text-white py-2 rounded-lg font-medium hover:opacity-90">
                Confirmar entrega recibida
              </button>
            )}
            {order.estado === "confirmada" && (
              <button className="w-full text-xs bg-[var(--color-primary)] text-white py-2 rounded-lg font-medium hover:opacity-90">
                Cancelar orden
              </button>
            )}
            <button className="w-full text-xs border border-[var(--color-border-subtle)] py-2 rounded-lg hover:bg-[var(--color-surface-container-low)]">
              Solicitar soporte
            </button>
            <button className="w-full text-xs border border-[var(--color-border-subtle)] py-2 rounded-lg hover:bg-[var(--color-surface-container-low)]">
              Volver a pedir
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Tabs */}
          <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
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
                        {["Producto", "Cant.", "Precio unit.", "Total"].map(h => (
                          <th key={h} className="text-left pb-2 text-xs font-medium text-[var(--color-on-surface-variant)]">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map(item => (
                        <tr key={item.nombre} className="border-b border-[var(--color-border-subtle)]">
                          <td className="py-3 font-medium text-sm">{item.nombre}</td>
                          <td className="py-3 text-sm">{item.cantidad} {item.unidad}</td>
                          <td className="py-3 text-sm">${item.precio}</td>
                          <td className="py-3 text-sm font-bold">${item.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="mt-4 flex justify-end">
                    <div className="text-right space-y-1">
                      <div className="text-sm flex gap-6 justify-between"><span className="text-[var(--color-on-surface-variant)]">Subtotal</span><span>${order.total}</span></div>
                      <div className="text-sm flex gap-6 justify-between"><span className="text-[var(--color-on-surface-variant)]">Envío</span><span className="text-[var(--color-agri-green)] font-medium">Incluido</span></div>
                      <div className="text-base font-bold flex gap-6 justify-between border-t pt-1 border-[var(--color-border-subtle)]">
                        <span>Total</span><span className="text-[var(--color-primary)]">${order.total} {order.moneda}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-[var(--color-border-subtle)]">
                    <p className="text-xs text-[var(--color-on-surface-variant)]"><strong>Dirección de entrega:</strong> {order.direccion}</p>
                  </div>
                </div>
              )}

              {/* TAB: Documentos */}
              {tab === "documentos" && (
                <div className="space-y-2">
                  {order.documentos.map(doc => (
                    <div key={doc.num} className={`flex items-center justify-between p-3 rounded-lg border ${doc.disponible ? "border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-container-lowest)]" : "border-dashed border-[var(--color-border-subtle)] opacity-50"}`}>
                      <div className="flex items-center gap-3">
                        <FileText size={16} className={doc.disponible ? "text-[var(--color-primary)]" : "text-[var(--color-on-surface-variant)]"} />
                        <div>
                          <p className="text-sm font-medium">{doc.tipo}</p>
                          <p className="text-xs text-[var(--color-on-surface-variant)]">{doc.num} · {doc.fecha}</p>
                        </div>
                      </div>
                      {doc.disponible ? (
                        <button className="flex items-center gap-1.5 text-xs text-[var(--color-primary)] border border-[var(--color-primary)] px-3 py-1 rounded-lg hover:bg-[var(--color-primary)] hover:text-white transition-colors">
                          <Download size={11} /> PDF
                        </button>
                      ) : (
                        <span className="text-[10px] text-[var(--color-on-surface-variant)] bg-[var(--color-surface-container)] px-2 py-0.5 rounded">Pendiente</span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* TAB: Tracking */}
              {tab === "tracking" && (
                <div>
                  <div className="bg-[var(--color-surface-container-low)] rounded-lg p-3 mb-4 text-xs">
                    <p className="font-medium">Guía de transporte: <span className="text-[var(--color-primary)] font-bold">TRK-2024-9871</span></p>
                    <p className="text-[var(--color-on-surface-variant)] mt-0.5">Transportes Andinos SAS · Est. llegada Jun 9</p>
                  </div>

                  {/* Visual route tracker */}
                  <div className="space-y-4 mb-4">
                    {order.tracking.map((t, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        <div className="relative flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs ${t.done ? "bg-[var(--color-agri-green)]" : "bg-[var(--color-border-subtle)]"}`}>
                            {t.done ? "✓" : i + 1}
                          </div>
                          {i < order.tracking.length - 1 && (
                            <div className={`w-0.5 h-8 mt-1 ${t.done ? "bg-[var(--color-agri-green)]" : "bg-[var(--color-border-subtle)]"}`} />
                          )}
                        </div>
                        <div className="pt-1.5">
                          <p className={`text-sm font-semibold ${t.done ? "text-[var(--color-on-surface)]" : "text-[var(--color-on-surface-variant)]"}`}>{t.hito}</p>
                          <p className="text-xs text-[var(--color-on-surface-variant)]">{t.lugar}</p>
                          <p className="text-[11px] text-[var(--color-on-surface-variant)]">{t.fecha}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Map placeholder */}
                  <div className="bg-[var(--color-surface-container-low)] border border-[var(--color-border-subtle)] rounded-xl overflow-hidden h-52 flex items-center justify-center">
                    <div className="text-center text-[var(--color-on-surface-variant)]">
                      <MapPin size={28} className="mx-auto mb-2 opacity-40" />
                      <p className="text-xs font-medium">Mapa de ruta en tiempo real</p>
                      <p className="text-[10px] mt-0.5">Leaflet + OpenStreetMap — disponible con GPS habilitado</p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: Pagos */}
              {tab === "pagos" && (
                <div>
                  <div className="space-y-3 mb-4">
                    {order.pagos.map((p, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-[var(--color-border-subtle)]">
                        <div>
                          <p className="text-sm font-medium">{p.concepto}</p>
                          <p className="text-xs text-[var(--color-on-surface-variant)]">Ref: {p.referencia} · {p.fecha}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-sm">${p.monto}</p>
                          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${p.estado === "confirmado" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                            {p.estado}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-[var(--color-surface-container-low)] rounded-lg p-3 text-xs">
                    <p className="font-medium">Método de pago: {order.metodo_pago}</p>
                    <p className="text-[var(--color-on-surface-variant)] mt-0.5">Todos los pagos son procesados de forma segura · PCI DSS</p>
                  </div>
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
                          placeholder="Describe el problema en detalle para que podamos ayudarte rápidamente..."
                          value={reclamo}
                          onChange={e => setReclamo(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium block mb-1.5">Adjuntar evidencia (opcional)</label>
                        <div className="border-2 border-dashed border-[var(--color-border-subtle)] rounded-lg p-6 text-center text-xs text-[var(--color-on-surface-variant)] cursor-pointer hover:border-[var(--color-primary)]">
                          Arrastra fotos o documentos aquí · PNG, JPG, PDF (máx. 10MB)
                        </div>
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
