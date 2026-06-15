"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Building2, Phone, Mail, MapPin, ChevronLeft, TrendingUp,
  ShoppingCart, FileText, Activity, Star, AlertCircle,
} from "lucide-react";
import Link from "next/link";

interface OrderItem {
  product: { name: string };
  quantity: number;
}

interface Order {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
}

interface Contract {
  id: string;
  status: string;
  totalAmount: number;
  startDate: string;
  endDate?: string | null;
}

interface CompanyUser {
  id: string;
  email: string;
  profile?: { firstName: string; lastName: string; phone?: string | null } | null;
}

interface CompanyDetail {
  id: string;
  name: string;
  commercialName?: string | null;
  type: string;
  country: string;
  city?: string | null;
  address?: string | null;
  verified: boolean;
  createdAt: string;
  users: CompanyUser[];
  orders: Order[];
  contracts: Contract[];
  credit?: { limit: number; status: string } | null;
}

const TIPO_COLOR: Record<string, string> = {
  orden:    "bg-green-50 text-green-600",
  contrato: "bg-amber-50 text-amber-600",
  registro: "bg-blue-50 text-blue-600",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-CO", { year: "numeric", month: "short", day: "numeric" });
}

function formatAmount(n: number) {
  return `$${n.toLocaleString("es-CO")}`;
}

