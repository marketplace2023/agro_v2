"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search, Filter, ShieldCheck, Clock, XCircle,
  AlertTriangle, Lock, ChevronRight, Download,
} from "lucide-react";

type RegStatus = "aprobado" | "pendiente" | "rechazado" | "vencido" | "bloqueado";

interface RegProduct {
  id: string;
  productId: string;
  productName: string;
  category: string;
  brand: string;
  countries: { country: string; status: RegStatus; expiresAt: string }[];
  docCount: number;
  missingDocs: string[];
  lastUpdate: string;
}

const STATUS_CONFIG: Record<RegStatus, { label: string; color: string; bg: string; Icon: React.ElementType }> = {
  aprobado:  { label: "Aprobado",  color: "text-green-700",  bg: "bg-green-50 border-green-200",   Icon: ShieldCheck },
  pendiente: { label: "Pendiente", color: "text-amber-700",  bg: "bg-amber-50 border-amber-200",   Icon: Clock },
  rechazado: { label: "Rechazado", color: "text-red-700",    bg: "bg-red-50 border-red-200",       Icon: XCircle },
  vencido:   { label: "Vencido",   color: "text-orange-700", bg: "bg-orange-50 border-orange-200", Icon: AlertTriangle },
  bloqueado: { label: "Bloqueado", color: "text-slate-700",  bg: "bg-slate-100 border-slate-300",  Icon: Lock },
};

const MOCK: RegProduct[] = [
  {
    id: "rp1", productId: "p1",
    productName: "Glifosato 480 SL Herbicida No Selectivo",
    category: "Herbicidas", brand: "AgroQuim",
    countries: [
      { country: "CO", status: "aprobado",  expiresAt: "2025-09-15" },
      { country: "MX", status: "pendiente", expiresAt: "" },
      { country: "PE", status: "rechazado", expiresAt: "" },
    ],
    docCount: 5, missingDocs: [], lastUpdate: "2024-12-01",
  },
  {
    id: "rp2", productId: "p2",
    productName: "Trichoderma Harzianum Biocontrol",
    category: "Biológicos", brand: "BioSolutions",
    countries: [
      { country: "CO", status: "aprobado", expiresAt: "2025-03-20" },
      { country: "EC", status: "vencido",  expiresAt: "2024-11-30" },
    ],
    docCount: 3, missingDocs: ["sds", "etiqueta"], lastUpdate: "2024-11-15",
  },
  {
    id: "rp3", productId: "p3",
    productName: "Mancozeb 80% WP Fungicida Preventivo",
    category: "Fungicidas", brand: "CropProtect",
    countries: [
      { country: "CO", status: "pendiente", expiresAt: "" },
      { country: "VE", status: "pendiente", expiresAt: "" },
    ],
    docCount: 2, missingDocs: ["registro_sanitario", "certificado_calidad", "ficha_tecnica"], lastUpdate: "2024-11-01",
  },
  {
    id: "rp4", productId: "p4",
    productName: "Clorpirifos 480 EC Insecticida",
    category: "Insecticidas", brand: "PestControl",
    countries: [{ country: "CO", status: "bloqueado", expiresAt: "" }],
    docCount: 4, missingDocs: [], lastUpdate: "2024-10-05",
  },
  {
    id: "rp5", productId: "p5",
    productName: "Imidacloprid 350 SC Insecticida Sistémico",
    category: "Insecticidas", brand: "CropProtect",
    countries: [
      { country: "CO", status: "aprobado",  expiresAt: "2026-01-10" },
      { country: "MX", status: "aprobado",  expiresAt: "2026-03-22" },
      { country: "BR", status: "pendiente", expiresAt: "" },
    ],
    docCount: 6, missingDocs: [], lastUpdate: "2025-01-20",
  },
  {
    id: "rp6", productId: "p6",
    productName: "Abamectina 1.8 EC Acaricida-Insecticida",
    category: "Insecticidas", brand: "PestControl",
    countries: [
      { country: "CO", status: "aprobado",  expiresAt: "2025-07-08" },
      { country: "EC", status: "pendiente", expiresAt: "" },
    ],
    docCount: 3, missingDocs: ["certificado_origen"], lastUpdate: "2024-12-20",
  },
  {
    id: "rp7", productId: "p7",
    productName: "Azoxistrobina + Ciproconazol Fungicida",
    category: "Fungicidas", brand: "AgroQuim",
    countries: [
      { country: "CO", status: "vencido",   expiresAt: "2024-10-15" },
      { country: "MX", status: "pendiente", expiresAt: "" },
    ],
    docCount: 4, missingDocs: [], lastUpdate: "2024-08-30",
  },
  {
    id: "rp8", productId: "p8",
    productName: "Beauveria bassiana WP Entomopatógeno",
    category: "Biológicos", brand: "BioSolutions",
    countries: [{ country: "CO", status: "pendiente", expiresAt: "" }],
    docCount: 1, missingDocs: ["sds", "registro_sanitario", "etiqueta", "ficha_tecnica"], lastUpdate: "2024-11-25",
  },
];

