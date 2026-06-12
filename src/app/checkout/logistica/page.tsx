"use client";

import { useState } from "react";
import { Truck, Package, Users, ChevronLeft, ChevronRight, CheckCircle2, MapPin, Calendar, Weight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ORDEN_MOCK = {
  id: "ORD-2026-122",
  productos: [
    { nombre: "Fertilizante NPK 15-15-15", cantidad: "8,000 kg", peso: "8 t" },
    { nombre: "Urea 46%", cantidad: "2,000 kg", peso: "2 t" },
  ],
  origen: "Bodega DistAgroMax — Bogotá, Colombia",
  destino: "Finca Palmas del Norte — Valledupar, Cesar",
  distancia: "~850 km",
  pesoTotal: "10 t",
  volumenEst: "12 m³",
  fechaReq: "2026-06-16",
};

const OPCIONES = [
  {
    id: "comprador",
    titulo: "Tengo transporte propio",
    descripcion: "Utilizaré mi propia flota o un transportista contratado por mí.",
    icono: <Package size={28} />,
    color: "border-blue-300 bg-blue-50",
    colorActivo: "border-blue-500 bg-blue-50 ring-2 ring-blue-300",
    badge: null,
    href: "/logistica/transporte-comprador",
  },
  {
    id: "vendedor",
    titulo: "Usar flota del vendedor",
    descripcion: "DistAgroMax ofrece entrega con vehículos propios hasta tu bodega.",
    icono: <Truck size={28} />,
    color: "border-green-300 bg-green-50",
    colorActivo: "border-green-500 bg-green-50 ring-2 ring-green-300",
    badge: "Recomendado",
    href: "/logistica/flota-vendedor",
  },
  {
    id: "tercero",
    titulo: "Solicitar transportista en el marketplace",
    descripcion: "Compara ofertas de operadores logísticos registrados y elige la mejor.",
    icono: <Users size={28} />,
    color: "border-violet-300 bg-violet-50",
    colorActivo: "border-violet-500 bg-violet-50 ring-2 ring-violet-300",
    badge: null,
    href: "/logistica/solicitudes/nueva",
  },
];

export default function LogisticaCheckoutPage() {
  const [seleccion, setSeleccion] = useState<string | null>(null);
  const router = useRouter();

  const opcionSeleccionada = OPCIONES.find((o) => o.id === seleccion);

  return (
    <div className="min-h-screen bg-[var(--color-background-alt)]">
      <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/checkout" className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-bold">¿Cómo deseas gestionar la logística?</h1>
            <p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">
              Orden {ORDEN_MOCK.id} · Este paso es obligatorio para confirmar el despacho
            </p>
          </div>
        </div>

        {/* Resumen de la orden */}
        <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
          <h2 className="font-semibold text-sm mb-3">Resumen del envío</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <p className="text-[var(--color-on-surface-variant)] mb-0.5 flex items-center gap-1"><MapPin size={11} /> Origen</p>
              <p className="font-medium leading-snug">{ORDEN_MOCK.origen}</p>
            </div>
            <div>
              <p className="text-[var(--color-on-surface-variant)] mb-0.5 flex items-center gap-1"><MapPin size={11} /> Destino</p>
              <p className="font-medium leading-snug">{ORDEN_MOCK.destino}</p>
            </div>
            <div>
              <p className="text-[var(--color-on-surface-variant)] mb-0.5 flex items-center gap-1"><Weight size={11} /> Carga</p>
              <p className="font-medium">{ORDEN_MOCK.pesoTotal} · {ORDEN_MOCK.volumenEst}</p>
              <p className="text-[var(--color-on-surface-variant)]">{ORDEN_MOCK.distancia}</p>
            </div>
            <div>
              <p className="text-[var(--color-on-surface-variant)] mb-0.5 flex items-center gap-1"><Calendar size={11} /> Fecha requerida</p>
              <p className="font-medium">{ORDEN_MOCK.fechaReq}</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-[var(--color-border-subtle)]">
            <p className="text-[10px] text-[var(--color-on-surface-variant)] mb-1.5">Productos:</p>
            <div className="space-y-1">
              {ORDEN_MOCK.productos.map((p, i) => (
                <div key={i} className="flex justify-between text-xs">
                  <span>{p.nombre}</span>
                  <span className="text-[var(--color-on-surface-variant)]">{p.cantidad} · {p.peso}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Opciones */}
        <div className="space-y-3">
          {OPCIONES.map((o) => (
            <button
              key={o.id}
              onClick={() => setSeleccion(o.id)}
              className={`w-full flex items-start gap-5 p-5 rounded-xl border-2 transition-all text-left ${
                seleccion === o.id ? o.colorActivo : o.color
              }`}
            >
              <div className={`shrink-0 mt-0.5 ${seleccion === o.id ? "text-[var(--color-primary)]" : "text-[var(--color-on-surface-variant)]"}`}>
                {o.icono}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-sm">{o.titulo}</p>
                  {o.badge && (
                    <span className="text-[10px] bg-green-600 text-white px-2 py-0.5 rounded-full font-medium">{o.badge}</span>
                  )}
                </div>
                <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">{o.descripcion}</p>
              </div>
              <div className={`shrink-0 mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                seleccion === o.id
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)]"
                  : "border-[var(--color-border-subtle)]"
              }`}>
                {seleccion === o.id && <CheckCircle2 size={14} className="text-white" />}
              </div>
            </button>
          ))}
        </div>

        {/* Info adicional según selección */}
        {seleccion === "vendedor" && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm">
            <p className="font-semibold text-green-800 mb-1">Flota del vendedor disponible</p>
            <p className="text-green-700">DistAgroMax tiene disponibilidad para el {ORDEN_MOCK.fechaReq}. El costo de flete se calculará en el siguiente paso basado en distancia y tipo de vehículo.</p>
          </div>
        )}
        {seleccion === "tercero" && (
          <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 text-sm">
            <p className="font-semibold text-violet-800 mb-1">Solicitud de flete</p>
            <p className="text-violet-700">Se creará una solicitud y se invitarán operadores logísticos compatibles. Recibirás ofertas en las próximas horas y podrás comparar precio, tiempo y reputación.</p>
          </div>
        )}
        {seleccion === "comprador" && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm">
            <p className="font-semibold text-blue-800 mb-1">Transporte propio</p>
            <p className="text-blue-700">Deberás registrar los datos del transportista, vehículo y conductor en el siguiente paso. La mercancía quedará lista para retiro en la fecha acordada.</p>
          </div>
        )}

        {/* Acción */}
        <div className="flex gap-3">
          <Link href="/checkout" className="flex-1 text-center border border-[var(--color-border-subtle)] py-3 rounded-xl text-sm hover:bg-[var(--color-surface-container)] transition-colors text-[var(--color-on-surface-variant)]">
            Volver
          </Link>
          <button
            disabled={!seleccion}
            onClick={() => seleccion && router.push(opcionSeleccionada!.href)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-opacity ${
              seleccion
                ? "bg-[var(--color-primary)] text-white hover:opacity-90"
                : "bg-[var(--color-border-subtle)] text-[var(--color-on-surface-variant)] cursor-not-allowed"
            }`}
          >
            Continuar <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