export default function HistorialClientePage() {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<CompanyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/crm/empresas/${id}`)
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(setCompany)
      .catch(() => setError("No se pudo cargar la empresa."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl py-16 text-center text-[var(--color-on-surface-variant)]">
        <Building2 size={36} className="mx-auto mb-3 opacity-30 animate-pulse" />
        <p className="text-sm">Cargando empresa...</p>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="max-w-5xl py-16 text-center">
        <AlertCircle size={36} className="mx-auto mb-3 text-red-400" />
        <p className="text-sm font-medium">{error ?? "Empresa no encontrada"}</p>
        <Link href="/crm/empresas" className="mt-4 inline-block text-sm text-[var(--color-primary)] hover:underline">
          ← Volver a empresas
        </Link>
      </div>
    );
  }

  const primaryUser = company.users[0];
  const primaryContact = primaryUser
    ? {
        name: primaryUser.profile
          ? `${primaryUser.profile.firstName} ${primaryUser.profile.lastName}`.trim() || primaryUser.email
          : primaryUser.email,
        phone: primaryUser.profile?.phone ?? null,
        email: primaryUser.email,
      }
    : null;

  const totalComprado = company.orders.reduce((s, o) => s + o.totalAmount, 0);
  const lastOrder = company.orders[0] ?? null;

  // Build timeline: orders + contracts + registration, sorted by date desc
  const timeline = [
    ...company.orders.map(o => ({
      fecha: o.createdAt,
      tipo: "orden",
      icon: <ShoppingCart size={13} />,
      descripcion: `Orden ${o.id.slice(0, 10)}… — ${o.items[0]?.product.name ?? "productos"} — ${formatAmount(o.totalAmount)}`,
      ref: o.id,
      sub: `Estado: ${o.status.replace(/_/g, " ")}`,
    })),
    ...company.contracts.map(c => ({
      fecha: c.startDate,
      tipo: "contrato",
      icon: <FileText size={13} />,
      descripcion: `Contrato ${c.id.slice(0, 10)}… — ${formatAmount(c.totalAmount)}`,
      ref: c.id,
      sub: `Estado: ${c.status}`,
    })),
    {
      fecha: company.createdAt,
      tipo: "registro",
      icon: <Activity size={13} />,
      descripcion: `Empresa registrada en la plataforma`,
      ref: null,
      sub: company.type,
    },
  ].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/crm/empresas" className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]">
          <ChevronLeft size={20} />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-headline-md font-bold flex items-center gap-2 truncate">
            <Building2 size={20} /> {company.commercialName ?? company.name}
          </h1>
          <p className="text-sm text-[var(--color-on-surface-variant)]">
            {company.id.slice(0, 12)}… · {company.type}
            {company.verified && " · ✓ Verificada"}
          </p>
        </div>
        {company.orders.length > 0 && (
          <div className="flex items-center gap-1 shrink-0">
            <Star size={14} className="text-amber-400 fill-amber-400" />
            <span className="text-sm font-bold">{company.orders.length} órd.</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info empresa */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
            <h2 className="font-semibold text-sm mb-3">Datos de la cuenta</h2>
            <div className="space-y-3 text-sm">
              {(company.city || company.country) && (
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-[var(--color-on-surface-variant)] shrink-0" />
                  <span>{[company.city, company.country].filter(Boolean).join(", ")}</span>
                </div>
              )}
              {primaryContact?.phone && (
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-[var(--color-on-surface-variant)] shrink-0" />
                  <a href={`tel:${primaryContact.phone}`} className="text-[var(--color-primary)] hover:underline">
                    {primaryContact.phone}
                  </a>
                </div>
              )}
              {primaryContact?.email && (
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-[var(--color-on-surface-variant)] shrink-0" />
                  <a href={`mailto:${primaryContact.email}`} className="text-[var(--color-primary)] hover:underline truncate">
                    {primaryContact.email}
                  </a>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-[var(--color-border-subtle)] space-y-2 text-xs">
              {primaryContact && (
                <div className="flex justify-between">
                  <span className="text-[var(--color-on-surface-variant)]">Contacto principal</span>
                  <span className="font-medium">{primaryContact.name}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-[var(--color-on-surface-variant)]">Tipo</span>
                <span className="font-medium capitalize">{company.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-on-surface-variant)]">Cliente desde</span>
                <span className="font-medium">{formatDate(company.createdAt)}</span>
              </div>
              {company.credit && (
                <div className="flex justify-between">
                  <span className="text-[var(--color-on-surface-variant)]">Crédito aprobado</span>
                  <span className="font-medium text-green-600">{formatAmount(company.credit.limit)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Resumen comercial */}
          <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
            <h2 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <TrendingUp size={14} /> Resumen comercial
            </h2>
            <div className="space-y-3">
              {[
                { label: "Total comprado",   valor: formatAmount(totalComprado), destaca: true },
                { label: "Órdenes totales",  valor: company.orders.length },
                { label: "Contratos",        valor: company.contracts.length },
                { label: "Última orden",     valor: lastOrder ? formatDate(lastOrder.createdAt) : "—" },
                ...(company.credit ? [{ label: "Crédito",  valor: company.credit.status }] : []),
              ].map(r => (
                <div key={r.label} className="flex justify-between text-xs">
                  <span className="text-[var(--color-on-surface-variant)]">{r.label}</span>
                  <span className={`font-semibold ${r.destaca ? "text-[var(--color-primary)]" : ""}`}>
                    {String(r.valor)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Historial */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
          <div className="px-5 py-4 flex items-center justify-between border-b border-[var(--color-border-subtle)]">
            <h2 className="font-semibold text-sm">Historial completo</h2>
            <span className="text-[10px] text-[var(--color-on-surface-variant)]">{timeline.length} registros</span>
          </div>

          {timeline.length === 0 ? (
            <div className="py-12 text-center text-sm text-[var(--color-on-surface-variant)]">
              <Activity size={28} className="mx-auto mb-2 opacity-20" />
              <p>Sin actividad registrada</p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--color-border-subtle)] max-h-[600px] overflow-y-auto">
              {timeline.map((h, i) => (
                <div key={i} className="px-5 py-4 flex gap-3">
                  <div className={`p-1.5 rounded-full h-fit shrink-0 ${TIPO_COLOR[h.tipo] ?? "bg-gray-50 text-gray-600"}`}>
                    {h.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className="text-[11px] font-semibold capitalize">{h.tipo}</span>
                      <span className="text-[10px] text-[var(--color-on-surface-variant)] shrink-0">
                        {formatDate(h.fecha)}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--color-on-surface)]">{h.descripcion}</p>
                    <div className="flex gap-3 mt-1 text-[10px] text-[var(--color-on-surface-variant)]">
                      <span>{h.sub}</span>
                      {h.ref && h.tipo === "orden" && (
                        <Link href={`/ordenes/${h.ref}`} className="text-[var(--color-primary)] hover:underline">
                          Ver orden →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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