const CATEGORIES = ["Todos", "Herbicidas", "Biológicos", "Fungicidas", "Insecticidas", "Fertilizantes"];
const COUNTRIES_LIST = ["Todos", "CO", "MX", "BR", "EC", "PE", "VE"];

function getWorstStatus(countries: RegProduct["countries"]): RegStatus {
  const priority: RegStatus[] = ["bloqueado", "rechazado", "vencido", "pendiente", "aprobado"];
  for (const s of priority) {
    if (countries.some(c => c.status === s)) return s;
  }
  return "pendiente";
}

export default function RegulatorioPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<RegStatus | "todos">("todos");
  const [countryFilter, setCountryFilter] = useState("Todos");
  const [categoryFilter, setCategoryFilter] = useState("Todos");
  const [expiryFilter, setExpiryFilter] = useState<"todo" | "30d" | "90d" | "vencido">("todo");

  const filtered = useMemo(() => {
    const now = new Date();
    const d30 = new Date(now); d30.setDate(d30.getDate() + 30);
    const d90 = new Date(now); d90.setDate(d90.getDate() + 90);

    return MOCK.filter(p => {
      if (search && !p.productName.toLowerCase().includes(search.toLowerCase()) && !p.brand.toLowerCase().includes(search.toLowerCase())) return false;
      if (categoryFilter !== "Todos" && p.category !== categoryFilter) return false;
      if (countryFilter !== "Todos" && !p.countries.some(c => c.country === countryFilter)) return false;
      if (statusFilter !== "todos" && getWorstStatus(p.countries) !== statusFilter) return false;
      if (expiryFilter !== "todo") {
        if (expiryFilter === "vencido") return p.countries.some(c => c.status === "vencido");
        const maxDate = expiryFilter === "30d" ? d30 : d90;
        return p.countries.some(c => c.expiresAt && new Date(c.expiresAt) <= maxDate && new Date(c.expiresAt) >= now);
      }
      return true;
    });
  }, [search, statusFilter, countryFilter, categoryFilter, expiryFilter]);

  const counts = useMemo(() => {
    const recs = MOCK.flatMap(p => p.countries);
    return {
      aprobado:  recs.filter(c => c.status === "aprobado").length,
      pendiente: recs.filter(c => c.status === "pendiente").length,
      rechazado: recs.filter(c => c.status === "rechazado").length,
      vencido:   recs.filter(c => c.status === "vencido").length,
      bloqueado: recs.filter(c => c.status === "bloqueado").length,
    };
  }, []);

  const clearFilters = () => {
    setStatusFilter("todos"); setSearch(""); setCategoryFilter("Todos");
    setCountryFilter("Todos"); setExpiryFilter("todo");
  };

  const hasFilters = statusFilter !== "todos" || search || categoryFilter !== "Todos" || countryFilter !== "Todos" || expiryFilter !== "todo";

  return (
    <div className="container-max py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-headline-md font-bold">Módulo Regulatorio</h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">
            Gestión de registros sanitarios, aprobaciones y alertas de vencimiento
          </p>
        </div>
        <button className="flex items-center gap-2 border border-[var(--color-border-subtle)] rounded-lg px-4 py-2 text-xs font-medium hover:bg-[var(--color-surface-container-low)] transition-colors">
          <Download size={13} /> Exportar CSV
        </button>
      </div>

      {/* Status summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {(["aprobado", "pendiente", "rechazado", "vencido", "bloqueado"] as RegStatus[]).map(s => {
          const cfg = STATUS_CONFIG[s];
          const Icon = cfg.Icon;
          const active = statusFilter === s;
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(prev => prev === s ? "todos" : s)}
              className={`p-4 rounded-xl border text-left transition-all ${active ? cfg.bg : "bg-white border-[var(--color-border-subtle)] hover:border-[var(--color-border-strong)]"}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon size={14} className={cfg.color} />
                <span className={`text-xs font-semibold ${cfg.color}`}>{cfg.label}</span>
              </div>
              <p className={`text-2xl font-bold ${active ? cfg.color : "text-[var(--color-on-surface)]"}`}>{counts[s]}</p>
              <p className="text-[10px] text-[var(--color-on-surface-variant)]">registros por país</p>
            </button>
          );
        })}
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-4 mb-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-[200px] relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar producto o marca..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-[var(--color-border-subtle)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="text-sm border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 focus:outline-none focus:border-[var(--color-primary)] bg-white"
          >
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>

          <select
            value={countryFilter}
            onChange={e => setCountryFilter(e.target.value)}
            className="text-sm border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 focus:outline-none focus:border-[var(--color-primary)] bg-white"
          >
            {COUNTRIES_LIST.map(c => <option key={c}>{c}</option>)}
          </select>

          <select
            value={expiryFilter}
            onChange={e => setExpiryFilter(e.target.value as typeof expiryFilter)}
            className="text-sm border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 focus:outline-none focus:border-[var(--color-primary)] bg-white"
          >
            <option value="todo">Todas las fechas</option>
            <option value="30d">Vence en 30 días</option>
            <option value="90d">Vence en 90 días</option>
            <option value="vencido">Vencidos</option>
          </select>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-[var(--color-secondary)] hover:underline flex items-center gap-1"
            >
              <XCircle size={12} /> Limpiar
            </button>
          )}
        </div>
        <p className="text-xs text-[var(--color-on-surface-variant)] mt-2 flex items-center gap-1">
          <Filter size={11} /> {filtered.length} de {MOCK.length} productos
        </p>
      </div>

      {/* Products table */}
      <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[var(--color-surface-container-low)] text-xs text-[var(--color-on-surface-variant)] border-b border-[var(--color-border-subtle)]">
              <th className="text-left px-4 py-3 font-semibold">Producto / Marca</th>
              <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Categoría</th>
              <th className="text-left px-4 py-3 font-semibold">Registros por país</th>
              <th className="text-left px-4 py-3 font-semibold hidden lg:table-cell">Documentos</th>
              <th className="text-left px-4 py-3 font-semibold hidden xl:table-cell">Actualizado</th>
              <th className="text-right px-4 py-3 font-semibold">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border-subtle)]">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-12 text-[var(--color-on-surface-variant)] text-sm">
                  Sin resultados con los filtros actuales
                </td>
              </tr>
            )}
            {filtered.map(p => {
              const worst = getWorstStatus(p.countries);
              const cfg = STATUS_CONFIG[worst];
              const Icon = cfg.Icon;
              const isUrgent = worst === "pendiente" || worst === "vencido" || worst === "rechazado";
              return (
                <tr key={p.id} className="hover:bg-[var(--color-surface-container-lowest)] transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-xs leading-snug">{p.productName}</p>
                    <p className="text-[10px] text-[var(--color-on-surface-variant)] mt-0.5">{p.brand}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-xs bg-[var(--color-surface-container)] px-2 py-0.5 rounded-full">{p.category}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {p.countries.map(c => {
                        const ccfg = STATUS_CONFIG[c.status];
                        const CIcon = ccfg.Icon;
                        return (
                          <span
                            key={c.country}
                            className={`inline-flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded border ${ccfg.bg} ${ccfg.color}`}
                            title={c.expiresAt ? `Vence: ${c.expiresAt}` : ""}
                          >
                            <CIcon size={9} />{c.country}
                          </span>
                        );
                      })}
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <p className="text-xs font-medium">{p.docCount} docs</p>
                    {p.missingDocs.length > 0 && (
                      <p className="text-[10px] text-[var(--color-secondary)]">Faltan: {p.missingDocs.length}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden xl:table-cell">
                    <span className="text-xs text-[var(--color-on-surface-variant)]">
                      {new Date(p.lastUpdate).toLocaleDateString("es-CO")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/regulatorio/fur-producto/${p.productId}`}
                      className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                        isUrgent
                          ? worst === "rechazado"
                            ? "bg-[var(--color-secondary)] text-white border-[var(--color-secondary)] hover:opacity-90"
                            : worst === "vencido"
                            ? "bg-orange-600 text-white border-orange-600 hover:opacity-90"
                            : "bg-[var(--color-primary)] text-white border-[var(--color-primary)] hover:opacity-90"
                          : "border-[var(--color-border-subtle)] text-[var(--color-primary)] hover:border-[var(--color-primary)]"
                      }`}
                    >
                      <Icon size={11} />
                      {isUrgent ? "Revisar" : "Ver FUR"}
                      <ChevronRight size={11} />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
