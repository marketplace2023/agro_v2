"use client";

import { useParams } from "next/navigation";
import {
  Building2, Phone, Mail, MapPin, ChevronLeft, TrendingUp,
  ShoppingCart, FileText, MessageSquare, Activity, Star,
} from "lucide-react";
import Link from "next/link";

const EMPRESA = {
  id: "EMP-001",
  nombre: "Grupo Agroindustrial S.A.",
  tipo: "Comprador corporativo",
  pais: "Colombia",
  ciudad: "Bogotá",
  telefono: "+57 310 123 4567",
  email: "compras@grupoagro.com",
  contactoPrincipal: "Mauricio Torres",
  segmento: "Gran cuenta",
  clienteDesde: "2024-03-15",
  calificacion: 4.8,
  creditoAprobado: "$80,000",
};

const RESUMEN = {
  totalComprado: "$284,500",
  ordenes: 14,
  ultimaCompra: "2026-05-22",
  oportunidadesActivas: 2,
  valorPipeline: "$186,000",
  diasSinActividad: 1,
};

const HISTORIAL = [
  { fecha: "2026-06-10", tipo: "Actividad", descripcion: "Llamada de seguimiento sobre validación logística de OPP-2026-034.", usuario: "María Gómez", ref: "OPP-2026-034" },
  { fecha: "2026-05-22", tipo: "Orden", descripcion: "Orden ORD-2026-122 confirmada — Fertilizantes NPK 8t — $48,000.", usuario: "Sistema", ref: "ORD-2026-122" },
  { fecha: "2026-05-15", tipo: "Cotización", descripcion: "Cotización COT-2026-089 enviada — Paquete campaña — $142,000.", usuario: "María Gómez", ref: "COT-2026-089" },
  { fecha: "2026-04-28", tipo: "Orden", descripcion: "Orden ORD-2026-098 entregada — Herbicidas 3t — $24,700. Calificación 5/5.", usuario: "Sistema", ref: "ORD-2026-098" },
  { fecha: "2026-04-10", tipo: "Contrato", descripcion: "Contrato B2B CTR-2026-011 firmado — Suministro trimestral de insumos.", usuario: "María Gómez", ref: "CTR-2026-011" },
  { fecha: "2026-03-05", tipo: "Orden", descripcion: "Orden ORD-2026-071 entregada — Insecticidas 2t — $18,200.", usuario: "Sistema", ref: "ORD-2026-071" },
  { fecha: "2026-02-18", tipo: "Actividad", descripcion: "Visita comercial en sede del cliente. Se identificó necesidad de fertilización foliar.", usuario: "Carlos Díaz", ref: null },
  { fecha: "2026-01-20", tipo: "Orden", descripcion: "Orden ORD-2026-014 entregada — Fungicidas sistémicos 5t — $61,000.", usuario: "Sistema", ref: "ORD-2026-014" },
];

const TIPO_ICON: Record<string, React.ReactNode> = {
  Actividad: <Activity size={13} />,
  Orden: <ShoppingCart size={13} />,
  Cotización: <FileText size={13} />,
  Contrato: <FileText size={13} />,
  Mensaje: <MessageSquare size={13} />,
};

const TIPO_COLOR: Record<string, string> = {
  Actividad: "bg-blue-50 text-blue-600",
  Orden: "bg-green-50 text-green-600",
  Cotización: "bg-violet-50 text-violet-600",
  Contrato: "bg-amber-50 text-amber-600",
  Mensaje: "bg-slate-50 text-slate-600",
};

