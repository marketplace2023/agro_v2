"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search, Filter, Building2, MapPin, ShieldCheck, Clock,
  XCircle, ChevronRight, Users, Package, TrendingUp,
} from "lucide-react";

type CompanyType = "compradora" | "vendedora" | "fabricante" | "distribuidora";
type CompanyStatus = "activa" | "suspendida" | "pendiente";

interface Company {
  id: string;
  name: string;
  commercialName: string;
  nit: string;
  type: CompanyType;
  country: string;
  city: string;
  verified: boolean;
  suspended: boolean;
  usersCount: number;
  ordersCount: number;
  totalSpend: number;
  creditLimit: number;
  creditUsed: number;
  createdAt: string;
}

const TYPE_CFG: Record<CompanyType, { label: string; color: string; bg: string }> = {
  compradora:    { label: "Compradora",    color: "text-blue-700",   bg: "bg-blue-50 border-blue-200" },
  vendedora:     { label: "Vendedora",     color: "text-green-700",  bg: "bg-green-50 border-green-200" },
  fabricante:    { label: "Fabricante",    color: "text-purple-700", bg: "bg-purple-50 border-purple-200" },
  distribuidora: { label: "Distribuidora", color: "text-orange-700", bg: "bg-orange-50 border-orange-200" },
};

const MOCK: Company[] = [
  { id: "c1", name: "AgroInversiones S.A.S", commercialName: "AgroInversiones", nit: "900.112.233-5", type: "compradora", country: "CO", city: "Bogotá", verified: true, suspended: false, usersCount: 12, ordersCount: 84, totalSpend: 458000, creditLimit: 200000, creditUsed: 85000, createdAt: "2022-03-15" },
  { id: "c2", name: "Hacienda Los Robles Ltda", commercialName: "Los Robles", nit: "800.445.667-1", type: "compradora", country: "CO", city: "Cali", verified: true, suspended: false, usersCount: 4, ordersCount: 31, totalSpend: 134000, creditLimit: 80000, creditUsed: 72000, createdAt: "2022-08-20" },
  { id: "c3", name: "DistAgroMax SAS", commercialName: "DistAgroMax", nit: "900.123.456-7", type: "distribuidora", country: "CO", city: "Medellín", verified: true, suspended: false, usersCount: 8, ordersCount: 245, totalSpend: 0, creditLimit: 0, creditUsed: 0, createdAt: "2021-11-10" },
  { id: "c4", name: "FertiCampo Ecuador S.A.", commercialName: "FertiCampo EC", nit: "RUC-1791234567001", type: "compradora", country: "EC", city: "Quito", verified: false, suspended: false, usersCount: 2, ordersCount: 8, totalSpend: 42000, creditLimit: 50000, creditUsed: 0, createdAt: "2023-06-01" },
  { id: "c5", name: "Innovaciones Agrícolas MX", commercialName: "InnoAgro MX", nit: "RFC-IAM890512AB3", type: "compradora", country: "MX", city: "Guadalajara", verified: true, suspended: false, usersCount: 6, ordersCount: 52, totalSpend: 220000, creditLimit: 120000, creditUsed: 115000, createdAt: "2022-05-30" },
  { id: "c6", name: "BioSolutions Ltda", commercialName: "BioSolutions", nit: "901.234.567-8", type: "fabricante", country: "EC", city: "Guayaquil", verified: true, suspended: false, usersCount: 5, ordersCount: 0, totalSpend: 0, creditLimit: 0, creditUsed: 0, createdAt: "2021-04-15" },
  { id: "c7", name: "Agrícola San Pedro S.A.", commercialName: "San Pedro", nit: "800.888.999-2", type: "compradora", country: "CO", city: "Bucaramanga", verified: false, suspended: true, usersCount: 3, ordersCount: 15, totalSpend: 48000, creditLimit: 30000, creditUsed: 30000, createdAt: "2023-01-10" },
];

const TYPES: (CompanyType | "todos")[] = ["todos", "compradora", "vendedora", "fabricante", "distribuidora"];
const COUNTRIES = ["Todos", "CO", "MX", "EC", "BR", "PE"];
const STATUSES: ("todos" | CompanyStatus)[] = ["todos", "activa", "suspendida", "pendiente"];

function getStatus(c: Company): CompanyStatus {
  if (c.suspended) return "suspendida";
  if (!c.verified) return "pendiente";
  return "activa";
}

const STATUS_CFG: Record<CompanyStatus, { label: string; color: string; Icon: React.ElementType }> = {
  activa:     { label: "Activa",     color: "text-green-700",  Icon: ShieldCheck },
  suspendida: { label: "Suspendida", color: "text-red-700",    Icon: XCircle },
  pendiente:  { label: "Pendiente",  color: "text-amber-700",  Icon: Clock },
};

