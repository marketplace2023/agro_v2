"use client";

import { useState, useEffect, useCallback } from "react";
import { AlertCircle, Search, Plus, ChevronRight, Phone, Calendar, User, Building2, Package } from "lucide-react";
import Link from "next/link";

interface OrderSummary {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

interface CompanyUser {
  id: string;
  email: string;
  profile?: { firstName: string; lastName: string; phone?: string | null } | null;
}

interface Company {
  id: string;
  name: string;
  commercialName?: string | null;
  type: string;
  country: string;
  city?: string | null;
  verified: boolean;
  createdAt: string;
  users: CompanyUser[];
  orders: OrderSummary[];
  credit?: { limit: number; status: string } | null;
}

const TYPE_LABEL: Record<string, string> = {
  compradora: "Compradora",
  vendedora: "Vendedora",
  fabricante: "Fabricante",
  distribuidora: "Distribuidora",
};

const TYPE_COLOR: Record<string, string> = {
  compradora: "bg-green-100 text-green-700",
  vendedora: "bg-blue-100 text-blue-700",
  fabricante: "bg-orange-100 text-orange-700",
  distribuidora: "bg-indigo-100 text-indigo-700",
};

function companyStatus(c: Company): { label: string; color: string } {
  if (c.orders.length === 0) return { label: "Sin órdenes", color: "bg-slate-100 text-slate-600" };
  const last = new Date(c.orders[0].createdAt);
  const daysSince = (Date.now() - last.getTime()) / (1000 * 60 * 60 * 24);
  if (daysSince <= 30) return { label: "Activo", color: "bg-emerald-100 text-emerald-700" };
  if (daysSince <= 90) return { label: "Reciente", color: "bg-blue-100 text-blue-700" };
  return { label: "Inactivo", color: "bg-amber-100 text-amber-700" };
}

function totalValue(c: Company) {
  return c.orders.reduce((s, o) => s + o.totalAmount, 0);
}

function primaryContact(c: Company) {
  const u = c.users[0];
  if (!u) return null;
  const name = u.profile ? `${u.profile.firstName} ${u.profile.lastName}`.trim() : u.email;
  return { name: name || u.email, phone: u.profile?.phone ?? null };
}

const ETAPAS = ["Todos", "compradora", "vendedora", "fabricante", "distribuidora"];

export default function LeadsPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [etapa, setEtapa] = useState("Todos");

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({
      limit: "30",
      ...(search && { q: search }),
    });
    fetch(`/api/crm/leads?${params}`)
      .then(r => r.json())
      .then(d => {
        setCompanies(d.data ?? []);
        setTotal(d.total ?? 0);
      })
      .finally(() => setLoading(false));
  }, [search]);

  useEffect(() => { load(); }, [load]);

  const filtered = etapa === "Todos"
    ? companies
    : companies.filter(c => c.type === etapa);

  const valorTotal = companies.reduce((s, c) => s + totalValue(c), 0);
  const verificadas = companies.filter(c => c.verified).length;
  const conOrdenes = companies.filter(c => c.orders.length > 0).length;

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-md font-bold flex items-center gap-2">
            <AlertCircle size={22} /> Empresas / Leads
          </h1>
          {!loading && (
            <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">
              {total} empresas registradas
            </p>
          )}
        </div>
        <button className="flex items-center gap-2 text-sm bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg hover:opacity-90">
          <Plus size={15} /> Nueva empresa
        </button>
      </div>

      {/* Búsqueda + filtro tipo */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form
          className="flex-1 relative"
          onSubmit={e => { e.preventDefault(); setSearch(searchInput); }}
        >
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]" />
          <input
            type="text"
            placeholder="Buscar por empresa..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-20"
          />
        </form>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {ETAPAS.map(e => (
            <button
              key={e}
              onClick={() => setEtapa(e)}
              className={`text-xs px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
                etapa === e
                  ? "bg-[var(--color-primary)] text-white"
                  : "border border-[var(--color-border-subtle)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)]"
              }`}
            >
              {e === "Todos" ? "Todos" : (TYPE_LABEL[e] ?? e)}
            </button>
          ))}
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total empresas",    valor: total,                    sub: "en plataforma" },
          { label: "Con órdenes",       valor: conOrdenes,               sub: "han comprado" },
          { label: "Verificadas",       valor: verificadas,              sub: "empresas validadas" },
          { label: "Valor total",       valor: `$${valorTotal.toLocaleString("es-CO")}`, sub: "en órdenes recientes" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-4">
            <p className="text-xl font-bold">{loading ? "—" : s.valor}</p>
            <p className="text-xs font-medium text-[var(--color-on-surface)] mt-0.5">{s.label}</p>
            <p className="text-[10px] text-[var(--color-on-surface-variant)] mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Lista */}
      {loading ? (
        <div className="py-16 text-center text-[var(--color-on-surface-variant)]">
          <Building2 size={32} className="mx-auto mb-2 opacity-30 animate-pulse" />
          <p className="text-sm">Cargando empresas...</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(c => {
            const contact = primaryContact(c);
            const status = companyStatus(c);
            const val = totalValue(c);
            const typeCls = TYPE_COLOR[c.type] ?? "bg-gray-100 text-gray-600";
            return (
              <Link
                key={c.id}
                href={`/crm/clientes/${c.id}/historial`}
                className="flex items-start gap-4 bg-white rounded-xl border border-[var(--color-border-subtle)] p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="text-sm font-semibold">{c.commercialName ?? c.name}</p>
                    {c.verified && (
                      <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-medium">Verificada</span>
                    )}
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${typeCls}`}>
                      {TYPE_LABEL[c.type] ?? c.type}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[var(--color-on-surface-variant)]">
                    {contact && (
                      <span className="flex items-center gap-1"><User size={10} /> {contact.name}</span>
                    )}
                    {contact?.phone && (
                      <span className="flex items-center gap-1"><Phone size={10} /> {contact.phone}</span>
                    )}
                    <span className="flex items-center gap-1"><Calendar size={10} /> {new Date(c.createdAt).toLocaleDateString("es-CO")}</span>
                    <span>{c.city ? `${c.city}, ` : ""}{c.country}</span>
                  </div>
                  <p className="text-xs mt-1.5 flex items-center gap-3">
                    <span className="flex items-center gap-1"><Package size={10} /> {c.orders.length} órdenes</span>
                    {val > 0 && (
                      <span className="font-bold text-[var(--color-primary)]">${val.toLocaleString("es-CO")}</span>
                    )}
                    {c.credit && (
                      <span className="text-[var(--color-on-surface-variant)]">
                        Crédito: ${c.credit.limit.toLocaleString("es-CO")}
                      </span>
                    )}
                  </p>
                </div>
                <ChevronRight size={16} className="text-[var(--color-on-surface-variant)] mt-1 shrink-0" />
              </Link>
            );
          })}
          {filtered.length === 0 && (
            <div className="py-10 text-center text-sm text-[var(--color-on-surface-variant)] bg-white rounded-xl border border-[var(--color-border-subtle)]">
              No se encontraron empresas
            </div>
          )}
        </div>
      )}

      <div className="flex gap-4 text-xs">
        <Link href="/crm/oportunidades" className="text-[var(--color-primary)] hover:underline flex items-center gap-1">
          <ChevronRight size={11} /> Ver oportunidades
        </Link>
        <Link href="/crm/pipeline" className="text-[var(--color-primary)] hover:underline">Ver pipeline</Link>
        <Link href="/dashboard/crm" className="text-[var(--color-primary)] hover:underline">← Dashboard CRM</Link>
      </div>
    </div>
  );
}