export default function HistorialClientePage() {
  useParams();

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-3">
        <Link href="/crm/empresas" className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors">
          <ChevronLeft size={20} />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-headline-md font-bold flex items-center gap-2 truncate">
            <Building2 size={20} /> {EMPRESA.nombre}
          </h1>
          <p className="text-sm text-[var(--color-on-surface-variant)]">{EMPRESA.id} · {EMPRESA.tipo}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Star size={14} className="text-amber-400 fill-amber-400" />
          <span className="text-sm font-bold">{EMPRESA.calificacion}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info empresa */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
            <h2 className="font-semibold text-sm mb-3">Datos de la cuenta</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-[var(--color-on-surface-variant)] shrink-0" />
                <span>{EMPRESA.ciudad}, {EMPRESA.pais}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-[var(--color-on-surface-variant)] shrink-0" />
                <a href={`tel:${EMPRESA.telefono}`} className="text-[var(--color-primary)] hover:underline">{EMPRESA.telefono}</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-[var(--color-on-surface-variant)] shrink-0" />
                <a href={`mailto:${EMPRESA.email}`} className="text-[var(--color-primary)] hover:underline truncate">{EMPRESA.email}</a>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-[var(--color-border-subtle)] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[var(--color-on-surface-variant)]">Contacto principal</span>
                <span className="font-medium">{EMPRESA.contactoPrincipal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-on-surface-variant)]">Segmento</span>
                <span className="font-medium">{EMPRESA.segmento}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-on-surface-variant)]">Cliente desde</span>
                <span className="font-medium">{EMPRESA.clienteDesde}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-on-surface-variant)]">Crédito aprobado</span>
                <span className="font-medium text-green-600">{EMPRESA.creditoAprobado}</span>
              </div>
            </div>
          </div>

          {/* Resumen comercial */}
          <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
            <h2 className="font-semibold text-sm mb-3 flex items-center gap-2"><TrendingUp size={14} /> Resumen comercial</h2>
            <div className="space-y-3">
              {[
                { label: "Total comprado", valor: RESUMEN.totalComprado, destaca: true },
                { label: "Órdenes totales", valor: RESUMEN.ordenes },
                { label: "Última compra", valor: RESUMEN.ultimaCompra },
                { label: "Opps activas", valor: RESUMEN.oportunidadesActivas },
                { label: "Valor en pipeline", valor: RESUMEN.valorPipeline },
              ].map((r) => (
                <div key={r.label} className="flex justify-between text-xs">
                  <span className="text-[var(--color-on-surface-variant)]">{r.label}</span>
                  <span className={`font-semibold ${r.destaca ? "text-[var(--color-primary)]" : ""}`}>{r.valor}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Historial */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
          <div className="px-5 py-4 flex items-center justify-between border-b border-[var(--color-border-subtle)]">
            <h2 className="font-semibold text-sm">Historial completo</h2>
            <span className="text-[10px] text-[var(--color-on-surface-variant)]">{HISTORIAL.length} registros</span>
          </div>
          <div className="divide-y divide-[var(--color-border-subtle)] max-h-[600px] overflow-y-auto">
            {HISTORIAL.map((h, i) => (
              <div key={i} className="px-5 py-4 flex gap-3">
                <div className={`p-1.5 rounded-full h-fit shrink-0 ${TIPO_COLOR[h.tipo]}`}>
                  {TIPO_ICON[h.tipo]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className="text-[11px] font-semibold">{h.tipo}</span>
                    <span className="text-[10px] text-[var(--color-on-surface-variant)] shrink-0">{h.fecha}</span>
                  </div>
                  <p className="text-xs text-[var(--color-on-surface)]">{h.descripcion}</p>
                  <div className="flex gap-3 mt-1 text-[10px] text-[var(--color-on-surface-variant)]">
                    <span>Por: {h.usuario}</span>
                    {h.ref && (
                      <Link href="#" className="text-[var(--color-primary)] hover:underline">{h.ref}</Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-4 text-xs">
        <Link href="/crm/empresas" className="text-[var(--color-primary)] hover:underline flex items-center gap-1">
          <ChevronLeft size={11} /> Volver a empresas
        </Link>
        <Link href="/crm/oportunidades" className="text-[var(--color-primary)] hover:underline">Ver oportunidades</Link>
        <Link href="/dashboard/crm" className="text-[var(--color-primary)] hover:underline">← Dashboard CRM</Link>
      </div>
    </div>
  );
}