export default function EmpresasPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<CompanyType | "todos">("todos");
  const [countryFilter, setCountryFilter] = useState("Todos");
  const [statusFilter, setStatusFilter] = useState<CompanyStatus | "todos">("todos");
  const [selected, setSelected] = useState<Company | null>(null);

  const filtered = useMemo(() => MOCK.filter(c => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.nit.includes(search)) return false;
    if (typeFilter !== "todos" && c.type !== typeFilter) return false;
    if (countryFilter !== "Todos" && c.country !== countryFilter) return false;
    if (statusFilter !== "todos" && getStatus(c) !== statusFilter) return false;
    return true;
  }), [search, typeFilter, countryFilter, statusFilter]);

  const hasFilters = search || typeFilter !== "todos" || countryFilter !== "Todos" || statusFilter !== "todos";

  return (
    <div className="container-max py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-headline-md font-bold">Empresas B2B</h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">Gestión de cuentas corporativas, crédito y contratos</p>
        </div>
        <Link href="/b2b/cuenta-corporativa" className="flex items-center gap-2 bg-[var(--color-primary)] text-white text-xs font-medium px-4 py-2 rounded-lg hover:opacity-90">
          + Nueva empresa
        </Link>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total empresas", value: MOCK.length, icon: Building2, color: "text-[var(--color-primary)]" },
          { label: "Activas", value: MOCK.filter(c => !c.suspended && c.verified).length, icon: ShieldCheck, color: "text-green-700" },
          { label: "Pendientes KYC", value: MOCK.filter(c => !c.verified && !c.suspended).length, icon: Clock, color: "text-amber-700" },
          { label: "Suspendidas", value: MOCK.filter(c => c.suspended).length, icon: XCircle, color: "text-red-700" },
        ].map(k => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Icon size={14} className={k.color} />
                <span className="text-xs text-[var(--color-on-surface-variant)]">{k.label}</span>
              </div>
              <p className={`text-2xl font-bold ${k.color}`}>{k.value}</p>
            </div>
          );
        })}
      </div>

      <div className={`grid gap-6 ${selected ? "grid-cols-1 lg:grid-cols-5" : "grid-cols-1"}`}>
        {/* Table column */}
        <div className={selected ? "lg:col-span-3" : ""}>
          {/* Filters */}
          <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-4 mb-4">
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex-1 min-w-[180px] relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Nombre o NIT..."
                  className="w-full pl-8 pr-3 py-2 text-sm border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]" />
              </div>
              <select value={typeFilter} onChange={e => setTypeFilter(e.target.value as CompanyType | "todos")}
                className="text-sm border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-[var(--color-primary)]">
                {TYPES.map(t => <option key={t} value={t}>{t === "todos" ? "Todos los tipos" : TYPE_CFG[t].label}</option>)}
              </select>
              <select value={countryFilter} onChange={e => setCountryFilter(e.target.value)}
                className="text-sm border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-[var(--color-primary)]">
                {COUNTRIES.map(c => <option key={c}>{c}</option>)}
              </select>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as CompanyStatus | "todos")}
                className="text-sm border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-[var(--color-primary)]">
                {STATUSES.map(s => <option key={s} value={s}>{s === "todos" ? "Todos los estados" : STATUS_CFG[s].label}</option>)}
              </select>
              {hasFilters && <button onClick={() => { setSearch(""); setTypeFilter("todos"); setCountryFilter("Todos"); setStatusFilter("todos"); }}
                className="text-xs text-[var(--color-secondary)] hover:underline flex items-center gap-1"><XCircle size={12} />Limpiar</button>}
            </div>
            <p className="text-xs text-[var(--color-on-surface-variant)] mt-2 flex items-center gap-1">
              <Filter size={11} />{filtered.length} empresas
            </p>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--color-surface-container-low)] text-xs text-[var(--color-on-surface-variant)] border-b border-[var(--color-border-subtle)]">
                  <th className="text-left px-4 py-3 font-semibold">Empresa</th>
                  <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Tipo</th>
                  <th className="text-left px-4 py-3 font-semibold hidden lg:table-cell">País</th>
                  <th className="text-left px-4 py-3 font-semibold">Estado</th>
                  <th className="text-right px-4 py-3 font-semibold">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border-subtle)]">
                {filtered.length === 0 && (
                  <tr><td colSpan={5} className="text-center py-10 text-[var(--color-on-surface-variant)] text-sm">Sin resultados</td></tr>
                )}
                {filtered.map(c => {
                  const status = getStatus(c);
                  const scfg = STATUS_CFG[status];
                  const SIcon = scfg.Icon;
                  const tcfg = TYPE_CFG[c.type];
                  return (
                    <tr key={c.id} className={`hover:bg-[var(--color-surface-container-lowest)] transition-colors cursor-pointer ${selected?.id === c.id ? "bg-[var(--color-primary)]/5" : ""}`}
                      onClick={() => setSelected(prev => prev?.id === c.id ? null : c)}>
                      <td className="px-4 py-3">
                        <p className="font-medium text-xs">{c.commercialName}</p>
                        <p className="text-[10px] text-[var(--color-on-surface-variant)]">{c.nit}</p>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${tcfg.bg} ${tcfg.color}`}>{tcfg.label}</span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <div className="flex items-center gap-1 text-xs"><MapPin size={11} />{c.city}, {c.country}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`flex items-center gap-1 text-[10px] font-semibold ${scfg.color}`}><SIcon size={11} />{scfg.label}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <ChevronRight size={14} className="ml-auto text-[var(--color-on-surface-variant)]" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="lg:col-span-2 bg-white border border-[var(--color-border-subtle)] rounded-xl overflow-hidden h-fit sticky top-24">
            <div className="px-5 py-4 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-container-low)]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-bold">{selected.name}</p>
                  <p className="text-xs text-[var(--color-on-surface-variant)]">{selected.nit} · {selected.city}, {selected.country}</p>
                </div>
                <button onClick={() => setSelected(null)} className="text-xs text-[var(--color-on-surface-variant)] hover:text-[var(--color-secondary)] p-1">✕</button>
              </div>
              <div className="flex gap-2 mt-2">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${TYPE_CFG[selected.type].bg} ${TYPE_CFG[selected.type].color}`}>{TYPE_CFG[selected.type].label}</span>
                <span className={`text-[10px] font-semibold flex items-center gap-0.5 ${STATUS_CFG[getStatus(selected)].color}`}>
                  {(() => { const Icon = STATUS_CFG[getStatus(selected)].Icon; return <Icon size={10} />; })()}
                  {STATUS_CFG[getStatus(selected)].label}
                </span>
              </div>
            </div>

            <div className="p-5 space-y-4">
              {/* KPIs */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Usuarios", value: selected.usersCount, Icon: Users },
                  { label: "Órdenes", value: selected.ordersCount, Icon: Package },
                  { label: "Gasto total", value: `$${(selected.totalSpend / 1000).toFixed(0)}K`, Icon: TrendingUp },
                ].map(k => {
                  const KIcon = k.Icon;
                  return (
                    <div key={k.label} className="text-center bg-[var(--color-surface-container-low)] rounded-lg p-3">
                      <KIcon size={14} className="mx-auto text-[var(--color-on-surface-variant)] mb-1" />
                      <p className="text-sm font-bold">{k.value}</p>
                      <p className="text-[10px] text-[var(--color-on-surface-variant)]">{k.label}</p>
                    </div>
                  );
                })}
              </div>

              {/* Credit */}
              {selected.creditLimit > 0 && (
                <div>
                  <p className="text-xs font-semibold mb-2">Línea de crédito</p>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[var(--color-on-surface-variant)]">Usado</span>
                    <span className={selected.creditUsed / selected.creditLimit > 0.9 ? "text-red-700 font-bold" : "font-medium"}>
                      ${selected.creditUsed.toLocaleString()} / ${selected.creditLimit.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 bg-[var(--color-surface-container)] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${selected.creditUsed / selected.creditLimit > 0.9 ? "bg-red-500" : selected.creditUsed / selected.creditLimit > 0.7 ? "bg-amber-500" : "bg-[var(--color-agri-green)]"}`}
                      style={{ width: `${Math.min(100, (selected.creditUsed / selected.creditLimit) * 100)}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-[var(--color-on-surface-variant)] mt-1">
                    Disponible: ${(selected.creditLimit - selected.creditUsed).toLocaleString()}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-2 pt-2 border-t border-[var(--color-border-subtle)]">
                <Link href={`/b2b/cuenta-corporativa?company=${selected.id}`}
                  className="w-full flex items-center justify-between text-xs font-medium px-4 py-2.5 border border-[var(--color-border-subtle)] rounded-lg hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors">
                  Ver cuenta corporativa <ChevronRight size={13} />
                </Link>
                <Link href={`/b2b/credito?company=${selected.id}`}
                  className="w-full flex items-center justify-between text-xs font-medium px-4 py-2.5 border border-[var(--color-border-subtle)] rounded-lg hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors">
                  Gestionar crédito <ChevronRight size={13} />
                </Link>
                <Link href={`/b2b/contratos?company=${selected.id}`}
                  className="w-full flex items-center justify-between text-xs font-medium px-4 py-2.5 border border-[var(--color-border-subtle)] rounded-lg hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors">
                  Ver contratos <ChevronRight size={13} />
                </Link>
                {selected.suspended ? (
                  <button className="w-full text-xs font-medium px-4 py-2.5 bg-green-600 text-white rounded-lg hover:opacity-90">
                    Reactivar empresa
                  </button>
                ) : (
                  <button className="w-full text-xs font-medium px-4 py-2.5 bg-[var(--color-secondary)] text-white rounded-lg hover:opacity-90">
                    Suspender empresa
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
